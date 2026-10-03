/* 北冕北美店 — 选品裁决 + 运营中台
 * SAMPLE = 虚构样例；CALC = 页面内真实计算
 */
window.BX = window.BX || {};
BX.meta = {
  shop: "北冕北美店",
  marketplace: "Amazon.com 北美（规则口径亦适用于欧站）",
  demoNote: "费用为公开规则量级演示测算，非后台实数",
  sampleNote: "店铺与候选品均为虚构样例，非真实品牌",
};
BX.rules = { marginMin: 0.18, acosMax: 0.35, safetyDays: 21, headhaulDays: 25 };

BX.agents = [
  { id:"verdict", name:"选品裁决", on:true, processedToday:0 },
  { id:"listing", name:"Listing", on:true, processedToday:0 },
  { id:"ads", name:"广告守门", on:true, processedToday:0 },
  { id:"fba", name:"FBA补货", on:true, processedToday:0 },
  { id:"cs", name:"评论消息", on:true, processedToday:0 },
  { id:"weekly", name:"经营周报", on:true, processedToday:0 },
];

BX.dailyMap = [
  { job:"选品", who:"选品", human:"定类目、拍板做不做", system:"八维打分、净利拦截、趋势阶段", mustConfirm:"认领进短名单 / 否决", saved:"约 40 分钟/批" },
  { job:"Listing", who:"运营/文案", human:"改文案、过合规、确认上架", system:"标题、五点、搜索词、A+、主图脚本草稿", mustConfirm:"确认进草稿（不上架）", saved:"约 1 小时/条" },
  { job:"广告", who:"广告运营", human:"否词、暂停、改价策略", system:"ACOS 超 35% 标红并给建议", mustConfirm:"改预算 / 启停活动", saved:"早会前 15 分钟" },
  { job:"补货", who:"供应链", human:"下采购单、约头程", system:"可售天、建议量、最晚发货日", mustConfirm:"确认采购单", saved:"避免漏看断货" },
  { job:"差评/消息", who:"客服", human:"定调、是否退款", system:"英文回复草稿、退货归类、高风险标红", mustConfirm:"确认后才标已回复 / 发信", saved:"首响草稿即时" },
  { job:"利润/周报", who:"财务/老板", human:"看净利决定加投或收缩", system:"销量、广告、退货、断货一页汇总", mustConfirm:"对外发周报给团队", saved:"周一早会一页" },
];

