const menus = {
  travel: [
    ["Choose a destination", "Right-click a stone to open the travel menu. Named destinations appear here, along with the current fare.", "Illustration of the travel menu with Home and Mountain Base as destinations"],
    ["Choisir une destination", "Faites un clic droit sur une pierre pour ouvrir le menu. Il affiche les destinations nommées et le coût du trajet.", "Illustration du menu de voyage avec Maison et Base en montagne"],
  ],
  manage: [
    ["Manage a stone", "As the owner, you can rename the stone or switch it between public and private from the management menu.", "Illustration of the management menu with Rename and Make private actions"],
    ["Gérer une pierre", "Le propriétaire peut renommer la pierre et la rendre publique ou privée depuis le menu de gestion.", "Illustration du menu de gestion avec Renommer et Rendre privée"],
  ],
  settings: [
    ["Set the travel rules", "Operators can change the fare, natural discoveries and private-stone protection with /function farstep:config.", "Illustration of operator settings for the fare, natural discoveries and private-stone protection"],
    ["Régler les voyages", "Les opérateurs peuvent modifier le coût, la génération naturelle et la protection des pierres privées avec /function farstep:config.", "Illustration des réglages de coût, de découverte naturelle et de protection des pierres"],
  ],
};
const search = document.querySelector("#search");
const availability = document.querySelector("#availability");
const list = document.querySelector("#recipe-list");
const count = document.querySelector("#recipe-count");
const pageButtons = document.querySelectorAll("[data-page-step]");
const pageLabels = document.querySelectorAll("[data-page-number]");
const bottomPager = document.querySelector("#bottom-pager");
const dialog = document.querySelector("#recipe-dialog");
const cursors = document.querySelectorAll("[name='cursor-style']");
const languageSwitch = document.querySelector("#language-switch");
const downloadStatus = document.querySelector("#release-status");
const pageSize = 12;
const sourceRepos = ["Typholzz/farstep", "Typholzz/farstep-site"];
let page = 0;
let previousFocus;
let activeMenu = "travel";
let language = "en";
let releaseStatus = "pending";
let releaseName = "";

function readPreference(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function remember(key, value) {
  try { localStorage.setItem(key, value); } catch { /* The current visit still works. */ }
}

function local(english, french) {
  return language === "fr" ? french : english;
}

function renderMenu() {
  const [title, caption, alt] = menus[activeMenu][language === "fr" ? 1 : 0];
  const image = document.querySelector("#menu-image");
  document.querySelector("#menu-title").textContent = title;
  document.querySelector("#menu-caption").textContent = caption;
  image.src = `assets/menu-${activeMenu}${local("", "-fr")}.webp`;
  image.alt = alt;
  for (const button of document.querySelectorAll("[data-menu]")) {
    button.setAttribute("aria-pressed", String(button.dataset.menu === activeMenu));
  }
}

for (const button of document.querySelectorAll("[data-menu]")) {
  button.addEventListener("click", () => {
    activeMenu = button.dataset.menu;
    renderMenu();
    const image = document.querySelector("#menu-image");
    if (window.matchMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      image.animate?.([{ opacity: .68 }, { opacity: 1 }], { duration: 240 });
    }
  });
}

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function openRecipe(recipe, trigger) {
  const image = document.querySelector("#dialog-image");
  const save = document.querySelector("#recipe-save");
  const name = local(recipe.name, recipe.french);
  document.querySelector("#dialog-title").textContent = name;
  document.querySelector("#dialog-biome").textContent = recipe.biome
    ? local(`Craft it or discover it in ${recipe.biome}.`, `À fabriquer ou à découvrir dans ce biome : ${recipe.biomeFr}.`)
    : local("Crafting exclusive.", "À fabriquer uniquement.");
  document.querySelector("#dialog-ingredients").textContent = local(
    `Top center: ${recipe.accent}. Middle row: Ender Pearl, Lodestone, Ender Pearl. Bottom center: ${recipe.base}.`,
    `En haut au centre : ${recipe.accentFr}. Rang du milieu : perle de l'End, magnétite, perle de l'End. En bas au centre : ${recipe.baseFr}.`
  );
  image.src = `assets/${local("recipes", "recipes-fr")}/${recipe.id}.webp`;
  image.alt = local(`Crafting grid and ingredients for ${name}`, `Grille de fabrication et ingrédients pour fabriquer : ${name}`);
  save.href = image.getAttribute("src");
  save.download = `${name} ${local("Recipe", "Recette")}.webp`;
  previousFocus = trigger;
  dialog.showModal();
}

function recipeButton(recipe) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  const text = document.createElement("div");
  const name = document.createElement("strong");
  const biome = document.createElement("small");
  button.type = "button";
  button.className = "recipe";
  button.setAttribute("aria-haspopup", "dialog");
  image.src = `assets/variants/${recipe.id}.webp`;
  image.alt = "";
  image.width = 320;
  image.height = 320;
  image.loading = "lazy";
  name.textContent = local(recipe.name, recipe.french);
  biome.textContent = local(recipe.biome, recipe.biomeFr) || local("Crafting exclusive", "À fabriquer uniquement");
  text.append(name, biome);
  button.append(image, text);
  button.addEventListener("click", () => openRecipe(recipe, button));
  return button;
}

