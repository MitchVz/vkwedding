if (Meteor.isClient) {

    SelectedGuest = new Meteor.Collection( null ); // Making a local meteor collection

    Template.admin.rendered = function () {
        Session.set('currentPage', 6); // for the enter click
        Session.set('showGuestList', true);
        Session.set('showSongList', false);
        Session.set('showMenuComments', false);
    };

    Template.admin.onCreated(function () {
        var instance = this;
        instance.autorun(function () {
            // subscribe to all guests
            instance.subscribe('allGuests');
            instance.subscribe('menuComments');
        });

        instance.guests = function () {
            return Guests.find({});
        };

        instance.songs = function () {
            var songs = [];

            var song1s = Guests.find({ Song1 : { $exists: true, $nin: [ "" ] } }, { _id:0 } ).fetch();
            song1s.forEach(function (guest) {

                if ($.grep(songs, function(e){ return e.Song == guest.Song1; }).length == 0) {
                    songs.push({ FirstName: guest.FirstName, LastName: guest.LastName, Song: guest.Song1, Date: guest.RsvpDate});
                }
            });

            var song2s = Guests.find({ Song2 : { $exists: true, $nin: [ "" ] } }, { _id:0 }).fetch();
            song2s.forEach(function (guest) {
                if ($.grep(songs, function(e){ return e.Song == guest.Song2; }).length == 0) {
                    songs.push({FirstName: guest.FirstName, LastName: guest.LastName, Song: guest.Song2, Date: guest.RsvpDate});
                }
            });

            var song3s = Guests.find({ Song3 : { $exists: true, $nin: [ "" ] } }, { _id:0 }).fetch();
            song3s.forEach(function (guest) {
                if ($.grep(songs, function(e){ return e.Song == guest.Song3; }).length == 0) {
                    songs.push({FirstName: guest.FirstName, LastName: guest.LastName, Song: guest.Song3, Date: guest.RsvpDate});
                }
            });

            return songs;
        };

        instance.comments = function () {
            return Comments.find({});
        };
    });

    Template.admin.helpers({
        'guest': function () {
            return Template.instance().guests();
        },
        'songs': function () {
            return Template.instance().songs();
        },
        'comments': function () {
            return Template.instance().comments();
        },
        guestListSettings: function () {
            return {
                rowsPerPage: 300,
                showFilter: true,
                fields: [
                    { key: 'Edit', label: '', fn: function () { return editIcon()}},
                    { key: 'FirstName', label: 'First Name' },
                    { key: 'LastName', label: 'Last Name' },
                    { key: 'Rsvp', label: 'RSVP\'d', fn: function (value) { return rsvpIcon(value); }},
                    { key: 'Attending', label: 'Attending', fn: function (value, object) { return attendingIcon(object); }},

                    // Uncomment this to allow for searching by song suggestions
                    //{ key: 'Song1', label: 'Song 1', hidden: true},
                    //{ key: 'Song2', label: 'Song 2', hidden: true},
                    //{ key: 'Song3', label: 'Song 3', hidden: true},
                    { key: 'SearchTerms', hidden: true},
                    { key: 'RsvpDate', label: "Time of RSVP", fn: function (date) { return moment(date).fromNow(); }},
                    { key: 'RsvpDate', label: "hiddenSortingDate", hidden: true, sort: -1 }

                ]
            };
        },
        songListSettings: function () {
            return {
                rowsPerPage: 50,
                showFilter: true,
                fields: [
                    { key: 'FirstName', label: 'First Name' },
                    { key: 'LastName', label: 'Last Name'},
                    { key: 'Song', label: 'Song' },
                    { key: 'Date', label: 'Requested', fn: function (date) { return moment(date).fromNow(); }},
                    { key: 'Date', label: 'hiddenSortingDate', hidden: true, sort: -1}
                ]
            };
        },
        menuCommentsSettings: function () {
            return {
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    { key: 'Name', label: 'Name', sort: 1 },
                    { key: 'Comment', label: 'Comment' }
                ]
            };
        },
        'selectedGuest': function() {
            return SelectedGuest.findOne();
        },
        'numberAttending': function () {
            return Guests.find({Attending: true}).count();
        },
        'numberNotAttending': function () {
            return Guests.find({Attending: false}).count();
        },
        'numberNotResponded': function () {
            return Guests.find().count() - Guests.find({Rsvp: true}).count();
        },
        'numberTotal': function () {
            return Guests.find().count();
        },
        'showGuestList': function () {
            return Session.get('showGuestList');
        },
        'showSongList': function () {
            return Session.get('showSongList');
        },
        'showMenuComments': function () {
            return Session.get('showMenuComments');
        }

    });

    Template.admin.events({
        'click #download-csv': function () {

            Meteor.subscribe('allGuests');

            var csvStringArray = buildCsvString(Guests.find().fetch());

            var blob = new Blob(csvStringArray, {type: "data:text/csv;charset=utf-8"});
            saveAs(blob, "GuestsForCath.csv");
        },
        'click .reactive-table tr': function (event) {

            if (Session.get('showGuestList'))
            {
                SelectedGuest.remove({});
                SelectedGuest.insert(this);

                var clickedElement = event.target.nodeName;
                if (clickedElement == "I" || clickedElement == "BUTTON") {
                    $('#editModal').modal('show');
                }
                else {
                    $('#songModal').modal('show');
                }
            }
        },
        'click #goto-songs-button': function () {
            Session.set('showGuestList', false);
            Session.set('showSongList', true);
            Session.set('showMenuComments', false);

        },
        'click #goto-guests-button': function () {
            Session.set('showGuestList', true);
            Session.set('showSongList', false);
            Session.set('showMenuComments', false);

        },
        'click #goto-menu-comments-button': function () {
            Session.set('showGuestList', false);
            Session.set('showSongList', false);
            Session.set('showMenuComments', true);

        },
        'click #logout': function () {
            Meteor.logout();
        },
        'click #addGuestButton': function () {

            // reset the modal
            $('#addSuccess').hide();
            $('#saveAdd').show();
            $('#addClose').html("Cancel");
            $('#firstNameAdd').prop("disabled", false);
            $('#lastNameAdd').prop("disabled", false);
            $('#searchTermsAdd').prop("disabled", false);
            $('#firstNameAdd').val("");
            $('#lastNameAdd').val("");
            $('#searchTermsAdd').val("");
            $('#addGuestModal').modal('show');
        },
        'click #saveEdit': function () {
            var firstName = $('#firstNameEdit').val();
            var lastName = $('#lastNameEdit').val();
            var searchTerms = $('#searchTermsEdit').val();
            var guest = SelectedGuest.findOne();

            if (firstName.length == 0 || lastName.length == 0 || searchTerms.length == 0) {
                console.log('You can\'t save empty strings');
            } else {
                Meteor.call('updateGuestInfo', guest._id, firstName, lastName, searchTerms, function(err,response) {
                    if(err) {
                        Session.set('serverDataResponse', "Error:" + err.reason);
                        console.log(err);
                        console.log(err.reason);
                        return;
                    } else {
                        $('#editSuccess').show();
                        $('#saveEdit').hide();
                    }
                    Session.set('serverDataResponse', response);
                });
            }
        },
        'click #saveAdd': function () {
            var firstName = $('#firstNameAdd').val();
            var lastName = $('#lastNameAdd').val();
            var searchTerms = $('#searchTermsAdd').val();

            if (firstName.length == 0 || lastName.length == 0 || searchTerms.length == 0) {
                console.log('You can\'t save empty strings');
            } else {
                Meteor.call('addNewGuest', firstName, lastName, searchTerms, function(err,response) {
                    if(err) {
                        Session.set('serverDataResponse', "Error:" + err.reason);
                        console.log(err);
                        console.log(err.reason);
                        return;
                    } else {
                        $('#addSuccess').show();
                        $('#saveAdd').hide();
                        $('#addClose').html("Close");
                        $('#firstNameAdd').prop("disabled", true);
                        $('#lastNameAdd').prop("disabled", true);
                        $('#searchTermsAdd').prop("disabled", true);
                    }
                    Session.set('serverDataResponse', response);
                });
            }
        },
        'click #deleteGuest': function () {

            var guest = SelectedGuest.findOne();
            var reallyDelete = confirm("Are you sure you want to delete " + guest.FirstName + " " + guest.LastName + "?"
                                        + "\nThis will delete any song requests and comments that the guest has made.");

            if (reallyDelete) {
                Meteor.call('deleteGuest', guest._id, function(err,response) {
                    if(err) {
                        Session.set('serverDataResponse', "Error:" + err.reason);
                        console.log(err);
                        console.log(err.reason);
                        return;
                    } else {
                        $('#editModal').modal('hide');
                        $('#deleteSuccessModal').modal('show');
                        setTimeout(function(){
                            $("#deleteSuccessModal").modal('hide');
                        }, 2000);
                    }
                    Session.set('serverDataResponse', response);
                });
            }
        },
        'keyup #firstNameEdit': function (event) {

            // Don't validate form for the enter key
            if (event.keyCode != 13) {
                validateEditForm();
            }
        },
        'keyup #lastNameEdit': function () {

            // Don't validate form for the enter key
            if (event.keyCode != 13) {
                validateEditForm();
            }
        },
        'keyup #searchTermsEdit': function () {

            // Don't validate form for the enter key
            if (event.keyCode != 13) {
                validateEditForm();
            }
        },
        'keyup #firstNameAdd': function (event) {

            // Don't validate form for the enter key
            if (event.keyCode != 13) {
                validateAddForm();
            }
        },
        'keyup #lastNameAdd': function () {

            // Don't validate form for the enter key
            if (event.keyCode != 13) {
                validateAddForm();
            }
        },
        'keyup #searchTermsAdd': function () {

            // Don't validate form for the enter key
            if (event.keyCode != 13) {
                validateAddForm();
            }
        }

    });

    rsvpIcon = function (rsvp) {
        if (rsvp) {
            return new Spacebars.SafeString("<span class='glyphicon glyphicon-ok'></span>");
        } else {
            return "";
        }
    };
    editIcon = function () {
        var button =    '<button class="btn btn-xs btn-primary edit-button" > \
                            <i class="glyphicon glyphicon-pencil"></i> \
                        </button>';
        return new Spacebars.SafeString(button);
    };
    attendingIcon = function (object) {
        if (object.Rsvp) {
            if (object.Attending) {
                return Spacebars.SafeString("<span class='glyphicon glyphicon-ok'></span>");
            } else {
                return Spacebars.SafeString("<span class='glyphicon glyphicon-remove'></span>");
            }
        } else {
            return "";
        }
    };
    buildCsvString = function (jsonObject) {
        var csvStringArray = ["FirstName,LastName,Rsvp,Attending,Song1,Song2,Song3,Comments"];

        jsonObject.forEach( function (guest) {
            csvStringArray[0] += "\n" +
                guest.FirstName + "," +
                guest.LastName + "," +
                guest.Rsvp + "," +
                guest.Attending + "," +
                "\"" + guest.Song1 + "\"," +
                "\"" + guest.Song2 + "\"," +
                "\"" + guest.Song3 + "\"," +
                "\"" + guest.Comments + "\"";
        });

        return csvStringArray;
    };
    validateEditForm = function () {

        $('#saveEdit').show();
        $('#editSuccess').hide()

        if ($('#firstNameEdit').val().length < 1 ||
            $('#lastNameEdit').val().length < 1 ||
            $('#searchTermsEdit').val().length < 1) {

            $('#saveEdit').prop("disabled", true);

            if ($('#firstNameEdit').val().length < 1) {

                $('#firstNameEdit').parent().parent().addClass("error");

            } else {
                $('#firstNameEdit').parent().parent().removeClass("error");
            }
            if ($('#lastNameEdit').val().length < 1) {

                $('#lastNameEdit').parent().parent().addClass("error");

            } else {
                $('#lastNameEdit').parent().parent().removeClass("error");
            }
            if ($('#searchTermsEdit').val().length < 1) {

                $('#searchTermsEdit').parent().parent().addClass("error");

            } else {
                $('#searchTermsEdit').parent().parent().removeClass("error");
            }

        } else {

            $('#firstNameEdit').parent().parent().removeClass("error");
            $('#lastNameEdit').parent().parent().removeClass("error");
            $('#searchTermsEdit').parent().parent().removeClass("error");
            $('#saveEdit').prop("disabled", false);
        }
    };
    validateAddForm = function () {

        $('#saveAdd').show();
        $('#addSuccess').hide()

        if ($('#firstNameAdd').val().length < 1 ||
            $('#lastNameAdd').val().length < 1 ||
            $('#searchTermsAdd').val().length < 1) {

            $('#saveAdd').prop("disabled", true);

        } else {

            $('#saveAdd').prop("disabled", false);
        }
    };
}

