mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lzZGV2ZWxvcG1hcCIsImEiOiJjamZrdmp3bWYwY280MndteDg1dGlmdzF3In0.4m2zz_ISrUCXyz27MdL8_Q';





$(document).ready(function(){
    $('.modal').modal();
  });


$('#downloadLink').click(function() {
        var img = map.getCanvas().toDataURL('image/png')
        this.href = img
    })

$( ".scoring_section" ).click(function() {
  var instance = M.Collapsible.getInstance($('.country_scores_main')); 
instance.close();
});
$( "#country_name" ).click(function() {
  var instance = M.Collapsible.getInstance($('.manual_scores')); 
instance.close();
});

$(document).ready(function(){
    $('.tooltipped').tooltip();
  });
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });


  $( ".search_icon" ).click(function() {
    $( "#geocoder" ).slideToggle( "slow", function() {});
    $( "#country_var_dropdown" ).hide();
    $( ".sidebar" ).hide();
    $( ".calculation-box" ).hide();
  });

  $( ".legend_icon" ).click(function() {
    $( ".legend" ).slideToggle( "slow", function() {});
  });
  $( ".zoom_icon" ).click(function() {

map.flyTo({
    center: [20,20],
    zoom:1.5
});

});

var filterEl = document.getElementById('feature-filter');
var listingEl = document.getElementById('feature-listing');


function normalize(str) {
    return str.trim().toLowerCase();
}


function renderListings(features) {
  var empty = document.createElement("p");
  // Clear any existing listings
  // listingEl.innerHTML = "";
  if (features.length) {
    features.forEach(function (feature) {
      var prop = feature.properties;
      var item = document.createElement("a");
      item.href = prop.wikipedia;
      item.target = "_blank";
      item.textContent = prop.adm0_code + " (" + prop.adm0_code + ")";
      item.addEventListener("mouseover", function () {
        // Highlight corresponding feature on the map
        popup
          .setLngLat(getFeatureCenter(feature))
          .setText(
           'klajlkdas'
          )
          .addTo(map);
      });
     // listingEl.appendChild(item);
    });

    // Show the filter input
   // filterEl.parentNode.style.display = "block";
  } 
  // else if (features.length === 0 && filterEl.value !== "") {
  //   empty.textContent = "No results found";
  //  // listingEl.appendChild(empty);
  // }
//    else {
//     empty.textContent = "Drag the map to populate results";
//   //  listingEl.appendChild(empty);

//     // Hide the filter input
// //    filterEl.parentNode.style.display = "none";

//     // remove features filter***
//     map.setFilter("countries_timor", ["has", "id_gaul"]);
//   }
}


function getFeatureCenter(feature) {
	let center = [];
	let latitude = 0;
	let longitude = 0;
	let height = 0;
	let coordinates = [];
	feature.geometry.coordinates.forEach(function (c) {
		let dupe = [];
		if (feature.geometry.type === "MultiPolygon")
			dupe.push(...c[0]); //deep clone to avoid modifying the original array
		else 
			dupe.push(...c); //deep clone to avoid modifying the original array
		dupe.splice(-1, 1); //features in mapbox repeat the first coordinates at the end. We remove it.
		coordinates = coordinates.concat(dupe);
	});
	if (feature.geometry.type === "Point") {
		center = coordinates[0];
	}
	else {
		coordinates.forEach(function (c) {
			latitude += c[0];
			longitude += c[1];
		});
		center = [latitude / coordinates.length, longitude / coordinates.length];
	}

	return center;
}

function getUniqueFeatures(array, comparatorProperty) {
  var existingFeatureKeys = {};
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  var uniqueFeatures = array.filter(function (el) {
    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
      return false;
    } else {
      existingFeatureKeys[el.properties[comparatorProperty]] = true;
      return true;
    }
  });

  return uniqueFeatures;
}





var zoomThreshold = 4;

var bounds = [
[-180, -70], // Southwest coordinates
[180, 80] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [18, 23], // starting position[35.890, -75.664]
    zoom: 1.78, // starting zoom
    hash: true,
    minZoom: 1,
    maxZoom: 18,
    opacity: 0.1,
   

    preserveDrawingBuffer: true
});





var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
document.getElementById('geocoder').addEventListener('click', function () {

  map.flyTo({
      center: [20,20],
      zoom:1.5
  });

});

var country_iso3_fi = "";
var country_id_fi = "";
var country_carbon = 0;
var country_water = 0;
var country_natural = 0;
var country_forest = 0;
var country_mammals= 0;
var country_th_mammals = 0;
var country_amphibians = 0;
var country_th_amphibians = 0;
var country_birds = 0;
var country_th_birds = 0;

var country_carbon_pa = 0;
var country_water_pa = 0;
var country_natural_pa = 0;
var country_forest_pa = 0;
var country_mammals_pa = 0;
var country_th_mammals_pa = 0;
var country_amphibians_pa = 0;
var country_th_amphibians_pa = 0;
var country_birds_pa = 0;
var country_th_birds_pa = 0;

