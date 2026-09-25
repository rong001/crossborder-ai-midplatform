/* Crossborder AI OS — shared 操作手册 + 上手向导 */
(function () {
  'use strict';
  var APP = (window.CB_APP && window.CB_APP.id) || detectAppId();
  var GUIDE = (window.CB_GUIDES && window.CB_GUIDES[APP]) || null;
  var LS_WIZ = 'cb-wizard-' + APP;
  var LS_SEEN = 'cb-wizard-seen-' + APP;
  var LS_RULES = 'cb-rules-' + APP;
  var LS_CFG = 'cb-cfg-' + APP;

  function detectAppId() {
    var p = (location.pathname || '').replace(/\/+$/, '');
    var parts = p.split('/').filter(Boolean);
    var last = parts[parts.length - 1] || '';
    var prev = parts[parts.length - 2] || '';
    var apps = ['midplatform','erp','oms','wms','ads','cs','bi','finance'];
    if (apps.indexOf(last) >= 0) return last;
    if (last === 'index.html' && apps.indexOf(prev) >= 0) return prev;
    return 'portal';
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_WIZ) || '{}'); } catch (e) { return {}; }
  }
  function saveState(st) {
    localStorage.setItem(LS_WIZ, JSON.stringify(st));
  }
  function loadRules() {
    try { return JSON.parse(localStorage.getItem(LS_RULES) || '{}'); } catch (e) { return {}; }
  }
  function saveRules(r) { localStorage.setItem(LS_RULES, JSON.stringify(r)); }

  function ensureHost() {
    if ($('#cb-guide-root')) return $('#cb-guide-root');
    var root = document.createElement('div');
    root.id = 'cb-guide-root';
    document.body.appendChild(root);
    return root;
  }

  function injectTopbarButtons() {
    if (!GUIDE) return;
    var headerRight = null;
    var header = document.querySelector('header');
    if (header && header.children && header.children.length) {
      headerRight = header.children[header.children.length - 1];
    }
    if (!headerRight) {
      var navRow = document.querySelector('nav.portal-nav .max-w-6xl > div');
      if (navRow && navRow.children && navRow.children.length) {
        headerRight = navRow.children[navRow.children.length - 1];
      }
    }
    if (!headerRight) {
      headerRight = document.querySelector('nav.portal-nav .flex.items-center.gap-5');
    }
    if (!headerRight) return;
    if (headerRight.querySelector('[data-cb-guide-btns]')) return;

    var wrap = document.createElement('div');
    wrap.setAttribute('data-cb-guide-btns', '1');
    wrap.className = 'cb-guide-btns';
    wrap.innerHTML =
      '<button type="button" class="cb-btn-manual" id="cb-btn-manual" title="操作手册">' +
        '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>' +
        '<span>操作手册</span></button>' +
      '<button type="button" class="cb-btn-wizard" id="cb-btn-wizard" title="上手向导">' +
        '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>' +
        '<span>上手向导</span><span class="cb-wiz-progress" id="cb-wiz-progress-pill"></span></button>';
    // Insert before last primary CTA if portal
    var primary = headerRight.querySelector('a.btn-primary, button.btn-primary');
    if (primary && primary.parentElement === headerRight) {
      headerRight.insertBefore(wrap, primary);
    } else {
      headerRight.insertBefore(wrap, headerRight.firstChild);
    }
    $('#cb-btn-manual').addEventListener('click', openManual);
    $('#cb-btn-wizard').addEventListener('click', function () { openWizard(); });
    updateProgressPill();
  }

  function updateProgressPill() {
    var pill = $('#cb-wiz-progress-pill');
    if (!pill || !GUIDE) return;
    var st = loadState();
    var steps = GUIDE.wizard || [];
    var done = 0;
    steps.forEach(function (s) { if (st.steps && st.steps[s.id] && st.steps[s.id].done) done++; });
    if (done === 0) { pill.textContent = ''; pill.style.display = 'none'; return; }
    pill.style.display = 'inline-flex';
    pill.textContent = done + '/' + steps.length;
  }

  function softenOneClick() {
    // Relabel dangerous one-click CTAs; wrap bulk automation in disclosure where possible
    $all('button, a').forEach(function (el) {
      var t = (el.textContent || '').trim();
      if (!t) return;
      if (/^一键采纳/.test(t) || t === '一键采纳') {
        el.textContent = '查看推荐并确认';
        el.classList.add('cb-softened');
      } else if (/一键采纳建议/.test(t)) {
        el.textContent = '查看推荐并确认';
        el.classList.add('cb-softened');
      } else if (/批量.*一键|一键.*履约|一键.*全|批量自动/.test(t)) {
        el.textContent = '进阶：模拟全自动（需确认）';
        el.classList.add('cb-advanced-cta');
        wrapAdvanced(el);
      } else if (t === '模拟运行' || /^模拟运行/.test(t)) {
        // keep but mark as demo simulation
        if (!el.dataset.cbSoft) {
          el.dataset.cbSoft = '1';
          el.title = '仅演示编排动画，不会跳过审批门';
        }
      }
    });
  }

  function wrapAdvanced(btn) {
    if (btn.closest('.cb-advanced-wrap')) return;
    var wrap = document.createElement('details');
    wrap.className = 'cb-advanced-wrap';
    var sum = document.createElement('summary');
    sum.textContent = '进阶选项：全自动演示（需确认）';
    var parent = btn.parentNode;
    parent.insertBefore(wrap, btn);
    wrap.appendChild(sum);
    var box = document.createElement('div');
    box.className = 'cb-advanced-body';
    box.innerHTML = '<p class="cb-advanced-note">默认推荐「按向导下一步」与「批准此条」。全自动仅用于架构演示，不会绕过真实审批门。</p>';
    wrap.appendChild(box);
    box.appendChild(btn);
  }

  function renderManualHtml(m, name) {
    function list(arr) {
      return '<ul class="cb-ul">' + (arr || []).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    }
    function faq(arr) {
      return (arr || []).map(function (qa) {
        return '<div class="cb-faq"><div class="cb-faq-q">Q：' + qa[0] + '</div><div class="cb-faq-a">' + qa[1] + '</div></div>';
      }).join('');
    }
    return (
      '<div class="cb-manual">' +
        '<section><h3>1. 这个系统解决什么</h3><p>' + m.solve + '</p></section>' +
        '<section><h3>2. 界面怎么看</h3><p>' + m.ui + '</p></section>' +
        '<section><h3>3. 小白第一周怎么用</h3>' + list(m.week1) + '</section>' +
        '<section><h3>4. 要准备的知识库</h3>' + list(m.kb) + '</section>' +
        '<section><h3>5. 要适配的规则</h3>' + list(m.rules) + '</section>' +
        '<section><h3>6. 数据怎么进来</h3><p>' + m.dataIn + '</p>' +
          '<div class="cb-data-panel" id="cb-data-panel-manual">' +
            '<div class="cb-data-title">数据接入（演示）</div>' +
            '<div class="cb-data-row"><span>平台连接</span><button type="button" class="btn-ghost btn-sm" data-cb-mock="connect">模拟授权</button></div>' +
            '<div class="cb-data-row"><span>CSV 导入</span><button type="button" class="btn-ghost btn-sm" data-cb-mock="csv">选择文件</button></div>' +
            '<div class="cb-data-row"><span>演示数据</span><button type="button" class="btn-primary btn-sm" data-cb-mock="demo">使用演示数据</button></div>' +
            '<div class="cb-data-status" id="cb-data-status-manual">尚未接入</div>' +
          '</div></section>' +
        '<section><h3>7. 怎么筛选看到自己要的信息</h3><p>' + m.filter + '</p></section>' +
        '<section><h3>8. AI 在哪里起作用</h3><p>' + m.aiRole + '</p></section>' +
        '<section><h3>9. 常见问题</h3>' + faq(m.faq) + '</section>' +
      '</div>'
    );
  }

  function openManual() {
    if (!GUIDE) return;
    var root = ensureHost();
    root.innerHTML =
      '<div class="cb-overlay" id="cb-overlay"></div>' +
      '<aside class="cb-drawer" role="dialog" aria-label="操作手册">' +
        '<div class="cb-drawer-head">' +
          '<div><div class="cb-drawer-kicker">操作手册</div>' +
          '<div class="cb-drawer-title">' + GUIDE.name + '</div></div>' +
          '<button type="button" class="cb-icon-btn" id="cb-drawer-close" aria-label="关闭">×</button>' +
        '</div>' +
        '<div class="cb-drawer-body">' + renderManualHtml(GUIDE.manual, GUIDE.name) + '</div>' +
        '<div class="cb-drawer-foot">' +
          '<button type="button" class="btn-ghost btn-sm" id="cb-open-wiz-from-manual">打开上手向导</button>' +
          '<button type="button" class="btn-primary btn-sm" id="cb-drawer-close-2">知道了</button>' +
        '</div>' +
      '</aside>';
    function close() { root.innerHTML = ''; }
    $('#cb-overlay').onclick = close;
    $('#cb-drawer-close').onclick = close;
    $('#cb-drawer-close-2').onclick = close;
    $('#cb-open-wiz-from-manual').onclick = function () { close(); openWizard(); };
    $all('[data-cb-mock]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = $('#cb-data-status-manual');
        var kind = b.getAttribute('data-cb-mock');
        if (kind === 'connect') st.textContent = '已模拟授权 2 个平台（演示）';
        else if (kind === 'csv') st.textContent = '已模拟导入 sample_orders.csv（演示）';
        else st.textContent = '已载入演示数据（可继续向导）';
        st.classList.add('ok');
        if (window.toast) toast(st.textContent);
      });
    });
  }

  function openWizard(opts) {
    if (!GUIDE) return;
    opts = opts || {};
    var st = loadState();
    if (!st.steps) st.steps = {};
    if (typeof st.stepIndex !== 'number') st.stepIndex = 0;
    var steps = GUIDE.wizard || [];
    if (st.stepIndex >= steps.length) st.stepIndex = steps.length - 1;
    if (st.stepIndex < 0) st.stepIndex = 0;

    var root = ensureHost();
    function paint() {
      var i = st.stepIndex;
      var step = steps[i];
      var pct = Math.round(((i) / Math.max(steps.length - 1, 1)) * 100);
      var body = renderStep(step, st);
      root.innerHTML =
        '<div class="cb-overlay" id="cb-overlay"></div>' +
        '<div class="cb-wizard" role="dialog" aria-label="上手向导">' +
          '<div class="cb-wiz-head">' +
            '<div><div class="cb-drawer-kicker">上手向导 · ' + GUIDE.name + '</div>' +
            '<div class="cb-drawer-title">低门槛适配 · 第 ' + (i + 1) + ' / ' + steps.length + ' 步</div></div>' +
            '<button type="button" class="cb-icon-btn" id="cb-wiz-close">×</button>' +
          '</div>' +
          '<div class="cb-wiz-progress"><div style="width:' + pct + '%"></div></div>' +
          '<div class="cb-wiz-steps">' + steps.map(function (s, idx) {
            var done = st.steps[s.id] && st.steps[s.id].done;
            var cls = idx === i ? 'on' : (done ? 'done' : '');
            return '<button type="button" class="cb-wiz-dot ' + cls + '" data-idx="' + idx + '">' + (idx + 1) + '</button>';
          }).join('') + '</div>' +
          '<div class="cb-wiz-body">' +
            '<h3 class="cb-wiz-step-title">' + step.title + '</h3>' +
            '<p class="cb-wiz-step-desc">' + step.desc + '</p>' +
            body +
          '</div>' +
          '<div class="cb-wiz-foot">' +
            '<button type="button" class="btn-ghost btn-sm" id="cb-wiz-reset">重置进度</button>' +
            '<div class="cb-wiz-foot-right">' +
              (i > 0 ? '<button type="button" class="btn-ghost btn-sm" id="cb-wiz-prev">上一步</button>' : '') +
              (i < steps.length - 1
                ? '<button type="button" class="btn-primary btn-sm" id="cb-wiz-next">按向导下一步</button>'
                : '<button type="button" class="btn-primary btn-sm" id="cb-wiz-finish">完成并关闭</button>') +
            '</div>' +
          '</div>' +
        '</div>';

      $('#cb-overlay').onclick = function () { maybeLater(); };
      $('#cb-wiz-close').onclick = function () { maybeLater(); };
      $('#cb-wiz-reset').onclick = function () {
        st = { steps: {}, stepIndex: 0 };
        saveState(st); updateProgressPill(); paint();
        if (window.toast) toast('向导进度已重置');
      };
      var prev = $('#cb-wiz-prev');
      if (prev) prev.onclick = function () { st.stepIndex = Math.max(0, i - 1); saveState(st); paint(); };
      var next = $('#cb-wiz-next');
      if (next) next.onclick = function () { markStepDone(step); st.stepIndex = Math.min(steps.length - 1, i + 1); saveState(st); updateProgressPill(); paint(); };
      var fin = $('#cb-wiz-finish');
      if (fin) fin.onclick = function () { markStepDone(step); st.completed = true; saveState(st); updateProgressPill(); root.innerHTML = ''; if (window.toast) toast('适配向导已完成'); };
      $all('.cb-wiz-dot').forEach(function (d) {
        d.onclick = function () { st.stepIndex = parseInt(d.getAttribute('data-idx'), 10); saveState(st); paint(); };
      });
      bindStepInteractions(step, st, paint);
    }

    function maybeLater() {
      // allow dismiss without losing progress
      root.innerHTML = '';
    }

    function markStepDone(step) {
      if (!st.steps[step.id]) st.steps[step.id] = {};
      st.steps[step.id].done = true;
      // harvest checklist
      var checks = $all('.cb-check input:checked');
      if (checks.length) {
        st.steps[step.id].checked = checks.map(function (c) { return c.value; });
      }
      if (step.type === 'rules') {
        var rules = {};
        $all('[data-rule-key]').forEach(function (inp) { rules[inp.getAttribute('data-rule-key')] = inp.value; });
        st.steps[step.id].rules = rules;
        saveRules(rules);
      }
      if (step.type === 'data') {
        var sel = $('input[name=cb-data-mode]:checked');
        if (sel) st.steps[step.id].dataMode = sel.value;
      }
      if (step.type === 'ai-approve') {
        st.steps[step.id].approved = !!st.steps[step.id].approved;
      }
      saveState(st);
    }

    paint();
    sessionStorage.setItem(LS_SEEN, '1');
  }

  function renderStep(step, st) {
    var sdata = st.steps[step.id] || {};
    if (step.type === 'checklist' || step.type === 'kb') {
      var checked = sdata.checked || [];
      return '<div class="cb-check-list">' + (step.items || []).map(function (it, idx) {
        var val = String(idx);
        var on = checked.indexOf(val) >= 0 || checked.indexOf(it) >= 0;
        return '<label class="cb-check"><input type="checkbox" value="' + val + '"' + (on ? ' checked' : '') + '/>' +
          '<span>' + it + '</span>' +
          (step.type === 'kb' ? '<button type="button" class="cb-mark-ready btn-ghost btn-sm" data-idx="' + idx + '">标记已准备</button>' : '') +
          '</label>';
      }).join('') + '</div>' +
      (step.type === 'kb' ? '<p class="cb-hint">演示环境可直接「标记已准备」，落地时请替换为贵司真实文档。</p>' : '');
    }
    if (step.type === 'rules') {
      var saved = Object.assign({}, loadRules(), sdata.rules || {});
      return '<div class="cb-rules">' + (step.fields || []).map(function (f) {
        var v = saved[f.key] != null ? saved[f.key] : f.value;
        return '<label class="cb-rule-row"><span>' + f.label + '</span>' +
          '<input data-rule-key="' + f.key + '" value="' + String(v).replace(/"/g, '&quot;') + '"/></label>';
      }).join('') +
        '<button type="button" class="btn-primary btn-sm mt-3" id="cb-save-rules">保存规则（本机演示）</button>' +
        '<div class="cb-hint" id="cb-rules-msg"></div></div>';
    }
    if (step.type === 'data') {
      var mode = sdata.dataMode || 'demo';
      return '<div class="cb-data-step">' +
        '<label class="cb-radio"><input type="radio" name="cb-data-mode" value="connect"' + (mode === 'connect' ? ' checked' : '') + '/> 模拟连接平台</label>' +
        '<label class="cb-radio"><input type="radio" name="cb-data-mode" value="csv"' + (mode === 'csv' ? ' checked' : '') + '/> 模拟上传 CSV</label>' +
        '<label class="cb-radio"><input type="radio" name="cb-data-mode" value="demo"' + (mode === 'demo' ? ' checked' : '') + '/> 使用演示数据（推荐）</label>' +
        '<div class="cb-data-panel mt-3">' +
          '<div class="cb-data-title">数据接入面板</div>' +
          '<button type="button" class="btn-primary btn-sm" id="cb-run-data">执行所选方式</button>' +
          '<div class="cb-data-status" id="cb-data-status">等待操作</div>' +
        '</div></div>';
    }
    if (step.type === 'coach') {
      return '<div class="cb-coach">' +
        '<div class="cb-coach-mark">引导提示</div>' +
        '<p>' + (step.coachText || '') + '</p>' +
        '<p class="cb-hint">此步不封锁界面：可先关闭向导去页面操作，再点顶栏「上手向导」回来继续。</p>' +
        '</div>';
    }
    if (step.type === 'ai-approve') {
      var approved = !!sdata.approved;
      return '<div class="cb-ai-box">' +
        '<div class="suggestion-card p-4">' +
          '<div class="text-sm font-semibold">AI 推荐样例 · 需人确认</div>' +
          '<p class="text-xs text-gray-500 mt-1">系统已起草一条高风险动作建议。请审阅后批准此条——不会自动跑完全链路。</p>' +
          '<div class="mt-3 flex gap-2">' +
            '<button type="button" class="btn-primary btn-sm" id="cb-approve-demo"' + (approved ? ' disabled' : '') + '>' +
              (approved ? '已批准此条' : '批准此条') + '</button>' +
            '<button type="button" class="btn-ghost btn-sm" id="cb-reject-demo">暂不采纳</button>' +
          '</div>' +
        '</div>' +
        '<p class="cb-hint mt-2">默认 CTA：按向导下一步 / 查看推荐并确认 / 批准此条。全自动在进阶披露中。</p>' +
      '</div>';
    }
    if (step.type === 'action') {
      return '<div class="cb-action-step">' +
        '<a class="btn-primary inline-block px-4 py-2 text-sm" href="' + (step.actionHref || '#') + '">' + (step.actionLabel || '继续') + '</a>' +
        '</div>';
    }
    if (step.type === 'summary') {
      return '<div class="cb-summary" id="cb-summary-box">' + buildSummary(st) + '</div>' +
        '<button type="button" class="btn-ghost btn-sm mt-3" id="cb-copy-summary">复制适配清单</button>';
    }
    return '<p class="cb-hint">按「下一步」继续。</p>';
  }

  function buildSummary(st) {
    var lines = [];
    lines.push('【' + GUIDE.name + ' · 本公司适配清单】');
    lines.push('生成时间：' + new Date().toLocaleString('zh-CN'));
    (GUIDE.wizard || []).forEach(function (step) {
      var s = (st.steps || {})[step.id] || {};
      lines.push('');
      lines.push('● ' + step.title + (s.done ? ' ✓' : ' （未完成）'));
      if (s.checked && s.checked.length) {
        (step.items || []).forEach(function (it, idx) {
          if (s.checked.indexOf(String(idx)) >= 0 || s.checked.indexOf(it) >= 0) lines.push('  - ' + it);
        });
      }
      if (s.rules) {
        Object.keys(s.rules).forEach(function (k) { lines.push('  - ' + k + ' = ' + s.rules[k]); });
      }
      if (s.dataMode) lines.push('  - 数据方式：' + s.dataMode);
      if (s.approved) lines.push('  - 已完成：AI 推荐 → 人确认');
    });
    var rules = loadRules();
    if (Object.keys(rules).length) {
      lines.push('');
      lines.push('● 已保存规则');
      Object.keys(rules).forEach(function (k) { lines.push('  - ' + k + ' = ' + rules[k]); });
    }
    lines.push('');
    lines.push('原则：AI 起草，人批准高风险；全自动仅为进阶演示。');
    return '<pre class="cb-summary-pre">' + lines.join('\n') + '</pre>';
  }

  function bindStepInteractions(step, st, paint) {
    $all('.cb-mark-ready').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        var label = btn.closest('.cb-check');
        var input = label && label.querySelector('input');
        if (input) input.checked = true;
        btn.textContent = '已准备';
        btn.disabled = true;
      };
    });
    var saveRulesBtn = $('#cb-save-rules');
    if (saveRulesBtn) {
      saveRulesBtn.onclick = function () {
        var rules = {};
        $all('[data-rule-key]').forEach(function (inp) { rules[inp.getAttribute('data-rule-key')] = inp.value; });
        if (!st.steps[step.id]) st.steps[step.id] = {};
        st.steps[step.id].rules = rules;
        st.steps[step.id].done = true;
        saveRules(rules); saveState(st); updateProgressPill();
        var msg = $('#cb-rules-msg');
        if (msg) msg.textContent = '已保存到本机演示配置';
        if (window.toast) toast('规则已保存');
      };
    }
    var runData = $('#cb-run-data');
    if (runData) {
      runData.onclick = function () {
        var sel = $('input[name=cb-data-mode]:checked');
        var mode = sel ? sel.value : 'demo';
        var status = $('#cb-data-status');
        var map = { connect: '已模拟授权平台连接', csv: '已模拟上传 CSV', demo: '已载入演示数据' };
        if (status) { status.textContent = map[mode] || '完成'; status.classList.add('ok'); }
        if (!st.steps[step.id]) st.steps[step.id] = {};
        st.steps[step.id].dataMode = mode;
        st.steps[step.id].done = true;
        saveState(st); updateProgressPill();
        if (window.toast) toast(status.textContent);
      };
    }
    var ap = $('#cb-approve-demo');
    if (ap) {
      ap.onclick = function () {
        if (!st.steps[step.id]) st.steps[step.id] = {};
        st.steps[step.id].approved = true;
        st.steps[step.id].done = true;
        saveState(st); updateProgressPill();
        ap.textContent = '已批准此条'; ap.disabled = true;
        if (window.toast) toast('已批准此条 · 未自动跑完全链路');
        if (typeof window.prependTimeline === 'function') {
          try { window.prependTimeline('向导：人确认采纳 AI 推荐（单条）', 'success'); } catch (e) {}
        }
      };
    }
    var rj = $('#cb-reject-demo');
    if (rj) {
      rj.onclick = function () {
        if (window.toast) toast('已跳过 · 可稍后再批');
      };
    }
    var copy = $('#cb-copy-summary');
    if (copy) {
      copy.onclick = function () {
        var pre = $('#cb-summary-box pre');
        var text = pre ? pre.textContent : '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { if (window.toast) toast('已复制适配清单'); });
        } else {
          if (window.toast) toast('请手动选择复制');
        }
      };
    }
  }

  function firstVisitPrompt() {
    if (!GUIDE) return;
    if (sessionStorage.getItem(LS_SEEN)) return;
    var params = new URLSearchParams(location.search || '');
    if (params.get('wizard') === '1') {
      setTimeout(function () { openWizard(); }, 400);
      return;
    }
    var st = loadState();
    if (st.completed) return;
    // light non-blocking coach
    setTimeout(function () {
      if ($('#cb-first-visit')) return;
      var tip = document.createElement('div');
      tip.id = 'cb-first-visit';
      tip.className = 'cb-first-visit';
      tip.innerHTML =
        '<div class="cb-first-visit-inner">' +
          '<div class="cb-first-visit-title">建议先走上手向导</div>' +
          '<p>本系统默认「AI 起草 + 人确认」，不是黑盒一键跑完全流程。约 5～7 步完成适配。</p>' +
          '<div class="cb-first-visit-actions">' +
            '<button type="button" class="btn-ghost btn-sm" id="cb-later">稍后再说</button>' +
            '<button type="button" class="btn-primary btn-sm" id="cb-start-wiz">开始上手向导</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(tip);
      $('#cb-later').onclick = function () {
        sessionStorage.setItem(LS_SEEN, '1');
        tip.remove();
      };
      $('#cb-start-wiz').onclick = function () {
        tip.remove();
        openWizard();
      };
    }, 700);
  }

  function init() {
    injectTopbarButtons();
    softenOneClick();
    firstVisitPrompt();
    // re-soften if DOM updates (light)
    setTimeout(softenOneClick, 800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.CBGuide = { openManual: openManual, openWizard: openWizard, app: APP };
})();
