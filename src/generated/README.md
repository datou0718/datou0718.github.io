# Generated travel coordinates

`travel-geocodes.json` stores verified coordinates for the location labels in
`content/travel.json`. Keys normalize case and spacing for cache reuse; values
contain only the provider's location ID, latitude, and longitude. The website
displays only the city name before the first comma in the owner's entry.

The cache is updated automatically during development/builds, or by
`npm run travel:resolve`. Commit it with new visits so later builds can work
offline. Edit the itinerary in `content/travel.json`.

Data: [GeoNames](https://www.geonames.org/), accessed through
[Open-Meteo](https://open-meteo.com/en/docs/geocoding-api), licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Coordinates are
stored unchanged; the map projects them for display. Source credits are
kept here rather than in the map controls.
