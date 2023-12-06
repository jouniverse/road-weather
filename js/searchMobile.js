// ROAD CAMERAS

// CAMERA DATA
// https://tie.digitraffic.fi/api/weathercam/v1/stations

// USE csv-file
import { municipality } from "./municipality_codes.js";

// FETCH DATA
async function getData() {
    const res = await fetch("https://tie.digitraffic.fi/api/weathercam/v1/stations")
    const body = await res.json()
    return body
}

// CREATE DATA VARIABLE
const data = await getData();

// CREATE GLOBAL VARIABLES URL AND IMAGE
let url;
let image = document.createElement("img");
let imgTextMobile = document.getElementById("img-text-mobile");
const imgName = document.createElement('p');
imgTextMobile.appendChild(imgName);

// DEFINE CONST cameraStationsLen 
const cameraStationsLen = Object.keys(data.features).length;

// CREATE A GLOBAL VARIABLE FOR THE CAMERA STATIONS (IDS AND NAMES)
let cameraStation = {
    id: [],
    name: []
}
// GET THE IDS AND NAMES FROM THE JSON
for (let i = 0; i < cameraStationsLen; i++) {
    cameraStation.id.push(data.features[i].id)
    cameraStation.name.push(data.features[i].properties.name)
}

// GET ALL THE IMAGES AND URLS 
function getImages(stations)
{
     // CHECK THE MUNICIPALITY
    // FIND A STRICT MUNICIPALITY CODE MATCH:
    // Municipalities 2023 - https://www.stat.fi/en/luokitukset/kunta/
    // JSON - https://data.stat.fi/api/classifications/v2/classifications/kunta_1_20230101/classificationItems?content=data&meta=max&lang=en&format=json
    let municipality_code;
    for (let i = 0; i < municipality.name.length; i++) {
        if (input.value.toLowerCase() === municipality.name[i].toLowerCase())
        {
            municipality_code = municipality.code[i];
        }
    }

    let img = {
        url: [],
        name: [],
        roadName: [],
        municipality: [],
        province: []
    }

    for (let i = 0; i < stations.length; i++)
    {
        if (municipality_code)
        {
            if (stations[i].properties.municipalityCode == municipality_code)
            {
                for (let j = 0; j < Object.keys(stations[i].properties.presets).length; j++) {
                    // SOME OF THE NAMES ARE UNDEFINED OR NULL ??
                    if(!(typeof stations[i].properties.presets[j].presentationName === "undefined" || stations[i].properties.presets[j].presentationName === null)) {
                            img.url.push(stations[i].properties.presets[j].imageUrl);
                            // CHANGE NAMES TO LOWERCASE
                            img.name.push(stations[i].properties.presets[j].presentationName.toLowerCase());
                        }
                    img.roadName.push(stations[i].properties.name);
                    img.municipality.push(stations[i].properties.municipality);
                    img.province.push(stations[i].properties.province);
                }
            }
        }
        else {
            if (stations[i].properties.municipality.toLowerCase().includes(input.value.toLowerCase()))
            {
                for (let j = 0; j < Object.keys(stations[i].properties.presets).length; j++) {
                    // SOME OF THE NAMES ARE UNDEFINED OR NULL ??
                    if(!(typeof stations[i].properties.presets[j].presentationName === "undefined" || stations[i].properties.presets[j].presentationName === null)) {
                            img.url.push(stations[i].properties.presets[j].imageUrl);
                            // CHANGE NAMES TO LOWERCASE
                            img.name.push(stations[i].properties.presets[j].presentationName.toLowerCase());
                        }
                    img.roadName.push(stations[i].properties.name);
                    img.municipality.push(stations[i].properties.municipality);
                    img.province.push(stations[i].properties.province);
                }
            }
        }
    }
    return img;
}

// GET INPUT, SEARCH AND RANDOM BUTTONS
const input = document.getElementById("search-box");
const button = document.getElementById("search-button");
const randomBtn =  document.getElementById("random-button");

// CHECK IF ENTER IS PRESSED
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter')
    {
        clearButtons();
        createButtons();
    }
})

// CHECK IF THE SEARCH BUTTON IS CLICKED
button.addEventListener('click', () => {
    clearButtons();
    createButtons();
});

// CHECK IF THE RANDOM BUTTON IS PRESSED
randomBtn.addEventListener('click', () => {
    clearButtons();
    addRandomImg();
});