/** 6 候选 — SAMPLE 字段；裁决由 CALC 函数生成 */
BX.candidates = [
  {
    id:"p1", nameZh:"免钉墙钩 12 件套", nameEn:"Adhesive Wall Hook Set",
    keyword:"adhesive wall hooks",
    demandTrend:"up", demandWeeksUp:3, demandPhase:"启动", demandDropPct:0,
    brandMonopoly:false, reviewBarrier:"中（TOP10均评~380）", monthlySalesEst:4200,
    price:16.99, cogs:2.60, headhaul:0.95, fba:3.45, referralRate:0.15, adReserve:1.80, returnReserve:0.55,
    compliance:"清（无儿童/电子/食品；外观专利待抽检）", complianceClear:true,
    supplyLeadDays:12, moq:500, canSmallTrial:true,
    returnRisk:"低", returnNote:"标准家居配件",
    diff:"加强防水背胶+承重实测图，对差评「掉落」",
    timing:"刚好", timingLate:false,
  },
  {
    id:"p2", nameZh:"竹制桌面收纳", nameEn:"Bamboo Desk Organizer",
    keyword:"bamboo desk organizer",
    demandTrend:"flat", demandWeeksUp:0, demandPhase:"持平", demandDropPct:0,
    brandMonopoly:false, reviewBarrier:"中高（均评~900）", monthlySalesEst:6800,
    price:29.99, cogs:6.80, headhaul:2.35, fba:5.88, referralRate:0.15, adReserve:2.40, returnReserve:0.90,
    compliance:"清", complianceClear:true,
    supplyLeadDays:18, moq:300, canSmallTrial:true,
    returnRisk:"中", returnNote:"组装件，退货预留可控",
    diff:"加宽线缆孔+防滑垫，对差评「底座滑」",
    timing:"刚好", timingLate:false,
  },
  {
    id:"p3", nameZh:"硅胶水槽垫", nameEn:"Silicone Sink Mat",
    keyword:"silicone sink mat",
    demandTrend:"up", demandWeeksUp:2, demandPhase:"启动", demandDropPct:0,
    brandMonopoly:false, reviewBarrier:"低", monthlySalesEst:5100,
    price:13.99, cogs:2.40, headhaul:1.10, fba:3.55, referralRate:0.15, adReserve:2.20, returnReserve:0.95,
    compliance:"清", complianceClear:true,
    supplyLeadDays:10, moq:1000, canSmallTrial:true,
    returnRisk:"中", returnNote:"异味投诉多，退货预留偏高",
    diff:"食品级硅胶除味工艺说明",
    timing:"刚好", timingLate:false,
  },
  {
    id:"p4", nameZh:"记忆棉坐垫", nameEn:"Memory Foam Seat Cushion",
    keyword:"memory foam seat cushion",
    demandTrend:"down", demandWeeksUp:0, demandPhase:"衰退", demandDropPct:28,
    brandMonopoly:false, reviewBarrier:"中", monthlySalesEst:9000,
    price:34.99, cogs:7.50, headhaul:2.40, fba:6.05, referralRate:0.15, adReserve:3.20, returnReserve:1.60,
    compliance:"清（泡沫气味需关注）", complianceClear:true,
    supplyLeadDays:20, moq:800, canSmallTrial:true,
    returnRisk:"高", returnNote:"塌陷/异味，退货预留高",
    diff:"加高密度芯+可换套",
    timing:"晚", timingLate:true,
  },
  {
    id:"p5", nameZh:"儿童保温杯（带吸管）", nameEn:"Kids Insulated Bottle",
    keyword:"kids water bottle straw",
    demandTrend:"up", demandWeeksUp:4, demandPhase:"爆发", demandDropPct:0,
    brandMonopoly:true, reviewBarrier:"极高（首页大牌）", monthlySalesEst:22000,
    price:24.99, cogs:5.10, headhaul:1.80, fba:4.90, referralRate:0.15, adReserve:3.50, returnReserve:1.20,
    compliance:"不清（儿童接触+食品接触认证未齐）", complianceClear:false,
    supplyLeadDays:35, moq:2000, canSmallTrial:false,
    returnRisk:"高", returnNote:"儿童品退货与安全投诉敏感",
    diff:"无明确可改卖点（同质化）",
    timing:"晚", timingLate:true,
  },
  {
    id:"p6", nameZh:"磁吸香料罐 6 件", nameEn:"Magnetic Spice Jars 6pc",
    keyword:"magnetic spice jars",
    demandTrend:"up", demandWeeksUp:2, demandPhase:"启动", demandDropPct:0,
    brandMonopoly:false, reviewBarrier:"中", monthlySalesEst:3500,
    price:27.99, cogs:5.20, headhaul:1.85, fba:5.20, referralRate:0.15, adReserve:2.50, returnReserve:0.85,
    compliance:"清", complianceClear:true,
    supplyLeadDays:14, moq:400, canSmallTrial:true,
    returnRisk:"低", returnNote:"玻璃易碎预留已计入",
    diff:"加强磁+可写标签，对差评「磁力弱/标签掉」",
    timing:"早", timingLate:false,
  },
];

BX.calcUnit = function (x) {
  const referral = +(x.price * x.referralRate).toFixed(2);
  const net = +(x.price - x.cogs - x.headhaul - x.fba - referral - x.adReserve - x.returnReserve).toFixed(2);
  const rate = x.price ? net / x.price : 0;
  return { referral, net, rate };
};

