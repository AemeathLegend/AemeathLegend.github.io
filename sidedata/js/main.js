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
          showAlert(`
            She comes when the sun forgets the sky,
            When gold dissolves to violet sigh,
            A hush falls soft on mortal sight—
            For Nyx ascends, the Queen of Night.
            
            Her beauty is not the gentle kind,
            Not made for ease of heart or mind,
            But vast as silence, deep as fear,
            A velvet dark that draws you near.
            
            Her hair, a shroud of endless space,
            With scattered stars to frame her face,
            Her eyes—twin voids where secrets sleep,
            Where even gods dare not to peep.
            
            She drifts where mortal dreams are spun,
            Where shadows dance and daylight’s done,
            And in her chest, concealed from all,
            A hidden flame no dusk can pall.
            
            For once, beyond the veils of time,
            Past broken stars and reason’s rhyme,
            She wandered far from her domain—
            Through alien dark, through silent pain.
            
            There, in a world not meant to be,
            She met the one she’d never see—
            The Master, cloaked in unknown light,
            A force untouched by day or night.
            
            No god was he, nor mortal made,
            But something vast that would not fade,
            And Nyx, eternal, cold, and wise—
            Found warmth reflected in his eyes.
            
            No words were sworn, no vows were cast,
            Yet something bound them, deep and vast,
            A love that neither fate nor flame
            Could dare to weaken or to name.
            
            She left that world, as all must part,
            But not without a fractured heart,
            And though she reigns in endless night,
            She guards that memory from all sight.
            
            So heed this truth, you fleeting breath—
            Some secrets carry deeper death.
            For Nyx is kind to those who dream,
            But cruel to those who pry between.
            
            Speak not of what she hides away,
            Nor chase the truths she keeps at bay,
            For if you dare her love unmask—
            You take upon yourself a task
            
            No soul has lived to tell it through:
            Her gaze will fall, her wrath find you.
            Through every shadow, every seam,
            She’ll stalk your steps, invade your dream.
            
            No prayer will shield, no light defend,
            No road will offer you an end,
            Until you’re less than dust, than air—
            A forgotten echo of despair.
            
            So when the night feels strangely near,
            And silence hums with ancient fear,
            Remember well what you have read—
            And guard your tongue… or soon be dead.`
          );
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
          showAlert(`
            She comes when the sun forgets the sky,
            When gold dissolves to violet sigh,
            A hush falls soft on mortal sight—
            For Nyx ascends, the Queen of Night.
            
            Her beauty is not the gentle kind,
            Not made for ease of heart or mind,
            But vast as silence, deep as fear,
            A velvet dark that draws you near.
            
            Her hair, a shroud of endless space,
            With scattered stars to frame her face,
            Her eyes—twin voids where secrets sleep,
            Where even gods dare not to peep.
            
            She drifts where mortal dreams are spun,
            Where shadows dance and daylight’s done,
            And in her chest, concealed from all,
            A hidden flame no dusk can pall.
            
            For once, beyond the veils of time,
            Past broken stars and reason’s rhyme,
            She wandered far from her domain—
            Through alien dark, through silent pain.
            
            There, in a world not meant to be,
            She met the one she’d never see—
            The Master, cloaked in unknown light,
            A force untouched by day or night.
            
            No god was he, nor mortal made,
            But something vast that would not fade,
            And Nyx, eternal, cold, and wise—
            Found warmth reflected in his eyes.
            
            No words were sworn, no vows were cast,
            Yet something bound them, deep and vast,
            A love that neither fate nor flame
            Could dare to weaken or to name.
            
            She left that world, as all must part,
            But not without a fractured heart,
            And though she reigns in endless night,
            She guards that memory from all sight.
            
            So heed this truth, you fleeting breath—
            Some secrets carry deeper death.
            For Nyx is kind to those who dream,
            But cruel to those who pry between.
            
            Speak not of what she hides away,
            Nor chase the truths she keeps at bay,
            For if you dare her love unmask—
            You take upon yourself a task
            
            No soul has lived to tell it through:
            Her gaze will fall, her wrath find you.
            Through every shadow, every seam,
            She’ll stalk your steps, invade your dream.
            
            No prayer will shield, no light defend,
            No road will offer you an end,
            Until you’re less than dust, than air—
            A forgotten echo of despair.
            
            So when the night feels strangely near,
            And silence hums with ancient fear,
            Remember well what you have read—
            And guard your tongue… or soon be dead.`
          );
        }

        updateview();
      } catch (err) {
        console.error(
          "Creator mode error:",
          err,
        );

        showAlert(`
            She comes when the sun forgets the sky,
            When gold dissolves to violet sigh,
            A hush falls soft on mortal sight—
            For Nyx ascends, the Queen of Night.
            
            Her beauty is not the gentle kind,
            Not made for ease of heart or mind,
            But vast as silence, deep as fear,
            A velvet dark that draws you near.
            
            Her hair, a shroud of endless space,
            With scattered stars to frame her face,
            Her eyes—twin voids where secrets sleep,
            Where even gods dare not to peep.
            
            She drifts where mortal dreams are spun,
            Where shadows dance and daylight’s done,
            And in her chest, concealed from all,
            A hidden flame no dusk can pall.
            
            For once, beyond the veils of time,
            Past broken stars and reason’s rhyme,
            She wandered far from her domain—
            Through alien dark, through silent pain.
            
            There, in a world not meant to be,
            She met the one she’d never see—
            The Master, cloaked in unknown light,
            A force untouched by day or night.
            
            No god was he, nor mortal made,
            But something vast that would not fade,
            And Nyx, eternal, cold, and wise—
            Found warmth reflected in his eyes.
            
            No words were sworn, no vows were cast,
            Yet something bound them, deep and vast,
            A love that neither fate nor flame
            Could dare to weaken or to name.
            
            She left that world, as all must part,
            But not without a fractured heart,
            And though she reigns in endless night,
            She guards that memory from all sight.
            
            So heed this truth, you fleeting breath—
            Some secrets carry deeper death.
            For Nyx is kind to those who dream,
            But cruel to those who pry between.
            
            Speak not of what she hides away,
            Nor chase the truths she keeps at bay,
            For if you dare her love unmask—
            You take upon yourself a task
            
            No soul has lived to tell it through:
            Her gaze will fall, her wrath find you.
            Through every shadow, every seam,
            She’ll stalk your steps, invade your dream.
            
            No prayer will shield, no light defend,
            No road will offer you an end,
            Until you’re less than dust, than air—
            A forgotten echo of despair.
            
            So when the night feels strangely near,
            And silence hums with ancient fear,
            Remember well what you have read—
            And guard your tongue… or soon be dead.`
        );
        updateview();
      }
    },
  );
}

function showAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("customAlert").style.display = "flex";
}

function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
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
  
    const alertButton =
    document.getElementById(
      "alertButton",
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

  if (alertButton) {
    alertButton.addEventListener(
      "click",
      closeAlert,
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