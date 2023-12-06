import { municipality } from "./municipality_codes.js";

async function getWeatherData() {
    const res = await fetch("https://tie.digitraffic.fi/api/weather/v1/stations/data")
    const body = await res.json()
    return body
}

async function getWeatherStations() {
    const res = await fetch("https://tie.digitraffic.fi/api/weather/v1/stations")
    const body = await res.json()
    return body
}

// CREATE WEATHER VARIABLE
const weather = await getWeatherData();
// CREATE WEATHERSTATIONS VARIABLE
const weatherStations = await getWeatherStations();

let canvas = document.getElementById("map");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

let stations = {
    id: [],
    name: [],
    xCoord: [],
    yCoord: [],
    airTemp: [],
    windSpeed: [],
    rain: [],
    weatherDescription: []
}

for (let i=0; i < weather.stations.length; i++) {
    stations.id.push(weatherStations.features[i].id)
    stations.name.push(weatherStations.features[i].properties.name.toLowerCase())
    stations.xCoord.push(weatherStations.features[i].geometry.coordinates[0])
    stations.yCoord.push(weatherStations.features[i].geometry.coordinates[1])

    if (weather.stations[i].sensorValues.length != 0) {
        //  get air temperature
        let airTemp = getSensorValue(weather.stations[i].sensorValues, 1)
        stations.airTemp.push(airTemp)
        //  get windspeed 
        let windSpeed = getSensorValue(weather.stations[i].sensorValues, 16)
        stations.windSpeed.push(windSpeed)
        //  get rain 
        let rain = getSensorValue(weather.stations[i].sensorValues, 22)
        stations.rain.push(rain)
        // get weather description
        let description = getSensorValue(weather.stations[i].sensorValues, 27)
        stations.weatherDescription.push(description)
    } else
    {
        stations.airTemp.push("N/A")
        stations.windSpeed.push("N/A")
        stations.rain.push("N/A")
        stations.weatherDescription.push("N/A")
    }
}

function getSensorValue(sensorValueData, valueId) {
    for (let i = 0; i < sensorValueData.length; i++) {
        if (sensorValueData[i].id === valueId) { 
            switch (valueId) {
                case 1:
                    return sensorValueData[i].value;
                case 22:
                    return sensorValueData[i].value;
                case 16:
                    return sensorValueData[i].value;
                case 27:
                    return sensorValueData[i].sensorValueDescriptionEn;
                default:
                    return "N/A";
            }
        }
    }
    return "N/A";
}

// initialize chart data
let data = []
for (let i=0; i < stations.xCoord.length; i++) {
    data.push({x:stations.xCoord[i], y:stations.yCoord[i]})
}

function findStrMatch(str) {
    // find the values from a string from a round bracket to the second comma
    // example string: "Weather: 27,941, 70,088"
    // return 27,941 as a number
    // get the x coordinate
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
    return [valueX, valueY]
}

function getPointData(coordinates) {
    let tempData = []
    for (let i=0; i < stations.xCoord.length; i++) {
        // use round to get match -> incorrect location for nearby points?
        if (Math.round(stations.xCoord[i]*1000)/1000 == coordinates[0] && Math.round(stations.yCoord[i]*1000)/1000 == coordinates[1]) {
            tempData.push(stations.name[i])
            tempData.push(stations.airTemp[i])
            tempData.push(stations.windSpeed[i])
            tempData.push(stations.rain[i])
            tempData.push(stations.weatherDescription[i])
            return tempData
        }
    }
    return tempData
}

// create bgcolor array
let bgColor = [];
for (let i=0; i < stations.xCoord.length; i++) {
    bgColor.push('#5e68794d')
}

function resetBgColor() {
    for (let i=0; i < stations.xCoord.length; i++) {
        bgColor.push('#5e68794d')
    }
    weatherMap.update();
}

