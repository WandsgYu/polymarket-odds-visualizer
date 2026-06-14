# Polymarket Goal Pulse

一个面向体育比赛的 Polymarket 实时提醒看板。它不再要求你打开 Polymarket 下注页、进 DevTools 手动找 `token_id`，而是在页面内搜索事件、选择盘口 outcome，然后用 WebSocket 监听盘口和比分变化。

## 为什么改

原版本通过 REST API 每隔几秒请求一次：

```text
https://clob.polymarket.com/price?side=SELL&token_id=...
```

这种方式可以展示价格，但不适合“进球第一时间提醒”：

- 多 outcome 时会产生多次 HTTP 请求，开销更高。
- 轮询间隔越短越容易碰到频率和网络问题。
- 进球后最快出现的信号可能是盘口变化，也可能是体育比分推送。
- 手动从官网控制台找 `token_id` 不适合长期使用。

新版改为：

- 本地只读代理转发 `Gamma /public-search` 搜索事件。
- 本地只读代理转发 `Gamma /events/slug/{slug}` 获取事件下的 markets、outcomes、`clobTokenIds`。
- `Market WebSocket` 订阅 token 实时盘口、成交和订单簿变化。
- `Sports WebSocket` 在后台监听当前已选择或已监听赛事的比分，比分变化时触发提醒。

## 使用

推荐用内置只读代理启动：

```bash
python3 server.py
```

然后访问：

```text
http://localhost:5173
```

也可以直接打开 `index.html` 或使用普通静态服务，但纯静态模式会回退为浏览器直连 Gamma。个别盘口在 CORS 响应里可能出现和 Polymarket 页面不一致的价格字段，本地代理可以避免这个问题。

## 工作流

1. 在左侧搜索球队、联赛或事件关键词，例如 `soccer`、`Liverpool`、`EPL`。
2. 点击一个事件，页面会加载该事件下可交易的 markets。
3. 在具体 outcome 上点击“监听”。
4. 点击“连接 WebSocket”或等待页面自动连接。
5. 当配置窗口内价格累计超过阈值变化，或 Sports WebSocket 推送比分变化时，页面会在右上角提醒并持续播放提示音，直到手动关闭。

## 告警设置

- 突变统计窗口：默认 `1.5` 秒，可在页面右侧配置。
- 窗口内价格突变阈值：默认 `8` 个百分点。比如 0.75、0.79、0.83、0.88 在统计窗口内连续跳动，也会按累计变化触发。
- 同盘口静默秒数：默认 `20` 秒，避免同一个盘口连续刷屏。
- 盘口最大价差：默认 `0.08`，可在页面右侧配置；事件详情会隐藏价差大于该值的盘口，减少低流动性盘口误报。
- Sports WS 比分提醒：页面不再显示手动 slug 过滤和比分列表；后台会用当前已选择或已监听事件的 slug 自动匹配比分推送。

## 官方接口依据

当前实现基于 Polymarket 官方文档：

- [Search markets, events, and profiles](https://docs.polymarket.com/api-reference/search/search-markets-events-and-profiles.md)
- [Get event by slug](https://docs.polymarket.com/api-reference/events/get-event-by-slug.md)
- [Market Channel](https://docs.polymarket.com/api-reference/wss/market.md)
- [Sports Channel](https://docs.polymarket.com/api-reference/wss/sports.md)
- [Get market prices](https://docs.polymarket.com/api-reference/market-data/get-market-prices-query-parameters.md)

## 设计取舍

### 为什么仍然保留静态前端

公共搜索、事件详情、Market WebSocket、Sports WebSocket 都不需要认证。静态前端足够完成“看盘 + 提醒”的核心目标，也最方便部署到 GitHub Pages。

### 什么时候需要 Python 或 Node 后端

如果你想要这些能力，再拆后端更合理：

- 后台常驻，即使浏览器关了也提醒。
- 推送到 Telegram、企业微信、邮件或手机。
- 做多源比分交叉校验，降低误报。
- 记录历史盘口，用模型识别“疑似进球前跳动”。
- 后续接自动交易，这会涉及认证、签名和风控。

### 进球提醒的可靠性

这个工具的目标是“第一时间直观提醒”，不是官方比分裁判。最佳实践是同时监听：

- 比分/赛况 WebSocket。
- 与进球强相关的盘口 outcome。
- 成交价或 best ask/bid 的大幅跳变。

任何单一信号都可能延迟或误报，组合使用更稳。
