let packcontent = [];
let cardslist = [];


function loadmtgcards() {
    try
    {
        if(document.getElementById('setsselection').value !=="") {
            fetch(document.getElementById('setsselection').value)
                .then(response => response.json())
                .then(daten => {
                    const kartentabelle = document.getElementById('mtgcardlist').querySelector('tbody');
                    kartentabelle.innerHTML = "";
                    daten.forEach(card => {
                        const tabellezeile = document.createElement('tr');
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
                        kartentabelle.appendChild(tabellezeile);
                    });
                })
                .catch(error => console.error('Could not Load json because the following Error accoured:', error));
        }
    }
    catch
    {
        window.alert("failed to load cardlists from the webside")
    }

}

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


function getdata()
{
    try
    {
        const rowcoll = document.querySelectorAll("#mtgcardlist tbody tr");
        const jsonStr = [];
        rowcoll.forEach(row =>{
            const tabledatainhalt = row.querySelectorAll("td");
            jsonStr.push({
                nummer:tabledatainhalt[0].textContent,
                name:tabledatainhalt[1].textContent,
                anzahl:parseInt(tabledatainhalt[2].textContent),
                setcode:tabledatainhalt[3].textContent,
                bildlink: tabledatainhalt[6].children[0].getAttribute("src")
            });
        });
        return jsonStr;
    }
    catch
    {
        window.alert("failed to to get data from your collection while reading data")
    }
}

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
        let percentatefromcollection = yourcollectedcards/cardsmax*100
        document.getElementById('ProgressCollection').innerText='Progress = '+percentatefromcollection.toFixed(2)+'%';
        document.getElementById('totalcardsinthisset').innerText='Total Collected Cards from this Set:'+yourtotalcollectedcards;
    }
    catch
    {
        window.alert("failed to to get calculate the progress of your collection according to the table with your inputs")
    }
}

