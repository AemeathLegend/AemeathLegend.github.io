CreatorKeyCodePress = [["1","8","5","3"]];
CreatorKeyNumberArray = [];
CreatorKeyPressCount = [-2,0];
let CreatorMode = JSON.parse(sessionStorage.getItem("CreatorMode")) || [false, false];

document.addEventListener('DOMContentLoaded', () => {
    const packSelect = document.getElementById('packselection');
    const backButton = document.getElementById('ZCGPackSimulatorback');
    const openPackButton = document.getElementById('openpackbutton');
    const backgroundselector = document.getElementById('backgroundselection');
    const backgroundselectorCr = document.getElementById('backgroundselectionCr');
    backgroundselectorCr.addEventListener('change', backgroundchangepacksim);
    backgroundselector.addEventListener('change', backgroundchangepacksim);
    packSelect.addEventListener('change', packimagechange);

    backButton.addEventListener('click', () => {
        console.log("Back button clicked");
    });

    openPackButton.addEventListener('click', () => {
        console.log("Open pack button clicked");
    });

    updateview();
});

function updateview()
{
    const backgroundselector = document.getElementById('backgroundselection');
    const backgroundselectorCr = document.getElementById('backgroundselectionCr');
    if(CreatorMode[1]===false)
    {
        backgroundselector.style.visibility = "visible";
        backgroundselectorCr.style.visibility = "hidden";
    }
    else
    {
        backgroundselector.style.visibility = "hidden";
        backgroundselectorCr.style.visibility = "visible";
    }
}

document.addEventListener("keydown", function(event) {

    if (CreatorKeyPressCount[0] === -2) 
    {
        if (event.key === "c") 
        {
            CreatorKeyPressCount[0] = -1;
            CreatorMode = [false, false];
            CreatorKeyNumberArray = [];
        }
    }
    else if (CreatorKeyPressCount[0] === -1) 
    {
        if (!"0123456789+".includes(event.key)) 
        {
            CreatorKeyPressCount[0] = -2;
            CreatorMode = [false, false];
        }
        else if (event.key === "+") 
        {
            if (CreatorKeyNumberArray[0] === "0" && CreatorKeyNumberArray.length === 1) 
            {
                CreatorKeyPressCount = [0, 0];
            }
        }
        else if (event.key === "Enter") 
        {
            CreatorKeyPressCount[0] = -2;
            CreatorMode = [false, false];
        }
        else 
        {
            CreatorKeyNumberArray.push(event.key);
        }
    }
    else 
    {
        if (CreatorKeyCodePress[CreatorKeyPressCount[0]] && CreatorKeyCodePress[CreatorKeyPressCount[0]][CreatorKeyPressCount[1]] === event.key)
            {
            CreatorKeyPressCount[1] += 1;
            if (CreatorKeyPressCount[1] >= CreatorKeyCodePress[CreatorKeyPressCount[0]].length) 
            {
                if (CreatorKeyPressCount[0] === 0) 
                {
                    CreatorMode[1] = true;
                    updateview();
                }
                CreatorKeyPressCount[1] = 0;
            }
        }
    }
});

i18next
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: "en",
    debug: false,
    resources: 
    {
      en: 
      {
        translation: 
        {
          title: "Trading Card Game Collection Tracker",
          choose_set: "Choose a Set",
          progress: "Progress",
          total_cards: "Total Collected Cards from this Set",
          save_json: "Save JSON",
          collector_number: "Collector #",
          card_name: "Card Name",
          amount: "Amount",
          set: "Set",
          negative_cards: "You can't have negative amounts of owned cards",
          failed_load: "Failed to load card lists from the website"
        }
      },
      de: {
        translation: {
          title: "Trading Card Spiel Sammlungs-Tracker",
          choose_set: "Set auswählen",
          progress: "Fortschritt",
          total_cards: "Gesammelte Karten aus diesem Set",
          save_json: "JSON speichern",
          collector_number: "Sammler #",
          card_name: "Kartenname",
          amount: "Anzahl",
          set: "Set",
          negative_cards: "Du kannst keine negative Anzahl an Karten besitzen",
          failed_load: "Kartendaten konnten nicht geladen werden"
        }
      }
    }
  }, () => 
{
    updateContent();
    updateHtmlLang();
});

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = i18next.t(key);
  });
}

function changeLanguage(lang) {
  i18next.changeLanguage(lang, () => {
    updateContent();
    updateHtmlLang();
    getcollectionprogress();
  });
}

function updateHtmlLang() {
  document.documentElement.lang = i18next.language;
}

