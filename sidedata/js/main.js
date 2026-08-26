import {
  CreatorMode,
  CreatorModeEncrypted,
  CreatorCodeEncrypted2,
  setCreatorMode,
} from "./config/creator.js";

import {
  backgroundimg,
} from "./config/backgrounds.js";

import {
  decryptAccessCode,
} from "./crypto/creatorCrypto.js";

import {
  initializeLanguage,
  changeLanguageInit,
  changeLanguage,
  updateContent,
  updateHtmlLang,
} from "./language/language.js";

import {
  openpacksimulator,
  backtomainmenu,
} from "./navigation/navigation.js";

import {
  addcard,
  removecard,
  getdata,
  getcollectionprogress,
} from "./collection/collection.js";

import {
  loadSet,
  saveasfile,
  getasfile,
} from "./collection/collectionFile.js";

import {
  backgroundchangepacksim,
  packimagechange,
  openpack,
  loadCards,
  getSetWithPath,
  openpackfill,
  checkSet,
} from "./packSimulator/packSimulator.js";

/*
 * ============================================================
 * UPDATE VIEW
 * ============================================================
 */

function updateview() {
  const creatorOptions = [
    "ayaka",
    "nyx",
  ];

  const select =
    document.getElementById(
      "backgroundselection",
    );

  const creatorGroup =
    document.getElementById(
      "creatorGroup",
    );

  if (select) {
    for (const option of select.options) {
      if (
        creatorOptions.includes(
          option.value,
        )
      ) {
        option.hidden =
          !CreatorMode;

        if (
          option.hidden &&
          option.selected
        ) {
          select.value = "galaxy";
        }
      }
    }
  }

  if (creatorGroup) {
    creatorGroup.style.display =
      CreatorMode
        ? "block"
        : "none";
  }

  const background =
    document.getElementById(
      "background",
    );

  if (!background) {
    return;
  }

  let imageBack = "galaxy";

  try {
    imageBack =
      JSON.parse(
        sessionStorage.getItem(
          "imageBack",
        ),
      ) || "galaxy";
  } catch {
    imageBack = "galaxy";
  }

  background.style.backgroundImage =
    `url('${backgroundimg[imageBack] || backgroundimg.galaxy}')`;
}

/*
 * ============================================================
 * CREATOR MODE
 * ============================================================
 */

function initializeCreatorMode() {
  document.addEventListener(
    "keydown",
    async (event) => {
      if (
        event.key.toLowerCase() !== "c"
      ) {
        return;
      }

      try {
        const password =
          prompt("Enter Password:");

        if (password === null) {
          return;
        }

        const resultingText =
          await decryptAccessCode(
            CreatorModeEncrypted,
            password,
          );

        const result =
          prompt("Enter Result:");

        if (
          resultingText !== result
        ) {
          setCreatorMode(false);
          updateview();
          return;
        }

        const password2 =
          prompt("Enter Password:");

        if (password2 === null) {
          return;
        }

        const resultingText2 =
          await decryptAccessCode(
            CreatorCodeEncrypted2,
            password2,
          );

        const result2 =
          prompt("Enter Result:");

        if (
          resultingText2 === result2
        ) {
          setCreatorMode(true);
        } else {
          setCreatorMode(false);
        }

        updateview();
      } catch (err) {
        console.error(
          "Creator mode error:",
          err,
        );

        window.alert(
          "Invalid creator code.",
        );
      }
    },
  );
}

/*
 * ============================================================
 * EVENT LISTENERS
 * ============================================================
 */

function initializeEventListeners() {
  const packSelect =
    document.getElementById(
      "packselection",
    );

  const backButton =
    document.getElementById(
      "ZCGPackSimulatorback",
    );

  const openPackButton =
    document.getElementById(
      "openpackbutton",
    );

  const backgroundselector =
    document.getElementById(
      "backgroundselection",
    );

  if (backgroundselector) {
    backgroundselector.addEventListener(
      "change",
      backgroundchangepacksim,
    );
  }

  if (packSelect) {
    packSelect.addEventListener(
      "change",
      packimagechange,
    );
  }

  if (backButton) {
    backButton.addEventListener(
      "click",
      backtomainmenu,
    );
  }

  if (openPackButton) {
    openPackButton.addEventListener(
      "click",
      async () => {
        try {
          await openpack();
        } catch (error) {
          console.error(
            "Failed to open pack:",
            error,
          );
        }
      },
    );
  }
}

/*
 * ============================================================
 * INITIALIZE PACK SIMULATOR
 * ============================================================
 */

async function initializePackSimulator() {
  const packSelect =
    document.getElementById(
      "packselection",
    );

  /*
   * Only initialize if the pack simulator
   * exists on this page.
   */
  if (!packSelect) {
    return;
  }

  console.log(
    "Initializing pack simulator...",
  );

  try {
    /*
     * Set the initial pack image immediately.
     */
    await packimagechange();

    console.log(
      "Pack simulator initialized.",
    );
  } catch (error) {
    console.error(
      "Failed to initialize pack simulator:",
      error,
    );
  }
}

/*
 * ============================================================
 * DOM READY
 * ============================================================
 */

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    console.log(
      "main.js starting...",
    );

    initializeEventListeners();

    initializeCreatorMode();

    initializeLanguage();

    updateview();

    changeLanguage();

    await initializePackSimulator();

    console.log(
      "main.js initialization complete.",
    );
  },
);

/*
 * ============================================================
 * WINDOW EXPORTS
 * ============================================================
 *
 * Needed for existing HTML onclick="" handlers.
 * ============================================================
 */

window.addcard =
  addcard;

window.removecard =
  removecard;

window.getdata =
  getdata;

window.getcollectionprogress =
  getcollectionprogress;

window.loadSet =
  loadSet;

window.saveasfile =
  saveasfile;

window.getasfile =
  getasfile;

window.openpacksimulator =
  openpacksimulator;

window.backtomainmenu =
  backtomainmenu;

window.backgroundchangepacksim =
  backgroundchangepacksim;

window.packimagechange =
  packimagechange;

window.loadCards =
  loadCards;

window.getSetWithPath =
  getSetWithPath;

window.openpackfill =
  openpackfill;

window.checkSet =
  checkSet;

window.changeLanguageInit =
  changeLanguageInit;

window.changeLanguage =
  changeLanguage;

window.updateContent =
  updateContent;

window.updateHtmlLang =
  updateHtmlLang;

window.updateview =
  updateview;