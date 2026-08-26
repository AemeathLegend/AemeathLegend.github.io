import {
  packImages,
} from "../config/packs.js";

import {
  rarityIdMap,
} from "../config/rarities.js";

import {
  rarityDict,
  packcontent,
  clearRarityDict,
  clearPackContent,
  setPackContent,
  shiftPackContent,
  getFirstPackContent,
} from "./packData.js";

import {
  setchancelist,
  calculateChance,
} from "./packRandom.js";

/*
 * ============================================================
 * INTERNAL STATE
 * ============================================================
 */

let cardsLoadedForPack = null;
let cardsAreLoaded = false;

/*
 * ============================================================
 * BACKGROUND
 * ============================================================
 */

export async function backgroundchangepacksim() {
  const packbackselect =
    document.getElementById("backgroundselection");

  if (!packbackselect) {
    return;
  }

  const selectedValue = packbackselect.value;

  sessionStorage.setItem(
    "imageBack",
    JSON.stringify(selectedValue),
  );

  const background =
    document.getElementById("background");

  if (!background) {
    return;
  }

  const {
    backgroundimg,
  } = await import("../config/backgrounds.js");

  background.style.backgroundImage =
    `url('${backgroundimg[selectedValue] || backgroundimg.galaxy}')`;
}

/*
 * ============================================================
 * PACK IMAGE
 * ============================================================
 */

export function setPackImage() {
  const packSelect =
    document.getElementById("packselection");

  const packImage =
    document.getElementById("packimage");

  if (!packSelect || !packImage) {
    return;
  }

  const selectedValue = packSelect.value;

  packImage.src =
    packImages[selectedValue] ||
    "./sidedata/cardimages/assetssim/packs/m20pack.png";
}

/*
 * ============================================================
 * PACK SELECTION CHANGED
 * ============================================================
 */

export async function packimagechange() {
  const packSelect =
    document.getElementById("packselection");

  if (!packSelect) {
    return;
  }

  /*
   * Changing packs completely resets the current pack.
   */
  clearPackContent();

  cardsLoadedForPack = null;
  cardsAreLoaded = false;

  setPackImage();

  await loadCards();
}

/*
 * ============================================================
 * LOAD ALL CARDS FOR CURRENT PACK
 * ============================================================
 */

export async function loadCards() {
  const packSelection =
    document.getElementById("packselection");

  if (!packSelection) {
    return;
  }

  const selectedPack =
    packSelection.value;

  /*
   * Don't reload the same cards unnecessarily.
   */
  if (
    cardsAreLoaded &&
    cardsLoadedForPack === selectedPack
  ) {
    return;
  }

  console.log(
    "Loading cards for pack:",
    selectedPack,
  );

  clearRarityDict();

  cardsLoadedForPack = selectedPack;
  cardsAreLoaded = false;

  const response =
    await fetch("./sidedata/filecheck.json");

  if (!response.ok) {
    throw new Error(
      "HTTP error while loading filecheck.json: " +
        response.status,
    );
  }

  const data =
    await response.json();

  let loadedFiles = 0;

  for (const element of data) {
    if (!Array.isArray(element.packtype)) {
      continue;
    }

    /*
     * A file can belong to multiple pack types.
     */
    const belongsToPack =
      element.packtype.includes(selectedPack);

    if (!belongsToPack) {
      continue;
    }

    if (!element.filepath) {
      console.warn(
        "Missing filepath in filecheck.json:",
        element,
      );

      continue;
    }

    console.log(
      "Loading card file:",
      element.filepath,
    );

    await getSetWithPath(
      element.filepath,
    );

    loadedFiles++;
  }

  cardsAreLoaded = true;

  console.log(
    "Card files loaded:",
    loadedFiles,
  );

  console.log(
    "Rarity groups:",
    Object.keys(rarityDict),
  );

  let totalCards = 0;

  for (const rarity of Object.keys(rarityDict)) {
    console.log(
      `${rarity}: ${rarityDict[rarity].length} cards`,
    );

    totalCards +=
      rarityDict[rarity].length;
  }

  console.log(
    "TOTAL CARDS LOADED:",
    totalCards,
  );
}

/*
 * ============================================================
 * LOAD INDIVIDUAL CARD FILE
 * ============================================================
 */

export async function getSetWithPath(
  filePath,
) {
  const response =
    await fetch(filePath);

  if (!response.ok) {
    throw new Error(
      "HTTP error while loading card file " +
        filePath +
        ": " +
        response.status,
    );
  }

  const daten =
    await response.json();

  if (!Array.isArray(daten)) {
    console.warn(
      "Card file does not contain an array:",
      filePath,
    );

    return;
  }

  let loaded = 0;

  for (const card of daten) {
    if (!card || !card.rarityname) {
      continue;
    }

    if (!rarityDict[card.rarityname]) {
      rarityDict[card.rarityname] = [];
    }

    rarityDict[
      card.rarityname
    ].push(card);

    loaded++;
  }

  console.log(
    `Loaded ${loaded} cards from ${filePath}`,
  );
}

