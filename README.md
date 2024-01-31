#National Weather Service Updates App

Live preview here: https://arslonga83.github.io/nwsWeather/

A simple app to fetch the written text forecasts from the national weather service for a given location, along with any alerts. 
The app uses geolocation to get local info on the first load, and then offers an option to search by city and state using the Google Geocoding API.
The NWS service is free, so I just fetched from the front-end. I made a simple express server for the search function that uses Google.

The simple design is mobile focused (I wanted a phone icon I can click when I wake up) but it looks fine in a browser too. 

