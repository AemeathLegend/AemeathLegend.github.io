CreatorModeEncyrpted = "e4VwIR0045OoQ5uKg6lZVvMcYb3VrqAR6EUogMSBBvzZTgIg3P0=";
CreatorcodeEncrypted2 = "ky/b4phOl3GsQqoMA/LToixnwu9xrnix9zyjtSEFoLrBCOX8";
let CreatorMode = JSON.parse(sessionStorage.getItem("CreatorMode")) || false;
let imageBack = JSON.parse(sessionStorage.getItem("imageBack")) || "galaxy";
let languagesave = JSON.parse(sessionStorage.getItem("selectedLang")) || "en";
const backgroundimg = {
    "galaxy": "./sidedata/cardimages/assetssim/backgrounds/Galaxy.avif",
    "ayaka": "./sidedata/cardimages/assetssim/backgrounds/QueenAyaka.avif",
    "magic_portal": "./sidedata/cardimages/assetssim/backgrounds/MagicPortal.avif",
    "nyx":"./sidedata/cardimages/assetssim/backgrounds/NyxWallpaper.avif"
};

document.addEventListener('DOMContentLoaded', () => {
    const packSelect = document.getElementById('packselection');
    const backButton = document.getElementById('ZCGPackSimulatorback');
    const openPackButton = document.getElementById('openpackbutton');
    const backgroundselector = document.getElementById('backgroundselection');
    backgroundselector.addEventListener('change', backgroundchangepacksim);
    packSelect.addEventListener('change', packimagechange);
    backButton.addEventListener('click', () => {
        console.log("Back button clicked");
    });

    openPackButton.addEventListener('click', () => {
        console.log("Open pack button clicked");
    });
    changeLanguage();
    updateview();
});

async function getKey(password) 
{
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("some-fixed-salt"),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptAccessCode(accessCode, password) 
{
    const key = await getKey(password);
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(accessCode)
    );
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
}

async function decryptAccessCode(encryptedText, password) 
{
    const key = await getKey(password);
    const data = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encrypted
    );
    return new TextDecoder().decode(decrypted);
}



function updateview()
{
    const creatorOptions = ["ayaka", "nyx"];
    const select = document.getElementById("backgroundselection");
    const creatorGroup = document.getElementById("creatorGroup");
    for (let option of select.options) 
    {
        if (creatorOptions.includes(option.value)) 
        {
            option.hidden = CreatorMode;
            if (option.hidden && option.selected) 
            {
                select.value = "galaxy";
            }
        }
    }
    creatorGroup.style.display = !CreatorMode ? "block" : "none";
    background.style.backgroundImage = `url('${backgroundimg[imageBack] || "./sidedata/cardimages/assetssim/backgrounds/Galaxy.avif"}')`;
}
document.addEventListener("keydown", async function(event)
{
    if (event.key === "c") 
    {
        try 
        {
            const password = prompt("Enter Password:");
            const resultingText = await decryptAccessCode(CreatorModeEncyrpted, password);
            const result = prompt("Enter Result:");
            if (resultingText === result) 
            {
                try 
                {
                    const password = prompt("Enter Password:");
                    const resultingText = await decryptAccessCode(CreatorcodeEncrypted2, password);
                    const result = prompt("Enter Result:");
                    if (resultingText === result) 
                    {
                        sessionStorage.setItem("CreatorMode", JSON.stringify(CreatorMode));
                        CreatorMode = true;
                        updateview();

                    } 
                    else 
                    {
                        CreatorMode = false;
                        window.alert(`
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
                        And guard your tongue… or soon be dead.`);
                    }
                } 
                catch (err)
                {
                    console.error("Decryption failed:", err);
                    CreatorMode = false;
                }
            } 
            else 
            {
                CreatorMode = false;
                window.alert(`
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
                And guard your tongue… or soon be dead.`);
            }
        } 
        catch (err)
        {
            console.error("Decryption failed:", err);
            CreatorMode = false;
        }
    }
})

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
          failed_load: "Failed to load card lists from the website",
          thelastdancepack:"The last Dance",
          magicportalpackback:"Magic Portal",
          goddessnyxpackback:"Goddess Nyx",
          packblessingpacksim:"May you have the best of Luck! To an explosive pack..."
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
          failed_load: "Kartendaten konnten nicht geladen werden",
          thelastdancepack:"Der letzte Tanz",
          magicportalpackback:"Magisches Portal",
          goddessnyxpackback:"Göttin Nyx",
          packblessingpacksim:"Ich wünsche dir viel Glück, für einen krassen Booster..."
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

function changeLanguageInit(lang)
{
    languagesave = lang;
    sessionStorage.setItem("selectedLang", JSON.stringify(lang));
    changeLanguage();
}



function changeLanguage() {
  i18next.changeLanguage(languagesave, () => {
    updateContent();
    updateHtmlLang();
    if(window.location.href=="../index.html")
    {
        getcollectionprogress();
    }
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

async function backgroundchangepacksim()
{
    let packbackselect = document.getElementById('backgroundselection');
    const selectedValue = packbackselect.value;
    sessionStorage.setItem("imageBack", JSON.stringify(selectedValue));
    const background = document.getElementById('background');
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


