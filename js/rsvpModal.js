if (Meteor.isClient) {

    Template.rsvpModal.helpers({
        'guest': function() {
            var searchQuery = Session.get('query');
            if (searchQuery == "") {
                return null;
            } else {
                return Guests.find(
                    {Name: new RegExp(searchQuery, 'i')} //'i' specifies case-insensitve
                );
            }
        }

    });


    Template.rsvpModal.events({
        'click #search': function () {
            var query = $('#searchField').val();
            Session.set('query', query);

            // Make the enter key click the 'RSVP' button if one or more people are selected
            $(document).ready(function() {
                $(window).keydown(function(event){
                    if(event.keyCode == 13) {
                        event.preventDefault();
                        return false;
                        // TODO: click rsvp
                    }
                });
                $(window).keydown(function(event){
                    if(event.keyCode == 8) {
                        $('#back').click();
                    }
                });
            });

            $("[name='page-1']").hide();
            $("[name='page-2']").show();
        },
        'click #back': function () {
            $("[name='page-2']").hide();
            $("[name='page-1']").show();

            // unchecking all checkboxes
            $('input:checkbox').each( function () {
                $(this).removeAttr('checked');
                $(this).parent().parent().removeClass("highlight-row");
            });

        },
        'click tbody > tr': function ( event ) {

            // the parent of the checkbox is different from the other parents...
            if ($(event.target).is(':checkbox')) {

                if ($(event.target).prop('checked')) {
                    $(event.target).parent().parent().addClass("highlight-row");
                } else {
                    $(event.target).parent().parent().removeClass("highlight-row");
                }

            } else {

                var input = $(event.target).parent().children(":first-child").children(":first-child");

                if (input.prop('checked')) {
                    $(event.target).parent().removeClass("highlight-row");
                    input.prop('checked', false);
                } else {
                    input.prop('checked', true);
                    $(event.target).parent().addClass("highlight-row");
                }
            }


        }
    });

}

