/* Noyau : état, sauvegarde, routage, liaison des champs, utilitaires. */
(function () {
  const KEY = "atelier-audit-ia-v2";
  const PAGES = {};
  const ACTIONS = {};

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function defaults() {
    return {
      names: DATA.participants.slice(),
      attentes: {}, objectifs: {}, postits: [],
      audit: {},
      deonto: { idx: 0, votes: {}, revealed: {}, charte: "", detect: "" },
      ia: { obs: {}, hunt: { picked: {}, done: false }, quiz: { i: 0, score: 0, ans: {} } },
      atelier: {
        piliers: { equipe: true, pedago: true, cabinet: true, vie: false },
        piliersNote: "", freq: 2, canaux: { insta: true, fb: true }, minPost: 45,
        ctx: DATA.ctxBlock, tache: "post", sujet: "", rubrique: "pedago", longueur: "100 mots",
        checks: { pasPatient: true, pasPromesse: true, pasPromo: true, pasComp: true, sourcer: true, simple: false },
        scorer: "", cal: [], relecture: {}, relecteur: "",
        studio: { tpl: "pedago", tag: "Pédagogie", titre: "Vos gencives saignent ?", texte: "Ce n'est jamais « normal ». Parlons-en lors de votre prochaine visite.", pied: "Cabinet dentaire du Dr Guillaume Becker · Monteux · 04 90 60 00 67", pal: 0 },
      },
      demos: {}, roi: { posts: 8, manuel: 90, ia: 35, courriers: 20, cmanuel: 15, cia: 5, cout: 28 },
      qa: {}, qdone: {},
      plan: { items: null, ind: {}, suivi: "" },
      notes: "", tab: {},
    };
  }

  function merge(base, over) {
    if (over == null) return base;
    if (Array.isArray(base) || typeof base !== "object" || base === null) return over;
    const out = Object.assign({}, base);
    Object.keys(over).forEach((k) => { out[k] = k in base ? merge(base[k], over[k]) : over[k]; });
    return out;
  }

  let S = defaults();
  try { const raw = localStorage.getItem(KEY); if (raw) S = merge(defaults(), JSON.parse(raw)); } catch (e) { /* stockage indisponible */ }

  let saveT = null;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(S)); $("#saved").textContent = "Enregistré"; }
      catch (e) { $("#saved").textContent = "Non enregistré (navigateur)"; }
    }, 250);
    $("#saved").textContent = "…";
  }

  function getp(path) { return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), S); }
  function setp(path, val) {
    const ks = path.split("."); let o = S;
    for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null || typeof o[ks[i]] !== "object") o[ks[i]] = {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = val;
  }

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  }

  function confetti() {
    const c = $("#confetti"); c.classList.remove("hidden");
    c.width = innerWidth; c.height = innerHeight;
    const ctx = c.getContext("2d");
    const cols = ["#c8401f", "#d6246e", "#f0b429", "#1f8a5b", "#3b82f6"];
    const ps = Array.from({ length: 140 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, r: 4 + Math.random() * 6, vx: -2 + Math.random() * 4, vy: 2 + Math.random() * 4, col: cols[(Math.random() * cols.length) | 0], rot: Math.random() * 6 }));
    let f = 0;
    (function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach((p) => { p.x += p.vx; p.y += p.vy; p.rot += .1; ctx.fillStyle = p.col; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6); ctx.restore(); });
      if (++f < 150) requestAnimationFrame(tick); else { ctx.clearRect(0, 0, c.width, c.height); c.classList.add("hidden"); }
    })();
  }


  /* ---------- Questions à poser, par étape ---------- */
  function qGroup(g, opts) {
    const only = opts && opts.onlyPrio;
    const qs = g.q.filter((q) => !only || q[2]);
    if (!qs.length) return "";
    return `<div class="qgroup"><h3>${esc(g.th)}</h3>${qs.map((q) => `<div class="qitem">
      <label class="qrow"><input type="checkbox" data-b="qdone.${q[0]}"><span class="qtext">${q[2] ? '<span class="star" title="Prioritaire">★</span> ' : ""}${esc(q[1])}</span></label>
      <textarea data-b="qa.${q[0]}" placeholder="Réponse du cabinet" rows="2"></textarea></div>`).join("")}</div>`;
  }
  function qCount(step) {
    const gs = DATA.questions.filter((g) => !step || g.step === step); let n = 0, d = 0;
    gs.forEach((g) => g.q.forEach((q) => { n++; if (APP.S.qdone[q[0]]) d++; }));
    return [d, n];
  }
  function qPanel(step) {
    const gs = DATA.questions.filter((g) => g.step === step); if (!gs.length) return "";
    const [d, n] = qCount(step);
    return `<details class="card qpanel noprint" open><summary><span class="qtitle">Questions à poser à cette étape</span><span class="chip acc qcount" data-step="${step}">${d} / ${n}</span></summary>${gs.map((g) => qGroup(g)).join("")}</details>`;
  }
  function updQ() {
    $$(".qcount").forEach((el) => { const [d, n] = qCount(el.dataset.step || ""); el.textContent = d + " / " + n; });
  }

  /* ---------- Liaison des champs ---------- */
  function bindAll(root) {
    $$("[data-b]", root).forEach((el) => {
      const path = el.dataset.b; const v = getp(path);
      if (el.type === "checkbox") el.checked = !!v;
      else if (el.type === "radio") el.checked = String(v) === el.value;
      else if (el.type === "range" && v == null) el.value = el.min || 0;
      else el.value = v == null ? "" : v;
    });
  }
  function onInput(e) {
    const el = e.target.closest("[data-b]"); if (!el) return;
    let v;
    if (el.type === "checkbox") v = el.checked;
    else if (el.type === "number" || el.type === "range" || el.dataset.n) v = el.value === "" ? "" : Number(el.value);
    else v = el.value;
    setp(el.dataset.b, v); save();
    const p = PAGES[APP.current];
    if (p && p.onBind) p.onBind(el.dataset.b, el, $("#view"));
    if (el.dataset.b.startsWith("qdone.")) updQ();
  }
  document.addEventListener("input", onInput);
  document.addEventListener("change", (e) => { if (e.target.matches("select[data-b], input[type=checkbox][data-b], input[type=radio][data-b]")) onInput(e); });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-act]"); if (!a) return;
    const fn = ACTIONS[a.dataset.act];
    if (fn) { if (a.tagName === "A") e.preventDefault(); fn(a, e); }
  });

  /* ---------- Actions globales ---------- */
  ACTIONS.open = (a) => { window.open(DATA.links[a.dataset.url], "_blank", "noopener"); };
  ACTIONS.menu = () => $("#side").classList.toggle("open");
  ACTIONS.projector = () => { document.body.classList.toggle("projector"); try { localStorage.setItem(KEY + "-proj", document.body.classList.contains("projector") ? "1" : ""); } catch (e) {} };
  ACTIONS.go = (a) => { location.hash = "#/" + a.dataset.to; };
  ACTIONS.tab = (a) => { S.tab[APP.current] = a.dataset.tab; save(); render(); };
  ACTIONS.export = () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const u = URL.createObjectURL(blob); const l = document.createElement("a");
    l.href = u; l.download = "atelier-audit-" + new Date().toISOString().slice(0, 10) + ".json"; l.click(); URL.revokeObjectURL(u);
    toast("Sauvegarde téléchargée");
  };
  ACTIONS.import = () => {
    const i = document.createElement("input"); i.type = "file"; i.accept = "application/json";
    i.onchange = () => { const f = i.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { S = merge(defaults(), JSON.parse(r.result)); APP.S = S; save(); render(); toast("Sauvegarde restaurée"); } catch (err) { toast("Fichier invalide"); } }; r.readAsText(f); };
    i.click();
  };
  ACTIONS.reset = () => {
    if (!confirm("Effacer toutes les données saisies dans ce navigateur ?")) return;
    S = defaults(); APP.S = S; try { localStorage.removeItem(KEY); } catch (e) {} render(); toast("Données effacées");
  };
  ACTIONS.copy = (a) => {
    const t = a.dataset.text != null ? a.dataset.text : ($(a.dataset.from) || {}).innerText || "";
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Copié"), () => { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Copié"); } catch (e) { toast("Copie impossible"); } ta.remove(); });
  };

  /* ---------- Rendu ---------- */
  const APP = { qGroup, qCount, qPanel, updQ, S, PAGES, ACTIONS, esc, $, $$, save, getp, setp, toast, confetti, bindAll, current: "home", render: null, markDemo: null, merge, defaults };

  function stepMeta(id) { return DATA.steps.find((s) => s.id === id); }

  function renderNav() {
    $("#nav").innerHTML = DATA.steps.map((s) => `<button data-act="go" data-to="${s.id}" class="${s.id === APP.current ? "active" : ""} ${doneStep(s.id) ? "done" : ""}">
      <span class="ico">${s.n || s.ico}</span><span>${esc(s.t)}</span><span class="tm">${esc(s.time)}</span></button>`).join("");
  }
  function doneStep(id) {
    const s = APP.S;
    switch (id) {
      case "cadrage": return Object.values(s.attentes).some((v) => v);
      case "audit": return Object.keys(s.audit).filter((k) => s.audit[k].s != null).length >= 10;
      case "deonto": return Object.keys(s.deonto.revealed).length >= 8;
      case "ia": return Object.keys(s.ia.obs).length >= 1 || s.ia.hunt.done;
      case "atelier": return (s.atelier.cal || []).length > 0 || !!s.atelier.sujet;
      case "demos": return Object.keys(s.demos).length >= 3;
      case "questions": return Object.keys(s.qdone).length >= 5;
      case "plan": return !!(s.plan.items && s.plan.items.some((i) => i.keep));
      default: return false;
    }
  }

  function render(keep) {
    APP.S = S;
    const parts = (location.hash.replace(/^#\/?/, "") || "home").split("/");
    const id = PAGES[parts[0]] ? parts[0] : "home";
    APP.current = id;
    const page = PAGES[id];
    const tabs = page.tabs || null;
    let tab = parts[1] || (S.tab && S.tab[id]) || (tabs ? tabs[0][0] : "");
    if (tabs && !tabs.some((t) => t[0] === tab)) tab = tabs[0][0];
    APP.tab = tab;
    const meta = stepMeta(id);
    $("#crumb").textContent = meta ? (meta.n ? "Étape " + meta.n + " · " : "") + meta.t : "";
    let html = "";
    const tips = DATA.tips[id];
    if (tips) html += `<details class="tips noprint"><summary>Conseils d'animation (visibles de vous seul)</summary><ul>${tips.map((t) => "<li>" + esc(t) + "</li>").join("")}</ul></details>`;
    if (tabs) html += `<div class="tabs noprint">${tabs.map((t) => `<button class="${t[0] === tab ? "active" : ""}" data-act="tab" data-tab="${t[0]}">${esc(t[1])}</button>`).join("")}</div>`;
    const eyebrow = meta && meta.n ? `<div class="eyebrow"><span class="enum">${meta.n}</span><span>${esc(meta.t)}</span>${meta.time ? `<span class="etime">${esc(meta.time.replace(":", "h"))}</span>` : ""}</div>` : "";
    html += eyebrow + page.render(tab);
    if (id !== "questions") html += qPanel(id);
    const v = $("#view"); v.innerHTML = html;
    bindAll(v);
    if (page.init) page.init(v, tab);
    if (tabs) { APP.S.demos["tab:" + id + ":" + tab] = true; }
    $("#notes").innerHTML = `<h3>Notes de séance</h3><textarea data-b="notes" placeholder="Notes libres : elles seront reprises dans le rapport."></textarea>`;
    bindAll($("#notes"));
    renderNav();
    $("#side").classList.remove("open");
    if (keep !== true) window.scrollTo({ top: 0 });
    save();
  }
  APP.render = render;
  APP.markDemo = (k) => { S.demos[k] = true; save(); };
  window.addEventListener("hashchange", render);

  /* ---------- Horloge de séance ---------- */
  function clock() {
    const d = new Date(); const m = d.getHours() * 60 + d.getMinutes();
    const hh = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    let cur = null;
    DATA.schedule.forEach((s) => { if (m >= s[0] && m < s[1]) cur = s; });
    const total = 1050 - 840; const pct = Math.max(0, Math.min(100, ((m - 840) / total) * 100));
    let txt;
    if (cur) txt = `<b>${hh}</b> · ${esc(cur[3])}<br><span class="muted">fin dans ${cur[1] - m} min</span>`;
    else if (m < 840) txt = `<b>${hh}</b><br><span class="muted">Début à 14:00</span>`;
    else if (m >= 1050) txt = `<b>${hh}</b><br><span class="muted">Séance terminée</span>`;
    else txt = `<b>${hh}</b><br><span class="muted">Hors séquence</span>`;
    $("#clock").innerHTML = txt + `<div class="bar"><i style="width:${pct}%"></i></div>`;
  }

  APP.start = function () {
    try { if (localStorage.getItem(KEY + "-proj")) document.body.classList.add("projector"); } catch (e) {}
    clock(); setInterval(clock, 30000);
    render();
  };

  window.APP = APP;
})();
