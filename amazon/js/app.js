/* NovaHome US Amazon AI Midplatform app */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const state = {
    view: "overview",
    agents: JSON.parse(JSON.stringify(NH.agents)),
    logs: JSON.parse(JSON.stringify(NH.logs)),
    listing: JSON.parse(JSON.stringify(NH.listingDraft)),
    candidates: JSON.parse(JSON.stringify(NH.candidates)),
    campaigns: JSON.parse(JSON.stringify(NH.campaigns)),
    cs: JSON.parse(JSON.stringify(NH.csItems)),
    fba: JSON.parse(JSON.stringify(NH.fba)),
    todos: JSON.parse(JSON.stringify(NH.todos)),
  };

  function money(n){ return "$" + Number(n).toFixed(2); }
  function pct(n){ return (Number(n)*100).toFixed(1) + "%"; }
  function nowTs(){
    const d = new Date();
    const p = n => String(n).padStart(2,"0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  function pushLog(agent, msg){
    state.logs.unshift({ ts: nowTs(), agent, msg });
    renderLogs();
  }
  function flowBox(input, ai, gate, out){
    return `<div class="flow">
      <div><b>输入</b>${input}</div>
      <div><b>AI 做什么</b>${ai}</div>
      <div><b>人工卡点</b>${gate}</div>
      <div><b>输出</b>${out}</div>
    </div>`;
  }
  function setView(v){
    state.view = v;
    $$(".nav button[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view===v));
    $$(".view").forEach(el => el.classList.toggle("active", el.id === "view-"+v));
    $("#page-title").textContent = ({
      overview:"总览", sourcing:"选品", listing:"Listing", ads:"广告守门",
      fba:"FBA 库存", cs:"客服与评论", profit:"利润日报"
    })[v] || v;
  }

  function renderOverview(){
    const todos = state.todos.map(t => `
      <div class="todo ${t.severity}">
        <div>
          <div style="font-weight:600">${t.title}</div>
          <div class="tiny muted">SKU ${t.sku}</div>
        </div>
        <button class="btn primary" data-goto="${t.view}">${t.action}</button>
      </div>`).join("");
    const agents = state.agents.map(a => `
      <div class="agent">
        <div>
          <div style="font-weight:600">${a.name} <span class="tiny muted">· ${a.role}</span></div>
          <div class="tiny muted">上次运行 ${a.lastRun || "—"}</div>
        </div>
        <button class="switch ${a.on?"on":""}" data-agent="${a.id}" aria-label="切换${a.name}"><i></i></button>
      </div>`).join("");
    const skus = NH.skus.map(s => `
      <tr>
        <td>${s.sku}<div class="tiny muted">${s.titleZh}</div></td>
        <td><span class="badge ${s.status==='healthy'?'ok':s.status==='ads_over'||s.status==='bad_review'?'bad':s.status==='stockout'?'warn':'info'}">${s.statusLabel}</span></td>
        <td class="num">${money(s.price)}</td>
        <td class="num">${s.acos?s.acos+"%":"—"}</td>
        <td class="num">${s.daysCover ?? "—"}</td>
        <td class="num">${s.stars ?? "—"}</td>
      </tr>`).join("");
    $("#view-overview").innerHTML = `
      <div class="grid g3" style="margin-bottom:12px">
        <div class="card"><div class="muted tiny">店铺</div><div class="kpi" style="font-size:16px">${NH.shop.name}</div><div class="tiny muted">${NH.shop.marketplace} · 美站仿真</div></div>
        <div class="card"><div class="muted tiny">今日待办</div><div class="kpi">${state.todos.length}</div><div class="tiny muted">广告超标 / 断货 / 差评 / Listing 复核</div></div>
        <div class="card"><div class="muted tiny">Agent 开启</div><div class="kpi">${state.agents.filter(a=>a.on).length}/6</div><div class="tiny muted">只建议与拦截 · 不接真实后台</div></div>
      </div>
      <div class="grid g2">
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="margin:0">今日待办</h3>
            <button class="btn primary" id="btn-run-demo">一键跑演示数据</button>
          </div>
          ${todos}
        </div>
        <div class="card">
          <h3>各 Agent 开关</h3>
          ${agents}
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>仿真店铺 SKU（5 个）</h3>
        <table><thead><tr><th>SKU</th><th>状态</th><th class="num">售价</th><th class="num">ACOS</th><th class="num">可售天</th><th class="num">星级</th></tr></thead><tbody>${skus}</tbody></table>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>运行日志</h3>
        <div class="log" id="log-box"></div>
      </div>
      <p class="footer-note"><span class="badge demo">${NH.shop.demoNote}</span> 未连接 Seller Central / Ads。所有费用为公开规则量级演示测算。</p>`;
    renderLogs();
    $("#btn-run-demo")?.addEventListener("click", runDemo);
    $$("[data-goto]").forEach(b => b.addEventListener("click", () => setView(b.dataset.goto)));
    $$(".switch[data-agent]").forEach(b => b.addEventListener("click", () => {
      const a = state.agents.find(x => x.id === b.dataset.agent);
      a.on = !a.on;
      pushLog(a.name, a.on ? "已开启" : "已关闭");
      renderOverview();
    }));
  }

  function renderLogs(){
    const box = $("#log-box");
    if (!box) return;
    box.innerHTML = state.logs.slice(0,40).map(l => `<div><span style="color:#94A3B8">${l.ts}</span> · <span style="color:#93C5FD">${l.agent}</span> · ${l.msg}</div>`).join("");
  }

  function runDemo(){
    const on = state.agents.filter(a=>a.on);
    if (!on.length){ pushLog("总览","没有开启的 Agent"); return; }
    on.forEach((a,i) => {
      setTimeout(() => {
        a.lastRun = nowTs();
        const msgs = {
          sourcing: "重跑选品候选 · 毛利门槛拦截已应用",
          listing: "刷新 Listing 草稿 · 仍待人工复核",
          ads: "扫描活动 · 超 cap 建议已拦截加预算",
          fba: "刷新可售天数 · 生成补货建议",
          cs: "生成中英回复草稿 · 高风险已标红",
          profit: "重算订单级净利瀑布 · 演示测算",
        };
        pushLog(a.name, msgs[a.id] || "演示运行完成");
        if (i === on.length-1) renderOverview();
      }, 180*i);
    });
  }

  function renderSourcing(){
    const rows = state.candidates.map(c => {
      const m = NH.calcCandidateMargin(c);
      const score = NH.calcScore(c);
      const below = m.rate < NH.marginThreshold || c.belowThreshold;
      return `<tr>
        <td>${c.nameZh}<div class="tiny muted">${c.category} · ${c.priceBand}</div></td>
        <td class="num">${score}</td>
        <td class="num">${pct(m.rate)} <div class="tiny muted">净利 ${money(m.net)}</div></td>
        <td>${below?'<span class="badge bad">低于门槛·不建议做</span>':'<span class="badge ok">过门槛</span>'}</td>
        <td class="tiny">${(c.reviewPains||[]).join(" / ")}</td>
        <td>${c.claimed?'<span class="badge info">已认领</span>':(below?'—':`<button class="btn primary" data-claim="${c.id}">认领进短名单</button>`)}</td>
      </tr>`;
    }).join("");
    const weights = NH.sourcingWeights.map(w=>`${w.label} ${(w.w*100).toFixed(0)}%`).join(" · ");
    $("#view-sourcing").innerHTML = `
      ${flowBox("类目容量、竞品价格带、评论痛点、成本项","多维打分 + 头程/FBA/佣金/广告后毛利；低于阈值拦截","认领进短名单","短名单候选表 + 不建议做标记")}
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <h3 style="margin:0">选品候选 · 净利率门槛 ${(NH.marginThreshold*100).toFixed(0)}%</h3>
          <span class="badge demo">权重：${weights}</span>
        </div>
        <p class="tiny muted" style="margin:8px 0 12px">毛利 = 售价 − 采购 − 头程 − FBA − 佣金 − 广告预估。${NH.shop.demoNote}</p>
        <table><thead><tr><th>品类</th><th class="num">综合分</th><th class="num">测算净利率</th><th>守门</th><th>评论痛点</th><th>动作</th></tr></thead><tbody>${rows}</tbody></table>
      </div>`;
    $$("[data-claim]").forEach(b => b.addEventListener("click", () => {
      const c = state.candidates.find(x=>x.id===b.dataset.claim);
      c.claimed = true;
      pushLog("选品", `认领 ${c.nameZh} 进入短名单`);
      renderSourcing();
    }));
  }

  function renderListing(){
    const L = state.listing;
    const canPublish = L.status === "approved";
    $("#view-listing").innerHTML = `
      ${flowBox("短名单 SKU / 卖点","生成标题、五点、搜索词、A+大纲、主副图脚本","人工复核通过后才能刊登","待复核草稿 → 可刊登")}
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <h3 style="margin:0">SKU ${L.sku} · <span class="badge ${L.status==='approved'?'ok':L.status==='rejected'?'bad':'warn'}">${L.statusLabel}</span></h3>
          <div class="row-actions">
            <button class="btn" id="btn-reject" ${L.status==='pending_review'?'':'disabled'}>驳回修改</button>
            <button class="btn primary" id="btn-approve" ${L.status==='pending_review'?'':'disabled'}>通过复核</button>
            <button class="btn primary" id="btn-publish" ${canPublish?'':'disabled'}>刊登</button>
          </div>
        </div>
        <p class="tiny muted">AI 只出草稿。未通过复核时「刊登」不可用。</p>
        <h3>标题</h3><div class="pre">${L.title}</div>
        <h3 style="margin-top:12px">五点</h3><div class="pre">${L.bullets.map((b,i)=>`${i+1}. ${b}`).join("\n")}</div>
        <h3 style="margin-top:12px">搜索词</h3><div class="pre">${L.searchTerms}</div>
        <h3 style="margin-top:12px">A+ 大纲</h3><div class="pre">${L.aplus.map((b,i)=>`${i+1}. ${b}`).join("\n")}</div>
        <h3 style="margin-top:12px">主图 / 副图脚本</h3>
        <table><thead><tr><th>位置</th><th>脚本</th></tr></thead><tbody>${L.imageScripts.map(x=>`<tr><td>${x.slot}</td><td>${x.script}</td></tr>`).join("")}</tbody></table>
      </div>`;
    $("#btn-approve")?.addEventListener("click", () => {
      L.status = "approved"; L.statusLabel = "已复核·可刊登";
      pushLog("Listing", `${L.sku} 人工复核通过`);
      state.todos = state.todos.filter(t => t.id !== "t4");
      renderListing();
    });
    $("#btn-reject")?.addEventListener("click", () => {
      L.status = "rejected"; L.statusLabel = "已驳回·待改";
      pushLog("Listing", `${L.sku} 驳回，退回修改`);
      renderListing();
    });
    $("#btn-publish")?.addEventListener("click", () => {
      if (L.status !== "approved") return;
      L.status = "published"; L.statusLabel = "已刊登（演示）";
      pushLog("Listing", `${L.sku} 演示刊登成功（未接真实后台）`);
      renderListing();
    });
  }

  function renderAds(){
    const rows = state.campaigns.map(c => {
      const over = c.status === "over_cap";
      const sug = c.suggest;
      let action = "—";
      if (sug){
        if (sug.blocked){
          action = `<span class="badge bad">已拦截加预算</span><div class="tiny">${sug.text}</div><div class="tiny muted">${sug.blockReason}</div>
            <button class="btn" data-adopt="${c.id}" data-mode="pause">采纳暂停</button>`;
        } else {
          action = `<div class="tiny">${sug.text}</div><button class="btn primary" data-adopt="${c.id}" data-mode="ok">采纳建议</button>`;
        }
      }
      return `<tr>
        <td>${c.name}<div class="tiny muted">${c.sku} · ${c.type}</div></td>
        <td class="num">${money(c.spend7d)}</td>
        <td class="num">${money(c.sales7d)}</td>
        <td class="num">${c.acos}% ${over?'<span class="badge bad">超cap</span>':''}</td>
        <td>${action}</td>
      </tr>`;
    }).join("");
    $("#view-ads").innerHTML = `
      ${flowBox("自动/手动活动、ACOS/TACOS 上限","烧钱词暂停、出单词加预算；超 cap 拦截","采纳建议","活动调整清单（演示）")}
      <div class="card">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <h3 style="margin:0">广告守门 · ACOS cap ${NH.adsCaps.acos}% / TACOS cap ${NH.adsCaps.tacos}%</h3>
          <span class="badge bad">未连接广告后台 · 只建议与拦截</span>
        </div>
        <p class="tiny muted" style="margin:8px 0">超标活动禁止「加预算」，仅允许暂停/否定词类动作。</p>
        <table><thead><tr><th>活动</th><th class="num">7日花费</th><th class="num">7日销售额</th><th class="num">ACOS</th><th>AI建议</th></tr></thead><tbody>${rows}</tbody></table>
      </div>`;
    $$("[data-adopt]").forEach(b => b.addEventListener("click", () => {
      const c = state.campaigns.find(x=>x.id===b.dataset.adopt);
      pushLog("广告守门", `${c.name} · 已采纳${b.dataset.mode==='pause'?'暂停':'优化'}建议（演示，未改后台）`);
      c.suggest = null;
      if (b.dataset.mode==='pause'){ c.status='paused'; c.acos = Math.min(c.acos, NH.adsCaps.acos-1); }
      renderAds();
    }));
  }

  function renderFba(){
    const rows = state.fba.map(r => `
      <tr>
        <td>${r.sku}<div class="tiny muted">${r.titleZh}</div></td>
        <td class="num">${r.avail}</td>
        <td class="num">${r.inbound}</td>
        <td class="num">${r.velocity}</td>
        <td class="num">${r.daysCover}</td>
        <td class="num">${r.safetyDays}</td>
        <td>${r.risk==='high'?'<span class="badge bad">断货风险</span>':r.risk==='mid'?'<span class="badge warn">偏低</span>':'<span class="badge ok">健康</span>'}</td>
        <td class="num">${r.reorderQty||"—"}</td>
        <td>${r.reorderQty?`<button class="btn primary" data-reorder="${r.sku}">确认补货单</button>`:"—"}</td>
      </tr>`).join("");
    $("#view-fba").innerHTML = `
      ${flowBox("FBA可售、在途、销速","可售天数、安全库存、补货量、断货风险","确认补货单","补货建议单（演示）")}
      <div class="card">
        <h3>FBA 库存与补货</h3>
        <table><thead><tr><th>SKU</th><th class="num">可售</th><th class="num">在途</th><th class="num">日均销</th><th class="num">可售天</th><th class="num">安全库存天</th><th>风险</th><th class="num">建议补货</th><th>动作</th></tr></thead><tbody>${rows}</tbody></table>
      </div>`;
    $$("[data-reorder]").forEach(b => b.addEventListener("click", () => {
      pushLog("FBA库存", `${b.dataset.reorder} 补货单已确认（演示）`);
      const r = state.fba.find(x=>x.sku===b.dataset.reorder);
      if (r){ r.inbound += r.reorderQty; r.reorderQty = 0; r.risk='low'; r.daysCover = Math.round((r.avail+r.inbound)/Math.max(r.velocity,0.1)); }
      state.todos = state.todos.filter(t => t.id !== "t2");
      renderFba();
    }));
  }

  function renderCs(){
    const cards = state.cs.map(item => `
      <div class="card ${item.risk==='high'?'high':''}" style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <div>
            <span class="badge ${item.risk==='high'?'bad':'info'}">${item.type}${item.risk==='high'?' · 高风险必须人工':''}</span>
            <strong style="margin-left:6px">${item.subject}</strong>
            <div class="tiny muted">${item.from} · ${item.sku}${item.stars?` · ★${item.stars}`:''}</div>
          </div>
          <div class="row-actions">
            <button class="btn primary" data-cs="${item.id}" ${item.status!=='pending'||item.risk==='high'?'disabled':''}>确认发送草稿</button>
            <button class="btn" data-cs-human="${item.id}">标记人工已处理</button>
          </div>
        </div>
        ${item.highRiskReason?`<div class="badge bad" style="margin-top:8px">原因：${item.highRiskReason}</div>`:''}
        <div class="tiny muted" style="margin-top:8px">原文</div>
        <div class="pre">${item.body}</div>
        <div class="grid g2" style="margin-top:8px">
          <div><div class="tiny muted">中文草稿</div><div class="pre">${item.draftZh}</div></div>
          <div><div class="tiny muted">英文草稿</div><div class="pre">${item.draftEn}</div></div>
        </div>
        <div class="tiny" style="margin-top:6px">建议动作：${item.suggest} · 状态 ${item.status}</div>
      </div>`).join("");
    $("#view-cs").innerHTML = `
      ${flowBox("买家消息 / 差评 / QA","中英回复草稿 + 退款/补发建议；侵权·安全·差评承诺标红","高风险必须人工；发送前确认","可发送回复 / 升级工单")}
      ${cards}`;
    $$("[data-cs]").forEach(b => b.addEventListener("click", () => {
      const item = state.cs.find(x=>x.id===b.dataset.cs);
      if (item.risk==='high') return;
      item.status = "sent_demo";
      pushLog("客服评论", `${item.id} 草稿已确认发送（演示）`);
      renderCs();
    }));
    $$("[data-cs-human]").forEach(b => b.addEventListener("click", () => {
      const item = state.cs.find(x=>x.id===b.dataset.csHuman);
      item.status = "human_done";
      pushLog("客服评论", `${item.id} 人工已处理`);
      if (item.id==="cs2") state.todos = state.todos.filter(t => t.id !== "t3");
      renderCs();
    }));
  }

  function renderProfit(){
    const rows = NH.orders.map(o => {
      const net = NH.calcNet(o);
      return `<tr>
        <td>${o.id}<div class="tiny muted">${o.date} · ${o.sku} ×${o.qty}</div></td>
        <td class="num">${money(o.sales)}</td>
        <td class="num">${money(o.ads)}</td>
        <td class="num">${money(o.refund)}</td>
        <td class="num">${money(o.headhaul)}</td>
        <td class="num">${money(o.fba)}</td>
        <td class="num">${money(o.referral)}</td>
        <td class="num">${money(o.cost)}</td>
        <td class="num" style="font-weight:600;color:${net>=0?'#047857':'#B91C1C'}">${money(net)}</td>
      </tr>`;
    }).join("");
    const tot = NH.orders.reduce((a,o)=>({
      sales:a.sales+o.sales, ads:a.ads+o.ads, refund:a.refund+o.refund,
      headhaul:a.headhaul+o.headhaul, fba:a.fba+o.fba, referral:a.referral+o.referral, cost:a.cost+o.cost
    }),{sales:0,ads:0,refund:0,headhaul:0,fba:0,referral:0,cost:0});
    const netAll = NH.calcNet(tot);
    $("#view-profit").innerHTML = `
      ${flowBox("订单/广告/退款/费用项","拆到一单：销售−广告−退款−头程−FBA−佣金−采购","老板确认口径","日报/周报净利表")}
      <div class="grid g4" style="margin-bottom:12px">
        <div class="card"><div class="tiny muted">销售额</div><div class="kpi" style="font-size:18px">${money(tot.sales)}</div></div>
        <div class="card"><div class="tiny muted">广告花费</div><div class="kpi" style="font-size:18px">${money(tot.ads)}</div></div>
        <div class="card"><div class="tiny muted">退款</div><div class="kpi" style="font-size:18px">${money(tot.refund)}</div></div>
        <div class="card"><div class="tiny muted">净利（演示）</div><div class="kpi" style="font-size:18px">${money(netAll)}</div></div>
      </div>
      <div class="card">
        <div style="display:flex;justify-content:space-between"><h3 style="margin:0">订单级利润瀑布</h3><span class="badge demo">${NH.shop.demoNote}</span></div>
        <p class="tiny muted">净利 = 销售 − 广告 − 退款 − 头程摊销 − FBA − 佣金 − 采购成本</p>
        <table><thead><tr><th>订单</th><th class="num">销售</th><th class="num">广告</th><th class="num">退款</th><th class="num">头程</th><th class="num">FBA</th><th class="num">佣金</th><th class="num">采购</th><th class="num">净利</th></tr></thead>
        <tbody>${rows}</tbody></table>
      </div>`;
  }

  function renderAll(){
    renderOverview(); renderSourcing(); renderListing(); renderAds(); renderFba(); renderCs(); renderProfit();
  }

  function boot(){
    $$(".nav button[data-view]").forEach(b => b.addEventListener("click", () => {
      setView(b.dataset.view);
      renderAll();
    }));
    setView("overview");
    renderAll();
  }
  document.addEventListener("DOMContentLoaded", boot);
})();