/*
 * ============================================================
 * OPEN PACK
 * ============================================================
 */

export async function openpack() {
  const packSelect =
    document.getElementById("packselection");

  const packImage =
    document.getElementById("packimage");

  if (!packSelect || !packImage) {
    console.error(
      "Pack simulator elements are missing.",
    );

    return;
  }

  /*
   * ----------------------------------------------------------
   * CURRENT PACK IS EMPTY
   * ----------------------------------------------------------
   *
   * This means:
   *
   * 1. First opening
   * OR
   * 2. The previous pack was completely opened.
   *
   * In both cases we generate a NEW pack.
   */

  if (packcontent.length === 0) {
    console.log(
      "Generating new pack...",
    );

    /*
     * Make absolutely sure the cards for the selected
     * pack are loaded before generating rewards.
     */
    await loadCards();

    /*
     * Generate the rarity IDs.
     */
    const content =
      await openpackfill();

    if (
      !Array.isArray(content) ||
      content.length === 0
    ) {
      console.error(
        "Failed to generate pack.",
      );

      return;
    }

    /*
     * Store the generated pack.
     */
    setPackContent(content);

    console.log(
      "Generated pack:",
      content,
    );

    /*
     * IMPORTANT:
     *
     * The first click generates the pack but does NOT
     * display a card yet.
     *
     * Restore the pack image here.
     */
    setPackImage();

    return;
  }

  /*
   * ----------------------------------------------------------
   * OPEN NEXT CARD
   * ----------------------------------------------------------
   */

  const rarityId =
    getFirstPackContent();

  const rarityName =
    rarityIdMap[rarityId];

  if (!rarityName) {
    console.error(
      "Unknown rarity ID:",
      rarityId,
    );

    shiftPackContent();

    return;
  }

  const cardList =
    rarityDict[rarityName];

  if (
    !cardList ||
    cardList.length === 0
  ) {
    console.error(
      "No cards for rarity:",
      rarityName,
      "ID:",
      rarityId,
    );

    /*
     * Remove the invalid reward so the simulator
     * cannot get stuck forever.
     */
    shiftPackContent();

    return;
  }

  const randcard =
    Math.floor(
      Math.random() *
        cardList.length,
    );

  const selectedCard =
    cardList[randcard];

  if (!selectedCard) {
    console.error(
      "Selected card does not exist.",
    );

    shiftPackContent();

    return;
  }

  /*
   * Display the card.
   */
  if (selectedCard.bildlink) {
    packImage.src =
      selectedCard.bildlink;
  } else {
    console.warn(
      "Card has no bildlink:",
      selectedCard,
    );
  }

  /*
   * Remove the card from the current pack.
   */
  shiftPackContent();

  console.log(
    "Opened:",
    selectedCard.name ||
      "(unnamed card)",
    "Remaining:",
    packcontent.length,
  );

  /*
   * ----------------------------------------------------------
   * LAST CARD WAS JUST OPENED
   * ----------------------------------------------------------
   *
   * The next click should generate a new pack.
   *
   * We DON'T immediately show the pack image here because
   * the user should still be able to see the card they just
   * opened.
   *
   * On the NEXT click, the empty-pack branch generates the
   * new pack and restores the pack image.
   */
}

/*
 * ============================================================
 * GENERATE PACK CONTENT
 * ============================================================
 */

