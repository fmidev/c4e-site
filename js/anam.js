var endDate = new Date();
endDate.setUTCMinutes(0, 0, 0);

var map = L.map('map', {
    zoom: 5,
    fullscreenControl: false,
    center: [64.01,24.50],
    timeDimension: true,
    timeDimensionControl: true,
    timeDimensionOptions: {
        timeInterval: "2016-11-02T00:00:00Z/2017-06-04T00:00:00Z",
        period: "P1D"
    },
    timeDimensionControlOptions: {        
        playerOptions: {
            transitionTime: 250,
        }        
    }
});

  // load a tile layer
  L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e60422e636f34988a79015402724757b',
    {
      attribution: 'Tiles by <a href="http://www.thunderforest.com/">Thunderforest</a> Data by <a href="http://www.fmi.fi/">Finnish Meteorological Institute</a>',
      maxZoom: 22,
      minZoom: 0,
    }).addTo(map);

var smartWMS = 'http://52.16.211.9:8080/wms?';

var sd20LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:sd-f20',
    format: 'image/png',
    opacity: 0.7,
};
var sd20Layer = L.tileLayer.wms(smartWMS, sd20LayerOptions);
var sd20TimeLayer = L.timeDimension.layer.wms(sd20Layer);

var sd80LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:sd-f80',
    format: 'image/png',
    opacity: 0.7,
};
var sd80Layer = L.tileLayer.wms(smartWMS, sd80LayerOptions);
var sd80TimeLayer = L.timeDimension.layer.wms(sd80Layer);

var fr20LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:frsb-f20',
    format: 'image/png',
    opacity: 0.7,
};
var fr20Layer = L.tileLayer.wms(smartWMS, fr20LayerOptions);
var fr20TimeLayer = L.timeDimension.layer.wms(fr20Layer);

var fr80LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:frsb-f80',
    format: 'image/png',
    opacity: 0.7,
};
var fr80Layer = L.tileLayer.wms(smartWMS, fr80LayerOptions);
var fr80TimeLayer = L.timeDimension.layer.wms(fr80Layer);

var stl4LayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:frst',
    format: 'image/png',
    opacity: 0.7,
};
var stl4Layer = L.tileLayer.wms(smartWMS, stl4LayerOptions);
var stl4TimeLayer = L.timeDimension.layer.wms(stl4Layer);

var frsbLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:frsb',
    format: 'image/png',
    transparent: true,
    opacity: 0.7,
};
var frsbLayer = L.tileLayer.wms(smartWMS, frsbLayerOptions);
var frsbTimeLayer = L.timeDimension.layer.wms(frsbLayer);

var sdLayerOptions = {
    crs: L.CRS.EPSG4326,
    version: '1.3.0',
    layers: 'fmi:ecmwf:sd',
    format: 'image/png',
    transparent: true,
    opacity: 0.7,
};
var sdLayer = L.tileLayer.wms(smartWMS, sdLayerOptions);
var sdTimeLayer = L.timeDimension.layer.wms(sdLayer);

var selectedLayer = 'sd';
/*
var tempLegend = L.control({
    position: 'topleft'
});*/

var smartLegend = L.control({
    position: 'bottomright'
});

smartLegend.onAdd = function(map) {
    var src = 'http://52.16.211.9:8080/dali?customer=legend&product=sd&width=90&height=220&type=png';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '90px';
    div.style.height = '220px';
    div.style.opacity = '0.7';
    div.style['background-image'] = 'url(' + src + ')';
    return div;
};

/*
tempLegend.onAdd = function(map) {
    var src = 'http://52.16.211.9:8080/dali?customer=legend&product=temperature&width=46&height=420&type=png';
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '46px';
    div.style.height = '420px';
    div.style.opacity = '0.7';
    div.style['background-image'] = 'url(' + src + ')';
    return div;
};*/

var overlayMaps = {
    "Frozen soil depth": frsbTimeLayer,
    "Frozen soil depth f20": fr20TimeLayer,
    "Frozen soil depth f80": fr80TimeLayer,
    "Thawing soil top": stl4TimeLayer,
    "Snow depth": sdTimeLayer,
    "Snow depth f20": sd20TimeLayer,
    "Snow depth f80": sd80TimeLayer
};

map.on('overlayadd', function(eventLayer) {
    switch (eventLayer.name) {
    case "Snow depth": selectedLayer= "sd"; smartLegend.addTo(this); break;
    case "Frozen soil depth": selectedLayer= "frsb"; smartLegend.addTo(this); break;
    }
});

map.on('overlayremove', function(eventLayer) {
    switch (eventLayer.name) {
    case "Snow depth": map.removeControl(smartLegend); break;
    case "Frozen soil depth": map.removeControl(smartLegend); break;
    }
});

