Guests = new Mongo.Collection('guests');

if (Meteor.isClient) {

    // Resize the clock whenever the window gets resized
    $(window).resize( function () {
        var width = $(window).width();
        resizeClock(width);
    });


    $(document).ready(function () {

        // Setting the height so that the mobile window doesn't resize
        $('#bg').height($(window).height() + 60);

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
        $('.flip-clock-divider.days').children(":first-child").html("<img src='/images/clock/days_text.png'>");

        $('.flip-clock-divider.hours').children(":first-child").html("<img src='/images/clock/hours_text.png'>");

        $('.flip-clock-divider.minutes').children(":first-child").html("<img src='/images/clock/minutes_text.png'>");


        // Resizing the clock on load
        var width = $(window).width();
        resizeClock(width);
    });

    resizeClock = function (width) {
        if (width < 622) {
            // I got the zoom property by doing a linear regression with a bunch of points
            var zoom = (.00193 * width) - .204;
            $('.my-clock').css({
                "-webkit-transform-origin-x": 0,
                "-webkit-transform-origin-y": 0,
                "-webkit-transform": "scale(" + zoom + ")",
                "-moz-transform-origin": "0 0",
                "-moz-transform": "scale(" + zoom + ")",
                "-ms-transform-origin": "0 0",
                "-ms-transform": "scale(" + zoom + ")",
                "width": "250%"
            });

            // Linear regressions again
            var height = (.27 * width) - 9.64;
            var padding = (.0677 * width) - 23.89;
            $('.clock-content').css({
                "height": height,
                "padding-top": Math.max(padding, 0)
            });
        } else {

            $('.my-clock').css({
                "-webkit-transform": "",
                "-moz-transform": "",
                "-ms-transform": "",
                "width": "100%"
            });
            $('.clock-content').css({
                "height": "",
                "padding-top": ""
            });
        }
    };

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
    };



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
