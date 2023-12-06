// ROAD CAMERAS

// CAMERA DATA
// https://tie.digitraffic.fi/api/weathercam/v1/stations

// USE csv-file
import { municipality } from "./municipality_codes.js";

let canvas = document.getElementById("map");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

const api_url = "https://tie.digitraffic.fi/api/weathercam/v1/stations";

// FETCH DATA
async function getData() {
    const res = await fetch(api_url)
    const body = await res.json()
    return body
}

// CREATE DATA VARIABLE
const data = await getData();

const vt = [];
for (let i = 1; i <= 29; i++) {
  vt.push("vt" + i);
}

// CREATE GLOBAL VARIABLES URL AND IMAGE
let url;
let image = document.createElement("img");
image.setAttribute("id", "image");
let imgText = document.createElement("div");
imgText.setAttribute("id", "img-text");

const cameraStationsLen = Object.keys(data.features).length;

function getImgData(cameraData) {

    let imgFeatures = {
        id: [],
        name: [],
        xCoord: [],
        yCoord: []
    }
    for (let i = 0; i < cameraStationsLen; i++)
    {
        imgFeatures.id.push(cameraData.features[i].id)
        imgFeatures.name.push(cameraData.features[i].properties.name)
        imgFeatures.xCoord.push(cameraData.features[i].geometry.coordinates[0])
        imgFeatures.yCoord.push(cameraData.features[i].geometry.coordinates[1])
    }
    return imgFeatures
}

// CREATE A GLOBAL VARIABLE FOR THE CAMERA STATIONS (IDS AND NAMES)
let imgCoords = getImgData(data);

// initialize chart data
let mapData = []
for (let i=0; i < imgCoords.xCoord.length; i++) {
    mapData.push({x:imgCoords.xCoord[i], y:imgCoords.yCoord[i]})
}

// CLEAR ROAD CAMERA IMAGE
function clearImg()
{
    if (image) {
        image.src = "";
    } 
}
    

// ADD A CAMERA IMAGE
async function addImg(id)
{   
    clearImg();

    let cameraImg =
    {
        url: [],
        name: [],
        // xcoord: [],
        // ycoord: [],
        municipality: [],
        province: []
    }

    let stationData = [];

    const res = await fetch("https://tie.digitraffic.fi/api/weathercam/v1/stations/" + id)
    const stationBody = await res.json()
    stationData.push(stationBody)  

    // Select camera position
    let cameraPositions = stationData[0].properties.presets.length
    let randomPosition = Math.floor(Math.random()*(cameraPositions))

    cameraImg.url.push(stationData[0].properties.presets[randomPosition].imageUrl)
    image.src = cameraImg.url[0];
    cameraImg.name.push(stationData[0].properties.presets[0].presentationName)
    cameraImg.province.push(stationData[0].properties.province)
    cameraImg.municipality.push(stationData[0].properties.municipality)

    let addedImage = document.getElementById("tooltip");
    addedImage.appendChild(image);
    addedImage.appendChild(imgText);
    imgText.innerHTML = "<p>" + cameraImg.municipality[0] + ", " + cameraImg.province[0] + "</p><p>" + stationData[0].properties.names.fi + "</p>" + cameraImg.name[0] + "</p>";
    imgText.style.opacity = 0.5;

    // CLEAR THE INPUT BOX IF IT HAS INPUT  
    if (input.value != "")
    {
        input.value = "";
    }
}

function findStrMatch(str) {
    // find the values from a string from a round bracket to the second comma
    // example string: "Weather: 27,941, 70,088"
    // return 27,941 as a number
    let start = str.indexOf("(")
    let end = str.indexOf(", ")
    let valueX = str.substring(start+1, end)
    // change the comma into a dot
    valueX = valueX.replace(",", ".")
    valueX = Number(valueX)
    // get the y coordinate
    start = str.indexOf(", ", end)
    end = str.indexOf(")", start)
    let valueY = str.substring(start+2, end)
    valueY = valueY.replace(",", ".")
    valueY = Number(valueY)
    return [valueX,valueY]
}

