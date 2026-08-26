import {
  languagesave,
  setLanguageSave,
} from "../config/creator.js";

export function updateContent() {
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => {
      const key = el.dataset.i18n;

      el.textContent = i18next.t(key);
    });
}

export function updateHtmlLang() {
  document.documentElement.lang =
    i18next.language;
}

export function initializeLanguage() {
  i18next
    .use(i18nextBrowserLanguageDetector)
    .init(
      {
        fallbackLng: "en",

        debug: false,

        resources: {
          en: {
            translation: {
              title:
                "Trading Card Game Collection Tracker",

              choose_set: "Choose a Set",

              progress: "Progress",

              total_cards:
                "Total Collected Cards from this Set",

              save_json: "Save JSON",

              collector_number: "Collector #",

              card_name: "Card Name",

              amount: "Amount",

              set: "Set",

              negative_cards:
                "You can't have negative amounts of owned cards",

              failed_load:
                "Failed to load card lists from the website",

              thelastdancepack:
                "The last Dance",

              magicportalpackback:
                "Magic Portal",

              goddessnyxpackback:
                "Goddess Nyx",

              packblessingpacksim:
                "May you have the best of Luck! To an explosive pack...",
            },
          },

          de: {
            translation: {
              title:
                "Trading Card Spiel Sammlungs-Tracker",

              choose_set: "Set auswählen",

              progress: "Fortschritt",

              total_cards:
                "Gesammelte Karten aus diesem Set",

              save_json: "JSON speichern",

              collector_number: "Sammler #",

              card_name: "Kartenname",

              amount: "Anzahl",

              set: "Set",

              negative_cards:
                "Du kannst keine negative Anzahl an Karten besitzen",

              failed_load:
                "Kartendaten konnten nicht geladen werden",

              thelastdancepack:
                "Der letzte Tanz",

              magicportalpackback:
                "Magisches Portal",

              goddessnyxpackback:
                "Göttin Nyx",

              packblessingpacksim:
                "Ich wünsche dir viel Glück, für einen krassen Booster...",
            },
          },
        },
      },
      () => {
        updateContent();
        updateHtmlLang();
      },
    );
}

export function changeLanguageInit(
  lang,
) {
  setLanguageSave(lang);

  changeLanguage();
}

export function changeLanguage() {
  i18next.changeLanguage(
    languagesave,
    () => {
      updateContent();

      updateHtmlLang();

      if (
        window.location.href ==
        "../index.html"
      ) {
        window.getcollectionprogress?.();
      }
    },
  );
}