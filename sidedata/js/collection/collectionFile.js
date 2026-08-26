import {
  currentSet,
  setCurrentSet,
  getcollectionprogress,
} from "./collection.js";

export async function loadSet(path) {
  try {
    if (!path) {
      console.error(
        "No set path was supplied.",
      );

      return;
    }

    setCurrentSet(path);

    console.log(
      "Loading set:",
      currentSet,
    );

    await getasfile();
  } catch (error) {
    console.error(
      "Failed to load set:",
      error,
    );

    window.alert(
      i18next.t("failed_load"),
    );
  }
}

export function saveasfile() {
  try {
    if (currentSet === "") {
      window.alert(
        i18next.t("choose_set"),
      );

      return;
    }

    const cards = window.getdata
      ? window.getdata()
      : [];

    const jsonString =
      JSON.stringify(
        cards,
        null,
        2,
      );

    const blob = new Blob(
      [jsonString],
      {
        type: "application/json",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const output =
      document.createElement("a");

    output.href = url;

    const filename =
      currentSet.substring(
        currentSet.lastIndexOf(
          "/",
        ) + 1,
        currentSet.lastIndexOf(
          ".",
        ),
      );

    output.download =
      filename +
      "fromCardGamesCollectedCards.json";

    document.body.appendChild(
      output,
    );

    output.click();

    document.body.removeChild(
      output,
    );

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);

    window.alert(
      "failed to save the collection data as a file for later use",
    );
  }
}

export async function getasfile() {
  try {
    if (currentSet === "") {
      console.log("No set selected.");
      return;
    }

    const elementtemp =
      document.getElementById("getbutton");

    /*
     * ============================================================
     * LOAD EXISTING COLLECTION FILE
     * ============================================================
     */

    const numinfile = new Map();

    if (
      elementtemp &&
      elementtemp.files &&
      elementtemp.files.length > 0
    ) {
      try {
        const fileglobal =
          elementtemp.files[0];

        const text =
          await fileglobal.text();

        const data =
          JSON.parse(text);

        if (Array.isArray(data)) {
          data.forEach((card) => {
            if (!card) {
              return;
            }

            /*
             * Clean the card number.
             */
            const nummer =
              String(card.nummer ?? "")
                .replace(/\s+/g, " ")
                .trim();

            /*
             * Make sure amount is a number.
             */
            const anzahl =
              Number.parseInt(
                String(card.anzahl ?? "0").trim(),
                10,
              );

            numinfile.set(
              nummer,
              Number.isFinite(anzahl)
                ? anzahl
                : 0,
            );
          });
        }
      } catch (error) {
        console.log(
          "No valid collection file selected.",
          error,
        );
      }
    }

    /*
     * ============================================================
     * LOAD SET JSON
     * ============================================================
     */

    const response =
      await fetch(currentSet);

    if (!response.ok) {
      throw new Error(
        "HTTP error: " +
          response.status,
      );
    }

    const daten =
      await response.json();

    if (!Array.isArray(daten)) {
      throw new Error(
        "Set JSON is not an array.",
      );
    }

    /*
     * ============================================================
     * GET TABLE
     * ============================================================
     */

    const table =
      document.getElementById(
        "mtgcardlist",
      );

    if (!table) {
      throw new Error(
        'Element "#mtgcardlist" was not found.',
      );
    }

    const kartentabelle =
      table.querySelector("tbody");

    if (!kartentabelle) {
      throw new Error(
        'Element "#mtgcardlist tbody" was not found.',
      );
    }

    /*
     * Remove old cards.
     */
    kartentabelle.innerHTML = "";

    /*
     * ============================================================
     * CREATE TABLE ROWS
     * ============================================================
     */

    daten.forEach((card) => {
      if (!card) {
        return;
      }

      /*
       * Clean all text values.
       *
       * This removes:
       * - \n
       * - \r
       * - tabs
       * - multiple spaces
       * - spaces at the beginning/end
       */

      const cardid =
        String(card.nummer ?? "")
          .replace(/\s+/g, " ")
          .trim();

      const cardname =
        String(card.name ?? "")
          .replace(/\s+/g, " ")
          .trim();

      const setcode =
        String(card.setcode ?? "")
          .replace(/\s+/g, " ")
          .trim();

      const bildlink =
        String(card.bildlink ?? "").trim();

      /*
       * ==========================================================
       * GET SAVED AMOUNT
       * ==========================================================
       */

      let cardan =
        Number.parseInt(
          String(card.anzahl ?? "0").trim(),
          10,
        );

      if (!Number.isFinite(cardan)) {
        cardan = 0;
      }

      /*
       * If the user has an existing collection file,
       * use its amount instead.
       */

      if (numinfile.has(cardid)) {
        cardan =
          numinfile.get(cardid);
      }

      /*
       * ==========================================================
       * CREATE ROW
       * ==========================================================
       */

      const tabellezeile =
        document.createElement("tr");

      tabellezeile.id =
        `karte${cardid}`;

      tabellezeile.innerHTML = `
        <td id="mtgtablecell">
          ${escapeHtml(cardid)}
        </td>

        <td id="mtgtablecell">
          ${escapeHtml(cardname)}
        </td>

        <td id="mtgtablecell">
          ${cardan}
        </td>

        <td id="mtgtablecell">
          ${escapeHtml(setcode)}
        </td>

        <td id="mtgtablecell">
          <button onclick="addcard(parentElement)">
            +
          </button>
        </td>

        <td id="mtgtablecell">
          <button onclick="removecard(parentElement)">
            -
          </button>
        </td>

        <td id="mtgtablecell">
          <div class="tooltip">
            &#128065;

            <span class="tooltiptext">
              <img
                src="${escapeAttribute(bildlink)}"
                alt="failed to Load Image"
                id="imagecard"
              >
            </span>
          </div>
        </td>
      `;

      kartentabelle.appendChild(
        tabellezeile,
      );
    });

    /*
     * ============================================================
     * UPDATE PROGRESS
     * ============================================================
     */

    getcollectionprogress();

  } catch (error) {
    console.error(
      "Failed to load set:",
      error,
    );

    window.alert(
      i18next.t("failed_load"),
    );
  }
}


/*
 * ================================================================
 * HTML CLEANING HELPERS
 * ================================================================
 *
 * These prevent JSON/card data from accidentally breaking the
 * HTML when a card name contains &, <, >, ", etc.
 */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#039;");
}