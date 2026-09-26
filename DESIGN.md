# Design Plan — 跨境 AI 中台 Demo

Skill-driven redesign (frontend-design · ui-design-brain · saas-ui-skills · cross-border-ecommerce-skills · modern-web-guidance). Audience: Chinese CBEC operators in pitch meetings. Job: dense task queues + tables + configurable margin — not marketing splash.

## Color (named hex)

| Token | Hex | Role |
|---|---|---|
| Page Mist | `#F4F6F8` | App canvas / page background |
| Paper | `#FFFFFF` | Surfaces, sidebar, panels |
| Ink | `#0F172A` | Primary text (slate-900) |
| Slate Mute | `#64748B` | Secondary / meta text |
| Line | `#E2E8F0` | Borders, table rules |
| Signal Blue | `#1D4ED8` | Single accent (links, active nav, primary CTA) |

Semantic (muted, not neon): Success `#047857` / Warn `#B45309` / Danger `#B91C1C`. Soft fills: accent `#EFF6FF`, success `#ECFDF5`, warn `#FFFBEB`, danger `#FEF2F2`.

**Self-critique:** Rejected warm cream + terracotta, acid-green-on-black, purple gradients, and dual card-shadow+border. Cool gray Stripe/Salesforce lineage kept; craft elevated via type + density + one focal (true-profit waterfall / Agent rail), not decoration.

## Type

- **UI / Latin:** `IBM Plex Sans` (400/500/600) — restrained, tabular-friendly, not Inter/Roboto.
- **Chinese:** `"PingFang SC", "Noto Sans SC", "Microsoft YaHei"` after Latin so CJK glyphs stay native.
- **Mono (ASIN / codes):** `IBM Plex Mono` / `ui-monospace`.
- Scale (compact SaaS): 11 / 12 / 13 / 14 / 15 / 18 / 24. Body ≥14px on portal; workbench body 13px. Numbers: `font-variant-numeric: tabular-nums`.
- Load via Google Fonts with `display=swap`; system fallbacks first for LCP.

## Layout

```
┌────────┬──────────────────────────┬─────────┐
│ Sidebar│ Header (breadcrumb+demo) │ AI rail │
│ 220px  │──────────────────────────│ 260px   │
│ queues │ KPI → filters → sticky   │ 推荐/   │
│ verbs  │ table + bulk bar         │ 需确认  │
└────────┴──────────────────────────┴─────────┘
```

Portal: single-column marketing restraint, left-aligned max-w-6xl, no glassmorphism hero. Modules: left nav + dense main + optional Agent rail. Spacing scale: **4 / 8 / 12 / 16 / 24**. Sticky table headers via CSS. One primary button per toolbar.

## Principles

1. **Seller-native verbs** — 店铺授权、配对、认领、刊登、待审核、打单、标发、采购单、1688、海外仓推单、对账、结算利润.
2. **Profit is the north star** — 销售毛利 vs 净毛利; CM1→CM2→CM3 waterfall; 结算 ≠ 预估; payout ≠ revenue; editable cost stack.
3. **AI = 推荐 / 草稿 / 需确认** — never black-box one-click as default; full auto only under 进阶 disclosure.
4. **Evidence gate** — mock labeled 演示数据; disclose weights on 选品 score; red-line filters before score; no invented fee rates as facts.
5. **Four states every table** — skeleton / empty+CTA / error+retry / data; bulk bar on selection.
6. **A11y & platform APIs** — landmarks, `aria-current="page"`, focus-visible rings, native `<dialog>` where practical, `prefers-reduced-motion`, lean static Pages bundle.
7. **Anti-slop** — no ALL-CAPS eyebrows, no middle-dot meta spam, no `→` on every button, card = border XOR shadow, one accent only.

## Memorable focal

- **Finance:** true-profit CM waterfall (销售→CM1→CM2→CM3 / 净毛利) with editable cost stack — the one bold surface.
- **BI:** multi-dimension 选品 score with disclosed weights + red-line gate.
- **Chrome:** quiet; Agent rail carries recommendation craft.

## Mapping to skills

| Skill | Where it lands |
|---|---|
| frontend-design | This plan → tokens, IBM Plex, focal waterfall/score |
| ui-design-brain | Table/Nav/Card/Empty patterns; enterprise density |
| saas-ui-skills | Semantic tokens, bulk bar, skeleton/empty/error, aria-current, skippable wizard |
| cross-border-ecommerce | BI score weights, Finance CM waterfall, Ads weekly review, seller verbs |
| modern-web-guidance | `<dialog>`, sticky CSS, focus, reduced-motion |
