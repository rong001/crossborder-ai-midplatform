/* NovaHome US — Amazon US 演示店铺数据（全部为演示测算，非后台实数） */
window.NH = window.NH || {};

NH.shop = {
  name: "NovaHome US",
  marketplace: "Amazon.com",
  sellerId: "A1NOVDEMOUS",
  currency: "USD",
  timezone: "America/Los_Angeles",
  demoNote: "演示测算 · 非卖家后台实数",
};

NH.agents = [
  { id: "sourcing", name: "选品", role: "选品/市场分析岗", on: true, lastRun: "2026-10-01 22:10" },
  { id: "listing", name: "Listing", role: "运营/文案岗", on: true, lastRun: "2026-10-01 21:40" },
  { id: "ads", name: "广告守门", role: "广告运营岗", on: true, lastRun: "2026-10-02 01:15" },
  { id: "fba", name: "FBA库存", role: "供应链/物流岗", on: true, lastRun: "2026-10-02 00:30" },
  { id: "cs", name: "客服评论", role: "客服/VOC岗", on: true, lastRun: "2026-10-01 23:55" },
  { id: "profit", name: "利润日报", role: "财务/老板岗", on: true, lastRun: "2026-10-02 01:00" },
];

NH.todos = [
  { id: "t1", type: "ads", severity: "danger", title: "广告超支：NH-MAT-02 ACOS 48% 超 cap 35%", sku: "NH-MAT-02", action: "去广告守门", view: "ads" },
  { id: "t2", type: "fba", severity: "warning", title: "断货风险：NH-ORG-03 可售天数 9 天（安全库存 21）", sku: "NH-ORG-03", action: "去补货", view: "fba" },
  { id: "t3", type: "cs", severity: "danger", title: "差评待处理：NH-CUSH-04 ★2「塌陷/异味」", sku: "NH-CUSH-04", action: "去客服", view: "cs" },
  { id: "t4", type: "listing", severity: "info", title: "Listing 待复核：NH-HOOK-05 墙钩套装草稿", sku: "NH-HOOK-05", action: "去复核", view: "listing" },
];

NH.skus = [
  {
    sku: "NH-LAMP-01", asin: "B0DEMO LAMP", title: "LED Desk Lamp with USB", titleZh: "USB LED 台灯",
    status: "healthy", statusLabel: "在售健康",
    price: 29.99, cost: 6.8, fbaFee: 5.42, referral: 0.15, headhaul: 1.85, adSpendDay: 18.4,
    orders7d: 86, units7d: 92, revenue7d: 2759.08, acos: 22, tacos: 11, stars: 4.6, reviews: 312,
    fbaAvail: 420, inbound: 200, velocity: 13.1, daysCover: 32,
    tags: ["主力款"],
  },
  {
    sku: "NH-MAT-02", asin: "B0DEMO MAT2", title: "TPE Yoga Mat 6mm Non-Slip", titleZh: "TPE 瑜伽垫 6mm",
    status: "ads_over", statusLabel: "广告超标",
    price: 24.99, cost: 5.2, fbaFee: 4.88, referral: 0.15, headhaul: 2.10, adSpendDay: 62.5,
    orders7d: 54, units7d: 58, revenue7d: 1449.42, acos: 48, tacos: 30, stars: 4.4, reviews: 187,
    fbaAvail: 280, inbound: 0, velocity: 8.3, daysCover: 34,
    tags: ["ACOS超cap"],
  },
  {
    sku: "NH-ORG-03", asin: "B0DEMO ORG3", title: "Bamboo Desk Organizer Set", titleZh: "竹制桌面收纳套装",
    status: "stockout", statusLabel: "即将断货",
    price: 34.99, cost: 8.5, fbaFee: 6.15, referral: 0.15, headhaul: 2.40, adSpendDay: 14.2,
    orders7d: 71, units7d: 74, revenue7d: 2589.26, acos: 18, tacos: 9, stars: 4.7, reviews: 502,
    fbaAvail: 68, inbound: 120, velocity: 10.6, daysCover: 9,
    tags: ["断货风险"],
  },
  {
    sku: "NH-CUSH-04", asin: "B0DEMO CUSH", title: "Memory Foam Seat Cushion", titleZh: "记忆棉坐垫",
    status: "bad_review", statusLabel: "有差评",
    price: 32.99, cost: 7.1, fbaFee: 5.95, referral: 0.15, headhaul: 2.20, adSpendDay: 21.0,
    orders7d: 39, units7d: 41, revenue7d: 1352.59, acos: 28, tacos: 16, stars: 3.9, reviews: 96,
    fbaAvail: 190, inbound: 0, velocity: 5.9, daysCover: 32,
    tags: ["VOC差评"],
  },
  {
    sku: "NH-HOOK-05", asin: "—", title: "Adhesive Wall Hook Set 12pcs", titleZh: "免钉墙钩套装 12件",
    status: "pending_list", statusLabel: "待刊登复核",
    price: 15.99, cost: 2.4, fbaFee: 3.22, referral: 0.15, headhaul: 0.95, adSpendDay: 0,
    orders7d: 0, units7d: 0, revenue7d: 0, acos: 0, tacos: 0, stars: null, reviews: 0,
    fbaAvail: 0, inbound: 500, velocity: 0, daysCover: null,
    tags: ["待复核"],
  },
];

