# Crossborder AI OS · 跨境电商 AI 原生操作系统

多平台连接 + 统一经营数据 + 多 Agent 自动运营 + **人机协同审批**。

## Live
https://rong001.github.io/crossborder-ai-midplatform/

## Positioning
AI-native OS for cross-border commerce — **not** legacy ERP with a chat box, and **not** a black-box one-click Agent.

Design default: **guided onboarding + human-in-the-loop**. AI proposes/drafts; humans approve high-risk actions. Full automation is an optional advanced demo only.

## Demo tip（给客户演示）
1. 打开任意模块顶栏 **操作手册** 讲解「解决什么 / 第一周怎么用 / 知识库与规则」
2. 点 **上手向导**，逐步勾选范围、标记知识库、保存阈值、载入演示数据
3. 在建议卡点 **批准此条** / **查看推荐并确认**（不要默认点全自动）
4. 「进阶：模拟全自动」仅在披露展开后演示架构能力

## Architecture (4 layers)
1. **Applications** — 8 business modules（每模块含手册 + 向导）
2. **Multi-Agent Orchestration** — Listing / Pricing / Ads / Replenishment / Fulfillment / CS / Finance
3. **Unified Data + Event Bus** — orders, inventory, ads, tickets, settlements, true P&L
4. **Platform Connectors** — Amazon, Shopee, TikTok Shop, Lazada, Temu, Walmart

## Structure
- `/` architecture-first portal（含「为什么这样设计」「如何开始」）
- `/midplatform/` command center
- `/bi/` `/erp/` `/wms/` `/oms/` `/ads/` `/cs/` `/finance/`
- `shared.css` + `shared.js` + `guides.js` — 手册/向导共用

## Stack
Self-contained HTML + Tailwind CDN + Chart.js. Demo data only. Chinese UI.
Wizard progress persists in `localStorage` per app (`cb-wizard-<appId>`).
