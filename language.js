const frenchContent = {
  ".skip": "Aller au contenu",
  ".navlinks a[href='#recipes'] span": "Recettes",
  ".nav-download span": "Téléchargements",
  "#cursor-label": "Style de curseur",
  ".cursor-choice:nth-child(1) .cursor-name": "Fleur de cerisier",
  ".cursor-choice:nth-child(2) .cursor-name": "Étincelle",
  ".cursor-choice:nth-child(3) .cursor-name": "Système",
  ".tagline": "Voyagez plus loin, plus vite.",
  ".intro": "Posez une pierre chez vous et une autre au bout du chemin. La prochaine fois, il suffira de choisir votre destination.",
  ".hero-actions .primary": "Obtenir Farstep",
  ".hero-link": "Voir le livre des recettes",
  ".hero-art figcaption": "Pierre de voyage en fleurs de cerisier",
  "#guide .section-heading .eyebrow": "Guide de jeu",
  "#guide-title": "Votre premier voyage",
  "#guide .section-heading > p": "Posez une pierre aux endroits que vous voulez retrouver dans le monde de surface. Le menu affiche les destinations accessibles.",
  ".steps li:nth-child(1) strong": "Trouver ou fabriquer une pierre",
  ".steps li:nth-child(1) p": "Récupérez une magnétite pour débloquer les recettes. Certaines variantes apparaissent en explorant si la génération naturelle est activée.",
  ".steps li:nth-child(2) strong": "Poser deux pierres",
  ".steps li:nth-child(2) p": "Installez une pierre chez vous et une autre à votre destination. Laissez de la place à côté pour arriver en sécurité.",
  ".steps li:nth-child(3) strong": "Choisir une destination",
  ".steps li:nth-child(3) p": "Faites un clic droit sur une pierre pour choisir votre destination. Accroupissez-vous et faites un clic droit sur la vôtre pour la renommer. Une pioche permet de la récupérer.",
  ".preview-text .eyebrow": "Aperçu des menus",
  "[data-menu='travel']": "Voyage",
  "[data-menu='manage']": "Gestion",
  "[data-menu='settings']": "Réglages",
  "#recipes .section-heading .eyebrow": "Livre des recettes",
  "#recipe-title": "Les 48 pierres de voyage",
  "#recipes .section-heading > p": "Toutes les variantes se fabriquent avec une magnétite, deux perles de l'End et deux ingrédients propres à la pierre choisie.",
  ".filters label:nth-child(1) span": "Rechercher une recette",
  ".filters label:nth-child(2) span": "Disponibilité",
  "#availability option[value='all']": "Toutes les pierres",
  "#availability option[value='natural']": "À trouver ou à fabriquer",
  "#availability option[value='craft']": "À fabriquer uniquement",
  "#recipe-save": "Télécharger la fiche",
  "#download-title": "Téléchargements",
  ".files article:nth-child(1) p": "Ajoute les recettes, les voyages, les découvertes naturelles et les réglages au monde.",
  ".files article:nth-child(2) h3": "Pack de ressources Farstep",
  ".files article:nth-child(2) p": "Affiche les modèles, les menus et les textes en français et en anglais sur le client de chaque joueur.",
  ".github-download .download-label": "Télécharger sur GitHub",
  ".modrinth-download .download-label": "Télécharger sur Modrinth",
  "#github-source": "Code source",
  ".install > div:nth-child(1) h3": "Installer les deux packs",
  ".install li:nth-child(1)": "Placez le ZIP du datapack dans le dossier <code>datapacks/</code> du monde.",
  ".install li:nth-child(2)": "Placez le ZIP du pack de ressources dans <code>resourcepacks/</code> sur chaque client Minecraft, puis activez-le dans les options.",
  ".install li:nth-child(3)": "Redémarrez le serveur ou rouvrez le monde. Sur un serveur, vérifiez avec <code>/datapack list enabled</code>.",
  ".install > div:nth-child(2) h3": "Réglages serveur",
  ".install > div:nth-child(2) p:nth-child(2)": "En tant qu'opérateur, lancez <code>/function farstep:config</code>. Les voyages sont gratuits par défaut. Vous pouvez configurer un coût fixe ou selon la distance, en points d'XP ou en niveaux. Ce menu règle aussi la génération naturelle et la protection des pierres privées.",
  ".install > div:nth-child(2) p:nth-child(3)": "Pour tester les variantes, <code>/function farstep:give_all</code> donne une pierre de chaque style.",
  ".footer p": "Licence MIT. Les textures et personnages de Minecraft appartiennent à Mojang et Microsoft. Les visuels des menus sont des illustrations.",
  ".feedback-link": "Bugs, idées et traductions",
};
const frenchAttributes = [
  [".navbar", "aria-label", "Navigation principale"],
  [".cursor-settings summary", "aria-label", "Style de curseur"],
  [".cursor-settings summary", "title", "Style de curseur"],
  [".hero-art img", "alt", "Alex traverse un bosquet de cerisiers au coucher du soleil, devant une pierre de voyage."],
  [".preview-controls", "aria-label", "Aperçu des menus"],
  ["#search", "placeholder", "Nom, biome ou ingrédient"],
  [".pager", "aria-label", "Pages du catalogue"],
  ["[data-page-step='-1']", "aria-label", "Page précédente"],
  ["[data-page-step='1']", "aria-label", "Page suivante"],
  [".close", "aria-label", "Fermer la recette"],
];
const contentTranslations = Object.entries(frenchContent).flatMap(([selector, french]) =>
  [...document.querySelectorAll(selector)].map((node) => [node, node.innerHTML, french])
);
const attributeTranslations = frenchAttributes.flatMap(([selector, attr, french]) =>
  [...document.querySelectorAll(selector)].map((node) => [node, attr, node.getAttribute(attr), french])
);
function translatePage(language) {
  const french = language === "fr";
  document.documentElement.lang = language;
  document.title = french ? "Farstep | Voyagez plus loin, plus vite." : "Farstep | Travel further, faster.";
  for (const [node, english, translation] of contentTranslations) node.innerHTML = french ? translation : english;
  for (const [node, attr, english, translation] of attributeTranslations) node.setAttribute(attr, french ? translation : english);
}
