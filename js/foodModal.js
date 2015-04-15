if (Meteor.isClient) {

    Template.foodModal.events({
        'click #addMenuComment': function () {
            var name = $('#menuNameField').val();
            var comment = $('#menuCommentField').val();

            Meteor.call('addMenuComment', name, comment, function (err, response) {
                if (err) {
                    Session.set('serverDataResponse', "Error:" + err.reason);
                    console.log(err);
                    console.log(err.reason);
                    return;
                }
                Session.set('serverDataResponse', response);
            });

            sendMenuEmail(name, comment);

            $('#menuCommentDiv').hide();
            $('#menuCommentSuccess').show();
        }
    });

    sendMenuEmail = function(name, comment) {
        var emailSubject = name + " has a comment about our menu!"

        var emailMessage = "Hi Mitch and Cath,\r\rThis message is to let you know that " + name;
        emailMessage += " just left a comment concerning the menu!";

        emailMessage += "\r\r\"" + comment + "\"";

        emailMessage += "\r\rLove,\rThe Website";

        Meteor.call('sendEmail',
            'postmaster@mitchandcathwedding.com',
            emailSubject,
            emailMessage
        );
    }
}

