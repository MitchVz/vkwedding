if (Meteor.isClient) {



    Template.rsvpModal.events({
        'click #search': function () {
            $("[name='page-1']").hide();
            $("[name='page-2']").show();
            $("#guestSelectorTable tbody tr:visible:even").each(function() {
                $(this).addClass("even");
            });
        },
        'click #back': function () {
            $("[name='page-2']").hide();
            $("[name='page-1']").show();
        },
        'click tbody > tr': function ( event ) {


            var input = $(event.target).parent().children(":first-child").children(":first-child");

            if (input.prop('checked')) {
                if (!$(event.target).parent().hasClass("even")) {
                    $(event.target).parent().css("background-color", "#4e5d6c");
                } else {
                    $(event.target).parent().css("background-color", "#485563");
                }
                input.prop('checked', false);
            } else {
                input.prop('checked', true);
                $(event.target).parent().css("background-color", "#00B3EE");
            }
        }
    });

}

