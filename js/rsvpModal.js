if (Meteor.isClient) {

    SelectedGuests = new Meteor.Collection( null ); // Making a local meteor collection

    Template.rsvpModal.helpers({
        'guest': function() {

            var searchQuery = Session.get('query');
            if (searchQuery == "") {
                return null;
            } else {
                return Guests.find(
                    {Name: new RegExp(searchQuery, 'i')}, //'i' specifies case-insensitve
                    {sort: { Name: 1 } }
                );
            }
        },
        'selectedGuest': function() {
            return SelectedGuests.find();
        },
        'noGuestSelected': function() {
            return SelectedGuests.find().count() == 0;
        },
        'IAmOrWeAre': function() {
            if (SelectedGuests.find().count() > 1) {
                return "we're";
            } else {
                return "I'm";
            }
        },
        'IOrWe': function() {
            if (SelectedGuests.find().count() > 1) {
                return "we";
            } else {
                return "I";
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
                        $('#back1').click();
                    }
                });
            });

            $("[name='page-1']").hide();
            $("[name='page-2']").show();
            $("[name='page-3']").hide();
        },
        'click #back1': function () {
            $("[name='page-1']").show();
            $("[name='page-2']").hide();
            $("[name='page-3']").hide();

            // unchecking all checkboxes
            SelectedGuests.remove({});
            $('input:checkbox').each( function () {
                $(this).removeAttr('checked');
                $(this).parent().parent().removeClass("highlight-row");
            });

            // refocus the text field
            $('#searchField').focus();
        },
        'click #back2': function () {
            $("[name='page-1']").hide();
            $("[name='page-2']").show();
            $("[name='page-3']").hide();
        },
        'click tbody > tr': function ( event ) {

            // the parent of the checkbox is different from the other parents...
            if ($(event.target).is(':checkbox')) {

                if ($(event.target).prop('checked')) {
                    $(event.target).parent().parent().addClass("highlight-row");
                    SelectedGuests.insert(this);
                } else {
                    $(event.target).parent().parent().removeClass("highlight-row");
                    SelectedGuests.remove(this);
                }

            } else {

                var input = $(event.target).parent().children(":first-child").children(":first-child");

                if (input.prop('checked')) {
                    input.prop('checked', false);
                    $(event.target).parent().removeClass("highlight-row");
                    SelectedGuests.remove(this);
                } else {
                    input.prop('checked', true);
                    $(event.target).parent().addClass("highlight-row");
                    SelectedGuests.insert(this);
                }
            }
        },
        'click #rsvp': function () {

            $("[name='page-1']").hide();
            $("[name='page-2']").hide();
            $("[name='page-3']").show();
        }
    });

}

