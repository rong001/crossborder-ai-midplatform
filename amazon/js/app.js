(function(){
  const $=(s,el=document)=>el.querySelector(s);
  const $$=(s,el=document)=>[...el.querySelectorAll(s)];
  const state={ view:"overview", agents:JSON.parse(JSON.stringify(BX.agents)), logs:[...BX.logs],
    listing:{ title:"Adhesive Wall Hooks Heavy Duty 12 Pack Waterproof Removable",
      bullets:["Holds up to 15 lbs on clean tile/glass/metal","Damage-free twist removal","Waterproof for bath/kitchen","12-pack large+medium","Tool-free install ~60s"],
      search:"adhesive wall hooks, damage free hooks, towel hooks no drill",
      aplus:["打孔vs免钉","承重15lbs","场景拼图","安装四步","清单Q&A"],
      main:"白底平铺12件 · 角标15lbs", status:"editing" } };

  function ts(){const d=new Date(),p=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;}
  function log(agent,msg){state.logs.unshift({ts:ts(),agent,msg});}
  function money(n){return "$"+Number(n).toFixed(2);}
  function pct(n){return (n*100).toFixed(1)+"%";}
  function vBadge(c){return c==="可做"?"verdict-ok":c==="观察"?"verdict-watch":"verdict-no";}

  function setView(v){
    state.view=v;
    $$(".nav button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
    $$(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+v));
    $("#page-title").textContent={overview:"总览",verdict:"选品裁决",map:"卖家每天在做什么",listing:"Listing",ads:"广告守门",fba:"FBA 补货",cs:"评论消息",weekly:"经营周报"}[v]||v;
  }

  function renderOverview(){
    const verdicts=BX.candidates.map(p=>({p,v:BX.verdict(p)}));
    const counts={可做:0,观察:0,不可做:0};verdicts.forEach(x=>counts[x.v.conclusion]++);
    const processed=state.agents.reduce((a,x)=>a+x.processedToday,0);
    $("#view-overview").innerHTML=`
      <div class="grid g4" style="margin-bottom:12px">
        <div class="card"><div class="tiny muted">店铺</div><div style="font-weight:600">${BX.meta.shop}</div><div class="tiny muted">${BX.meta.marketplace}</div></div>
        <div class="card"><div class="tiny muted">今日已处理</div><div class="kpi">${processed}</div></div>
        <div class="card"><div class="tiny muted">裁决 · 可做/观察/不可做</div><div class="kpi" style="font-size:16px">${counts.可做} / ${counts.观察} / ${counts.不可做}</div></div>
        <div class="card"><div class="tiny muted">Agent 开启</div><div class="kpi">${state.agents.filter(a=>a.on).length}/6</div></div>
      </div>
      <div class="grid g2">
        <div class="card"><h3>各 Agent</h3>
          ${state.agents.map(a=>`<div class="agent"><div><b>${a.name}</b><div class="tiny muted">今日处理 ${a.processedToday}</div></div>
            <div class="row-actions">
              <button class="switch ${a.on?"on":""}" data-tog="${a.id}"><i></i></button>
              <button class="btn" data-run="${a.id}">立即运行</button>
            </div></div>`).join("")}
        </div>
        <div class="card"><h3>运行日志</h3><div class="log" id="log-box"></div>
          <p class="tiny muted" style="margin-top:8px">花钱/对外动作一律停在「待人工确认」。${BX.meta.demoNote}</p>
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>一眼看懂：哪个品能做</h3>
        <table><thead><tr><th>候选品</th><th>结论</th><th>关键原因</th><th></th></tr></thead>
        <tbody>${verdicts.map(x=>`<tr>
          <td>${x.p.nameZh}<div class="tiny muted">${x.p.keyword}</div></td>
          <td><span class="${vBadge(x.v.conclusion)}">${x.v.conclusion}</span></td>
          <td class="tiny">${x.v.reason}</td>
          <td><button class="btn" data-goto="verdict">看八维</button></td>
        </tr>`).join("")}</tbody></table>
      </div>`;
    paintLog();
    $$("[data-tog]").forEach(b=>b.onclick=()=>{const a=state.agents.find(x=>x.id===b.dataset.tog);a.on=!a.on;log(a.name,a.on?"开启":"关闭");renderOverview();});
    $$("[data-run]").forEach(b=>b.onclick=()=>runOne(b.dataset.run));
    $$("[data-goto]").forEach(b=>b.onclick=()=>{setView(b.dataset.goto);renderAll();});
  }
  function paintLog(){
    const box=$("#log-box"); if(!box)return;
    box.innerHTML=(state.logs.slice(0,50).map(l=>`<div><span style="color:#94A3B8">${l.ts}</span> · <span style="color:#93C5FD">${l.agent}</span> · ${l.msg}</div>`).join(""))||"<div class='muted'>暂无日志</div>";
  }

  function runOne(id){
    const a=state.agents.find(x=>x.id===id); if(!a||!a.on){log("系统", (a?a.name:"?")+"未开启");paintLog();return;}
    a.processedToday++;
    if(id==="verdict"){
      const vs=BX.candidates.map(p=>BX.verdict(p));
      log("选品裁决", `完成6品裁决 · 可做${vs.filter(v=>v.conclusion==="可做").length} · 观察${vs.filter(v=>v.conclusion==="观察").length} · 不可做${vs.filter(v=>v.conclusion==="不可做").length}`);
    } else if(id==="listing") log("Listing","生成草稿 · 待人工确认进草稿（不上架）");
    else if(id==="ads") log("广告守门","扫描SP · 超ACOS35%已标红 · 建议待确认（不改预算）");
    else if(id==="fba") log("FBA补货","刷新可售天 · 低于21天出补货建议 · 待确认采购单");
    else if(id==="cs") log("评论消息","英文草稿已备 · 待确认后才标已回复");
    else if(id==="weekly") log("经营周报","周报页已刷新 · 对外发送需人工");
    renderAll();
  }
  function runAll(){
    ["verdict","listing","ads","fba","cs","weekly"].forEach((id,i)=>setTimeout(()=>runOne(id),120*i));
  }

  function renderVerdict(){
    const cards=BX.candidates.map(p=>{
      const v=BX.verdict(p); const m=v.margin;
      return `<div class="card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:flex-start">
          <div>
            <div style="font-weight:600;font-size:14px">${p.nameZh} <span class="tiny muted">${p.nameEn}</span></div>
            <div class="tiny muted">核心词 ${p.keyword} · 月销估 ${p.monthlySalesEst}</div>
          </div>
          <div style="text-align:right">
            <span class="${vBadge(v.conclusion)}">${v.conclusion}</span>
            <div class="tiny muted" style="margin-top:4px">${v.action}</div>
          </div>
        </div>
        <p style="margin:8px 0;font-size:12px"><b>关键原因：</b>${v.reason}</p>
        <div class="tiny muted" style="margin-bottom:6px">CALC 净利 = 售价${money(p.price)} − 采购${money(p.cogs)} − 头程${money(p.headhaul)} − 佣金${money(m.referral)} − FBA${money(p.fba)} − 广告预留${money(p.adReserve)} − 退货预留${money(p.returnReserve)} = <b>${money(m.net)}</b>（${pct(m.rate)}）</div>
        <div class="check-grid">${v.checks.map(c=>`
          <div class="check-item ${c.pass?"ok":"fail"}"><b>${c.key}</b> ${c.pass?"✓":"×"} ${c.hard?`<span class="${vBadge(c.hard)}" style="margin-left:4px">${c.hard}</span>`:""}
            <div>${c.detail}</div></div>`).join("")}</div>
      </div>`;
    }).join("");
    $("#view-verdict").innerHTML=`
      <div class="card" style="margin-bottom:12px">
        <h3 style="margin:0 0 6px">选品裁决 · 八维齐备才可「可做」</h3>
        <p class="tiny muted" style="margin:0">需求 · 竞争 · 净利(≥18%) · 合规 · 供应 · 退货 · 差异 · 节奏。缺一项不能给可做。衰退品强制停补+收缩。${BX.meta.sampleNote}</p>
      </div>${cards}`;
  }

  function renderMap(){
    $("#view-map").innerHTML=`
      <div class="card">
        <h3>卖家每天在做什么 → 系统替掉什么</h3>
        <table><thead><tr><th>环节</th><th>卖家仍要做</th><th>系统替掉/加速</th><th>必须人工确认</th></tr></thead>
        <tbody>${BX.dailyMap.map(r=>`<tr><td><b>${r.job}</b></td><td>${r.human}</td><td>${r.system}</td><td><span class="badge warn">${r.mustConfirm}</span></td></tr>`).join("")}</tbody></table>
        <p class="tiny muted">上架、改预算、发信、下采购单 —— 一律不自动执行。</p>
      </div>`;
  }

  function renderListing(){
    const L=state.listing;
    $("#view-listing").innerHTML=`
      <div class="card">
        <h3>Listing 草稿（可改 · 确认进草稿 · 不上架）</h3>
        <label class="tiny muted">标题</label><textarea id="l-title" style="width:100%;min-height:48px;margin:4px 0 8px">${L.title}</textarea>
        <label class="tiny muted">五点（每行一条）</label><textarea id="l-bullets" style="width:100%;min-height:90px;margin:4px 0 8px">${L.bullets.join("\n")}</textarea>
        <label class="tiny muted">搜索词</label><textarea id="l-search" style="width:100%;min-height:40px;margin:4px 0 8px">${L.search}</textarea>
        <label class="tiny muted">A+ 要点</label><textarea id="l-aplus" style="width:100%;min-height:60px;margin:4px 0 8px">${L.aplus.join("\n")}</textarea>
        <label class="tiny muted">主图脚本</label><textarea id="l-main" style="width:100%;min-height:40px;margin:4px 0 8px">${L.main}</textarea>
        <div class="row-actions">
          <span class="badge ${L.status==="in_draft"?"ok":"warn"}">${L.status==="in_draft"?"已进草稿":"编辑中 · 待确认"}</span>
          <button class="btn primary" id="btn-draft">确认进草稿（不上架）</button>
        </div>
      </div>`;
    $("#btn-draft").onclick=()=>{
      L.title=$("#l-title").value; L.bullets=$("#l-bullets").value.split("\n").filter(Boolean);
      L.search=$("#l-search").value; L.aplus=$("#l-aplus").value.split("\n").filter(Boolean); L.main=$("#l-main").value;
      L.status="in_draft"; log("Listing","人工确认 · 已进草稿 · 未上架"); renderListing(); paintLog();
    };
  }

  function renderAds(){
    const camps=[
      {name:"SP Auto · 瑜伽垫",sku:"BX-MAT",spend:310,sales:660,orders:24,loss:4},
      {name:"SP Manual · 瑜伽垫",sku:"BX-MAT",spend:188,sales:320,orders:12,loss:5},
      {name:"SP Auto · 台灯",sku:"BX-LAMP",spend:112,sales:468,orders:14,loss:0},
      {name:"SP Auto · 收纳",sku:"BX-ORG",spend:79,sales:420,orders:14,loss:0},
    ];
    $("#view-ads").innerHTML=`
      <div class="card"><h3>广告守门 · ACOS 阈值 ${pct(BX.rules.acosMax)} · 不自动改预算</h3>
      <table><thead><tr><th>活动</th><th class="num">花费</th><th class="num">销售额</th><th class="num">出单</th><th class="num">ACOS</th><th>状态</th><th>建议（待确认）</th></tr></thead>
      <tbody>${camps.map(c=>{
        const acos=c.sales?c.spend/c.sales:1; const bad=acos>BX.rules.acosMax||c.loss>=3;
        const tip=bad?(acos>BX.rules.acosMax?"暂停烧钱词 / 否词 / 降价测转化":"连续亏损·建议暂停"):"观察";
        return `<tr><td>${c.name}</td><td class="num">${money(c.spend)}</td><td class="num">${money(c.sales)}</td><td class="num">${c.orders}</td>
          <td class="num">${pct(acos)}</td><td>${bad?'<span class="verdict-no">标红</span>':'<span class="verdict-ok">正常</span>'}</td>
          <td class="tiny">${tip} <button class="btn" data-ad="${c.name}">待人工确认</button></td></tr>`;
      }).join("")}</tbody></table></div>`;
    $$("[data-ad]").forEach(b=>b.onclick=()=>{log("广告守门",b.dataset.ad+" · 建议已记录，预算未改");paintLog();alert("已记入待确认，未改后台预算");});
  }

  function renderFba(){
    const rows=[
      {sku:"BX-ORG-03",name:"竹制桌面收纳",avail:72,inbound:100,daily:10.5},
      {sku:"BX-LAMP-01",name:"LED台灯",avail:380,inbound:0,daily:11.2},
      {sku:"BX-MAT-02",name:"瑜伽垫",avail:260,inbound:0,daily:9.0},
      {sku:"BX-CUSH-04",name:"记忆棉坐垫",avail:210,inbound:0,daily:6.2},
    ];
    $("#view-fba").innerHTML=`
      <div class="card"><h3>FBA · 安全天数 ${BX.rules.safetyDays} · 补货待确认采购单</h3>
      <table><thead><tr><th>SKU</th><th class="num">可售</th><th class="num">在途</th><th class="num">日销</th><th class="num">可售天</th><th class="num">建议补货</th><th>最晚发货</th><th></th></tr></thead>
      <tbody>${rows.map(r=>{
        const cover=(r.avail+r.inbound)/r.daily; const need=cover<BX.rules.safetyDays?Math.ceil((BX.rules.safetyDays-cover+14)*r.daily):0;
        const d=new Date(); d.setDate(d.getDate()+Math.max(1,Math.floor(cover-5)));
        const ship=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        return `<tr><td>${r.sku}<div class="tiny muted">${r.name}</div></td>
          <td class="num">${r.avail}</td><td class="num">${r.inbound}</td><td class="num">${r.daily}</td>
          <td class="num">${cover.toFixed(1)}${cover<BX.rules.safetyDays?' <span class="verdict-no">低</span>':''}</td>
          <td class="num">${need||"—"}</td><td>${need?ship:"—"}</td>
          <td>${need?`<button class="btn primary" data-po="${r.sku}">确认采购单</button>`:"—"}</td></tr>`;
      }).join("")}</tbody></table></div>`;
    $$("[data-po]").forEach(b=>b.onclick=()=>{log("FBA补货",b.dataset.po+" 采购单待执行（演示确认）");paintLog();});
  }

  function renderCs(){
    const items=[
      {id:"m1",type:"消息",risk:"low",sku:"BX-LAMP-01",draft:"Hi, sorry for the trouble. We can reship the USB cable in 5–7 business days if missing. Please reply with your order ID.",reason:null},
      {id:"m2",type:"差评★2",risk:"high",sku:"BX-CUSH-04",draft:"[HUMAN] Sorry about the smell/flattening. Message us for refund/replace. We never ask to remove reviews.",reason:"品质-塌陷/异味"},
      {id:"m3",type:"退货",risk:"low",sku:"BX-MAT-02",draft:"We received your size-mismatch return. Refund follows Amazon policy after scan-in.",reason:"尺寸不符"},
    ];
    $("#view-cs").innerHTML=`<div class="card"><h3>评论与买家消息 · 英文草稿 · 确认后才标已回复</h3>
      ${items.map(m=>`<div class="card ${m.risk==="high"?"high":""}" style="margin:8px 0">
        <b>${m.type}</b> ${m.sku} ${m.reason?`<span class="badge warn">退货归类：${m.reason}</span>`:""}
        ${m.risk==="high"?'<span class="verdict-no">高风险必须人工</span>':""}
        <div class="pre" style="margin:8px 0">${m.draft}</div>
        <button class="btn primary" data-cs="${m.id}">人工确认 · 标已回复</button>
      </div>`).join("")}</div>`;
    $$("[data-cs]").forEach(b=>b.onclick=()=>{log("评论消息",b.dataset.cs+" 已人工确认并标已回复（未真实发信）");b.disabled=true;b.textContent="已回复";paintLog();});
  }

  function renderWeekly(){
    const sales=32.99*78+26.99*63+29.99*73+34.99*43;
    const ads=310+188+112+79;
    const returns=(2+3+1+5)/(78+63+73+43);
    $("#view-weekly").innerHTML=`
      <div class="grid g4" style="margin-bottom:12px">
        <div class="card"><div class="tiny muted">周销量额</div><div class="kpi" style="font-size:18px">${money(sales)}</div></div>
        <div class="card"><div class="tiny muted">广告花费</div><div class="kpi" style="font-size:18px">${money(ads)}</div></div>
        <div class="card"><div class="tiny muted">退货率</div><div class="kpi" style="font-size:18px">${pct(returns)}</div></div>
        <div class="card"><div class="tiny muted">断货风险</div><div class="kpi" style="font-size:18px">1 SKU</div><div class="tiny muted">BX-ORG-03 可售天偏低</div></div>
      </div>
      <div class="card"><h3>老板一页周报</h3>
        <p>毛利：按选品公式口径演示测算（非 Settlement）。广告占销 ${pct(ads/sales)}。</p>
        <p>行动：瑜伽垫广告标红待否词；收纳补货待确认采购单；坐垫差评高风险待人工。</p>
        <p class="tiny muted">${BX.meta.demoNote} · 对外发送周报需人工。</p>
      </div>`;
  }

  function renderAll(){
    renderOverview();renderVerdict();renderMap();renderListing();renderAds();renderFba();renderCs();renderWeekly();
  }
  document.addEventListener("DOMContentLoaded",()=>{
    $$(".nav button[data-view]").forEach(b=>b.addEventListener("click",()=>{setView(b.dataset.view);renderAll();}));
    $("#btn-run-all").onclick=runAll;
    setView("overview"); renderAll();
    // precompute for console
    console.table(BX.candidates.map(p=>{const v=BX.verdict(p);return{品:p.nameZh,结论:v.conclusion,原因:v.reason};}));
  });
})();