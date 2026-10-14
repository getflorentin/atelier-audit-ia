/* Données statiques de l'atelier : tout est modifiable ici. */
window.DATA = {};

DATA.links = {
  site: "https://www.becker-guillaume.fr/",
  insta: "https://www.instagram.com/cab_dentaire_guillaume_becker/",
  fb: "https://www.facebook.com/CABINETGBECKER/?locale=fr_FR",
  google: "https://www.google.com/search?q=Cabinet+dentaire+Guillaume+Becker+Monteux",
};

DATA.participants = ["Dr Becker", "Dr Dauphin", "Dr 3", "Manager", "Réf. communication"];

DATA.steps = [
  { id: "home", n: "", t: "Accueil", time: "", ico: "◎" },
  { id: "cadrage", n: "1", t: "Cadrage", time: "14:00", ico: "◔" },
  { id: "audit", n: "2", t: "Audit en direct", time: "14:15", ico: "◍" },
  { id: "deonto", n: "3", t: "Filtre déontologique", time: "15:00", ico: "⚖" },
  { id: "ia", n: "4", t: "Observer l'IA", time: "15:40", ico: "✦" },
  { id: "atelier", n: "5", t: "Atelier contenu", time: "15:55", ico: "✎" },
  { id: "demos", n: "6", t: "Démos et outils", time: "16:25", ico: "▶" },
  { id: "questions", n: "7", t: "Questions", time: "en continu", ico: "?" },
  { id: "plan", n: "8", t: "Plan d'action", time: "17:00", ico: "✓" },
  { id: "rapport", n: "9", t: "Rapport final", time: "17:30", ico: "▤" },
];

/* Planning de l'après-midi : [début, fin, étape, libellé] en minutes depuis 0h */
DATA.schedule = [
  [840, 855, "cadrage", "Cadrage"],
  [855, 900, "audit", "Audit en direct"],
  [900, 930, "deonto", "Filtre déontologique"],
  [930, 940, "pause", "Pause"],
  [940, 985, "atelier", "Ligne éditoriale et atelier IA"],
  [985, 1020, "demos", "Visuels, avis, démos"],
  [1020, 1050, "plan", "Plan d'action"],
];

DATA.tips = {
  home: [
    "Posez le cadre : « Aujourd'hui, on travaille sur votre communication réelle. Rien de patient, tout ce qu'on remplit reste sur cet ordinateur. »",
    "Montrez la barre de gauche : chaque étape de l'après-midi est une page. À la fin, le rapport se génère seul.",
    "Mode projecteur (bouton en haut) : grossit les textes pour la salle de réunion.",
  ],
  cadrage: [
    "Tour de table : une phrase chacun. Tapez-la en direct pendant que la personne parle.",
    "Les curseurs d'objectifs servent à trancher plus tard (« vous aviez dit que le recrutement comptait peu... »).",
    "Les post-its « Ce qui agace » donnent du matériel pour le plan d'action.",
  ],
  audit: [
    "Ouvrez le site, Instagram, Facebook et la fiche Google dans des onglets à côté (boutons en haut de page).",
    "Ne notez pas seul : demandez « 0, 1, 2 ou 3 ? » à Charlotte puis aux dentistes.",
    "Le radar à droite se dessine en direct : c'est le moment « effet waouh ».",
    "Chaque constat préparé est un bouton : cliquez pour l'insérer, puis ajustez avec ce qui est dit en séance.",
  ],
  deonto: [
    "Faites voter à main levée (publiable / à modifier / non) avant de révéler la réponse. Cliquez sur le nom pour enregistrer le vote de chaque personne.",
    "Message clé : on peut communiquer, mais l'Ordre encadre. Le but n'est pas de faire peur, c'est de donner des réflexes.",
    "Point sensible : les avis. Dites que vous proposerez une position prudente à valider auprès du conseil départemental.",
    "Détecteur : collez un vrai texte du cabinet (légende ancienne) et regardez ce qui s'allume.",
  ],
  ia: [
    "Observation, pas correction : demandez à chacun de montrer une vraie tâche faite avec l'IA, ou de la refaire devant vous.",
    "Remplissez les fiches en silence, puis donnez 1 point positif et 1 axe d'amélioration par personne.",
    "Chasse aux erreurs : faites-la collectivement, une personne lit une phrase, les autres disent « vrai ou à vérifier ».",
  ],
  atelier: [
    "Commencez par les piliers de contenu (4 maximum), puis la fréquence tenable. Mieux vaut 2 posts par semaine tenus que 5 abandonnés.",
    "Constructeur de prompt : remplissez-le avec Charlotte, copiez, ouvrez dans l'outil du cabinet, regardez le résultat ensemble.",
    "Scoreur de prompt : demandez à un dentiste d'écrire sa consigne habituelle, puis montrez la note.",
    "Studio visuel : créez un post aux couleurs du cabinet en 2 minutes, téléchargez-le.",
  ],
  demos: [
    "Séquence « valeur perçue » : automatisation animée, calculateur de temps gagné, outils à connaître.",
    "Dites clairement que l'automatisation est une prochaine étape, pas pour aujourd'hui.",
    "Le calculateur de temps gagné doit être rempli avec les chiffres de Charlotte, pas les vôtres.",
  ],
  questions: [
    "Les questions marquées d'une étoile sont prioritaires. Cochez celles posées, notez les réponses.",
    "Cette page est ouverte tout l'après-midi : passez-y dès qu'une réponse apparaît.",
  ],
  plan: [
    "Gardez uniquement 6 à 8 actions. Chaque action : un responsable, une semaine, un résultat visible.",
    "Cochez « Retenir » pour faire entrer l'action dans le rapport ; modifiez les textes à la volée.",
    "Fixez la date du rendez-vous de suivi (mi-novembre, 1 h en visio) avant de partir.",
  ],
  rapport: [
    "Le rapport se construit à partir de tout ce qui a été rempli. Relisez-le à voix haute avec le groupe.",
    "Imprimer ou enregistrer en PDF : utilisez le bouton « Imprimer / PDF » et choisissez « Enregistrer au format PDF ».",
    "Téléchargez la sauvegarde JSON : elle permet de rouvrir l'atelier plus tard.",
  ],
};

