/* Pages : démos et outils, questions, plan d'action, rapport */
(function () {
  const { PAGES, ACTIONS, esc, $, $$, save, toast } = APP;
  const S = () => APP.S;
  const nm = (i) => S().names[i] || "Participant " + (i + 1);

  /* ===================== DÉMOS ===================== */
  let flowT = [];
  function drawFlow(root, step) {
    $$(".node", root).forEach((n, i) => { n.classList.toggle("on", i <= step); });
    const f = DATA.flow[Math.max(0, step)];
    $("#flow-d", root).innerHTML = step < 0 ? `<p class="muted">Cliquez sur « Lancer la démo » ou sur une étape.</p>` : `<h3>${esc(f.t)} <span class="muted small">· ${esc(f.s)}</span></h3><p>${esc(f.d)}</p><div class="pbox" style="font-family:inherit;background:#fff;color:var(--ink);border:1px dashed var(--line)">Exemple : ${esc(f.ex)}</div>`;
  }
  ACTIONS.flowRun = () => {
    flowT.forEach(clearTimeout); flowT = []; const root = $("#view");
    drawFlow(root, -1);
    DATA.flow.forEach((_, i) => flowT.push(setTimeout(() => drawFlow(root, i), 700 + i * 1400)));
  };
  ACTIONS.flowStep = (a) => { flowT.forEach(clearTimeout); drawFlow($("#view"), +a.dataset.i); };

  function drawRoi(root) {
    const r = S().roi; const mpost = r.posts * (r.manuel - r.ia) / 60; const mmail = r.courriers * (r.cmanuel - r.cia) / 60;
    const h = Math.max(0, mpost + mmail); const y = h * 12; const eur = y * r.cout;
    $("#roi-out", root).innerHTML = `<div class="grid g3">
      <div class="card kpi"><b class="hl">${h.toFixed(1).replace(".", ",")} h</b><span>gagnées par mois</span></div>
      <div class="card kpi"><b class="pink">${Math.round(y)} h</b><span>par an, soit ${(y / 7).toFixed(1).replace(".", ",")} jours de travail</span></div>
      <div class="card kpi"><b>${Math.round(eur).toLocaleString("fr-FR")} €</b><span>de temps valorisé par an</span></div></div>
      <div style="margin-top:14px"><div class="small muted">Temps mensuel : sans IA</div><div class="meter"><i style="width:100%;background:var(--muted)"></i></div>
      <div class="small muted" style="margin-top:8px">Avec IA</div><div class="meter"><i style="width:${Math.max(4, ((r.posts * r.ia + r.courriers * r.cia) / Math.max(1, r.posts * r.manuel + r.courriers * r.cmanuel)) * 100)}%;background:var(--ok)"></i></div></div>
      <p class="small muted" style="margin-top:10px">Hypothèses de démonstration, à remplacer par les chiffres réels de la référente communication. Le temps de relecture par un dentiste est à ajouter.</p>`;
  }

  let toolCat = "Tous";
  function drawTools(root) {
    const cats = ["Tous"].concat(Array.from(new Set(DATA.tools.map((t) => t.c))));
    const rk = { vert: ["ok", "Faible risque données"], orange: ["warn", "Vigilance données"], rouge: ["bad", "À encadrer strictement"] };
    $("#tool-f", root).innerHTML = cats.map((c) => `<button class="btn sm ${c === toolCat ? "primary" : ""}" data-act="toolcat" data-c="${esc(c)}">${esc(c)}</button>`).join(" ");
    $("#tool-g", root).innerHTML = DATA.tools.filter((t) => toolCat === "Tous" || t.c === toolCat).map((t) => `<div class="card tool">
      <div class="hd"><h3 style="margin:0">${esc(t.n)}</h3><span class="chip ${rk[t.risk][0]}">${rk[t.risk][1]}</span></div>
      <div><span class="chip">${esc(t.c)}</span> <span class="chip">${esc(t.cost)}</span></div><p style="margin:4px 0">${esc(t.u)}</p>
      <p class="small muted" style="margin:0">${esc(t.rt)}</p><div><a class="btn sm" href="${esc(t.url)}" target="_blank" rel="noopener">Ouvrir</a></div></div>`).join("");
  }
  ACTIONS.toolcat = (a) => { toolCat = a.dataset.c; drawTools($("#view")); };

  PAGES.demos = {
    tabs: [["flow", "Automatisation animée"], ["roi", "Temps gagné"], ["tools", "Outils à connaître"]],
    render(tab) {
      if (tab === "flow") return `<h1>De la ligne de tableur à la publication</h1><p class="muted">Ce qu'une automatisation simple ferait, étape par étape. Rien n'est publié sans validation humaine.</p>
        <div class="flow">${DATA.flow.map((f, i) => `<div class="node ${f.t.startsWith("Validation") ? "human" : ""}" data-act="flowStep" data-i="${i}" style="cursor:pointer"><div class="n">${i + 1}</div><b>${esc(f.t)}</b><div class="small muted">${esc(f.s)}</div></div>`).join("")}</div>
        <div class="row" style="margin:16px 0"><button class="btn primary" data-act="flowRun">Lancer la démo</button></div><div class="card" id="flow-d"></div>
        <div class="card" style="margin-top:16px;border-left:5px solid var(--pink)"><b>Ce qui reste humain :</b> le choix des sujets, la relecture déontologique, la validation par un dentiste, la réponse aux patients. L'automatisation est une prochaine étape : d'abord un processus manuel qui tourne.</div>`;
      if (tab === "roi") {
        const f = (k, l, mn, mx, st) => `<div style="margin:10px 0"><div class="row sb"><span>${l}</span><b class="chip acc" id="r-${k}">${S().roi[k]}</b></div><input type="range" min="${mn}" max="${mx}" step="${st}" data-b="roi.${k}"></div>`;
        return `<h1>Combien de temps gagné ?</h1><p class="muted">Réglez les curseurs avec les chiffres de la référente communication.</p>
          <div class="split"><div class="card">${f("posts", "Publications par mois", 2, 30, 1)}${f("manuel", "Minutes par publication, sans IA", 20, 240, 5)}${f("ia", "Minutes par publication, avec IA et relecture", 5, 120, 5)}${f("courriers", "Courriers et messages types par mois", 0, 100, 5)}${f("cmanuel", "Minutes par courrier, sans IA", 3, 60, 1)}${f("cia", "Minutes par courrier, avec IA", 1, 30, 1)}${f("cout", "Coût horaire chargé (€)", 15, 80, 1)}</div>
          <div class="card" id="roi-out"></div></div>`;
      }
      return `<h1>Outils à connaître</h1><p class="muted">Le panorama utile pour un cabinet, avec le niveau de vigilance sur les données. Cliquez « Ouvrir » pour montrer en direct. Les tarifs évoluent : à vérifier sur chaque site.</p>
        <div class="row" id="tool-f" style="margin-bottom:14px"></div><div class="grid g3" id="tool-g"></div>`;
    },
    init(root, tab) {
      if (tab === "flow") drawFlow(root, -1);
      if (tab === "roi") { drawRoi(root); }
      if (tab === "tools") drawTools(root);
    },
    onBind(p, el, root) {
      if (p.startsWith("roi.")) { const k = p.split(".")[1]; const e = $("#r-" + k, root); if (e) e.textContent = S().roi[k]; drawRoi(root); }
    },
  };

  /* ===================== QUESTIONS ===================== */
  let onlyPrio = false;
  const STEP_T = { cadrage: "Cadrage", audit: "Audit en direct", deonto: "Filtre déontologique", ia: "Observer l'IA", atelier: "Atelier contenu", demos: "Démos et outils", plan: "Plan d'action" };
  PAGES.questions = {
    render() {
      const [d, n] = APP.qCount("");
      const steps = Object.keys(STEP_T);
      return `<h1>Toutes les questions à poser</h1>
        <div class="row sb"><p class="muted" style="margin:0">Rangées dans l'ordre de l'après-midi. Elles apparaissent aussi au bas de chaque étape. Cochez, puis notez la réponse.</p>
        <label class="switch"><input type="checkbox" id="onlyprio" ${onlyPrio ? "checked" : ""}><span>Prioritaires seulement (★)</span></label></div>
        <div class="row sb" style="margin:14px 0 6px"><b>Progression</b><span class="chip acc qcount" data-step="">${d} / ${n}</span></div>
        <div class="meter" style="margin-bottom:18px"><i id="qbar" style="width:${(d / n) * 100}%"></i></div>
        ${steps.map((st) => { const gs = DATA.questions.filter((g) => g.step === st); const html = gs.map((g) => APP.qGroup(g, { onlyPrio })).join(""); return html ? `<section class="card qstep"><div class="qstep-h"><span class="enum">${DATA.steps.find((s) => s.id === st).n}</span><h2>${esc(STEP_T[st])}</h2><span class="chip">${DATA.steps.find((s) => s.id === st).time.replace(":", "h")}</span></div>${html}</section>` : ""; }).join("")}`;
    },
    init(root) {
      const cb = $("#onlyprio", root); cb.addEventListener("change", () => { onlyPrio = cb.checked; APP.render(true); });
    },
    onBind(p) { if (p.startsWith("qdone.")) { const [d, n] = APP.qCount(""); const m = $("#qbar"); if (m) m.style.width = (d / n) * 100 + "%"; } },
  };

  /* ===================== PLAN D'ACTION ===================== */
  function ensurePlan() {
    const P = S().plan;
    if (!P.items) P.items = DATA.planSuggest.map((s, i) => ({ sem: s.sem, quoi: s.quoi, qui: s.qui, keep: i < 8 }));
    return P;
  }
  PAGES.plan = {
    render() {
      const P = ensurePlan();
      const who = (sel) => `<option value="">—</option>${[0, 1, 2, 3, 4].map((i) => `<option ${nm(i) === sel ? "selected" : ""}>${esc(nm(i))}</option>`).join("")}${sel && !S().names.includes(sel) ? `<option selected>${esc(sel)}</option>` : ""}`;
      return `<h1>Plan d'action sur 4 semaines</h1><p class="muted">Gardez 6 à 8 actions. Cochez « Retenir » pour les faire entrer dans le rapport. Tout est modifiable.</p>
      <div class="card" style="overflow:auto"><table class="t"><thead><tr><th>Retenir</th><th>Sem.</th><th>Action</th><th>Responsable</th></tr></thead><tbody>
      ${P.items.map((it, i) => `<tr><td><input type="checkbox" data-b="plan.items.${i}.keep"></td>
        <td><select data-b="plan.items.${i}.sem"><option>S1</option><option>S2</option><option>S3</option><option>S4</option></select></td>
        <td><textarea data-b="plan.items.${i}.quoi"></textarea></td>
        <td><select data-b="plan.items.${i}.qui">${who(it.qui)}</select></td></tr>`).join("")}</tbody></table>
      <div class="row noprint" style="margin-top:12px"><button class="btn" data-act="addPlan">Ajouter une action</button></div></div>
      <div class="grid g2" style="margin-top:16px"><div class="card"><h3>Indicateurs à regarder avant le rendez-vous de suivi</h3>
        ${DATA.indicateurs.map((x, i) => `<label class="row" style="padding:5px 0"><input type="checkbox" data-b="plan.ind.${i}"> <span>${esc(x)}</span></label>`).join("")}</div>
        <div class="card"><h3>Rendez-vous de suivi (1 h en visio, mi-novembre)</h3><label class="l">Date et heure convenues</label><input type="text" data-b="plan.suivi" placeholder="Ex. jeudi 19 novembre, 14h00">
        <p class="small muted" style="margin-top:10px">À fixer avant de quitter la salle.</p></div></div>`;
    },
  };
  ACTIONS.addPlan = () => { const P = ensurePlan(); P.items.push({ sem: "S1", quoi: "", qui: "", keep: true }); save(); APP.render(true); };

  /* ===================== RAPPORT ===================== */
  const cell = (s) => String(s == null ? "" : s).replace(/\|/g, "/").replace(/\r?\n/g, " ").trim() || " ";
  const SC = ["Absent", "À reprendre", "Correct", "Solide"];
  function md() {
    const s = S(); const out = []; const L = (x) => out.push(x);
    const date = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    L("# Rapport d'audit : communication et usage de l'IA");
    L("**SCM Ventoux, cabinet dentaire du Dr Guillaume Becker, Monteux** · " + date);
    L("Participants : " + [0, 1, 2, 3, 4].map(nm).join(", "));
    L("");
    L("## 1. Attentes et priorités");
    const att = [0, 1, 2, 3, 4].filter((i) => s.attentes[i]).map((i) => "- **" + nm(i) + "** : " + s.attentes[i]);
    L(att.length ? att.join("\n") : "- Aucune attente saisie.");
    L("");
    L("| Objectif | Priorité (0 à 5) |\n|---|---|\n" + DATA.objectifs.map((o) => "| " + o[1] + " | " + (s.objectifs[o[0]] != null ? s.objectifs[o[0]] : "-") + " |").join("\n"));
    if (s.postits.length) { L(""); L("**Ce qui agace aujourd'hui :**"); L(s.postits.map((p) => "- " + p).join("\n")); }
    L("");
    L("## 2. Audit de la communication");
    const st = APP.auditStats();
    L(st.n ? "Score global : **" + st.sum + " / " + st.n * 3 + "** (" + st.n + " critères notés sur " + DATA.audit.length + ")." : "Aucun critère noté.");
    L("");
    L("| Domaine | Moyenne (0 à 3) |\n|---|---|\n" + DATA.auditDomains.map((d) => "| " + d + " | " + (st.dom[d].n ? (st.dom[d].sum / st.dom[d].n).toFixed(1).replace(".", ",") : "-") + " |").join("\n"));
    const w = APP.weakest();
    if (w.length) { L(""); L("**Chantiers prioritaires :**"); L(w.map((c) => "- " + c.t + (s.audit[c.id].c ? " (" + cell(s.audit[c.id].c) + ")" : "")).join("\n")); }
    const rows = DATA.audit.filter((c) => s.audit[c.id] && (typeof s.audit[c.id].s === "number" || s.audit[c.id].c));
    if (rows.length) { L(""); L("| Critère | Note | Constat | Priorité |\n|---|---|---|---|\n" + rows.map((c) => { const a = s.audit[c.id]; return "| " + cell(c.t) + " | " + (typeof a.s === "number" ? a.s + " (" + SC[a.s] + ")" : "-") + " | " + cell(a.c) + " | " + cell(a.p) + " |"; }).join("\n")); }
    L("");
    L("## 3. Déontologie de la communication");
    const ds = APP.dscore();
    L(ds.done ? "Quiz « publiable ou non ? » : **" + ds.good + " bonnes réponses sur " + ds.done + "** cartes traitées." : "Quiz non réalisé.");
    const miss = DATA.cards.filter((c) => s.deonto.votes[c.id] && s.deonto.votes[c.id].g && s.deonto.votes[c.id].g !== c.v);
    if (miss.length) { L(""); L("**Cas à retravailler :**"); L(miss.map((c) => "- " + c.txt + " → " + APP.LBL[c.v] + " (" + c.art + ")").join("\n")); }
    L(""); L("**Charte « on publie / on ne publie pas » :**"); L(APP.REGLES.map((r) => "- " + r).join("\n"));
    if (s.deonto.charte) L("\nRègles supplémentaires du cabinet :\n" + s.deonto.charte);
    L("");
    L("**Avis en ligne :** position prudente proposée : ne pas citer ni solliciter d'avis, ne pas répondre de façon nominative, ne jamais confirmer qu'une personne est patiente. À valider avec le conseil départemental de l'Ordre du Vaucluse.");
    L("");
    L("## 4. Usage actuel de l'IA");
    const ob = [0, 1, 2, 3, 4].filter((i) => s.ia.obs[i] && (s.ia.obs[i].outil || s.ia.obs[i].niv || s.ia.obs[i].pos || s.ia.obs[i].axe || Object.keys(s.ia.obs[i].c || {}).length));
    if (ob.length) {
      L("| Participant | Outil et compte | Niveau | Point positif | Axe d'amélioration |\n|---|---|---|---|---|\n" + ob.map((i) => { const o = s.ia.obs[i]; return "| " + cell(nm(i)) + " | " + cell(o.outil) + " | " + (APP.NIV[o.niv || 0] || "-") + " | " + cell(o.pos) + " | " + cell(o.axe) + " |"; }).join("\n"));
      const alert = []; ob.forEach((i) => DATA.obsCriteria.forEach((c) => { if (s.ia.obs[i].c && s.ia.obs[i].c[c[0]] === 0) alert.push("- " + nm(i) + " : " + c[1] + " (" + c[3] + ")"); }));
      if (alert.length) { L(""); L("**Signaux d'alerte :**"); L(alert.join("\n")); }
    } else L("Observation non renseignée.");
    const H = s.ia.hunt; if (H.done) { const good = DATA.hunt.filter((x, i) => x.err && H.picked[i]).length; L("\nChasse aux erreurs : " + good + " / " + DATA.hunt.filter((x) => x.err).length + " pièges repérés."); }
    if (s.ia.quiz.i >= DATA.quiz.length) L("\nQuiz de rappel : " + s.ia.quiz.score + " / " + DATA.quiz.length + ".");
    L("");
    L("## 5. Ligne éditoriale et production");
    const A = s.atelier; const pil = DATA.rubriques.filter((r) => A.piliers[r.id]).map((r) => r.t);
    L("Piliers retenus : **" + (pil.join(", ") || "aucun") + "**. Rythme : **" + A.freq + " publication(s) par semaine**, environ " + A.minPost + " minutes chacune, soit " + ((A.freq * A.minPost) / 60).toFixed(1).replace(".", ",") + " h par semaine.");
    if (A.piliersNote) L("\nTon et lignes rouges : " + A.piliersNote);
    if (A.sujet) { L("\n**Prompt construit en séance** (sujet : " + A.sujet + ") :\n```\n" + APP.promptText() + "\n```"); }
    if (A.cal.length) { L(""); L("| Sem. | Jour | Rubrique | Sujet | Format | Prépare | Valide |\n|---|---|---|---|---|---|---|\n" + A.cal.map((c) => "| " + [c.s, c.j, c.r, c.sujet, c.fmt, c.qui, c.val].map(cell).join(" | ") + " |").join("\n")); }
    L("");
    L("## 6. Démonstrations vues");
    const DM = [["tab:demos:flow", "Automatisation animée"], ["tab:demos:roi", "Calculateur de temps gagné"], ["tab:demos:tools", "Panorama des outils"], ["tab:atelier:studio", "Studio visuel"], ["tab:atelier:scorer", "Scoreur de prompt"], ["tab:deonto:detect", "Détecteur déontologique"], ["tab:ia:hunt", "Chasse aux erreurs"], ["tab:ia:quiz", "Quiz de rappel"]];
    L(DM.filter((d) => s.demos[d[0]]).map((d) => "- " + d[1]).join("\n") || "- Aucune.");
    const r = s.roi; const hh = Math.max(0, r.posts * (r.manuel - r.ia) / 60 + r.courriers * (r.cmanuel - r.cia) / 60);
    if (s.demos["tab:demos:roi"]) L("\nTemps gagné estimé (hypothèses de démonstration) : environ " + hh.toFixed(1).replace(".", ",") + " h par mois.");
    L("");
    L("## 7. Questions posées et réponses");
    const qa = []; DATA.questions.forEach((g) => g.q.forEach((q) => { if (s.qdone[q[0]] || s.qa[q[0]]) qa.push("- **" + q[1] + "**\n  " + (s.qa[q[0]] ? s.qa[q[0]].replace(/\n/g, " ") : "(réponse non notée)")); }));
    L(qa.length ? qa.join("\n") : "- Aucune question renseignée.");
    L("");
    L("## 8. Plan d'action");
    const P = s.plan.items ? s.plan.items.filter((i) => i.keep && i.quoi) : [];
    L(P.length ? "| Semaine | Action | Responsable |\n|---|---|---|\n" + P.map((i) => "| " + cell(i.sem) + " | " + cell(i.quoi) + " | " + cell(i.qui) + " |").join("\n") : "Aucune action retenue.");
    const ind = DATA.indicateurs.filter((_, i) => s.plan.ind[i]);
    if (ind.length) { L(""); L("**Indicateurs suivis :**"); L(ind.map((x) => "- " + x).join("\n")); }
    L(""); L("**Rendez-vous de suivi :** " + (s.plan.suivi || "à convenir (mi-novembre, 1 h en visio)"));
    if (s.notes) { L(""); L("## 9. Notes de séance"); L(s.notes.split("\n").map((x) => "- " + x).join("\n")); }
    L("");
    L("## Cadre et limites");
    L("Les repères déontologiques s'appuient sur le décret n° 2020-1658 du 22 décembre 2020 et sur les recommandations ordinales sur la communication professionnelle (version de mars 2023). Ce rapport est un document de conseil et d'aide à la décision : il ne constitue pas un avis juridique et ne remplace ni l'avis du conseil départemental de l'Ordre ni celui d'un avocat. Aucune donnée de patient n'a été traitée.");
    return out.join("\n");
  }

  function mdToHtml(src) {
    const lines = src.split("\n"); let html = "", i = 0;
    const inl = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    while (i < lines.length) {
      const l = lines[i];
      if (l.startsWith("```")) { let j = i + 1, buf = []; while (j < lines.length && !lines[j].startsWith("```")) buf.push(lines[j++]); html += `<div class="pbox">${esc(buf.join("\n"))}</div>`; i = j + 1; continue; }
      if (l.startsWith("|")) {
        const rows = []; while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
        const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        html += `<table class="t"><thead><tr>${cells(rows[0]).map((c) => `<th>${inl(c)}</th>`).join("")}</tr></thead><tbody>${rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inl(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`; continue;
      }
      if (/^- /.test(l)) { const items = []; while (i < lines.length && (/^- /.test(lines[i]) || /^  \S/.test(lines[i]))) { if (/^- /.test(lines[i])) items.push(lines[i].slice(2)); else items[items.length - 1] += "<br>" + lines[i].trim(); i++; } html += "<ul>" + items.map((x) => `<li>${inl(x).replace(/&lt;br&gt;/g, "<br>")}</li>`).join("") + "</ul>"; continue; }
      if (l.startsWith("## ")) html += `<h2>${inl(l.slice(3))}</h2>`;
      else if (l.startsWith("# ")) html += `<h1>${inl(l.slice(2))}</h1>`;
      else if (l.trim()) html += `<p>${inl(l)}</p>`;
      i++;
    }
    return html;
  }
  ACTIONS.print = () => window.print();
  ACTIONS.dlmd = () => { const b = new Blob([md()], { type: "text/markdown" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "rapport-audit-" + new Date().toISOString().slice(0, 10) + ".md"; a.click(); URL.revokeObjectURL(u); toast("Rapport téléchargé"); };
  ACTIONS.cpmd = () => { const t = md(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Rapport copié"), () => toast("Copie impossible")); };

  PAGES.rapport = {
    render() {
      return `<div class="row sb noprint"><h1 style="margin:0">Rapport final</h1><div class="row">
        <button class="btn primary" data-act="print">Imprimer / PDF</button><button class="btn" data-act="dlmd">Télécharger (.md)</button><button class="btn" data-act="cpmd">Copier le texte</button><button class="btn" data-act="export">Sauvegarde (.json)</button></div></div>
        <p class="muted noprint">Généré en direct à partir de tout ce qui a été rempli. Pour obtenir un PDF : « Imprimer / PDF » puis « Enregistrer au format PDF ».</p>
        <div class="card report" id="rep" style="margin-top:14px">${mdToHtml(md())}</div>`;
    },
  };
})();
