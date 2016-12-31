var things = ko.observableArray ([
    {
        name: "Johnson Park",
        position: {
            lat: 40.511784,
            lng: -74.474051
        }
    },
    {
        name: "HighPoint Solutions Stadium",
        position: {
            lat: 40.513461,
            lng: -74.465943
                                       
        }
    },
    {
        name: "State Theatre (New Brunswick, New Jersey)",
        position: {
            lat: 40.493341,
            lng: -74.44462
         }
    },
    {
        name: "Stress Factory Comedy Club",
        position: {
            lat: 40.495805,
            lng: -74.442956
         }
    },
    {
         name: "Zimmerli Art Museum",
         position: {
            lat: 40.500119,
            lng: -74.445881
         }
    },
    {
         name: "Elmer B. Boyd Park",
         position: {
            lat: 40.490467,
            lng: -74.436311
          }
    },
]);

var map, infowindow, marker;
var markers = ko.observableArray();

// Draw the map and markers
function initialize() {
    var centerLatLng = new google.maps.LatLng(40.5025611,-74.4665169);
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
    center: centerLatLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(mapCanvas, mapOptions);
    infowindow = new google.maps.InfoWindow({
        maxWidth: 300
    });
    
    for (var i = 0; i < things().length; i++) {
        createMarker(things()[i].position, things()[i].name);
        clickMarker(markers()[i], markers()[i].title);
    }
}

// Error message
if (typeof google !== 'undefined') {
    google.maps.event.addDomListener(window, 'load', initialize);
} else {
    $('#map').html('<h3>Something went wrong. Please try again!</h3>');
}

// Create marker object and collect it in the markers array
var createMarker = function(thingPosition, thingName) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(thingPosition),
        title: thingName,
        animation: google.maps.Animation.DROP,
        map: map
    });
    markers.push(marker);
};

// Set animation to show infowindow with Wikipedia
var clickMarker = function (markerObj, markerObjTitle) {
    google.maps.event.addListener(markerObj, 'click', (function(markerObj) {
        return function() {
        markerObj.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {markerObj.setAnimation(null);}, 725);
                                                       
        getWikiRecourse(markerObj, markerObjTitle);
                                                       
// Close infowindow
    google.maps.event.addListenerOnce(markerObj, "visible_changed", function() {
        infowindow.close();
        });
    };
})(markerObj));
};

// Use Wikipedia API
var getWikiRecourse = function(markerObject, markerTitle) {
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + markerTitle + '&format=json&callback=wikiCallback';
    
    var wikiRequestTimeout = setTimeout(function() {
        infowindow.setContent("Wikipedia Article Could Not Be Loaded. Please try request data later.");
            infowindow.open(map, markerObject);
    }, 2000);
    
    $.ajax({
           url: wikiUrl,
           dataType: "jsonp",
           jsonp: "callback",
           success: function (response) {
           var articleStr = response[0];
           var url = 'http://en.wikipedia.org/wiki/' + articleStr;
           content = response[2][0];
           infowindow.setContent('<h4>' + articleStr + '</h4>' + content + '<p><a href="' + url + '" target="_blank">' + 'More about ' + articleStr + '</a></p>');
           infowindow.open(map, markerObject);
           clearTimeout(wikiRequestTimeout);
           }
           });
};

// View Model
var ViewModel = function() {
    var self = this;
    
    self.locations = markers;
    self.query = ko.observable('');
    
    // Bind the item in list with marker on the map when item is clicked
    self.clickHandler = function(data) {
        google.maps.event.trigger(data, 'click');
    };
    
    // Receive user input from searchBar and filter the list and markers on the map
    self.search = ko.computed(function(){
        return ko.utils.arrayFilter(self.locations(), function(location){
            var doesMatch = location.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
                location.setVisible(doesMatch);
                return doesMatch;
            });
    });
};

// Create new object
var viewModel = new ViewModel();

// Binding between Model and View
ko.applyBindings(viewModel);

                                  
                                  
                                  
                                  
                                  
                                  