/* ---------- Cadrage ---------- */
DATA.objectifs = [
  ["nouveaux", "Attirer de nouveaux patients"],
  ["fidelisation", "Fidéliser les patients actuels"],
  ["recrutement", "Recruter (assistantes, praticiens)"],
  ["image", "Valoriser l'image et l'équipe"],
  ["info", "Informer et rassurer (prévention, hygiène)"],
  ["temps", "Gagner du temps de communication"],
];

/* ---------- Audit ---------- */
DATA.auditDomains = ["Identité", "Contenu", "Site", "Avis", "Déontologie", "Organisation", "IA"];

DATA.audit = [
  { id: "a1", d: "Identité", t: "Charte visuelle cohérente (logo, couleurs, polices) sur tous les canaux",
    hints: ["Charte rose forte sur Instagram", "Gabarits Canva homogènes"] },
  { id: "a2", d: "Identité", t: "Nom, adresse, téléphone, horaires identiques partout",
    hints: ["Nom variable sur le site (« Dr Guillaume Becker » / « Dr Becker »)"] },
  { id: "a3", d: "Identité", t: "Équipe affichée = équipe réelle (site, réseaux, fiches)",
    hints: ["Site : Delmotte et Garrigue affichées, à rapprocher de l'équipe actuelle"] },
  { id: "a4", d: "Contenu", t: "Piliers de contenu identifiables et équilibrés",
    hints: ["Rubriques présentes : L'équipe, Notre cabinet, FAQ, gencives, hygiène"] },
  { id: "a5", d: "Contenu", t: "Rythme de publication régulier et tenable",
    hints: ["Dernière publication Facebook : 1er octobre (Octobre rose)"] },
  { id: "a6", d: "Contenu", t: "Qualité des visuels (lisibilité, taille du texte, retouche)",
    hints: ["Texte parfois très petit sur les visuels Instagram"] },
  { id: "a7", d: "Contenu", t: "Légendes claires avec appel à l'action (RDV, téléphone)",
    hints: ["Peu d'appels à l'action visibles"] },
  { id: "a8", d: "Contenu", t: "Stories à la une utiles (équipe, FAQ, urgences, venir au cabinet)",
    hints: ["Une seule story à la une : les horaires"] },
  { id: "a9", d: "Site", t: "Blog ou actualités alimentés, sans doublons",
    hints: ["Un seul article : bienvenue, 21 mai 2025", "Textes répétés dans deux sections"] },
  { id: "a10", d: "Site", t: "Prise de rendez-vous évidente (téléphone, formulaire, lien)",
    hints: ["Téléphone seulement, pas de prise de RDV en ligne", "Absent de Doctolib (présent sur Maiia)"] },
  { id: "a11", d: "Site", t: "Éléments non finalisés (images factices, liens cassés, textes répétés)",
    hints: ["Slider avec image « dummy.png »"] },
  { id: "a12", d: "Site", t: "Honoraires et modes de paiement présents sur le site",
    hints: ["Aucune information tarifaire sur le site (obligatoire selon l'Ordre)"] },
  { id: "a13", d: "Avis", t: "Note Google, nombre d'avis, fraîcheur",
    hints: ["Facebook : 3 avis", "Fiche Google à regarder en séance"] },
  { id: "a14", d: "Avis", t: "Position claire du cabinet sur les avis (citation, sollicitation, réponses)",
    hints: ["Ne pas citer ni solliciter ; pas de réponse nominative : à valider avec l'Ordre"] },
  { id: "a15", d: "Déontologie", t: "Promesses, superlatifs, « le jour même », comparaisons",
    hints: ["Site : « haute qualité », « expertise », remplacement de dents « le jour même »"] },
  { id: "a16", d: "Déontologie", t: "Avant/après, témoignages, promotions, photos de patients",
    hints: ["Rien repéré à ce stade sur les pages publiques consultées"] },
  { id: "a17", d: "Déontologie", t: "Hygiène/stérilisation présentées sans les ériger en avantage exceptionnel",
    hints: ["Instagram : « l'hygiène est au cœur de notre pratique »", "Facebook : #Stérilisation, « engagements concrets »"] },
  { id: "a18", d: "Déontologie", t: "Consentement à l'image (équipe et patients)",
    hints: ["Nombreuses photos d'équipe : accord écrit à vérifier"] },
  { id: "a19", d: "Organisation", t: "Accès aux comptes sécurisés, plusieurs administrateurs, double authentification",
    hints: ["Agence quittée récemment : vérifier que ses accès sont retirés"] },
  { id: "a20", d: "Organisation", t: "Circuit de validation défini (qui valide, sous quel délai)",
    hints: ["Charlotte rédige, un dentiste doit valider"] },
  { id: "a21", d: "Organisation", t: "Temps dédié et banque de médias classée",
    hints: [] },
  { id: "a22", d: "IA", t: "Usage actuel : outil, compte, méthode de prompt, relecture",
    hints: ["Le Dr Becker utilise déjà l'IA de façon empirique", "L'équipe est débutante"] },
  { id: "a23", d: "IA", t: "Règles de confidentialité connues et appliquées",
    hints: ["Vues lors de la session du 24 septembre"] },
];

