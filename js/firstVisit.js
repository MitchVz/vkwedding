if (Meteor.isClient) {
    Template.firstVisitModal.events({
        'click #rsvpFirst': function () {
            goToPage(1);
        }
    });

}