// ADD A RANDOM CAMERA IMAGE
async function addRandomImg()
{   
    clearImg();
    let randomImg =
    {
        url: [],
        name: [],
        roadName: [],
        municipality: [],
        province: []
    }
    // CREATE A RANDOM NUMBER
    let randomStationId  = Math.floor(Math.random()*(cameraStationsLen));
    let stationData = [];
    let id = cameraStation.id[randomStationId]
    const res = await fetch("https://tie.digitraffic.fi/api/weathercam/v1/stations/" + id)
    const stationBody = await res.json()

    stationData.push(stationBody)  

    randomImg.url.push(stationData[0].properties.presets[0].imageUrl)
    image.src = randomImg.url[0];
    randomImg.name.push(stationData[0].properties.presets[0].presentationName)
    randomImg.roadName.push(stationData[0].properties.name)
    randomImg.municipality.push(stationData[0].properties.municipality)
    randomImg.province.push(stationData[0].properties.province)

    image.style.display = "inline-block";
    let addedImage = document.getElementById("image-mobile");
    addedImage.appendChild(image);
    imgName.innerHTML = "<p>" + randomImg.municipality[0] + ", " + randomImg.province[0] + "</p><p>" + randomImg.roadName[0] + "</p><p>" + randomImg.name[0] + "</p>";
    imgTextMobile.style.opacity = 0.5;

    // CLEAR THE INPUT BOX IF IT HAS INPUT  
    if (input.value != "")
    {
        input.value = "";
    }
}

// FIND THE IDS OF THE CAMERA STATIONS
function findIds() {
    let stationId = []
    for (let i = 0; i < cameraStationsLen; i++) {
        if (cameraStation.name[i]) {
            let stationName = cameraStation.name[i].toLowerCase();
            if(stationName.includes(input.value.toLowerCase())) {
                stationId.push(cameraStation.id[i])
        }
       }
    }
    return stationId
}

// FIND MATCHES
async function findMatches()
{
    let matches = {
        url: [],
        name: [],
        roadName: [],
        municipality: [],
        province: []
    }
    // FIND THE IDS OF THE CAMERA STATIONS THAT MATCH THE INPUT
    let matchedIds = findIds();
    let stationData = [];
    for (let j = 0; j <  matchedIds.length; j++) {
        let id = matchedIds[j]
        const res = await fetch("https://tie.digitraffic.fi/api/weathercam/v1/stations/" + id)
        const stationBody = await res.json()
        stationData.push(stationBody)
    }
    let imgs = getImages(stationData);
    let namesLen = Object.keys(imgs.name).length;
    for (let k = 0; k < namesLen; k++) {
        matches.url.push(imgs.url[k]);
        matches.name.push(imgs.name[k]);
        matches.roadName.push(imgs.roadName[k]);
        matches.municipality.push(imgs.municipality[k]);
        matches.province.push(imgs.province[k]);
    }
    return matches;
}

// CLEAR BUTTONS
function clearButtons()
{
    let btns = document.getElementById("buttons");
    btns.innerHTML = "";
    imgTextMobile.style.opacity = 0;
}

// CLEAR ROAD CAMERA IMAGE
function clearImg()
{
    image.style.display = "none";
    imgTextMobile.style.opacity = 0;
}

// CREATE BUTTTONS FOR SELECTING A CAMERA
async function createButtons()
{
    if (window.innerWidth < 768) {
        clearImg();
        let btns = document.getElementById("buttons");
        let foundThese = await findMatches();
        for (let i = 0; i < Object.keys(foundThese.name).length; i++) {
            const imgLabel = "<p>" + foundThese.municipality[i] + ", " + foundThese.province[i] + "</p><p>" + foundThese.roadName[i] + "</p><p>" + foundThese.name[i] + "</p>";
            const buttonText = "<p>" + foundThese.roadName[i] + "</p><p>" + foundThese.name[i] + "</p>";
    
            const link = foundThese.url[i];

            let matchButton = document.createElement("button");
            matchButton.id = "btn-" + i;
            matchButton.classList = "cameraLocations";
            matchButton.innerHTML = buttonText; 
            btns.appendChild(matchButton);
    
            matchButton.addEventListener("click", (e) => {
                image.style.display = "inline-block";
                url = link;
                image.src = url;
                let addedImage = document.getElementById("image-mobile");
                addedImage.appendChild(image);
                imgName.innerHTML = imgLabel; 
                imgTextMobile.style.opacity = 0.5;
            });
        }
    }
}
