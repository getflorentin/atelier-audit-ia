# Atelier audit IA et communication

Site statique interactif (HTML, CSS, JavaScript, sans serveur) pour animer un audit de communication et d'usage de l'IA dans un cabinet dentaire.

- Les saisies restent dans le navigateur (localStorage). Rien n'est envoyé nulle part.
- Sauvegarde et restauration au format JSON depuis la page d'accueil.
- Rapport final généré en direct, imprimable en PDF.
- Aucune donnée de patient ne doit être saisie.

Les repères déontologiques s'appuient sur le décret n° 2020-1658 et les recommandations de l'Ordre des chirurgiens-dentistes (mars 2023). Ils ne constituent pas un avis juridique.

## Téléphones des participants (session du 15/10)

Ouvrir l'atelier via **https://formation-ventoux.ceepia.tech/audit/** (le serveur de la formation relaie ce dépôt GitHub Pages) après s'être connecté en formateur sur https://formation-ventoux.ceepia.tech/.
Chaque étape affiche alors un encart « 📱 Téléphones des participants » (`js/live.js`) : envoyer les téléphones sur une question, voir les réponses en direct.
Les participants répondent dans la session 3 de l'app de formation. Les questions et cas affichés sur les téléphones viennent d'une copie de `js/data.js` : prévenir Nathanaël en cas de modification de `data.js` pour la resynchroniser.