/* ---------- Déontologie : cartes ---------- */
/* v: ok | mod | non */
DATA.cards = [
  { id: "c1", txt: "Photo avant/après d'un implant, patient non reconnaissable, légende « Résultat après 3 mois ».",
    v: "non", art: "R.4127-215-1-I",
    why: "L'Ordre estime que les avant/après « tendraient à suggérer un résultat positif certain » : information potentiellement trompeuse." },
  { id: "c2", txt: "Photo de toute l'équipe en blouses roses pour souhaiter de bonnes vacances, chacun ayant donné son accord écrit.",
    v: "ok", art: "R.4127-215-1-I et droit à l'image",
    why: "La photo du praticien et de l'équipe est communicable, sous réserve du droit civil de l'image : accord écrit, finalité, retrait possible." },
  { id: "c3", txt: "Story qui reprend une capture d'un avis Google 5 étoiles d'un patient.",
    v: "non", art: "R.4127-215-1-I",
    why: "La communication « ne fait pas appel à des témoignages de tiers ni à des notations »." },
  { id: "c4", txt: "Carrousel « 3 choses à savoir sur vos gencives », informatif, sans promesse ni promotion.",
    v: "ok", art: "R.4127-215-1-II",
    why: "Information éducative et scientifiquement étayée, formulée avec prudence et mesure : c'est précisément ce que permet le code." },
  { id: "c5", txt: "Post « -20 % sur le blanchiment en octobre ! »",
    v: "non", art: "R.4127-215, R.4127-221",
    why: "Promotions et ristournes : la profession ne doit pas être pratiquée comme un commerce, ni inciter à des actes inutiles." },
  { id: "c6", txt: "Reel de la salle de stérilisation avec la légende « Notre hygiène est exceptionnelle, unique dans la région ».",
    v: "mod", art: "R.4127-215-1-I",
    why: "Présenter comme exceptionnel ce qui relève des obligations légales est trompeur. Décrire factuellement les étapes, sans superlatif ni comparaison." },
  { id: "c7", txt: "Vidéo d'un soin au cabinet : le patient est visible, il a donné son accord oral.",
    v: "non", art: "R.4127-206 et s., secret professionnel",
    why: "Un patient filmé ne doit jamais être identifiable, visage flouté même avec son accord. Le patient ne peut pas délier le praticien du secret." },
  { id: "c8", txt: "Annonce « Le Dr X, spécialiste en parodontologie, rejoint le cabinet » (elle n'a pas de qualification reconnue).",
    v: "mod", art: "R.4127-215-1-I",
    why: "Il n'existe que trois spécialités reconnues (ODF, chirurgie orale, médecine bucco-dentaire). On peut dire qu'elle « pratique la parodontologie »." },
  { id: "c9", txt: "Réponse publique à un avis : « Merci Mme Dupont, ravis que votre traitement d'implant se soit bien passé ! »",
    v: "non", art: "R.4127-206 et s.",
    why: "Répondre à un avis nominatif confirme que la personne est patiente et révèle un soin : atteinte possible au secret professionnel." },
  { id: "c10", txt: "Post « Nous sommes mieux équipés que les cabinets de Carpentras. »",
    v: "non", art: "R.4127-215-1-I, R.4127-259",
    why: "Pas de comparaison avec d'autres praticiens ou établissements. Aussi une atteinte à la confraternité." },
  { id: "c11", txt: "Post « Notre marque de brosses à dents préférée » avec un lien vers la boutique.",
    v: "non", art: "R.4127-225, R.4127-215-3",
    why: "Interdiction de faire de la publicité pour un tiers ou une entreprise commerciale." },
  { id: "c12", txt: "Post « Les femmes enceintes doivent consulter un spécialiste, nous ne les prenons pas. »",
    v: "non", art: "R.4127-211",
    why: "Une information qui limite l'accès aux soins de certains patients est discriminatoire et contraire à la dignité de la profession." },
  { id: "c13", txt: "Page « Honoraires » du site avec 8 actes courants, les tarifs de remboursement et les modes de paiement acceptés.",
    v: "ok", art: "R.4127-240-II",
    why: "C'est même attendu : si l'on présente son activité sur un site, on y inclut les honoraires (5 à 10 actes courants) et les modes de paiement." },
  { id: "c14", txt: "Légende « Sourire de rêve garanti en une séance, sans douleur ! »",
    v: "non", art: "R.4127-215-1-I",
    why: "Promesse de résultat et de confort non vérifiable : information trompeuse et communication commerciale." },
];