/* 选品候选 — 权重披露 */
NH.sourcingWeights = [
  { key: "capacity", label: "类目容量", w: 0.25 },
  { key: "competition", label: "竞争强度(反)", w: 0.20 },
  { key: "margin", label: "测算净利率", w: 0.30 },
  { key: "pain", label: "评论痛点可解性", w: 0.15 },
  { key: "supply", label: "货源稳定度", w: 0.10 },
];
NH.marginThreshold = 0.12; /* 净利率门槛 12% */

NH.candidates = [
  {
    id: "c1", name: "Over-door Towel Rack", nameZh: "门后毛巾架",
    category: "Home Storage", capacity: "中高", priceBand: "$18–28",
    competitorAvg: 22.5, reviewPains: ["掉落", "生锈", "安装麻烦"],
    scores: { capacity: 78, competition: 62, margin: 86, pain: 74, supply: 80 },
    price: 24.99, cost: 4.8, headhaul: 1.6, fba: 4.55, commission: 3.75, adEst: 2.5,
    claimed: false,
  },
  {
    id: "c2", name: "Cable Management Box", nameZh: "桌下理线盒",
    category: "Office Products", capacity: "高", priceBand: "$16–26",
    competitorAvg: 19.9, reviewPains: ["太小", "散热差", "盖子松"],
    scores: { capacity: 85, competition: 55, margin: 72, pain: 81, supply: 88 },
    price: 21.99, cost: 3.9, headhaul: 1.4, fba: 4.20, commission: 3.30, adEst: 2.8,
    claimed: false,
  },
  {
    id: "c3", name: "Silicone Sink Mat", nameZh: "硅胶水槽垫",
    category: "Kitchen", capacity: "中", priceBand: "$12–18",
    competitorAvg: 14.5, reviewPains: ["异味", "发霉", "尺寸不准"],
    scores: { capacity: 60, competition: 40, margin: 45, pain: 58, supply: 70 },
    price: 14.99, cost: 2.1, headhaul: 1.1, fba: 3.45, commission: 2.25, adEst: 2.2,
    claimed: false, belowThreshold: true,
  },
  {
    id: "c4", name: "Magnetic Spice Jars 6pc", nameZh: "磁吸香料罐 6件",
    category: "Kitchen", capacity: "中高", priceBand: "$22–32",
    competitorAvg: 26.0, reviewPains: ["磁力弱", "标签脱落", "容量小"],
    scores: { capacity: 72, competition: 68, margin: 78, pain: 76, supply: 75 },
    price: 27.99, cost: 5.5, headhaul: 1.9, fba: 5.10, commission: 4.20, adEst: 2.6,
    claimed: true,
  },
];

NH.listingDraft = {
  sku: "NH-HOOK-05",
  status: "pending_review",
  statusLabel: "待复核",
  title: "Adhesive Wall Hooks Heavy Duty 12 Pack, Waterproof Removable Damage-Free Hooks for Hanging Coats Towels Keys, Bathroom Kitchen Bedroom",
  bullets: [
    "Heavy-duty adhesive — holds up to 15 lbs each when applied to clean tile/glass/metal",
    "Damage-free remove — twist to release without wall marks (smooth surfaces)",
    "Waterproof & rust-resistant — bathroom and kitchen ready",
    "12-pack assortment — 6 large + 6 medium for coats, towels, keys, utensils",
    "Tool-free install in 60 seconds — no drills, no nails, no screws",
  ],
  searchTerms: "wall hooks adhesive heavy duty, removable hooks bathroom, damage free hanging hooks, towel hooks no drill, sticky hooks for wall",
  aplus: [
    "模块1：痛点对比图 — 打孔 vs 免钉",
    "模块2：承重实测对比（15lbs）",
    "模块3：场景拼图：浴室/厨房/玄关/卧室",
    "模块4：安装四步 GIF 脚本",
    "模块5：包装清单 + Q&A",
  ],
  imageScripts: [
    { slot: "主图", script: "白底 · 12件套平铺 · 角标「15lbs」" },
    { slot: "副图1", script: "浴室毛巾场景 · 水珠特写防水" },
    { slot: "副图2", script: "安装四步分格" },
    { slot: "副图3", script: "承重哑铃演示" },
    { slot: "副图4", script: "尺寸标注大/中钩" },
    { slot: "副图5", script: "多色可选（若有）" },
  ],
};

