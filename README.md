# Polymarket Goal Pulse

**English** | [简体中文](./README.zh-CN.md)

[Live Demo](https://wandsgyu.github.io/polymarket-odds-visualizer/) · [GitHub Repository](https://github.com/WandsgYu/polymarket-odds-visualizer)

A real-time Polymarket movement radar that runs in your browser and alerts you when market probabilities move fast.

> Goal Pulse is a monitoring tool, not a trading bot. It never places trades for you.

## Why Goal Pulse?

The most useful signal on Polymarket is often not the current probability, but what just changed.

- A market jumps several percentage points within seconds.
- A goal causes related sports markets to reprice.
- Breaking news starts moving a previously quiet market.
- One of many watched markets suddenly becomes active.

Manually refreshing multiple markets makes these moments easy to miss. Goal Pulse continuously watches them and brings the important changes to your attention.

## Features

- **Real-time market monitoring** through the Polymarket Market WebSocket.
- **Configurable movement detection** with custom time windows, thresholds, and cooldowns.
- **Persistent sound and visual alerts** for significant market or score changes.
- **Multi-market watchlist** for monitoring several outcomes on one screen.
- **Sports score signals** through the Polymarket Sports WebSocket.
- **Market quality filtering** based on spread.
- **Local data capture** with configurable sampling and CSV export.
- **Multilingual interface** in English, 中文, 日本語, 한국어, and Español.

## Try It Now

No installation is required:

**[Open the live Goal Pulse dashboard](https://wandsgyu.github.io/polymarket-odds-visualizer/)**

Click **Test Alert** once after opening the page so your browser can enable alert audio.

## Run Locally

The project has no package dependencies. Clone the repository and run a static server from the project directory:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173
```

## How It Works

```text
Gamma API
    ↓
Event search and market metadata
    ↓
Market WebSocket + Sports WebSocket
    ↓
Live price and score updates
    ↓
Movement detection
    ↓
Visual alert + sound alert + local log
```

## Use Cases

- Watch football, basketball, or esports markets while following a live match.
- Monitor election, macro, technology, and breaking-news markets.
- Track several markets without repeatedly switching tabs and refreshing pages.
- Export data around alerts to study how quickly markets react.

## Default Settings

| Setting | Default | Purpose |
| --- | ---: | --- |
| Movement window | `1.5s` | Time window used to measure a fast probability move |
| Movement threshold | `8pp` | Minimum percentage-point change required for an alert |
| Per-market cooldown | `20s` | Prevents repeated alerts from the same token |
| Maximum spread | `0.08` | Filters markets with an excessive spread |
| Log interval | `2s` | Sampling frequency for the local price log |

Settings and watched markets are stored in the current browser's `localStorage`.

## Data Sources

- **Gamma API** for event search, market metadata, CLOB token IDs, and initial prices.
- **Market WebSocket** for `price_change`, `best_bid_ask`, and `last_trade_price` events.
- **Sports WebSocket** for sports scores and match-state changes.

The frontend connects to these sources directly and does not require a local Python proxy.

## Current Limitations

- Real-time Market WebSocket monitoring requires a market with CLOB token IDs.
- Sports score alerts are supporting signals, not official result confirmation.
- Browser audio policies may require you to click **Test Alert** before sound can play.
- Logs are primarily stored in the current browser and are not persisted to a cloud service.
- External notifications such as Telegram, Discord, or email are not implemented yet.
- This tool does not execute trades and is not financial advice.

## Tech Stack

- Plain HTML / CSS / JavaScript
- Polymarket Gamma API
- Polymarket CLOB Market WebSocket
- Polymarket Sports WebSocket
- Browser `localStorage`
- Web Audio API

## Feedback and Contributions

Bug reports and feature ideas are welcome in [GitHub Issues](https://github.com/WandsgYu/polymarket-odds-visualizer/issues).

If Goal Pulse is useful to you, consider giving the repository a Star. It helps signal that this is worth improving.

## License

No open-source license has been selected yet. The source is publicly viewable, but default copyright rules apply until a license is added.