function getImgId(coordinates) {
    let imageId;
    for (let i=0; i < imgCoords.xCoord.length; i++) {
        // use round to get match -> incorrect location for nearby points? -> use also y-coordinate
        if (Math.round(imgCoords.xCoord[i]*1000)/1000 == coordinates[0] && Math.round(imgCoords.yCoord[i]*1000)/1000 == coordinates[1]) {
            imageId = imgCoords.id[i];
            return imageId
        }
    }
    return imageId
}
// bg color array
let bgColor = [];
for (let i=0; i < imgCoords.xCoord.length; i++) {
    // bgColor.push('#5e68794d')
    bgColor.push('#5e68794d')
}

let vt_find = [];
for (let i=0; i < vt.length; i++) {
    vt_find.push(vt[i] + "_")
}

// console.log(vt_find)

function findStations(cityName) {
    for (let i = 0; i < imgCoords.name.length; i++) {
        if (imgCoords.name[i].toLowerCase().includes(cityName.toLowerCase())) {
            // Patch due to the missing municipality codes ??
            // if ((cityName.toLowerCase() == 'pori' && imgCoords.name[i].toLowerCase().includes('raasepori')) || (cityName.toLowerCase() == 'joensuu' && imgCoords.name[i].toLowerCase().includes('palojoensuu')) || (cityName.toLowerCase() == 'porvoo' && imgCoords.name[i].toLowerCase().includes('porvoonväylä')) || (cityName.toLowerCase() == 'salo' && (imgCoords.name[i].toLowerCase().includes('oulunsalo') || imgCoords.name[i].toLowerCase().includes('soisalo') || imgCoords.name[i].toLowerCase().includes('salonsaari') || imgCoords.name[i].toLowerCase().includes('sorsasalo'))))
            if (!imgCoords.name[i].toLowerCase().includes("_" + cityName.toLowerCase() + "_")) {
                    if ((vt_find.includes(cityName.toLowerCase()))) {
                        cameraMap.data.datasets[0].pointBackgroundColor[i] = '#010626';
                    } else {
                        cameraMap.data.datasets[0].pointBackgroundColor[i] = '#5e68794d';
                    }
                }
                else {
                cameraMap.data.datasets[0].pointBackgroundColor[i] = '#010626';
                }
        }
        else {
            cameraMap.data.datasets[0].pointBackgroundColor[i] = '#5e68794d';
        }
    }
    cameraMap.update();
}

function resetBgColor() {
    for (let i=0; i < imgCoords.xCoord.length; i++) {
        // bgColor.push('#5e68794d')
        bgColor.push('#5e68794d')
    }
    cameraMap.update();
}

// HTML Tooltip
const getTooltip = (chart) => {
    let tooltipElement = chart.canvas.parentNode.querySelector('div');
    if(!tooltipElement) {
        tooltipElement = document.createElement('div');
        tooltipElement.classList.add('tooltip');
        tooltipElement.setAttribute('id','tooltip')
        chart.canvas.parentNode.appendChild(tooltipElement);
    }
    return tooltipElement;
}

const htmlTooltip = (context) => {
    const {chart, tooltip} = context;
    const tooltipElement = getTooltip(chart);

    // hide if there is mouseout
    if(tooltip.opacity === 0) {
        tooltipElement.style.opacity = 0; 
        imgText.style.opacity = 0;
        return;
    };

    if(tooltip.body) {
       let imgId = getImgId(findStrMatch(tooltip.body[0].lines[0]))
        addImg(imgId);
        tooltipElement.style.opacity = 1;
  
        // position the tooltip
        const {offsetLeft: positionX, offsetTop: positionY} = cameraMap.canvas;
        // offset
        let offsetX = 0;
        let offsetY = 0;
        let tooltipDimensions = tooltipElement.getBoundingClientRect();
        let viewPortWidth = window.innerWidth;
        let viewPortHeight = window.innerHeight;  
        if (tooltip.caretX < viewPortWidth*0.3) {
            if (tooltipDimensions.width/2 > tooltip.caretX) {
                offsetX = tooltipDimensions.width/2 - tooltip.caretX ;
            }  
        } else
        {   // .tooltip -> 65% -> 0.35?
            if (tooltip.caretX > viewPortWidth*0.8) {
                if ( tooltipDimensions.width/0.35 > (viewPortWidth - tooltip.caretX ) ) {
                    offsetX = -(tooltipDimensions.width/2 - (viewPortWidth - tooltip.caretX - 20 ))
                }    }
        }

        //  x-position
        tooltipElement.style.left = offsetX + positionX + tooltip.caretX + 'px';
        //  y-position
        tooltipElement.style.top = positionY + tooltip.caretY + 'px';
        tooltipElement.style.font = tooltip.options.bodyFont.string;
        tooltipElement.style.padding = tooltip.options.padding + 'px' + tooltip.options.padding + 'px';
    };
};

