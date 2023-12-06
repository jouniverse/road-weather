const forecastSectionsAPI = "https://tie.digitraffic.fi/api/weather/v1/forecast-sections";
const forecastsAPI = "https://tie.digitraffic.fi/api/weather/v1/forecast-sections/forecasts";

const loadingElement = document.getElementById('loading');

async function getForecasts() {
    const res = await fetch(forecastsAPI);
    const body = await res.json();
    return body;
}

async function getForecastSections() {
    const res = await fetch(forecastSectionsAPI);
    const body = await res.json();
    return body;
}

async function init() {
    try {
        const forecasts = await getForecasts();
        const forecastSections = await getForecastSections();

        let road = {
            id: [],
            name: [],
            roadNumber: [],
            roadSectionNumber: [],
            length: [],
            x: [],
            y: []
        }
        let allRoadNumbers = [];
        let roadNumbers = [];
        let roadNames = [];
        
        let bgColor = [];
        let pointRadius = [];
        
        let mapData = [];
        
        const vt = [];
        for (let i = 1; i <= 29; i++) {
          vt.push(i);
        }

        function  convertUTC(UTCString) {
            const start = UTCString.indexOf("-")
            const year = UTCString.substring(0, start)
            const month = UTCString.substring(start + 1, start + 3)
            const day = UTCString.substring(start + 4, start + 6)
            const hour = UTCString.substring(start + 7, start + 9)
            const minute = UTCString.substring(start + 10, start + 12)
            const second = UTCString.substring(start + 13, start + 15)
            const date = new Date(Date.UTC(year,month-1,day,hour,minute,second))
            return [hour + ":" + minute, date.toUTCString()]
        }

        const forecastSectionsLength = forecastSections.features.length;

        for (let i = 0; i < forecastSectionsLength; i++) {
            road.id.push(forecastSections.features[i].id)
            road.name.push(forecastSections.features[i].properties.description)
            road.roadNumber.push(forecastSections.features[i].properties.roadNumber)
            road.length.push(forecastSections.features[i].properties.length)
            road.x.push(forecastSections.features[i].geometry.coordinates[0][0][0])
            road.y.push(forecastSections.features[i].geometry.coordinates[0][0][1])
        }

        for (let i=0; i < road.x.length; i++) {
            mapData.push({x: road.x[i], y: road.y[i]})
        }

        function findStrMatch(str) {
            // find the both number values from the string
            // example string: "Weather: (27,941, 70,088)"
            // return 27.941 and 70.088 as numbers
            let start = str.indexOf("(")
            let end = str.indexOf(", ")
            let valueX = str.substring(start+1, end)
            // change the comma into a dot
            valueX = valueX.replace(",", ".")
            valueX = Number(valueX)
            // get the second number
            start = str.indexOf(", ", end)
            end = str.indexOf(")", start)
            let valueY = str.substring(start+2, end)
            valueY = valueY.replace(",", ".")
            valueY = Number(valueY)
            return [valueX, valueY]
        }

        function getId(coordinates) {
            for (let i = 0; i < road.id.length; i++) {
                if (Math.round(road.x[i]*1000)/1000 == coordinates[0] && Math.round(road.y[i]*1000)/1000 == coordinates[1]) {
                    return [road.id[i], road.name[i]]
                }
            }
            return -1
        }
        
        function getForecast(id) {
            let roadForecast;
            for (let i = 0; i < forecasts.forecastSections.length; i++) {
                if (forecasts.forecastSections[i].id == id) {
                    roadForecast = forecasts.forecastSections[i].forecasts
                    return roadForecast
                }
            }
            return roadForecast
        }

        function findRoads(roadName) {
            for (let i = 0; i < road.name.length; i++) {
                if (road.name[i].toLowerCase().includes(roadName.toLowerCase())) {
                    forecastMap.data.datasets[0].pointBackgroundColor[i] = '#010626';
                    pointRadius[i] = 2;
                } else {
                    forecastMap.data.datasets[0].pointBackgroundColor[i] = '#5e68794d';
                    pointRadius[i] = 1;
                }
            }
            forecastMap.update();
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
                // get forecast data
                 let forecastData = getForecast(getId(findStrMatch(tooltip.body[0].lines[0]))[0])
        
                const tooltipBodyP = document.createElement('P');
                tooltipBodyP.classList.add('forecastData');
                // Add forecastData
                let roadName = getId(findStrMatch(tooltip.body[0].lines[0]))[1]
                tooltipBodyP.innerHTML = '<h2>Forecast for: ' + roadName + ' </h2><table><tr><th>Forecast</th><th>' + forecastData[0].forecastName + '</th><th>'+ forecastData[1].forecastName +'</th><th>' + forecastData[2].forecastName + '</th><th>' + forecastData[3].forecastName + '</th><th>' + forecastData[4].forecastName + '</th></tr><tr><td>Timestamp:</td><td>' + convertUTC(forecastData[0].dataUpdatedTime)[0] + '</td><td>'+ convertUTC(forecastData[1].dataUpdatedTime)[0] +'</td><td>' + convertUTC(forecastData[2].dataUpdatedTime)[0] + '</td><td>' + convertUTC(forecastData[3].dataUpdatedTime)[0] + '</td><td>' + convertUTC(forecastData[4].dataUpdatedTime)[0] + '</td></tr><tr><td>Road:</td><td>' + forecastData[0].roadTemperature + '°C' + '</td><td>'+ forecastData[1].roadTemperature + '°C/' + forecastData[1].forecastConditionReason.roadCondition + '</td><td>' + forecastData[2].roadTemperature + '°C/' + forecastData[2].forecastConditionReason.roadCondition +  '</td><td>' + forecastData[3].roadTemperature + '°C/' + forecastData[3].forecastConditionReason.roadCondition +  '</td><td>' + forecastData[4].roadTemperature + '°C/' + forecastData[4].forecastConditionReason.roadCondition +  '</td></tr><tr><td>Air:</td><td>' + forecastData[0].temperature + '°C' + '</td><td>'+ forecastData[1].temperature + '°C' + '</td><td>' + forecastData[2].temperature + '°C' +  '</td><td>' + forecastData[3].temperature + '°C' + '</td><td>' + forecastData[4].temperature + '°C' + '</td></tr><tr><td></td><td> - </td><td>'+ forecastData[1].forecastConditionReason.precipitationCondition + '</td><td>' + forecastData[2].forecastConditionReason.precipitationCondition +  '</td><td>' + forecastData[3].forecastConditionReason.precipitationCondition + '</td><td>' + forecastData[4].forecastConditionReason.precipitationCondition + '</td></tr><tr><td>Condition:</td><td>' + forecastData[0].overallRoadCondition + '</td><td>'+ forecastData[1].overallRoadCondition + '</td><td>' + forecastData[2].overallRoadCondition +  '</td><td>' + forecastData[3].overallRoadCondition + '</td><td>' + forecastData[4].overallRoadCondition + '</td></tr></table>'
        
                //  remove the old children
                while (tooltipElement.firstChild) {
                    tooltipElement.firstChild.remove();
                }
        
                // add new children
                tooltipElement.appendChild(tooltipBodyP)
                tooltipElement.style.opacity = 1;

                // position the tooltip
                let {offsetLeft: positionX, offsetTop: positionY} = forecastMap.canvas;

                // offset
                let offsetX = 0;
                let offsetY = 0;
                let tooltipDimensions = tooltipElement.getBoundingClientRect();
                let viewPortWidth = window.innerWidth;
                let viewPortHeight = window.innerHeight;  
                if (tooltip.caretX < viewPortWidth/2) {
                    if (tooltipDimensions.width/2 > tooltip.caretX) {
                        offsetX = tooltipDimensions.width/2 - tooltip.caretX ;
                    }
                    
                } else {
                    // .tooltip -> 65% -> 0.35?
                    if ( tooltipDimensions.width/0.35 > (viewPortWidth - tooltip.caretX + 100) ) {
                        offsetX = -(tooltipDimensions.width/2 - (viewPortWidth - tooltip.caretX - 100))
                    }              
                }                

                //  x-position
                tooltipElement.style.left =  offsetX + positionX + tooltip.width  + tooltip.caretX + 'px';
                // y-position
                tooltipElement.style.top = positionY + tooltip.caretY + 'px';
                tooltipElement.style.font = tooltip.options.bodyFont.string;
                tooltipElement.style.padding = tooltip.options.padding + 'px' + tooltip.options.padding + 'px';
            };
        };

        // create a chart object
        const forecastMap = new Chart("map", 
        {
            type: 'scatter',
            data: {
            datasets: [{
                label: 'Weather',
                data: mapData,
                pointBackgroundColor: bgColor,
                hoverBackgroundColor: 'black',
                borderColor: ['#5e68794d'],
                radius: pointRadius,
                pointHoverRadius: 4
            }],
            },
            options: {
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
                    max: Math.max(...road.y)+1,
                    // max: 71,
                    min: Math.min(...road.y)-1,
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
        for (let i = 0; i < vt.length; i++) {
            // vt17 is deprecated
            if (i != 16) {
                let radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "vt";
                radioButton.id = "vt" + vt[i];
                radioButton.value = "vt" + vt[i];
                radioButton.classList.add("vt" + vt[i]);
                radio.appendChild(radioButton);

                let label = document.createElement("label");
                label.htmlFor = "vt" + vt[i];
                label.textContent = "vt" + vt[i];
                radio.appendChild(label);

                radioButton.addEventListener("change", function () {
                    if (this.checked) {
                        findRoads(" " + vt[i] + ".");
                    }
                });
            }
        }

        function unCheckRadioBtn() {
            // find the checked radio button
            for (let i = 0; i < vt.length; i++) {
                // vt17 is deprecated
                if (i != 16) {
                    let radioButton = document.getElementById("vt" + vt[i]);
                    radioButton.checked = false;
                }
            }
        }

        let input = document.getElementById("search-button");
        let searchBox = document.getElementById("search-box");
        let reset = document.getElementById("reset-button");
        let random = document.getElementById("random-button");
        // CHECK IF THE SEARCH BUTTON IS PRESSED
        input.addEventListener('click', () => {
            unCheckRadioBtn();
            if (!isNaN(searchBox.value)) {
                findRoads(" " + searchBox.value + ".");
            } else {
                findRoads(searchBox.value);
            }
        });

        // CHECK IF ENTER IS PRESSED
        searchBox.addEventListener('keyup', (e) => {
            unCheckRadioBtn();
            if (e.key === 'Enter')
            {
                if (!isNaN(searchBox.value)) {
                    findRoads(" " + searchBox.value + ".");
                } else {
                    findRoads(searchBox.value);
                }
            }
        })

        // CHECK IF THE RESET BUTTON IS PRESSED
        reset.addEventListener('click', () => {
            searchBox.value = "    ";
            findRoads(searchBox.value);
            searchBox.value = "";
            unCheckRadioBtn();   
        });

    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    } finally {
        // Hide the loading animation regardless of success or failure
        loadingElement.style.display = 'none';
    }
}

// Trigger init when the page loads
window.addEventListener('load', init);