L.control.layers(overlayMaps).addTo(map);
smartLegend.addTo(map);
//tempLegend.addTo(map);
frsbTimeLayer.addTo(map);

var latlonPoint = 'Kajaani';

var dyGraphBOptions = {	
    drawAxesAtZero: false,
    legend: 'always',
    ylabel: "BioEnergy ProdCond",
    labels: [ "date","avg-bepi","f20-bepi","f80-bepi"],
    labelsDiv: "labels",
    connectSeparatedPoints: true,
    series: {
	"avg-bepi": { fillGraph: true, strokeWidth: 0, axis: 'y', stepPlot: true },
	"f20-bepi": { fillGraph: false, axis: 'y', stepPlot: true },
	"f80-bepi": { fillGraph: false, axis: 'y', stepPlot: true }
    },
    axes: { y: { drawGrid: false, independentTicks:true, valueRange: [-1,3], pixelsPerLabel: 25 } }
}
var dyGraphOptions = {	
    title: latlonPoint,
    titleHeight: 24,
    drawAxesAtZero: true,
    axisLineWidth: 0.5,
    legend: 'always',
    ylabel: "Frozen soil top and bottom depth (cm)",
    y2label: "BioEnergy ProdCond Index",
    labels: ["date", "avg-fbot", "f20-fbot", "f80-fbot",
	     "avgftop", "f20-ftop", "f80-ftop"],
    connectSeparatedPoints: true,
    labelsDiv: "labels",
    series: {
	"avg-fbot": { fillGraph: true },
	"f20-fbot": { fillGraph: true },
	"f80-fbot": { fillGraph: true },
	"avg-ftop": { fillGraph: true },
	"f20-ftop": { fillGraph: true },
	"f80-ftop": { fillGraph: true }
	},
    includeZero: true,
    axes: {
	y: { valueRange:[0,null] },
    } 
}

var dyGraph2Options = {	
    legend: 'always',
    ylabel: "Snow depth (cm)",
    labels:  ["date", "avg snow", "20% fract", "80% fract"],
    series: {
	"80% fract": { fillGraph: true },
	"avg snow": { fillGraph: true },
	"20% fract": { fillGraph: true }
    },
    labelsDiv: "labels"
}

var dyGraphAOptions = {	
    legend: 'always',
    ylabel: "Analyzed Snow depth (cm) and density",
    labels:  ["date", "snow depth", "snow depth with density"],
    series: {
	"snow depth": { fillGraph: true },
//	"snow density": { fillGraph: true },
	"snow depth with density": { fillGraph: true }
    },
    labelsDiv: "labels"
}

var popup = L.popup();

function onMapClick(e) {
    latlon = e.latlng.toString();
    latlonPoint = latlon.replace(" ","").substring(7, latlon.length -2);
    dyGraphOptions.title = latlonPoint;
    gB = new Dygraph(
	document.getElementById("graphB"),
	"timeseries?latlon=" + latlonPoint + "&producer=frst&param=utctime,2006,2007,2008&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,",
	dyGraphBOptions
    );
    g = new Dygraph(
	document.getElementById("graph"),
	"timeseries?latlon=" + latlonPoint + "&producer=frst&param=utctime,2001,2004,2005,2000,2002,2003&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,",
	dyGraphOptions
    );
    gsd = new Dygraph(
	document.getElementById("graphsd"), 
	"timeseries?latlon=" + latlonPoint + "&producer=sd&param=utctime,900,901,902&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,", dyGraph2Options 
    );
    gA = new Dygraph(
	document.getElementById("graphana"), 
	"timeseries?latlon=" + latlonPoint + "&producer=sd-ana&param=utctime,51,903&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,", dyGraphAOptions 
    );
    popup
        .setLatLng(e.latlng)
        .setContent("Graphed point: " + latlonPoint)
        .openOn(map);
}

gB = new Dygraph(
    document.getElementById("graphB"),
    "timeseries?places=" + latlonPoint + "&producer=frst&param=utctime,2006,2007,2008&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,", dyGraphBOptions
);
g = new Dygraph(
    document.getElementById("graph"), 
    "timeseries?places=" + latlonPoint + "&producer=frst&param=utctime,2001,2004,2005,2000,2002,2003&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,", dyGraphOptions
);

gsd = new Dygraph(
    document.getElementById("graphsd"), 
    "timeseries?places=" + latlonPoint + "&producer=sd&param=utctime,900,901,902&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,", dyGraph2Options 
);
gA = new Dygraph(
    document.getElementById("graphana"), 
    "timeseries?places=" + latlonPoint + "&producer=sd-ana&param=utctime,51,903&starttime=data&endtime=data&timestep=data&timeformat=sql&separator=,", dyGraphAOptions 
);

map.on('click', onMapClick);
// create control and add to map
//var lc = L.control.locate().addTo(map);

// request location update and set location
//lc.start();
