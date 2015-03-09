if (Meteor.isClient) {

    Meteor.startup(function() {
        GoogleMaps.load();
    });

    Template.mapModal.helpers({
        exampleMapOptions: function() {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(42.991846, -86.222291),
                    zoom: 13,
                    disableDefaultUI: true
                };
            }
        }
    });

    Template.mapModal.created = function() {
        GoogleMaps.ready('exampleMap', function(map) {
            // Add a marker to the map once it's ready
            var marker = new google.maps.Marker({
                position: map.options.center,
                map: map.instance
            });
       });

    };

    Template.mapModal.rendered = function () {
        $('#theMapModal').on('shown.bs.modal', function() {
            console.log('opened the modal');

            var currentCenter = GoogleMaps.maps.exampleMap.instance.getCenter();  // Get current center before resizing
            google.maps.event.trigger(GoogleMaps.maps.exampleMap.instance, "resize");
            GoogleMaps.maps.exampleMap.instance.setCenter(currentCenter); // Re-set previous center
        });
    };

}

