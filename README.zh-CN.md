# Polymarket Goal Pulse

[English](./README.md) | **简体中文**

[在线体验](https://wandsgyu.github.io/polymarket-odds-visualizer/) · [GitHub 仓库](https://github.com/WandsgYu/polymarket-odds-visualizer)

一个运行在浏览器里的 Polymarket 实时异动雷达：持续监听市场，在概率快速变化时用声音和弹层提醒你。

> Goal Pulse 是监控工具，不是交易机器人，不会替你下单。

## 为什么做这个项目

Polymarket 最有价值的信息往往不只是当前价格，而是价格刚刚发生了什么变化。

例如：

- 某个事件的概率在几秒内突然上涨；
- 比赛进球后，相关盘口快速重新定价；
- 突发新闻出现后，市场开始异动；
- 一个长期横盘的市场突然活跃。

当你同时关注多个市场时，靠手动刷新很容易错过这些信号。Goal Pulse 专注于一件事：发现异常变化，并尽快提醒你。

## 核心功能

- **实时市场监听**：通过 Polymarket Market WebSocket 接收价格变化。
- **自定义异动检测**：配置检测窗口、触发阈值和静默时间。
- **声音与弹层提醒**：价格或比分出现明显变化时持续提醒。
- **多市场监控**：在同一个页面同时观察多个盘口。
- **赛事比分联动**：结合 Sports WebSocket 观察体育赛事变化。
- **市场质量过滤**：按价差过滤不适合监控的市场。
- **本地数据记录**：按固定间隔采样，并导出 CSV 用于复盘。
- **多语言界面**：支持 English、中文、日本語、한국어和 Español。

## 立即使用

无需安装，直接打开：

**[启动在线版 Goal Pulse](https://wandsgyu.github.io/polymarket-odds-visualizer/)**

第一次使用声音提醒时，请先点击页面里的“测试提醒”，让浏览器允许播放声音。

## 本地运行

项目不需要安装依赖。克隆仓库后，在项目目录运行：

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

然后打开：

```text
http://127.0.0.1:5173
```

## 工作流程

```text
Gamma API
    ↓
搜索事件并读取市场元数据
    ↓
Market WebSocket + Sports WebSocket
    ↓
实时价格与比分变化
    ↓
异动检测
    ↓
页面高亮 + 声音提醒 + 本地记录
```

## 使用场景

- 观看足球、篮球或电竞比赛时监控盘口变化；
- 关注选举、宏观经济、科技或突发新闻市场；
- 同时盯住多个市场，减少反复切换和手动刷新；
- 导出异动前后的数据，分析市场反应速度。

## 默认配置

| 配置 | 默认值 | 作用 |
| --- | ---: | --- |
| 异动统计窗口 | `1.5` 秒 | 判断短时间价格变化的窗口 |
| 价格变化阈值 | `8` 个百分点 | 触发提醒所需的最小变化 |
| 单市场静默期 | `20` 秒 | 避免同一市场连续重复提醒 |
| 最大市场价差 | `0.08` | 过滤价差过大的市场 |
| 数据采样间隔 | `2` 秒 | 本地价格日志的采样频率 |

配置和已监控市场保存在当前浏览器的 `localStorage` 中。

## 数据来源

- **Gamma API**：事件搜索、市场详情、CLOB token ID 和初始价格。
- **Market WebSocket**：`price_change`、`best_bid_ask` 和 `last_trade_price`。
- **Sports WebSocket**：体育赛事比分和比赛状态变化。

前端直接访问这些数据源，不需要本地 Python 代理。

## 当前限制

- 只有带 CLOB token ID 的市场才能使用 Market WebSocket 实时监控。
- 体育比分提醒只是辅助信号，不等同于官方结果确认。
- 声音提醒受浏览器音频策略影响，可能需要先点击“测试提醒”。
- 日志主要保存在当前浏览器中，没有云端持久化。
- 暂不支持 Telegram、Discord、邮件等外部通知。
- 本工具不会自动交易，也不构成投资建议。

## 技术栈

- Plain HTML / CSS / JavaScript
- Polymarket Gamma API
- Polymarket CLOB Market WebSocket
- Polymarket Sports WebSocket
- Browser `localStorage`
- Web Audio API

## 反馈与贡献

如果你遇到问题或有功能建议，欢迎提交 [Issue](https://github.com/WandsgYu/polymarket-odds-visualizer/issues)。

如果这个工具对你有帮助，也欢迎点一个 Star。它能让我知道这个方向值得继续投入。

## License

当前仓库尚未选择开源许可证。在许可证确定前，代码可公开查看，但默认版权规则仍然适用。