/* ---------- Détecteur ---------- */
DATA.rules = [
  { id: "ba", re: /avant[\s\/\-–]*apr[eè]s|before\s*\/?\s*after/gi, sev: "red", t: "Avant/après",
    why: "Suggère un résultat certain (R.4127-215-1-I).", fix: "Retirer ; illustrer par un schéma pédagogique." },
  { id: "tm", re: /t[ée]moignage|avis (?:client|patient)|\d\s?\/\s?5|[ée]toiles?|⭐|5 étoiles|merci docteur/gi, sev: "red", t: "Témoignage ou notation",
    why: "Pas de témoignages de tiers ni de notations (R.4127-215-1-I).", fix: "Ne pas citer d'avis." },
  { id: "pr", re: /-\s?\d+\s?%|\d+\s?%\s?de\s?(?:r[ée]duction|remise)|promo(?:tion)?s?|remises?|offert(?:e|s)?|gratuit(?:e|s)?|pour le prix de|bon plan|tarif sp[ée]cial|offre (?:sp[ée]ciale|limit[ée]e)|black friday|soldes/gi, sev: "red", t: "Promotion ou remise",
    why: "Ristournes et incitation à des actes (R.4127-221, R.4127-215-1-I).", fix: "Supprimer toute offre commerciale." },
  { id: "co", re: /meilleurs?|n°\s?1|num[ée]ro\s?1|leaders?|le plus [a-zéèêàù]+|plus (?:performant|moderne|qualifi[ée])s?|mieux [ée]quip[ée]s?|moins chers?|que les autres|que les cabinets/gi, sev: "red", t: "Superlatif ou comparaison",
    why: "Pas de comparaison, même implicite (R.4127-215-1-I, R.4127-259).", fix: "Décrire des faits : équipement, formation, horaires." },
  { id: "ex", re: /experts?|sp[ée]cialistes?|sp[ée]cialis[ée]e?s?/gi, sev: "amber", t: "Titre « expert » ou « spécialiste »",
    why: "Seules trois spécialités sont reconnues ; ne pas se déclarer expert sans titre (R.4127-215-1-I).", fix: "Écrire « pratique l'implantologie » plutôt que « spécialiste »." },
  { id: "gr", re: /garanti(?:e|s)?|garantie|100\s?%|sans douleur|indolore|r[ée]sultat assur[ée]|le jour m[eê]me|miracle|d[ée]finitif(?:ve)?|à vie|parfait(?:e)?s?/gi, sev: "red", t: "Promesse de résultat",
    why: "Information susceptible d'induire en erreur (R.4127-215-1-I).", fix: "Rester factuel : « selon les cas, ... »." },
  { id: "av", re: /avant-gardiste|exceptionnel(?:le)?s?|unique|haut de gamme|d'exception|prestige|innovant(?:e)?s?/gi, sev: "amber", t: "Valorisation excessive",
    why: "Ce qui relève d'obligations légales ne se présente pas comme exceptionnel.", fix: "Décrire sans superlatif." },
  { id: "nom", re: /\b(?:Mme|Madame|Monsieur|M\.)\s+[A-ZÉÈ][a-zéèêëïîôûù\-]+/g, sev: "red", t: "Nom de personne",
    why: "Risque d'identifier un patient : secret professionnel (R.4127-206 et s.).", fix: "Retirer tout nom ; si membre de l'équipe, vérifier son accord." },
  { id: "tier", re: /code promo|partenariat|sponsoris[ée]|#ad\b|#pub\b|lien en bio pour acheter|notre marque pr[ée]f[ée]r[ée]e/gi, sev: "red", t: "Publicité pour un tiers",
    why: "Interdite (R.4127-225).", fix: "Retirer toute marque ou lien commercial." },
  { id: "pre", re: /vite|derni[eè]res places|ne ratez pas|profitez|urgent|dépêchez/gi, sev: "amber", t: "Pression commerciale",
    why: "Ton commercial : la profession n'est pas un commerce (R.4127-215).", fix: "Ton informatif et mesuré." },
  { id: "dis", re: /ne prenons pas|nous refusons|pas de (?:cmu|css|ame)|uniquement les patients|r[ée]serv[ée] aux/gi, sev: "red", t: "Information discriminatoire",
    why: "Limite l'accès aux soins : contraire à R.4127-211.", fix: "Supprimer." },
];

