/* Pages : accueil, cadrage, audit, déontologie */
(function () {
  const { PAGES, ACTIONS, esc, $, $$, save, toast, confetti } = APP;
  const S = () => APP.S;
  const nm = (i) => S().names[i] || "Participant " + (i + 1);
  const fmtT = (m) => String(Math.floor(m / 60)).padStart(2, "0") + "h" + String(m % 60).padStart(2, "0");

  /* ===================== ACCUEIL ===================== */
  PAGES.home = {
    render() {
      const sched = DATA.schedule.map((s) => `<tr><td><b>${fmtT(s[0])}</b> – ${fmtT(s[1])}</td><td>${esc(s[3])}</td><td>${s[2] === "pause" ? "" : `<button class="btn sm" data-act="go" data-to="${s[2]}">Ouvrir</button>`}</td></tr>`).join("");
      return `
      <section class="hero">
        <span class="chip pink">SCM Ventoux · Monteux · 15 octobre 2026</span>
        <h1 style="margin-top:14px">Votre communication, <span class="hl">enfin simple</span> à tenir avec l'IA.</h1>
        <p style="max-width:640px;font-size:1.1rem" class="muted">Cet après-midi, on regarde ensemble ce qui existe, on pose les règles, on teste, puis on repart avec un plan d'action et un rapport complet généré en direct.</p>
        <div class="pill-row">
          <button class="btn primary" data-act="go" data-to="cadrage">Commencer l'atelier</button>
          <button class="btn" data-act="go" data-to="demos">Voir les démos</button>
          <button class="btn" data-act="go" data-to="rapport">Rapport en cours</button>
        </div>
      </section>

      <div class="grid g3" style="margin-top:18px">
        <div class="card kpi"><b class="hl">3 h 30</b><span>pour auditer, tester et décider</span></div>
        <div class="card kpi"><b class="pink">8</b><span>démos et jeux pour toute l'équipe</span></div>
        <div class="card kpi"><b>1</b><span>rapport complet, prêt à la fin de la séance</span></div>
      </div>

      <div class="split" style="margin-top:18px">
        <div class="card">
          <h2>Le déroulé de l'après-midi</h2>
          <table class="t"><tbody>${sched}</tbody></table>
        </div>
        <div class="card">
          <h2>Vous repartez avec</h2>
          <ul>
            <li><b>Un audit chiffré</b> de votre communication, avec un radar par domaine</li>
            <li><b>Une charte « on publie / on ne publie pas »</b> issue des recommandations de l'Ordre</li>
            <li><b>Un bloc de contexte cabinet</b> et des prompts prêts à l'emploi</li>
            <li><b>Un calendrier éditorial</b> de 4 semaines</li>
            <li><b>Un plan d'action</b> daté, avec un responsable par tâche</li>
            <li><b>Un rapport PDF</b> de tout ce qui a été dit</li>
          </ul>
          <p class="small muted">Règle du jour : aucune donnée de patient dans ce site ni dans les outils d'IA. Tout ce que vous saisissez reste dans le navigateur de cet ordinateur.</p>
        </div>
      </div>

      <div class="card noprint" style="margin-top:18px">
        <h3>Les quatre sources à auditer</h3>
        <div class="row">
          <button class="btn" data-act="open" data-url="site">Site du cabinet</button>
          <button class="btn" data-act="open" data-url="insta">Instagram</button>
          <button class="btn" data-act="open" data-url="fb">Facebook</button>
          <button class="btn" data-act="open" data-url="google">Fiche Google</button>
        </div>
        <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
        <div class="row">
          <button class="btn sm" data-act="export">Télécharger la sauvegarde</button>
          <button class="btn sm" data-act="import">Restaurer une sauvegarde</button>
          <button class="btn sm ghost" data-act="reset">Tout effacer</button>
        </div>
      </div>`;
    },
  };

  /* ===================== CADRAGE ===================== */
  PAGES.cadrage = {
    render() {
      const cards = [0, 1, 2, 3, 4].map((i) => `
        <div class="card">
          <input type="text" data-b="names.${i}" style="font-weight:700" aria-label="Nom du participant ${i + 1}">
          <label class="l">Ce que j'attends de la communication</label>
          <textarea data-b="attentes.${i}" placeholder="Une phrase, avec les mots de la personne"></textarea>
        </div>`).join("");
      const sliders = DATA.objectifs.map((o) => `
        <div style="margin:12px 0">
          <div class="row sb"><b>${esc(o[1])}</b><span class="chip acc" id="ov-${o[0]}">0</span></div>
          <input type="range" min="0" max="5" step="1" data-b="objectifs.${o[0]}">
        </div>`).join("");
      return `
      <h1>Cadrage : ce que chacun attend</h1>
      <p class="muted">Un tour de table, une phrase chacun. Les noms sont modifiables.</p>
      <div class="grid g5">${cards}</div>
      <div class="split" style="margin-top:18px">
        <div class="card"><h2>Priorités du groupe</h2><p class="small muted">0 = pas important, 5 = essentiel. Tranchez ensemble.</p>${sliders}</div>
        <div class="card"><h2>Ce qui agace aujourd'hui</h2>
          <div class="row"><input type="text" id="pi-text" placeholder="Une phrase, puis Entrée"><button class="btn primary" data-act="addPostit">Ajouter</button></div>
          <div class="grid" id="postits" style="margin-top:14px;grid-template-columns:repeat(2,1fr)"></div>
        </div>
      </div>`;
    },
    init(root) {
      const upd = () => DATA.objectifs.forEach((o) => { const el = $("#ov-" + o[0], root); if (el) el.textContent = S().objectifs[o[0]] || 0; });
      const drawP = () => { $("#postits", root).innerHTML = S().postits.map((p, i) => `<div class="postit">${esc(p)}<button class="x" data-act="delPostit" data-i="${i}" aria-label="Supprimer">×</button></div>`).join("") || `<p class="muted small">Aucun post-it pour l'instant.</p>`; };
      upd(); drawP();
      PAGES.cadrage.onBind = (p) => { if (p.startsWith("objectifs")) upd(); if (p.startsWith("names")) { /* rien */ } };
      PAGES.cadrage.draw = drawP;
      $("#pi-text", root).addEventListener("keydown", (e) => { if (e.key === "Enter") ACTIONS.addPostit(); });
    },
  };
  ACTIONS.addPostit = () => { const el = $("#pi-text"); if (!el || !el.value.trim()) return; S().postits.push(el.value.trim()); el.value = ""; save(); PAGES.cadrage.draw(); };
  ACTIONS.delPostit = (a) => { S().postits.splice(+a.dataset.i, 1); save(); PAGES.cadrage.draw(); };

  /* ===================== AUDIT ===================== */
  const SCORE_LABELS = ["Absent", "À reprendre", "Correct", "Solide"];
  function auditStats() {
    const au = S().audit; const dom = {};
    DATA.auditDomains.forEach((d) => (dom[d] = { sum: 0, n: 0 }));
    let sum = 0, n = 0;
    DATA.audit.forEach((c) => { const s = au[c.id] && au[c.id].s; if (typeof s === "number") { dom[c.d].sum += s; dom[c.d].n++; sum += s; n++; } });
    return { dom, sum, n };
  }
  function radar(dom) {
    const ds = DATA.auditDomains; const cx = 190, cy = 190, R = 130; const N = ds.length;
    const pt = (i, v) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
    let g = "";
    [1 / 3, 2 / 3, 1].forEach((r) => { g += `<polygon points="${ds.map((_, i) => pt(i, r).join(",")).join(" ")}" fill="none" stroke="#e7e0d4"/>`; });
    ds.forEach((d, i) => { const [x, y] = pt(i, 1); const [lx, ly] = pt(i, 1.2); g += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e7e0d4"/><text x="${lx}" y="${ly}" font-size="12" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="#23201c">${esc(d)}</text>`; });
    const vals = ds.map((d) => (dom[d].n ? dom[d].sum / dom[d].n / 3 : 0));
    g += `<polygon points="${vals.map((v, i) => pt(i, v).join(",")).join(" ")}" fill="rgba(214,36,110,.22)" stroke="#d6246e" stroke-width="2.5"/>`;
    vals.forEach((v, i) => { const [x, y] = pt(i, v); g += `<circle cx="${x}" cy="${y}" r="4" fill="#d6246e"/>`; });
    return `<svg class="radar" viewBox="0 0 380 380">${g}</svg>`;
  }
  function weakest() {
    const au = S().audit;
    return DATA.audit.filter((c) => au[c.id] && typeof au[c.id].s === "number" && au[c.id].s <= 1)
      .sort((a, b) => (au[a.id].p === "H" ? 0 : 1) - (au[b.id].p === "H" ? 0 : 1) || au[a.id].s - au[b.id].s).slice(0, 5);
  }
  function drawAuditSide() {
    const st = auditStats(); const el = $("#audit-side"); if (!el) return;
    const total = DATA.audit.length * 3;
    const w = weakest();
    el.innerHTML = `${radar(st.dom)}
      <div class="row sb" style="margin-top:8px"><span class="muted">Score global</span><b style="font-size:1.4rem">${st.sum} <span class="muted small">/ ${st.n * 3 || total}</span></b></div>
      <div class="meter"><i style="width:${st.n ? (st.sum / (st.n * 3)) * 100 : 0}%"></i></div>
      <p class="small muted" style="margin-top:6px">${st.n} critère(s) noté(s) sur ${DATA.audit.length}</p>
      <h3 style="margin-top:14px">Chantiers prioritaires</h3>
      ${w.length ? w.map((c) => `<div class="finding red"><b>${esc(c.t)}</b></div>`).join("") : `<p class="muted small">Ils apparaîtront ici dès qu'un critère sera noté 0 ou 1.</p>`}`;
  }
  function setScore(id, s) {
    const a = S().audit; a[id] = a[id] || {}; a[id].s = a[id].s === s ? null : s; save();
    $$(`.score[data-id="${id}"] button`).forEach((b) => { const v = b.dataset.s; b.className = (String(a[id].s) === v ? "on" + v : ""); });
    drawAuditSide();
  }
  PAGES.audit = {
    render() {
      let html = `<h1>Audit en direct</h1>
      <p class="muted">Notez de 0 à 3 en demandant l'avis du groupe. Un clic sur une ligne grise insère un constat préparé, à ajuster.</p>
      <div class="split"><div>`;
      DATA.auditDomains.forEach((d) => {
        html += `<div class="card"><div class="dom-h"><h3>${esc(d)}</h3></div>`;
        DATA.audit.filter((c) => c.d === d).forEach((c) => {
          const cur = S().audit[c.id] || {};
          html += `<div class="crit">
            <div class="row sb"><span class="t">${esc(c.t)}</span>
              <span class="score" data-id="${c.id}">${[0, 1, 2, 3].map((v) => `<button data-act="score" data-id="${c.id}" data-s="${v}" class="${cur.s === v ? "on" + v : ""}" title="${SCORE_LABELS[v]}">${v}</button>`).join("")}</span></div>
            <div class="row" style="margin:6px 0">${c.hints.map((h, i) => `<span class="hint" data-act="hint" data-id="${c.id}" data-i="${i}">${esc(h)}</span>`).join("")}</div>
            <div class="grid" style="grid-template-columns:1fr 90px;gap:8px"><textarea data-b="audit.${c.id}.c" placeholder="Constat en séance" style="min-height:48px"></textarea>
              <select data-b="audit.${c.id}.p" aria-label="Priorité"><option value="">Prio</option><option value="H">Haute</option><option value="M">Moyenne</option><option value="B">Basse</option></select></div>
          </div>`;
        });
        html += `</div><div style="height:14px"></div>`;
      });
      html += `</div><div class="card" style="position:sticky;top:16px"><h2>Radar de l'audit</h2><div id="audit-side"></div></div></div>`;
      return html;
    },
    init() { drawAuditSide(); },
  };
  ACTIONS.score = (a) => setScore(a.dataset.id, +a.dataset.s);
  ACTIONS.hint = (a) => {
    const c = DATA.audit.find((x) => x.id === a.dataset.id); const h = c.hints[+a.dataset.i];
    const au = S().audit; au[c.id] = au[c.id] || {};
    au[c.id].c = ((au[c.id].c || "") + (au[c.id].c ? "\n" : "") + h).trim(); save();
    const ta = $(`textarea[data-b="audit.${c.id}.c"]`); if (ta) ta.value = au[c.id].c; toast("Constat ajouté");
  };

  /* ===================== DÉONTOLOGIE ===================== */
  const LBL = { ok: "Publiable", mod: "À modifier", non: "À ne pas publier" };
  function dscore() { const v = S().deonto.votes; let good = 0, done = 0; DATA.cards.forEach((c) => { const g = v[c.id] && v[c.id].g; if (g) { done++; if (g === c.v) good++; } }); return { good, done }; }

  function drawCard(root) {
    const D = S().deonto; const c = DATA.cards[D.idx]; const vt = D.votes[c.id] || {}; const rev = D.revealed[c.id];
    const dots = DATA.cards.map((k, i) => { const g = D.votes[k.id] && D.votes[k.id].g; return `<i class="${i === D.idx ? "cur" : g ? (g === k.v ? "good" : "badd") : ""}"></i>`; }).join("");
    const who = [0, 1, 2, 3, 4].map((i) => `<button class="${vt[i] || ""}" data-act="pvote" data-i="${i}">${esc(nm(i))}${vt[i] ? " : " + LBL[vt[i]] : ""}</button>`).join("");
    const sc = dscore();
    $("#dcard", root).innerHTML = `
      <div class="dots">${dots}</div>
      <p class="small muted">Carte ${D.idx + 1} sur ${DATA.cards.length} · Score du groupe : <b>${sc.good}</b> / ${sc.done}</p>
      <div class="txt">${esc(c.txt)}</div>
      <div class="votes">${["ok", "mod", "non"].map((k) => `<button class="vbtn ${k} ${vt.g === k ? "sel-" + k : ""}" data-act="gvote" data-v="${k}">${LBL[k]}</button>`).join("")}</div>
      <div class="pv">${who}</div>
      ${rev ? `<div class="reveal ${c.v}"><b>Réponse : ${LBL[c.v]}</b> <span class="chip">${esc(c.art)}</span><p style="margin:8px 0 0">${esc(c.why)}</p></div>` : `<p class="small muted" style="margin-top:14px">Votez à main levée, puis cliquez la réponse du groupe pour révéler.</p>`}
      <div class="row sb noprint" style="margin-top:16px"><button class="btn" data-act="cprev">← Précédente</button><button class="btn" data-act="creveal">Révéler</button><button class="btn primary" data-act="cnext">Suivante →</button></div>`;
  }
  ACTIONS.gvote = (a) => {
    const D = S().deonto; const c = DATA.cards[D.idx]; D.votes[c.id] = D.votes[c.id] || {}; D.votes[c.id].g = a.dataset.v; D.revealed[c.id] = true; save(); drawCard($("#view"));
    const sc = dscore(); if (sc.done === DATA.cards.length && sc.good >= 11) confetti();
  };
  ACTIONS.pvote = (a) => {
    const D = S().deonto; const c = DATA.cards[D.idx]; D.votes[c.id] = D.votes[c.id] || {}; const o = ["", "ok", "mod", "non"]; const i = +a.dataset.i;
    D.votes[c.id][i] = o[(o.indexOf(D.votes[c.id][i] || "") + 1) % 4]; save(); drawCard($("#view"));
  };
  ACTIONS.creveal = () => { const D = S().deonto; D.revealed[DATA.cards[D.idx].id] = true; save(); drawCard($("#view")); };
  ACTIONS.cnext = () => { const D = S().deonto; D.idx = Math.min(DATA.cards.length - 1, D.idx + 1); save(); drawCard($("#view")); };
  ACTIONS.cprev = () => { const D = S().deonto; D.idx = Math.max(0, D.idx - 1); save(); drawCard($("#view")); };

  function analyse(text) {
    const hits = [];
    DATA.rules.forEach((r) => { for (const m of text.matchAll(r.re)) { if (m[0].length) hits.push({ s: m.index, e: m.index + m[0].length, r }); } });
    hits.sort((a, b) => a.s - b.s || b.e - a.e);
    const kept = []; let end = -1; hits.forEach((h) => { if (h.s >= end) { kept.push(h); end = h.e; } });
    let html = "", pos = 0;
    kept.forEach((h) => { html += esc(text.slice(pos, h.s)) + `<mark class="${h.r.sev}" title="${esc(h.r.t)}">${esc(text.slice(h.s, h.e))}</mark>`; pos = h.e; });
    html += esc(text.slice(pos));
    return { kept, html };
  }
  const SAMPLES = [
    "🦷 Offre d'octobre : -20 % sur le blanchiment ! Notre cabinet est le meilleur de Monteux, résultat garanti et sans douleur. Profitez-en vite !",
    "Merci Mme Dupont pour votre avis 5 étoiles ! Voici l'avant/après de votre implant, réalisé le jour même par notre expert.",
    "Les gencives qui saignent ne sont jamais « normales ». En cas de doute, parlez-en à votre dentiste lors de votre prochaine visite. Prévention et information avant tout.",
  ];
  function drawDetect(root) {
    const t = S().deonto.detect || ""; const a = analyse(t);
    $("#det-out", root).innerHTML = t ? a.html : `<span class="muted">Le texte analysé apparaîtra ici, avec les passages à risque surlignés.</span>`;
    const red = a.kept.filter((h) => h.r.sev === "red").length, amb = a.kept.filter((h) => h.r.sev === "amber").length;
    const score = Math.max(0, 100 - red * 18 - amb * 8);
    $("#det-score", root).style.width = (t ? score : 0) + "%";
    $("#det-num", root).textContent = t ? score + " / 100" : "—";
    const seen = {};
    $("#det-find", root).innerHTML = a.kept.filter((h) => !seen[h.r.id] && (seen[h.r.id] = 1)).map((h) => `<div class="finding ${h.r.sev}"><b>${esc(h.r.t)}</b> <span class="muted small">« ${esc(t.slice(h.s, h.e))} »</span><br><span class="small">${esc(h.r.why)}</span><br><span class="small"><b>Piste :</b> ${esc(h.r.fix)}</span></div>`).join("") || (t ? `<div class="finding" style="border-color:var(--ok)">Aucun signal détecté par cet outil. Cela ne remplace pas la relecture d'un dentiste.</div>` : "");
  }
  ACTIONS.sample = (a) => { S().deonto.detect = SAMPLES[+a.dataset.i]; save(); $("#det-in").value = S().deonto.detect; drawDetect($("#view")); };

  let avisPath = ["start"];
  function drawAvis(root) {
    const k = avisPath[avisPath.length - 1]; const n = DATA.avisTree[k];
    if (n.end) {
      $("#avis", root).innerHTML = `<div class="chip pink">${esc(n.q)}</div><h2 style="margin-top:10px">${esc(n.ok)}</h2><ul>${n.li.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      <div class="row"><button class="btn" data-act="avisReset">Recommencer</button></div>
      <p class="small muted" style="margin-top:12px">Position prudente fondée sur les recommandations de l'Ordre (version de mars 2023). À valider avec le conseil départemental de l'Ordre du Vaucluse.</p>`;
    } else {
      $("#avis", root).innerHTML = `<h2>${esc(n.q)}</h2><div class="grid" style="gap:10px">${n.o.map((o) => `<button class="opt" data-act="avisGo" data-k="${o[1]}">${esc(o[0])}</button>`).join("")}</div>`;
    }
  }
  ACTIONS.avisGo = (a) => { avisPath.push(a.dataset.k); drawAvis($("#view")); };
  ACTIONS.avisReset = () => { avisPath = ["start"]; drawAvis($("#view")); };

  const REGLES = [
    "On informe, on ne vend pas : la profession n'est pas un commerce.",
    "Aucun avant/après, aucun témoignage, aucun avis cité, aucune note.",
    "Aucune comparaison avec d'autres cabinets, aucun « meilleur que ».",
    "Aucune promotion, remise ou offre. Pas de promesse de résultat.",
    "Aucun patient identifiable : visage flouté même avec son accord ; pas de radio ni de capture d'écran.",
    "Aucune publicité pour une marque ou un produit tiers.",
    "Titres uniquement s'ils sont justifiés ; seulement trois spécialités reconnues.",
    "Ce qui relève de la loi (hygiène, sécurité) ne se présente pas comme exceptionnel.",
    "Un dentiste désigné valide chaque publication.",
  ];

  PAGES.deonto = {
    tabs: [["cartes", "Publiable ou non ?"], ["detect", "Détecteur"], ["avis", "Avis en ligne"], ["charte", "Charte du cabinet"]],
    render(tab) {
      if (tab === "cartes") return `<h1>Filtre déontologique : publiable ou non ?</h1>
        <p class="muted">14 cas réels de publications. Cadre : décret n° 2020-1658 et recommandations de l'Ordre des chirurgiens-dentistes (articles R.4127-215 à R.4127-219).</p>
        <div class="card dcard" id="dcard"></div>`;
      if (tab === "detect") return `<h1>Détecteur déontologique</h1>
        <p class="muted">Collez une légende (ancienne ou en projet). L'outil surligne ce qui mérite une relecture. <b>Il aide, il ne juge pas.</b></p>
        <div class="split"><div class="card"><label class="l">Texte à analyser</label><textarea id="det-in" data-b="deonto.detect" style="min-height:180px" placeholder="Collez ici une légende de publication"></textarea>
          <div class="row" style="margin-top:10px"><span class="small muted">Exemples :</span>${SAMPLES.map((_, i) => `<button class="btn sm" data-act="sample" data-i="${i}">Exemple ${i + 1}</button>`).join("")}</div>
          <h3 style="margin-top:16px">Texte surligné</h3><div class="detect-out" id="det-out"></div></div>
        <div class="card"><div class="row sb"><h2 style="margin:0">Indice de prudence</h2><b id="det-num" style="font-size:1.3rem"></b></div><div class="meter" style="margin:10px 0"><i id="det-score" style="width:0"></i></div><div id="det-find"></div></div></div>`;
      if (tab === "avis") return `<h1>Avis en ligne : que faire ?</h1><p class="muted">Le sujet le plus sensible pour un cabinet. Parcourez l'arbre de décision.</p><div class="card" id="avis" style="max-width:720px"></div>`;
      const D = S().deonto; const buckets = { ok: [], mod: [], non: [] };
      DATA.cards.forEach((c) => buckets[c.v].push(c));
      return `<h1>Charte « on publie / on ne publie pas »</h1><p class="muted">Générée à partir des cartes et des règles de l'Ordre. Modifiable, elle part dans le rapport.</p>
        <div class="grid g3">
          <div class="card" style="border-top:5px solid var(--ok)"><h3>On publie</h3><ul>${buckets.ok.map((c) => `<li>${esc(c.txt)}</li>`).join("")}</ul></div>
          <div class="card" style="border-top:5px solid var(--warn)"><h3>On corrige avant</h3><ul>${buckets.mod.map((c) => `<li>${esc(c.txt)}</li>`).join("")}</ul></div>
          <div class="card" style="border-top:5px solid var(--bad)"><h3>On ne publie pas</h3><ul>${buckets.non.map((c) => `<li>${esc(c.txt)}</li>`).join("")}</ul></div>
        </div>
        <div class="card" style="margin-top:16px"><h2>Nos 9 règles</h2><ol>${REGLES.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
          <label class="l">Règles supplémentaires du cabinet</label><textarea data-b="deonto.charte" placeholder="Ajoutez les règles propres au cabinet"></textarea></div>`;
    },
    init(root, tab) {
      if (tab === "cartes") drawCard(root);
      if (tab === "detect") drawDetect(root);
      if (tab === "avis") drawAvis(root);
    },
    onBind(p, el, root) { if (p === "deonto.detect") drawDetect(root); },
  };
  APP.REGLES = REGLES;
  APP.LBL = LBL; APP.dscore = dscore; APP.auditStats = auditStats; APP.weakest = weakest;
})();
