/*
 * ============================================================
 * PACK DATA
 * ============================================================
 *
 * This file stores the currently loaded cards and the current
 * generated pack.
 */

export let rarityDict = {};
export let packcontent = [];

/*
 * ============================================================
 * RARITY DICTIONARY
 * ============================================================
 */

export function clearRarityDict() {
  rarityDict = {};
}

export function setRarityDict(data) {
  rarityDict = data;
}

export function getRarityDict() {
  return rarityDict;
}

/*
 * ============================================================
 * PACK CONTENT
 * ============================================================
 */

export function clearPackContent() {
  packcontent = [];
}

export function setPackContent(content) {
  if (!Array.isArray(content)) {
    packcontent = [];
    return;
  }

  packcontent = [...content];
}

export function shiftPackContent() {
  if (packcontent.length > 0) {
    packcontent.shift();
  }
}

export function getFirstPackContent() {
  return packcontent[0];
}

export function getPackContentLength() {
  return packcontent.length;
}