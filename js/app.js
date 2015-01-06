if (Meteor.isClient) {

  var bgCounter = 0;
  var backgrounds = [
        "/images/surveying-kingdom.jpg",
        "/images/house-smiling.jpg",
        "/images/bw-lower-corner.jpg",
        "/images/bw-outline.jpg"
      ];

  Template.mainNav.events({
        'click #changeBackground':function () {
            bgCounter = (bgCounter+1) % backgrounds.length;
            $('html').css("background", "url("+backgrounds[bgCounter]+") no-repeat center center fixed");
            $('html').css("-webkit-background-size", "cover");
            $('html').css("-moz-background-size", "cover");
            $('html').css("-o-background-size", "cover");
            $('html').css("background-size", "cover");
        }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
