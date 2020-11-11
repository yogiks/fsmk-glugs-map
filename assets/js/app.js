var map, featureList, karSearch = [], glugSearch = [], ccenSearch = [];

$(document).on("click", ".feature-row", function(e) {
  sidebarClick(parseInt($(this).attr('id')));
});

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(kar.getBounds());
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sidebarClick(id) {
  map.addLayer(glugLayer).addLayer(ccenLayer);
  var layer = markerClusters.getLayer(id);
  markerClusters.zoomToShowLayer(layer, function() {
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
  });
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

/* Basemap Layers */
var OSM = L.tileLayer("https://{s}.tiles.mapbox.com/v4/yogiks.f4c44375/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoieW9naWtzIiwiYSI6IllrS3pnRFkifQ.ROiiCk0bg0VuNB6sCSxSWg", {
  maxZoom: 20,
  subdomains: ["a", "b", "c"],
  attribution: 'Tiles courtesy of <a href="https://mapbox.com" target="_blank">Mapbox</a> and map styled by Yogesh K S. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOSM = L.tileLayer("https://{s}.tiles.mapbox.com/v4/openstreetmap.1b68f018/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3NtLWluIiwiYSI6ImNqcnVxMTNrNTJwbHc0M250anUyOW81MjgifQ.cZnvZEyWT5AzNeO3ajg5tg", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://openstreetmap.in/" target="_blank">OSM India</a>. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);

var kar = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    karSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Karnataka",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/kar_state.geojson", function (data) {
  kar.addData(data);
});

// trying topolayer
// disabled districts
/*L.TopoJSON = L.GeoJSON.extend({  
  addData: function(jsonData) {    
    if (jsonData.type === "Topology") {
      for (key in jsonData.objects) {
        geojson = topojson.feature(jsonData, jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
});

var dist = new L.TopoJSON(null, {
  style: function (feature) {
    if (feature.properties.route_id === "1" || feature.properties.route_id === "2" || feature.properties.route_id === "3") {
      return {
        color: "#ff3135",
        weight: 2,
        opacity: 1.0
      };
    }    
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>State</th><td>" + feature.properties.NAME_1 + "</td></tr>" + "<tr><th>District</th><td>" + feature.properties.NAME_2 + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([e.latlng.lat, e.latlng.lng], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.0,
            radius: 10
          }));
        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 2,
          color: "#00FFFF",
          opacity: 1.0
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        dist.resetStyle(e.target);
      }
    });
  }
});

$.getJSON('data/kar_dists.topojson')
  .done(addTopoData);

function addTopoData(topoData){  
  dist.addData(topoData);
  // dist.addTo(map);
}*/


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove glugs to markerClusters layer */
var glugLayer = L.geoJson(null);
var glugs = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/glug.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>GLUG name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>College</th><td>" + feature.properties.college + "</td></tr>" + "<tr><th>GLUG Co-ordinator</th><td>" + feature.properties.coordinator + "</td></tr>" + "<tr><th>Student Co-ordinator(s)</th><td>" + feature.properties.student + "</td></tr>" + "<tr><th>GLUG Website</th><td><a class='url-break' href='" + feature.properties.web + "' target='_blank'>" + feature.properties.web + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/glug.png"></td><td class="feature-name">'+layer.feature.properties.name+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      glugSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.college,
        source: "glugs",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/GLUG.geojson", function (data) {
  glugs.addData(data);
  map.addLayer(glugLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove ccens to markerClusters layer */
var ccenLayer = L.geoJson(null);
var ccens = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/cc.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content =  "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name of the Center</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Volunteer(s)</th><td>" + feature.properties.volunteer + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.web + "' target='_blank'>" + feature.properties.web + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            stroke: false,
            fillColor: "#00FFFF",
            fillOpacity: 0.7,
            radius: 10
          }));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="'+L.stamp(layer)+'"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cc.png"></td><td class="feature-name">'+layer.feature.properties.name+'</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      ccenSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.volunteer,
        source: "ccens",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/CC.geojson", function (data) {
  ccens.addData(data);
});

map = L.map("map", {
  zoom: 8,
  center: [14.52038, 75.72239], // to change /
  layers: [OSM, kar, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === glugLayer) {
    markerClusters.addLayer(glugs);
  }
  if (e.layer === ccenLayer) {
    markerClusters.addLayer(ccens);
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === glugLayer) {
    markerClusters.removeLayer(glugs);
  }
  if (e.layer === ccenLayer) {
    markerClusters.removeLayer(ccens);
  }
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'></span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "icon-direction",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "OSM India": OSM,
  "MapQuest": mapquestOSM,
  "Imagery with Streets": mapquestHYB
};

var groupedOverlays = {
  "Interventions": {
    "<img src='assets/img/glug.png' width='24' height='28'>&nbsp;GLUGs": glugLayer,
    "<img src='assets/img/cc.png' width='24' height='28'>&nbsp;Community Centers": ccenLayer
  },
  "Reference": {
    "Karnataka": kar
    //"Districts": dist
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  /* Fit map to Karnataka bounds */
  map.fitBounds(kar.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var karBH = new Bloodhound({
    name: "Karnataka",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: karSearch,
    limit: 10
  });

  var glugsBH = new Bloodhound({
    name: "glugs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: glugSearch,
    limit: 10
  });

  var ccensBH = new Bloodhound({
    name: "ccens",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: ccenSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  karBH.initialize();
  glugsBH.initialize();
  ccensBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Karnataka",
    displayKey: "name",
    source: karBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Karnataka</h4>"
    }
  }, {
    name: "glugs",
    displayKey: "name",
    source: glugsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/glug.png' width='24' height='28'>&nbsp;GLUGs</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "ccens",
    displayKey: "name",
    source: ccensBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/cc.png' width='24' height='28'>&nbsp;Community Centers</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Karnataka") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "glugs") {
      if (!map.hasLayer(glugLayer)) {
        map.addLayer(glugLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "ccens") {
      if (!map.hasLayer(ccenLayer)) {
        map.addLayer(ccenLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});
