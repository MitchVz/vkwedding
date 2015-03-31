if (Meteor.isClient) {

    Template.mainNav.events({
        'click #rsvpNavButton': function () {
            $('#navbarMenuButton').click();
            $(window).scrollTop(0);
            goToPage(1);
        },
        'click #photoGalleryButton': function () {
            $('#navbarMenuButton').click();
            $(window).scrollTop(0);
            initPhotoSwipeFromDOM('#mainGallery');
        },
        'click #foodNavButton': function () {
            $('#navbarMenuButton').click();
            $(window).scrollTop(0);
        },
        'click #registryNavButton': function () {
            $('#navbarMenuButton').click();
            $(window).scrollTop(0);
        },
        'click #mapNavButton': function () {
            $('#navbarMenuButton').click();
            $(window).scrollTop(0);
        }
    });

}

