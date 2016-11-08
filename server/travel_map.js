// create the markers
var geoJson = {
    type: 'FeatureCollection',
    features: [
    {
        type: 'Feature',
        properties: {
            title_en: 'Paris',
            title_fr: 'Paris',
            page_en: 'paris_en.html',
            page_fr: 'paris_fr.html',
            'marker-color': '#fc4353',
            zoom: 6
        },
        geometry: {
            type: 'Point',
            coordinates: [2.351828,48.856578]
        }
    },
    {
        type: 'Feature',
        properties: {
            title_en: 'Marseille',
            title_fr: 'Marseille',
            page_en: 'marseille_en.html',
            page_fr: 'marseille_fr.html',
            'marker-color': '#fc4353',
            zoom: 6
        },
        geometry: {
            type: 'Point',
            coordinates: [5.369889,43.296346]
        }
    }]
};
    
// create the map
L.mapbox.accessToken = 'pk.eyJ1IjoieWthdGFva2EiLCJhIjoiY2lyNzJqdGVwMDB2Y2c3bTNudzh6eW8xNiJ9.uApWXlksYc3pMyjMW46jkg';
//var map = L.mapbox.map('map', 'clempinch.he1g7m56').setView([34, -37], 3);
var map = L.mapbox.map('map', 'mapbox.streets').setView([34, -37], 3);

// customize the marker events
map.featureLayer.on('layeradd', function(e) {
    var marker = e.layer;
    // custom popup content
    var popupContent =  getTitle(marker);
    marker.bindPopup(popupContent,{
        closeButton: false
    });
    // customize click event
    marker.on('click', function(e) {
        // zoom on the marker
        if(map.getZoom() > marker.feature.properties.zoom) {
            map.setView(e.latlng, map.getZoom());   
        } else {
            map.setView(e.latlng, marker.feature.properties.zoom);
        }
        // jQuery to update the content of a particular div with some other content
        $(function () {
            $("#travel-div").load(getPage(marker)).hide().fadeIn('slow');
        });
    });
});

// load the markers in the map
map.featureLayer.setGeoJSON(geoJson);
// popup behaviour on marker mouseover event
map.featureLayer.on('mouseover', function(e) {
    e.layer.openPopup();
});
map.featureLayer.on('mouseout', function(e) {
    e.layer.closePopup();
});