NH.adsCaps = { acos: 35, tacos: 18 };
NH.campaigns = [
  { id: "camp1", sku: "NH-LAMP-01", name: "SP Auto · Lamp", type: "auto", spend7d: 98.2, sales7d: 446.4, acos: 22, status: "ok", suggest: null },
  { id: "camp2", sku: "NH-LAMP-01", name: "SP Manual Exact · Lamp", type: "manual", spend7d: 42.0, sales7d: 210.0, acos: 20, status: "ok",
    suggest: { type: "boost", text: "出单词 desk lamp usb charging 转化好，建议日预算 +$8", blocked: false } },
  { id: "camp3", sku: "NH-MAT-02", name: "SP Auto · Yoga Mat", type: "auto", spend7d: 285.0, sales7d: 593.8, acos: 48, status: "over_cap",
    suggest: { type: "pause", text: "烧钱词 yoga mat thick / exercise mat cheap ACOS>70%，建议暂停", blocked: true, blockReason: "活动 ACOS 48% 已超 cap 35%，拦截加预算；仅允许暂停/降价词" } },
  { id: "camp4", sku: "NH-MAT-02", name: "SP Manual Phrase · Mat", type: "manual", spend7d: 152.5, sales7d: 280.0, acos: 54, status: "over_cap",
    suggest: { type: "pause", text: "建议暂停 phrase「cheap yoga mat」并否定化", blocked: true, blockReason: "超 ACOS cap，禁止加预算" } },
  { id: "camp5", sku: "NH-ORG-03", name: "SP Auto · Organizer", type: "auto", spend7d: 68.4, sales7d: 380.0, acos: 18, status: "ok",
    suggest: { type: "boost", text: "出单词 bamboo desk organizer 建议加预算 +$5", blocked: false } },
  { id: "camp6", sku: "NH-CUSH-04", name: "SP Auto · Cushion", type: "auto", spend7d: 105.0, sales7d: 375.0, acos: 28, status: "watch",
    suggest: { type: "watch", text: "接近 cap，观察 3 天；差评期建议控投", blocked: false } },
];

NH.fba = NH.skus.filter(s => s.status !== "pending_list").map(s => ({
  sku: s.sku, titleZh: s.titleZh, avail: s.fbaAvail, inbound: s.inbound,
  velocity: s.velocity, daysCover: s.daysCover,
  safetyDays: 21, reorderQty: s.daysCover < 21 ? Math.ceil((21 - s.daysCover) * s.velocity + 14 * s.velocity) : 0,
  risk: s.daysCover < 14 ? "high" : s.daysCover < 21 ? "mid" : "low",
}));

NH.csItems = [
  {
    id: "cs1", type: "message", risk: "low", sku: "NH-LAMP-01",
    from: "Buyer · A***k", subject: "Missing USB cable?",
    body: "Hi, my lamp arrived but I can't find the USB cable in the box. Can you help?",
    draftZh: "您好，非常抱歉给您带来不便。台灯包装内 USB 线应在底座泡棉夹层；若确认缺失，我们可为您补发一根线（约 5–7 个工作日送达）。请回复订单号确认收货地址。",
    draftEn: "Hi, sorry for the trouble. The USB cable is usually tucked in the foam under the base. If it's missing, we can reship a cable (5–7 business days). Please reply with your order ID to confirm the address.",
    suggest: "补发配件", status: "pending",
  },
  {
    id: "cs2", type: "review", risk: "high", sku: "NH-CUSH-04", stars: 2,
    from: "Review · M***e", subject: "Flattens in a week / chemical smell",
    body: "Cushion went flat after 1 week and had a strong chemical smell for days. Not worth it.",
    draftZh: "【需人工】差评涉及产品安全/气味与品质承诺，禁止私信诱导删评。建议：公开回复致歉 + 站内信提供退款/换货选项 + 同步品控抽检批次。",
    draftEn: "[HUMAN REQUIRED] Do NOT offer review removal. Public apology + private refund/replace offer + QA batch check.",
    suggest: "退款或换货 · 禁止承诺删评", status: "pending", highRiskReason: "差评承诺/气味安全敏感",
  },
  {
    id: "cs3", type: "qa", risk: "low", sku: "NH-ORG-03",
    from: "Q&A", subject: "Does it fit dual monitors?",
    body: "Will this organizer fit under a dual-monitor arm setup?",
    draftZh: "可以。套装配件高度约 4.5cm，多数双屏支架底座可穿过；建议测量支架立柱直径是否 ≤ 桌面预留孔。",
    draftEn: "Yes for most dual-monitor arms. Tray height ~4.5cm; please measure your pole diameter against the desk cutout.",
    suggest: "发布 Q&A 回答", status: "pending",
  },
  {
    id: "cs4", type: "message", risk: "high", sku: "NH-MAT-02",
    from: "Buyer · T***r", subject: "Your listing copies BrandX patent??",
    body: "This looks identical to BrandX patented texture. Are you infringing?",
    draftZh: "【需人工·侵权风险】请法务/品牌同事复核后再回复。演示草稿：我们重视知识产权，已内部核查中，将通过亚马逊消息正式回复。切勿承认侵权或提供设计图。",
    draftEn: "[HUMAN · IP RISK] Escalate to brand/legal before reply. Do not admit infringement or share design files.",
    suggest: "升级法务 · 暂缓发送", status: "pending", highRiskReason: "侵权指控",
  },
];

