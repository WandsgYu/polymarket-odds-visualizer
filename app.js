			(() => {
				const GAMMA = "https://gamma-api.polymarket.com";
				const MARKET_WS = "wss://ws-subscriptions-clob.polymarket.com/ws/market";
				const SPORTS_WS = "wss://sports-api.polymarket.com/ws";
				const LS_STATE = "goal_pulse_state_v1";
				const LS_LANG = "goal_pulse_lang";
				const LS_ACTIVITY = "goal_pulse_activity_v1";
			const MAX_BROWSER_LOG_ROWS = 12000;

			const $ = (id) => document.getElementById(id);
			const LANGUAGE_OPTIONS = [
				{ value: "en", nativeName: "English", htmlLang: "en" },
				{ value: "zh", nativeName: "中文", htmlLang: "zh-CN" },
				{ value: "ja", nativeName: "日本語", htmlLang: "ja" },
				{ value: "ko", nativeName: "한국어", htmlLang: "ko" },
				{ value: "es", nativeName: "Español", htmlLang: "es" }
			];
			const i18n = {
				en: {
					brandSubtitle: "Search events, monitor markets, and catch fast moves",
					languageLabel: "Language",
					searchTitle: "1. Search Events",
					searchPlaceholder: "Team, league, or event keyword",
					searchButton: "Search",
					searchHelp: "Search for an event, select it from the results, then choose a market to monitor.",
					headline: "Choose a market to start monitoring",
					selectedHeadline: "Selected event",
					subline: "Keep this page open to track live market and score updates. You will be alerted when a meaningful change happens.",
					actionsTitle: "Monitor Controls",
					connectButton: "Start Live Tracking",
					testButton: "Test Alert",
					settingsTitle: "Alert Settings",
					timeZoneLabel: "Clock time zone",
					jumpWindowLabel: "Move window (seconds)",
					jumpThresholdLabel: "Price move threshold (percentage points)",
					quietSecondsLabel: "Quiet period per market (seconds)",
					maxSpreadLabel: "Maximum market spread",
					logTitle: "Data Log",
					logIntervalLabel: "Sample interval (seconds)",
					pauseLogButton: "Pause Log",
					resumeLogButton: "Resume Log",
					downloadLogButton: "Download CSV",
					clearLogButton: "Clear Log",
					closeButton: "Close",
					resultsLoading: "Searching...",
					resultsEmpty: "No events found. Try a team, league, or English keyword.",
					searchFailed: "Search failed",
					searchFeed: (q, count) => `Searched "${q}" and found ${count} events`,
					volume: "Volume",
					active: "Active",
					closed: "Closed",
					eventLoading: "Loading event details...",
					eventFailed: "Event details failed to load",
					eventLoaded: "Loaded event",
					selectEventFirst: "Search for and select an event first.",
					marketsTitle: "2. Choose Market",
					marketsHelp: (spread) => `Use the maximum spread setting to keep the market list focused. Current limit: ${spread}. Click Monitor Market to add all outcomes from that market to the board.`,
					marketsEmpty: "This event has no available CLOB markets within the current spread limit.",
					spread: "Spread",
					monitorMarket: "Monitor Market",
					monitorMatch: "Add 1X2 Board",
					matchStripFound: "Detected 1X2 markets for this match",
					matchStripUnavailable: "No complete 1X2 strip detected for this event.",
					alreadyWatching: "This market is already in the watchlist",
					comboAlreadyWatching: "This 1X2 board is already in the watchlist",
					watchStarted: "Started monitoring market",
					comboWatchStarted: "Added 1X2 board",
					watchEmpty: "No watch items yet. Search for an event on the left, then click Monitor Market.",
					removeTitle: "Remove",
					watchRemoved: "Removed market",
					alertsOn: "Alerts on",
					alertsOff: "No alerts",
					alertsEnabledFeed: "Alerts enabled",
					alertsDisabledFeed: "Alerts disabled",
					marketNoSubscriptions: "Market WS no subscriptions",
					marketConnecting: "Market WS connecting",
					marketSubscribed: (count) => `Market WS subscribed to ${count}`,
					marketConnected: "Market WebSocket connected",
					marketError: "Market WS error",
					marketDisconnected: "Market WS disconnected, reconnecting",
					sportsConnecting: "Sports WS connecting",
					sportsConnected: "Sports WS connected",
					sportsConnectedFeed: "Sports WebSocket connected",
					sportsError: "Sports WS error",
					sportsDisconnected: "Sports WS disconnected, reconnecting",
					orderbookActivity: "orderbook activity",
					wsMarket: "WebSocket market",
					wsActivity: "WebSocket activity",
					lastTrade: "latest trade",
					bestBidAskActivity: "best bid/ask activity",
					window: "window",
					up: "up",
					down: "down",
					moveAlert: "Market move",
					moveFeed: "Market move",
					alertSummary: "Trigger summary",
					alertProject: "Watch item",
					alertMarket: "Triggered market",
					alertOutcome: "Outcome",
					alertWindow: "Time window",
					alertMove: "Price change",
					alertFromTo: "From -> To",
					alertSource: "Trigger source",
					alertThreshold: "Threshold",
					scoreAlert: "Score alert",
					scoreChanged: "Score changed",
					testAlert: "Test Alert",
					testAlertDetail: "Sound and overlay will continue until closed manually",
					gammaRefresh: "Gamma refresh",
					gammaReconnect: "WS reconnect refresh",
					gammaInitial: "Gamma initial prices",
					gammaManual: "Gamma manual refresh",
					gammaCalibration: "Gamma periodic calibration",
					gammaFailed: "Gamma price refresh failed",
					logRunning: (rows, seconds) => `Logging every ${seconds}s · ${rows} rows in browser`,
					logPaused: (rows) => `Logging paused · ${rows} rows in browser`,
					logSaved: (rows) => `Saved ${rows} log rows`,
					logCleared: "Data log cleared",
					logDownloadFallback: "Downloaded browser log",
					feedEmpty: "Waiting for WebSocket or search activity."
				},
				zh: {
					brandSubtitle: "搜索赛事，订阅盘口，捕捉快速变化",
					languageLabel: "语言设置",
					searchTitle: "1. 搜索事件",
					searchPlaceholder: "输入球队、联赛、事件关键词",
					searchButton: "搜索",
					searchHelp: "先搜索赛事并在结果中选择，再到盘口列表里添加监听。",
					headline: "选择一个盘口开始监听",
					selectedHeadline: "已选择事件",
					subline: "保持本页打开，系统会持续跟踪盘口和比分；出现明显变化时会提醒你。",
					actionsTitle: "监控操作",
					connectButton: "开始实时监听",
					testButton: "测试提醒",
					settingsTitle: "告警设置",
					timeZoneLabel: "时区设置",
					jumpWindowLabel: "突变统计窗口（秒）",
					jumpThresholdLabel: "窗口内价格突变阈值（百分点）",
					quietSecondsLabel: "同盘口静默秒数",
					maxSpreadLabel: "盘口最大价差",
					logTitle: "数据日志",
					logIntervalLabel: "采样间隔（秒）",
					pauseLogButton: "暂停日志",
					resumeLogButton: "继续日志",
					downloadLogButton: "下载 CSV",
					clearLogButton: "清空日志",
					closeButton: "关闭",
					resultsLoading: "搜索中...",
					resultsEmpty: "没有找到事件。换球队名、联赛名或英文关键词试试。",
					searchFailed: "搜索失败",
					searchFeed: (q, count) => `搜索 "${q}"，找到 ${count} 个事件`,
					volume: "成交量",
					active: "活跃",
					closed: "已关闭",
					eventLoading: "加载事件详情...",
					eventFailed: "事件详情加载失败",
					eventLoaded: "已载入事件",
					selectEventFirst: "先搜索并选择一个事件。",
					marketsTitle: "2. 选择盘口",
					marketsHelp: (spread) => `可在告警设置里调整最大价差筛选。当前上限：${spread}。点击“监听盘口”会把该盘口所有 outcomes 加入中间面板。`,
					marketsEmpty: "这个事件没有符合当前价差设置的可用 CLOB 盘口。",
					spread: "价差",
					monitorMarket: "监听盘口",
					monitorMatch: "添加胜平负看板",
					matchStripFound: "已识别到这个比赛的胜平负三项盘口",
					matchStripUnavailable: "这个事件暂未识别到完整胜平负三项盘口。",
					alreadyWatching: "该盘口已在监听列表中",
					comboAlreadyWatching: "该胜平负看板已在监听列表中",
					watchStarted: "开始监听盘口",
					comboWatchStarted: "已添加胜平负看板",
					watchEmpty: "还没有监听项。左侧搜索赛事，然后在具体盘口上点“监听盘口”。",
					removeTitle: "移除",
					watchRemoved: "已移除监听盘口",
					alertsOn: "报警开",
					alertsOff: "不报警",
					alertsEnabledFeed: "已开启报警",
					alertsDisabledFeed: "已关闭报警",
					marketNoSubscriptions: "Market WS 无订阅",
					marketConnecting: "Market WS 连接中",
					marketSubscribed: (count) => `Market WS 已订阅 ${count} 个`,
					marketConnected: "Market WebSocket 已连接",
					marketError: "Market WS 错误",
					marketDisconnected: "Market WS 已断开，准备重连",
					sportsConnecting: "Sports WS 连接中",
					sportsConnected: "Sports WS 已连接",
					sportsConnectedFeed: "Sports WebSocket 已连接",
					sportsError: "Sports WS 错误",
					sportsDisconnected: "Sports WS 已断开，准备重连",
					orderbookActivity: "orderbook 活动",
					wsMarket: "WebSocket 盘口",
					wsActivity: "WebSocket 活动",
					lastTrade: "最新成交",
					bestBidAskActivity: "best bid/ask 活动",
					window: "窗口",
					up: "上升",
					down: "下跌",
					moveAlert: "盘口突变",
					moveFeed: "盘口突变",
					alertSummary: "触发摘要",
					alertProject: "监控项目",
					alertMarket: "触发盘口",
					alertOutcome: "触发结果",
					alertWindow: "统计窗口",
					alertMove: "价格变化",
					alertFromTo: "从 -> 到",
					alertSource: "触发来源",
					alertThreshold: "阈值",
					scoreAlert: "进球提醒",
					scoreChanged: "比分变化",
					testAlert: "测试提醒",
					testAlertDetail: "声音和弹层会持续到手动关闭",
					gammaRefresh: "Gamma 刷新",
					gammaReconnect: "WS 重连补状态",
					gammaInitial: "Gamma 初始价格",
					gammaManual: "Gamma 手动校准",
					gammaCalibration: "Gamma 低频校准",
					gammaFailed: "Gamma 价格刷新失败",
					logRunning: (rows, seconds) => `每 ${seconds} 秒记录 · 浏览器内 ${rows} 行`,
					logPaused: (rows) => `日志已暂停 · 浏览器内 ${rows} 行`,
					logSaved: (rows) => `已写入 ${rows} 行日志`,
					logCleared: "数据日志已清空",
					logDownloadFallback: "已下载浏览器内日志",
					feedEmpty: "等待 WebSocket 或搜索动作。"
				}
			};
			i18n.ja = {
				...i18n.en,
				brandSubtitle: "試合を検索し、マーケットを監視し、急な変化を検知",
				languageLabel: "言語",
				searchTitle: "1. イベント検索",
				searchPlaceholder: "チーム、リーグ、イベントキーワード",
				searchButton: "検索",
				searchHelp: "イベントを検索して選択し、対象マーケットを監視に追加します。",
				headline: "監視するマーケットを選択",
				selectedHeadline: "選択中のイベント",
				subline: "このページを開いたままにすると、マーケットとスコアの変化を継続的に追跡し、大きな変化を通知します。",
				actionsTitle: "監視操作",
				connectButton: "リアルタイム監視を開始",
				testButton: "通知テスト",
				settingsTitle: "アラート設定",
				timeZoneLabel: "タイムゾーン",
				jumpWindowLabel: "変動判定ウィンドウ（秒）",
				jumpThresholdLabel: "価格変動しきい値（ポイント）",
				quietSecondsLabel: "同一マーケットの静音秒数",
				maxSpreadLabel: "最大スプレッド",
				logTitle: "データログ",
				logIntervalLabel: "記録間隔（秒）",
				pauseLogButton: "ログ停止",
				resumeLogButton: "ログ再開",
				downloadLogButton: "CSV ダウンロード",
				clearLogButton: "ログ削除",
				closeButton: "閉じる",
				resultsLoading: "検索中...",
				resultsEmpty: "イベントが見つかりません。別のキーワードを試してください。",
				searchFailed: "検索に失敗しました",
				eventLoading: "イベント詳細を読み込み中...",
				eventFailed: "イベント詳細の読み込みに失敗しました",
				eventLoaded: "イベントを読み込みました",
				marketsTitle: "2. マーケット選択",
				spread: "スプレッド",
				monitorMarket: "マーケットを監視",
				monitorMatch: "1X2 ボードを追加",
				matchStripFound: "この試合の 1X2 マーケットを検出",
				matchStripUnavailable: "このイベントでは完全な 1X2 マーケットを検出できません。",
				watchEmpty: "まだ監視項目がありません。左側でイベントを検索し、マーケットを追加してください。",
				removeTitle: "削除",
				watchRemoved: "マーケットを削除しました",
				alertsOn: "通知オン",
				alertsOff: "通知なし",
				up: "上昇",
				down: "下落",
				moveAlert: "マーケット変動",
				scoreAlert: "スコア通知",
				scoreChanged: "スコア変化",
				testAlert: "通知テスト",
				testAlertDetail: "音とポップアップは手動で閉じるまで続きます",
				feedEmpty: "WebSocket または検索操作を待機中。"
			};
			i18n.ko = {
				...i18n.en,
				brandSubtitle: "경기를 검색하고, 마켓을 모니터링하고, 빠른 변화를 포착",
				languageLabel: "언어",
				searchTitle: "1. 이벤트 검색",
				searchPlaceholder: "팀, 리그 또는 이벤트 키워드",
				searchButton: "검색",
				searchHelp: "이벤트를 검색해 선택한 뒤 모니터링할 마켓을 추가하세요.",
				headline: "모니터링할 마켓 선택",
				selectedHeadline: "선택한 이벤트",
				subline: "이 페이지를 열어 두면 마켓과 점수 변화를 계속 추적하고, 의미 있는 변화가 있을 때 알림을 보냅니다.",
				actionsTitle: "모니터링 작업",
				connectButton: "실시간 모니터링 시작",
				testButton: "알림 테스트",
				settingsTitle: "알림 설정",
				timeZoneLabel: "시간대 설정",
				jumpWindowLabel: "변동 감지 구간(초)",
				jumpThresholdLabel: "가격 변동 임계값(포인트)",
				quietSecondsLabel: "동일 마켓 알림 제한(초)",
				maxSpreadLabel: "최대 스프레드",
				logTitle: "데이터 로그",
				logIntervalLabel: "기록 간격(초)",
				pauseLogButton: "로그 일시정지",
				resumeLogButton: "로그 재개",
				downloadLogButton: "CSV 다운로드",
				clearLogButton: "로그 삭제",
				closeButton: "닫기",
				resultsLoading: "검색 중...",
				resultsEmpty: "이벤트를 찾을 수 없습니다. 다른 키워드를 시도하세요.",
				searchFailed: "검색 실패",
				eventLoading: "이벤트 세부정보 로딩 중...",
				eventFailed: "이벤트 세부정보 로딩 실패",
				eventLoaded: "이벤트 로드됨",
				marketsTitle: "2. 마켓 선택",
				spread: "스프레드",
				monitorMarket: "마켓 모니터링",
				monitorMatch: "1X2 보드 추가",
				matchStripFound: "이 경기의 1X2 마켓을 감지했습니다",
				matchStripUnavailable: "이 이벤트에서는 완전한 1X2 마켓을 찾지 못했습니다.",
				watchEmpty: "아직 모니터링 항목이 없습니다. 왼쪽에서 이벤트를 검색한 뒤 마켓을 추가하세요.",
				removeTitle: "삭제",
				watchRemoved: "마켓 삭제됨",
				alertsOn: "알림 켜짐",
				alertsOff: "알림 없음",
				up: "상승",
				down: "하락",
				moveAlert: "마켓 변동",
				scoreAlert: "점수 알림",
				scoreChanged: "점수 변경",
				testAlert: "알림 테스트",
				testAlertDetail: "소리와 팝업은 직접 닫을 때까지 계속됩니다",
				feedEmpty: "WebSocket 또는 검색 작업을 기다리는 중."
			};
			i18n.es = {
				...i18n.en,
				brandSubtitle: "Busca eventos, monitorea mercados y detecta cambios rápidos",
				languageLabel: "Idioma",
				searchTitle: "1. Buscar eventos",
				searchPlaceholder: "Equipo, liga o palabra clave",
				searchButton: "Buscar",
				searchHelp: "Busca un evento, selecciónalo y luego añade un mercado para monitorear.",
				headline: "Elige un mercado para monitorear",
				selectedHeadline: "Evento seleccionado",
				subline: "Mantén esta página abierta para seguir mercados y marcadores en vivo. Recibirás una alerta cuando haya un cambio importante.",
				actionsTitle: "Controles",
				connectButton: "Iniciar monitoreo en vivo",
				testButton: "Probar alerta",
				settingsTitle: "Alertas",
				timeZoneLabel: "Zona horaria",
				jumpWindowLabel: "Ventana de movimiento (segundos)",
				jumpThresholdLabel: "Umbral de movimiento (puntos)",
				quietSecondsLabel: "Silencio por mercado (segundos)",
				maxSpreadLabel: "Spread máximo",
				logTitle: "Registro de datos",
				logIntervalLabel: "Intervalo de muestra (segundos)",
				pauseLogButton: "Pausar registro",
				resumeLogButton: "Reanudar registro",
				downloadLogButton: "Descargar CSV",
				clearLogButton: "Borrar registro",
				closeButton: "Cerrar",
				resultsLoading: "Buscando...",
				resultsEmpty: "No se encontraron eventos. Prueba otra palabra clave.",
				searchFailed: "Error de búsqueda",
				eventLoading: "Cargando detalles del evento...",
				eventFailed: "No se pudieron cargar los detalles",
				eventLoaded: "Evento cargado",
				marketsTitle: "2. Elegir mercado",
				spread: "Spread",
				monitorMarket: "Monitorear mercado",
				monitorMatch: "Añadir panel 1X2",
				matchStripFound: "Mercados 1X2 detectados para este partido",
				matchStripUnavailable: "No se detectó un panel 1X2 completo para este evento.",
				watchEmpty: "Aún no hay elementos monitoreados. Busca un evento a la izquierda y añade un mercado.",
				removeTitle: "Eliminar",
				watchRemoved: "Mercado eliminado",
				alertsOn: "Alertas activas",
				alertsOff: "Sin alertas",
				up: "sube",
				down: "baja",
				moveAlert: "Movimiento de mercado",
				scoreAlert: "Alerta de marcador",
				scoreChanged: "Marcador cambiado",
				testAlert: "Probar alerta",
				testAlertDetail: "El sonido y el aviso continuarán hasta cerrarlos manualmente",
				feedEmpty: "Esperando WebSocket o búsqueda."
			};
			let currentLang = localStorage.getItem(LS_LANG) || "en";
			const t = (key, ...args) => {
				const value = (i18n[currentLang] || i18n.en)[key] ?? i18n.en[key] ?? key;
				return typeof value === "function" ? value(...args) : value;
			};
			const CLOCK_TIME_ZONES = [
				{ value: "Asia/Shanghai", label: { en: "Beijing Time", zh: "北京时间", ja: "北京時間", ko: "베이징 시간", es: "Hora de Pekín" } },
				{ value: "America/New_York", label: { en: "US Eastern Time", zh: "美东时间", ja: "米国東部時間", ko: "미국 동부 시간", es: "Hora del Este de EE. UU." } },
				{ value: "America/Los_Angeles", label: { en: "US Pacific Time", zh: "美西时间", ja: "米国太平洋時間", ko: "미국 태평양 시간", es: "Hora del Pacífico de EE. UU." } },
				{ value: "Europe/London", label: { en: "London Time", zh: "伦敦时间", ja: "ロンドン時間", ko: "런던 시간", es: "Hora de Londres" } },
				{ value: "UTC", label: { en: "UTC", zh: "UTC", ja: "UTC", ko: "UTC", es: "UTC" } }
			];

			function normalizeLanguage(value) {
				return LANGUAGE_OPTIONS.some((option) => option.value === value) ? value : "en";
			}

			function renderLanguageOptions() {
				const select = $("langSelect");
				if (!select) return;
				select.innerHTML = LANGUAGE_OPTIONS
					.map((option) => `<option value="${option.value}">${option.nativeName}</option>`)
					.join("");
				select.value = currentLang;
				const current = LANGUAGE_OPTIONS.find((option) => option.value === currentLang) || LANGUAGE_OPTIONS[0];
				const currentNode = $("currentLanguageName");
				if (currentNode) currentNode.textContent = current.nativeName;
			}

			function getClockTimeZone() {
				const value = state?.settings?.timeZone || "Asia/Shanghai";
				return CLOCK_TIME_ZONES.some((zone) => zone.value === value) ? value : "Asia/Shanghai";
			}

			function getClockTimeZoneLabel(timeZone = getClockTimeZone()) {
				const zone = CLOCK_TIME_ZONES.find((item) => item.value === timeZone) || CLOCK_TIME_ZONES[0];
				return zone.label[currentLang] || zone.label.en;
			}

			function renderTimeZoneOptions() {
				const select = $("timeZoneSelect");
				if (!select) return;
				const selected = getClockTimeZone();
				select.innerHTML = CLOCK_TIME_ZONES
					.map((zone) => `<option value="${zone.value}">${zone.label[currentLang] || zone.label.en}</option>`)
					.join("");
				select.value = selected;
			}

			function applyLanguage() {
				currentLang = normalizeLanguage(currentLang);
				const current = LANGUAGE_OPTIONS.find((option) => option.value === currentLang) || LANGUAGE_OPTIONS[0];
				document.documentElement.lang = current.htmlLang;
				renderLanguageOptions();
				document.querySelectorAll("[data-i18n]").forEach((node) => {
					node.textContent = t(node.dataset.i18n);
				});
				document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
					node.placeholder = t(node.dataset.i18nPlaceholder);
				});
				renderTimeZoneOptions();
				updateClocks();
			}
			const audioState = {
				context: null,
				timer: null,
				nodes: []
			};

				async function fetchGamma(path) {
					return fetch(`${GAMMA}${path}`, { cache: "no-store" });
				}

				const RELATED_EVENT_SUFFIXES = [
					"more-markets",
					"halftime-result",
					"second-half-result",
					"exact-score",
					"first-to-score",
					"total-corners",
					"player-props"
				];

				function marketSourceLabel(event, market) {
					if (!event || !market || !event.title) return "";
					const selectedTitle = state.selectedEvent?.title || "";
					return event.title.replace(selectedTitle, "").replace(/^ *[-:] */, "").trim();
				}

				function withMarketSource(market, event) {
					return {
						...market,
						sourceEventSlug: event.slug,
						sourceEventTitle: event.title || event.slug,
						sourceEventLabel: marketSourceLabel(event, market)
					};
				}

				async function fetchEventBySlug(slug) {
					const response = await fetchGamma(`/events/slug/${encodeURIComponent(slug)}?_=${Date.now()}`);
					if (!response.ok) throw new Error("HTTP " + response.status);
					return response.json();
				}

				async function loadRelatedSportsEvents(parentEvent) {
					if (!parentEvent?.slug) return [];
					const childSlugs = RELATED_EVENT_SUFFIXES.map((suffix) => `${parentEvent.slug}-${suffix}`);
					const settled = await Promise.all(childSlugs.map(async (slug) => {
						try {
							return await fetchEventBySlug(slug);
						} catch {
							return null;
						}
					}));
					return settled.filter((event) => event && event.slug && !event.closed);
				}

				const state = {
				results: [],
				selectedEvent: null,
				allMarkets: [],
				markets: [],
				watches: [],
				prices: {},
				scoreBySlug: {},
				feed: [],
					settings: {
						jumpThreshold: 8,
						jumpWindowSeconds: 1.5,
						quietSeconds: 20,
						maxSpread: 0.08,
						timeZone: "Asia/Shanghai",
						logIntervalSeconds: 2,
						logEnabled: false  // default paused
					},
					dataLog: [],
					dataLogTimer: null,
				lastAlertAt: {},
				pendingCoalescedAlert: {},
				alertCoalesceTimers: {},
				priceHistory: {},
				priceCalibrationTimer: null,
				marketWs: null,
				sportsWs: null,
				marketPing: null,
				reconnectMarketTimer: null,
				reconnectSportsTimer: null,
				marketNeedsResync: false,
				wsBuffer: [],
				alertPackages: [],
				capturingPostAlert: null,
				wsBufferLastActivity: 0,
				wsBufferSnapshotTimer: null
			};

			const BUFFER_WINDOW_MS = 10000;
			const MAX_ALERT_PACKAGES = 5;
			const POST_CAPTURE_MS = 10000;

			function parseMaybeJson(value, fallback = []) {
				if (Array.isArray(value)) return value;
				if (value == null || value === "") return fallback;
				try {
					const parsed = JSON.parse(value);
					return Array.isArray(parsed) ? parsed : fallback;
				} catch {
					return fallback;
				}
			}

			function pct(value) {
				const num = Number(value);
				if (!Number.isFinite(num)) return "--";
				const percent = Math.max(0, Math.min(1, num)) * 100;
				if (percent > 0 && percent < 10) return percent.toFixed(1);
				return String(Math.round(percent));
			}

			function getDisplayPercentages(currentPrices) {
				const values = currentPrices.map((value) => {
					const num = Number(value);
					return Number.isFinite(num) ? Math.max(0, Math.min(1, num)) : 0;
				});
				const total = values.reduce((sum, value) => sum + value, 0);
				if (total <= 0) return values.map(() => 0);

				const exact = values.map((value) => (value / total) * 100);
				const floors = exact.map(Math.floor);
				let remaining = 100 - floors.reduce((sum, value) => sum + value, 0);
				const order = exact
					.map((value, index) => ({ index, remainder: value - floors[index], value }))
					.sort((a, b) => b.remainder - a.remainder || b.value - a.value || a.index - b.index);
				for (let i = 0; i < remaining; i += 1) {
					floors[order[i % order.length].index] += 1;
				}
				return floors;
			}

			function formatDisplayPercent(value) {
				const num = Number(value);
				if (!Number.isFinite(num)) return "--";
				return String(Math.max(0, Math.round(num)));
			}

			function getMaxVisibleSpread() {
				const spread = Number(state.settings.maxSpread);
				return Number.isFinite(spread) ? Math.max(0, Math.min(1, spread)) : 0.08;
			}

			function getJumpWindowMs() {
				const seconds = Number(state.settings.jumpWindowSeconds);
				const clamped = Number.isFinite(seconds) ? Math.max(0.2, Math.min(10, seconds)) : 1.5;
				return Math.round(clamped * 1000);
			}

				function getJumpWindowLabel() {
					return (getJumpWindowMs() / 1000).toFixed(1).replace(/\.0$/, "");
				}

				function filterMarkets(markets) {
					const maxSpread = getMaxVisibleSpread();
					return (markets || []).filter((market) => {
						const tokenIds = parseMaybeJson(market.clobTokenIds);
						const spread = Number(market.spread);
						const spreadOk = !Number.isFinite(spread) || spread <= maxSpread;
						return market.active && !market.closed && market.enableOrderBook && tokenIds.length > 0 && spreadOk;
					});
				}

			function normalizedOutcomePrices(market) {
				const outcomes = parseMaybeJson(market.outcomes);
				const rawPrices = parseMaybeJson(market.outcomePrices).map(Number);
				const bid = Number(market.bestBid);
				const ask = Number(market.bestAsk);
				const spread = Number(market.spread);
				const hasReliableBinaryBook =
					outcomes.length === 2 &&
					Number.isFinite(bid) &&
					Number.isFinite(ask) &&
					bid > 0 &&
					ask > 0 &&
					bid < 1 &&
					ask < 1 &&
					ask >= bid &&
					(!Number.isFinite(spread) || spread <= getMaxVisibleSpread());

				if (hasReliableBinaryBook) {
					const midpoint = Math.max(0, Math.min(1, (bid + ask) / 2));
					return [midpoint, 1 - midpoint];
				}

					return rawPrices;
				}

				function getYesIndex(market) {
					return parseMaybeJson(market.outcomes).findIndex((outcome) => String(outcome).toLowerCase() === "yes");
				}

				function getMarketYesLeg(market) {
					const tokenIds = parseMaybeJson(market.clobTokenIds);
					const prices = normalizedOutcomePrices(market);
					const yesIndex = getYesIndex(market);
					if (yesIndex < 0 || !tokenIds[yesIndex]) return null;
					return {
						marketSlug: market.slug || "",
						marketQuestion: market.question || market.slug || "",
						tokenId: tokenIds[yesIndex],
						price: Number(prices[yesIndex])
					};
				}

				function detectMatchStrip() {
					const event = state.selectedEvent;
					if (!event || !event.title || !event.title.includes(" vs. ")) return null;
					const [teamA, teamB] = event.title.split(" vs. ").map((part) => part.trim()).filter(Boolean);
					if (!teamA || !teamB) return null;
					const candidates = filterMarkets(state.allMarkets);
					const winPattern = /^Will (.+) win on \d{4}-\d{2}-\d{2}\?$/i;
					const drawPattern = /^Will (.+) vs\. (.+) end in a draw\?$/i;
					const teamAWin = candidates.find((market) => winPattern.test(market.question || "") && (market.question || "").includes(teamA));
					const teamBWin = candidates.find((market) => winPattern.test(market.question || "") && (market.question || "").includes(teamB));
					const draw = candidates.find((market) => {
						const question = market.question || "";
						return drawPattern.test(question) && question.includes(teamA) && question.includes(teamB);
					});
					if (!teamAWin || !teamBWin || !draw) return null;
					const legs = [
						{ label: teamA, role: "team-a", ...getMarketYesLeg(teamAWin) },
						{ label: "Draw", role: "draw", ...getMarketYesLeg(draw) },
						{ label: teamB, role: "team-b", ...getMarketYesLeg(teamBWin) }
					];
					if (legs.some((leg) => !leg.tokenId)) return null;
					return {
						id: `match-strip:${event.slug}`,
						eventSlug: event.slug,
						eventTitle: event.title,
						marketSlug: `match-strip:${event.slug}`,
						marketQuestion: event.title,
						type: "match-strip",
						tokenIds: legs.map((leg) => leg.tokenId),
						outcomes: legs.map((leg) => leg.label),
						roles: legs.map((leg) => leg.role),
						sourceMarkets: legs.map((leg) => ({
							marketSlug: leg.marketSlug,
							marketQuestion: leg.marketQuestion,
							tokenId: leg.tokenId
						})),
						initialPrices: legs.map((leg) => Number(leg.price)),
						lastPrices: legs.map((leg) => Number(leg.price)),
						lastTradeSizeByToken: {},
						alertsEnabled: true,
						lastUpdate: null
					};
				}

			function priceFromBestBidAsk(bestBid, bestAsk, fallbackPrice = null) {
				const bid = Number(bestBid);
				const ask = Number(bestAsk);
				if (Number.isFinite(bid) && Number.isFinite(ask) && bid >= 0 && ask <= 1 && ask >= bid) {
					return (bid + ask) / 2;
				}
				const fallback = Number(fallbackPrice);
				return Number.isFinite(fallback) ? fallback : null;
			}

			function pp(value) {
				const num = Number(value);
				if (!Number.isFinite(num)) return "--";
				const sign = num > 0 ? "+" : "";
				return sign + (num * 100).toFixed(1) + " pp";
			}

			function formatPricePercent(value) {
				const num = Number(value);
				if (!Number.isFinite(num)) return "--";
				return `${(Math.max(0, Math.min(1, num)) * 100).toFixed(1)}%`;
			}

			function money(value) {
				const num = Number(value);
				if (!Number.isFinite(num)) return "--";
				return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num);
			}

			function nowTime() {
				return new Date().toLocaleTimeString("zh-CN", { hour12: false });
			}

			function formatClockTime(date, timeZone) {
				return new Intl.DateTimeFormat("en-GB", {
					timeZone,
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false
				}).format(date);
			}

			function updateClocks() {
				const now = new Date();
				const timeZone = getClockTimeZone();
				const clockLabel = $("clockLabel");
				const beijingClock = $("beijingClock");
				if (clockLabel) clockLabel.textContent = getClockTimeZoneLabel(timeZone);
				if (beijingClock) beijingClock.textContent = formatClockTime(now, timeZone);
			}

			function saveState() {
				const saved = {
					watches: state.watches,
					selectedEvent: state.selectedEvent,
					settings: state.settings
				};
				localStorage.setItem(LS_STATE, JSON.stringify(saved));
			}

			function normalizeSavedWatches(watches) {
				if (!Array.isArray(watches)) return [];
				const grouped = new Map();
				watches.forEach((watch) => {
					if (Array.isArray(watch.tokenIds)) {
						grouped.set(watch.marketSlug || watch.id || watch.tokenIds.join(":"), watch);
						return;
					}
					if (!watch.tokenId) return;
					const key = watch.marketSlug || watch.tokenId;
					const current = grouped.get(key) || {
						id: key,
						eventSlug: watch.eventSlug || "",
						eventTitle: watch.eventTitle || "",
						marketSlug: watch.marketSlug || "",
						marketQuestion: watch.marketQuestion || "",
						tokenIds: [],
						outcomes: [],
						initialPrices: [],
						lastPrices: [],
						lastTradeSizeByToken: {},
						lastUpdate: watch.lastUpdate || null
					};
					const index = Number.isInteger(watch.outcomeIndex) ? watch.outcomeIndex : current.tokenIds.length;
					current.tokenIds[index] = watch.tokenId;
					current.outcomes[index] = watch.outcome || "Outcome";
					current.initialPrices[index] = Number(watch.initialPrice);
					current.lastPrices[index] = Number(watch.lastPrice ?? watch.initialPrice);
					if (watch.lastTradeSize) current.lastTradeSizeByToken[watch.tokenId] = watch.lastTradeSize;
					grouped.set(key, current);
				});
					return Array.from(grouped.values()).map((watch) => ({
						...watch,
						id: watch.id || watch.marketSlug || watch.tokenIds.join(":"),
						type: watch.type || "market",
						alertsEnabled: watch.alertsEnabled !== false,
						tokenIds: (watch.tokenIds || []).filter(Boolean),
						outcomes: (watch.outcomes || []).filter((_, index) => watch.tokenIds?.[index]),
						roles: Array.isArray(watch.roles) ? watch.roles.filter((_, index) => watch.tokenIds?.[index]) : [],
						sourceMarkets: Array.isArray(watch.sourceMarkets) ? watch.sourceMarkets : [],
						initialPrices: (watch.initialPrices || []).filter((_, index) => watch.tokenIds?.[index]),
						lastPrices: (watch.lastPrices || []).filter((_, index) => watch.tokenIds?.[index]),
						lastTradeSizeByToken: watch.lastTradeSizeByToken || {}
					}));
				}

			function loadState() {
				try {
					const saved = JSON.parse(localStorage.getItem(LS_STATE) || "{}");
					if (Array.isArray(saved.watches)) state.watches = normalizeSavedWatches(saved.watches);
					if (saved.selectedEvent) state.selectedEvent = saved.selectedEvent;
					if (saved.settings) state.settings = { ...state.settings, ...saved.settings };
				} catch {
					// Ignore corrupt local state.
				}
				state.watches.forEach((watch) => {
					(watch.tokenIds || []).forEach((tokenId, index) => {
						const price = Number(watch.lastPrices?.[index] ?? watch.initialPrices?.[index]);
						if (Number.isFinite(price)) {
							state.prices[tokenId] = price;
							state.priceHistory[tokenId] = [{ time: Date.now(), price }];
						}
					});
				});
				$("jumpWindowSeconds").value = state.settings.jumpWindowSeconds;
					$("jumpThreshold").value = state.settings.jumpThreshold;
					$("quietSeconds").value = state.settings.quietSeconds;
					$("maxSpread").value = state.settings.maxSpread;
					state.settings.timeZone = getClockTimeZone();
					$("timeZoneSelect").value = state.settings.timeZone;
					$("logIntervalSeconds").value = state.settings.logIntervalSeconds;
					updateClocks();
					updateLogStatus();
				}

				function reconcileWatchMetadata(markets) {
					state.watches.forEach((watch) => {
						if (watch.type === "match-strip") {
							const previousTokenIds = watch.tokenIds || [];
							const previousInitialPrices = watch.initialPrices || [];
							const previousLastPrices = watch.lastPrices || [];
							const sourceMarkets = watch.sourceMarkets || [];
							const legs = sourceMarkets.map((source, index) => {
								const market = markets.find((item) => item.slug === source.marketSlug);
								if (!market) return null;
								const yesLeg = getMarketYesLeg(market);
								return {
									...source,
									marketQuestion: market.question || source.marketQuestion,
									tokenId: yesLeg?.tokenId || source.tokenId,
									price: yesLeg?.price,
									index
								};
							});
							if (legs.some((leg) => !leg || !leg.tokenId)) return;
							watch.sourceMarkets = legs.map(({ price, index, ...source }) => source);
							watch.tokenIds = legs.map((leg) => leg.tokenId);
							watch.initialPrices = legs.map((leg, index) => {
								const existingIndex = previousTokenIds.indexOf(leg.tokenId);
								return Number(previousInitialPrices[existingIndex] ?? previousInitialPrices[index] ?? leg.price);
							});
							watch.lastPrices = legs.map((leg, index) => {
								const existingIndex = previousTokenIds.indexOf(leg.tokenId);
								return Number(state.prices[leg.tokenId] ?? previousLastPrices[existingIndex] ?? previousLastPrices[index] ?? leg.price);
							});
							return;
						}
						const market = markets.find((item) => item.slug === watch.marketSlug);
						if (!market) return;
					const tokenIds = parseMaybeJson(market.clobTokenIds);
					const outcomes = parseMaybeJson(market.outcomes);
					const previousTokenIds = watch.tokenIds || [];
					const previousInitialPrices = watch.initialPrices || [];
					const previousLastPrices = watch.lastPrices || [];
					watch.tokenIds = tokenIds;
					watch.outcomes = outcomes;
					watch.marketQuestion = market.question || watch.marketQuestion;
					watch.eventSlug = market.sourceEventSlug || watch.eventSlug || state.selectedEvent?.slug || "";
					watch.eventTitle = state.selectedEvent?.title || watch.eventTitle || "";
					watch.initialPrices = tokenIds.map((tokenId, index) => {
						const existingIndex = previousTokenIds.indexOf(tokenId);
						return Number(previousInitialPrices[existingIndex] ?? previousInitialPrices[index]);
					});
					watch.lastPrices = tokenIds.map((tokenId, index) => {
						const existingIndex = previousTokenIds.indexOf(tokenId);
						return Number(state.prices[tokenId] ?? previousLastPrices[existingIndex] ?? previousLastPrices[index]);
					});
				});
			}

			function setWsStatus(kind, status, tone) {
				const dot = $(kind + "Dot");
				const label = $(kind + "Status");
				dot.className = "dot " + tone;
				label.textContent = status;
			}

			function addFeed(message) {
				state.feed.unshift({ time: nowTime(), message });
				state.feed = state.feed.slice(0, 80);
				renderFeed();
			}

			function renderFeed() {
				$("feed").innerHTML = state.feed.map((item) => `
					<div class="feed-item">
						<div class="feed-time">${escapeHtml(item.time)}</div>
						<div>${escapeHtml(item.message)}</div>
					</div>
					`).join("") || `<div class="helper">${escapeHtml(t("feedEmpty"))}</div>`;
			}

			function escapeHtml(value) {
				return String(value ?? "")
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;")
					.replaceAll('"', "&quot;")
					.replaceAll("'", "&#039;");
			}

				async function searchEvents() {
					const q = $("searchInput").value.trim();
					if (!q) return;
					$("searchBtn").disabled = true;
					$("results").innerHTML = `<div class="helper">${escapeHtml(t("resultsLoading"))}</div>`;
					try {
						const path = `/public-search?q=${encodeURIComponent(q)}&events_status=active&limit_per_type=12&search_profiles=false&optimized=true`;
						const response = await fetchGamma(path);
						if (!response.ok) throw new Error("HTTP " + response.status);
						const data = await response.json();
						state.results = (data.events || []).filter((event) => event && event.slug && !event.closed);
						renderResults();
						expandSection("results");
						setupCollapsibleSections();
						addFeed(t("searchFeed", q, state.results.length));
					} catch (error) {
						$("results").innerHTML = `<div class="helper">${escapeHtml(t("searchFailed"))}：${escapeHtml(error.message)}</div>`;
						addFeed(t("searchFailed") + "：" + error.message);
					} finally {
						$("searchBtn").disabled = false;
					}
				}

			function renderResults() {
				$("results").innerHTML = state.results.map((event, index) => `
					<button class="result-item" data-event-index="${index}">
						<div class="result-title">${escapeHtml(event.title || event.slug)}</div>
						<div class="meta">
							<span>${escapeHtml(event.slug)}</span>
								<span>${escapeHtml(t("volume"))} ${money(event.volume)}</span>
								<span>${event.closed ? escapeHtml(t("closed")) : escapeHtml(t("active"))}</span>
						</div>
					</button>
					`).join("") || `<div class="helper">${escapeHtml(t("resultsEmpty"))}</div>`;

				document.querySelectorAll("[data-event-index]").forEach((button) => {
					button.addEventListener("click", () => selectEvent(Number(button.dataset.eventIndex)));
				});
			}

				async function selectEvent(index) {
					const item = state.results[index];
					if (!item) return;
					await loadEventDetails(item.slug);
				}

				async function loadEventDetails(slug) {
						$("selectedEvent").innerHTML = `<div class="helper">${escapeHtml(t("eventLoading"))}</div>`;
					$("markets").innerHTML = "";
					try {
						const event = await fetchEventBySlug(slug);
						state.selectedEvent = {
							id: event.id,
							slug: event.slug,
							title: event.title,
							description: event.description,
							volume: event.volume,
							endDate: event.endDate
						};
						const relatedEvents = await loadRelatedSportsEvents(event);
						const eventMarkets = [event, ...relatedEvents].flatMap((sourceEvent) => {
							return (sourceEvent.markets || []).map((market) => withMarketSource(market, sourceEvent));
						});
						const seenMarketSlugs = new Set();
						state.allMarkets = eventMarkets.filter((market) => {
							const key = market.slug || market.id;
							if (!key || seenMarketSlugs.has(key)) return false;
							seenMarketSlugs.add(key);
							return true;
						});
						state.markets = filterMarkets(state.allMarkets);
						reconcileWatchMetadata(state.markets);
						saveState();
						renderSelectedEvent();
						renderMarkets();
							addFeed(`${t("eventLoaded")}：${event.title || event.slug}`);
						} catch (error) {
							$("selectedEvent").innerHTML = `<div class="helper">${escapeHtml(t("eventFailed"))}：${escapeHtml(error.message)}</div>`;
							addFeed(t("eventFailed") + "：" + error.message);
					}
				}

			function renderSelectedEvent() {
				const event = state.selectedEvent;
				if (!event) {
						$("selectedEvent").innerHTML = `<div class="helper">${escapeHtml(t("selectEventFirst"))}</div>`;
					return;
				}
				$("selectedEvent").innerHTML = `
					<div class="event-card">
						<div class="event-title">${escapeHtml(event.title || event.slug)}</div>
						<div class="meta">
							<span>${escapeHtml(event.slug)}</span>
								<span>${escapeHtml(t("volume"))} ${money(event.volume)}</span>
						</div>
						<div class="event-description">${escapeHtml(event.description || "")}</div>
					</div>
				`;
					$("headline").textContent = event.title || t("selectedHeadline");
			}

				function renderMarkets() {
					const maxSpread = getMaxVisibleSpread();
					const matchStrip = detectMatchStrip();
					$("markets").innerHTML = `
							<div class="section-title">${escapeHtml(t("marketsTitle"))}</div>
							<div class="helper">${escapeHtml(t("marketsHelp", maxSpread.toFixed(2)))}</div>
							${matchStrip ? renderMatchStripCandidate(matchStrip) : `<div class="helper">${escapeHtml(t("matchStripUnavailable"))}</div>`}
							${state.markets.map((market, marketIndex) => renderMarket(market, marketIndex)).join("") || `<div class="helper">${escapeHtml(t("marketsEmpty"))}</div>`}
					`;
					document.querySelectorAll("[data-add-match-strip]").forEach((button) => {
						button.addEventListener("click", () => addMatchStripWatch());
					});
					document.querySelectorAll("[data-add-market-watch]").forEach((button) => {
						button.addEventListener("click", () => {
							addWatch(state.markets[Number(button.dataset.addMarketWatch)]);
						});
					});
				}

				function renderMatchStripCandidate(watch) {
					const panelModel = getWatchPanelModel(watch.initialPrices);
					return `
						<div class="combo-card">
							<div class="market-header">
								<div>
									<div class="market-title">${escapeHtml(t("matchStripFound"))}</div>
									<div class="meta">
										${watch.outcomes.map((outcome, index) => `<span>${escapeHtml(outcome)} ${formatDisplayPercent(panelModel.percentages[index])}</span>`).join("")}
									</div>
								</div>
								<button class="add market-add" data-add-match-strip>${escapeHtml(t("monitorMatch"))}</button>
							</div>
							<div class="combo-preview" style="--combo-columns: ${escapeHtml(panelModel.columns)}">
								<span></span><span></span><span></span>
							</div>
						</div>
					`;
				}

				function renderMarket(market, marketIndex) {
					const outcomes = parseMaybeJson(market.outcomes);
					const tokenIds = parseMaybeJson(market.clobTokenIds);
					const prices = normalizedOutcomePrices(market);
					return `
						<div class="market-item">
							<div class="market-header">
								<div>
									<div class="market-title">${escapeHtml(market.question || market.slug)}</div>
									<div class="meta">
										${market.sourceEventLabel ? `<span>${escapeHtml(market.sourceEventLabel)}</span>` : ""}
										<span>${escapeHtml(market.slug || market.id)}</span>
											<span>${escapeHtml(t("spread"))} ${escapeHtml(market.spread ?? "--")}</span>
									</div>
								</div>
									<button class="add market-add" data-add-market-watch="${marketIndex}" ${tokenIds.length ? "" : "disabled"}>${escapeHtml(t("monitorMarket"))}</button>
							</div>
						<div class="outcomes">
							${outcomes.map((name, outcomeIndex) => `
								<div class="outcome">
									<div class="outcome-name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
									<div class="price">${pct(prices[outcomeIndex])}</div>
								</div>
							`).join("")}
						</div>
					</div>
				`;
			}

			function addWatch(market) {
				const outcomes = parseMaybeJson(market.outcomes);
				const tokenIds = parseMaybeJson(market.clobTokenIds);
				const prices = normalizedOutcomePrices(market);
				if (tokenIds.length === 0) return;
				if (state.watches.some((watch) => watch.marketSlug === market.slug)) {
						addFeed(t("alreadyWatching"));
					return;
				}
					const watch = {
						id: market.slug || tokenIds.join(":"),
						eventSlug: market.sourceEventSlug || state.selectedEvent?.slug || "",
						eventTitle: state.selectedEvent?.title || "",
						marketSlug: market.slug || "",
						marketQuestion: market.question || "",
						tokenIds,
					outcomes,
					initialPrices: tokenIds.map((_, index) => Number(prices[index])),
						lastPrices: tokenIds.map((_, index) => Number(prices[index])),
						lastTradeSizeByToken: {},
						alertsEnabled: true,
						lastUpdate: null
					};
					state.watches.push(watch);
				watch.tokenIds.forEach((tokenId, index) => {
					const price = Number(watch.lastPrices[index]);
					if (Number.isFinite(price)) {
						state.prices[tokenId] = price;
						state.priceHistory[tokenId] = [{ time: Date.now(), price }];
					}
				});
				saveState();
					renderWatches();
					startPriceCalibrationTimer();
					startDataLogTimer();
					connectMarketWs();
						addFeed(`${t("watchStarted")}：${watch.marketQuestion}`);
				}

				function addMatchStripWatch() {
					const watch = detectMatchStrip();
					if (!watch) return;
					if (state.watches.some((item) => item.id === watch.id || item.marketSlug === watch.marketSlug)) {
						addFeed(t("comboAlreadyWatching"));
						return;
					}
					state.watches.push(watch);
					watch.tokenIds.forEach((tokenId, index) => {
						const price = Number(watch.lastPrices[index]);
						if (Number.isFinite(price)) {
							state.prices[tokenId] = price;
							state.priceHistory[tokenId] = [{ time: Date.now(), price }];
						}
					});
					saveState();
					renderWatches();
					startPriceCalibrationTimer();
					startDataLogTimer();
					connectMarketWs();
					addFeed(`${t("comboWatchStarted")}：${watch.eventTitle || watch.eventSlug}`);
				}

			function renderWatches() {
				const grid = $("watchGrid");
				if (state.watches.length === 0) {
					grid.className = "watch-grid";
						grid.innerHTML = `<div class="empty">${escapeHtml(t("watchEmpty"))}</div>`;
					return;
				}
				const layoutClass = state.watches.length === 1 ? "single" : state.watches.length === 2 ? "double" : state.watches.length <= 4 ? "quad" : "";
				grid.className = ["watch-grid", layoutClass].filter(Boolean).join(" ");
					grid.innerHTML = state.watches.map((watch, index) => {
						const panelClass = (watch.tokenIds || []).length === 2 ? "two" : "";
						const currentPrices = getWatchPrices(watch);
						const panelModel = getWatchPanelModel(currentPrices);
					return `
						<article class="watch-card" id="watch-${escapeHtml(watch.id)}" data-watch-id="${escapeHtml(watch.id)}">
							<div class="watch-top">
								<div>
									<div class="watch-name">${escapeHtml(watch.eventTitle || watch.eventSlug)}</div>
									<div class="market-title">${escapeHtml(watch.marketQuestion)}</div>
								</div>
								<div class="watch-actions">
									<button class="mini-toggle ${watch.alertsEnabled === false ? "off" : ""}" data-toggle-watch-alerts="${index}">${escapeHtml(watch.alertsEnabled === false ? t("alertsOff") : t("alertsOn"))}</button>
									<button class="remove" title="${escapeHtml(t("removeTitle"))}" data-remove-watch="${index}">×</button>
								</div>
							</div>
								<div class="outcome-panels ${panelClass}" data-outcome-panels style="grid-template-columns: ${panelModel.columns}">
								${(watch.tokenIds || []).map((tokenId, outcomeIndex) => {
									const displayPercent = panelModel.percentages[outcomeIndex];
									const roleClass = watch.roles?.[outcomeIndex] || "";
									return `
											<div class="outcome-panel ${escapeHtml(roleClass)}" data-outcome-index="${outcomeIndex}" data-zero="${displayPercent <= 0 ? "true" : "false"}">
												<div>
													<div class="big-price" data-big-price>${formatDisplayPercent(displayPercent)}</div>
													<div class="outcome-label">${escapeHtml(watch.outcomes?.[outcomeIndex] || "Outcome")}</div>
												</div>
										</div>
									`;
								}).join("")}
							</div>
						</article>
					`;
				}).join("");
						document.querySelectorAll("[data-remove-watch]").forEach((button) => {
							button.addEventListener("click", () => removeWatch(Number(button.dataset.removeWatch)));
						});
						document.querySelectorAll("[data-toggle-watch-alerts]").forEach((button) => {
							button.addEventListener("click", () => toggleWatchAlerts(Number(button.dataset.toggleWatchAlerts)));
						});
					}

				function getWatchPrices(watch) {
					return (watch.tokenIds || []).map((tokenId, outcomeIndex) => {
						const value = state.prices[tokenId] ?? watch.lastPrices?.[outcomeIndex] ?? watch.initialPrices?.[outcomeIndex];
						const numeric = Number(value);
						return Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : null;
					});
				}

				function getWatchPanelModel(currentPrices) {
					if (!currentPrices.length) return { percentages: [], columns: "" };
					if (currentPrices.length === 1) {
						const current = Number(currentPrices[0]);
						const percent = Number.isFinite(current) ? Math.round(Math.max(0, Math.min(1, current)) * 100) : 0;
						return { percentages: [percent], columns: "1fr" };
					}
					const percentages = getDisplayPercentages(currentPrices);
					const hasVisible = percentages.some((value) => value > 0);
					const columns = percentages
						.map((value) => {
							const share = hasVisible ? value : 1;
							return `${share}fr`;
						})
						.join(" ");
					return { percentages, columns };
				}

				function updateWatchCard(watch) {
					const card = document.querySelector(`[data-watch-id="${CSS.escape(watch.id)}"]`);
					if (!card) return;
					const currentPrices = getWatchPrices(watch);
					const panelModel = getWatchPanelModel(currentPrices);
					const panels = card.querySelector("[data-outcome-panels]");
					if (panels) panels.style.gridTemplateColumns = panelModel.columns;
					currentPrices.forEach((current, outcomeIndex) => {
						const displayPercent = panelModel.percentages[outcomeIndex];
						const panel = card.querySelector(`[data-outcome-index="${outcomeIndex}"]`);
						if (panel) panel.dataset.zero = displayPercent <= 0 ? "true" : "false";
						const priceNode = panel?.querySelector("[data-big-price]");
						if (priceNode) priceNode.textContent = formatDisplayPercent(displayPercent);
					});
				}

				function updateWatchCards(watches = state.watches) {
					watches.forEach(updateWatchCard);
				}

				function removeWatch(index) {
					const [removed] = state.watches.splice(index, 1);
					if (removed) {
						(removed.tokenIds || []).forEach((tokenId) => {
							delete state.prices[tokenId];
						delete state.priceHistory[tokenId];
					});
						addFeed(t("watchRemoved") + "：" + removed.marketQuestion);
				}
				saveState();
				renderWatches();
					if (state.watches.length === 0) stopPriceCalibrationTimer();
					connectMarketWs();
				}

				function toggleWatchAlerts(index) {
					const watch = state.watches[index];
					if (!watch) return;
					watch.alertsEnabled = watch.alertsEnabled === false;
					saveState();
					renderWatches();
					addFeed(`${watch.alertsEnabled ? t("alertsEnabledFeed") : t("alertsDisabledFeed")}：${watch.marketQuestion || watch.eventTitle}`);
				}

				function connectMarketWs() {
					clearTimeout(state.reconnectMarketTimer);
					if (state.marketWs) {
					state.marketWs.onclose = null;
					state.marketWs.close();
					state.marketWs = null;
					}
					clearInterval(state.marketPing);
					const assets = [...new Set(state.watches.flatMap((watch) => watch.tokenIds || []))];
					if (assets.length === 0) {
							setWsStatus("market", t("marketNoSubscriptions"), "warn");
						return;
					}
					setWsStatus("market", t("marketConnecting"), "warn");
				const ws = new WebSocket(MARKET_WS);
				state.marketWs = ws;
				ws.onopen = () => {
						setWsStatus("market", t("marketSubscribed", assets.length), "ok");
					ws.send(JSON.stringify({
						assets_ids: assets,
						type: "market",
						initial_dump: true,
						level: 2,
						custom_feature_enabled: true
					}));
					state.marketPing = setInterval(() => {
						if (ws.readyState === WebSocket.OPEN) ws.send("PING");
					}, 10000);
						addFeed(t("marketConnected"));
					if (state.marketNeedsResync) {
						state.marketNeedsResync = false;
							hydratePrices(t("gammaReconnect"));
					}
				};
				ws.onmessage = (event) => handleMarketMessage(event.data);
					ws.onerror = () => setWsStatus("market", t("marketError"), "bad");
				ws.onclose = () => {
					clearInterval(state.marketPing);
						setWsStatus("market", t("marketDisconnected"), "bad");
					state.marketNeedsResync = true;
					state.reconnectMarketTimer = setTimeout(connectMarketWs, 3000);
				};
			}

			function handleMarketMessage(raw) {
				if (raw === "PONG") return;
				let payload;
				try {
					payload = JSON.parse(raw);
				} catch {
					return;
				}
					const messages = Array.isArray(payload) ? payload : [payload];
					messages.forEach((m) => recordWsMessage(m.event_type || "market_ws", m));
					const changedWatches = new Set();
					messages.forEach((message) => {
						if (message.event_type === "book") updateFromBook(message, changedWatches);
						if (message.event_type === "price_change") updateFromPriceChange(message, changedWatches);
						if (message.event_type === "last_trade_price") updateFromTrade(message, changedWatches);
						if (message.event_type === "best_bid_ask") updateFromBestBidAsk(message, changedWatches);
					});
					updateWatchCards(changedWatches);
				}

				function findWatchOutcomes(tokenId) {
					const matches = [];
					for (const watch of state.watches) {
						const outcomeIndex = (watch.tokenIds || []).indexOf(tokenId);
						if (outcomeIndex >= 0) matches.push({ watch, outcomeIndex });
					}
					return matches;
				}

					function updateFromBook(message, changedWatches) {
						findWatchOutcomes(message.asset_id).forEach(({ watch }) => {
							watch.lastUpdate = `${nowTime()} · ${t("orderbookActivity")}`;
							changedWatches?.add(watch);
						});
					}

				function updateFromPriceChange(message, changedWatches) {
					(message.price_changes || []).forEach((change) => {
						const price = priceFromBestBidAsk(change.best_bid, change.best_ask, change.price);
						findWatchOutcomes(change.asset_id).forEach(({ watch, outcomeIndex }) => {
							if (price != null) applyPrice(watch, outcomeIndex, price, t("wsMarket"));
							else watch.lastUpdate = `${nowTime()} · ${t("wsActivity")}`;
							changedWatches?.add(watch);
						});
					});
				}

				function updateFromTrade(message, changedWatches) {
					const price = Number(message.price);
					findWatchOutcomes(message.asset_id).forEach(({ watch, outcomeIndex }) => {
						watch.lastTradeSizeByToken = watch.lastTradeSizeByToken || {};
						watch.lastTradeSizeByToken[message.asset_id] = message.size;
						if (Number.isFinite(price)) applyPrice(watch, outcomeIndex, price, t("lastTrade"));
						else watch.lastUpdate = `${nowTime()} · ${t("lastTrade")}`;
						changedWatches?.add(watch);
					});
				}

				function updateFromBestBidAsk(message, changedWatches) {
					const price = priceFromBestBidAsk(message.best_bid, message.best_ask);
					findWatchOutcomes(message.asset_id).forEach(({ watch, outcomeIndex }) => {
						if (price != null) applyPrice(watch, outcomeIndex, price, "WebSocket best bid/ask");
						else watch.lastUpdate = `${nowTime()} · ${t("bestBidAskActivity")}`;
						changedWatches?.add(watch);
					});
				}

			function applyPrice(watch, outcomeIndex, price, reason, options = {}) {
				if (!Number.isFinite(price)) return;
				const tokenId = watch.tokenIds?.[outcomeIndex];
				if (!tokenId) return;
				const nextPrice = Math.max(0, Math.min(1, price));
				const trackJump = options.trackJump !== false;
				const jump = trackJump ? getWindowJump(tokenId, nextPrice) : null;
				watch.lastPrices = watch.lastPrices || [];
				watch.initialPrices = watch.initialPrices || [];
				if (!Number.isFinite(Number(watch.initialPrices[outcomeIndex]))) {
					watch.initialPrices[outcomeIndex] = nextPrice;
				}
				watch.lastPrices[outcomeIndex] = nextPrice;
				watch.lastUpdate = `${nowTime()} · ${reason}`;
				state.prices[tokenId] = nextPrice;
				if (trackJump) recordPricePoint(tokenId, nextPrice);
				const threshold = Number(state.settings.jumpThreshold) / 100;
				if (!options.silent && jump && Math.abs(jump.change) >= threshold) {
						triggerWatchAlert(watch, outcomeIndex, jump, `${reason} · ${getJumpWindowLabel()}s ${t("window")}`);
				}
			}

			function getWindowJump(tokenId, nextPrice) {
				const history = state.priceHistory[tokenId] || [];
				if (history.length === 0) return null;
				const now = Date.now();
				const windowMs = getJumpWindowMs();
				let best = null;
				history.forEach((point) => {
					if (now - point.time > windowMs) return;
					const change = nextPrice - point.price;
					if (!best || Math.abs(change) > Math.abs(best.change)) {
						best = { change, from: point.price, to: nextPrice, elapsedMs: now - point.time };
					}
				});
				return best;
			}

			function recordPricePoint(tokenId, price) {
				const now = Date.now();
				const history = state.priceHistory[tokenId] || [];
				history.push({ time: now, price });
				state.priceHistory[tokenId] = history.filter((point) => now - point.time <= getJumpWindowMs());
			}

				const COALESCE_WINDOW_MS = 250;
				const COALESCE_MAX_WAIT_MS = 500;

				function triggerWatchAlert(watch, outcomeIndex, jump, reason) {
					if (watch.alertsEnabled === false) return;
					const now = Date.now();
					const quietMs = Number(state.settings.quietSeconds) * 1000;
					const tokenId = watch.tokenIds?.[outcomeIndex];
					if (!tokenId) return;
					if (now - (state.lastAlertAt[tokenId] || 0) < quietMs) return;
					state.lastAlertAt[tokenId] = now;

					const change = Number(jump?.change);
					const direction = change > 0 ? t("up") : t("down");
					const outcome = watch.outcomes?.[outcomeIndex] || "Outcome";
					const fromTo = `${formatPricePercent(jump?.from)} -> ${formatPricePercent(jump?.to ?? (jump?.from + change))}`;

					const entry = { outcomeIndex, jump, reason, tokenId, change, direction, outcome, fromTo };

					const pending = state.pendingCoalescedAlert[watch.id];
					if (pending) {
						pending.entries.push(entry);
						pending.mergedAt = now;
						clearTimeout(state.alertCoalesceTimers[watch.id]);
						const elapsed = now - pending.firstAt;
						const remaining = Math.max(COALESCE_WINDOW_MS, COALESCE_MAX_WAIT_MS - elapsed);
						state.alertCoalesceTimers[watch.id] = setTimeout(() => flushCoalescedAlert(watch.id), Math.min(remaining, COALESCE_WINDOW_MS));
						return;
					}

					state.pendingCoalescedAlert[watch.id] = {
						watch,
						entries: [entry],
						firstAt: now,
						mergedAt: now
					};
					state.alertCoalesceTimers[watch.id] = setTimeout(() => flushCoalescedAlert(watch.id), COALESCE_WINDOW_MS);
				}

				function flushCoalescedAlert(watchId) {
					clearTimeout(state.alertCoalesceTimers[watchId]);
					delete state.alertCoalesceTimers[watchId];
					const pending = state.pendingCoalescedAlert[watchId];
					delete state.pendingCoalescedAlert[watchId];
					if (!pending) return;

					const { watch, entries } = pending;

					// Update quiet period for ALL tokenIds in the watch, not just triggered ones
					const now = Date.now();
					(watch.tokenIds || []).forEach((tid) => {
						if (tid) state.lastAlertAt[tid] = Math.max(state.lastAlertAt[tid] || 0, now);
					});

					if (entries.length === 1) {
						// Single outcome — show traditional alert
						const e = entries[0];
						const sourceMarket = watch.sourceMarkets?.[e.outcomeIndex] || {};
						const projectName = watch.eventTitle || watch.eventSlug || watch.marketQuestion || watch.id;
						const marketName = sourceMarket.marketQuestion || watch.marketQuestion || watch.marketSlug || watch.id;
						const windowSeconds = Math.max(0.1, (Number(e.jump?.elapsedMs) || getJumpWindowMs()) / 1000).toFixed(1).replace(/\.0$/, "");
						const configuredWindow = getJumpWindowLabel();
						const threshold = `${Number(state.settings.jumpThreshold) || 0} pp`;
						const summary = `${e.outcome} ${e.direction} ${pp(e.change)} | ${windowSeconds}s / ${configuredWindow}s ${t("window")} | ${e.fromTo}`;
						freezeAlertPackage(watch, entries);
						showAlert(t("moveAlert"), state.alertPackages[0].id);
						addFeed(`${t("moveFeed")}：${e.outcome} ${e.direction} ${pp(e.change)}`);
					} else {
						// Multiple outcomes — show coalesced alert
						const sourceMarket0 = watch.sourceMarkets?.[entries[0].outcomeIndex] || {};
						const projectName = watch.eventTitle || watch.eventSlug || watch.marketQuestion || watch.id;
						const marketName = sourceMarket0.marketQuestion || watch.marketQuestion || watch.marketSlug || watch.id;
						const configuredWindow = getJumpWindowLabel();
						const threshold = `${Number(state.settings.jumpThreshold) || 0} pp`;

						// Build combined main text: e.g. "↑ +8.2pp  ↓ -4.1pp  ↓ -3.6pp"
						const mainParts = entries.map((e) => `${e.direction === t("up") ? "↑" : "↓"} ${pp(e.change)}`);
						const mainText = mainParts.join("  ");

						// Build summary rows — one per outcome
						const detailItems = [
							{ label: t("alertProject"), value: projectName, wide: true },
							{ label: t("alertMarket"), value: marketName, wide: true },
						];
						entries.forEach((e) => {
							const windowSeconds = Math.max(0.1, (Number(e.jump?.elapsedMs) || getJumpWindowMs()) / 1000).toFixed(1).replace(/\.0$/, "");
							const summary = `${e.outcome} ${e.direction} ${pp(e.change)} | ${windowSeconds}s / ${configuredWindow}s ${t("window")} | ${e.fromTo}`;
							detailItems.push({
								label: e.outcome,
								value: `${e.direction} ${pp(e.change)} · ${e.fromTo}`,
								wide: true
							});
						});
						detailItems.push(
							{ label: t("alertWindow"), value: `${configuredWindow}s ${t("window")}` },
							{ label: t("alertSource"), value: entries[0].reason },
							{ label: t("alertThreshold"), value: threshold }
						);

						const summaryText = entries.map((e) => `${e.outcome} ${e.direction} ${pp(e.change)}`).join(" · ");
						freezeAlertPackage(watch, entries);
						showAlert(`${t("moveAlert")} (×${entries.length})`, state.alertPackages[0].id);
						addFeed(`${t("moveFeed")}：${summaryText}`);
					}
					renderReplayPanel();
					flashWatch(watch);
				}

			function flashWatch(watch) {
				const card = document.getElementById("watch-" + watch.id);
				if (!card) return;
				card.classList.remove("flash");
				void card.offsetWidth;
				card.classList.add("flash");
			}

			function connectSportsWs() {
				clearTimeout(state.reconnectSportsTimer);
				if (state.sportsWs) {
					state.sportsWs.onclose = null;
					state.sportsWs.close();
					state.sportsWs = null;
				}
					setWsStatus("sports", t("sportsConnecting"), "warn");
				const ws = new WebSocket(SPORTS_WS);
				state.sportsWs = ws;
				ws.onopen = () => {
						setWsStatus("sports", t("sportsConnected"), "ok");
						addFeed(t("sportsConnectedFeed"));
				};
				ws.onmessage = (event) => {
					if (event.data === "ping") {
						ws.send("pong");
						return;
					}
					handleSportsMessage(event.data);
				};
					ws.onerror = () => setWsStatus("sports", t("sportsError"), "bad");
				ws.onclose = () => {
						setWsStatus("sports", t("sportsDisconnected"), "bad");
					state.reconnectSportsTimer = setTimeout(connectSportsWs, 3000);
				};
			}

				function handleSportsMessage(raw) {
				let message;
				try {
					message = JSON.parse(raw);
				} catch {
					return;
				}
				if (!message.slug) return;
				recordWsMessage("sports", message);
				const previous = state.scoreBySlug[message.slug];
				state.scoreBySlug[message.slug] = message;
				const filters = [
					state.selectedEvent?.slug,
					...state.watches.map((watch) => watch.eventSlug)
				].filter(Boolean);
					const matchesFilter = filters.length === 0 || filters.some((filter) => message.slug.includes(filter) || filter.includes(message.slug));
					if (matchesFilter && eventAlertsEnabledForSlug(message.slug) && previous && previous.score && message.score && previous.score !== message.score) {
							freezeAlertPackage(null, [{outcome: message.slug, direction: message.score, change: "", fromTo: `${previous.score || "?"} → ${message.score}`}]);
						showAlert(t("scoreAlert"), state.alertPackages[0].id);
							addFeed(`${t("scoreChanged")}：${message.slug} ${previous.score} -> ${message.score}`);
					}
				}

				function recordWsMessage(type, data) {
				const entry = { time: Date.now(), type, data };
				state.wsBuffer.push(entry);
				const cutoff = Date.now() - BUFFER_WINDOW_MS;
				while (state.wsBuffer.length && state.wsBuffer[0].time < cutoff) {
					state.wsBuffer.shift();
				}
				if (type !== "ping_pong") {
					state.wsBufferLastActivity = Date.now();
				}
				// If post-alert capture is active, append to the package
				if (state.capturingPostAlert) {
					const pkg = state.alertPackages.find((p) => p.id === state.capturingPostAlert.pkgId);
					if (pkg && !pkg.postComplete) {
						pkg.postContext.push({ ...entry });
						if (Date.now() - state.capturingPostAlert.startedAt >= POST_CAPTURE_MS) {
							pkg.postComplete = true;
							state.capturingPostAlert = null;
						}
					}
				}
			}

			function ensureBufferSnapshotTimer() {
				clearInterval(state.wsBufferSnapshotTimer);
				state.wsBufferSnapshotTimer = setInterval(() => {
					const idle = Date.now() - state.wsBufferLastActivity;
					if (idle >= 2000 && state.wsBuffer.length > 0) {
						recordWsMessage("status_snapshot", {
							watchCount: state.watches.length,
							prices: { ...state.prices }
						});
					}
				}, 2000);
			}

			function freezeAlertPackage(watch, entries) {
				const now = Date.now();
				const preSnapshot = state.wsBuffer.map((e) => ({ ...e }));
				const watchId = watch ? watch.id : (entries[0]?.outcome || "score");
				const pkg = {
					id: `alert-${now}-${watchId}`,
					alertTime: now,
					watchId: watchId,
					eventTitle: watch ? (watch.eventTitle || watch.eventSlug || "") : (entries[0]?.outcome || ""),
					marketQuestion: watch ? (watch.marketQuestion || "") : "",
					outcomes: entries.map((e) => ({
						outcome: e.outcome,
						direction: e.direction,
						change: pp(e.change),
						fromTo: e.fromTo
					})),
					preContext: preSnapshot,
					postContext: [],
					postComplete: false
				};
				state.alertPackages.unshift(pkg);
				if (state.alertPackages.length > MAX_ALERT_PACKAGES) state.alertPackages.pop();
				state.capturingPostAlert = { pkgId: pkg.id, startedAt: now };
				// Persist summary to localStorage
				try {
					const summaries = state.alertPackages.map((p) => ({
						id: p.id,
						alertTime: p.alertTime,
						watchId: p.watchId,
						eventTitle: p.eventTitle,
						marketQuestion: p.marketQuestion,
						outcomes: p.outcomes,
						postComplete: p.postComplete
					}));
					localStorage.setItem("goal_pulse_alert_packages", JSON.stringify(summaries));
				} catch { /* ignore */ }
			}

			function eventAlertsEnabledForSlug(slug) {
					const matchedWatches = state.watches.filter((watch) => {
						const eventSlug = watch.eventSlug || "";
						return eventSlug && (slug.includes(eventSlug) || eventSlug.includes(slug));
					});
					if (matchedWatches.length === 0) return true;
					return matchedWatches.some((watch) => watch.alertsEnabled !== false);
				}

				function showAlert(kicker, packageId) {
					$("alertKicker").textContent = kicker;
					const btn = $("alertCsvBtn");
					btn.dataset.packageId = packageId;
					btn.textContent = "Capturing WS log data… (auto-download when ready)";
					$("alertOverlay").classList.add("show");
					startAlertSound();
					// Clear any existing hint-update timer
					const prevTimer = Number($("alertOverlay").dataset.checkTimer);
					if (prevTimer) clearInterval(prevTimer);
					// Poll until postContext capture is complete, then auto-download
					const checkComplete = setInterval(() => {
						const pkg = state.alertPackages.find((p) => p.id === packageId);
						if (!pkg) {
							clearInterval(checkComplete);
							return;
						}
						if (pkg.postComplete) {
							clearInterval(checkComplete);
							// Auto-download the complete ±10s CSV
							downloadAlertCsv(packageId);
							const total = (pkg.preContext || []).length + (pkg.postContext || []).length;
							btn.textContent = `Downloaded ✓ (${total} messages, ±10s window) — click to re-download`;
						} else {
							const total = (pkg.preContext || []).length + (pkg.postContext || []).length;
							btn.textContent = `Capturing WS log data… ${total} msgs so far`;
						}
					}, 500);
					$("alertOverlay").dataset.checkTimer = String(checkComplete);
				}

				function downloadAlertCsv(packageId) {
					const pkg = state.alertPackages.find((p) => p.id === packageId);
					if (!pkg) return;
					const messages = [...(pkg.preContext || []), ...(pkg.postContext || [])];
					const csv = wsMessagesToCsv(messages);
					const timeStr = new Date(pkg.alertTime).toISOString().replace(/[:.]/g, "-").slice(0, 19);
					downloadBlob(csv, `ws-log-alert-${timeStr}.csv`, "text/csv;charset=utf-8");
				}

				function wsMessagesToCsv(messages) {
					const fields = ["time_iso", "time_epoch_ms", "type", "data_json"];
					const esc = (value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
					return [
						fields.join(","),
						...messages.map((m) => {
							const timeIso = new Date(m.time).toISOString();
							return [
								esc(timeIso),
								esc(m.time),
								esc(m.type),
								esc(JSON.stringify(m.data))
							].join(",");
						})
					].join("\n");
				}

				function closeAlert() {
					$("alertOverlay").classList.remove("show");
					stopAlertSound();
					const timerId = Number($("alertOverlay").dataset.checkTimer);
					if (timerId) clearInterval(timerId);
					delete $("alertOverlay").dataset.checkTimer;
				}

				function startAlertSound() {
					stopAlertSound();
					void playAlertPattern();
					audioState.timer = setInterval(() => {
						void playAlertPattern();
					}, 950);
				}

				function stopAlertSound() {
					if (audioState.timer) {
						clearInterval(audioState.timer);
						audioState.timer = null;
					}
					audioState.nodes.forEach((node) => {
						try { node.stop(); } catch {}
						try { node.disconnect(); } catch {}
					});
					audioState.nodes = [];
				}

			async function playAlertPattern() {
				try {
					const AudioContext = window.AudioContext || window.webkitAudioContext;
					if (!AudioContext) throw new Error("Web Audio API is unavailable");
					const ctx = audioState.context || new AudioContext();
					audioState.context = ctx;
					if (ctx.state === "suspended") await ctx.resume();
					if (ctx.state !== "running") throw new Error(`AudioContext is ${ctx.state}`);
					const gain = ctx.createGain();
					gain.gain.setValueAtTime(0.001, ctx.currentTime);
					gain.gain.exponentialRampToValueAtTime(0.48, ctx.currentTime + 0.02);
					gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
					gain.connect(ctx.destination);
					[740, 980, 1240, 980].forEach((frequency, index) => {
						const osc = ctx.createOscillator();
						osc.frequency.value = frequency;
						osc.type = "square";
						osc.connect(gain);
						osc.start(ctx.currentTime + index * 0.1);
						osc.stop(ctx.currentTime + 0.16 + index * 0.1);
						audioState.nodes.push(osc);
					});
					setTimeout(() => {
						try { gain.disconnect(); } catch {}
						audioState.nodes = audioState.nodes.filter((node) => node.context && node.context.currentTime < 0);
					}, 900);
				} catch (error) {
					console.warn("Alert sound could not start:", error);
				}
			}

					async function hydratePrices(reason = t("gammaRefresh")) {
					if (state.watches.length === 0) return;
					const slugs = [...new Set(state.watches.map((watch) => watch.eventSlug || state.selectedEvent?.slug).filter(Boolean))];
					try {
						for (const slug of slugs) {
							const response = await fetchGamma(`/events/slug/${encodeURIComponent(slug)}?_=${Date.now()}`);
						if (!response.ok) throw new Error("HTTP " + response.status);
						const event = await response.json();
						const markets = event.markets || [];
						reconcileWatchMetadata(markets);
							state.watches
								.filter((watch) => watch.eventSlug === slug || (!watch.eventSlug && slug === state.selectedEvent?.slug))
								.forEach((watch) => {
									if (watch.type === "match-strip") {
										(watch.sourceMarkets || []).forEach((source, outcomeIndex) => {
											const market = markets.find((item) => item.slug === source.marketSlug);
											if (!market) return;
											const yesLeg = getMarketYesLeg(market);
											const price = Number(yesLeg?.price);
											if (Number.isFinite(price)) {
												applyPrice(watch, outcomeIndex, price, reason, { silent: true, trackJump: false });
											}
										});
										return;
									}
									const market = markets.find((item) => item.slug === watch.marketSlug);
									if (!market) return;
								const prices = normalizedOutcomePrices(market);
								const tokenIds = parseMaybeJson(market.clobTokenIds);
								tokenIds.forEach((tokenId, outcomeIndex) => {
									const priceIndex = tokenIds.indexOf(tokenId);
									const price = Number(prices[priceIndex]);
									if (Number.isFinite(price)) {
											applyPrice(watch, outcomeIndex, price, reason, { silent: true, trackJump: false });
									}
								});
								});
						}
							updateWatchCards();
					} catch (error) {
							addFeed(t("gammaFailed") + "：" + error.message);
					}
				}

			function startPriceCalibrationTimer() {
				if (state.priceCalibrationTimer) return;
				state.priceCalibrationTimer = setInterval(() => {
						hydratePrices(t("gammaCalibration"));
				}, 60000);
			}

				function stopPriceCalibrationTimer() {
					if (!state.priceCalibrationTimer) return;
					clearInterval(state.priceCalibrationTimer);
					state.priceCalibrationTimer = null;
				}

				function getLogIntervalSeconds() {
					const seconds = Number(state.settings.logIntervalSeconds);
					return Number.isFinite(seconds) ? Math.max(1, Math.min(60, Math.round(seconds))) : 2;
				}

				function startDataLogTimer() {
					stopDataLogTimer();
					if (!state.settings.logEnabled) {
						updateLogStatus();
						return;
					}
					state.dataLogTimer = setInterval(recordLogSnapshot, getLogIntervalSeconds() * 1000);
					recordLogSnapshot();
					updateLogStatus();
				}

				function stopDataLogTimer() {
					if (!state.dataLogTimer) return;
					clearInterval(state.dataLogTimer);
					state.dataLogTimer = null;
				}

				function recordLogSnapshot() {
					if (!state.settings.logEnabled || state.watches.length === 0) {
						updateLogStatus();
						return;
					}
					const now = new Date();
					const sampledAt = now.toISOString().replace(/\.\d{3}Z$/, "Z");
					const sampledAtEpochMs = now.getTime();
					const rows = [];
					state.watches.forEach((watch) => {
						(watch.tokenIds || []).forEach((tokenId, outcomeIndex) => {
							const value = state.prices[tokenId] ?? watch.lastPrices?.[outcomeIndex] ?? watch.initialPrices?.[outcomeIndex];
							const price = Number(value);
							const sourceMarket = watch.sourceMarkets?.[outcomeIndex] || {};
							rows.push({
								sampled_at: sampledAt,
								sampled_at_epoch_ms: sampledAtEpochMs,
								event_slug: watch.eventSlug || "",
								event_title: watch.eventTitle || "",
								watch_id: watch.id || "",
								watch_type: watch.type || "market",
								market_slug: sourceMarket.marketSlug || watch.marketSlug || "",
								market_question: sourceMarket.marketQuestion || watch.marketQuestion || "",
								outcome: watch.outcomes?.[outcomeIndex] || "Outcome",
								token_id: tokenId,
								price: Number.isFinite(price) ? price.toFixed(6) : "",
								percent: Number.isFinite(price) ? (price * 100).toFixed(3) : "",
								alerts_enabled: watch.alertsEnabled === false ? "false" : "true"
							});
						});
					});
					if (rows.length === 0) {
						updateLogStatus();
						return;
					}
					state.dataLog.push(...rows);
					if (state.dataLog.length > MAX_BROWSER_LOG_ROWS) {
						state.dataLog = state.dataLog.slice(-MAX_BROWSER_LOG_ROWS);
					}
					postLogRows(rows);
					updateLogStatus();
				}

				async function postLogRows(rows) {
					try {
						const response = await fetch("/api/log", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ rows })
						});
						if (!response.ok) throw new Error("HTTP " + response.status);
						state.lastLogServerOk = true;
					} catch {
						state.lastLogServerOk = false;
					}
				}

				function updateLogStatus() {
					const button = $("toggleLogBtn");
					if (button) button.textContent = state.settings.logEnabled ? t("pauseLogButton") : t("resumeLogButton");
					const status = $("logStatus");
					if (!status) return;
					status.textContent = state.settings.logEnabled
						? t("logRunning", state.dataLog.length, getLogIntervalSeconds())
						: t("logPaused", state.dataLog.length);
				}

				function rowsToCsv(rows) {
					const fields = [
						"sampled_at",
						"sampled_at_epoch_ms",
						"event_slug",
						"event_title",
						"watch_id",
						"watch_type",
						"market_slug",
						"market_question",
						"outcome",
						"token_id",
						"price",
						"percent",
						"alerts_enabled"
					];
					const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
					return [
						fields.join(","),
						...rows.map((row) => fields.map((field) => escapeCsv(row[field])).join(","))
					].join("\n");
				}

				function downloadBlob(text, filename, type) {
					const blob = new Blob([text], { type });
					const url = URL.createObjectURL(blob);
					const link = document.createElement("a");
					link.href = url;
					link.download = filename;
					document.body.appendChild(link);
					link.click();
					link.remove();
					URL.revokeObjectURL(url);
				}

				async function downloadLogCsv() {
					try {
						const response = await fetch("/api/log.csv", { cache: "no-store" });
						if (!response.ok) throw new Error("HTTP " + response.status);
						const text = await response.text();
						downloadBlob(text, `polymarket-odds-log-${Date.now()}.csv`, "text/csv;charset=utf-8");
					} catch {
						downloadBlob(rowsToCsv(state.dataLog), `polymarket-odds-log-browser-${Date.now()}.csv`, "text/csv;charset=utf-8");
						addFeed(t("logDownloadFallback"));
					}
				}

				async function clearDataLog() {
					state.dataLog = [];
					try {
						await fetch("/api/log", { method: "DELETE" });
					} catch {
						// Direct file usage keeps only the in-memory browser log.
					}
					updateLogStatus();
					addFeed(t("logCleared"));
				}

				function bindEvents() {
				$("searchBtn").addEventListener("click", searchEvents);
					$("searchInput").addEventListener("keydown", (event) => {
						if (event.key === "Enter") searchEvents();
					});
					$("langSelect").addEventListener("change", (event) => {
						currentLang = normalizeLanguage(event.target.value);
						localStorage.setItem(LS_LANG, currentLang);
						applyLanguage();
						renderResults();
						renderSelectedEvent();
						if (state.selectedEvent) renderMarkets();
						renderWatches();
						renderFeed();
						updateLogStatus();
					});
				$("connectBtn").addEventListener("click", () => {
					connectMarketWs();
					connectSportsWs();
				});
					$("testAlertBtn").addEventListener("click", () => {
						const now = Date.now();
						const pkg = {
							id: `alert-${now}-test`,
							alertTime: now,
							watchId: "test",
							eventTitle: "Test Alert",
							marketQuestion: "",
							outcomes: [{ outcome: "Test", direction: "↑", change: "+0.0pp", fromTo: "0 → 0" }],
							preContext: state.wsBuffer.map((e) => ({ ...e })),
							postContext: [],
							postComplete: true
						};
						state.alertPackages.unshift(pkg);
						void showAlert(t("testAlert"), pkg.id);
					});
				$("jumpWindowSeconds").addEventListener("change", (event) => {
					state.settings.jumpWindowSeconds = Math.max(0.2, Math.min(10, Number(event.target.value) || 1.5));
					event.target.value = state.settings.jumpWindowSeconds;
					saveState();
				});
				$("jumpThreshold").addEventListener("change", (event) => {
					state.settings.jumpThreshold = Math.max(1, Math.min(80, Number(event.target.value) || 8));
					event.target.value = state.settings.jumpThreshold;
					saveState();
				});
				$("quietSeconds").addEventListener("change", (event) => {
					state.settings.quietSeconds = Math.max(3, Math.min(300, Number(event.target.value) || 20));
					event.target.value = state.settings.quietSeconds;
					saveState();
				});
					$("timeZoneSelect").addEventListener("change", (event) => {
						state.settings.timeZone = CLOCK_TIME_ZONES.some((zone) => zone.value === event.target.value)
							? event.target.value
							: "Asia/Shanghai";
						event.target.value = state.settings.timeZone;
						updateClocks();
						saveState();
					});
					$("maxSpread").addEventListener("change", (event) => {
						state.settings.maxSpread = Math.max(0, Math.min(1, Number(event.target.value) || 0.08));
						event.target.value = state.settings.maxSpread;
					if (state.allMarkets.length > 0) {
						state.markets = filterMarkets(state.allMarkets);
						renderMarkets();
						}
						saveState();
					});
					$("logIntervalSeconds").addEventListener("change", (event) => {
						state.settings.logIntervalSeconds = Math.max(1, Math.min(60, Math.round(Number(event.target.value) || 2)));
						event.target.value = state.settings.logIntervalSeconds;
						saveState();
						startDataLogTimer();
					});
					$("toggleLogBtn").addEventListener("click", () => {
						state.settings.logEnabled = !state.settings.logEnabled;
						saveState();
						startDataLogTimer();
					});
					$("downloadLogBtn").addEventListener("click", downloadLogCsv);
					$("clearLogBtn").addEventListener("click", clearDataLog);
					$("alertClose").addEventListener("click", closeAlert);
					$("alertCsvBtn").addEventListener("click", () => {
						const packageId = $("alertCsvBtn").dataset.packageId;
						if (packageId) downloadAlertCsv(packageId);
					});
					$("activityToggle").addEventListener("click", toggleActivityPanel);
					$("fullscreenBtn").addEventListener("click", toggleFullscreenDashboard);
					$("fullscreenExitBtn").addEventListener("click", toggleFullscreenDashboard);
					document.addEventListener("keydown", (event) => {
						if (event.key === "Escape" && document.body.classList.contains("fullscreen-dashboard")) {
							toggleFullscreenDashboard();
						}
					});
				}

				function restoreAlertPackages() {
				try {
					const saved = JSON.parse(localStorage.getItem("goal_pulse_alert_packages") || "[]");
					if (Array.isArray(saved) && saved.length > 0) {
						state.alertPackages = saved.map((s) => ({
							...s,
							preContext: [],
							postContext: [],
							postComplete: true
						}));
					}
				} catch { /* ignore */ }
			}

			function renderReplayPanel() {
				const container = $("replayList");
				if (!container) return;
				if (state.alertPackages.length === 0) {
					container.innerHTML = `<div class="helper">No alert replays yet. Replays are captured when an alert fires.</div>`;
					return;
				}
				container.innerHTML = state.alertPackages.map((pkg) => {
					const time = new Date(pkg.alertTime).toLocaleTimeString("zh-CN", { hour12: false });
					const outcomeSummary = (pkg.outcomes || []).map((o) => `${o.outcome} ${o.direction} ${o.change}`).join(" · ");
					const msgCount = (pkg.preContext || []).length + (pkg.postContext || []).length;
					return `
						<div class="replay-item" data-replay-id="${escapeHtml(pkg.id)}">
							<div class="replay-header" data-replay-toggle="${escapeHtml(pkg.id)}">
								<div class="replay-meta">
									<span class="replay-time">${escapeHtml(time)}</span>
									<span class="replay-event">${escapeHtml(pkg.eventTitle || pkg.marketQuestion)}</span>
									${pkg.postComplete ? "" : `<span class="replay-badge live">capturing</span>`}
								</div>
								<div class="replay-summary">${escapeHtml(outcomeSummary)}</div>
								<div class="replay-count">${msgCount} WS messages · ${pkg.postComplete ? "complete" : "capturing post-alert..."}</div>
							</div>
							<div class="replay-detail" id="replay-detail-${escapeHtml(pkg.id)}" style="display:none"></div>
						</div>
					`;
				}).join("");

				container.querySelectorAll("[data-replay-toggle]").forEach((header) => {
					header.addEventListener("click", () => toggleReplayDetail(header.dataset.replayToggle));
				});
			}

			function toggleReplayDetail(pkgId) {
				const detail = document.getElementById("replay-detail-" + CSS.escape(pkgId));
				if (!detail) return;
				if (detail.style.display === "none") {
					const pkg = state.alertPackages.find((p) => p.id === pkgId);
					if (!pkg) return;
					const allMessages = [...(pkg.preContext || []), ...(pkg.postContext || [])];
					const alertTime = pkg.alertTime;
					detail.innerHTML = `
						<div class="replay-timeline">
							${allMessages.map((msg) => {
								const relMs = msg.time - alertTime;
								const relLabel = relMs < 0 ? `${relMs}ms` : `+${relMs}ms`;
								const nearAlert = Math.abs(relMs) < 500 ? " near-alert" : "";
								const typeLabel = msg.type || "unknown";
								const dataPreview = typeof msg.data === "object" ? JSON.stringify(msg.data).slice(0, 140) : String(msg.data || "").slice(0, 140);
								return `
									<div class="replay-msg${nearAlert}">
										<span class="replay-msg-time">${relLabel}</span>
										<span class="replay-msg-type">${escapeHtml(typeLabel)}</span>
										<span class="replay-msg-data">${escapeHtml(dataPreview)}</span>
									</div>
								`;
							}).join("")}
						</div>
						<div class="replay-actions">
							<button class="btn small" data-download-replay="${escapeHtml(pkgId)}">Download JSON</button>
						</div>
					`;
					detail.style.display = "block";
					detail.querySelector("[data-download-replay]")?.addEventListener("click", () => {
						downloadBlob(JSON.stringify(pkg, null, 2), `alert-replay-${pkgId}.json`, "application/json");
					});
				} else {
					detail.style.display = "none";
				}
			}

			function setupCollapsibleSections() {
			document.querySelectorAll(".section").forEach((section) => {
				const title = section.querySelector(":scope > .section-title");
				if (!title) return;
				// Wrap non-title children in .section-content
				let contentDiv = section.querySelector(":scope > .section-content");
				if (!contentDiv) {
					contentDiv = document.createElement("div");
					contentDiv.className = "section-content";
					while (title.nextSibling) {
						contentDiv.appendChild(title.nextSibling);
					}
					section.appendChild(contentDiv);
				}
				title.onclick = () => {
					section.classList.toggle("section-collapsed");
				};
			});
		}

		function collapseSection(id) {
			const el = document.getElementById(id);
			if (el) el.classList.add("section-collapsed");
		}

		function expandSection(id) {
			const el = document.getElementById(id);
			if (el) el.classList.remove("section-collapsed");
		}

		function isActivityCollapsed() {
			return document.querySelector(".workspace")?.classList.contains("activity-collapsed") ?? true;
		}

		function toggleActivityPanel() {
			const workspace = document.querySelector(".workspace");
			if (!workspace) return;
			const collapsed = workspace.classList.toggle("activity-collapsed");
			const icon = document.querySelector(".activity-toggle-icon");
			if (icon) icon.textContent = collapsed ? "▶" : "◀";
			try { localStorage.setItem(LS_ACTIVITY, JSON.stringify(collapsed)); } catch {}
		}

		function toggleFullscreenDashboard() {
			document.body.classList.toggle("fullscreen-dashboard");
		}

		function applyActivityPanelState() {
			let collapsed = true; // default collapsed
			try {
				const saved = localStorage.getItem(LS_ACTIVITY);
				if (saved !== null) collapsed = JSON.parse(saved);
			} catch {}
			const workspace = document.querySelector(".workspace");
			if (workspace && collapsed) {
				workspace.classList.add("activity-collapsed");
			}
			const icon = document.querySelector(".activity-toggle-icon");
			if (icon) icon.textContent = collapsed ? "▶" : "◀";
		}

		function init() {
					applyLanguage();
					loadState();
					bindEvents();
					updateClocks();
					setInterval(updateClocks, 1000);
				renderSelectedEvent();
				renderWatches();
				renderFeed();
				renderReplayPanel();
				setupCollapsibleSections();
				applyActivityPanelState();
				// Default-collapse config-heavy sections so the feed log gets space
				collapseSection("sectionSettings");
				collapseSection("sectionLog");
				collapseSection("sectionReplay");
				searchEvents();
				if (state.selectedEvent?.slug) loadEventDetails(state.selectedEvent.slug);
					hydratePrices(t("gammaInitial"));
					startPriceCalibrationTimer();
					startDataLogTimer();
					ensureBufferSnapshotTimer();
					restoreAlertPackages();
					connectSportsWs();
				if (state.watches.length > 0) connectMarketWs();
			}
			init();
		})();
