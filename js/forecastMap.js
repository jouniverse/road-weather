const forecastSectionsAPI =
  "https://tie.digitraffic.fi/api/weather/v1/forecast-sections";
const forecastsAPI =
  "https://tie.digitraffic.fi/api/weather/v1/forecast-sections/forecasts";

const loadingElement = document.getElementById("loading");

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
      y: [],
    };
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

    function convertUTC(UTCString) {
      const start = UTCString.indexOf("-");
      const year = UTCString.substring(0, start);
      const month = UTCString.substring(start + 1, start + 3);
      const day = UTCString.substring(start + 4, start + 6);
      const hour = UTCString.substring(start + 7, start + 9);
      const minute = UTCString.substring(start + 10, start + 12);
      const second = UTCString.substring(start + 13, start + 15);
      const date = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second)
      );
      return [hour + ":" + minute, date.toUTCString()];
    }

    const forecastSectionsLength = forecastSections.features.length;

    // Pre-initialize arrays for better performance
    bgColor = new Array(forecastSectionsLength).fill("#5e68794d");
    pointRadius = new Array(forecastSectionsLength).fill(1);

    for (let i = 0; i < forecastSectionsLength; i++) {
      road.id.push(forecastSections.features[i].id);
      road.name.push(forecastSections.features[i].properties.description);
      road.roadNumber.push(forecastSections.features[i].properties.roadNumber);
      road.length.push(forecastSections.features[i].properties.length);
      road.x.push(forecastSections.features[i].geometry.coordinates[0][0][0]);
      road.y.push(forecastSections.features[i].geometry.coordinates[0][0][1]);
    }

    for (let i = 0; i < road.x.length; i++) {
      mapData.push({ x: road.x[i], y: road.y[i] });
    }

    function findStrMatch(str) {
      // find the both number values from the string
      // example string: "Weather: (27,941, 70,088)"
      // return 27.941 and 70.088 as numbers
      let start = str.indexOf("(");
      let end = str.indexOf(", ");
      let valueX = str.substring(start + 1, end);
      // change the comma into a dot
      valueX = valueX.replace(",", ".");
      valueX = Number(valueX);
      // get the second number
      start = str.indexOf(", ", end);
      end = str.indexOf(")", start);
      let valueY = str.substring(start + 2, end);
      valueY = valueY.replace(",", ".");
      valueY = Number(valueY);
      return [valueX, valueY];
    }

    function getId(coordinates) {
      for (let i = 0; i < road.id.length; i++) {
        if (
          Math.round(road.x[i] * 1000) / 1000 == coordinates[0] &&
          Math.round(road.y[i] * 1000) / 1000 == coordinates[1]
        ) {
          return [road.id[i], road.name[i]];
        }
      }
      return -1;
    }

    function getForecast(id) {
      let roadForecast;
      for (let i = 0; i < forecasts.forecastSections.length; i++) {
        if (forecasts.forecastSections[i].id == id) {
          roadForecast = forecasts.forecastSections[i].forecasts;
          return roadForecast;
        }
      }
      return roadForecast;
    }

    function findRoads(roadName) {
      let needsUpdate = false;

      // Initialize arrays if empty (first run)
      if (bgColor.length === 0 || pointRadius.length === 0) {
        for (let i = 0; i < road.name.length; i++) {
          bgColor.push("#5e68794d");
          pointRadius.push(1);
        }
        needsUpdate = true;
      }

      for (let i = 0; i < road.name.length; i++) {
        const matches = road.name[i]
          .toLowerCase()
          .includes(roadName.toLowerCase());
        const newColor = matches ? "#010626" : "#5e68794d";
        const newRadius = matches ? 2 : 1;

        // Only update if there's a change
        if (
          forecastMap.data.datasets[0].pointBackgroundColor[i] !== newColor ||
          pointRadius[i] !== newRadius
        ) {
          forecastMap.data.datasets[0].pointBackgroundColor[i] = newColor;
          pointRadius[i] = newRadius;
          needsUpdate = true;
        }
      }

      // Only update the chart if something changed
      if (needsUpdate) {
        forecastMap.update();
      }
    }

    const getTooltip = (chart) => {
      let tooltipElement = chart.canvas.parentNode.querySelector("div");
      if (!tooltipElement) {
        tooltipElement = document.createElement("div");
        tooltipElement.classList.add("tooltip");
        tooltipElement.setAttribute("id", "tooltip");
        chart.canvas.parentNode.appendChild(tooltipElement);
      }
      return tooltipElement;
    };

    // Add debounce function to limit tooltip updates
    const debounce = (func, delay) => {
      let timeoutId;
      return function (...args) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    };

    // Last tooltip position to prevent unnecessary updates
    let lastTooltipPosition = { x: 0, y: 0 };

    const htmlTooltip = (context) => {
      const { chart, tooltip } = context;
      const tooltipElement = getTooltip(chart);

      // hide if there is mouseout
      if (tooltip.opacity === 0) {
        tooltipElement.style.opacity = 0;
        return;
      }

      // Skip small movements to reduce jitter
      const currentPosition = { x: tooltip.caretX, y: tooltip.caretY };
      const distance = Math.sqrt(
        Math.pow(currentPosition.x - lastTooltipPosition.x, 2) +
          Math.pow(currentPosition.y - lastTooltipPosition.y, 2)
      );

      // Only update if moved more than 5 pixels
      if (distance < 5 && tooltipElement.style.opacity === "1") {
        return;
      }

      lastTooltipPosition = currentPosition;

      if (tooltip.body) {
        // get forecast data
        let forecastData = getForecast(
          getId(findStrMatch(tooltip.body[0].lines[0]))[0]
        );

        const tooltipBodyP = document.createElement("P");
        tooltipBodyP.classList.add("forecastData");
        // Add forecastData
        let roadName = getId(findStrMatch(tooltip.body[0].lines[0]))[1];
        tooltipBodyP.innerHTML =
          "<h2>Forecast for: " +
          roadName +
          " </h2><table><tr><th>Forecast</th><th>" +
          forecastData[0].forecastName +
          "</th><th>" +
          forecastData[1].forecastName +
          "</th><th>" +
          forecastData[2].forecastName +
          "</th><th>" +
          forecastData[3].forecastName +
          "</th><th>" +
          forecastData[4].forecastName +
          "</th></tr><tr><td>Timestamp:</td><td>" +
          convertUTC(forecastData[0].dataUpdatedTime)[0] +
          "</td><td>" +
          convertUTC(forecastData[1].dataUpdatedTime)[0] +
          "</td><td>" +
          convertUTC(forecastData[2].dataUpdatedTime)[0] +
          "</td><td>" +
          convertUTC(forecastData[3].dataUpdatedTime)[0] +
          "</td><td>" +
          convertUTC(forecastData[4].dataUpdatedTime)[0] +
          "</td></tr><tr><td>Road:</td><td>" +
          forecastData[0].roadTemperature +
          "°C" +
          "</td><td>" +
          forecastData[1].roadTemperature +
          "°C/" +
          forecastData[1].forecastConditionReason.roadCondition +
          "</td><td>" +
          forecastData[2].roadTemperature +
          "°C/" +
          forecastData[2].forecastConditionReason.roadCondition +
          "</td><td>" +
          forecastData[3].roadTemperature +
          "°C/" +
          forecastData[3].forecastConditionReason.roadCondition +
          "</td><td>" +
          forecastData[4].roadTemperature +
          "°C/" +
          forecastData[4].forecastConditionReason.roadCondition +
          "</td></tr><tr><td>Air:</td><td>" +
          forecastData[0].temperature +
          "°C" +
          "</td><td>" +
          forecastData[1].temperature +
          "°C" +
          "</td><td>" +
          forecastData[2].temperature +
          "°C" +
          "</td><td>" +
          forecastData[3].temperature +
          "°C" +
          "</td><td>" +
          forecastData[4].temperature +
          "°C" +
          "</td></tr><tr><td></td><td> - </td><td>" +
          forecastData[1].forecastConditionReason.precipitationCondition +
          "</td><td>" +
          forecastData[2].forecastConditionReason.precipitationCondition +
          "</td><td>" +
          forecastData[3].forecastConditionReason.precipitationCondition +
          "</td><td>" +
          forecastData[4].forecastConditionReason.precipitationCondition +
          "</td></tr><tr><td>Condition:</td><td>" +
          forecastData[0].overallRoadCondition +
          "</td><td>" +
          forecastData[1].overallRoadCondition +
          "</td><td>" +
          forecastData[2].overallRoadCondition +
          "</td><td>" +
          forecastData[3].overallRoadCondition +
          "</td><td>" +
          forecastData[4].overallRoadCondition +
          "</td></tr></table>";

        //  remove the old children
        while (tooltipElement.firstChild) {
          tooltipElement.firstChild.remove();
        }

        // add new children
        tooltipElement.appendChild(tooltipBodyP);
        tooltipElement.style.opacity = 1;

        // position the tooltip - improved positioning logic
        let { offsetLeft: positionX, offsetTop: positionY } =
          forecastMap.canvas;

        // Get dimensions
        const tooltipWidth = tooltipElement.offsetWidth;
        const tooltipHeight = tooltipElement.offsetHeight;
        const viewPortWidth = window.innerWidth;
        const viewPortHeight = window.innerHeight;

        // Round positions to whole pixels to reduce sub-pixel rendering jitter
        const caretX = Math.round(tooltip.caretX);
        const caretY = Math.round(tooltip.caretY);

        // Default position (no transform)
        tooltipElement.style.transform = "none";

        // Calculate absolute cursor position in viewport
        const cursorX = positionX + caretX;
        const cursorY = positionY + caretY;

        // Center the tooltip horizontally on the cursor
        let xPosition = cursorX - tooltipWidth / 2;

        // Ensure tooltip stays within horizontal bounds
        if (xPosition < 10) {
          xPosition = 10;
        } else if (xPosition + tooltipWidth > viewPortWidth - 10) {
          xPosition = viewPortWidth - tooltipWidth - 10;
        }

        // Try to position above cursor first
        let yPosition = cursorY - tooltipHeight - 10;

        // If tooltip would go above viewport, position it below cursor
        if (yPosition < 10) {
          yPosition = cursorY + 10;
        }

        // Apply the calculated position
        tooltipElement.style.left = `${Math.round(xPosition)}px`;
        tooltipElement.style.top = `${Math.round(yPosition)}px`;
        tooltipElement.style.font = tooltip.options.bodyFont.string;
        tooltipElement.style.padding = `${tooltip.options.padding}px`;
      }
    };

    // create a chart object
    const forecastMap = new Chart("map", {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Weather",
            data: mapData,
            pointBackgroundColor: bgColor,
            hoverBackgroundColor: "black",
            borderColor: ["#5e68794d"],
            radius: pointRadius,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        // Add minimal animation settings to reduce jitter
        animation: {
          duration: 0, // Disable animations for smoother experience
        },
        hover: {
          animationDuration: 0, // Disable hover animations
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            grid: {
              display: false,
            },
            display: false,
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            // latitude/longitude range
            max: Math.max(...road.y) + 1,
            // max: 71,
            min: Math.min(...road.y) - 1,
            // min: 58,
            display: false,
          },
        },
        plugins: {
          tooltip: {
            enabled: false,
            // position: 'nearest',
            // trigger external HTML tooltip
            external: htmlTooltip,
          },
          legend: {
            display: false,
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
        },
      },
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
    input.addEventListener("click", () => {
      unCheckRadioBtn();
      if (!isNaN(searchBox.value)) {
        findRoads(" " + searchBox.value + ".");
      } else {
        findRoads(searchBox.value);
      }
    });

    // CHECK IF ENTER IS PRESSED
    searchBox.addEventListener("keyup", (e) => {
      unCheckRadioBtn();
      if (e.key === "Enter") {
        if (!isNaN(searchBox.value)) {
          findRoads(" " + searchBox.value + ".");
        } else {
          findRoads(searchBox.value);
        }
      }
    });

    // CHECK IF THE RESET BUTTON IS PRESSED
    reset.addEventListener("click", () => {
      searchBox.value = "    ";
      findRoads(searchBox.value);
      searchBox.value = "";
      unCheckRadioBtn();
    });

    // After chart creation and all setup
    // press the reset button when the page has loaded
    reset.click();
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
  } finally {
    // Hide the loading animation regardless of success or failure
    loadingElement.style.display = "none";
  }
}

// Trigger init when the page loads
window.addEventListener("load", init);