/** CALC: 八维齐备才可「可做」；衰退强制停补收缩；缺项不能可做 */
BX.verdict = function (p) {
  const m = BX.calcUnit(p);
  const checks = [];
  // 1 需求
  if (p.demandPhase === "衰退" || (p.demandTrend === "down" && p.demandDropPct >= 20)) {
    checks.push({ key:"需求", pass:false, hard:"不可做", detail:`衰退（连续下跌约${p.demandDropPct}%）→ 停补+收缩，禁止建议补货` });
  } else if (!p.demandTrend) {
    checks.push({ key:"需求", pass:false, hard:"观察", detail:"需求趋势数据缺失" });
  } else {
    checks.push({ key:"需求", pass:true, detail:`${p.demandPhase} · ${p.demandTrend==="up"?"上升":p.demandTrend==="flat"?"持平":"下跌"}` });
  }
  // 2 竞争
  if (p.brandMonopoly && p.monthlySalesEst >= 10000) {
    checks.push({ key:"竞争", pass:false, hard:"不可做", detail:`月销约${p.monthlySalesEst}且首页品牌垄断` });
  } else if (p.brandMonopoly) {
    checks.push({ key:"竞争", pass:false, hard:"观察", detail:"存在品牌垄断迹象" });
  } else {
    checks.push({ key:"竞争", pass:true, detail:p.reviewBarrier });
  }
  // 3 净利
  if (m.rate < BX.rules.marginMin) {
    checks.push({ key:"净利", pass:false, hard:"不可做", detail:`净利率 ${(m.rate*100).toFixed(1)}% < 18%（净利 $${m.net.toFixed(2)}）` });
  } else {
    checks.push({ key:"净利", pass:true, detail:`净利率 ${(m.rate*100).toFixed(1)}% · 单件 $${m.net.toFixed(2)}` });
  }
  // 4 合规
  if (!p.complianceClear) {
    checks.push({ key:"合规", pass:false, hard:"观察", detail:p.compliance + " → 不清不能可做" });
  } else {
    checks.push({ key:"合规", pass:true, detail:p.compliance });
  }
  // 5 供应
  if (!p.canSmallTrial) {
    checks.push({ key:"供应", pass:false, hard:"观察", detail:`交期${p.supplyLeadDays}天 · MOQ ${p.moq} · 不能小单试` });
  } else {
    checks.push({ key:"供应", pass:true, detail:`交期${p.supplyLeadDays}天 · MOQ ${p.moq} · 可小单试` });
  }
  // 6 退货
  const retPct = p.returnReserve / p.price;
  if (p.returnRisk === "高" || retPct > 0.04) {
    checks.push({ key:"退货", pass:false, hard:"不可做", detail:`${p.returnNote} · 退货预留 ${(retPct*100).toFixed(1)}%` });
  } else {
    checks.push({ key:"退货", pass:true, detail:p.returnNote });
  }
  // 7 差异
  if (!p.diff || p.diff.indexOf("无明确") >= 0) {
    checks.push({ key:"差异", pass:false, hard:"不可做", detail:"无可改差异点" });
  } else {
    checks.push({ key:"差异", pass:true, detail:p.diff });
  }
  // 8 节奏
  if (p.timingLate || p.timing === "晚") {
    checks.push({ key:"节奏", pass:false, hard:"不可做", detail:"进场已晚" });
  } else {
    checks.push({ key:"节奏", pass:true, detail:p.timing });
  }

  const hardNo = checks.find(c => c.hard === "不可做");
  const hardWatch = checks.find(c => c.hard === "观察");
  const allPass = checks.every(c => c.pass);
  let conclusion, reason;
  if (hardNo) {
    conclusion = "不可做";
    reason = hardNo.key + "：" + hardNo.detail;
  } else if (!allPass || hardWatch) {
    conclusion = "观察";
    const w = hardWatch || checks.find(c => !c.pass);
    reason = (w ? w.key + "：" + w.detail : "八维未齐");
  } else {
    conclusion = "可做";
    reason = "八维均过 · 净利与需求节奏成立";
  }
  // 衰退附加动作
  let action = conclusion === "可做" ? "可进短名单（人工认领）" : conclusion === "观察" ? "补数据/认证后再裁" : "停止立项";
  if (p.demandPhase === "衰退") action = "停补+收缩广告 · 不建议补货";
  return { conclusion, reason, action, checks, margin:m };
};

BX.logs = [];
