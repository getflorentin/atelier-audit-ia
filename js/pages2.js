/* Pages : observer l'IA, atelier contenu */
(function () {
  const { PAGES, ACTIONS, esc, $, $$, save, toast, confetti } = APP;
  const S = () => APP.S;
  const nm = (i) => S().names[i] || "Participant " + (i + 1);

  /* ===================== OBSERVER L'IA ===================== */
  const NIV = ["", "Débutant", "Utilisateur", "Avancé"];
  function obsCard(i) {
    const o = S().ia.obs[i] || { c: {} };
    const rows = DATA.obsCriteria.map((c) => {
      const v = o.c && o.c[c[0]];
      return `<div style="margin:8px 0"><div class="small"><b>${esc(c[1])}</b></div>
        <div class="row" style="gap:6px">
          <button class="btn sm ${v === 2 ? "primary" : ""}" data-act="obs" data-i="${i}" data-k="${c[0]}" data-v="2" title="${esc(c[2])}">✓ Bien</button>
          <button class="btn sm ${v === 1 ? "pinkb" : ""}" data-act="obs" data-i="${i}" data-k="${c[0]}" data-v="1">~ Moyen</button>
          <button class="btn sm ${v === 0 ? "ghost" : ""}" style="${v === 0 ? "border-color:var(--bad);color:var(--bad)" : ""}" data-act="obs" data-i="${i}" data-k="${c[0]}" data-v="0" title="${esc(c[3])}">✗ Alerte</button>
        </div><div class="small muted">${esc(c[2])} · ${esc(c[3])}</div></div>`;
    }).join("");
    return `<div class="card"><div class="row sb"><b>${esc(nm(i))}</b><span class="chip acc">${NIV[o.niv || 0] || "Niveau ?"}</span></div>
      <label class="l">Outil et compte</label><select data-b="ia.obs.${i}.outil"><option value="">—</option><option>Compte équipe / entreprise</option><option>Abonnement personnel payant</option><option>Compte gratuit personnel</option><option>Aucun usage</option></select>
      <label class="l">Niveau constaté</label><select data-b="ia.obs.${i}.niv" data-n="1"><option value="">—</option><option value="1">Débutant (copier-coller)</option><option value="2">Utilisateur (consignes structurées)</option><option value="3">Avancé (contexte réutilisable, relecture)</option></select>
      ${rows}
      <label class="l">Point positif</label><input type="text" data-b="ia.obs.${i}.pos">
      <label class="l">Axe d'amélioration</label><input type="text" data-b="ia.obs.${i}.axe">
    </div>`;
  }
  ACTIONS.obs = (a) => {
    const o = (S().ia.obs[a.dataset.i] = S().ia.obs[a.dataset.i] || { c: {} }); o.c = o.c || {};
    const v = +a.dataset.v; o.c[a.dataset.k] = o.c[a.dataset.k] === v ? undefined : v; save(); APP.render(true);
  };

  function drawHunt(root) {
    const H = S().ia.hunt; const done = H.done;
    $("#hunt", root).innerHTML = DATA.hunt.map((s, i) => {
      let cls = H.picked[i] ? "picked" : "";
      if (done) cls = s.err ? (H.picked[i] ? "right" : "missed") : (H.picked[i] ? "wrong" : "");
      return `<span class="hunt-s ${cls}" data-act="hpick" data-i="${i}">${esc(s.t)}</span> `;
    }).join("");
    if (done) {
      let good = 0, total = DATA.hunt.filter((s) => s.err).length, fp = 0;
      DATA.hunt.forEach((s, i) => { if (s.err && H.picked[i]) good++; if (!s.err && H.picked[i]) fp++; });
      $("#hunt-res", root).innerHTML = `<div class="card" style="margin-top:14px"><h3>Résultat : ${good} erreur(s) sur ${total} repérée(s)${fp ? ", " + fp + " fausse(s) alerte(s)" : ""}</h3>
        ${DATA.hunt.filter((s) => s.err).map((s) => `<div class="finding red"><b>« ${esc(s.t)} »</b><br><span class="small">${esc(s.why)}</span></div>`).join("")}
        <p class="small muted">Leçon : l'IA écrit avec le même aplomb vrai et faux. Relire = vérifier faits, chiffres, informations propres au cabinet et promesses.</p></div>`;
    } else $("#hunt-res", root).innerHTML = "";
    $("#hunt-btn", root).textContent = done ? "Rejouer" : "Vérifier";
  }
  ACTIONS.hpick = (a) => { const H = S().ia.hunt; if (H.done) return; H.picked[a.dataset.i] = !H.picked[a.dataset.i]; save(); drawHunt($("#view")); };
  ACTIONS.hcheck = () => {
    const H = S().ia.hunt;
    if (H.done) { S().ia.hunt = { picked: {}, done: false }; } else { H.done = true; const all = DATA.hunt.every((s, i) => !!s.err === !!H.picked[i]); if (all) confetti(); }
    save(); drawHunt($("#view"));
  };

  function drawQuiz(root) {
    const Q = S().ia.quiz; const el = $("#quiz", root);
    if (Q.i >= DATA.quiz.length) {
      el.innerHTML = `<h2>Terminé : ${Q.score} / ${DATA.quiz.length}</h2><p class="muted">${Q.score >= 5 ? "Les bases sont solides." : "Quelques réflexes à consolider : c'est l'objet de l'atelier."}</p><button class="btn" data-act="qreset">Rejouer</button>`;
      return;
    }
    const q = DATA.quiz[Q.i]; const ans = Q.ans[Q.i];
    el.innerHTML = `<div class="small muted">Question ${Q.i + 1} / ${DATA.quiz.length}</div><h2>${esc(q.q)}</h2>
      ${q.o.map((o, k) => `<button class="opt ${ans != null ? (k === q.a ? "good" : k === ans ? "bad" : "") : ""}" data-act="qans" data-k="${k}">${esc(o)}</button>`).join("")}
      ${ans != null ? `<div class="reveal ${ans === q.a ? "ok" : "non"}"><b>${ans === q.a ? "Exact." : "Pas tout à fait."}</b> ${esc(q.e)}</div><div class="row" style="margin-top:12px"><button class="btn primary" data-act="qnext">Suivant →</button></div>` : ""}`;
  }
  ACTIONS.qans = (a) => { const Q = S().ia.quiz; if (Q.ans[Q.i] != null) return; Q.ans[Q.i] = +a.dataset.k; if (+a.dataset.k === DATA.quiz[Q.i].a) Q.score++; save(); drawQuiz($("#view")); };
  ACTIONS.qnext = () => { const Q = S().ia.quiz; Q.i++; save(); drawQuiz($("#view")); if (Q.i >= DATA.quiz.length && Q.score >= 5) confetti(); };
  ACTIONS.qreset = () => { S().ia.quiz = { i: 0, score: 0, ans: {} }; save(); drawQuiz($("#view")); };

  PAGES.ia = {
    tabs: [["obs", "Observation"], ["hunt", "Chasse aux erreurs"], ["quiz", "Quiz de rappel"]],
    render(tab) {
      if (tab === "obs") return `<h1>Observer leur usage de l'IA</h1>
        <p class="muted">Consigne type : « Écrivez un post Instagram sur l'hygiène et la stérilisation au cabinet. » Ne rien corriger pendant l'exercice. Remplir ensuite la fiche de chacun.</p>
        <div class="grid g5" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${[0, 1, 2, 3, 4].map(obsCard).join("")}</div>`;
      if (tab === "hunt") return `<h1>Chasse aux erreurs</h1>
        <p class="muted">Ce texte a été « rédigé par une IA » pour le blog du cabinet. Cliquez sur les phrases qui doivent être vérifiées avant publication.</p>
        <div class="card" style="font-size:1.1rem;line-height:2"><div id="hunt"></div></div><div id="hunt-res"></div>
        <div class="row" style="margin-top:12px"><button class="btn primary" id="hunt-btn" data-act="hcheck">Vérifier</button><span class="muted small">4 pièges cachés : un fait médical, un chiffre inventé, une info sur le cabinet, une promesse.</span></div>`;
      return `<h1>Quiz de rappel</h1><p class="muted">Six questions tirées de la session du 24 septembre.</p><div class="card" id="quiz" style="max-width:720px"></div>`;
    },
    init(root, tab) { if (tab === "hunt") drawHunt(root); if (tab === "quiz") drawQuiz(root); },
  };

  /* ===================== ATELIER CONTENU ===================== */
  function buildPrompt() {
    const A = S().atelier; const T = DATA.taches[A.tache]; const rub = (DATA.rubriques.find((r) => r.id === A.rubrique) || {}).t || "";
    const fill = (s) => s.replace("{sujet}", A.sujet || "[sujet à préciser]").replace("{rubrique}", rub).replace("{longueur}", A.longueur || "100 mots");
    const cons = DATA.contraintes.filter((c) => A.checks[c[0]]).map((c) => "- " + c[1]).join("\n");
    return [
      ["RÔLE", "Tu es " + T.role + "."],
      ["CONTEXTE", A.ctx.trim()],
      ["TÂCHE", fill(T.tache)],
      ["CONTRAINTES", cons || "- (aucune)"],
      ["FORMAT", T.format],
    ];
  }
  function promptText() { return buildPrompt().map(([k, v]) => k + "\n" + v).join("\n\n"); }
  function drawPrompt(root) {
    const parts = buildPrompt();
    $("#pbox", root).innerHTML = parts.map(([k, v]) => `<span class="k">${k}</span>\n${esc(v)}`).join("\n\n");
    const len = promptText().length; $("#plen", root).textContent = len + " caractères";
  }
  ACTIONS.ask = (a) => {
    const q = encodeURIComponent(promptText());
    const u = { gpt: "https://chatgpt.com/?q=", claude: "https://claude.ai/new?q=", mistral: "https://chat.mistral.ai/chat?q=" }[a.dataset.ai];
    window.open(u + q, "_blank", "noopener");
  };

  function scorePrompt(t) {
    const L = t.toLowerCase();
    const p = {
      "Rôle": /(tu es|vous êtes|en tant que|agis comme|joue le rôle)/.test(L) ? 100 : 0,
      "Contexte": Math.min(100, (/(cabinet|dentaire|monteux|patients?|public|ton|charte)/.test(L) ? 40 : 0) + Math.min(60, Math.floor(t.length / 6))),
      "Tâche": /(rédige|écris|propose|construis|transforme|résume|liste|compare|prépare|génère|analyse)/.test(L) ? 100 : (t.length > 20 ? 35 : 0),
      "Format": /(mots|tableau|liste|titre|hashtag|paragraphe|puces|diapositive|caractères|variantes?|étapes)/.test(L) ? 100 : 0,
      "Garde-fous": /(sans|aucun|aucune|ne pas|jamais|vérifier|pas de)/.test(L) ? 100 : 0,
    };
    const tot = Math.round(Object.values(p).reduce((a, b) => a + b, 0) / 5);
    return { p, tot };
  }
  function drawScorer(root) {
    const t = S().atelier.scorer || ""; const r = scorePrompt(t);
    $("#sc-out", root).innerHTML = t.trim() ? `<div class="row sb"><h2 style="margin:0">Note de la consigne</h2><b style="font-size:1.6rem" class="${r.tot >= 70 ? "hl" : ""}">${r.tot} / 100</b></div>
      ${Object.entries(r.p).map(([k, v]) => `<div class="pillar"><span>${k}</span><div class="meter"><i style="width:${v}%"></i></div><span>${v >= 100 ? "✓" : v > 0 ? "~" : "✗"}</span></div>`).join("")}
      <p class="small muted">Heuristique simple (mots-clés). Elle illustre les piliers, elle ne remplace pas un essai réel.</p>` : `<p class="muted">Écrivez ou collez une consigne à gauche pour la noter en direct.</p>`;
  }
  ACTIONS.scEx = (a) => {
    const ex = ["Écris un post sur les gencives.", "Tu es chargé(e) de communication d'un cabinet dentaire libéral à Monteux. Rédige une légende Instagram de 100 mots sur les gencives qui saignent, ton chaleureux, sans promesse de résultat et sans aucun nom de patient. Format : légende, 3 accroches, 5 hashtags, et liste des points à vérifier."];
    S().atelier.scorer = ex[+a.dataset.i]; save(); $("#sc-in").value = S().atelier.scorer; drawScorer($("#view"));
  };

  /* Calendrier */
  const JOURS = ["Mardi", "Jeudi"];
  function genCal() {
    const A = S().atelier; const act = DATA.rubriques.filter((r) => A.piliers[r.id]); if (!act.length) { toast("Retenez au moins un pilier"); return; }
    const per = Math.max(1, Math.min(5, A.freq || 2)); const cal = []; let k = 0;
    const used = {}; const days = ["Mardi", "Jeudi", "Lundi", "Mercredi", "Vendredi"];
    for (let w = 1; w <= 4; w++) for (let j = 0; j < per; j++) {
      const r = act[k % act.length]; const idx = Math.floor(k / act.length) % r.ex.length; k++;
      cal.push({ s: "S" + w, j: days[j], canal: A.canaux.insta && A.canaux.fb ? "Instagram + Facebook" : A.canaux.fb ? "Facebook" : "Instagram", r: r.t, sujet: r.ex[idx], fmt: r.id === "pedago" ? "Carrousel" : r.id === "equipe" ? "Photo" : "Story ou reel", qui: nm(4), val: nm(0) });
    }
    A.cal = cal; save();
  }
  function drawCal(root) {
    const A = S().atelier; const opts = (sel) => [0, 1, 2, 3, 4].map((i) => `<option ${nm(i) === sel ? "selected" : ""}>${esc(nm(i))}</option>`).join("");
    $("#cal", root).innerHTML = A.cal.length ? `<table class="t"><thead><tr><th>Sem.</th><th>Jour</th><th>Rubrique</th><th>Sujet</th><th>Format</th><th>Prépare</th><th>Valide</th></tr></thead><tbody>${A.cal.map((c, i) => `<tr>
      <td>${esc(c.s)}</td><td>${esc(c.j)}</td><td>${esc(c.r)}</td>
      <td><textarea data-b="atelier.cal.${i}.sujet">${esc(c.sujet)}</textarea></td>
      <td><input type="text" data-b="atelier.cal.${i}.fmt"></td>
      <td><select data-b="atelier.cal.${i}.qui">${opts(c.qui)}</select></td>
      <td><select data-b="atelier.cal.${i}.val">${opts(c.val)}</select></td></tr>`).join("")}</tbody></table>` : `<p class="muted">Cliquez sur « Générer » pour pré-remplir 4 semaines à partir des piliers retenus.</p>`;
    APP.bindAll($("#cal", root));
  }
  ACTIONS.genCal = () => { genCal(); drawCal($("#view")); };

  /* Studio visuel */
  const PALS = [{ bg: "#fff6fa", fg: "#d6246e", ink: "#2a1f25", n: "Rose cabinet" }, { bg: "#d6246e", fg: "#ffffff", ink: "#ffffff", n: "Rose plein" }, { bg: "#faf8f4", fg: "#c8401f", ink: "#23201c", n: "Crème" }, { bg: "#23201c", fg: "#ff7aa8", ink: "#ffffff", n: "Nuit" }];
  function wrap(ctx, text, x, y, maxW, lh) {
    const words = String(text).split(/\s+/); let line = "", yy = y;
    words.forEach((w) => { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = t; });
    if (line) { ctx.fillText(line, x, yy); yy += lh; }
    return yy;
  }
  function drawStudio() {
    const c = $("#cv"); if (!c) return; const st = S().atelier.studio; const P = PALS[st.pal] || PALS[0]; const ctx = c.getContext("2d");
    const W = 1080, F = "'DM Sans', system-ui, sans-serif";
    ctx.clearRect(0, 0, W, W); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, W);
    ctx.textBaseline = "top";
    // monogramme
    ctx.fillStyle = P.fg; ctx.font = "700 64px " + F; ctx.fillText("GB", 70, 66);
    ctx.fillRect(70, 140, 70, 6);
    // tag
    ctx.font = "700 34px " + F; const tag = (st.tag || "").toUpperCase(); const tw = ctx.measureText(tag).width + 48;
    ctx.fillStyle = P.fg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(W - 70 - tw, 70, tw, 58, 29) : ctx.rect(W - 70 - tw, 70, tw, 58); ctx.fill();
    ctx.fillStyle = P.bg === "#d6246e" ? "#d6246e" : P.bg; ctx.fillText(tag, W - 70 - tw + 24, 82);
    if (st.tpl === "faq") { ctx.strokeStyle = P.fg; ctx.lineWidth = 6; ctx.strokeRect(70, 250, W - 140, 520); }
    if (st.tpl === "annonce") { ctx.fillStyle = P.fg + "22"; ctx.beginPath(); ctx.arc(W - 120, W - 260, 300, 0, 7); ctx.fill(); }
    // titre
    ctx.fillStyle = st.tpl === "pedago" ? P.fg : P.ink; ctx.font = (st.tpl === "annonce" ? "700 104px " : "700 88px ") + F;
    const tx = st.tpl === "faq" ? 110 : 70; const mw = st.tpl === "faq" ? W - 220 : W - 140;
    let y = st.tpl === "faq" ? 290 : 250; y = wrap(ctx, st.titre, tx, y, mw, st.tpl === "annonce" ? 118 : 100) + 24;
    ctx.fillStyle = P.ink; ctx.font = "400 46px " + F; wrap(ctx, st.texte, tx, y, mw, 64);
    // pied
    ctx.fillStyle = P.fg; ctx.fillRect(0, W - 130, W, 130);
    ctx.fillStyle = P.bg === "#d6246e" ? "#d6246e" : P.bg; ctx.font = "500 30px " + F; wrap(ctx, st.pied, 70, W - 95, W - 140, 38);
  }
  ACTIONS.dl = () => { const a = document.createElement("a"); a.download = "post-cabinet.png"; a.href = $("#cv").toDataURL("image/png"); a.click(); toast("Image téléchargée"); };
  ACTIONS.pal = (a) => { S().atelier.studio.pal = +a.dataset.i; save(); $$(".swatches button").forEach((b, i) => b.classList.toggle("on", i === +a.dataset.i)); drawStudio(); };

  const RELECTURE = ["Chaque fait, chiffre et date est vérifié à la source", "Aucune information fausse sur le cabinet (horaires, services, équipe)", "Aucune promesse de résultat, aucun superlatif, aucune comparaison", "Aucune promotion, aucun avant/après, aucun témoignage ou avis cité", "Aucun patient identifiable (nom, visage, radio, capture d'écran)", "Accord écrit des personnes visibles sur les photos", "Ton conforme : mesuré, informatif, pas commercial", "Validé par un dentiste désigné"];

  PAGES.atelier = {
    tabs: [["piliers", "Piliers et rythme"], ["prompt", "Constructeur de prompt"], ["scorer", "Scoreur de prompt"], ["cal", "Calendrier"], ["studio", "Studio visuel"], ["relecture", "Grille de relecture"]],
    render(tab) {
      const A = S().atelier;
      if (tab === "piliers") return `<h1>Ligne éditoriale : piliers et rythme</h1>
        <p class="muted">Quatre piliers maximum et un rythme que Charlotte peut vraiment tenir.</p>
        <div class="grid g2">${DATA.rubriques.map((r) => `<div class="card"><label class="row"><input type="checkbox" data-b="atelier.piliers.${r.id}"> <h3 style="margin:0">${esc(r.t)}</h3></label>
          <ul class="small muted">${r.ex.slice(0, 4).map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`).join("")}</div>
        <div class="grid g2" style="margin-top:16px">
          <div class="card"><h3>Rythme</h3><div class="row sb"><span>Publications par semaine</span><b id="fq">${A.freq}</b></div><input type="range" min="1" max="5" data-b="atelier.freq">
            <div class="row sb" style="margin-top:12px"><span>Minutes par publication</span><b id="mp">${A.minPost}</b></div><input type="range" min="10" max="120" step="5" data-b="atelier.minPost">
            <p style="margin-top:12px">Charge hebdomadaire : <b class="hl" id="charge"></b></p>
            <div class="checks"><label><input type="checkbox" data-b="atelier.canaux.insta"><span>Instagram</span></label><label><input type="checkbox" data-b="atelier.canaux.fb"><span>Facebook</span></label></div></div>
          <div class="card"><h3>Ton et lignes rouges</h3><textarea data-b="atelier.piliersNote" style="min-height:150px" placeholder="Ton du cabinet, sujets refusés, ce qu'on ne publiera jamais"></textarea></div>
        </div>`;
      if (tab === "prompt") return `<h1>Constructeur de prompt</h1><p class="muted">Rôle, contexte, tâche, format : les quatre piliers, plus des garde-fous déontologiques.</p>
        <div class="split"><div class="card">
          <label class="l">Type de contenu</label><select data-b="atelier.tache">${Object.entries(DATA.taches).map(([k, v]) => `<option value="${k}">${esc(v.t)}</option>`).join("")}</select>
          <div class="grid g2"><div><label class="l">Rubrique</label><select data-b="atelier.rubrique">${DATA.rubriques.map((r) => `<option value="${r.id}">${esc(r.t)}</option>`).join("")}</select></div>
          <div><label class="l">Longueur</label><select data-b="atelier.longueur"><option>60 mots</option><option>100 mots</option><option>150 mots</option><option>400 à 600 mots</option></select></div></div>
          <label class="l">Sujet</label><input type="text" id="sujet" data-b="atelier.sujet" placeholder="Ex. : mois sans tabac et gencives">
          <div class="row" style="margin-top:6px"><span class="small muted">Idées :</span><span id="ideas"></span></div>
          <label class="l">Garde-fous</label><div class="checks">${DATA.contraintes.map((c) => `<label><input type="checkbox" data-b="atelier.checks.${c[0]}"><span>${esc(c[1])}</span></label>`).join("")}</div>
          <label class="l">Bloc de contexte du cabinet (modifiable, réutilisable)</label><textarea data-b="atelier.ctx" style="min-height:210px"></textarea>
        </div>
        <div class="card" style="position:sticky;top:16px"><div class="row sb"><h2 style="margin:0">Prompt prêt</h2><span class="small muted" id="plen"></span></div>
          <div class="pbox" id="pbox" style="margin-top:10px"></div>
          <div class="row" style="margin-top:12px"><button class="btn primary" data-act="copy" data-from="#pbox">Copier</button>
            <button class="btn" data-act="ask" data-ai="gpt">Ouvrir dans ChatGPT</button><button class="btn" data-act="ask" data-ai="claude">Claude</button><button class="btn" data-act="ask" data-ai="mistral">Mistral</button></div>
          <p class="small muted" style="margin-top:8px">Aucune donnée de patient dans le prompt. Les liens ouvrent l'outil avec le prompt prérempli si l'outil le permet ; sinon, collez-le.</p></div></div>`;
      if (tab === "scorer") return `<h1>Scoreur de prompt</h1><p class="muted">Demandez à un dentiste d'écrire sa consigne habituelle, puis regardez la note.</p>
        <div class="split"><div class="card"><label class="l">Consigne</label><textarea id="sc-in" data-b="atelier.scorer" style="min-height:200px" placeholder="Collez ou tapez une consigne"></textarea>
          <div class="row" style="margin-top:10px"><button class="btn sm" data-act="scEx" data-i="0">Exemple faible</button><button class="btn sm" data-act="scEx" data-i="1">Exemple structuré</button></div></div>
          <div class="card" id="sc-out"></div></div>`;
      if (tab === "cal") return `<h1>Calendrier éditorial sur 4 semaines</h1><p class="muted">Généré à partir des piliers et du rythme choisis, puis modifiable ligne par ligne.</p>
        <div class="row noprint" style="margin-bottom:12px"><button class="btn primary" data-act="genCal">Générer le calendrier</button><span class="small muted">Piliers retenus : ${DATA.rubriques.filter((r) => A.piliers[r.id]).map((r) => r.t).join(", ") || "aucun"} · ${A.freq} publication(s) par semaine</span></div>
        <div class="card" id="cal" style="overflow:auto"></div>`;
      if (tab === "studio") return `<h1>Studio visuel</h1><p class="muted">Un post aux couleurs du cabinet en deux minutes, sans compétence en design. Téléchargez l'image.</p>
        <div class="studio"><div class="card"><canvas id="cv" width="1080" height="1080"></canvas></div>
        <div class="card"><label class="l">Modèle</label><select data-b="atelier.studio.tpl"><option value="pedago">Pédagogie</option><option value="faq">FAQ encadrée</option><option value="annonce">Annonce</option></select>
          <label class="l">Étiquette</label><input type="text" data-b="atelier.studio.tag">
          <label class="l">Titre</label><input type="text" data-b="atelier.studio.titre">
          <label class="l">Texte</label><textarea data-b="atelier.studio.texte"></textarea>
          <label class="l">Pied de page</label><input type="text" data-b="atelier.studio.pied">
          <label class="l">Palette</label><div class="swatches">${PALS.map((p, i) => `<button title="${p.n}" data-act="pal" data-i="${i}" class="${A.studio.pal === i ? "on" : ""}" style="background:linear-gradient(135deg,${p.bg} 50%,${p.fg} 50%)"></button>`).join("")}</div>
          <div class="row" style="margin-top:14px"><button class="btn primary" data-act="dl">Télécharger en PNG</button></div>
          <p class="small muted">Démonstration : le monogramme est un texte, pas le logo officiel du cabinet.</p></div></div>`;
      return `<h1>Grille de relecture en 2 minutes</h1><p class="muted">À cocher avant chaque publication. Le cabinet peut l'imprimer.</p>
        <div class="card" style="max-width:760px">${RELECTURE.map((r, i) => `<label class="row" style="padding:8px 0;border-top:${i ? "1px solid var(--line)" : "0"}"><input type="checkbox" data-b="atelier.relecture.${i}"> <span>${esc(r)}</span></label>`).join("")}
          <label class="l">Relu et validé par</label><select data-b="atelier.relecteur"><option value="">—</option>${[0, 1, 2, 3, 4].map((i) => `<option>${esc(nm(i))}</option>`).join("")}</select>
          <div class="meter" style="margin-top:14px"><i id="rl-bar" style="width:0"></i></div><p class="small muted" id="rl-txt"></p></div>`;
    },
    init(root, tab) {
      const upd = {
        piliers() { const A = S().atelier; const h = (A.freq * A.minPost) / 60; $("#charge", root).textContent = h.toFixed(1).replace(".", ",") + " h par semaine"; $("#fq", root).textContent = A.freq; $("#mp", root).textContent = A.minPost; },
        prompt() { drawPrompt(root); const r = DATA.rubriques.find((x) => x.id === S().atelier.rubrique); $("#ideas", root).innerHTML = r.ex.slice(0, 3).map((e, i) => `<span class="hint" data-act="idea" data-i="${i}">${esc(e)}</span>`).join(" "); },
        scorer() { drawScorer(root); },
        cal() { drawCal(root); },
        studio() { drawStudio(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawStudio); },
        relecture() { const n = RELECTURE.filter((_, i) => S().atelier.relecture[i]).length; $("#rl-bar", root).style.width = (n / RELECTURE.length) * 100 + "%"; $("#rl-txt", root).textContent = n + " / " + RELECTURE.length + " points validés" + (n === RELECTURE.length ? " : prêt à publier" : ""); if (n === RELECTURE.length && !upd._c) { upd._c = 1; confetti(); } },
      };
      PAGES.atelier._upd = upd[tab] || (() => {});
      (upd[tab] || (() => {}))();
    },
    onBind() { PAGES.atelier._upd && PAGES.atelier._upd(); },
  };
  ACTIONS.idea = (a) => { const r = DATA.rubriques.find((x) => x.id === S().atelier.rubrique); S().atelier.sujet = r.ex[+a.dataset.i]; save(); $("#sujet").value = S().atelier.sujet; PAGES.atelier._upd(); };
  APP.promptText = promptText; APP.RELECTURE = RELECTURE; APP.NIV = NIV;
})();
