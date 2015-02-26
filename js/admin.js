if (Meteor.isClient) {

    Template.admin.helpers({
        'guest': function () {
            Meteor.subscribe('allGuests');
            return Guests;
        },
        settings: function () {
            return {
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    { key: 'FirstName', label: 'First Name' },
                    { key: 'LastName', label: 'Last Name', sort: '1' },
                    { key: 'Rsvp', label: 'RSVP\'d', fn: function (value) { return rsvpIcon(value); }},
                    { key: 'Attending', label: 'Attending', fn: function (value, object) { return attendingIcon(object); }},

                    // Uncomment this to allow for searching by song suggestions
                    //{ key: 'Song1', label: 'Song 1', hidden: true},
                    //{ key: 'Song2', label: 'Song 2', hidden: true},
                    //{ key: 'Song3', label: 'Song 3', hidden: true},
                    { key: 'SearchTerms', hidden: true}
                ]
            };
        },
        'selectedGuest': function () {
            return Session.get('Attendee');
        },
        'rsvp': function () {
            return Session.get('Rsvp');
        },
        'attending': function () {
            return Session.get('Attending');
        },
        'comments': function () {
            return Session.get('Comments');
        },
        'song1': function () {
            return Session.get('Song1');
        },
        'song2': function () {
            return Session.get('Song2');
        },
        'song3': function () {
            return Session.get('Song3');
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

            Session.set('Attendee', this.FirstName + ' ' + this.LastName);
            Session.set('Rsvp', this.Rsvp);
            Session.set('Attending', this.Attending);
            if (this.Attending) {
                Session.set('Song1', this.Song1);
                Session.set('Song2', this.Song2);
                Session.set('Song3', this.Song3);
                Session.set('Comments', this.Comments);
            } else {
                Session.set('Song1', '');
                Session.set('Song2', '');
                Session.set('Song3', '');
                Session.set('Comments', false);
            }

            if (typeof this.FirstName != 'undefined') {
                $('#songModal').modal('show');
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
    }

}