export async function openpackfill() {
  /*
   * IMPORTANT:
   *
   * Do NOT call packimagechange() here.
   *
   * packimagechange() clears packcontent and reloads cards.
   * Calling it while generating a pack was the source of
   * several state/reset problems.
   */

  await loadCards();

  let chancelist = [];

  const endrewards = [];

  const dataCheck =
    await checkSet();

  /*
   * ==========================================================
   * FINAL FANTASY
   * ==========================================================
   */

  if (
    dataCheck[0] === "finDraftBooster" &&
    dataCheck[1] === "MTG"
  ) {
    chancelist =
      setchancelist(
        [10000, 3675, 700],
        [11, 36, 1],
      );

    /*
     * 6 commons
     */
    endrewards.push(
      1,
      1,
      1,
      1,
      1,
      1,
    );

    /*
     * Uncommon / rare / mythic slot
     */
    if (
      Math.floor(
        Math.random() * 100000,
      ) <= 33333
    ) {
      chancelist =
        setchancelist(
          [10000, 3675, 700],
          [6, 11, 36],
        );

      for (
        const result of calculateChance(
          1,
          chancelist,
          4,
        )
      ) {
        endrewards.push(result);
      }
    } else {
      endrewards.push(6);
    }

    /*
     * 3 uncommons
     */
    endrewards.push(
      6,
      6,
      6,
    );

    /*
     * Additional slot
     */
    chancelist =
      setchancelist(
        [
          1000,
          833,
          250,
          224,
          167,
          55,
        ],
        [
          1,
          6,
          1,
          6,
          11,
          36,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        3,
      )
    ) {
      endrewards.push(result);
    }

    /*
     * Additional rare/uncommon slot
     */
    chancelist =
      setchancelist(
        [
          1000,
          200,
          100,
          20,
          10,
          5,
        ],
        [
          11,
          36,
          11,
          36,
          11,
          36,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        3,
      )
    ) {
      endrewards.push(result);
    }

    /*
     * Special card
     */
    chancelist =
      setchancelist(
        [
          10000,
          4425,
          835,
          285,
          210,
          200,
          150,
          50,
          25,
        ],
        [
          1,
          6,
          11,
          36,
          1,
          6,
          11,
          36,
          1,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        4,
      )
    ) {
      endrewards.push(result);
    }

    /*
     * Land
     */
    chancelist =
      setchancelist(
        [100, 45],
        [38, 39],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        2,
      )
    ) {
      endrewards.push(result);
    }
  }

  /*
   * ==========================================================
   * THE LAST DANCE
   * ==========================================================
   */

  if (
    dataCheck[0] === "theLastDanceZCG" &&
    dataCheck[1] === "ZCG"
  ) {
    chancelist =
      setchancelist(
        [
          10000,
          3000,
          1200,
          400,
          100,
        ],
        [
          1,
          2,
          3,
          4,
          5,
        ],
      );

    for (
      const result of calculateChance(
        6,
        chancelist,
        4,
      )
    ) {
      endrewards.push(result);
    }

    chancelist =
      setchancelist(
        [
          1000000,
          257141,
          114285,
          42857,
          14286,
          428568,
          110203,
          48979,
          18367,
          6122,
        ],
        [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        6,
      )
    ) {
      endrewards.push(result);
    }

    chancelist =
      setchancelist(
        [
          10000,
          3000,
          1200,
          400,
          100,
        ],
        [
          6,
          7,
          8,
          9,
          10,
        ],
      );

    for (
      const result of calculateChance(
        4,
        chancelist,
        4,
      )
    ) {
      endrewards.push(result);
    }

    chancelist =
      setchancelist(
        [
          10000,
          3000,
          1200,
          400,
          100,
        ],
        [
          11,
          12,
          13,
          14,
          15,
        ],
      );

    for (
      const result of calculateChance(
        2,
        chancelist,
        4,
      )
    ) {
      endrewards.push(result);
    }

    chancelist =
      setchancelist(
        [
          1000000,
          257121,
          114306,
          42857,
          14286,
          111111,
          28572,
          12698,
          4762,
          1587,
        ],
        [
          11,
          12,
          13,
          14,
          15,
          21,
          22,
          23,
          24,
          25,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        6,
      )
    ) {
      endrewards.push(result);
    }

    chancelist =
      setchancelist(
        [
          1000000,
          257259,
          114330,
          42864,
          14277,
          20400,
          5256,
          2337,
          875,
          292,
          146,
        ],
        [
          16,
          17,
          16,
          19,
          20,
          26,
          27,
          28,
          27,
          28,
          32,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        6,
      )
    ) {
      endrewards.push(result);
    }
  }

  /*
   * ==========================================================
   * LORD OF THE RINGS
   * ==========================================================
   */

  if (
    dataCheck[0] === "ltrDraftBooster" &&
    dataCheck[1] === "MTG"
  ) {
    /*
     * 10 commons
     */
    endrewards.push(
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
    );

    /*
     * 3 uncommons
     */
    endrewards.push(
      6,
      6,
      6,
    );

    /*
     * Rare/mythic
     */
    chancelist =
      setchancelist(
        [100, 5],
        [11, 36],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        2,
      )
    ) {
      endrewards.push(result);
    }

    /*
     * Showcase slot
     */
    chancelist =
      setchancelist(
        [
          10000,
          3414,
          1371,
          686,
        ],
        [
          46,
          46,
          47,
          48,
        ],
      );

    for (
      const result of calculateChance(
        1,
        chancelist,
        4,
      )
    ) {
      endrewards.push(result);
    }
  }

  /*
   * Keep the original ordering.
   */
  endrewards.sort(
    (b, a) => b - a,
  );

  console.log(
    "Generated pack:",
    endrewards,
  );

  return endrewards;
}

/*
 * ============================================================
 * CHECK CURRENT PACK
 * ============================================================
 */

export async function checkSet() {
  const packSimpleName =
    document.getElementById(
      "packselection",
    )?.value;

  if (!packSimpleName) {
    return [];
  }

  const response =
    await fetch(
      "./sidedata/filecheck.json",
    );

  if (!response.ok) {
    throw new Error(
      "HTTP error: " +
        response.status,
    );
  }

  const daten =
    await response.json();

  for (const setData of daten) {
    if (!Array.isArray(setData.packtype)) {
      continue;
    }

    if (
      setData.packtype.includes(
        packSimpleName,
      )
    ) {
      return [
        packSimpleName,
        setData.game,
      ];
    }
  }

  return [];
}

/*
 * ============================================================
 * OPTIONAL GLOBAL-STYLE HELPERS
 * ============================================================
 */

export function getCurrentPack() {
  return [...packcontent];
}

export function resetPackSimulator() {
  clearPackContent();

  cardsLoadedForPack = null;
  cardsAreLoaded = false;

  setPackImage();
}