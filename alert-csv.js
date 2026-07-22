var GoalPulseAlertCsv = (function () {
	"use strict";

	const COLUMNS = [
		"timestamp_utc",
		"relative_to_alert_ms",
		"phase",
		"message_type",
		"alert_event",
		"alert_market",
		"alert_outcomes",
		"asset",
		"outcome",
		"price",
		"size",
		"best_bid",
		"best_ask",
		"spread",
		"last_trade_price",
		"top_bid_size",
		"top_ask_size",
		"bid_levels",
		"ask_levels",
		"market_id",
		"market_slug",
		"event_slug",
		"score",
		"period",
		"watch_count",
		"source_timestamp_utc",
		"asset_id",
		"summary"
	];

	function finiteNumber(value) {
		const number = Number(value);
		return Number.isFinite(number) ? number : "";
	}

	function isoTime(value) {
		const number = Number(value);
		if (!Number.isFinite(number)) return "";
		const date = new Date(number);
		return Number.isNaN(date.getTime()) ? "" : `UTC ${date.toISOString().replace("T", " ").replace("Z", "")}`;
	}

	function assetLabel(value) {
		return value == null || value === "" ? "" : `token:${value}`;
	}

	function shortAsset(value) {
		const text = String(value ?? "");
		if (!text) return "";
		return text.length > 22 ? `${text.slice(0, 10)}…${text.slice(-8)}` : text;
	}

	function difference(left, right) {
		if (left === "" || right === "") return "";
		return Number((Number(right) - Number(left)).toFixed(6));
	}

	function topLevel(levels, side) {
		if (!Array.isArray(levels) || levels.length === 0) return null;
		return levels.reduce((best, level) => {
			const price = Number(level?.price);
			if (!Number.isFinite(price)) return best;
			if (!best) return { price, size: finiteNumber(level?.size) };
			const isBetter = side === "bid" ? price > best.price : price < best.price;
			return isBetter ? { price, size: finiteNumber(level?.size) } : best;
		}, null);
	}

	function messageAssetIds(data) {
		const ids = [];
		if (data?.asset_id) ids.push(String(data.asset_id));
		if (Array.isArray(data?.assets_ids)) ids.push(...data.assets_ids.map(String));
		if (Array.isArray(data?.clob_token_ids)) ids.push(...data.clob_token_ids.map(String));
		if (Array.isArray(data?.price_changes)) {
			ids.push(...data.price_changes.map((change) => change?.asset_id).filter(Boolean).map(String));
		}
		if (data?.prices && typeof data.prices === "object") ids.push(...Object.keys(data.prices));
		return ids;
	}

	function isRelevant(message, pkg) {
		const scopedAssets = new Set((pkg?.assetIds || []).map(String));
		const scopedEvent = String(pkg?.eventSlug || "");
		if (scopedAssets.size === 0 && !scopedEvent) return true;
		if (messageAssetIds(message?.data).some((id) => scopedAssets.has(id))) return true;
		const messageSlug = String(message?.data?.slug || message?.data?.event_slug || "");
		return Boolean(scopedEvent && messageSlug && (messageSlug.includes(scopedEvent) || scopedEvent.includes(messageSlug)));
	}

	function baseRow(message, pkg) {
		const data = message?.data || {};
		const alertTime = Number(pkg?.alertTime) || Number(message?.time) || Date.now();
		const messageTime = Number(message?.time) || alertTime;
		const relativeMs = messageTime - alertTime;
		const outcomes = (pkg?.outcomes || [])
			.map((item) => [item.outcome, item.direction, item.change, item.fromTo].filter(Boolean).join(" "))
			.join(" | ");
		return {
			timestamp_utc: isoTime(messageTime),
			relative_to_alert_ms: relativeMs,
			phase: relativeMs < 0 ? "before" : relativeMs > 0 ? "after" : "alert",
			message_type: message?.type || data.event_type || "unknown",
			alert_event: pkg?.eventTitle || "",
			alert_market: pkg?.marketQuestion || "",
			alert_outcomes: outcomes,
			asset: shortAsset(data.asset_id),
			outcome: "",
			price: finiteNumber(data.price),
			size: finiteNumber(data.size),
			best_bid: finiteNumber(data.best_bid),
			best_ask: finiteNumber(data.best_ask),
			spread: "",
			last_trade_price: finiteNumber(data.last_trade_price),
			top_bid_size: "",
			top_ask_size: "",
			bid_levels: Array.isArray(data.bids) ? data.bids.length : "",
			ask_levels: Array.isArray(data.asks) ? data.asks.length : "",
			market_id: data.market || data.condition_id || "",
			market_slug: data.market_slug || "",
			event_slug: data.event_slug || data.slug || "",
			score: data.score || "",
			period: data.period || data.period_name || "",
			watch_count: finiteNumber(data.watchCount),
			source_timestamp_utc: isoTime(data.timestamp),
			asset_id: assetLabel(data.asset_id),
			summary: ""
		};
	}

	function rowsForMessage(message, pkg) {
		const data = message?.data || {};
		const base = baseRow(message, pkg);

		if (base.message_type === "status_snapshot" && data.prices && typeof data.prices === "object") {
			const scopedAssets = new Set((pkg?.assetIds || []).map(String));
			const prices = Object.entries(data.prices).filter(([assetId]) => scopedAssets.size === 0 || scopedAssets.has(assetId));
			return prices.map(([assetId, price]) => ({
				...base,
				asset: shortAsset(assetId),
				asset_id: assetLabel(assetId),
				price: finiteNumber(price),
				summary: `Watch snapshot: ${data.watchCount ?? 0} watch item(s), price ${price}`
			}));
		}

		if (base.message_type === "price_change" && Array.isArray(data.price_changes)) {
			const scopedAssets = new Set((pkg?.assetIds || []).map(String));
			return data.price_changes
				.filter((change) => scopedAssets.size === 0 || scopedAssets.has(String(change?.asset_id || "")))
				.map((change) => {
					const bid = finiteNumber(change.best_bid);
					const ask = finiteNumber(change.best_ask);
					return {
						...base,
						asset: shortAsset(change.asset_id),
						asset_id: assetLabel(change.asset_id),
						price: finiteNumber(change.price),
						size: finiteNumber(change.size),
						best_bid: bid,
						best_ask: ask,
						spread: difference(bid, ask),
						summary: `Price change: ${change.price ?? "--"} (bid ${change.best_bid ?? "--"} / ask ${change.best_ask ?? "--"})`
					};
				});
		}

		if (base.message_type === "book") {
			const topBid = topLevel(data.bids, "bid");
			const topAsk = topLevel(data.asks, "ask");
			const spread = topBid && topAsk ? difference(topBid.price, topAsk.price) : "";
			return [{
				...base,
				best_bid: topBid?.price ?? "",
				best_ask: topAsk?.price ?? "",
				spread,
				top_bid_size: topBid?.size ?? "",
				top_ask_size: topAsk?.size ?? "",
				summary: `Order book: bid ${topBid?.price ?? "--"} / ask ${topAsk?.price ?? "--"}${spread === "" ? "" : ` / spread ${spread.toFixed(4)}`}`
			}];
		}

		if (base.message_type === "new_market") {
			const assetIds = Array.isArray(data.clob_token_ids) ? data.clob_token_ids : (data.assets_ids || []);
			const outcomes = Array.isArray(data.outcomes) ? data.outcomes : [];
			return (assetIds.length ? assetIds : [""]).map((assetId, index) => ({
				...base,
				alert_event: pkg?.eventTitle || data.event_message?.title || "",
				alert_market: pkg?.marketQuestion || data.question || "",
				asset: shortAsset(assetId),
				asset_id: assetLabel(assetId),
				outcome: outcomes[index] || "",
				market_slug: data.slug || "",
				event_slug: data.event_message?.slug || "",
				summary: `New market: ${data.question || data.slug || data.id || "unknown"}`
			}));
		}

		const bid = finiteNumber(data.best_bid);
		const ask = finiteNumber(data.best_ask);
		base.spread = difference(bid, ask);
		base.summary = base.message_type === "last_trade_price"
			? `Trade: ${data.price ?? "--"} × ${data.size ?? "--"}`
			: base.message_type === "best_bid_ask"
				? `Top of book: bid ${data.best_bid ?? "--"} / ask ${data.best_ask ?? "--"}`
				: base.score
					? `Score update: ${base.score}`
					: `WebSocket update: ${base.message_type}`;
		return [base];
	}

	function alertRow(pkg) {
		const outcomes = (pkg?.outcomes || [])
			.map((item) => [item.outcome, item.direction, item.change, item.fromTo].filter(Boolean).join(" "))
			.join(" | ");
		return {
			timestamp_utc: isoTime(pkg?.alertTime),
			relative_to_alert_ms: 0,
			phase: "alert",
			message_type: "ALERT",
			alert_event: pkg?.eventTitle || "",
			alert_market: pkg?.marketQuestion || "",
			alert_outcomes: outcomes,
			summary: `Alert triggered${outcomes ? `: ${outcomes}` : ""}`
		};
	}

	function csvCell(value) {
		if (value == null || value === "") return "";
		if (typeof value === "number" && Number.isFinite(value)) return String(value);
		let text = String(value);
		if (/^[=+@]/.test(text) || /^-(?!\d+(?:\.\d+)?$)/.test(text)) text = `'${text}`;
		return `"${text.replaceAll('"', '""')}"`;
	}

	function toRows(messages, pkg) {
		const relevantMessages = (messages || [])
			.filter((message) => isRelevant(message, pkg))
			.sort((a, b) => Number(a.time) - Number(b.time));
		return [alertRow(pkg), ...relevantMessages.flatMap((message) => rowsForMessage(message, pkg))];
	}

	function toCsv(messages, pkg) {
		const rows = toRows(messages, pkg);
		const lines = [COLUMNS.join(",")];
		rows.forEach((row) => lines.push(COLUMNS.map((column) => csvCell(row[column])).join(",")));
		return `\uFEFF${lines.join("\r\n")}`;
	}

	return { COLUMNS, toRows, toCsv };
})();

if (typeof globalThis !== "undefined") globalThis.GoalPulseAlertCsv = GoalPulseAlertCsv;
