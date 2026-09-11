import {
  currentSet,
  setCurrentSet,
  getcollectionprogress,
} from "./collection.js";

/**
 * function for managing the set loading process when its needed
 * @param {*} path the path of the setFile json
 */
export async function loadSet(path) {
  try {
    if (!path) {
      console.error("No set path was supplied.");
      return;
    }
    setCurrentSet(path);
    console.log("Loading set:" + currentSet);
    await getasfile();
  }
  catch (error) {
    console.error("Failed to load set:" + error);
    window.alert(i18next.t("failed_load"));
  }
}

/**
 * function for managing the saving of a set progress as a json, including the automatic file download
 */
export function saveasfile() {
  try {
    if (currentSet === "") {
      window.alert(i18next.t("choose_set"));
      return;
    }
    const cards = window.getdata ? window.getdata() : [];
    const jsonString = JSON.stringify(cards, null, 2);
    const blob = new Blob(
      [jsonString],
      {
        type: "application/json",
      },
    );
    const url = URL.createObjectURL(blob);
    const output = document.createElement("a");
    output.href = url;
    const filename = currentSet.substring(currentSet.lastIndexOf("/") + 1, currentSet.lastIndexOf("."));
    output.download = filename + "fromCardGamesCollectedCards.json";
    document.body.appendChild(output);
    output.click();
    document.body.removeChild(output);
    URL.revokeObjectURL(url);
  }
  catch (error) {
    console.error(error);
    window.alert("failed to save the collection data as a file for later use");
  }
}

/**
 * function for loading a set from a file(may be provided file or default) and filling the HTML table with the retrieved data.
 * see sub-comments for more detail
 */
export async function getasfile() {
  try {
    //checks if a set is selected
    if (currentSet === "") {
      console.log("No set selected.");
      return;
    }
    const elementtemp = document.getElementById("getbutton");
    const numinfile = new Map();
    /**
     * if true loads the provided file inside the userInputElement
     */
    if (elementtemp && elementtemp.files && elementtemp.files.length > 0) {
      try {
        const fileglobal = elementtemp.files[0];
        const text = await fileglobal.text();
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          data.forEach((card) => {
            if (!card) {
              return;
            }
            const nummer =
              String(card.nummer ?? "")
                .replace(/\s+/g, " ")
                .trim();
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
        console.log("No valid collection file selected." + error);
      }
    }
    const response = await fetch(currentSet);
    //check if the response is valid
    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }
    const daten = await response.json();
    //check if the json file is valid(is an array)
    if (!Array.isArray(daten)) {
      throw new Error("Set JSON is not an array.");
    }
    const table = document.getElementById("mtgcardlist");
    if (!table) {
      throw new Error('Element "#mtgcardlist" was not found.');
    }
    const kartentabelle = table.querySelector("tbody");
    if (!kartentabelle) {
      throw new Error('Element "#mtgcardlist tbody" was not found.');
    }
    /**
     * loads the cards from the json data(of the internal file) inside the table
     */
    kartentabelle.innerHTML = "";
    daten.forEach((card) => {
      if (!card) {
        return;
      }
      const cardid = String(card.nummer ?? "").replace(/\s+/g, " ").trim();
      const cardname = String(card.name ?? "").replace(/\s+/g, " ").trim();
      const setcode = String(card.setcode ?? "").replace(/\s+/g, " ").trim();

      const bildlink = String(card.bildlink ?? "").trim();
      let cardan = Number.parseInt(String(card.anzahl ?? "0").trim(), 10,);
      //checks if the provided card amount of the data is a valid number
      if (!Number.isFinite(cardan)) {
        cardan = 0;
      }
      //if the current card to be inserted is included in the external json data, then it loads that amount instead
      if (numinfile.has(cardid)) {
        cardan = numinfile.get(cardid);
      }
      //logic for setting(inserting) the table row, including the acquired data
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
          <button onclick="addcard(parentElement.parentElement)">
            +
          </button>
        </td>

        <td id="mtgtablecell">
          <button onclick="removecard(parentElement.parentElement)">
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
      //adds the just created row to the card table
      kartentabelle.appendChild(
        tabellezeile,
      );
    });
    //updates/ retrieves the new selection progress
    getcollectionprogress();

  } catch (error) {
    console.error("Failed to load set:" + error);
    window.alert(i18next.t("failed_load"));
  }
}

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