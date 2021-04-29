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

var point1 = new Feature({
    geometry: new Point(fromLonLat([25.472, 65.014])),
    name: 'Paikka 1',
    description: 'Tämä on paikka',
});

var point2 = new Feature({
    geometry: new Point(fromLonLat([25.462, 65.004])),
    name: 'Paikka 2',
    description: 'Tämä on paikka',
});

var point3 = new Feature({
    geometry: new Point(fromLonLat([25.462, 65.024])),
    name: 'Paikka 3',
    description: 'Tämä on paikka',
});

var point4 = new Feature({
    geometry: new Point(fromLonLat([25.482, 65.024])),
    name: 'Paikka 4',
    description: 'Tämä on paikka',
});

var point5 = new Feature({
    geometry: new Point(fromLonLat([25.482, 65.004])),
    name: 'Paikka 5',
    description: 'Tämä on paikka',
});

point1.setStyle(
    new Style({
        image: new Icon({
            color: 'rgba(255, 0, 0, 0.5)',
            src: 'icon.png',
            scale: 0.05,
        }),
    })
);

point2.setStyle(
    new Style({
        image: new Icon({
            color: 'rgba(255, 255, 0, 0.5)',
            src: 'data/icon.png',
            scale: 0.05,
        }),
    })
);

point3.setStyle(
    new Style({
        image: new Icon({
            color: 'rgba(255, 0, 255, 0.5)',
            src: 'data/icon.png',
            scale: 0.05,
        }),
    })
);

point4.setStyle(
    new Style({
        image: new Icon({
            color: 'rgba(0, 255, 255, 0.5)',
            src: 'data/icon.png',
            scale: 0.05,
        }),
    })
);

point5.setStyle(
    new Style({
        image: new Icon({
            color: 'rgba(0, 255, 0, 0.5)',
            src: 'data/icon.png',
            scale: 0.05,
        }),
    })
);

var vectorSource = new VectorSource({
    features: [point1, point2, point3, point4, point5],
});

var vectorLayer = new VectorLayer({
    source: vectorSource,
});

var tileLayer = new TileLayer({
    source: new OSM()
});

var map = new Map({
    layers: [tileLayer, vectorLayer],
    target: document.getElementById('map'),
    view: new View({
        center: fromLonLat([25.472, 65.014]),
        zoom: 12,
    }),
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