let rarityDict = {};
let packcontent = [];//variable for the packsimulator to know wich raritys are left
const rarityIdMap =
{
    1:"Common",
    2:"CommonCA",
    3:"CommonFA",
    4:"CommonOA",
    5:"CommonFACA",
    6:"Uncommon",
    7:"UncommonCA",
    8:"UncommonFA",
    9:"UncommonOA",
    10:"UncommonFACA",
    11:"Rare",
    12:"RareCA",
    13:"RareFA",
    14:"RareOA",
    15:"RareFACA",
    16:"Epic",
    17:"EpicCA",
    18:"EpicFA",
    19:"EpicOA",
    20:"EpicFACA",
    21:"Legendary",
    22:"LegendaryCA",
    23:"LegendaryFA",
    24:"LegendaryOA",
    25:"LegendaryFACA",
    26:"Zalan",
    27:"ZalanCA",
    28:"ZalanFA",
    29:"ZalanOA",
    30:"ZalanFACA",
    31:"Promo",
    32:"LimitedCard",
    33:"PromoFA",
    34:"LimitedPromo",
    35:"CustomCard",
    36:"Mythic Rare",
    37:"Serialized",
    38:"TwoColorLand",
    39:"BasicLand",
    40:"BasicLandFullArt",
    41:"CommonE",
    42:"UncommonE",
    43:"RareE",
    44:"Mythic RareE",
    45:"CommonShowcase",
    46:"UncommonShowcase",
    47:"RareShowcase",
    48:"Mythic RareShowcase",
    49:"CommonScene",
    50:"UncommonScene",
    51:"RareScene",
    52:"Mythic RareScene"
};

/**
 * Method for increasing the number of amount in the table for the card,
 * where the button with + was clicked. uses the parentelement for it and navigates to the element with the number
 */
function addcard(parentelementtemp)
{
    try {
        let secondparent = parentelementtemp.parentElement;
        document.getElementById(secondparent.id).children[2].innerHTML = String(parseInt(document.getElementById(secondparent.id).children[2].innerHTML) + 1);
        getcollectionprogress();
    }
    catch
    {
        window.alert("failed to add card to the count of your cards")
    }
}

/**
 * Method for decreasing the number of amount in the table for the card,
 * where the button with - was clicked. uses the parentelement for it and navigates to the element with the number.
 * does not decrease amount when amount is already 0 and sends an info instead.
 */
function removecard(parentelementtemp) {
    try
    {
        let secondparent = parentelementtemp.parentElement;
        if (parseInt(document.getElementById(secondparent.id).children[2].innerHTML)>0)
        {
            document.getElementById(secondparent.id).children[2].innerHTML = String(parseInt(document.getElementById(secondparent.id).children[2].innerHTML) - 1);
            getcollectionprogress();
        }
        else
        {
            window.alert("You can't have negative amount's of owned cards");
        }
    }
    catch
    {
        window.alert("failed to remove card from the count of your cards")
    }
}

/**
 * method for getting elements(data of cards) and return a table to work with
 */
function getdata()
{
    try
    {
        const rowcoll = document.querySelectorAll("#mtgcardlist tbody tr");//gets every row and gets every children of the rows and puts them into a array as object
        const jsonStr = [];
        rowcoll.forEach(row =>{
            const tabledatainhalt = row.querySelectorAll("td");
            jsonStr.push({
                nummer:tabledatainhalt[0].textContent,
                name:tabledatainhalt[1].textContent,
                anzahl:parseInt(tabledatainhalt[2].textContent),
                setcode:tabledatainhalt[3].textContent,
                bildlink: tabledatainhalt[6].children[0].children[0].children[0].getAttribute("src")
            });
        });
        return jsonStr;
    }
    catch
    {
        window.alert("failed to to get data from your collection while reading data")
    }
}

/**
 * Gets collection progress by getting all rows and gets their amountvalues to track progress
 */
function getcollectionprogress()
{
    try
    {
        let cardsmax = 0;
        let yourcollectedcards = 0;
        let yourtotalcollectedcards = 0;
        const datagettemp = document.querySelectorAll('#mtgcardlist tbody tr');
        datagettemp.forEach(row =>{
            cardsmax = cardsmax+1;
            const tablecellcontent = row.querySelectorAll('td');
            if(parseInt(tablecellcontent[2].textContent)>0)
            {
                yourcollectedcards = yourcollectedcards+1;
            }
            yourtotalcollectedcards = yourtotalcollectedcards+parseInt(tablecellcontent[2].textContent);
        })
        if(yourcollectedcards!=0)
        {
            let percentatefromcollection = yourcollectedcards/cardsmax*100
            document.getElementById('ProgressCollection').innerText =i18next.t("progress") + ": " + percentatefromcollection.toFixed(2) + "%";
        }
        else
        {
            document.getElementById('ProgressCollection').innerText =i18next.t("progress") + ": 0%";
        }
        if(yourtotalcollectedcards!=0)
        {
            document.getElementById('totalcardsinthisset').innerText =i18next.t("total_cards") + ": " + yourtotalcollectedcards;
        }
        else
        {
            document.getElementById('totalcardsinthisset').innerText =i18next.t("total_cards") + ": 0";
        }
    }
    catch
    {
        window.alert("failed to to get calculate the progress of your collection according to the table with your inputs")
    }
}