function findStations(cityName) {
    for (let i = 0; i < stations.name.length; i++) {
        // Patch due to the missing municipality codes ??
        if (stations.name[i].includes(cityName.toLowerCase())) { 
            if ((cityName.toLowerCase() == 'pori' && stations.name[i].includes('raasepori')) || (cityName.toLowerCase() == 'joensuu' && stations.name[i].includes('palojoensuu')) || (cityName.toLowerCase() == 'hamina' && stations.name[i].includes('maarianhamina')) || (cityName.toLowerCase() == 'salo' && (stations.name[i].includes('sorsasalo') || stations.name[i].includes('soisalo'))))
            {
                weatherMap.data.datasets[0].pointBackgroundColor[i] = '#5e68794d';
            } else {
                weatherMap.data.datasets[0].pointBackgroundColor[i] = '#010626';
            }
        }
        else {
            weatherMap.data.datasets[0].pointBackgroundColor[i] = '#5e68794d';
        }
    }
    weatherMap.update();
}

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
        return;
    };

    if(tooltip.body) {
       let tempData = getPointData(findStrMatch(tooltip.body[0].lines[0]));

        const tooltipBodyP = document.createElement('P');
        tooltipBodyP.classList.add('tempData');
        // Add tempdata
        tooltipBodyP.innerHTML = '<p>' + tempData[0] + '</p><p>Temp:' + tempData[1] + '°C</p><p>Wind:' + tempData[2] + ' m/s</p><p>Rain:' + tempData[3] + ' mm</p><p>Road:' + tempData[4] + '</p>';

        //  remove the old children
        while (tooltipElement.firstChild) {
            tooltipElement.firstChild.remove();
        }
        // add new children
        tooltipElement.appendChild(tooltipBodyP)
        tooltipElement.style.opacity = 1;

        // position the tooltip
        const {offsetLeft: positionX, offsetTop: positionY} = weatherMap.canvas;   
        // offset
        let offsetX = 0;
        let offsetY = 0;
        let tooltipDimensions = tooltipElement.getBoundingClientRect();
        let viewPortWidth = window.innerWidth;
        let viewPortHeight = window.innerHeight;  
        if (tooltip.caretX < viewPortWidth*0.1) {
            if (tooltipDimensions.width/2 > tooltip.caretX) {
                offsetX = tooltipDimensions.width/2 - tooltip.caretX ;
            }  
        } else 
        {   // .tooltip -> 65% -> 0.35?
            if (tooltip.caretX > viewPortWidth*0.8) {
                if ( tooltipDimensions.width/0.35 > (viewPortWidth - tooltip.caretX ) ) {
                    offsetX = -(tooltipDimensions.width/2 - (viewPortWidth - tooltip.caretX - 20 ))
                }   
            }
        }
    
        //  x-position
        tooltipElement.style.left =  offsetX + positionX + tooltip.caretX + 'px';
        //  y-position
        tooltipElement.style.top = positionY + tooltip.caretY + 'px';
        tooltipElement.style.font = tooltip.options.bodyFont.string;
        tooltipElement.style.padding = tooltip.options.padding + 'px' + tooltip.options.padding + 'px';
    };
};

