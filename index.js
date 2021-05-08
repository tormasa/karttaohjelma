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
    constructor(leveys, pituus, nimi, icon, lyhytKuvaus, kuvaus) {
        this.leveys = leveys;
        this.pituus = pituus;
        this.nimi = nimi;
        this.icon = 'data/' +icon +'.png';
        this.lyhytKuvaus = lyhytKuvaus;
        this.kuvaus = kuvaus;
    }
}

var paikat = [
    new Paikka(25.4839, 65.01138, "Rautatieasema", "asema2", "Oulun rautatieasema", "Oulun rautatieasema sijaitsee Oulun keskustassa. Oulussa risteävät rataosat Seinäjoki-Oulu, Oulu-Kontiomäki sekä Oulu-Tornia. Oulun rautatieasemaa on myös sanottu Pohjois-Suomen tärkeimmäksi risteysasemaksi ja se on ainoa raideyhteys 65. leveyspiirin pohjoispuolelle.\n\nVuonna 2020 Oulussa lopetettiin lipunmyynti ja siirryttiin lippuautomaatteihin.\n\nKiitos rautatieaseman oululaiset opiskelijat voivat matkustaa helposti ja vaivattomasti."),
    new Paikka(25.47534, 65.01484, "Tuomiokirkko", "kirkko", "Oulun tuomiokirkko", "Oulun tuomiokirkko valmistui vuonna 1777 mutta se tuhoutui keväällä 1822 tulipalossa, jolloin sen puurakenteet tuhoutuivat. Pian tämän jälkeen kirkko rakennettiin uudelleen käyttäen arkkitehtuurin Carl Ludvig Engelin piirustuksia. Kirkko valmistui uudestaan 1832 ja torni 1845."),
    new Paikka(25.47027, 65.01388, "Oulu10", "oulu10", "Neuvontaa ja opastusta Oulun kaupungin palveluihin", "Oulu10 tarjoaa neuvontaa Oulun kaupungin palveluihin. Oulu10 voidaan tavoitella sähköpostin, puhelimitse tai Chatin välityksellä. Sen palveluihin kuulu, mutta ei rajoitu neuvonta ja ohjaus, lipunmyynti, tuotemyynti ja kaupungin lähettämien laskujen maksu.\n\nOulu10 avulla opiskelijat voivat hankkia huolettomasti ja helposti itselleen bussikortin, jotta he pääsevät matkaamaan Yliopistolle ja takaisin keskustaan."),
    new Paikka(25.47129, 65.01231, "Rotuaari", "rotuaari", "Kävelykatu", "Rotuaari on Oulun ydinkeskustan kävelykatu. Rotuaarin pallo on huomattavin maamerkki Rotuaarin läheisyydessä. Tiesitkö että nimi Rotuaari on saanut alkunsa vanhasta oululaisesta murresanasta trottoir joka tarkoitta ranskan kielen jalkakäytävää."),
    new Paikka(25.46268, 65.01463, "Kaupunginteatteri", "teatteri", "Oulun kaupunginteatteri", "Oulun kaupunginteatteri järjestää vuosittain noin 350–400 esitystä ja näistä 8 on ensi-iltoja. Oulun Teatteri on tunnettu vuodesta 1951 nimeltä Oulun Teatteri, tätä ennen sitä kutsuttiin Oulun Näyttämöksi.\n\nOulun Teatterin avulla opiskelijat voivat päästä nauttimaan sekä suomalaisesta että ulkomaalaisesta teatterista keskustan läheisyydessä.")
]

// Ensimmäisen kohteen buttoniin toiminnallisuus
var kohdeNimiButton = document.getElementById("kohdeNimiButton");

kohdeNimiButton.addEventListener('click', function() {
    document.getElementById("map").style.display = "none";
    document.getElementById("kohteet").style.display = "none";
    document.getElementById("esittely").style.display = "Block";

    for (var i = 0; i < paikat.length; i++) {
        if (paikat[i].nimi == this.innerText) {
            document.getElementById("esittelyOtsikko").textContent = paikat[i].nimi;
            document.getElementById("esittelyTeksti").textContent = paikat[i].kuvaus;
            break;
        }
    }
}, false);

// Luodaan paikkojen perusteella paikkalistaus
document.getElementById("kohdeNimiButton").innerHTML = paikat[0].nimi;
document.getElementById("kohdeSelite").innerHTML = paikat[0].lyhytKuvaus;
var kohdeRivi = document.getElementById("kohdeRivi");

for (var i = 1; i < paikat.length; i++) {
    var cloneRow = kohdeRivi.cloneNode(true);

    var childs = cloneRow.childNodes;

    for (var c = 0; c < childs.length; c++) {
        var str = "" +childs[c].innerHTML;
        if (str.includes(paikat[0].nimi)) {
            childs[c].innerHTML = str.replace(paikat[0].nimi, paikat[i].nimi);
        }

        if (childs[c].textContent.match(paikat[0].lyhytKuvaus)) childs[c].textContent = paikat[i].lyhytKuvaus;
    }

    var buttons = cloneRow.getElementsByClassName("kohteetButton");
    buttons[0].addEventListener('click', function() {
        document.getElementById("map").style.display = "none";
        document.getElementById("kohteet").style.display = "none";
        document.getElementById("esittely").style.display = "Block";

        for (var i = 0; i < paikat.length; i++) {
            if (paikat[i].nimi == this.innerText) {
                document.getElementById("esittelyOtsikko").textContent = paikat[i].nimi;
                document.getElementById("esittelyTeksti").textContent = paikat[i].kuvaus;
                break;
            }
        }
    }, false);

    document.getElementById("kohteet").appendChild(cloneRow);
}

// Luodaan pointit joita käytetään kartassa
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

var currentFeature = '';

// display popup on click
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        // Ensin vanha popup pois jos sellainen on
        $(element).popover('dispose');

        // Jos feature on sama kuin currentFeature, niin avataan paikan esittely
        // ikonia on siis painettu kahdesti putkeen
        if (currentFeature == feature.get('name')) {
            document.getElementById("map").style.display = "none";
            document.getElementById("kohteet").style.display = "none";
            document.getElementById("esittely").style.display = "Block";

            for (var i = 0; i < paikat.length; i++) {
                if (paikat[i].nimi == currentFeature) {
                    document.getElementById("esittelyOtsikko").textContent = paikat[i].nimi;
                    document.getElementById("esittelyTeksti").textContent = paikat[i].kuvaus;
                    break;
                }
            }

            currentFeature = '';
        }
        else {
            var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);

        $(element).popover({
            placement: 'top',
            html: true,
            content: feature.get('name')
        });

        currentFeature = feature.get('name');

        $(element).popover('show');
        }

    } else {
        $(element).popover('dispose');
        currentFeature = '';
    }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(element).popover('dispose');
        currentFeature = '';
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
    document.getElementById("esittely").style.display = "none";
    $(element).popover('dispose');
    currentFeature = '';
}, false);

centerButton.addEventListener('click', function() {
    map.setView(new View({
        center: defaultView.getCenter(),
        zoom: defaultView.getZoom()
    }));
    $(element).popover('dispose');
    currentFeature = '';
}, false);

showMapButton.addEventListener('click', function() {
    document.getElementById("map").style.display = "block";
    document.getElementById("kohteet").style.display = "none";
    document.getElementById("esittely").style.display = "none";
}, false);