function updateRecipes() {
  const parts = normalize(search.value.trim()).split(/\s+/);
  const filter = availability.value;
  const matches = window.FARSTEP_CATALOG.filter((recipe) => {
    if (filter === "natural" && !recipe.biome) return false;
    if (filter === "craft" && recipe.biome) return false;
    const fields = [recipe.name, recipe.french, recipe.biome || "", recipe.biomeFr || "", ...recipe.ingredients, ...recipe.ingredientsFr];
    return parts.every((part) => fields.some((field) => normalize(field).includes(part)));
  });
  const pages = Math.ceil(matches.length / pageSize);
  page = Math.max(0, Math.min(page, pages - 1));
  const start = page * pageSize;
  const shown = matches.slice(start, start + pageSize);
  list.replaceChildren(...shown.map(recipeButton));
  count.textContent = matches.length
    ? local(`Showing ${start + 1} to ${start + shown.length} of ${matches.length}`, `${start + 1} à ${start + shown.length} sur ${matches.length}`)
    : local("No recipes match. Try a different name or ingredient.", "Aucune recette trouvée. Essayez un autre nom ou ingrédient.");
  for (const label of pageLabels) label.textContent = `${pages ? page + 1 : 0} / ${pages}`;
  for (const button of pageButtons) {
    const target = page + Number(button.dataset.pageStep);
    button.disabled = target < 0 || target >= pages;
  }
  bottomPager.hidden = pages < 2;
}

for (const input of [search, availability]) {
  input.addEventListener(input === search ? "input" : "change", () => {
    page = 0;
    updateRecipes();
  });
}

for (const button of pageButtons) {
  button.addEventListener("click", () => {
    page += Number(button.dataset.pageStep);
    updateRecipes();
    if (button.disabled) button.closest("nav").querySelector("button:not(:disabled)")?.focus();
  });
}

dialog.addEventListener("close", () => previousFocus?.focus());

const cursorKey = "farstep-cursor";
const savedCursor = readPreference(cursorKey);
for (const choice of cursors) {
  if (choice.value === savedCursor) choice.checked = true;
  choice.addEventListener("change", () => {
    renderCursor(choice.value);
    remember(cursorKey, choice.value);
  });
}
function renderCursor(style) {
  document.documentElement.dataset.cursor = style;
  const file = style === "default" ? "default.svg" : `${style}.png`;
  document.querySelector("#cursor-icon").src = `assets/cursors/${file}`;
}
renderCursor(document.querySelector("[name='cursor-style']:checked").value);

function packFromRelease(release, pattern, repo) {
  return release.assets.find((asset) => {
    if (asset.state !== "uploaded" || !pattern.test(asset.name)) return false;
    try {
      const url = new URL(asset.browser_download_url);
      return url.origin === "https://github.com"
        && url.pathname.toLowerCase().startsWith(`/${repo.toLowerCase()}/releases/download/`);
    } catch {
      return false;
    }
  });
}

