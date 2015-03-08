if (Meteor.isClient) {
    Template.firstVisitModal.events({
        'click #rsvpFirst': function () {
            goToPage(1);
        }
    });

    Template.firstVisitModal.rendered = function() {

        // Show modal if first time visiting the page
        if (typeof $.cookie('visited') === "undefined") {
            $('#firstVisitModal').modal('show');

            // create the visited cookie
            $.cookie('visited', 'true', { expires: 20000 });
        }
    }

}