const weatherMap = new Chart("map", 
{
    type: 'scatter',
    data: {
       datasets: [{
          label: 'Weather',
          data: data,
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
            max: Math.max(...stations.yCoord)+1,
            // max: 71,
            min: Math.min(...stations.yCoord)-1,
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

const vt = [];
for (let i = 1; i <= 29; i++) {
  vt.push("vt" + i);
}

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
let random = document.getElementById("random-button");

function municipalityMatch(city) {
    for (let i=0; i < municipality.name.length; i++) {
        if (municipality.name[i].toLowerCase().includes(city)) {
            return true;
        } 
    }
    return false;
}

function cityWeather() {
    let newChartData = [];
    let table = document.querySelector(".weather-data");
    table.innerHTML = ""
    for (let i=0; i < stations.xCoord.length; i++) {
        if (stations.name[i].includes(searchBox.value.toLowerCase() + "_") && municipalityMatch(searchBox.value.toLowerCase())) {
            if ((searchBox.value.toLowerCase() == 'pori' && stations.name[i].includes('raasepori')) || (searchBox.value.toLowerCase() == 'joensuu' && stations.name[i].includes('palojoensuu')) || (searchBox.value.toLowerCase() == 'hamina' && stations.name[i].includes('maarianhamina')) || (searchBox.value.toLowerCase() == 'salo' && (stations.name[i].includes('sorsasalo') || stations.name[i].includes('soisalo')))) {
                continue;
            } else {
                newChartData.push({x:stations.xCoord[i], y:stations.yCoord[i]})
            }
        }
    }
    if (newChartData.length != 0)
        {
        let cityWeatherData = [];
        for (let i = 0; i < newChartData.length; i++) {
            cityWeatherData.push(getPointData([Math.round(newChartData[i].x*1000)/1000,Math.round(newChartData[i].y*1000)/1000]));
        }
        for (let j = 0; j < cityWeatherData.length; j++) {
            table.innerHTML += `<div class="card"><div>Name: ${cityWeatherData[j][0]}</div><div>Air:${cityWeatherData[j][1]}[°C]</div><div>Wind:${cityWeatherData[j][2]}[m/s]</div><div>Rain:${cityWeatherData[j][3]}[mm]</div><div>Description:${cityWeatherData[j][4]}</div></div>`
        } 
    } else {
        table.innerHTML = `<div>No stations found for ${searchBox.value}</div>`
    }
}

function randomCityWeather() {
    let newChartData = [];
    let table = document.querySelector(".weather-data");
    table.innerHTML = ""
    let randomCityIndex = Math.floor(Math.random()*(municipality.name.length));
    let randomCity = municipality.name[randomCityIndex];
    for (let i=0; i < stations.xCoord.length; i++) {
        if (stations.name[i].includes("_" + randomCity.toLowerCase() + "_")) {
            newChartData.push({x:stations.xCoord[i], y:stations.yCoord[i]})
        }
    }
    if (newChartData.length != 0)
        {
        let cityWeatherData = [];
        for (let i = 0; i < newChartData.length; i++) {
            cityWeatherData.push(getPointData([Math.round(newChartData[i].x*1000)/1000,Math.round(newChartData[i].y*1000)/1000]));
        }
        for (let j = 0; j < cityWeatherData.length; j++) {
            table.innerHTML += `<div class="card"><div>Name: ${cityWeatherData[j][0]}</div><div>Air:${cityWeatherData[j][1]}[°C]</div><div>Wind:${cityWeatherData[j][2]}[m/s]</div><div>Rain:${cityWeatherData[j][3]}[mm]</div><div>Description:${cityWeatherData[j][4]}</div></div>`
        } 
    } else {
        table.innerHTML = `<div>No stations found for ${randomCity}</div>`
    }
    searchBox.value = randomCity;
}

function resetMap() {
    let table = document.querySelector(".weather-data");
    table.innerHTML = ""
}

// CHECK IF THE SEARCH BUTTON IS PRESSED
input.addEventListener('click', () => {
    unCheckRadioBtn();
    findStations(searchBox.value);
    if (window.innerWidth < 768) {
        cityWeather();
    }
});

// CHECK IF ENTER IS PRESSED
searchBox.addEventListener('keyup', (e) => {
    unCheckRadioBtn();
    if (e.key === 'Enter')
    {
        findStations(searchBox.value);
        if (window.innerWidth < 768) {
            cityWeather();
        }
    }
})

// CEHCK IF RANDOM BUTTON IS PRESSED
random.addEventListener('click', () => { 
    if (window.innerWidth < 768) {
        randomCityWeather();
    }
})

// CHECK IF THE RESET BUTTON IS PRESSED
reset.addEventListener('click', () => {
    searchBox.value = "  ";
    findStations(searchBox.value);
    searchBox.value = "";
    unCheckRadioBtn();
    if (window.innerWidth < 768) {
        resetMap();
    }   
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

//  reload the window to get the correct aspect ratio on resizing the window - only on desktop
// window.addEventListener('resize', () => {
//     if (!detectMobile()){
//         location.reload();
//     }
// })

// reload the window every 5 minutes - the data is updated every ~10 minutes
window.setTimeout( () => {
    window.location.reload();
  }, 300000);