/**
 * saves the cardcontent from the tables as jsonfile.
 */
function saveasfile()
{
    try
    {
        const cards = getdata();//calls method getdata from line 91 to get all cards as objects
        const jsonString = JSON.stringify(cards, null, 2)//converts the object array into json string
        const blob = new Blob([jsonString], {type:'application/json'});//creates a usable element(blob) with the string from aplication and uses it for next steps until download
        const url = URL.createObjectURL(blob);
        const output = document.createElement("a");
        output.href = url;
        output.download = document.getElementById('setsselection').value.substring(10,document.getElementById('setsselection').value.length-5) +"fromCardGamesCollectedCards.json";
        document.body.appendChild(output);
        output.click();
        document.body.removeChild(output);
        URL.revokeObjectURL(url);
    }
    catch
    {
        window.alert("failed to save the collection data as a file for later use")
    }
}

/**
 * Method for loading collected cards from uploaded json file or normal set file and adding missing cards from json from the same set
 */
async function getasfile()
{
    try
    {
        const elementtemp = document.getElementById("getbutton");
        let fileglobal = elementtemp.files[0];
        if(fileglobal==null)
        {
            fileglobal = new File(["emty"], "emptyselect.json", { type: "application/json" });
        }
        let numinfile =[];
        let reader = new FileReader();
        const kartentabelle = document.getElementById('mtgcardlist').querySelector('tbody');
        reader.onload = function (eventt) {
            try {
                if(eventt.target.result!="empty")
                {
                    const data = JSON.parse(eventt.target.result);
                    kartentabelle.innerHTML = "";
                    data.forEach(card => {
                        let id = card.nummer;
                        let an = card.anzahl;
                        numinfile.push({
                            nummer:id,
                            anzahl:an
                        });
                    });
                }
            }
            catch
            {
                console.log("no file selected");
            }
        }
        reader.readAsText(fileglobal);
        fetch(document.getElementById('setsselection').value)
            .then(response => response.json())
            .then(daten => {
                const kartentabelle = document.getElementById('mtgcardlist').querySelector('tbody');
                kartentabelle.innerHTML = "";
                daten.forEach(card => {
                    let idtwo = card.nummer;
                    let isinlist = false;
                    let cardid;
                    let cardan;
                    numinfile.forEach(idandan=>{
                        if(idandan.nummer==idtwo)
                        {
                            isinlist = true;
                            cardid=idandan.nummer;
                            cardan=idandan.anzahl;
                        }
                    })
                    const tabellezeile = document.createElement('tr');
                    if(isinlist==true)
                    {
                        tabellezeile.id = `karte${cardid}`;
                        tabellezeile.innerHTML = `
                            <td id="mtgtablecell">${cardid}</td>
                            <td id="mtgtablecell">${card.name}</td>
                            <td id="mtgtablecell">${cardan}</td>
                            <td id="mtgtablecell">${card.setcode}</td>
                            <td id="mtgtablecell"><button onclick="addcard(parentElement)">+</button></td>
                            <td id="mtgtablecell"><button onclick="removecard(parentElement)">-</button></td>
                            <td id="mtgtablecell">
                            <div class="tooltip">&#128065
                            <span class="tooltiptext"><img src="${card.bildlink}" alt="failed to Load Image" id="imagecard"></span>
                            </div>
                            </td>
                        `;
                    }
                    else
                    {
                        tabellezeile.id = `karte${card.nummer}`;
                        tabellezeile.innerHTML = `
                            <td id="mtgtablecell">${card.nummer}</td>
                            <td id="mtgtablecell">${card.name}</td>
                            <td id="mtgtablecell">${card.anzahl}</td>
                            <td id="mtgtablecell">${card.setcode}</td>
                            <td id="mtgtablecell"><button onclick="addcard(parentElement)">+</button></td>
                            <td id="mtgtablecell"><button onclick="removecard(parentElement)">-</button></td>
                            <td id="mtgtablecell">
                            <div class="tooltip">&#128065
                            <span class="tooltiptext"><img src="${card.bildlink}" alt="failed to Load Image" id="imagecard"></span>
                            </div>
                            </td>
                        `;
                    }
                    kartentabelle.appendChild(tabellezeile);
                });
            })
        await delay(250);
        getcollectionprogress();
    }
    catch
    {
            window.alert("failed to get the data of File, if you have uploaded a file,\nplease check if your File is correct and has the right Name.")
    }
}