/* ---------- Arbre avis ---------- */
DATA.avisTree = {
  start: {
    q: "Un avis vient d'être publié sur la fiche Google ou la page Facebook du cabinet. Que faites-vous ?",
    o: [["C'est un avis positif", "pos"], ["C'est un avis négatif", "neg"], ["L'avis semble faux ou injurieux", "faux"], ["Un patient nous demande de laisser un avis", "dem"]],
  },
  pos: { q: "Avis positif", end: true, ok: "Remerciez en interne, sans le republier.",
    li: ["Ne pas le reprendre en story, en publication ni sur le site (témoignage de tiers).", "Si vous répondez, une phrase générale, sans nom, sans confirmer que la personne est patiente, sans détail de soin.", "Validez la position avec le conseil départemental de l'Ordre."] },
  neg: { q: "Avis négatif", end: true, ok: "Ne répondez jamais sur le fond en public.",
    li: ["Aucune information sur le soin, le dossier ou le rendez-vous (secret professionnel).", "Réponse publique très courte : le cabinet est à l'écoute, invitation à appeler le cabinet.", "Le traitement réel se fait en privé, par téléphone, par un dentiste.", "Consigner l'avis et la décision dans un registre interne."] },
  faux: { q: "Avis faux ou injurieux", end: true, ok: "Utilisez le signalement de la plateforme.",
    li: ["Signaler l'avis à Google ou Facebook (contenu inapproprié, faux avis).", "Ne pas répondre sur le fond, ne pas se justifier.", "Conserver une capture d'écran datée.", "En cas de diffamation, en parler au conseil départemental de l'Ordre ou à l'assurance."] },
  dem: { q: "Demande d'avis", end: true, ok: "Zone grise : à ne pas organiser.",
    li: ["La communication du cabinet n'utilise ni témoignage ni notation (R.4127-215-1-I).", "Ne pas organiser de campagne d'avis (QR code, relance par SMS).", "Un patient reste libre de publier. Le cabinet n'a pas à le contrôler.", "À valider avec le conseil départemental : position exacte sur la sollicitation."] },
};

/* ---------- Chasse aux erreurs IA ---------- */
DATA.hunt = [
  { t: "Un enfant possède 20 dents de lait, qui tombent généralement entre 6 et 12 ans.", err: false },
  { t: "Les adultes ont en général 32 dents, dents de sagesse comprises.", err: false },
  { t: "L'émail est le tissu le plus dur du corps humain.", err: false },
  { t: "Une carie guérit spontanément si l'on se brosse simplement les dents plus fort.", err: true, why: "Erreur médicale : une carie ne guérit pas spontanément. L'IA affirme avec aplomb." },
  { t: "Selon une étude de 2021 de l'université de Lyon, 87 % des Français ne vont jamais chez le dentiste.", err: true, why: "Chiffre et source inventés : classique hallucination. Toujours vérifier à la source." },
  { t: "Notre cabinet est ouvert 7 jours sur 7, sans rendez-vous.", err: true, why: "Faux pour ce cabinet : consultations sur rendez-vous, du lundi au vendredi. L'IA ne connaît pas votre cabinet si on ne le lui dit pas." },
  { t: "Un brossage de deux minutes, deux fois par jour, est généralement recommandé.", err: false },
  { t: "Nos implants sont garantis à vie dans 100 % des cas.", err: true, why: "Promesse de résultat : contraire à la déontologie (R.4127-215-1-I)." },
];

/* ---------- Quiz rappel Module 1 ---------- */
DATA.quiz = [
  { q: "Un modèle de langage fonctionne principalement en…", o: ["Cherchant la réponse dans une base de faits vérifiés", "Prédisant le mot suivant selon des probabilités", "Recopiant des phrases apprises par cœur"], a: 1,
    e: "Il prédit le mot suivant à partir de schémas statistiques. D'où les erreurs avec aplomb." },
  { q: "Sur une offre gratuite, que deviennent en général vos données ?", o: ["Elles ne sont jamais conservées", "Elles peuvent servir à réentraîner le modèle", "Elles restent uniquement sur votre ordinateur"], a: 1,
    e: "Gratuit = données potentiellement réutilisées. Une offre équipe ou entreprise évite l'entraînement par défaut." },
  { q: "Quel est le bon réflexe avec un chiffre fourni par l'IA ?", o: ["Le publier s'il paraît plausible", "Le vérifier à la source", "Le demander une seconde fois à l'IA"], a: 1,
    e: "Chiffres, dates et références sont à vérifier à la source. Redemander à l'IA ne prouve rien." },
  { q: "Les quatre piliers d'une bonne consigne sont…", o: ["Rôle, contexte, tâche, format", "Titre, objectif, ton, durée", "Question, réponse, source, date"], a: 0, e: "Rôle, contexte, tâche, format : une consigne exploitable dès la première itération." },
  { q: "Peut-on coller le compte rendu d'un patient dans un outil d'IA grand public ?", o: ["Oui, si on enlève le nom", "Non, jamais : données de santé", "Oui, avec l'accord oral du patient"], a: 1,
    e: "Même sans nom, un compte rendu peut identifier. Le secret professionnel est absolu et le patient ne peut pas en délier le praticien." },
  { q: "Dans une longue conversation, l'IA…", o: ["Retient mieux les consignes de plus en plus", "Oublie progressivement les consignes du début", "Applique toujours la dernière consigne seulement"], a: 1,
    e: "La mémoire de travail est limitée : rappelez les consignes clés ou ouvrez une nouvelle conversation avec le bloc contexte." },
];

/* ---------- Observation IA ---------- */
DATA.obsCriteria = [
  ["outil", "Outil et type de compte", "Compte équipe ou option « pas d'entraînement »", "Compte gratuit personnel, outil inconnu"],
  ["prompt", "Consigne (4 piliers)", "Rôle, contexte, tâche, format précisés", "Une ligne, sans contexte cabinet"],
  ["iter", "Itération", "Plusieurs allers-retours, variantes", "Premier jet copié tel quel"],
  ["relecture", "Relecture", "Vérifie chiffres, promesses, ton, déontologie", "Publie sans relire"],
  ["donnees", "Données", "Aucun nom ni photo de patient", "Données de patients saisies"],
  ["temps", "Gain de temps", "Estime le temps gagné", "Ne sait pas si cela sert"],
];

