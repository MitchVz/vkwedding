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
        'atLeastOneGuest': function() {
            var searchQuery = Session.get('query');
            return Guests.find(
                                {Name: new RegExp(searchQuery, 'i')} //'i' specifies case-insensitve
            ).count() > 0;
        },
        'selectedGuest': function() {
            return SelectedGuests.find();
        },
        'rsvpIcon': function() {
            if (this.Rsvp) {
                return "<span class='glyphicon glyphicon-ok'></span>";
            } else {
                return "";
            }
        },
        'attendingIcon': function() {
            if (this.Rsvp) {
                if (this.Attending) {
                    return "<span class='glyphicon glyphicon-ok'></span>";
                } else {
                    return "<span class='glyphicon glyphicon-remove'></span>";
                }
            } else {
                return "";
            }
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

            Meteor.call('rsvpForGuest', 'someIdString', 'true', function(err,response) {
                if(err) {
                    Session.set('serverDataResponse', "Error:" + err.reason);
                    return;
                }
                Session.set('serverDataResponse', response);
            });

            goToPage(2);
        },
        'click #back1': function () {

            goToPage(1);

        },
        'click #back2': function () {

            goToPage(2);

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

            goToPage(3);

        },
        'click [name="attendRadios"]': function ( event ) {

            if ($(event.target).val() == "confirm" ) {

                $("[name='rsvpConfirmMessage']").show();
                $("[name='rsvpDeclineMessage']").hide();

            } else {

                $("[name='rsvpConfirmMessage']").hide();
                $("[name='rsvpDeclineMessage']").show();

            }

            $('#submit').prop("disabled", false);
        },
        'click #submit': function () {

            var coming = $("input:radio[name='attendRadios']:checked").val() == "confirm";

            SelectedGuests.find({}).forEach( function(guest) {


                console.log("Guest: " + guest.Name);
                console.log("Coming: " + coming);
                Meteor.call('rsvpForGuest', guest._id, coming, function(err,response) {
                    if(err) {
                        Session.set('serverDataResponse', "Error:" + err.reason);
                        console.log(err);
                        console.log(err.reason);
                        return;
                    }
                    Session.set('serverDataResponse', response);
                });
            });


            goToPage(4);
        },
        'click #addComment': function () {

            $("[name='commentConfirmationMessage']").show();
            $('#commentField').prop("disabled", true);
            $('#addComment').hide();

        },
        'keyup #commentField': function (event) {

            if ($(event.target).val().length > 0) {
                $('#addComment').prop("disabled", false);
            } else {
                $('#addComment').prop("disabled", true);
            }

        },
        'keyup #searchField': function (event) {

            if ($(event.target).val().length > 0) {
                $('#search').prop("disabled", false);
            } else {
                $('#search').prop("disabled", true);
            }

        }
    });


    goToPage = function (pageNumber) {

        $("[name='page-1']").hide();
        $("[name='page-2']").hide();
        $("[name='page-3']").hide();
        $("[name='page-4']").hide();

        switch(pageNumber) {
            case 1:
                $("[name='page-1']").show();
                Session.set('currentPage', 1);

                // unchecking all checkboxes on page 2
                SelectedGuests.remove({});
                $('input:checkbox').each( function () {
                    $(this).removeAttr('checked');
                    $(this).parent().parent().removeClass("highlight-row");
                });

                // refocus the text field
                $('#searchField').focus();
                break;
            case 2:
                $("[name='page-2']").show();
                Session.set('currentPage', 2);

                // Unselect radio buttons on page 3
                $("input:radio").removeAttr("checked");
                $("[name='rsvpConfirmMessage']").hide();
                $("[name='rsvpDeclineMessage']").hide();
                $('#submit').prop("disabled", true);
                break;
            case 3:
                $("[name='page-3']").show();
                Session.set('currentPage', 3);
                break;
            case 4:
                $("[name='page-4']").show();
                $("[name='commentConfirmationMessage']").hide();
                $('#commentField').prop("disabled", false);
                $('#addComment').show();
                Session.set('currentPage', 4);
                break;
            default:
                Session.set('currentPage', 0);
                break;

        }

    }

}

