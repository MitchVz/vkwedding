if (Meteor.isClient) {
    Template.mainContent.events({

    });

    Template.mainContent.rendered = function() {
        if(!this._rendered) {
            this._rendered = true;

            // Replacing the clock days, hours, and minutes labels
            $('.flip-clock-divider.days').children(":first-child").html("<img src='/images/clock/days_text.png'>");

            $('.flip-clock-divider.hours').children(":first-child").html("<img src='/images/clock/hours_text.png'>");

            $('.flip-clock-divider.minutes').children(":first-child").html("<img src='/images/clock/minutes_text.png'>");
        }
    }

}