map.on('load', function() {


  var busy_tabs ={ spinner: "pulsar",color:'#67aa26',background:'##ffffff63'};
 $("#map").busyLoad("show", busy_tabs);


  map.addSource('single-point', {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": []
          }
      });
      map.addLayer({
             "id": "point",
             "source": "single-point",
             "type": "circle",
             "paint": {
                 "circle-radius": 0,
                 "circle-color": "#007cbf"
             }
         });









var miolayer = map.getLayer('point');


        geocoder.on('result', function(ev) {
          map.getSource('single-point').setData(ev.result.geometry);

          var latlon = ev.result.center;
          console.info(latlon)
          var lat = latlon[0]
          var lon = latlon[1]
          var pointsel = map.project(latlon)

          var ll = new mapboxgl.LngLat(lat, lon);
        

    map.fire('click', { lngLat: ll, point:pointsel })



        });


  
        map.addLayer({
          "id": "eez_land",
          "type": "fill",
          "source": {
              "type": "vector",
              "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=hotspots:eez_land&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
              },
          "source-layer": "eez_land",
    
          'paint': { 
            'fill-color': '#21313f',
            'fill-outline-color': '#ffffff',
            
         
            'fill-opacity': 0.1,
    
    
                    }
    
      }, 'waterway-label');
      
      map.addLayer({
        "id": "countries_timor",
        "type": "fill",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:countries_timor&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "countries_timor",
  
        'paint': { 
          'fill-color': '#618135',
          'fill-outline-color': '#cbcbcb',
          
       
          'fill-opacity': 0.0,
  
  
                  }
  
    }, 'waterway-label');


  map.addLayer({
      "id": "dopa_geoserver_wdpa_master_202101_o1",
      "type": "fill",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_wdpa_master_202101_o1&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "dopa_geoserver_wdpa_master_202101_o1",

      'paint': { 
        'fill-color': '#ffffff',
       // 'fill-outline-color': 'black',
    
                      'fill-opacity': 0.1,


                },
                'filter': ["in", "iso3",'xxx'],

  }, 'waterway-label');



 map.addLayer({
        "id": "grid_points_3",
        "type": "circle",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:points_timor_3857_final&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "points_timor_3857_final",
        'paint': {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': {
            'base': 1,
            'stops': [[9, 3], [12, 9]]
          }, 'circle-color': '#ffffff',


         'circle-opacity': 0.0
      },//"filter":["in", "id_gaul", ""]

      'filter': [
  'all',
  ["in", "adm0_code", ""],
  ["==", "protected", 0]
],

    }, 'waterway-label');


    map.addLayer({
      "id": "pa_buf",
      "type": "circle",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:buf_in_pa_points&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "buf_in_pa_points",
      'paint': {
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
        'base': 2,
        'stops': [[1, 2], [7, 4]]
        }, 'circle-color': '#595958',

       'circle-opacity': 0.8
    },//"filter":["in", "id_gaul", ""]

    'filter': ["in", "adm0_code",0],

  }, 'waterway-label');


    map.addLayer({
        "id": "point_selecte_by_drow",
        "type": "circle",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:points_timor_3857_final&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "points_timor_3857_final",
        'paint': {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': {
            'base': 4,
            'stops': [[1, 5], [10, 8]]
          },
        'circle-color': '#3bb2d0',

         'circle-opacity': 0.4
      },"filter":["in", "adm0_code", ""]

    }, 'grid_points_3');



    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var country_iso3 = urlParams.get('iso3')
 
  
    var pa_bb_url = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:global_dashboard&propertyname=iso3_digit&SORTBY=iso3_digit&CQL_FILTER=iso3_digit='"+country_iso3+"'&outputFormat=application%2Fjson";

     console.log(pa_bb_url)
    $.ajax({
        url: pa_bb_url,
        dataType: 'json',
        success: function(d) {
           
               
                
                var x1 = d.features[0].properties.bbox[0];
                var x2 = d.features[0].properties.bbox[1];
                var x3 = d.features[0].properties.bbox[2];
                var x4 = d.features[0].properties.bbox[3];


                map.fitBounds([[x3,x4],[x1,x2]])
                console.log([[x3,x4],[x1,x2]])

                

              
          },
      });
    setTimeout(function(){

      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var country_iso3 = urlParams.get('iso3')
      
     
      if (window.location.href.indexOf("iso3") === -1){
        lat = 0
        lon = 0
        center = {lng: lat, lat: lon}
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
         //map.fire('click', { lngLat: ll, point:pointsel });
         console.log('not contains');

     } else if (country_iso3 == 'ZAF'){
         lat = 24.068403959235123
         lon = -28.562333017576503
         center = {lng: lat, lat: lon}
         var pointsel = map.project(center)
         var ll = new mapboxgl.LngLat(lat, lon);
          map.fire('click', { lngLat: ll, point:pointsel });

      }else if (country_iso3 == 'none'){
        var lat = 0
        var lon = 0
        var center = {lng: lat, lat: lon}
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
         map.fire('click', { lngLat: ll, point:pointsel });

      }else if (country_iso3 == 'MUS'){
        var lat = 57.592538267076755
        var lon = -20.192766088557114
        var center = {lng: lat, lat: lon}
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
         map.fire('click', { lngLat: ll, point:pointsel });

      }else if (country_iso3 == 'SYC'){
        var lat = 55.433713811593364
        var lon = -4.664264279221321
        var center = {lng: lat, lat: lon}
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
         map.fire('click', { lngLat: ll, point:pointsel });

    } else if (country_iso3 == 'GNQ'){
      var lat = 10.517198860924937
      var lon = 1.982785417107303
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'STP'){
      var lat = 6.599228989623238
      var lon = 0.2768292166420331
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'CPV'){
      var lat = -23.66664947403996
      var lon = 15.19555442269046
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'SOM'){
      var lat = 46.90586281053625
      var lon = 5.262086271394449
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'ERI'){
      var lat = 37.665538175195906
      var lon = 16.00674279273751
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'COM'){
      var lat = 43.368547800451964
      var lon = -11.767354513892208
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'PNG'){
      var lat = 141.91254159701143
      var lon = -5.7666655016341615
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'SLB'){
      var lat = 160.36470405139775
      var lon = -9.586390252866515
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'VUT'){
      var lat = 166.9386801114716
      var lon = -15.36718882463175
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'PLW'){
      var lat = 134.6023665250489
      var lon = 7.4589986097636425
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'FSM'){
      var lat = 158.23026641717198
      var lon = 6.830893203220437
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'MHL'){
      var lat = 171.03316428511255
      var lon = 7.146893876413832
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'NRU'){
      var lat = 166.93300709635
      var lon = -0.5257484213832155
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'TLS'){
      var lat = 125.74839572870188
      var lon = -8.839867883985399
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'KIR'){
      var lat = -157.31094001429233
      var lon = 1.7811219868104433
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'VUT'){
      var lat = 166.97044088621308
      var lon = -15.359745949063809
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'FJI'){
      var lat = 177.9544280945876
      var lon = -17.726728040859868
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'TON'){
      var lat = -175.2788904105639
      var lon = -21.148837242223006
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'WSM'){
      var lat = -172.5314373825694
      var lon = -13.606221090613227
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'COK'){
      var lat = -159.7852082237218
      var lon = -21.231592093510802
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'VCT'){
      var lat = -61.18181223000158
      var lon = 13.197492744720046
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'ATG'){
      var lat = -61.84074475257815
      var lon = 17.068591463982266
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'KNA'){
      var lat = -62.79566896446716
      var lon = 17.353753372573642
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'HTI'){
      var lat = -72.31586432746077
      var lon = 19.296380400272675
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'BHS'){
      var lat = -78.0785019544703
      var lon = 24.82732905490521
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else if (country_iso3 == 'CUB'){
      var lat = -79.8253281498722
      var lon = 22.320307165020424
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    } else if (country_iso3 == 'GIN'){
      var lat = -13.969951315189824
      var lon = 10.91795490707956
      var center = {lng: lat, lat: lon}
      var pointsel = map.project(center)
      var ll = new mapboxgl.LngLat(lat, lon);
       map.fire('click', { lngLat: ll, point:pointsel });
    
    }else{
        var center = map.getCenter().wrap()
        var lat = center.lat
        var lon = center.lng
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
         map.fire('click', { lngLat: ll, point:pointsel });
    }




    }, 4000);
      

    map.on("moveend", function () {
    var features = map.queryRenderedFeatures({ layers: ["countries_timor"] });

    if (features) {
      var uniqueFeatures = getUniqueFeatures(features, "adm0_code");
      // Populate features for the listing overlay.
      renderListings(uniqueFeatures);

      // Clear the input container
     // filterEl.value = "";

      // Store the current features in sn `airports` variable to
      // later use for filtering on `keyup`.
      airports = uniqueFeatures;
    }
  });

  map.on("mousemove", "countries_timor", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Populate the popup and set its coordinates based on the feature.
    var feature = e.features[0];
    var country_name = e.features[0].properties.adm0_name;
    var carbon = e.features[0].properties.carbon_a;
    var water = e.features[0].properties.water_a;
    var forest = e.features[0].properties.forest_a;
    var natural = e.features[0].properties.nat_a;
    var mammals = e.features[0].properties.mam_a;
    var mammals_th = e.features[0].properties.th_mam_a;
    var amphibians = e.features[0].properties.amp_a;
    var amphi_th = e.features[0].properties.th_amp_a;
    var birds = e.features[0].properties.birds_a; 
    var birds_th = e.features[0].properties.th_birds_a; 

    var carbon_w = carbon*100;
    var water_w = water*100;
    var forest_w = forest*100;
    var natural_w = natural*100;
    var mammals_w = mammals*100;
    var mammals_th_w = mammals_th*100;
    var amphibians_w = amphibians*100;
    var amphi_th_w = amphi_th*100;
    var birds_w = birds*100; 
    var birds_th_w = birds_th*100;
    popup.setLngLat(e.lngLat).setHTML(
          " <ul><li><div id = 'country_scores_main_b'>Average Conservation Score outside PAs for <b>"+country_name+"</b></div>"+
                "<div><span class = 'coll_item_title' > Carbon ("+carbon.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+carbon_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Water presence ("+water.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+water_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Natural Areas ("+natural.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+natural_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Intact Forests ("+forest.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+forest_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Mammals Richness ("+mammals.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+mammals_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Threatened Mammals Richness ("+mammals_th.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+mammals_th_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Amphibians Richness ("+amphibians.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+amphibians_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Threatened Amphibians Richness ("+amphi_th.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+amphi_th_w+"%'></div></div>"+
                  "<span class = 'coll_item_title' > Birds Richness ("+birds.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+birds_w+"%'></div></div>"+         
                  "<span class = 'coll_item_title' > Threatened Birds Richness ("+birds_th.toLocaleString()+")</span>"+
                  "<div id='progressbar'><div style='width:"+birds_th_w+"%'></div></div>"+        
                  "<hr><div class = 'total_score' > <b>"+((birds_th+birds+amphi_th+amphibians+mammals_th+mammals+forest+natural+water+carbon).toLocaleString())+"</div>"+ 
                  "</div></li></ul>"

        ).addTo(map);
  });

  map.on("mouseleave", "countries_timor", function () {
    map.getCanvas().style.cursor = "";
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

//   map.on('zoom', function() {
//     $("#map").busyLoad("show", busy_tabs);
//     var tilesLoaded = map.areTilesLoaded();
//   if (tilesLoaded == true){
//     setTimeout(function(){
//       $("#map").busyLoad("hide", {animation: "fade"});
//    console.log('3')
//     }, 1000);
//   }else{
//     setTimeout(function(){
//       $("#map").busyLoad("hide", {animation: "fade"});
//       console.log('5')
//     }, 3000);
     
//   }
// });
  
  var tilesLoaded = map.areTilesLoaded();
  if (tilesLoaded == true){
    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
   console.log('3')
    }, 300);

 }else{
    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
      console.log('5')
    }, 1000);
     
  }


// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});
 




map.on('mouseenter', 'grid_points_3', function (e) {

  console.log(e);
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = 'pointer';
 
var coordinates = e.features[0].geometry.coordinates.slice();
var carbon = e.features[0].properties.carbon;
var water = e.features[0].properties.water;
var forest = e.features[0].properties.forest;
var natural = e.features[0].properties.natural;
var mammals = e.features[0].properties.mammals;
var mammals_th = e.features[0].properties.mammals_th;
var amphibians = e.features[0].properties.amphibians;
var amphi_th = e.features[0].properties.amphi_th;
var birds = e.features[0].properties.birds; 
var birds_th = e.features[0].properties.birds_th; 

var carbon_w = (e.features[0].properties.carbon)*100;
var water_w = (e.features[0].properties.water)*100;
var forest_w = (e.features[0].properties.forest)*100;
var natural_w = (e.features[0].properties.natural)*100;
var mammals_w = (e.features[0].properties.mammals)*100;
var mammals_th_w = (e.features[0].properties.mammals_th)*100;
var amphibians_w = (e.features[0].properties.amphibians)*100;
var amphi_th_w = (e.features[0].properties.amphi_th)*100;
var birds_w = (e.features[0].properties.birds)*100; 
var birds_th_w = (e.features[0].properties.birds_th)*100; 
// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
// Populate the popup and set its coordinates
// based on the feature found.
popup.setLngLat(coordinates).setHTML(
  
  " <ul><li><div id = 'country_scores_main_b'>Conservation Score</div>"+
        "<div><span class = 'coll_item_title' > Carbon ("+carbon.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+carbon_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Water presence ("+water.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+water_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Natural Areas ("+natural.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+natural_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Intact Forests ("+forest.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+forest_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Mammals Richness ("+mammals.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+mammals_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Threatened Mammals Richness ("+mammals_th.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+mammals_th_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Amphibians Richness ("+amphibians.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+amphibians_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Threatened Amphibians Richness ("+amphi_th.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+amphi_th_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Birds Richness ("+birds.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+birds_w+"%'></div></div>"+        
          "<span class = 'coll_item_title' > Threatened Birds Richness ("+birds_th.toLocaleString()+")</span>"+
          "<div id='progressbar'><div style='width:"+birds_th_w+"%'></div></div>"+   
          "<hr><div class = 'total_score' > <b>"+((birds_th+birds+amphi_th+amphibians+mammals_th+mammals+forest+natural+water+carbon).toLocaleString())+"</div>"+ 
         
          "</div></li></ul>"

).addTo(map);
});
 
map.on('mouseleave', 'grid_points_3', function () {
map.getCanvas().style.cursor = '';
popup.remove();
});



// just to test  on the fly repaint for countries
var layer_country = document.getElementById('layer_country');
layer_country.addEventListener('change', function() {
  var layer_country_value = document.getElementById('layer_country').value;
  map.setPaintProperty('countries_timor', 'fill-color', ['interpolate',['linear'],['get', layer_country_value],0, '#ffffd4',10, '#ffefb5',50, '#ffde96',100, '#fec46c',150, '#fea73f',250, '#f68c23',350, '#e67217',500, '#d25a0c',750, '#b64708',1000, '#993404']);
});



// this is the submit button that collect all the scores and repaint points
$('#dddd').hide();





var max_carbon = 0
var max_water = 0
var max_natural = 0
var max_forest = 0
var max_mammals = 0
var max_amphibians = 0
var max_birds = 0
var max_th_birds = 0
var max_th_mammals = 0
var max_th_amphibians = 0

var min_carbon = 0
var min_water = 0
var min_natural = 0
var min_forest = 0
var min_mammals = 0
var min_amphibians = 0
var min_birds = 0
var min_th_birds = 0
var min_th_mammals = 0
var min_th_amphibians = 0

var mean_carbon = 0
var mean_water = 0
var mean_natural = 0
var mean_forest = 0
var mean_mammals = 0
var mean_amphibians = 0
var mean_th_birds = 0
var mean_th_mammals = 0
var mean_th_amphibians = 0

function count_points(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var count = features.length;
  return count
};





function carbon_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.carbon);
        var max = Math.max.apply(null, vals);
        return max
};
function water_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.water);
        var max = Math.max.apply(null, vals);
        return max
};
function natural_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.natural);
        var max = Math.max.apply(null, vals);
        return max
};
function forest_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.forest);
        var max = Math.max.apply(null, vals);
        return max
};
function mammals_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.mammals);
        var max = Math.max.apply(null, vals);
        return max
};
function amphibians_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.amphibians);
        var max = Math.max.apply(null, vals);
        return max
};
function th_mammals_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.mammals_th);
        var max = Math.max.apply(null, vals);
        return max
};
function th_amphibians_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.amphi_th);
        var max = Math.max.apply(null, vals);
        return max
};
function birds_max(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.birds);
        var max = Math.max.apply(null, vals);
        return max
};

