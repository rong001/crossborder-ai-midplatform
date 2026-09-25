# 跨境电商AI套件 · 官方演示

全链路跨境电商经营演示套件（演示数据），适合客户演示与方案讲解。通过 GitHub Pages 一键访问。

## 在线演示门户

👉 **https://rong001.github.io/crossborder-ai-midplatform/**

## 产品矩阵入口

| 系统 | 说明 | 链接 |
|------|------|------|
| 🏠 总门户 | 产品矩阵官网入口 | [打开](https://rong001.github.io/crossborder-ai-midplatform/) |
| AI运营中台 | 多平台看板 · AI洞察 | [打开](https://rong001.github.io/crossborder-ai-midplatform/midplatform/) |
| ERP 进销存 | 采购 · 供应商 · 成本 · 应付 | [打开](https://rong001.github.io/crossborder-ai-midplatform/erp/) |
| OMS 订单履约 | 多平台订单 · 审拆合单 · 物流 | [打开](https://rong001.github.io/crossborder-ai-midplatform/oms/) |
| WMS 海外仓 | 库位 · 拣货波次 · 出入库 | [打开](https://rong001.github.io/crossborder-ai-midplatform/wms/) |
| 广告投放中心 | ACOS/ROAS · 关键词 · AI优化 | [打开](https://rong001.github.io/crossborder-ai-midplatform/ads/) |
| 智能客服中心 | 多语言工单 · 自动回复 · 差评预警 | [打开](https://rong001.github.io/crossborder-ai-midplatform/cs/) |
| 选品与数据BI | 榜单 · 趋势 · 竞品 · 利润测算 | [打开](https://rong001.github.io/crossborder-ai-midplatform/bi/) |
| 财务结算对账 | 回款 · 费用 · 毛利净利 · 差异 | [打开](https://rong001.github.io/crossborder-ai-midplatform/finance/) |

> **路径变更说明**：原先根路径 `/` 即为 AI 中台单页；现已升级为套件总门户，原中台迁移至 `/midplatform/`。

## 技术说明

- 全部为自包含 HTML（Tailwind CSS + Chart.js CDN），无构建步骤
- 界面中文，统一 **Dark Premium Enterprise** 视觉（石墨深色壳 + indigo 品牌色）与「演示数据」标识
- 共享样式：`shared.css`（CSS 变量 + 布局 chrome），各页 Tailwind CDN + Chart.js CDN，无构建
- 支持平台徽章：Amazon / Shopee / TikTok / Lazada / Temu / Walmart
- 无需登录，适合屏幕共享演示

## 本地预览

```bash
cd crossborder-suite   # 或本仓库根目录
python3 -m http.server 8080
```

访问 `http://localhost:8080`。

## 许可

演示用途，内容与数据仅供展示。