NH.orders = [
  { id: "111-2840193-5521847", date: "2026-10-01", sku: "NH-LAMP-01", qty: 1, sales: 29.99, ads: 3.20, refund: 0, headhaul: 1.85, fba: 5.42, referral: 4.50, cost: 6.80 },
  { id: "111-9382011-1200442", date: "2026-10-01", sku: "NH-MAT-02", qty: 2, sales: 49.98, ads: 12.40, refund: 0, headhaul: 4.20, fba: 9.76, referral: 7.50, cost: 10.40 },
  { id: "111-5528190-7712033", date: "2026-10-01", sku: "NH-ORG-03", qty: 1, sales: 34.99, ads: 2.10, refund: 0, headhaul: 2.40, fba: 6.15, referral: 5.25, cost: 8.50 },
  { id: "111-1029384-6610291", date: "2026-09-30", sku: "NH-CUSH-04", qty: 1, sales: 32.99, ads: 4.80, refund: 32.99, headhaul: 2.20, fba: 5.95, referral: 4.95, cost: 7.10 },
  { id: "111-7782910-3301928", date: "2026-09-30", sku: "NH-LAMP-01", qty: 1, sales: 29.99, ads: 2.90, refund: 0, headhaul: 1.85, fba: 5.42, referral: 4.50, cost: 6.80 },
  { id: "111-4410293-8829104", date: "2026-09-30", sku: "NH-ORG-03", qty: 1, sales: 34.99, ads: 1.80, refund: 0, headhaul: 2.40, fba: 6.15, referral: 5.25, cost: 8.50 },
  { id: "111-2201938-5510293", date: "2026-09-29", sku: "NH-MAT-02", qty: 1, sales: 24.99, ads: 8.50, refund: 0, headhaul: 2.10, fba: 4.88, referral: 3.75, cost: 5.20 },
  { id: "111-8829104-1029384", date: "2026-09-29", sku: "NH-LAMP-01", qty: 2, sales: 59.98, ads: 5.10, refund: 0, headhaul: 3.70, fba: 10.84, referral: 9.00, cost: 13.60 },
];

NH.logs = [
  { ts: "2026-10-02 01:15:22", agent: "广告守门", msg: "扫描 6 个活动 · 拦截 2 条超 cap 加预算建议" },
  { ts: "2026-10-02 01:00:08", agent: "利润日报", msg: "生成 10/01 日报 · 净利演示测算完成" },
  { ts: "2026-10-02 00:30:41", agent: "FBA库存", msg: "NH-ORG-03 可售 9 天 · 触发补货建议" },
  { ts: "2026-10-01 23:55:03", agent: "客服评论", msg: "新差评 NH-CUSH-04 ★2 · 标高风险待人工" },
  { ts: "2026-10-01 22:10:17", agent: "选品", msg: "跑完 4 条候选 · 1 条低于净利门槛" },
  { ts: "2026-10-01 21:40:55", agent: "Listing", msg: "NH-HOOK-05 草稿生成 · 状态：待复核" },
];

NH.calcNet = function (o) {
  return +(o.sales - o.ads - o.refund - o.headhaul - o.fba - o.referral - o.cost).toFixed(2);
};

NH.calcCandidateMargin = function (c) {
  const net = c.price - c.cost - c.headhaul - c.fba - c.commission - c.adEst;
  return { net: +net.toFixed(2), rate: +(net / c.price).toFixed(4) };
};

NH.calcScore = function (c) {
  let s = 0;
  NH.sourcingWeights.forEach(w => { s += (c.scores[w.key] || 0) * w.w; });
  return Math.round(s);
};