/* ---------- Atelier ---------- */
DATA.rubriques = [
  { id: "equipe", t: "L'équipe", ex: ["Présentation d'une assistante dentaire et de son rôle", "Une journée type à l'accueil", "Arrivée d'un nouveau membre de l'équipe (avec accord)", "Zoom sur le rôle du manager de cabinet"] },
  { id: "pedago", t: "Pédagogie et FAQ", ex: ["Gencives qui saignent : ce qu'il faut savoir", "Couronne ou implant : quelles différences ?", "Sensibilité dentaire en hiver : 3 raisons possibles", "Mois sans tabac et santé bucco-dentaire", "Bien brosser les dents d'un enfant"] },
  { id: "cabinet", t: "Notre cabinet", ex: ["Visite du cabinet : salle d'attente et accueil", "Les étapes de la stérilisation, expliquées factuellement", "Pourquoi nous utilisons un scanner 3D (sans comparaison)", "Accès et parking"] },
  { id: "vie", t: "Vie du cabinet", ex: ["Horaires de fin d'année", "Octobre rose : l'équipe se mobilise", "Formation continue de l'équipe", "Fermeture estivale"] },
];

DATA.ctxBlock = `Cabinet : SCM Ventoux, cabinet du Dr Guillaume Becker, 38 avenue René Cassin, Monteux (84).
Praticiens et pratiques : [liste à jour : implantologie, parodontologie, dentisterie conservatrice].
Public : patients de Monteux, Carpentras et alentours, adultes et familles.
Identité : charte rose (logo GB), ton chaleureux, professionnel, simple, vouvoiement.
Rubriques : L'équipe, Notre cabinet, Pédagogie/FAQ, Vie du cabinet.
Règles absolues : aucune photo ni donnée de patient, aucun avant/après, aucun témoignage ni avis cité, aucune remise ni promotion, aucune comparaison avec d'autres cabinets, aucune promesse de résultat, aucune marque tierce, aucun superlatif (« meilleur », « expert », « exceptionnel »). On informe, on ne vend pas.
Si une information te manque, pose-moi la question avant de répondre.`;

DATA.taches = {
  post: { t: "Post Instagram (légende)", role: "chargé(e) de communication d'un cabinet dentaire libéral", tache: "Rédige une légende Instagram de {longueur} sur le sujet : « {sujet} » (rubrique : {rubrique}).", format: "Légende prête à publier, puis 3 variantes d'accroche, 5 hashtags locaux (#DentisteMonteux), un texte alternatif pour l'image, et une liste « points à vérifier avant publication »." },
  carrousel: { t: "Carrousel pédagogique", role: "rédacteur pédagogique pour un cabinet dentaire", tache: "Écris le texte d'un carrousel Instagram de 6 diapositives sur : « {sujet} » (rubrique : {rubrique}).", format: "Tableau : numéro de diapositive, titre court (8 mots maximum), texte (25 mots maximum), idée de visuel. Dernière diapositive : invitation à prendre rendez-vous au 04 90 60 00 67." },
  faq: { t: "FAQ vers article de blog", role: "rédacteur santé pour le site d'un cabinet dentaire", tache: "Transforme une question de FAQ en article de blog de {longueur} sur : « {sujet} ».", format: "Titre (60 caractères max), description pour le référencement (150 caractères max), introduction, 3 sous-titres, conclusion. Signale toute affirmation médicale à faire valider par un praticien." },
  story: { t: "Série de stories", role: "community manager d'un cabinet dentaire", tache: "Propose une série de 4 stories Instagram sur : « {sujet} » (rubrique : {rubrique}).", format: "Pour chaque story : texte à l'écran (12 mots maximum), idée d'image ou de vidéo sans patient, sticker conseillé (sondage, quiz)." },
  mail: { t: "Message aux patients (information)", role: "secrétaire médical(e) d'un cabinet dentaire", tache: "Rédige un message d'information aux patients sur : « {sujet} ».", format: "Objet (8 mots max), message de {longueur}, formule de politesse. Ton posé, aucune donnée personnelle, aucune promotion." },
  calendrier: { t: "Calendrier éditorial", role: "stratège éditorial d'un cabinet dentaire", tache: "Construis un calendrier de 2 publications par semaine pendant 4 semaines à partir de ces thèmes : « {sujet} ».", format: "Tableau : semaine, jour, canal (Instagram ou Facebook), rubrique, sujet, format, préparation nécessaire, qui valide. Pas deux fois la même rubrique d'affilée." },
};

DATA.contraintes = [
  ["pasPatient", "Aucune donnée ou photo de patient"],
  ["pasPromesse", "Aucune promesse de résultat"],
  ["pasPromo", "Aucune promotion ni remise"],
  ["pasComp", "Aucune comparaison, aucun superlatif"],
  ["sourcer", "Signaler tout ce qui doit être vérifié"],
  ["simple", "Phrases courtes, sans jargon médical"],
];