function th_birds_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.birds_th);
  var max = Math.max.apply(null, vals);
  return max
};






function carbon_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.carbon);
        var min = Math.min.apply(null, vals);
        return min
};
function water_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.water);
        var min = Math.min.apply(null, vals);
        return min
};
function natural_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.natural);
        var min = Math.min.apply(null, vals);
        return min
};
function forest_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.forest);
        var min = Math.min.apply(null, vals);
        return min
};
function mammals_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.mammals);
        var min = Math.min.apply(null, vals);
        return min
};
function amphibians_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.amphibians);
        var min = Math.min.apply(null, vals);
        return min
};
function th_mammals_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.mammals_th);
        var min = Math.min.apply(null, vals);
        return min
};
function th_amphibians_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.amphi_th);
        var min = Math.min.apply(null, vals);
        return min
};
function birds_min(){
        var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
        var vals = features.map(f => f.properties.birds);
        var min = Math.min.apply(null, vals);
        return min
};
function th_birds_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.birds_th);
  var min = Math.min.apply(null, vals);
  return min
};




function carbon_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.carbon);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;
    return mean
};
function water_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.water);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;
    return mean
};
function natural_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.natural);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;
    return mean
};
function forest_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.forest);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;  
    return mean
};
function mammals_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.mammals);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;   
      return mean
};
function amphibians_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.amphibians);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length; 
      return mean
};
function th_mammals_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.mammals_th);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length; 
      return mean
};
function th_amphibians_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.amphi_th);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;   
      return mean
};
function birds_mean(){
    var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
    var vals = features.map(f => f.properties.birds);
    var total = 0;
      for(var i = 0; i < vals.length; i++) {
          total += vals[i];
      }
      var mean = total / vals.length;  
      return mean
};

function th_birds_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.birds_th);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;  
    return mean
};




// mario

