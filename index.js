import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';

class Paikka {
    constructor(leveys, pituus, nimi, kuvaus, icon) {
        this.leveys = leveys;
        this.pituus = pituus;
        this.nimi = nimi;
        this.kuvaus = kuvaus;
        this.icon = 'data/' +icon +'.png';
    }
}

var paikat = [
    new Paikka(25.4839, 65.01138, "Paikka 1", "Tämä on paikka 1", "asema2"),
    new Paikka(25.47534, 65.01484, "Paikka 2", "Tämä on paikka 2", "kirkko"),
    new Paikka(25.47027, 65.01388, "Paikka 3", "Tämä on paikka 3", "oulu10"),
    new Paikka(25.47129, 65.01231, "Paikka 4", "Tämä on paikka 4", "rotuaari"),
    new Paikka(25.46268, 65.01463, "Paikka 5", "Tämä on paikka 5", "teatteri")
]

/*
var colors = [
    "rgba(255, 0, 0, 0.5)",
    "rgba(255, 255, 0, 0.5)",
    "rgba(255, 0, 255, 0.5)",
    "rgba(0, 255, 255, 0.5)",
    "rgba(0, 255, 0, 0.5)"
]
*/

var pointit = [];

for (var i = 0; i < paikat.length; i++) {
    var point = new Feature({
        geometry: new Point(fromLonLat([paikat[i].leveys, paikat[i].pituus])),
        name: paikat[i].nimi,
        description: paikat[i].kuvaus,
    });

    point.setStyle(
        new Style({
            image: new Icon({
                //color: colors[i],
                src: paikat[i].icon,
                scale: 0.2,
            }),
        })
    );

    pointit.push(point);
}

var vectorSource = new VectorSource({
    features: pointit,
});

var vectorLayer = new VectorLayer({
    source: vectorSource,
});

var tileLayer = new TileLayer({
    source: new OSM()
});

var defaultView = new View({
    center: fromLonLat([25.473, 65.013]),
    zoom: 15,
});

var map = new Map({
    layers: [tileLayer, vectorLayer],
    target: document.getElementById('map'),
    view: new View({
        center: defaultView.getCenter(),
        zoom: defaultView.getZoom(),
    })
});

var element = document.getElementById('popup');

var popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50],
});

map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        // Ensin vanha popup pois jos sellainen on
        $(element).popover('dispose');

        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);

        $(element).popover({
            placement: 'top',
            html: true,
            content: feature.get('name') +": " +feature.get('description'),
        });

        $(element).popover('show');
    } else {
        $(element).popover('dispose');
    }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(element).popover('dispose');
        return;
    }
    
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

var paikatButton = document.getElementById('paikatButton');
var centerButton = document.getElementById('centerButton');
var showMapButton = document.getElementById('showMap');

paikatButton.addEventListener('click', function() {
    document.getElementById("map").style.display = "none";
    document.getElementById("kohteet").style.display = "block";
}, false);

centerButton.addEventListener('click', function() {
    map.setView(new View({
        center: defaultView.getCenter(),
        zoom: defaultView.getZoom()
    }));
}, false);

showMapButton.addEventListener('click', function() {
    document.getElementById("map").style.display = "block";
    document.getElementById("kohteet").style.display = "none";
}, false);