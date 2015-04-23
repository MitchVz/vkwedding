Guests = new Mongo.Collection('guests');
Comments = new Mongo.Collection('comments');

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

            // Centering the clock with linear regressions
            // Comment back in at < 100 days!!!
            var clockWidth = (.858 * width) - 54;
            $('.my-clock').parent().css({
                "width": clockWidth
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

            // Comment back in at less than 100 days
            $('.my-clock').parent().css({
                "width": "466px"
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
            case 5: // This is the admin login section
                $('#login').click();
                break;
            case 6: // This is the admin page
                if ($('#editModal').hasClass('in')) {

                    if ($('#saveEdit').is(":visible") ) {
                        $('#saveEdit').click();
                    }
                } else if ($('#addGuestModal').hasClass('in')) {
                    if ($('#saveAdd').is(":visible") ) {
                        $('#saveAdd').click();
                    }
                }
            default:
                break;
        }
    };



}

if (Meteor.isServer) {
    Meteor.startup(function () {

        Meteor.methods({
            rsvpForGuest: function (guestId, coming, song1, song2, song3) {
                Guests.update({_id: guestId},
                    { $set : { Rsvp: true, Attending: coming, Song1: song1, Song2: song2, Song3: song3 }}
                );
            },
            addComment: function (guestId, comment) {
                Guests.update({_id: guestId},
                    { $set : { Comments: comment }}
                );
            },
            sendEmail: function (from, subject, text) {

                // March 30, 8:00pm commented these out to try to get the mailgun errors to go away
                //check([to, from, subject, text], [String]);

                // Let other method calls from the same client start running,
                // without waiting for the email sending to complete.
                this.unblock();

                Email.send({
                    to: 'vanderkram@gmail.com',
                    from: from,
                    subject: subject,
                    text: text
                });
            },
            addMenuComment: function (name, comment) {
                Comments.insert({
                    Name: name,
                    Comment: comment
                });
            },
            updateGuestInfo: function (guestId, firstName, lastName, searchTerms) {
                Guests.update({_id: guestId},
                    { $set : { FirstName: firstName, LastName: lastName, SearchTerms: searchTerms }}
                );
            },
            addNewGuest: function (firstName, lastName, searchTerms) {
                Guests.insert({
                        FirstName: firstName,
                        LastName: lastName,
                        SearchTerms: searchTerms
                });
            },
            deleteGuest: function (guestId) {
                Guests.remove({_id: guestId});
            }
        });
    });

    // takes an array of strings as search queries and returns the specified guests
    Meteor.publish('guestList', function (queries) {
        if (queries.toString().length < 3)
            return [];
        var queryArray = [];
        queries.forEach( function (term) {
            queryArray.push( {SearchTerms: new RegExp(term, 'i')});
        });
        var query = {$and: queryArray };

        return Guests.find(query);
    });

    // Returns everything in the Guests collection
    Meteor.publish('allGuests', function () {
        if (this.userId) return Guests.find({}, {sort: {LastName: -1} });
    });

}