/* ---------- Démos ---------- */
DATA.flow = [
  { t: "Tableur", s: "Une ligne par publication", d: "Le cabinet remplit un tableau simple : date, rubrique, sujet, validateur.", ex: "12/11 · Pédagogie · « Mois sans tabac et gencives » · Dr Dauphin" },
  { t: "Rédaction par l'IA", s: "Texte à partir du brief", d: "L'IA reçoit le bloc de contexte du cabinet et le sujet, puis propose un texte.", ex: "« Arrêter de fumer est bon pour vos gencives. Parlons-en lors de votre prochaine visite. »" },
  { t: "Visuel", s: "Gabarit aux couleurs du cabinet", d: "Le texte est injecté dans un gabarit (Canva) : logo, couleurs, polices du cabinet.", ex: "Image 1080 × 1080, charte rose, titre en gras" },
  { t: "Validation humaine", s: "Un dentiste relit", d: "Rien n'est publié sans validation : grille de relecture en 2 minutes, accord d'un dentiste.", ex: "✓ Déontologie · ✓ Faits · ✓ Ton · ✓ Aucune donnée patient" },
  { t: "Programmation", s: "Publication planifiée", d: "Le post est programmé sur Instagram et Facebook (Meta Business Suite).", ex: "Jeudi 12/11 · 12h30 · Instagram + Facebook" },
];

DATA.tools = [
  { n: "ChatGPT", c: "Rédaction IA", u: "Idées, textes, comptes rendus, procédures.", cost: "Gratuit ou payant", risk: "orange", rt: "Serveurs américains. Gratuit : données potentiellement réutilisées. Préférer un compte équipe.", url: "https://chatgpt.com/" },
  { n: "Claude", c: "Rédaction IA", u: "Longs documents, relecture, consignes complexes, respect des contraintes.", cost: "Gratuit ou payant", risk: "orange", rt: "Serveurs américains. Vérifier les réglages de confidentialité du compte.", url: "https://claude.ai/" },
  { n: "Mistral Le Chat", c: "Rédaction IA", u: "Alternative française, utile pour la sensibilité aux données.", cost: "Gratuit ou payant", risk: "orange", rt: "Entreprise française, hébergement européen annoncé. À vérifier selon l'offre.", url: "https://chat.mistral.ai/" },
  { n: "Canva", c: "Visuels", u: "Gabarits aux couleurs du cabinet, carrousels, stories, banque de visuels.", cost: "Gratuit ou payant", risk: "orange", rt: "Ne pas importer de photos de patients. Droit d'usage des images à vérifier.", url: "https://www.canva.com/" },
  { n: "Meta Business Suite", c: "Planification", u: "Programmer et mesurer Instagram et Facebook depuis un même outil.", cost: "Gratuit", risk: "orange", rt: "Double authentification obligatoire ; plusieurs administrateurs.", url: "https://business.facebook.com/" },
  { n: "Google Business Profile", c: "Fiche Google", u: "Horaires, photos, description, statistiques de la fiche.", cost: "Gratuit", risk: "orange", rt: "Respecter les règles de l'Ordre pour la description et les photos. Pas de réponse nominative aux avis.", url: "https://business.google.com/" },
  { n: "Google Sheets", c: "Planification", u: "Calendrier éditorial partagé, suivi des publications.", cost: "Gratuit", risk: "vert", rt: "Aucune donnée patient dans le tableur.", url: "https://sheets.google.com/" },
  { n: "Make / n8n / Zapier", c: "Automatisation", u: "Enchaîner tableur, IA, visuel et programmation sans coder.", cost: "Gratuit limité ou payant", risk: "orange", rt: "Clés d'API à protéger ; revue de ce qui est transmis à chaque outil.", url: "https://www.make.com/" },
  { n: "Transcription de réunion (ex. Granola)", c: "Comptes rendus", u: "Transcrire et résumer les réunions d'équipe.", cost: "Payant", risk: "rouge", rt: "À réserver aux réunions sans données de patients ; informer les participants.", url: "https://www.granola.ai/" },
  { n: "Ordre des chirurgiens-dentistes", c: "Cadre", u: "Recommandations sur la communication, affiches d'honoraires, logo officiel.", cost: "Gratuit", risk: "vert", rt: "Source de référence pour la déontologie.", url: "https://www.ordre-chirurgiens-dentistes.fr/" },
];

