//0.Load the data
  // Store the API
let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2023-06-06%2000:00:00&endtime=2023-07-06%2023:59:59&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=2.5&orderby=time"
  // get request to the URL
d3.json(queryUrl).then(function(data){
    // pass the data to createFeatures Function
    console.log(data);
    createFeatures(data.features);
});

//1. get every 
function createFeatures(featuresdata){
    let earthquakeMarkers = []
    function getcolor(item){
      let depth = item.geometry.coordinates[2]
      if (depth < 10){return "#008000"}
      else if (depth < 30){return "#ADFF2F"}
      else if (depth <50){return "#FFA500"}
      else if(depth <70){return "#9E4638"}
      else if (depth <90){return "#7E3517" }
      else{return "#5C3317"}
    };
    function getsize(item){
      return Math.sqrt(item.properties.mag*item.properties.mag)*20000
    };
    function getlocation(item){
      return [item.geometry.coordinates[1],item.geometry.coordinates[0]]
    };

    for (let i =0; i < featuresdata.length; i++){
      earthquakeMarkers.push(
        L.circle(getlocation(featuresdata[i]),{
            fillOpacity: 0.75,
            color: "r#000",
            fillColor: getcolor(featuresdata[i]),
            radius:getsize(featuresdata[i])
        }).bindPopup(
          `<h1>Magnitude:${featuresdata[i].properties.mag}</h1> <hr> 
          <h3>Location: ${getlocation(featuresdata[i])}</h3><hr>
          <h3>Depth: ${featuresdata[i].geometry.coordinates[2]}</h3>`) )
    };
  let earthquakes = L.layerGroup(earthquakeMarkers);

    //tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
      //baseMap
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
      //overlay map
    let overlayMaps = {
      "Earthquake Stations": earthquakes
    };
      //map object
    let myMap = L.map("map",{
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
      //layer control
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
      //legend
      var legend = L.control({ position: 'bottomright' });
      legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML +=
          '<li style="background:#008000"></li>-10 - 10<br>' +
          '<li style="background:#ADFF2F"></li> 10-30<br>' +
          '<li style="background:#FFA500"></li> 30-50<br>' +
          '<li style="background:#9E4638"></li> 50-70<br>'+
          '<li style="background:#7E3517"></li> 70-90<br>'+
          '<li style="background:#5C3317"></li> 90+<br>';
        return div;
      };
      legend.addTo(myMap);
};
