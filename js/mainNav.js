if (Meteor.isClient) {
    Template.mainNav.events({
        'click #rsvpNavButton': function () {
            $('#navbarMenuButton').click();

            goToPage(1);
        },
        'click #photoGalleryButton': function () {
            $('#navbarMenuButton').click();

            initPhotoSwipeFromDOM('#mainGallery');
        },
        'click #foodNavButton': function () {
            $('#navbarMenuButton').click();
        },
        'click #registryNavButton': function () {
            $('#navbarMenuButton').click();
        },
        'click #mapNavButton': function () {
            $('#navbarMenuButton').click();
        }
    });

}

