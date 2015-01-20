if (Meteor.isClient) {
    Template.mainNav.events({
        'click #rsvpNavButton': function () {
            $('#navbarMenuButton').click();

            goToPage(1);
        }
    });

}