//  Camera map
const cameraMap = new Chart("map", 
{
    type: 'scatter',
    data: {
       datasets: [{
          label: 'Weather',
          data: mapData,
        //   backgroundColor: '#5e68794d',
          pointBackgroundColor: bgColor,
          hoverBackgroundColor: 'black',
          borderColor: ['#5e68794d'],
          radius: 4,
          pointHoverRadius: 8
       }],
    },
    options: {
        // hide chart data label
       responsive: true,
       maintainAspectRatio: true,
       aspectRatio: 1,
       scales: {
        x: {
            type: 'linear',
            position: 'bottom',
            grid: {
                display: false
            },
            display: false
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            },
            // latitude/longitude range
            max: Math.max(...imgCoords.yCoord)+1,
            // max: 71,
            min: Math.min(...imgCoords.yCoord)-1,
            // min: 58,
            display: false
        },        
       },
       plugins: {
        tooltip: {
            enabled: false,
            //  two plots
            // position: 'nearest',
            // trigger external HTML tooltip
            external: htmlTooltip
        },
        legend: {
            display: false
        },
        // zoom: {
        //     zoom: {
        //       wheel: {
        //         enabled: true,
        //       },
        //       pinch: {
        //         enabled: true
        //       },
        //       mode: 'xy',
        //     }
        //   }
        }
    }
});

let radio = document.getElementById("radioButtons");
let mainRoad;

for (let i = 0; i < vt.length; i++) {
    // vt17 is deprecated
    if (i != 16) {
        let radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "vt";
        radioButton.id = vt[i];
        radioButton.value = vt[i];
        radioButton.classList.add(vt[i]);
        radio.appendChild(radioButton);

        let label = document.createElement("label");
        label.htmlFor = vt[i];
        label.textContent = vt[i];
        radio.appendChild(label);

        radioButton.addEventListener("change", function () {
            if (this.checked) {
              mainRoad = this.value;
              findStations(vt[i] + "_");
            }
        });
    }
}

function unCheckRadioBtn() {
    // find the checked radio button
    for (let i = 0; i < vt.length; i++) {
        // vt17 is deprecated
        if (i != 16) {
            let radioButton = document.getElementById(vt[i]);
            radioButton.checked = false;
        }
    }
}

let input = document.getElementById("search-button");
let searchBox = document.getElementById("search-box");
let reset = document.getElementById("reset-button");

// CHECK IF THE SEARCH BUTTON IS CLICKED
input.addEventListener('click', () => {
   findStations(searchBox.value);
});

// CHECK IF ENTER IS PRESSED
searchBox.addEventListener('keyup', (e) => {
   unCheckRadioBtn();
   if (e.key === 'Enter')
   {
       findStations(searchBox.value);
   }
})

// CHECK IF THE RESET BUTTON IS PRESSED
reset.addEventListener('click', () => {
   searchBox.value = "  ";
   findStations(searchBox.value);
   searchBox.value = "";
   // location.reload();
   imgText.style.opacity = 0;
   unCheckRadioBtn();
});

function detectMobile() {
    let isMobile = RegExp(/Android|webOS|iPhone|iPod|iPad/i)
     .test(navigator.userAgent);
  
    if (!isMobile) {
      const isMac = RegExp(/Macintosh/i).test(navigator.userAgent);
  
      if (isMac && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
        isMobile = true;
      }
    }
    return isMobile;
}

//  reload the window to get the correct aspect ratio on resizing the window
// window.addEventListener('resize', () => {
//     if (!detectMobile()){
//         location.reload();
//     }
// })

// reload the window every 5 minutes - the data is updated every ~10 minutes
window.setTimeout( () => {
    window.location.reload();
  }, 300000);