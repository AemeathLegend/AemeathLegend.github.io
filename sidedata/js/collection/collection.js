export let currentSet = "";

/**
 * function for setting the current set variable
 * @param {*} value the desired set
 */
export function setCurrentSet(value) {
  currentSet = value;
}

/**
 * function for increasing the amount of a desired card in the users collection by one
 * @param {*} parentelementtemp highest parent Element(z.b. tr Element) related to a single card
 */
export function addcard(rowParentElement) {
  try {
    rowParentElement.children[2].innerHTML = String(parseInt(rowParentElement.children[2].innerHTML,) + 1);
    getcollectionprogress();
  }
  catch {
    window.alert("failed to add card to the count of your cards");
  }
}

/**
 * function for decreasing the amount of a desired card in the users collection by one
 * @param {*} rowParentElement highest parent Element(z.b. tr Element) related to a single card
 */
export function removecard(rowParentElement) {
  try {
    const amount = parseInt(rowParentElement.children[2].innerHTML);
    if (amount > 0) {
      rowParentElement.children[2].innerHTML = String(amount - 1);
      getcollectionprogress();
    }
    else {
      window.alert(i18next.t("negative_cards"));
    }
  }
  catch {
    window.alert("failed to remove card from the count of your cards",);
  }
}

/**
 * function for getting the data inside the cardTable
 * @returns json string with the acquired data
 */
export function getdata() {
  try {
    const rowcoll = document.querySelectorAll("#mtgcardlist tbody tr");
    const jsonStr = [];
    rowcoll.forEach((row) => {
      const tabledatainhalt = row.querySelectorAll("td");
      jsonStr.push({
        nummer: tabledatainhalt[0].textContent,
        name: tabledatainhalt[1].textContent,
        anzahl: parseInt(tabledatainhalt[2].textContent,),
        setcode: tabledatainhalt[3].textContent,
        bildlink: tabledatainhalt[6].children[0].children[0].children[0].getAttribute("src"),
      });
    });
    return jsonStr;
  }
  catch {
    window.alert("failed to get data from your collection while reading data");
    return [];
  }
}

/**
 * function for calculating and setting the collection progress inside the designated HTML elements
 */
export function getcollectionprogress() {
  try {
    let cardsmax = 0;
    let yourcollectedcards = 0;
    let yourtotalcollectedcards = 0;
    const datagettemp = document.querySelectorAll("#mtgcardlist tbody tr");
    datagettemp.forEach((row) => {
      cardsmax++;
      const tablecellcontent = row.querySelectorAll("td");
      const amount = parseInt(tablecellcontent[2].textContent);
      if (amount > 0) {
        yourcollectedcards++;
      }
      yourtotalcollectedcards += amount;
    });

    const progressElement = document.getElementById("ProgressCollection");
    const totalElement = document.getElementById("totalcardsinthisset");
    if (yourcollectedcards != 0 && cardsmax > 0) {
      const percentage = (yourcollectedcards / cardsmax) * 100;
      progressElement.innerText = i18next.t("progress") + ": " + percentage.toFixed(2) + "%";
    }
    else {
      progressElement.innerText = i18next.t("progress") + ": 0%";
    }
    totalElement.innerText = i18next.t("total_cards") + ": " + yourtotalcollectedcards;
  }
  catch {
    window.alert("failed to calculate the progress of your collection according to the table with your inputs");
  }
}