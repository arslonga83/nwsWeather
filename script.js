let lat = ''
let lon = ''
let addressInput = document.querySelector('#address')

// wakeup the free Render server 
fetch("https://weather-server-l1r2.onrender.com/wakeup")
  .then(response => response.text())
  .then(result => console.log(result))

// GET POSITION ON INITIAL LOAD
const position = await getPosition()
  lat = position.coords.latitude
  lon = position.coords.longitude
loadPage()

// MAIN SEARCH AND LOAD FUNCTION
async function loadPage() {
  document.querySelector('#loader').classList.add('loader')
  document.querySelector('#coords').textContent = `
  ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°W`
  const gridData = await getGrid()
  const weather = await getWeather(gridData)
  const alerts = await getAlerts(lat, lon)
  getAlertsHtml(alerts)
  getHtml(weather)
  document.querySelector('#loader').classList.remove('loader')
}  


// GET INPUT FUNCTION
document.querySelector('#button').addEventListener('click', () => {
  getNewLocation()
})
document.querySelector('#address').addEventListener('keypress', (e) => {
  if(e.key === 'Enter') {
    getNewLocation()
  }
})

function getNewLocation() {
  let requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({address: addressInput.value}),
    redirect: 'follow'
  };

  fetch("https://weather-server-l1r2.onrender.com", requestOptions)
    .then(response => response.json())
    .then(result => {
      lat = result.lat
      lon = result.lng
      loadPage()
      addressInput.value = ''
    })
    .catch(error => console.log('error', error));
}

// GEOLOCATION FUNCTIONS

function getPosition() {
  return new Promise((resolve, reject) => 
      navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}

// NWS FETCH FUNCTIONS

async function getGrid() {
  const response = await fetch(`https://api.weather.gov/points/${lat},${lon}`)
  const result = await response.json()
  let gridId = result.properties.gridId
  let gridX = result.properties.gridX
  let gridY = result.properties.gridY
  
  return {gridId: gridId, gridX: gridX, gridY: gridY}
}

async function getWeather(gridData) {
  let gridId = gridData.gridId
  let gridX = gridData.gridX
  let gridY = gridData.gridY
  const response = await fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`)

  const result = await response.json()
  return result.properties.periods
}

async function getAlerts(lat, lon) {
  const response = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`)
  const result = await response.json()
  return result.features
  }

// HTML RELATED FUNCTIONS

function getHtml(weather) {
  let weatherHtml = ''

  for (let i = 0; i < 3; i++) {
    let headline = weather[i].name
    let forecast = weather[i].detailedForecast
    weatherHtml += `
      <div class='forecast'>
        <h2 class='forecast-headline'>${headline}</h2>
        <p class='forecast-desc'>${forecast}</p>
      </div>
      `
  }
  document.querySelector('#weather').innerHTML = weatherHtml
}

function getAlertsHtml(alerts) {
  let alertsHtml = ''

  if (alerts.length === 0) {
    alertsHtml = `
    <h2>No alerts at this time.<h2>
    `
  } else {
    for (let index in alerts) {
      alertsHtml += `
      <h2 class='alert-headline'>${alerts[index].properties.headline}</h2>
      <p class='alert-desc'>${alerts[index].properties.description}</p>
      `
    }
  }
  document.querySelector('#alert').innerHTML = alertsHtml
}

