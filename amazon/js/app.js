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
  const titles={overview:"总览",verdict:"选品裁决",map:"卖家每天在做什么",listing:"Listing",ads:"广告守门",fba:"FBA 补货",cs:"评论消息",weekly:"经营周报"};

  function setView(v){
    state.view=v;
    $$(".nav button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
    $$(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+v));
    $("#page-title").textContent=titles[v]||v;
    document.body.dataset.mod=v;
  }

  function feeBar(p,m){
    const parts=[
      ["采购",p.cogs,"#1E3A5F"],["头程",p.headhaul,"#0E7490"],["佣金",m.referral,"#6D28D9"],
      ["FBA",p.fba,"#1D4ED8"],["广告",p.adReserve,"#C2410C"],["退货",p.returnReserve,"#BE123C"],["净利",Math.max(m.net,0),"#047857"]
    ];
    const sum=parts.reduce((a,x)=>a+x[1],0)||1;
    return `<div class="fee">${parts.map(x=>`<span title="${x[0]} ${money(x[1])}" style="width:${(x[1]/sum*100).toFixed(1)}%;background:${x[2]}"></span>`).join("")}</div>
      <div class="legend">${parts.map(x=>`<span><i style="background:${x[2]}"></i>${x[0]} ${money(x[1])}</span>`).join("")}</div>`;
  }

  function renderOverview(){
    const verdicts=BX.candidates.map(p=>({p,v:BX.verdict(p)}));
    const counts={可做:0,观察:0,不可做:0};verdicts.forEach(x=>counts[x.v.conclusion]++);
    const processed=state.agents.reduce((a,x)=>a+x.processedToday,0);
    const sales=32.99*78+26.99*63+29.99*73+34.99*43;
    const ads=310+188+112+79;
    $("#view-overview").innerHTML=`
      <div class="modhead mod-overview">
        <div><span class="modtag">总控 · 运营主管 / 老板</span><h2>${BX.meta.shop}</h2>
        <p>${BX.meta.marketplace}。先看能不能做、今天谁在烧钱、谁快断货。${BX.meta.demoNote}</p></div>
        <div class="tiny">今日 Agent 已处理 <b style="font-size:20px">${processed}</b></div>
      </div>
      <div class="grid g6" style="margin-bottom:12px">
        <div class="kpi-tile k-teal"><div class="lbl">可做</div><div class="kpi">${counts.可做}</div><div class="tiny muted">八维全过</div></div>
        <div class="kpi-tile k-warn"><div class="lbl">观察</div><div class="kpi">${counts.观察}</div><div class="tiny muted">合规或供应未齐</div></div>
        <div class="kpi-tile k-bad"><div class="lbl">不可做</div><div class="kpi">${counts.不可做}</div><div class="tiny muted">净利/垄断/衰退</div></div>
        <div class="kpi-tile k-navy"><div class="lbl">周销售额</div><div class="kpi" style="font-size:18px">${money(sales)}</div><div class="tiny muted">样例 SKU 合计</div></div>
        <div class="kpi-tile k-warn"><div class="lbl">广告花费</div><div class="kpi" style="font-size:18px">${money(ads)}</div><div class="tiny muted">占销 ${pct(ads/sales)}</div></div>
        <div class="kpi-tile k-cyan"><div class="lbl">Agent 开启</div><div class="kpi">${state.agents.filter(a=>a.on).length}/6</div><div class="tiny muted">花钱动作仍待确认</div></div>
      </div>
      <div class="grid g2">
        <div class="card t-navy"><h3>各模块 Agent</h3>
          ${state.agents.map(a=>`<div class="agent"><div><b>${a.name}</b><div class="tiny muted">今日处理 ${a.processedToday} · 开关不代表已上架/已改预算</div></div>
            <div class="row-actions">
              <button class="switch ${a.on?"on":""}" data-tog="${a.id}"><i></i></button>
              <button class="btn" data-run="${a.id}">立即运行</button>
            </div></div>`).join("")}
        </div>
        <div class="card t-navy"><h3>运行日志</h3><div class="log" id="log-box"></div>
          <p class="tiny muted" style="margin-top:8px">上架、改预算、发信、下采购单一律停在「待人工确认」。${BX.meta.sampleNote}</p>
        </div>
      </div>
      <div class="card t-teal" style="margin-top:12px">
        <h3>一眼看懂：哪个品能做</h3>
        <table class="th-teal"><thead><tr><th>候选品</th><th>核心词</th><th>月销估</th><th class="num">净利率</th><th>阶段</th><th>结论</th><th>关键原因</th><th></th></tr></thead>
        <tbody>${verdicts.map(x=>`<tr>
          <td><b>${x.p.nameZh}</b></td>
          <td class="tiny">${x.p.keyword}</td>
          <td class="num">${x.p.monthlySalesEst.toLocaleString()}</td>
          <td class="num"><span class="fld fld-net">${pct(x.v.margin.rate)}</span></td>
          <td><span class="fld fld-time">${x.p.demandPhase}</span></td>
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
    box.innerHTML=(state.logs.slice(0,50).map(l=>`<div><span style="color:#94A3B8">${l.ts}</span> · <span style="color:#5EEAD4">${l.agent}</span> · ${l.msg}</div>`).join(""))||"<div>暂无日志</div>";
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
      return `<div class="card t-teal" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:flex-start">
          <div>
            <div style="font-weight:700;font-size:15px">${p.nameZh} <span class="tiny muted">${p.nameEn}</span></div>
            <div class="tiny" style="margin-top:4px">
              <span class="fld fld-comp">词 ${p.keyword}</span>
              <span class="fld fld-price">售价 ${money(p.price)}</span>
              <span class="fld fld-net">净利 ${pct(m.rate)}</span>
              <span class="fld fld-time">${p.demandPhase}</span>
              <span class="fld fld-ad">月销估 ${p.monthlySalesEst.toLocaleString()}</span>
            </div>
          </div>
          <div style="text-align:right">
            <span class="${vBadge(v.conclusion)}">${v.conclusion}</span>
            <div class="tiny" style="margin-top:6px;font-weight:650;color:#0F766E">${v.action}</div>
          </div>
        </div>
        <p style="margin:10px 0 4px;font-size:13px"><b>关键原因：</b>${v.reason}</p>
        ${feeBar(p,m)}
        <div class="tiny muted" style="margin:6px 0">CALC 净利 = 售价 − 采购 − 头程 − 佣金 − FBA − 广告预留 − 退货预留 = <b>${money(m.net)}</b>。低于 18% 直接不可做。</div>
        <div class="check-grid">${v.checks.map(c=>`
          <div class="check-item ${c.pass?"ok":"fail"}"><b>${c.key}</b> ${c.pass?"通过":"未过"} ${c.hard?`<span class="${vBadge(c.hard)}" style="margin-left:4px">${c.hard}</span>`:""}
            <div style="margin-top:4px">${c.detail}</div></div>`).join("")}</div>
      </div>`;
    }).join("");
    $("#view-verdict").innerHTML=`
      <div class="modhead mod-verdict">
        <div><span class="modtag">选品 · 选品岗</span><h2>八维齐备才可「可做」</h2>
        <p>需求、竞争、净利≥18%、合规、供应、退货、差异、节奏。缺一项不能给可做。衰退品强制停补+收缩，不建议补货。${BX.meta.sampleNote}</p></div>
      </div>${cards}`;
  }

  function renderMap(){
    const colors=["t-teal","t-blue","t-orange","t-green","t-rose","t-cyan"];
    $("#view-map").innerHTML=`
      <div class="modhead mod-map">
        <div><span class="modtag">对照 · 给老板讲清楚</span><h2>卖家每天在做什么 → 系统替掉什么</h2>
        <p>系统只做到草稿、标红和建议。上架、改预算、发信、下采购单必须人点确认。</p></div>
      </div>
      <div class="card t-violet">
        <table class="th-violet"><thead><tr>
          <th>环节</th><th>谁在做</th><th>卖家仍要做</th><th>系统替掉 / 加速</th><th>每天大约省下</th><th>必须人工确认</th>
        </tr></thead>
        <tbody>${BX.dailyMap.map((r,i)=>`<tr>
          <td><b>${r.job}</b></td>
          <td class="tiny">${r.who||"—"}</td>
          <td>${r.human}</td>
          <td>${r.system}</td>
          <td><span class="fld fld-time">${r.saved||"—"}</span></td>
          <td><span class="badge warn">${r.mustConfirm}</span></td>
        </tr>`).join("")}</tbody></table>
      </div>
      <div class="grid g3" style="margin-top:12px">
        ${BX.dailyMap.map((r,i)=>`<div class="card ${colors[i%colors.length]}"><h3>${r.job}</h3>
          <div class="tiny"><span class="fld fld-comp">人</span>${r.human}</div>
          <div class="tiny" style="margin-top:6px"><span class="fld fld-net">系统</span>${r.system}</div>
          <div class="tiny" style="margin-top:6px"><span class="fld fld-ad">确认点</span>${r.mustConfirm}</div>
        </div>`).join("")}
      </div>`;
  }

  function renderListing(){
    const L=state.listing;
    const titleLen=L.title.length;
    $("#view-listing").innerHTML=`
      <div class="modhead mod-listing">
        <div><span class="modtag">刊登 · 运营 / 文案</span><h2>Listing 草稿，确认进草稿，不上架</h2>
        <p>标题、五点、搜索词、A+、主图脚本都可改。点确认只进草稿，不调用上架接口。</p></div>
      </div>
      <div class="grid g4" style="margin-bottom:12px">
        <div class="kpi-tile k-blue"><div class="lbl">标题字符</div><div class="kpi">${titleLen}</div><div class="tiny muted">建议 ≤200</div></div>
        <div class="kpi-tile k-teal"><div class="lbl">五点</div><div class="kpi">${L.bullets.length}</div><div class="tiny muted">每条一个卖点</div></div>
        <div class="kpi-tile k-violet"><div class="lbl">搜索词</div><div class="kpi">${L.search.split(",").length}</div><div class="tiny muted">后台搜索词，非前台标题</div></div>
        <div class="kpi-tile ${L.status==="in_draft"?"k-ok":"k-warn"}"><div class="lbl">状态</div><div class="kpi" style="font-size:16px">${L.status==="in_draft"?"已进草稿":"待确认"}</div><div class="tiny muted">未上架</div></div>
      </div>
      <div class="card t-blue">
        <label class="field blue">标题 · 前台可见</label><textarea id="l-title" style="min-height:48px">${L.title}</textarea>
        <label class="field blue">五点 · 买家决策</label><textarea id="l-bullets" style="min-height:90px">${L.bullets.join("\n")}</textarea>
        <label class="field teal">后台搜索词</label><textarea id="l-search" style="min-height:40px">${L.search}</textarea>
        <label class="field blue">A+ 模块要点</label><textarea id="l-aplus" style="min-height:60px">${L.aplus.join("\n")}</textarea>
        <label class="field blue">主图脚本</label><textarea id="l-main" style="min-height:40px">${L.main}</textarea>
        <div class="row-actions" style="margin-top:10px">
          <span class="badge ${L.status==="in_draft"?"ok":"warn"}">${L.status==="in_draft"?"已进草稿":"编辑中 · 待确认"}</span>
          <button class="btn primary" id="btn-draft">确认进草稿（不上架）</button>
        </div>
        <p class="footer-note">样例文案对应「免钉墙钩」，非真实 ASIN。合规词（儿童、医疗功效）不在本条草稿里。</p>
      </div>`;
    $("#btn-draft").onclick=()=>{
      L.title=$("#l-title").value; L.bullets=$("#l-bullets").value.split("\n").filter(Boolean);
      L.search=$("#l-search").value; L.aplus=$("#l-aplus").value.split("\n").filter(Boolean); L.main=$("#l-main").value;
      L.status="in_draft"; log("Listing","人工确认 · 已进草稿 · 未上架"); renderListing(); paintLog();
    };
  }

  function renderAds(){
    const camps=[
      {name:"SP Auto · 瑜伽垫",sku:"BX-MAT",spend:310,sales:660,orders:24,clicks:410,loss:4,waste:"cheap yoga mat / kids mat"},
      {name:"SP Manual · 瑜伽垫",sku:"BX-MAT",spend:188,sales:320,orders:12,clicks:190,loss:5,waste:"thick mat 1 inch 精准词贵"},
      {name:"SP Auto · 台灯",sku:"BX-LAMP",spend:112,sales:468,orders:14,clicks:160,loss:0,waste:"—"},
      {name:"SP Auto · 收纳",sku:"BX-ORG",spend:79,sales:420,orders:14,clicks:98,loss:0,waste:"—"},
    ];
    const spend=camps.reduce((a,c)=>a+c.spend,0), sales=camps.reduce((a,c)=>a+c.sales,0);
    $("#view-ads").innerHTML=`
      <div class="modhead mod-ads">
        <div><span class="modtag">广告 · 广告运营</span><h2>ACOS 守门 ${pct(BX.rules.acosMax)}，不自动改预算</h2>
        <p>超阈值或连续亏损标红，只出建议。改预算、否词、暂停活动都要人确认。</p></div>
      </div>
      <div class="grid g4" style="margin-bottom:12px">
        <div class="kpi-tile k-warn"><div class="lbl">花费</div><div class="kpi">${money(spend)}</div></div>
        <div class="kpi-tile k-navy"><div class="lbl">广告销售额</div><div class="kpi">${money(sales)}</div></div>
        <div class="kpi-tile ${spend/sales>BX.rules.acosMax?"k-bad":"k-ok"}"><div class="lbl">整体 ACOS</div><div class="kpi">${pct(spend/sales)}</div></div>
        <div class="kpi-tile k-bad"><div class="lbl">标红活动</div><div class="kpi">${camps.filter(c=>(c.sales?c.spend/c.sales:1)>BX.rules.acosMax||c.loss>=3).length}</div></div>
      </div>
      <div class="card t-orange"><h3>活动明细 · 样例</h3>
      <table class="th-orange"><thead><tr>
        <th>活动</th><th>SKU</th><th class="num">花费</th><th class="num">销售额</th><th class="num">点击</th><th class="num">CPC</th><th class="num">出单</th><th class="num">ACOS</th><th>浪费词</th><th>状态</th><th>建议</th>
      </tr></thead>
      <tbody>${camps.map(c=>{
        const acos=c.sales?c.spend/c.sales:1; const bad=acos>BX.rules.acosMax||c.loss>=3;
        const tip=bad?(acos>BX.rules.acosMax?"暂停烧钱词 / 否词 / 降价测转化":"连续亏损 · 建议暂停"):"观察";
        const cpc=c.clicks?c.spend/c.clicks:0;
        return `<tr style="${bad?"background:#FFF7F5":""}"><td><b>${c.name}</b></td><td>${c.sku}</td>
          <td class="num">${money(c.spend)}</td><td class="num">${money(c.sales)}</td>
          <td class="num">${c.clicks}</td><td class="num">${money(cpc)}</td><td class="num">${c.orders}</td>
          <td class="num"><span class="fld ${bad?"fld-ad":"fld-net"}">${pct(acos)}</span></td>
          <td class="tiny">${c.waste}</td>
          <td>${bad?'<span class="verdict-no">标红</span>':'<span class="verdict-ok">正常</span>'}</td>
          <td class="tiny">${tip}<div style="margin-top:4px"><button class="btn" data-ad="${c.name}">待人工确认</button></div></td></tr>`;
      }).join("")}</tbody></table>
      <p class="footer-note">ACOS = 花费/广告销售额，页面内计算。点击、花费、销售额为样例，不是 Advertising API 回填。</p></div>`;
    $$("[data-ad]").forEach(b=>b.onclick=()=>{log("广告守门",b.dataset.ad+" · 建议已记录，预算未改");paintLog();});
  }

  function renderFba(){
    const rows=[
      {sku:"BX-ORG-03",name:"竹制桌面收纳",avail:72,inbound:100,daily:10.5,cost:6.8,eta:"10-18",wh:"美西 ONT8"},
      {sku:"BX-LAMP-01",name:"LED台灯",avail:380,inbound:0,daily:11.2,cost:8.4,eta:"—",wh:"美东 TEB9"},
      {sku:"BX-MAT-02",name:"瑜伽垫",avail:260,inbound:0,daily:9.0,cost:7.1,eta:"—",wh:"美西 LGB8"},
      {sku:"BX-CUSH-04",name:"记忆棉坐垫",avail:210,inbound:0,daily:6.2,cost:7.5,eta:"—",wh:"美中 IND9"},
    ];
    $("#view-fba").innerHTML=`
      <div class="modhead mod-fba">
        <div><span class="modtag">供应链 · 补货岗</span><h2>可售天低于 ${BX.rules.safetyDays} 天出建议，采购单待确认</h2>
        <p>可售天 =（可售+在途）/ 日销。建议量按安全天数再加 14 天覆盖。系统不下采购单。</p></div>
      </div>
      <div class="card t-green">
      <table class="th-green"><thead><tr>
        <th>SKU</th><th>仓</th><th class="num">可售</th><th class="num">在途</th><th class="num">日销</th>
        <th class="num">可售天</th><th class="num">库存金额</th><th class="num">建议补货</th><th>最晚发货</th><th>头程 ETA</th><th></th>
      </tr></thead>
      <tbody>${rows.map(r=>{
        const cover=(r.avail+r.inbound)/r.daily; const need=cover<BX.rules.safetyDays?Math.ceil((BX.rules.safetyDays-cover+14)*r.daily):0;
        const d=new Date(); d.setDate(d.getDate()+Math.max(1,Math.floor(cover-5)));
        const ship=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        const low=cover<BX.rules.safetyDays;
        return `<tr style="${low?"background:#F3FBF7":""}"><td><b>${r.sku}</b><div class="tiny muted">${r.name}</div></td>
          <td class="tiny">${r.wh}</td>
          <td class="num">${r.avail}</td><td class="num">${r.inbound}</td><td class="num">${r.daily}</td>
          <td class="num"><span class="fld ${low?"fld-ad":"fld-net"}">${cover.toFixed(1)}天</span></td>
          <td class="num">${money((r.avail+r.inbound)*r.cost)}</td>
          <td class="num">${need||"—"}</td><td>${need?ship:"—"}</td><td>${r.eta}</td>
          <td>${need?`<button class="btn primary" data-po="${r.sku}">确认采购单</button>`:"—"}</td></tr>`;
      }).join("")}</tbody></table>
      <p class="footer-note">可售天、建议量、最晚发货日为页面计算。库存与日销是样例，不是 SP-API Inventory。</p></div>`;
    $$("[data-po]").forEach(b=>b.onclick=()=>{log("FBA补货",b.dataset.po+" 采购单待执行（演示确认）");b.disabled=true;b.textContent="已确认";paintLog();});
  }

  function renderCs(){
    const items=[
      {id:"m1",type:"买家消息",risk:"low",sku:"BX-LAMP-01",order:"114-DEMO-1001",sla:"剩余 18h",draft:"Hi, sorry for the trouble. We can reship the USB cable in 5–7 business days if missing. Please reply with your order ID.",reason:null,topic:"缺件"},
      {id:"m2",type:"差评 ★2",risk:"high",sku:"BX-CUSH-04",order:"114-DEMO-2044",sla:"已超时 6h",draft:"[HUMAN] Sorry about the smell/flattening. Message us for refund/replace. We never ask to remove reviews.",reason:"品质-塌陷/异味",topic:"品质"},
      {id:"m3",type:"退货申请",risk:"low",sku:"BX-MAT-02",order:"114-DEMO-3188",sla:"剩余 2 天",draft:"We received your size-mismatch return. Refund follows Amazon policy after scan-in.",reason:"尺寸不符",topic:"尺寸"},
    ];
    $("#view-cs").innerHTML=`
      <div class="modhead mod-cs">
        <div><span class="modtag">客服 · 英语回复</span><h2>草稿先出，确认后才标已回复</h2>
        <p>高风险差评标红，禁止自动发信，也禁止引导删评。退货原因归到品质 / 尺寸 / 物流。</p></div>
      </div>
      <div class="grid g3" style="margin-bottom:12px">
        <div class="kpi-tile k-bad"><div class="lbl">高风险</div><div class="kpi">${items.filter(m=>m.risk==="high").length}</div><div class="tiny muted">必须人工定调</div></div>
        <div class="kpi-tile k-warn"><div class="lbl">待回复</div><div class="kpi" id="cs-open">${items.length}</div><div class="tiny muted">确认后才减</div></div>
        <div class="kpi-tile k-rose" style="border-left-color:#BE123C"><div class="lbl">超时</div><div class="kpi">1</div><div class="tiny muted">差评已超买家消息 SLA</div></div>
      </div>
      ${items.map(m=>`<div class="card ${m.risk==="high"?"t-rose high":"t-rose"}" style="margin-bottom:10px">
        <div class="row-actions">
          <b>${m.type}</b>
          <span class="fld fld-price">${m.sku}</span>
          <span class="fld fld-time">${m.order}</span>
          <span class="fld ${m.sla.indexOf("超时")>=0?"fld-ad":"fld-net"}">${m.sla}</span>
          <span class="fld fld-comp">${m.topic}</span>
          ${m.reason?`<span class="badge warn">退货归类：${m.reason}</span>`:""}
          ${m.risk==="high"?'<span class="verdict-no">高风险必须人工</span>':""}
        </div>
        <div class="pre" style="margin:8px 0">${m.draft}</div>
        <button class="btn primary" data-cs="${m.id}">人工确认 · 标已回复</button>
      </div>`).join("")}`;
    $$("[data-cs]").forEach(b=>b.onclick=()=>{
      log("评论消息",b.dataset.cs+" 已人工确认并标已回复（未真实发信）");
      b.disabled=true;b.textContent="已回复（未真实发信）";
      const n=$("#cs-open"); if(n) n.textContent=String($$("[data-cs]:not(:disabled)").length);
      paintLog();
    });
  }

  function renderWeekly(){
    const skus=[
      {sku:"BX-LAMP-01",name:"LED台灯",units:78,price:32.99,ad:112,ret:2},
      {sku:"BX-MAT-02",name:"瑜伽垫",units:63,price:26.99,ad:498,ret:3},
      {sku:"BX-ORG-03",name:"竹制收纳",units:73,price:29.99,ad:79,ret:1},
      {sku:"BX-CUSH-04",name:"记忆棉坐垫",units:43,price:34.99,ad:0,ret:5},
    ];
    const sales=skus.reduce((a,s)=>a+s.price*s.units,0);
    const ads=skus.reduce((a,s)=>a+s.ad,0);
    const units=skus.reduce((a,s)=>a+s.units,0);
    const rets=skus.reduce((a,s)=>a+s.ret,0);
    $("#view-weekly").innerHTML=`
      <div class="modhead mod-weekly">
        <div><span class="modtag">财务 / 老板</span><h2>一页周报：卖了多少、广告吃掉多少、谁在退、谁要断</h2>
        <p>口径是演示测算，不是 Settlement 报表。对外发给团队仍要人工点发送。</p></div>
      </div>
      <div class="grid g4" style="margin-bottom:12px">
        <div class="kpi-tile k-navy"><div class="lbl">周销售额</div><div class="kpi" style="font-size:18px">${money(sales)}</div><div class="tiny muted">${units} 件</div></div>
        <div class="kpi-tile k-warn"><div class="lbl">广告花费</div><div class="kpi" style="font-size:18px">${money(ads)}</div><div class="tiny muted">占销 ${pct(ads/sales)}</div></div>
        <div class="kpi-tile k-bad"><div class="lbl">退货率</div><div class="kpi" style="font-size:18px">${pct(rets/units)}</div><div class="tiny muted">${rets} 件 / ${units} 件</div></div>
        <div class="kpi-tile k-cyan"><div class="lbl">断货风险</div><div class="kpi" style="font-size:18px">1 SKU</div><div class="tiny muted">BX-ORG-03 可售天偏低</div></div>
      </div>
      <div class="card t-cyan">
        <h3>按 SKU</h3>
        <table class="th-cyan"><thead><tr>
          <th>SKU</th><th class="num">件数</th><th class="num">销售额</th><th class="num">广告</th><th class="num">广告占销</th><th class="num">退货件</th><th class="num">退货率</th><th>老板要看的一句</th>
        </tr></thead><tbody>
        ${skus.map(s=>{
          const rev=s.price*s.units; const share=rev?s.ad/rev:0; const rr=s.units?s.ret/s.units:0;
          let note="正常观察";
          if(share>0.35) note="广告吃太深，先否词再加预算";
          else if(rr>0.08) note="退货偏高，先看差评再补货";
          else if(s.sku==="BX-ORG-03") note="动销好但可售天不够，采购单待确认";
          return `<tr><td><b>${s.sku}</b><div class="tiny muted">${s.name}</div></td>
            <td class="num">${s.units}</td><td class="num">${money(rev)}</td><td class="num">${money(s.ad)}</td>
            <td class="num"><span class="fld ${share>0.35?"fld-ad":"fld-net"}">${pct(share)}</span></td>
            <td class="num">${s.ret}</td>
            <td class="num"><span class="fld ${rr>0.08?"fld-ret":"fld-net"}">${pct(rr)}</span></td>
            <td class="tiny">${note}</td></tr>`;
        }).join("")}
        </tbody></table>
        <p class="footer-note">${BX.meta.demoNote} · 毛利请回选品裁决看单件公式，这里不把销售额当成利润。</p>
      </div>`;
  }

  function renderAll(){
    renderOverview();renderVerdict();renderMap();renderListing();renderAds();renderFba();renderCs();renderWeekly();
  }
  document.addEventListener("DOMContentLoaded",()=>{
    $$(".nav button[data-view]").forEach(b=>b.addEventListener("click",()=>{setView(b.dataset.view);renderAll();}));
    $("#btn-run-all").onclick=runAll;
    setView("overview"); renderAll();
  });
})();
