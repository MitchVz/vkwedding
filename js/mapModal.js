if (Meteor.isClient) {

    var firstTime;
    var count = 0;

    Meteor.startup(function() {
        GoogleMaps.load();
    });

    Template.mapModal.helpers({
        conferenceGroundsMapOptions: function() {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(42.991846, -86.222291),
                    zoom: 14,
                    scrollwheel: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.SMALL,
                        position: google.maps.ControlPosition.LEFT_TOP
                    }
                };
            }
        },
        watermarkMapOptions: function() {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(43.005941, -86.202674),
                    zoom: 14,
                    scrollwheel: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.SMALL,
                        position: google.maps.ControlPosition.LEFT_TOP
                    }
                };
            }
        }
    });

    Template.mapModal.created = function() {
        firstTime = true;
        GoogleMaps.ready('conferenceGroundsMap', function(map) {
            // Add a marker to the map once it's ready
            var marker = new google.maps.Marker({
                position: map.options.center,
                map: map.instance
            });
        });

        GoogleMaps.ready('watermarkMap', function(map) {
            // Add a marker to the map once it's ready
            var marker = new google.maps.Marker({
                position: map.options.center,
                map: map.instance
            });
        });
    };

    Template.mapModal.rendered = function () {
        $('#theMapModal').on('shown.bs.modal', function() {

            // Conference Grounds
            var conferenceGroundsCenter = GoogleMaps.maps.conferenceGroundsMap.instance.getCenter();  // Get current center before resizing
            google.maps.event.trigger(GoogleMaps.maps.conferenceGroundsMap.instance, "resize");
            GoogleMaps.maps.conferenceGroundsMap.instance.setCenter(conferenceGroundsCenter); // Re-set previous center

            // Watermark
            var watermarkCenter = GoogleMaps.maps.watermarkMap.instance.getCenter();  // Get current center before resizing
            google.maps.event.trigger(GoogleMaps.maps.watermarkMap.instance, "resize");
            GoogleMaps.maps.watermarkMap.instance.setCenter(watermarkCenter); // Re-set previous center



            if (firstTime) {

                var conferenceGroundsDirections = "https://www.google.com/maps/dir//Conference+Grounds,+12253+Lakeshore+Dr,+Grand+Haven,+MI+49417/@42.991626,-86.222302,17z/data=!4m13!1m4!3m3!1s0x881987a936760649:0x7444508c52726d05!2sConference+Grounds!3b1!4m7!1m0!1m5!1m1!1s0x881987a936760649:0x7444508c52726d05!2m2!1d-86.222302!2d42.991626";
                var watermarkDirections = "https://www.google.com/maps/dir//Watermark+Church,+13060+U.S.+31,+Grand+Haven,+MI+49417,+United+States/@43.005972,-86.202631,17z/data=!4m12!1m3!3m2!1s0x0:0x291b1afcb03534e0!2sWatermark+Church!4m7!1m0!1m5!1m1!1s0x8819811d85b7d51b:0x291b1afcb03534e0!2m2!1d-86.202631!2d43.005972";

                // Conference Grounds
                var conferenceGroundsDiv = document.createElement('div');
                conferenceGroundsDiv.setAttribute('id', 'chrome-fix');
                var conferenceGroundsControl = new DirectionsControl(conferenceGroundsDiv, conferenceGroundsDirections);
                conferenceGroundsDiv.index = 1;
                GoogleMaps.maps.conferenceGroundsMap.instance.controls[google.maps.ControlPosition.TOP_RIGHT].push(conferenceGroundsDiv);

                // Watermark
                var watermarkDiv = document.createElement('div');
                watermarkDiv.setAttribute('id', 'chrome-fix');
                var watermarkControl = new DirectionsControl(watermarkDiv, watermarkDirections);
                watermarkDiv.index = 1;
                GoogleMaps.maps.watermarkMap.instance.controls[google.maps.ControlPosition.TOP_RIGHT].push(watermarkDiv);

                firstTime = false;
            }
        });
    };

    /**
     * The DirectionsControl adds a control to the map that opens a new tab with directions to the marker
     * This constructor takes the control DIV and the directions url as arguments.
     * @constructor
     */
    function DirectionsControl(controlDiv, directionsUrl) {

        // Set CSS for the control border
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginTop = '5px';
        controlUI.style.marginRight = '5px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to get directions in a new tab';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '14px';
        controlText.style.lineHeight = '30px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Get Directions';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply direct the
        // user to a google map with the destination filled in
        google.maps.event.addDomListener(controlUI, 'click', function() {
            OpenInNewTab(directionsUrl);
        });

    }

    function OpenInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }
}

