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


            //**************************************//
            //   Below is all so that first visit   //
            //         doesn't ruin stuff           //
            //**************************************//


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
        }
    }

}

