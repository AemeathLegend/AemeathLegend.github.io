export const CreatorModeEncrypted =
  "e4VwIR0045OoQ5uKg6lZVvMcYb3VrqAR6EUogMSBBvzZTgIg3P0=";

export const CreatorCodeEncrypted2 =
  "ky/b4phOl3GsQqoMA/LToixnwu9xrnix9zyjtSEFoLrBCOX8";

export let CreatorMode =
  JSON.parse(sessionStorage.getItem("CreatorMode")) || false;

export function setCreatorMode(value) {
  CreatorMode = Boolean(value);

  sessionStorage.setItem(
    "CreatorMode",
    JSON.stringify(CreatorMode),
  );
}

export let imageBack =
  JSON.parse(sessionStorage.getItem("imageBack")) ||
  "galaxy";

export function setImageBack(value) {
  imageBack = value;

  sessionStorage.setItem(
    "imageBack",
    JSON.stringify(value),
  );
}

export let languagesave =
  JSON.parse(sessionStorage.getItem("selectedLang")) ||
  "en";

export function setLanguageSave(value) {
  languagesave = value;

  sessionStorage.setItem(
    "selectedLang",
    JSON.stringify(value),
  );
}