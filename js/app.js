Guests = new Mongo.Collection('guests');

if (Meteor.isClient) {


  $(document).ready(function() {
    // Stopping the enter key from doing anything (unless I tell it to, of course)
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
    // Stopping the backspace key from going back a page. Because SPA
    // From: http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
    $(document).unbind('keydown').bind('keydown', function (event) {
      var doPrevent = false;
      if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' &&
            (
            d.type.toUpperCase() === 'TEXT' ||
            d.type.toUpperCase() === 'PASSWORD' ||
            d.type.toUpperCase() === 'FILE' ||
            d.type.toUpperCase() === 'EMAIL' ||
            d.type.toUpperCase() === 'SEARCH' ||
            d.type.toUpperCase() === 'DATE' )
            ) ||
            d.tagName.toUpperCase() === 'TEXTAREA') {
          doPrevent = d.readOnly || d.disabled;
        }
        else {
          doPrevent = true;
        }
      }

      if (doPrevent) {
        event.preventDefault();
      }
    });
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}