function saveasfile()
{
    try
    {
        const cards = getdata();
        const jsonString = JSON.stringify(cards, null, 2)
        const blob = new Blob([jsonString], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const output = document.createElement("a");
        output.href = url;
        output.download = document.getElementById('setsselection').value.substring(0,document.getElementById('setsselection').value.length-5) +"fromCardGamesCollectedCards.json";
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

async function getasfile()
{
    try
    {
        if(document.getElementById('getbutton').value.includes(document.getElementById('setsselection').value.substring(0,document.getElementById('setsselection').value.length-5)+"fromCardGamesCollectedCards") && document.getElementById('setsselection').value!=='') {
            const elementtemp = document.getElementById("getbutton");
            let fileglobal = elementtemp.files[0];
            let numinfile =[];
            let reader = new FileReader();
            const kartentabelle = document.getElementById('mtgcardlist').querySelector('tbody');
            reader.onload = function (eventt) {
                try {
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
                catch
                {
                    alert("something went wrong")
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
        }
        else {
        if (document.getElementById('setsselection').value !== '') {
            window.alert("please select a json File with the filename:" + document.getElementById('setsselection').value.substring(0, document.getElementById('setsselection').value.length - 5) + "fromCardGamesCollectedCards")
        } else {
            window.alert('Please Select a Set!!!')
        }
        }
        await delay(250);
        getcollectionprogress();
    }
    catch
    {
        window.alert("failed to get the data of your uploaded File, please check if your File is correct and has the right Name")
    }
}

function openpacksimulator()
{
    window.location.href = './sidedata/packsimulator.html';
}

function backtomainmenu()
{
    window.location.href = '../index.html';
}

async function openpack()
{
    if(packcontent.length==0)
    {
        packcontent=openpackfill();
    }
    else
    {
    let setforpack = document.getElementById("packselection").value;
    let cardslist = [];
    let rarity1 = [];
    let rarity2 = [];
    let rarity3 = [];
    let rarity4 = [];
    let rarity5 = [];
    let rarity6 = [];
    let rarity7 = [];
    let rarity8 = [];
    let rarity9 = [];
    let rarity10 = [];
    const response = await fetch(setforpack);
    const daten = await response.json();
    daten.forEach(card => {
            if(card.game=="MTG") {
            {
                if(card.rarityname=="BasicLand")
                {
                    rarity9.push(card);
                }
                else if(card.rarityname=="Common")
                {
                    rarity1.push(card);
                }
                else if(card.rarityname=="Uncommon")
                {
                    rarity2.push(card);
                }
                else if(card.rarityname=="Rare")
                {
                    rarity3.push(card);
                }
                else if(card.rarityname=="Mythic Rare")
                {
                    rarity4.push(card);
                }
                else if(card.rarityname=="TwoColorLand")
                {
                    rarity8.push(card);
                }
            }
        }})
        cardslist = [rarity1,rarity2,rarity3,rarity4,rarity5,rarity6,rarity7,rarity8,rarity9,rarity10];
        randcard = Math.floor(Math.random()*cardslist[packcontent[0]-1].length)
        const img = document.getElementById("packimage");
        img.src = cardslist[packcontent[0]-1][randcard].bildlink;
        packcontent = packcontent.reverse();
        packcontent.pop();
        packcontent = packcontent.reverse();
    }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function packimagechange()
{
    const img = document.getElementById("packimage");
    let textvalue = document.getElementById("packselection").value
    img.src = "./cardimages/assetssim/packs/"+textvalue.substring(0,((textvalue.length)-5))+".png"
}

function openpackfill()
{
    packimagechange();
    let setforpack = document.getElementById("packselection").value;
    let packtype;
    let chancelist = [];
    let endrewards = [];
    if(setforpack=="Final_Fantasy.json")
    {
        packtype="MTG";
        chancelist=setchancelist([10000,3675,700],[3,4,5]);
        endrewards.push(1,1,1,1,1,1);
        if(Math.floor(Math.random()*100000)<=33333)
        {
            chancelist=setchancelist([10000,3675,700],[2,3,4]);
            for(const result of calculateChance(1,chancelist,4))
            {
                endrewards.push(result);
            }
        };
        }
        else
        {
            endrewards.push(2)
        }
        endrewards.push(2,2,2);
        chancelist=setchancelist([1000,833,250,224,167,55],[1,2,1,2,3,4]);
        for(const result of calculateChance(1,chancelist,3))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([1000,200,100,20,10,5],[3,4,3,4,3,4]);
        for(const result of calculateChance(1,chancelist,3))
        {
                endrewards.push(result);
        }
        chancelist=setchancelist([10000,4425,835,285,210,200,150,50,25],[1,2,3,4,1,2,3,4,7]);
        for(const result of calculateChance(1,chancelist,4))
        {
            endrewards.push(result);
        }
        chancelist=setchancelist([100,45],[8,9]);
        for(const result of calculateChance(1,chancelist,2))
        {
            endrewards.push(result);
        }
        endrewards.sort((b, a) => b - a);
        return endrewards;
    }


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
    const results = [];
    const max = 10 ** scalein10;
    chances.sort((a, b) => a.rewardchance - b.rewardchance);
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * max);
        for (const chanceitem of chances) {
            if (roll < chanceitem.rewardchance) {
                results.push(chanceitem.rewardid);
                break;
            }
        }
    }
    return results;
}

function startlogin() 
{
    window.location.href = './loginwindow.html';
}


async function loginuser() {
    const form = document.getElementById('login');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;
    try {
        const response = await fetch('http://127.0.0.1:8009/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response;
        if (data.ok) {
            window.location.href = './index.html';
        } else if (data.message === 'Falsches Passwort') {
            alert('Wrong password, please try again.');
        } else {
            window.location.href = './registeruser.html';
        }
    } catch (err) {
        alert('Fehler: ' + err);
    }
}

async function registeruser() {
    const form = document.getElementById('register');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;

    try {
        const response = await fetch('http://127.0.0.1:8009/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response;
        if (!data.ok && data.message === 'Doppelter Name') {
            alert('This username is already chosen, please pick a different one.');
        } else if (data.ok) {
            window.location.href = './index.html';
        } else {
            alert('Fehler: ' + data.message);
        }
    } catch (err) {
        alert('Netzwerk-/Serverfehler: ' + err);
    }
}

/*
12 pixel abstand scene cards
 */


