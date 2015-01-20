Guests = new Mongo.Collection('guests');

if (Meteor.isClient) {

    $(document).ready(function () {
        // Stopping the enter key from doing anything (unless I tell it to, of course)
        $(window).keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                clickEnterButtonFromPage(Session.get('currentPage'));
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


        // Replacing the clock days, hours, and minutes labels
        $('.flip-clock-divider.days').children(":first-child").html("<img src='/images/days_text.png'>");

        $('.flip-clock-divider.hours').children(":first-child").html("<img src='/images/hours_text.png'>");

        $('.flip-clock-divider.minutes').children(":first-child").html("<img src='/images/minutes_text.png'>");

    });

    clickEnterButtonFromPage = function (currentPage) {
        switch (currentPage) {
            case 1:
                $('#search').click();
                break;
            case 2:
                $('#rsvp').click();
                break;
            case 3:
                $('#submit').click();
                break;
            case 4:
                $('#addComment').click();
                break;
            default:
                break;
        }
    }



}

if (Meteor.isServer) {
  Meteor.startup(function () {
      Meteor.methods({
          rsvpForGuest: function (guestId, coming) {
              Guests.update({_id: guestId},
                  { $set : { Rsvp: true, Attending: coming }}
              );
          }
      });
  });


}