$("#country_name").click(function(){
 
  $(document).ready(function()
    {
      $("#carbon_value").html(1);
      $('#carbon_slider').val(1);
      $('.delvarico-carbon').html("clear");
      $('.range-field-carbon').css('opacity', '1');

      $("#water_value").html(1);
      $('#water_slider').val(1);
      $('.delvarico-water').html("clear");
      $('.range-field-water').css('opacity', '1');

      $("#natural_value").html(1);
      $('#natural_slider').val(1);
      $('.delvarico-natural').html("clear");
      $('.range-field-natural').css('opacity', '1');
      $("#forest_value").html(1);
      $('#forest_slider').val(1);
      $('.delvarico-forest').html("clear");
      $('.range-field-forest').css('opacity', '1');
      $("#mammals_value").html(1);
      $('#mammals_slider').val(1);
      $('.delvarico-mammals').html("clear");
      $('.range-field-mammals').css('opacity', '1');
      $("#mammals_th_value").html(1);
      $('#mammals_th_slider').val(1);
      $('.delvarico-th_mammals').html("clear");
      $('.range-field-th_mammals').css('opacity', '1');
      $("#amphibians_value").html(1);
      $('#amphibians_slider').val(1);
      $('.delvarico-amphibians').html("clear");
      $('.range-field-amphibians').css('opacity', '1');
      $("#amphibians_th_value").html(1);
      $('#amphibians_th_slider').val(1);
      $('.delvarico-th_amphibians').html("clear");
      $('.range-field-th_amphibians').css('opacity', '1');
      $("#birds_value").html(1);
      $('#birds_slider').val(1);
      $('.delvarico-birds').html("clear");
      $('.range-field-birds').css('opacity', '1');
      $("#birds_th_value").html(1);
      $('#birds_th_slider').val(1);
      $('.delvarico-th_birds').html("clear");
      $('.range-field-th_birds').css('opacity', '1');

    $('#carbon_slider').val(1);
    $('#water_slider').val(1);
    $('#natural_slider').val(1);
    $('#forest_slider').val(1);
    $('#mammals_slider').val(1);
    $('#mammals_th_slider').val(1);
    $('#amphibians_slider').val(1);
    $('#amphibians_th_slider').val(1);
    $('#birds_slider').val(1);
    $('#birds_th_slider').val(1);
    

    });


  

setTimeout(function(){
    $('#submit').click();
    
        }, 1000);

});



  

  map.on('click', 'countries_timor', function(e) {

    window.history.replaceState(null, null, "?iso3="+e.features[0].properties.iso3);
    var pa_bb_url = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:global_dashboard&propertyname=iso3_digit&SORTBY=iso3_digit&CQL_FILTER=iso3_digit='"+e.features[0].properties.iso3+"'&outputFormat=application%2Fjson";

     console.log(pa_bb_url)
    $.ajax({
        url: pa_bb_url,
        dataType: 'json',
        success: function(d) {
           
               
                
                var x1 = d.features[0].properties.bbox[0];
                var x2 = d.features[0].properties.bbox[1];
                var x3 = d.features[0].properties.bbox[2];
                var x4 = d.features[0].properties.bbox[3];


                map.fitBounds([[x3,x4],[x1,x2]])
                console.log([[x3,x4],[x1,x2]])

                

              
          },
      });



      map.setFilter('pa_buf', ["in", 'adm0_code', 0]);

      $("#map").busyLoad("show", busy_tabs);
      map.setPaintProperty(
      'grid_points_3',
      'circle-opacity',0,
      'circle-color', '#ffffff');
  
    setTimeout(function(){
    $('#country_name').click();

        }, 2000);

    // map.setPaintProperty('grid_points_3', 'circle-color', '#ffffff');
    
    $(document).ready(function(){
    $('.collapsible').collapsible();
  });
   
    $( "#country_var_dropdown" ).hide();
    $( ".geocoder" ).hide();
    $( ".top_dropdown" ).show();
    $( "#polygon_out_main" ).empty();
    $( "#polygon_out_main_2" ).empty();
    $( ".calculation-box" ).hide();


    var filter_wdpa = ["in", 'iso3', 'xxx'];
      map.setFilter('dopa_geoserver_wdpa_master_202101_o1', filter_wdpa);



  // For Range input
  $("#carbon_slider").on("input", function() {
    var carbon = this.value;
    $("#carbon_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#water_slider").on("input", function() {
    var carbon = this.value;
    $("#water_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#natural_slider").on("input", function() {
    var carbon = this.value;
    $("#natural_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#forest_slider").on("input", function() {
    var carbon = this.value;
    $("#forest_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#mammals_slider").on("input", function() {
    var carbon = this.value;
    $("#mammals_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#mammals_th_slider").on("input", function() {
    var carbon = this.value;
    $("#mammals_th_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#amphibians_slider").on("input", function() {
    var carbon = this.value;
    $("#amphibians_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#amphibians_th_slider").on("input", function() {
    var carbon = this.value;
    $("#amphibians_th_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#birds_slider").on("input", function() {
    var carbon = this.value;
    $("#birds_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });
  $("#birds_th_slider").on("input", function() {
    var carbon = this.value;
    $("#birds_th_value").html(carbon);
    $('#submit').css('background-color','#bd6116').css('color','#ffffff')
  });

      if (e.features.length > 0) {

    // compute variable values for country 
          function cid () {
            var feature = e.features[0];
             country_id_fi = feature.properties.adm0_code;
              return country_id_fi;
          }
          function ciso3 () {
            var feature = e.features[0];
             country_iso3_fi = feature.properties.iso3;
              return country_iso3_fi;
          }
        
          function c_carbon () {
            var feature = e.features[0];
             country_carbon = feature.properties.carbon_a;
              return country_carbon;
          }
          function c_water () {
            var feature = e.features[0];
             country_water = feature.properties.water_a;
              return country_water;
          }
          function c_natural () {
            var feature = e.features[0];
             country_natural = feature.properties.nat_a;
              return country_natural;
          }
          function c_forest () {
            var feature = e.features[0];
             country_forest = feature.properties.forest_a;
              return country_forest;
          }
          function c_mammals () {
            var feature = e.features[0];
             country_mammals = feature.properties.mam_a;
              return country_mammals;
          }
          function c_th_mammals () {
            var feature = e.features[0];
             country_th_mammals = feature.properties.th_mam_a;
              return country_th_mammals;
          }
          console.log(c_th_mammals ());
          function c_amphibians () {
            var feature = e.features[0];
             country_amphibians = feature.properties.amp_a;
              return country_amphibians;
          }
          function c_birds () {
            var feature = e.features[0];
             country_birds = feature.properties.birds_a;
              return country_birds;
          }
          function c_th_birds () {
            var feature = e.features[0];
             country_th_birds = feature.properties.th_birds_a;
              return country_th_birds;
          }
          function c_th_amphibians () {
            var feature = e.features[0];
             country_th_amphibians = feature.properties.th_amp_a;
              return country_th_amphibians;
          }

// compute variable values for pa in country 
          function c_carbon_pa () {
            var feature = e.features[0];
             country_carbon_pa = feature.properties.carbon_a_p;
              return country_carbon_pa;
          }
          function c_water_pa () {
            var feature = e.features[0];
             country_water_pa = feature.properties.water_a_p;
              return country_water_pa;
          }
          function c_natural_pa () {
            var feature = e.features[0];
             country_natural_pa = feature.properties.nat_a_p;
              return country_natural_pa;
          }
          function c_forest_pa () {
            var feature = e.features[0];
             country_forest_pa = feature.properties.forest_a_p;
              return country_forest_pa;
          }
          function c_mammals_pa () {
            var feature = e.features[0];
             country_mammals_pa = feature.properties.mam_a_p;
              return country_mammals_pa;
          }
          function c_th_mammals_pa () {
            var feature = e.features[0];
             country_th_mammals_pa = feature.properties.th_mam_a_p;
              return country_th_mammals_pa;
          }
          function c_amphibians_pa () {
            var feature = e.features[0];
             country_amphibians_pa = feature.properties.amp_a_p;
              return country_amphibians_pa;
          }
          function c_birds_pa () {
            var feature = e.features[0];
             country_birds_pa = feature.properties.birds_a_p;
              return country_birds_pa;
          }
          function c_th_birds_pa () {
            var feature = e.features[0];
             country_th_birds_pa = feature.properties.th_birds_a_p;
              return country_th_birds_pa;
          }
          function c_th_amphibians_pa () {
            var feature = e.features[0];
             country_th_amphibians_pa = feature.properties.th_amp_a_p;
              return country_th_amphibians_pa;
          }


      var feature = e.features[0];
      var country_id = feature.properties.adm0_code;
      var country_name = feature.properties.adm0_name;
      var carbon_f = feature.properties.carbon_a;
      var water_f = feature.properties.water_a;
      var natural_f = feature.properties.nat_a;
      var forest_f = feature.properties.forest_a;
      var mammals_f = feature.properties.mam_a;
      var th_mammals_f = feature.properties.th_mam_a;
      var amphibians_f = feature.properties.amp_a;
      var th_amphibians_f = feature.properties.th_amp_a;
      var birds_f = feature.properties.birds_a;
      var th_birds_f = feature.properties.th_birds_a;
 
      var all_country_avg_val = parseFloat(carbon_f+water_f+natural_f+forest_f+mammals_f+th_mammals_f+amphibians_f+th_amphibians_f+birds_f+th_birds_f)

      var all_country_val = feature.properties.all_avg_tot;
      console.log(feature.properties)
 
      var up_all_country_avg_val = parseFloat(all_country_val)

      var carbon_f_p = feature.properties.carbon_a_p;
      var water_f_p = feature.properties.water_a_p;
      var natural_f_p = feature.properties.nat_a_p;
      var forest_f_p= feature.properties.forest_a_p;
      var mammals_f_p = feature.properties.mam_a_p;
      var th_mammals_f_p = feature.properties.th_mam_a_p;
      var amphibians_f_p = feature.properties.amp_a_p;
      var th_amphibians_f_p = feature.properties.th_amp_a_p;
      var birds_f_p = feature.properties.birds_a_p;
      var th_birds_f_p = feature.properties.th_birds_a_p;

      var pa_country_avg_val = parseFloat(carbon_f_p+water_f_p+natural_f_p+forest_f_p+mammals_f_p+th_mammals_f_p+amphibians_f_p+th_amphibians_f_p+birds_f_p+th_birds_f_p)

      //var perc_bio_prot = (100*pa_country_avg_val)/(all_country_avg_val+pa_country_avg_val)

      var carbon_f_w = (carbon_f*100);
      var water_f_w = (water_f*100);
      var natural_f_w = (natural_f*100);
      var forest_f_w = (forest_f*100);
      var mammals_f_w = (mammals_f*100);
      var th_mammals_f_w = (th_mammals_f*100);
      var amphibians_f_w = (amphibians_f*100);
      var th_amphibians_f_w= (th_amphibians_f*100);
      var birds_f_w = (birds_f*100);
      var th_birds_f_w = (th_birds_f*100);

      var carbon_f_w_p = (carbon_f_p*100);
      var water_f_w_p = (water_f_p*100);
      var natural_f_w_p = (natural_f_p*100);
      var forest_f_w_p = (forest_f_p*100);
      var mammals_f_w_p = (mammals_f_p*100);
      var th_mammals_f_w_p = (th_mammals_f_p*100);
      var amphibians_f_w_p = (amphibians_f_p*100);
      var th_amphibians_f_w_p= (th_amphibians_f_p*100);
      var birds_f_w_p= (birds_f_p*100);
      var th_birds_f_w_p= (th_birds_f_p*100);



      



      $('#country_name').empty().append("<div id='country_name_'><p>Average Conservation Score for "+feature.properties.adm0_name+"</p></div> "+
      "<div id = 'country_pop_main' class = 'card_custom country_pop_main_a'><div id='country_pop_title' class = 'section_out_title'> <p>Country overall</p> </div><div id='country_popx' class = 'section_out_number'> <p> "+up_all_country_avg_val.toFixed(2)+"</p> </div></div>"+
      "<div id = 'country_pop_main' class = 'card_custom country_pop_main_b'><div id='country_pop_title' class = 'section_out_title'> <p>Outside Protected Areas</p> </div><div id='country_popx2' class = 'section_out_number'> <p> "+all_country_avg_val.toFixed(2)+"</p> </div></div>"+
      "<div id = 'country_pop_main' class = 'card_custom country_pop_main_c'><div id='country_pop_title' class = 'section_out_title'> <p>Inside Protected Areas</p> </div><div id='country_popx' class = 'section_out_number'> <p> "+pa_country_avg_val.toFixed(2)+"</p> </div></div>"+

      " <ul class= 'collapsible country_scores_main '><li class='active'><div id = 'country_scores_main_b' class='collapsible-header country_scores_main_b'><i class='material-icons '>grain</i>Conservation resources</div>"+
        "<div class='collapsible-body'>"+
        "<div id='varlegend'><span class='square_var' style='background-color: #8ea67d'></span>Average value <b>outside</b> Protected Areas</div>"+
        "<div id='varlegend'><span class='square_var' style='background-color: #576e38'></span>Average value <b>inside</b> Protected Areas</div>"+
        "<hr>"+
          "<span class = 'coll_item_title' >Above and below ground carbon </span>"+
          "<div id='progressbar'><div style='width:"+carbon_f_w+"%'></div><em class = 'value_bar_c'>"+carbon_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+carbon_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+carbon_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Water Presence </span>"+
          "<div id='progressbar'><div style='width:"+water_f_w+"%'></div><em class = 'value_bar_c'>"+water_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+water_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+water_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Natural Areas </span>"+
          "<div id='progressbar'><div style='width:"+natural_f_w+"%'></div><em class = 'value_bar_c'>"+natural_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+natural_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+natural_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Intact Forest </span>"+
          "<div id='progressbar'><div style='width:"+forest_f_w+"%'></div><em class = 'value_bar_c'>"+forest_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+forest_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+forest_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Mammals Richness </span>"+
          "<div id='progressbar'><div style='width:"+mammals_f_w+"%'></div><em class = 'value_bar_c'>"+mammals_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+mammals_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+mammals_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Threatened Mammals Richness </span>"+
          "<div id='progressbar'><div style='width:"+th_mammals_f_w+"%'></div><em class = 'value_bar_c'>"+th_mammals_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+th_mammals_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+th_mammals_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Amphibians Richness </span>"+
          "<div id='progressbar'><div style='width:"+amphibians_f_w+"%'></div><em class = 'value_bar_c'>"+amphibians_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+amphibians_f_p.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+amphibians_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Threatened Amphibians Richness </span>"+
          "<div id='progressbar'><div style='width:"+th_amphibians_f_w+"%'></div><em class = 'value_bar_c'>"+th_amphibians_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+th_amphibians_f.toFixed(2)+"</em></div>"+
          "<div id='progressbar_p'><div style='width:"+th_amphibians_f_w_p+"%'></div></div>"+
          "<span class = 'coll_item_title' > Birds Richness </span>"+
          "<div id='progressbar'><div style='width:"+birds_f_w+"%'></div><em class = 'value_bar_c'>"+birds_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+birds_f_p.toFixed(2)+"</em></div>"+          
          "<div id='progressbar_p'><div style='width:"+birds_f_w_p+"%'></div></div>"+      
          "<span class = 'coll_item_title' >Threatened Birds Richness </span>"+
          "<div id='progressbar'><div style='width:"+th_birds_f_w+"%'></div><em class = 'value_bar_c'>"+th_birds_f.toFixed(2)+"</em> <em class = 'value_bar_p'> "+th_birds_f_p.toFixed(2)+"</em></div>"+          
          "<div id='progressbar_p'><div style='width:"+th_birds_f_w_p+"%'></div></div>"+  
          "</div></li></ul>");

      $('#custom_map_tools').empty().append("<div id = 'dddd'><div id ='btn_maps'>"+ 
        "<button type='button' class='btn btn-primary draw_rec_custom'><i class='far fa-square'></i></button>"+ 
        "<button type='button' class='btn btn-primary draw_custom'><i class='fas fa-draw-polygon'></i></button>"+ 
        "<button type='button' class='btn btn-secondary clean_custom'><i class='fas fa-trash-alt'></i></button>");
        
        $('#submit').text("Compute scores for "+country_name)


      if($('.sidebar').css('display') == 'none')
      {
      $('.sidebar').animate({height:'toggle'},350);

    }else{
      $('.sidebar').show();
 
    }

    function toggle(button)
{
  if(document.getElementById("1").value=="OFF"){
   document.getElementById("1").value="ON";}

  else if(document.getElementById("1").value=="ON"){
   document.getElementById("1").value="OFF";}
}

      //  var coordinates = feature.geometry.coordinates;
      var cfeatures = map.queryRenderedFeatures(e.point, { layers: ['countries_timor'] });
      var filter = cfeatures.reduce(function(memo, feature) {
             memo.push(feature.properties.adm0_code);
             return memo;
             var bounds = new mapboxgl.LngLatBounds();
             bounds.extend(feature.geometry.coordinates);
             map.fitBounds(bounds);
         }, ['!in', 'adm0_code']);
         map.setFilter("countries_timor", filter);


        var filter_points = ["in", 'adm0_code', country_id];
        map.setFilter('grid_points_3', filter_points);
    
      

    }




    $('.draw_custom').click(function(){
      $('.mapbox-gl-draw_trash').click();
        $('.mapbox-gl-draw_polygon').click();

    });
    $('.draw_rec_custom').click(function(){
      $('.mapbox-gl-draw_trash').click();
      $('.mapbox-gl-draw_polygon').click();
      setTimeout(function(){
        draw.changeMode('draw_rectangle');

        }, 300);
    });
    $('.clean_custom').click(function(){
        $('.mapbox-gl-draw_trash').click();
        map.setFilter('point_selecte_by_drow', ['==', 'fid', "" ]);
    });

  



  cid ();
  ciso3 ();
  c_carbon ();
  c_forest ();
  c_water ();
  c_natural ();
  c_mammals ();
  c_th_mammals ();
  c_amphibians ();
  c_th_amphibians ();
  c_birds ();
  c_th_birds();

  c_carbon_pa ();
  c_forest_pa ();
  c_water_pa ();
  c_natural_pa ();
  c_mammals_pa ();
  c_th_mammals_pa ();
  c_amphibians_pa ();
  c_th_amphibians_pa ();
  c_birds_pa ();
  c_th_birds_pa();

  $('input.checkbox_check').prop('checked', false);
  }); // map onclick function


  $('input.checkbox_check').change(function(){
    
      if ($('input.checkbox_check').is(':checked')) {
      var filter_points_2 = ['all',["in", 'adm0_code', country_id_fi],["!in", "protection", 1]];
      var filter_buff = ["in", 'adm0_code', country_id_fi];
      var filter_wdpa = ["in", 'iso3', country_iso3_fi];
      map.setFilter('dopa_geoserver_wdpa_master_202101_o1', filter_wdpa);
      map.setFilter('pa_buf', filter_buff);
      map.setFilter('grid_points_3', filter_points_2);
      setTimeout(function(){
      $("#submit").click();
      $('.country_sel_legend_title').html('Conservation Score in Country <br><b>Outside Protected Areas');
    },1000);

    }else{
      var filter_wdpa = ["in", 'iso3', 'xxx'];
      map.setFilter('dopa_geoserver_wdpa_master_202101_o1', filter_wdpa);
      var filter_points = ["in", 'adm0_code', country_id_fi];
      map.setFilter('grid_points_3', filter_points);
      map.setFilter('pa_buf', ["in", 'adm0_code', 0]);
      setTimeout(function(){
      $("#submit").click();
      $('.country_sel_legend_title').html('Conservation Score in Country');
    },1000);

    }
});

//-------------------------------------------submit

    
$('.delvarico-carbon').click(function() {
    var resetval = $("#carbon_value").html();
    if(resetval== 0){
    $("#carbon_value").html(1);
    $('#carbon_slider').val(1);
    $('.delvarico-carbon').html("clear");
    $('.range-field-carbon').css('opacity', '1');
    }else{
    $("#carbon_value").html(0);
    $('.delvarico-carbon').html("add");
    $('.range-field-carbon').css('opacity', '0');
    }});

    $('.delvarico-water').click(function() {
    var resetval = $("#water_value").html();
    if(resetval== 0){
    $("#water_value").html(1);
    $('#water_slider').val(1);
    $('.delvarico-water').html("clear");
    $('.range-field-water').css('opacity', '1');
    }else{
    $("#water_value").html(0);
    $('.delvarico-water').html("add");
    $('.range-field-water').css('opacity', '0');
    }});
    $('.delvarico-natural').click(function() {
    var resetval = $("#natural_value").html();
    if(resetval== 0){
    $("#natural_value").html(1);
    $('#natural_slider').val(1);
    $('.delvarico-natural').html("clear");
    $('.range-field-natural').css('opacity', '1');
    }else{
    $("#natural_value").html(0);
    $('.delvarico-natural').html("add");
    $('.range-field-natural').css('opacity', '0');
    }});

    $('.delvarico-forest').click(function() {
    var resetval = $("#forest_value").html();
    if(resetval== 0){
    $("#forest_value").html(1);
    $('#forest_slider').val(1);
    $('.delvarico-forest').html("clear");
    $('.range-field-forest').css('opacity', '1');
    }else{
    $("#forest_value").html(0);
    $('.delvarico-forest').html("add");
    $('.range-field-forest').css('opacity', '0');
    }});
    $('.delvarico-mammals').click(function() {
    var resetval = $("#mammals_value").html();
    if(resetval== 0){
    $("#mammals_value").html(1);
    $('#mammals_slider').val(1);
    $('.delvarico-mammals').html("clear");
    $('.range-field-mammals').css('opacity', '1');
    }else{
    $("#mammals_value").html(0);
    $('.delvarico-mammals').html("add");
    $('.range-field-mammals').css('opacity', '0');
    }});

    $('.delvarico-th_mammals').click(function() {
    var resetval = $("#mammals_th_value").html();
    if(resetval== 0){
    $("#mammals_th_value").html(1);
    $('#mammals_th_slider').val(1);
    $('.delvarico-th_mammals').html("clear");
    $('.range-field-th_mammals').css('opacity', '1');
    }else{
    $("#mammals_th_value").html(0);
    $('.delvarico-th_mammals').html("add");
    $('.range-field-th_mammals').css('opacity', '0');
    }});
    $('.delvarico-amphibians').click(function() {
    var resetval = $("#amphibians_value").html();
    if(resetval== 0){
    $("#amphibians_value").html(1);
    $('#amphibians_slider').val(1);
    $('.delvarico-amphibians').html("clear");
    $('.range-field-amphibians').css('opacity', '1');
    }else{
    $("#amphibians_value").html(0);
    $('.delvarico-amphibians').html("add");
    $('.range-field-amphibians').css('opacity', '0');
    }});
    $('.delvarico-th_amphibians').click(function() {
    var resetval = $("#amphibians_th_value").html();
    if(resetval== 0){
    $("#amphibians_th_value").html(1);
    $('#amphibians_th_slider').val(1);
    $('.delvarico-th_amphibians').html("clear");
    $('.range-field-th_amphibians').css('opacity', '1');
    }else{
    $("#amphibians_th_value").html(0);
    $('.delvarico-th_amphibians').html("add");
    $('.range-field-th_amphibians').css('opacity', '0');
    }});
    $('.delvarico-birds').click(function() {
    var resetval = $("#birds_value").html();
    if(resetval== 0){
    $("#birds_value").html(1);
    $('#birds_slider').val(1);
    $('.delvarico-birds').html("clear");
    $('.range-field-birds').css('opacity', '1');
    }else{
    $("#birds_value").html(0);
    $('.delvarico-birds').html("add");
    $('.range-field-birds').css('opacity', '0');
    }});
    $('.delvarico-th_birds').click(function() {
      var resetval = $("#birds_th_value").html();
      if(resetval== 0){
      $("#birds_th_value").html(1);
      $('#birds_th_slider').val(1);
      $('.delvarico-th_birds').html("clear");
      $('.range-field-th_birds').css('opacity', '1');
      }else{
      $("#birds_th_value").html(0);
      $('.delvarico-th_birds').html("add");
      $('.range-field-th_birds').css('opacity', '0');
      }});


$("#submit").click(function () { 

  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var country_iso3 = urlParams.get('iso3')
  var pa_bb_url = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:global_dashboard&propertyname=iso3_digit&SORTBY=iso3_digit&CQL_FILTER=iso3_digit='"+country_iso3+"'&outputFormat=application%2Fjson";
  $.ajax({
      url: pa_bb_url,
      dataType: 'json',
      success: function(d) {
              var x1 = d.features[0].properties.bbox[0];
              var x2 = d.features[0].properties.bbox[1];
              var x3 = d.features[0].properties.bbox[2];
              var x4 = d.features[0].properties.bbox[3];
              map.fitBounds([[x3,x4],[x1,x2]])
              console.log([[x3,x4],[x1,x2]])  
        },
    });

  map.setPaintProperty(
    'grid_points_3',
    'circle-opacity',1
  );

  setTimeout(function(){
    
  $('#submit').css('background-color','#708455').css('color','#ffffff')
  $(".clean_custom").click();
  setTimeout(function(){
        $('#dddd').fadeIn('slow');
        $('#downloadLink').fadeIn('slow');
  },1000);

  var tilesLoaded = map.areTilesLoaded();
  console.log(tilesLoaded);


    max_carbon = (carbon_max());
    max_water = (water_max());
    max_natural = (natural_max());
    max_forest = (forest_max());
    max_mammals = (mammals_max());
    max_amphibians = (amphibians_max());
    max_th_mammals = (th_mammals_max());
    max_th_amphibians = (th_amphibians_max());
    max_birds = (birds_max());
    max_th_birds = (th_birds_max());

    min_carbon = (carbon_min());
    min_water = (water_min());
    min_natural = (natural_min());
    min_forest = (forest_min());
    min_mammals = (mammals_min());
    min_amphibians = (amphibians_min());
    min_th_mammals = (th_mammals_min());
    min_th_amphibians = (th_amphibians_min());
    min_birds = (birds_min());
    min_th_birds = (th_birds_min());

    mean_carbon = (carbon_mean());
    mean_water = (water_mean());
    mean_natural = (natural_mean());
    mean_forest = (forest_mean());
    mean_mammals = (mammals_mean());
    mean_amphibians = (amphibians_mean());
    mean_th_mammals = (th_mammals_mean());
    mean_th_amphibians = (th_amphibians_mean());
    mean_birds = (birds_mean());
    mean_th_birds = (th_birds_mean());

    var score_carbon = $("#carbon_value").val();
    var score_water = $("#water_value").val();
    var score_natural = $("#natural_value").val();
    var score_forest = $("#forest_value").val();
    var score_mammals = $("#mammals_value").val();
    var score_th_mammals = $("#mammals_th_value").val();
    var score_amphibians = $("#amphibians_value").val();
    var score_th_ambhibians = $("#amphibians_th_value").val();
    var score_birds = $("#birds_value").val();
    var score_th_birds = $("#birds_th_value").val();

    var min_val = (min_carbon*score_carbon)+(min_water*score_water)+(min_natural*score_natural)+(min_forest*score_forest)+(min_mammals*score_mammals)+(min_amphibians*score_amphibians)+(min_th_mammals*score_th_mammals)+(min_th_amphibians*score_th_ambhibians)+(min_birds*score_birds)+(min_th_birds*score_th_birds)
    var max_val = (max_carbon*score_carbon)+(max_water*score_water)+(max_natural*score_natural)+(max_forest*score_forest)+(max_mammals*score_mammals)+(max_amphibians*score_amphibians)+(max_th_mammals*score_th_mammals)+(max_th_amphibians*score_th_ambhibians)+(max_birds*score_birds)+(max_th_birds*score_th_birds)
    var avg_val = (mean_carbon*score_carbon)+(mean_water*score_water)+(mean_natural*score_natural)+(mean_forest*score_forest)+(mean_mammals*score_mammals)+(mean_amphibians*score_amphibians)+(mean_th_mammals*score_th_mammals)+(mean_th_amphibians*score_th_ambhibians)+(mean_birds*score_birds)+(mean_th_birds*score_th_birds)



  
        if ($('input.checkbox_check').is(':checked')) {
          setTimeout(function(){
            $('.country_sel_legend_title').html('Conservation Score in Country <br><b>excluding Protected Areas');

            $('.legend').append("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
            "<div><span class='square_pa'style='background-color: #595958'></span>Protected Areas Boundaries</div>"+
            "</div>").children(':last').hide().fadeIn(2000);
          
    },100);
        
        }else{setTimeout(function(){
          $('#country_prot_legend').empty();
          $('.country_sel_legend_title').html('Conservation Score in Country');
        },200);
      }

      if (!isFinite(max_val)){
        $( ".legend" ).hide();
        $("#map").busyLoad("hide", {animation: "fade"});
        setTimeout(function(){
          $("#country_name").click();
          $("#map").busyLoad("show", busy_tabs);
          console.log('endinf')
      },10);
      }else{
        $("#map").busyLoad("hide", {animation: "fade"});
        $( ".legend" ).show();
      }

      if (parseFloat(max_val) == 0){
        map.setPaintProperty('grid_points_3', 'circle-color', '#ffffff');
        
        $('.legend').empty().append("<div id='country_sel_legend'> <p class='country_sel_legend_title'>Conservation Score in Country</p>"+
          "<div><span style='background-color: #FFFFFF'></span>"+min_val.toFixed(2)+"</div>"+
          "<div><span style='background-color: #FFFFFF'></span>"+avg_val.toFixed(2)+"</div>"+
          "<div><span style='background-color: #FFFFFF'></span>"+(max_val).toFixed(2)+"</div>"+
          "</div>");
      }
      else{
        map.setPaintProperty('grid_points_3', 'circle-color', 
      ['interpolate',['linear'], 
      ["+", 
      [ "*", ['get', 'carbon'],  parseInt(score_carbon)], 
      [ "*", ['get', 'water'],  parseInt(score_water)],
      [ "*", ['get', 'natural'],  parseInt(score_natural)],
      [ "*", ['get', 'forest'],  parseInt(score_forest)],
      [ "*", ['get', 'mammals'],  parseInt(score_mammals)],
      [ "*", ['get', 'mammals_th'],  parseInt(score_th_mammals)],
      [ "*", ['get', 'amphibians'],  parseInt(score_amphibians)],
      [ "*", ['get', 'amphi_th'],  parseInt(score_th_ambhibians)],
      [ "*", ['get', 'birds'],  parseInt(score_birds)],
      [ "*", ['get', 'birds_th'],  parseInt(score_th_birds)]
      ],

      min_val,"#f2690a",avg_val, "#E2EB16", max_val,"#12EB5D"]);

      var avg_leg_pos = (100*avg_val)/max_val
      var avg_leg_pos_gr = ((100*avg_val)/max_val)-10

      $('.legend').empty().append("<div id='country_sel_legend'> <p class='country_sel_legend_title'>Conservation Score in Country</p>"+
        "<div style='color: #dadada; font-size: 12px; float: left!important;'>"+min_val.toFixed(2)+"</div>"+
        "<div style='color: #dadada; font-size: 12px; float: left!important; margin-bottom: -30px; margin-left: "+avg_leg_pos_gr+"%;!important;'>"+avg_val.toFixed(2)+"</div>"+
        "<div style='color: #dadada; font-size: 12px; float: right!important;'>"+max_val.toFixed(2)+"</div>"+
        "<div class='LegendGradient' style='background-image: -webkit-linear-gradient(left,#ff0000 -25%,#E2EB16 50%,#12EB5D 75%)!important; clear: both;'></div>"+
       // "<hr><div class='legenddistrib' style='color: #dadada; font-size: 12px; text-align: center!important;'>"+Math.abs(avg_leg_pos-100).toFixed(1)+"% of locations holds above average values.</div>"+
        "</div>");

      }



   
      },1000);







});




}); // map on load function





//-----------------------------------------------------------   DRAW -------------------------------------------
var modes = MapboxDraw.modes;
modes.draw_rectangle = DrawRectangle.default;
var draw = new MapboxDraw({
modes: modes,
displayControlsDefault: false,
controls: {
    polygon: true,
    trash: true
}
});
map.addControl(draw);
map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

//-----------------------------------------------------------   CALCULATE AREA DROWN FEATURE -------------------------------------------

var DrewAreaArray = []
function updateArea(e) {
  DrewAreaArray=[]
    var data = draw.getAll();
    var last_element = data.features[data.features.length-1]
    if (data.features.length > 0) {
        var area = turf.area(last_element);
        var rounded_area = Math.round(area*100)/100;
        var km_area = rounded_area/1000000
        DrewAreaArray.push(km_area);
    } else {
        if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
    }
}

// $('.mapbox-gl-draw_polygon').click(function()
// {
//   draw.changeMode('draw_rectangle');
// })
//-----------------------------------------------------------   DRAW -------------------------------------------
map.on('draw.create', function(e){
  

    var userPolygon = e.features[0];
    console.log(userPolygon)
    // generate bounding box from polygon the user drew
    var polygonBoundingBox = turf.bbox(userPolygon);
    var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
    var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];
    var northEastPointPixel = map.project(northEast);
    var southWestPointPixel = map.project(southWest);
    var features = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['grid_points_3'] });

    // filter for highlight feature ------------------------------------------------------------------------------------------
    var filter_selected = features.reduce(function(memo, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0)
          memo.push(feature.properties.fid);
        }
        return memo;
    }, ['in', 'fid']);

    map.setFilter("point_selecte_by_drow", filter_selected);
    $('.clean_custom').css('color', '#dd4e11');



  

   // calculate carbon ------------------------------------------------------------------------------------------
    var carbon = features.reduce(function(print_carbon, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_carbon.push(feature.properties.carbon);
          }
        }
          return print_carbon;
    }, []);
    var CarbonTotal = 0;
    for(var i = 0, len = carbon.length; i < len; i++) {
      CarbonTotal += carbon[i]/len;
    }

    console.log(CarbonTotal)
   // calculate water ------------------------------------------------------------------------------------------
   var water = features.reduce(function(print_water, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_water.push(feature.properties.water);
          }
        }
          return print_water;
    }, []);
    var WaterTotal = 0;
    for(var i = 0, len = water.length; i < len; i++) {
      WaterTotal += water[i]/len;
    }
   // calculate forest ------------------------------------------------------------------------------------------
   var forest = features.reduce(function(print_forest, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_forest.push(feature.properties.forest);
          }
        }
          return print_forest;
    }, []);
    var ForestTotal = 0;
    for(var i = 0, len = forest.length; i < len; i++) {
      ForestTotal += forest[i]/len;
    }
   // calculate natural ------------------------------------------------------------------------------------------
   var natural = features.reduce(function(print_natural, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_natural.push(feature.properties.natural);
          }
        }
          return print_natural;
    }, []);
    var NaturalTotal = 0;
    for(var i = 0, len = natural.length; i < len; i++) {
      NaturalTotal += natural[i]/len;
    }
   // calculate mammals ------------------------------------------------------------------------------------------
   var mammals = features.reduce(function(print_mammals, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_mammals.push(feature.properties.mammals);
          }
        }
          return print_mammals;
    }, []);
    var MammalsTotal = 0;
    for(var i = 0, len = mammals.length; i < len; i++) {
      MammalsTotal += mammals[i]/len;
    }
    // calculate th mammals ------------------------------------------------------------------------------------------
    var th_mammals = features.reduce(function(print_th_mammals, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
    if (! (undefined === inside)) {
      if (inside.features.length>0){
        print_th_mammals.push(feature.properties.mammals_th);
      }
    }
      return print_th_mammals;
    }, []);
    var ThMammalsTotal = 0;
    for(var i = 0, len = th_mammals.length; i < len; i++) {
    ThMammalsTotal += th_mammals[i]/len;
    }

   // calculate birds ------------------------------------------------------------------------------------------
   var birds = features.reduce(function(print_birds, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_birds.push(feature.properties.birds);
          }
        }
          return print_birds;
    }, []);
    var BirdsTotal = 0;
    for(var i = 0, len = birds.length; i < len; i++) {
      BirdsTotal += birds[i]/len;
    }

       // calculate th birds ------------------------------------------------------------------------------------------
   var th_birds = features.reduce(function(print_th_birds, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_th_birds.push(feature.properties.birds_th);
        }
      }
        return print_th_birds;
  }, []);
  var ThBirdsTotal = 0;
  for(var i = 0, len = th_birds.length; i < len; i++) {
    ThBirdsTotal += th_birds[i]/len;
  }
       // calculate amphibians ------------------------------------------------------------------------------------------
   var amphibians = features.reduce(function(print_amphibians, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_amphibians.push(feature.properties.amphibians);
          }
        }
          return print_amphibians;
    }, []);
    var AmphibiansTotal = 0;
    for(var i = 0, len = amphibians.length; i < len; i++) {
      AmphibiansTotal += amphibians[i]/len;
    }
       // calculate th amphibians ------------------------------------------------------------------------------------------
       var th_amphibians = features.reduce(function(print_th_amphibians, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0){
            print_th_amphibians.push(feature.properties.amphi_th);
          }
        }
          return print_th_amphibians;
    }, []);
    var ThAmphibiansTotal = 0;
    for(var i = 0, len = th_amphibians.length; i < len; i++) {
      ThAmphibiansTotal += th_amphibians[i]/len;
    }