function openpacksimulator()
{
    sessionStorage.setItem("CreatorMode", JSON.stringify(CreatorMode));
    window.location.href = '../packsimulator.html';
}

function backtomainmenu()
{
    sessionStorage.setItem("CreatorMode", JSON.stringify(CreatorMode));
    window.location.href = '../index.html';
}

const backgroundimg = {
    "galaxy": "./sidedata/cardimages/assetssim/backgrounds/Galaxy.avif",
    "ayaka": "./sidedata/cardimages/assetssim/backgrounds/QueenAyaka.avif",
    "magic_portal": "./sidedata/cardimages/assetssim/backgrounds/MagicPortal.avif",
    "nyx":"./sidedata/cardimages/assetssim/backgrounds/NyxWallpaper.avif"
};

async function backgroundchangepacksim()
{
    let packbackselect = document.getElementById('backgroundselection');
    if(CreatorMode[1]==true)
    {
        packbackselect = document.getElementById('backgroundselectionCr');
    }
    else
    {
        packbackselect = document.getElementById('backgroundselection');
    }
    const background = document.getElementById('background');
    const selectedValue = packbackselect.value;
    background.style.backgroundImage = `url('${backgroundimg[selectedValue] || "./sidedata/cardimages/assetssim/backgrounds/Galaxy.avif"}')`;
}

const packImages = {
    "m20pack.json": "./sidedata/cardimages/assetssim/packs/m20pack.png",
    "ltrDraftBooster":"./sidedata/cardimages/assetssim/packs/m20pack.png",
    "finDraftBooster": "./sidedata/cardimages/assetssim/packs/Final_Fantasy.png",
    "ltrDraftBooster": "./sidedata/cardimages/assetssim/packs/Lord_Of_The_Rings.png",
    "theLastDanceZCG": "./sidedata/cardimages/assetssim/packs/derletztetanz.png"
};

/**
* sets the image of the pack to the image of the current selected set for the pack
*/
async function packimagechange()
{
    const packSelect = document.getElementById('packselection');
    const packImage = document.getElementById('packimage');
    packcontent = [];
    await loadCards();
    const selectedValue = packSelect.value;
    packImage.src = packImages[selectedValue] || "./sidedata/cardimages/assetssim/packs/m20pack.png";
}


async function loadCards()
{
    const response = await fetch("./sidedata/filecheck.json");
    const data = await response.json();
    rarityDict = {};
    for (const element of data) 
    {
        console.log(document.getElementById('packselection').value);
        for (const packAppearenceListElement of element.packtype) 
        {
            console.log(packAppearenceListElement);
            if (packAppearenceListElement == document.getElementById('packselection').value) 
            {
                await getSetWithPath(element.filepath);
            }
        }
    }
}

async function getSetWithPath(filePath)
{
    const response2 = await fetch(filePath);
    const daten = await response2.json();
    daten.forEach(card =>
    {
        console.log("reached");
        if(!rarityDict[card.rarityname])
        {
            rarityDict[card.rarityname] = [];
        }
        rarityDict[card.rarityname].push(card);
    });
}

/**
 * method for opening the pack or loading the next card in pack according to packcontent
 */
async function openpack()
{
    if(packcontent.length == 0)
    {
        await loadCards();
        packcontent = await openpackfill();
    }
    else
    {
        const rarityId = packcontent[0];
        const rarityName = rarityIdMap[rarityId];
        const cardList = rarityDict[rarityName];
        if(!cardList || cardList.length === 0)
        {
            console.log("No cards for rarity:", rarityName);
            return;
        }
        const randcard = Math.floor(Math.random()*cardList.length);
        const img = document.getElementById("packimage");
        img.src = cardList[randcard].bildlink;
        packcontent.shift();
    }
}

/**
 * method for filling the packcontent list of the pack with values.
 * uses the selfmadefunctions setchancelist and calculatechance for this, as well as checkset for cheking combined packlists
 */
