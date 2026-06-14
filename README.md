# Polymarket Odds Visualizer

一个面向体育比赛的 Polymarket 实时盘口看板。

它可以搜索赛事、展示可交易盘口、监听价格跳变和比分变化，适合盯足球比赛中的胜负、让球、总分、双方进球等盘口。

## 功能

- 搜索 Polymarket 赛事。
- 展示 Gamma 事件盘口和 Gateway 体育盘口。
- 支持 Moneyline、让球、总分、BTTS 等常见足球盘口。
- 监听 CLOB Market WebSocket 的实时价格事件。
- 监听 Sports WebSocket 的比分变化。
- 按短时间窗口检测价格突变并弹窗提醒。
- 支持手动价格校准和低频自动校准。

## 数据来源

- `Gamma API`
  - 搜索事件。
  - 获取事件详情、CLOB token、初始价格。
- `Gateway API`
  - 补充体育盘口，例如让球、总分、BTTS。
- `Market WebSocket`
  - 监听 CLOB token 的 `price_change`、`best_bid_ask`、`last_trade_price`。
- `Sports WebSocket`
  - 监听赛事比分和赛况变化。

注意：Gateway 体育盘口没有接入当前 CLOB Market WebSocket。它们使用初始化、手动校准和低频校准更新价格。

## 启动

```bash
python3 server.py
```

打开：

```text
http://127.0.0.1:5173
```

`server.py` 是本地只读代理，用来转发：

- `/api/gamma/...` -> `https://gamma-api.polymarket.com/...`
- `/api/gateway/...` -> `https://gateway.polymarket.us/...`

## 使用流程

1. 搜索球队、联赛或赛事关键词。
2. 选择一个赛事。
3. 在“选择盘口”里点击“监听盘口”。
4. 页面会在中间区域显示该盘口所有 outcomes。
5. CLOB 盘口会通过 Market WebSocket 实时更新。
6. Gateway 体育盘口会通过低频校准刷新。
7. 价格在设定窗口内跳变超过阈值时触发提醒。

## 告警设置

- 突变统计窗口：默认 `1.5` 秒。
- 价格突变阈值：默认 `8` 个百分点。
- 同盘口静默时间：默认 `20` 秒。
- 最大价差过滤：默认 `0.08`。

## 当前取舍

- 这是一个本地看盘和提醒工具，不负责下单。
- 不需要 Polymarket 账号或 API key。
- CLOB 盘口优先使用 WebSocket 实时更新。
- Gateway 体育盘口用于补齐官网体育页里的盘口种类。
- 比分提醒只作为辅助信号，不等同于官方裁判结果。

## 文件

- `index.html`：前端页面、状态管理、WebSocket、提醒逻辑。
- `server.py`：本地只读代理和静态文件服务。

## English

Polymarket Odds Visualizer is a local sports-odds dashboard for Polymarket.

It searches events, displays tradable markets, tracks CLOB price updates, adds Gateway sports markets such as spreads/totals/BTTS, and alerts on fast price moves or score changes.

Run:

```bash
python3 server.py
```

Open:

```text
http://127.0.0.1:5173
```

Data sources:

- Gamma API for event discovery and CLOB market metadata.
- Gateway API for sports-specific markets.
- Market WebSocket for live CLOB price events.
- Sports WebSocket for score updates.

This project is for monitoring and alerts only. It does not place trades.