var score_carbon = $("#carbon_value").val();
var score_water = $("#water_value").val();
var score_natural = $("#natural_value").val();
var score_forest = $("#forest_value").val();
var score_mammals = $("#mammals_value").val();
var score_th_mammals = $("#mammals_th_value").val();
var score_amphibians = $("#amphibians_value").val();
var score_th_ambhibians = $("#amphibians_th_value").val();
var score_birds = $("#birds_value").val();
var score_th_birds = $("#birds_th_value").val();

// average biodiversity score is (sum of all variables * score)/number of variables
// $('#polygon_out_main').append('<div id="draw_title" class = "section_out_title"><p>Weighted scores for the area selected ('+(Math.round(DrewAreaArray[0]*100)/100).toLocaleString()+' km<sup>2</sup>)</p> </div><br>'
//   +'<div> '
//     +'<p class = "score_lable" >Carbon <em class = "score_value_print" >'+parseInt((CarbonTotal).toLocaleString())*score_carbon+'</em></p>'
//     +'<p class = "score_lable" >Water <em class = "score_value_print" >'+parseInt((WaterTotal).toLocaleString())*score_water+'</em></p>'
//     +'<p class = "score_lable" >Natural Areas <em class = "score_value_print" >'+parseInt((NaturalTotal).toLocaleString())*score_natural+'</em></p>'
//     +'<p class = "score_lable" >Intact Forest <em class = "score_value_print" >'+parseInt((ForestTotal).toLocaleString())*score_forest+'</em></p>'
//     +'<p class = "score_lable" >Mammals <em class = "score_value_print" >'+parseInt((MammalsTotal).toLocaleString())*score_mammals+'</em></p>'
//     +'<p class = "score_lable" >Endemic Threatened Mammals <em class = "score_value_print" >'+parseInt((ThMammalsTotal).toLocaleString())*score_th_mammals+'</em></p>'
//     +'<p class = "score_lable" >Amphibians <em class = "score_value_print" >'+parseInt((AmphibiansTotal).toLocaleString())*score_amphibians+'</em></p>'
//     +'<p class = "score_lable" >Endemic Threatened Amphibians <em class = "score_value_print" >'+parseInt((ThAmphibiansTotal).toLocaleString())*score_th_ambhibians+'</em></p>'
//     +'<p class = "score_lable" >Birds <em class = "score_value_print" >'+parseInt((BirdsTotal).toLocaleString())*score_birds+'</em></p>'
//   
//     +'</div>')
$( ".calculation-box" ).show();


   
  // $('.calculation-box_title').empty().append('<div id="draw_title" class = "section_out_title"><p>Biodiversity scores for this area </p> </div><br>')
  // $('.calculation-box_title_2').empty().append('<div id="draw_title" class = "section_out_title"><p>What makes this area special?</p> </div><br>')
  $('#polygon_out_main_area').empty().append('<p>'+(Math.round(DrewAreaArray[0]*100)/100).toLocaleString()+'</em> km<sup>2</sup></p>')
 


  setTimeout(function(){
    Highcharts.chart('polygon_out_main', {
    chart: {
        type: 'column',
        zoomType: 'xy',
        backgroundColor: 'transparent'
    },
    legend: {
      itemStyle: {
         fontSize:'12px',
         color: '#A0A0A0'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#444'
      }
   
},
    title:{
      text: null
      },
    xAxis: {
        categories: [
            'Carbon',
            'Water',
            'Natural Areas',
            'Intact Forest',
            'Mammals',
            'Threatened Mammals',
            'Amphibians',
            'Threatened Amphibians',
            'Birds',
            'Threatened Birds'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Score'
        }
    },
    colors:['#009933'],
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        // column: {
        //   stacking: 'normal',
        //     pointPadding: 0.2,
        //     borderWidth: 0
        // }
    },
    series: [{
        name: 'Actual Score',
        color: '#78b022',
        data: [parseFloat((CarbonTotal)), parseFloat((WaterTotal)) , parseFloat((NaturalTotal)), 
        parseFloat((ForestTotal)), parseFloat((MammalsTotal)), parseFloat((ThMammalsTotal)), 
        parseFloat((AmphibiansTotal)), parseFloat((ThAmphibiansTotal)), parseFloat((BirdsTotal)), parseFloat((ThBirdsTotal))]

    },
    {
        name: 'Weighted Score',
        color: '#aebaba',
        data: [parseFloat(score_carbon)*CarbonTotal,parseFloat(score_water)*WaterTotal,parseFloat(score_natural)*NaturalTotal,
        parseFloat(score_forest)*ForestTotal,parseFloat(score_mammals)*MammalsTotal,parseFloat(score_th_mammals)*ThMammalsTotal,
        parseFloat(score_amphibians)*AmphibiansTotal,parseFloat(score_th_ambhibians)*ThAmphibiansTotal,parseFloat(score_birds)*BirdsTotal,parseFloat(score_th_birds)*ThBirdsTotal]

    }]


});



Highcharts.chart('polygon_out_main_2', {
  chart: {
        polar: true,
        type: 'column',
        zoomType: 'xy',
        backgroundColor: 'transparent',
        marginTop: 10
    },

    plotOptions: {
            series: {
                fillOpacity: 0.1
            }
        },

    title: {
        text: null
    },
    pane: {
        size: '80%',
        marginTop: 10
    },

    xAxis: {
        categories: ['Carbon', 'Natural Areas', 'Water Presence', 'Intact Forest',
            'Mammals Richness', 'Amphibians Richness', 'Birds Richness','Threatened Amphibians Richness', 'Threatened  Mammals Richness', 'Threatened Birds Richness'],
        tickmarkPlacement: 'on',
        lineWidth: 0

    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
          max: 1,
          tickInterval: 0.2,
          
    },

    tooltip: {
        shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.2f}</b><br/>'
    },

    legend: {
        align: 'bottom',
        verticalAlign: 'bottom',
        layout: 'vertical',
        itemStyle: {

          color: '#ffffff'
       }
    },

    series: [{
      marker: {
      enabled: false,
    },
        name: 'Area selected',
        color: '#47585a',
        data: [parseFloat((CarbonTotal)), parseFloat((NaturalTotal)), parseFloat((WaterTotal)),
        parseFloat((ForestTotal)), parseFloat((MammalsTotal)), parseFloat((AmphibiansTotal)), parseFloat((BirdsTotal)), 
        parseFloat((ThAmphibiansTotal)),parseFloat((ThMammalsTotal)), parseFloat((ThBirdsTotal))],
        pointPlacement: 'on',
        lineWidth : 1,
    }, {
      marker: {
      enabled: false,
    },
        name: 'Country',
        color: '#e47923',
        data: [country_carbon, country_natural, country_water, country_forest, country_mammals, country_amphibians, country_birds, country_th_amphibians, country_th_mammals, country_th_birds],
        pointPlacement: 'on',
        lineWidth : 1,
        type:'line',

    }, {
      marker: {
      enabled: false,
    },
        name: 'Protected areas',
        color: '#648a31',
        data: [country_carbon_pa, country_natural_pa, country_water_pa, country_forest_pa, country_mammals_pa, country_amphibians_pa, country_birds_pa, country_th_amphibians_pa, country_th_mammals_pa, country_th_birds_pa,],
        pointPlacement: 'on',
        lineWidth : 1,
        type:'line',
            dashStyle: 'ShortDash'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                },
                pane: {
                    size: '79%'
                }
            }
        }]
    }


});




},200);

$('.listings').animate({height:'show'},350);


});





$('.mapbox-gl-draw_polygon').click(function() {
$( "#polygon_out_main > div > p" ).empty();
 $("#listings").empty();
 $( "#polygon_out_main_2 > div > p" ).empty();
});
$('.mapbox-gl-draw_trash').click(function() {
$('#polygon_out_main > div').children("p").remove();
$('#polygon_out_main_ > div').children("p").remove();
 $("#listings").empty();


});



// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});

map.addControl(new mapboxgl.NavigationControl());