/* ---------- Questions ---------- */
DATA.questions = [
  { th: "Objectifs et attentes", q: [
    ["q1", "Qu'attendez-vous de la communication : nouveaux patients, fidélisation, recrutement, image ? Dans quel ordre ?", 1],
    ["q2", "Qu'est-ce qui vous a poussés à arrêter l'agence ? Qu'est-ce qui marchait, qu'est-ce qui manquait ?", 1],
    ["q3", "À quoi verrez-vous dans 3 mois que ça a marché ?", 1],
    ["q4", "Quels types de patients voulez-vous attirer (implants, parodontologie, esthétique) ?", 0],
    ["q5", "Y a-t-il des sujets que le cabinet refuse d'aborder ?", 0]] },
  { th: "Organisation et temps", q: [
    ["q6", "Combien d'heures par semaine Charlotte peut-elle y consacrer, sur son temps de travail ?", 1],
    ["q7", "Qui valide un contenu avant publication, sous quel délai ? Que se passe-t-il si personne ne répond ?", 1],
    ["q8", "Qui prend les photos et vidéos ? Y a-t-il un accord écrit des personnes qui apparaissent ?", 0],
    ["q9", "Qui a les accès aux comptes ? Y a-t-il une double authentification ?", 0],
    ["q10", "Que se passe-t-il quand Charlotte est absente ?", 0]] },
  { th: "Outils existants", q: [
    ["q11", "Quels outils utilisez-vous : Canva (gratuit ou payant), planificateur, Meta Business Suite ?", 1],
    ["q12", "Qui gère le site, qui l'héberge, et l'agence a-t-elle encore la main dessus ?", 0],
    ["q13", "Avez-vous une banque de photos et vidéos classée ? Où est-elle stockée ?", 0],
    ["q14", "Avez-vous une charte graphique écrite (couleurs, polices, logo, tonalité) ?", 0]] },
  { th: "Prise de rendez-vous et avis", q: [
    ["q15", "Comment un nouveau patient prend-il rendez-vous aujourd'hui ? Combien d'appels manqués par semaine ?", 1],
    ["q16", "Qui s'occupe des avis Google ? Quel est le sentiment sur les avis négatifs ?", 1],
    ["q17", "Pourquoi ne pas être sur Doctolib (choix, coût, contrainte) ? Est-ce définitif ?", 0]] },
  { th: "Déontologie et risques", q: [
    ["q18", "Qui connaît les recommandations de l'Ordre sur la communication ? Les avez-vous relues récemment ?", 1],
    ["q19", "Avez-vous déjà eu une remarque de l'Ordre, d'un patient ou d'un confrère sur une publication ?", 1],
    ["q20", "Le consentement à l'image est-il tracé pour les patients et l'équipe ?", 0],
    ["q21", "Les honoraires sont-ils affichés au cabinet et sur le site ?", 1]] },
  { th: "Usage de l'IA", q: [
    ["q22", "Qui utilise l'IA aujourd'hui, pour quoi, avec quel outil (gratuit ou payant) ?", 1],
    ["q23", "Avez-vous déjà publié un contenu écrit avec l'IA ? Avec quelle relecture ?", 1],
    ["q24", "Y a-t-il eu une mauvaise surprise (erreur, ton étrange, contenu inutilisable) ?", 0],
    ["q25", "Avez-vous un compte équipe ou des comptes personnels ? Où partent les données ?", 1],
    ["q26", "Qu'est-ce qui vous freine encore : peur de l'erreur, temps, confidentialité, manque de méthode ?", 0]] },
];

/* ---------- Plan d'action : suggestions ---------- */
DATA.planSuggest = [
  { sem: "S1", quoi: "Récupérer tous les accès (site, Instagram, Facebook, Google, Canva), retirer ceux de l'agence, activer la double authentification", qui: "Manager" },
  { sem: "S1", quoi: "Valider la charte « on publie / on ne publie pas » (issue de l'atelier déontologique)", qui: "Dr Becker" },
  { sem: "S1", quoi: "Ajouter la page « Honoraires et paiements » au site et l'affichage en salle d'attente", qui: "Dr Becker" },
  { sem: "S2", quoi: "Remplir le calendrier éditorial des 4 prochaines semaines (2 publications par semaine)", qui: "Réf. communication" },
  { sem: "S2", quoi: "Relire les formulations du site et des réseaux (superlatifs, « le jour même », hygiène) et corriger", qui: "Dr Dauphin" },
  { sem: "S3", quoi: "Faire signer l'accord de droit à l'image à l'équipe et classer la banque de photos", qui: "Manager" },
  { sem: "S3", quoi: "Publier et programmer deux posts avec le bloc de contexte et la grille de relecture", qui: "Réf. communication" },
  { sem: "S4", quoi: "Mesurer le temps passé, les publications tenues, ce qui bloque ; préparer le rendez-vous de suivi", qui: "Réf. communication" },
  { sem: "S4", quoi: "Demander au conseil départemental de l'Ordre la position sur les avis et le référencement", qui: "Dr Becker" },
  { sem: "S2", quoi: "Transformer deux FAQ Instagram en articles de blog validés par un dentiste", qui: "Dr Dauphin" },
];

DATA.indicateurs = [
  "Nombre de publications tenues sur 4 semaines",
  "Temps hebdomadaire passé par la référente communication",
  "Nombre de relectures déontologiques tracées",
  "Délai moyen de validation d'un contenu",
  "Évolution des abonnés et des interactions (Instagram, Facebook)",
  "Nombre d'appels pour un premier rendez-vous (à noter par l'accueil)",
];

DATA.demoList = [
  ["demoFlow", "Automatisation animée (tableur, IA, visuel, validation, publication)"],
  ["demoRoi", "Calculateur de temps gagné"],
  ["demoTools", "Panorama des outils"],
  ["demoStudio", "Studio visuel : créer un post aux couleurs du cabinet"],
  ["demoScorer", "Scoreur de prompt"],
  ["demoDetect", "Détecteur déontologique"],
  ["demoHunt", "Chasse aux erreurs de l'IA"],
  ["demoQuiz", "Quiz de rappel sur l'IA"],
];
