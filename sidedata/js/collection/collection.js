export let currentSet = "";

export function setCurrentSet(
  value,
) {
  currentSet = value;
}

export function addcard(
  parentelementtemp,
) {
  try {
    const secondparent =
      parentelementtemp.parentElement;

    const amountElement =
      document.getElementById(
        secondparent.id,
      ).children[2];

    amountElement.innerHTML =
      String(
        parseInt(
          amountElement.innerHTML,
        ) + 1,
      );

    getcollectionprogress();
  } catch {
    window.alert(
      "failed to add card to the count of your cards",
    );
  }
}

export function removecard(
  parentelementtemp,
) {
  try {
    const secondparent =
      parentelementtemp.parentElement;

    const amountElement =
      document.getElementById(
        secondparent.id,
      ).children[2];

    const amount = parseInt(
      amountElement.innerHTML,
    );

    if (amount > 0) {
      amountElement.innerHTML =
        String(amount - 1);

      getcollectionprogress();
    } else {
      window.alert(
        i18next.t("negative_cards"),
      );
    }
  } catch {
    window.alert(
      "failed to remove card from the count of your cards",
    );
  }
}

export function getdata() {
  try {
    const rowcoll =
      document.querySelectorAll(
        "#mtgcardlist tbody tr",
      );

    const jsonStr = [];

    rowcoll.forEach((row) => {
      const tabledatainhalt =
        row.querySelectorAll("td");

      jsonStr.push({
        nummer:tabledatainhalt[0].textContent,
        name:tabledatainhalt[1].textContent,
        anzahl:parseInt(tabledatainhalt[2].textContent,),
        setcode:tabledatainhalt[3].textContent,
        bildlink:tabledatainhalt[6].children[0].children[0].children[0].getAttribute("src"),
      });
    });

    return jsonStr;
  } catch {
    window.alert(
      "failed to get data from your collection while reading data",
    );

    return [];
  }
}

export function getcollectionprogress() {
  try {
    let cardsmax = 0;

    let yourcollectedcards = 0;

    let yourtotalcollectedcards = 0;

    const datagettemp =
      document.querySelectorAll(
        "#mtgcardlist tbody tr",
      );

    datagettemp.forEach((row) => {
      cardsmax++;

      const tablecellcontent =
        row.querySelectorAll("td");

      const amount =
        parseInt(
          tablecellcontent[2]
            .textContent,
        );

      if (amount > 0) {
        yourcollectedcards++;
      }

      yourtotalcollectedcards +=
        amount;
    });

    const progressElement =
      document.getElementById(
        "ProgressCollection",
      );

    const totalElement =
      document.getElementById(
        "totalcardsinthisset",
      );

    if (
      yourcollectedcards != 0 &&
      cardsmax > 0
    ) {
      const percentage =
        (yourcollectedcards /
          cardsmax) *
        100;

      progressElement.innerText =
        i18next.t("progress") +
        ": " +
        percentage.toFixed(2) +
        "%";
    } else {
      progressElement.innerText =
        i18next.t("progress") +
        ": 0%";
    }

    totalElement.innerText =
      i18next.t("total_cards") +
      ": " +
      yourtotalcollectedcards;
  } catch {
    window.alert(
      "failed to calculate the progress of your collection according to the table with your inputs",
    );
  }
}