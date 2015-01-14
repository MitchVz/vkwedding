if (Meteor.isClient) {
    Template.mainNav.events({
        'click #rsvpNavButton': function () {
            $('#navbarMenuButton').click();

            // Make the enter key click 'search'
            $(document).ready(function() {
                $(window).keydown(function(event){
                    if(event.keyCode == 13) {
                        $('#search').click();
                    }
                });
            });

            // Moving to page one and unchecking all checkboxes
            $("[name='page-2']").hide();
            $("[name='page-1']").show();
            $('input:checkbox').each( function () {
                $(this).removeAttr('checked');
                $(this).parent().parent().removeClass("highlight-row");
            });
        }
    });

}

