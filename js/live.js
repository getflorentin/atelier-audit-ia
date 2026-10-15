/* Téléphones des participants : quand l'atelier est ouvert via https://formation-ventoux.ceepia.tech/audit/
   (le serveur de la formation relaie ce dépôt GitHub Pages, ce qui donne accès aux réponses),
   chaque étape affiche un encart pour envoyer les téléphones sur la bonne question et voir les réponses en direct.
   Les participants répondent dans la session 3 de l'app de formation ; ici, on ne fait que lire et piloter. */
(function () {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const VERDICT = { ok: "✅ OK", mid: "⚠️ À améliorer", ko: "❌ Problème" };
  const DEONTO = { ok: "✅ Publiable", mod: "✏️ À reformuler", non: "⛔ Interdit" };
  const JUSTE = { ok: "✅ Juste", err: "❌ Erreur" };
  const PRIO = { now: "🔥 Maintenant", later: "⏳ Plus tard", no: "✖ Non" };
  const prio = (step) => DATA.questions.filter((g) => g.step === step).flatMap((g) => g.q.filter((q) => q[2]));

  // Étape de l'atelier → questions envoyées aux téléphones : [id de la slide, libellé, rendu des réponses]
  const poll = (opts) => ({ kind: "poll", opts });
  const rate = (items, opts) => ({ kind: "rate", items, opts });
  const form = (fields) => ({ kind: "form", fields });
  const STEPS = {
    cadrage: [["a-objectifs", "Vos 3 priorités", poll(DATA.objectifs.map((o) => o[1]))], ["a-q-cadrage", "Questions de cadrage", form(prio("cadrage"))]],
    audit: [["a-notes", "Note par domaine (à l'instinct)", { kind: "avg" }],
      ...DATA.auditDomains.map((d) => ["a-audit-" + d, "Grille · " + d, rate(DATA.audit.filter((x) => x.d === d).map((x) => x.t), VERDICT)]),
      ["a-q-audit", "Questions · organisation", form(prio("audit"))]],
    deonto: [["a-deonto", "Publiable ou pas ? (14 cas)", rate(DATA.cards.map((c) => c.txt), DEONTO)], ["a-avis", "Les avis en ligne (affichage)", null], ["a-q-deonto", "Questions · déontologie", form(prio("deonto"))]],
    ia: [["a-quiz", "Quiz de rappel", { kind: "quiz" }], ["a-hunt", "Chasse aux erreurs", rate(DATA.hunt.map((h) => h.t), JUSTE)], ["a-q-ia", "Questions · usage de l'IA", form(prio("ia"))]],
    atelier: [["a-piliers", "Les rubriques", poll(DATA.rubriques.map((r) => r.t))], ["a-rythme", "Le rythme", poll(["1 publication par semaine", "2 par semaine", "3 par semaine", "Plus de 3"])], ["a-q-atelier", "Questions · ligne éditoriale", form(prio("atelier"))]],
    demos: [["a-outils", "Quel outil vous intéresse ?", poll(DATA.tools.map((t) => t.n))], ["a-q-demos", "Questions · automatisation", form(prio("demos"))]],
    plan: [["a-plan", "Les actions : maintenant, plus tard, non ?", rate(DATA.planSuggest.map((p) => p.quoi), PRIO)], ["a-indicateurs", "Les 3 indicateurs", poll(DATA.indicateurs)], ["a-q-plan", "Questions · plan", form(prio("plan"))]],
    rapport: [["a-bilan", "Bilan", form([["note", "Utilité (0 à 10)"], ["surpris", "Ce qui vous a surpris"], ["premier", "Première action lundi"]])]],
  };
  STEPS.questions = Object.values(STEPS).flat().filter((x) => x[2] && x[2].kind === "form");

  let answers = [], online = null, open = {}, current = null;

  async function load() {
    try {
      const r = await fetch("/api/answers", { credentials: "same-origin" });
      online = r.ok; if (r.ok) answers = await r.json();
    } catch (e) { online = false; }
    draw();
  }
  async function push(id) {
    const r = await fetch("/api/state", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ s: 2, id }) }).catch(() => null);
    current = r && r.ok ? id : null; APP.toast && APP.toast(r && r.ok ? "Téléphones envoyés sur cette question" : "Connectez-vous d'abord en formateur"); draw();
  }

  const bar = (n, max) => `<span class="lv-bar"><i style="width:${max ? (n / max) * 100 : 0}%"></i></span><b>${n}</b>`;
  function results(id, spec) {
    const rows = answers.filter((a) => a.slide === id);
    const people = new Set(rows.map((a) => a.participant)).size;
    if (!spec) return `<p class="muted small">Affichage seulement.</p>`;
    if (!rows.length) return `<p class="muted small">En attente des réponses…</p>`;
    let h = `<p class="muted small">${people} participant(s)</p>`;
    if (spec.kind === "poll") {
      const c = spec.opts.map((o) => [o, rows.filter((a) => (a.value?.picks || []).includes(o)).length]).sort((a, b) => b[1] - a[1]);
      const max = Math.max(1, ...c.map((x) => x[1]));
      h += c.map(([o, n]) => `<div class="lv-row"><span>${esc(o)}</span>${bar(n, max)}</div>`).join("");
    } else if (spec.kind === "rate") {
      h += spec.items.map((t, n) => `<div class="lv-item"><span>${esc(t)}</span><span class="row">${Object.entries(spec.opts).map(([k, l]) => `<span class="chip">${l} ${rows.filter((a) => a.value?.picks?.[n] === k).length}</span>`).join("")}</span></div>`).join("");
    } else if (spec.kind === "avg") {
      h += DATA.auditDomains.map((d) => { const xs = rows.map((a) => a.value?.[d]).filter((x) => typeof x === "number"); const m = xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0; return `<div class="lv-row"><span>${esc(d)}</span>${bar(+m.toFixed(1), 10)}</div>`; }).join("");
    } else if (spec.kind === "quiz") {
      h += rows.filter((a) => a.value?.done).map((a) => `<div class="lv-row"><span>${esc(a.participant)}</span>${bar(a.value.score, a.value.total)}</div>`).join("");
    } else if (spec.kind === "form") {
      h += spec.fields.map(([k, label]) => `<div class="lv-q"><b>${esc(label)}</b>${rows.filter((a) => a.value?.[k] !== undefined && a.value[k] !== "").map((a) => `<p><span class="chip acc">${esc(a.participant)}</span> ${esc(a.value[k])}</p>`).join("") || '<p class="muted small">—</p>'}</div>`).join("");
    }
    return h;
  }

  function draw() {
    const v = document.getElementById("view"); if (!v) return;
    const list = STEPS[APP.current]; let el = document.getElementById("live");
    if (!list) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement("section"); el.id = "live"; el.className = "card live"; const eb = v.querySelector(".eyebrow"); v.insertBefore(el, eb ? eb.nextSibling : v.firstChild); }
    if (online === false) { el.innerHTML = `<b>📱 Téléphones des participants</b><p class="muted small">Pour piloter les téléphones : ouvrez l'atelier depuis <a href="https://formation-ventoux.ceepia.tech/audit/">formation-ventoux.ceepia.tech/audit/</a>, après vous être connecté en formateur sur <a href="https://formation-ventoux.ceepia.tech/" target="_blank">l'app de formation</a>.</p>`; return; }
    el.innerHTML = `<div class="row sb"><b>📱 Téléphones des participants</b><span class="muted small">Réponses en direct · formation-ventoux</span></div>` +
      list.map(([id, label, spec]) => `<div class="lv-block ${current === id ? "on" : ""}"><div class="row sb"><span class="lv-t">${esc(label)}</span><span class="row">
        <button class="btn sm ${current === id ? "primary" : ""}" data-live-push="${id}">${current === id ? "✓ Sur les téléphones" : "Envoyer aux téléphones"}</button>
        ${spec ? `<button class="btn sm ghost" data-live-open="${id}">${open[id] ? "Masquer" : "Résultats"}</button>` : ""}</span></div>
        ${open[id] ? `<div class="lv-res">${results(id, spec)}</div>` : ""}</div>`).join("");
  }

  document.addEventListener("click", (e) => {
    const p = e.target.closest("[data-live-push]"); if (p) { push(p.dataset.livePush); return; }
    const o = e.target.closest("[data-live-open]"); if (o) { open[o.dataset.liveOpen] = !open[o.dataset.liveOpen]; draw(); }
  });
  // L'atelier réécrit #view à chaque action : on remet l'encart à sa place.
  new MutationObserver(() => { if (!document.getElementById("live")) draw(); }).observe(document.getElementById("view"), { childList: true });
  load(); setInterval(load, 3000);
})();