function renderReleaseStatus() {
  const messages = {
    pending: local("Check GitHub for the most recent public release.", "Consultez GitHub pour connaître la dernière version publique."),
    incomplete: local("The latest release is waiting for both packs to be uploaded.", "Les deux packs seront proposés une fois les fichiers disponibles dans la même version."),
    failed: local("GitHub release information is temporarily unavailable. Try again later.", "GitHub ne répond pas pour le moment. Réessayez plus tard."),
    ready: local(`Latest public release: ${releaseName}`, `Dernière version publique : ${releaseName}`),
  };
  downloadStatus.textContent = messages[releaseStatus];
}

async function updateDownloads() {
  for (const repo of sourceRepos) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
        credentials: "omit",
        headers: { Accept: "application/vnd.github+json" },
      });
      if (response.status === 404) continue;
      if (!response.ok) throw new Error("The GitHub releases endpoint did not respond.");
      const release = await response.json();
      if (release.draft || release.prerelease || !Array.isArray(release.assets)) continue;
      const datapack = packFromRelease(release, /^Farstep-.+-datapack\.zip$/i, repo);
      const resources = packFromRelease(release, /^Farstep-.+-resource-?pack\.zip$/i, repo);
      if (!datapack || !resources) {
        releaseStatus = "incomplete";
        continue;
      }
      document.querySelector("#download-datapack").href = datapack.browser_download_url;
      document.querySelector("#download-resourcepack").href = resources.browser_download_url;
      releaseName = release.name || release.tag_name;
      releaseStatus = "ready";
      break;
    } catch {
      if (releaseStatus === "pending") releaseStatus = "failed";
    }
  }
  renderReleaseStatus();
}

function modrinthFile(version, predicate) {
  return version.files?.find((file) => {
    if (!predicate(file) || !/\.zip$/i.test(file.filename)) return false;
    try {
      const url = new URL(file.url);
      return url.origin === "https://cdn.modrinth.com"
        && url.pathname.startsWith(`/data/KonQgeEg/versions/${version.id}/`);
    } catch {
      return false;
    }
  });
}

async function updateModrinth() {
  try {
    const response = await fetch("https://api.modrinth.com/v2/project/KonQgeEg/version", { credentials: "omit" });
    if (!response.ok) return;
    const versions = await response.json();
    if (!Array.isArray(versions)) return;
    versions.sort((a, b) => Date.parse(b.date_published) - Date.parse(a.date_published));
    for (const version of versions) {
      if (version.project_id !== "KonQgeEg" || version.version_type !== "release"
          || version.status === "draft" || !version.loaders?.includes("datapack")) continue;
      const datapack = modrinthFile(version, (file) => file.primary && !file.file_type?.includes("resource-pack"));
      const resources = modrinthFile(version, (file) => file.file_type === "required-resource-pack"
        || (!file.primary && /resource-?pack\.zip$/i.test(file.filename)));
      if (!datapack || !resources || datapack === resources) continue;
      document.querySelector("#modrinth-datapack").href = datapack.url;
      document.querySelector("#modrinth-resourcepack").href = resources.url;
      return;
    }
  } catch {
    // The page already includes the verified 1.0.0 CDN files.
  }
}

function setLanguage(next) {
  language = next;
  translatePage(language);
  languageSwitch.textContent = local("FR", "EN");
  languageSwitch.setAttribute("aria-label", local("Afficher le site en français", "Show this site in English"));
  languageSwitch.title = local("Français", "English");
  renderMenu();
  updateRecipes();
  renderReleaseStatus();
}

const savedLanguage = readPreference("farstep-language");
const systemLanguage = navigator.languages?.[0] || navigator.language || "en";
setLanguage(["en","fr"].includes(savedLanguage) ? savedLanguage : /^fr\b/i.test(systemLanguage) ? "fr" : "en");
languageSwitch.addEventListener("click", () => {
  setLanguage(local("fr", "en"));
  remember("farstep-language", language);
});
updateDownloads();
updateModrinth();