async function openpackfill()
{
    packimagechange();
    let chancelist = [];
    let endrewards = [];
    const dataCheck = await checkSet();
    if(dataCheck[0]=="finDraftBooster"&&dataCheck[1]=="MTG")
    {
        chancelist=setchancelist([10000,3675,700],[11,36,1/*last 33 placeholder for rest1*/]);
        endrewards.push(1,1,1,1,1,1);
        if(Math.floor(Math.random()*100000)<=33333)
        {
            chancelist=setchancelist([10000,3675,700],[6,11,36]);
            for(const result of calculateChance(1,chancelist,4))
            {
                endrewards.push(result);
            }
        }
        else
        {
            endrewards.push(6);
        }
        endrewards.push(6,6,6);
        chancelist=setchancelist([1000,833,250,224,167,55],[1,6,1,6,11,36]);
        for(const result of calculateChance(1,chancelist,3))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([1000,200,100,20,10,5],[11,36,11,36,11,36]);
        for(const result of calculateChance(1,chancelist,3))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([10000,4425,835,285,210,200,150,50,25],[1,6,11,36,1,6,11,36,1/*last 33 = placeholder for rest2*/]);
        for(const result of calculateChance(1,chancelist,4))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([100,45],[38,39]);
        for(const result of calculateChance(1,chancelist,2))
        {
            endrewards.push(result);
        }
    }
    if(dataCheck[0]=="theLastDanceZCG"&&dataCheck[1]=="ZCG")
    {
        chancelist=setchancelist([10000,3000,1200,400,100],[1,2,3,4,5]);
        for(const result of calculateChance(6, chancelist, 4))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([1000000, 257141, 114285, 42857, 14286,428568, 110203, 48979, 18367, 6122],[1,2,3,4,5,6,7,8,9,10]);
        for(const result of calculateChance(1, chancelist, 6))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([10000,3000,1200,400,100],[6,7,8,9,10]);
        for(const result of calculateChance(4, chancelist, 4))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([10000,3000,1200,400,100],[11,12,13,14,15]);
        for(const result of calculateChance(2, chancelist, 4))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([1000000, 257121, 114306, 42857, 14286,111111, 28572, 12698, 4762, 1587],[11,12,13,14,15, 21,22,23,24,25]);
        for(const result of calculateChance(1, chancelist, 6))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([1000000, 257259, 114330, 42864, 14277,20400, 5256, 2337, 875, 292,146],[16,17,16/*original epicFA*/,19,20,26,27,28,27/*original ZalanOA chance*/,28/*original ZalanFACA*/,32]);
        for(const result of calculateChance(1, chancelist, 6))
        {
            endrewards.push(result);
        }
    }
    if(dataCheck[0]=="ltrDraftBooster"&&dataCheck[1]=="MTG")
    {
        endrewards.push(1,1,1,1,1,1,1,1,1,1);
        endrewards.push(6,6,6);
        chancelist=setchancelist([100,5],[11,36]);
        for(const result of calculateChance(1, chancelist, 2))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([10000,3414,1371,686],[46,46,47,48]);
        for(const result of calculateChance(1, chancelist, 4))
        {
            endrewards.push(result);
        }
    }
    endrewards.sort((b, a) => b - a);
    return endrewards;
}

/**
 * method for returning the details of the currently selected set as an array with both values
 */
async function checkSet()
{
    let setCol = [];
    let packSimpleName = document.getElementById("packselection").value
    const response = await fetch("./sidedata/filecheck.json");
    const daten = await response.json();
    for(const setData of daten)
    {
        for(const packTypeListElement of setData.packtype)
        {
            if(packTypeListElement==packSimpleName)
            {
                setCol = [packTypeListElement,setData.game]
            }
        }
    }
    return setCol;
}

/**
 * 
 */
function setchancelist(rewardchancearray,idofreward)
{
    let chanceamount = rewardchancearray.length;
    let arrayofchances=[];
    for(let i=0;i<chanceamount;i++)
    {
        arrayofchances.push({
            rewardchance:rewardchancearray[i],
            rewardid:idofreward[i]
            })
    }
    return arrayofchances;
    
}

function calculateChance(count, chances, scalein10) {
    let results = [];
    const max = 10 ** scalein10;
    chances.sort((a, b) => a.rewardchance - b.rewardchance);
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * max);
        for (const chanceitem of chances) {
            if (roll <= chanceitem.rewardchance) 
            {
                results.push(chanceitem.rewardid);
                break;
            }
        }
    }
    return results;
}

/**
 * Method for delaying async methods and for awaiting results of actions and tasks
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * fills the packcontent list with the ids of the raritys for the picking in cardslist using 2 methods forfast cardgame adding and editing
 */

/*
12 pixel abstand scene cards plus 8 pixel breite strichlinie
35% quality on avif-export for MTG
50% quality on avif-export for ZCG
 */


