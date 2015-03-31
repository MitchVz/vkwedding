if (Meteor.isClient) {

    Accounts.config({
        forbidClientAccountCreation: true
    });

    Template.login.rendered = function () {
        $('#loginModal').modal('show');
    };

    Template.login.events({
        'click #loginButton': function () {
            $('#loginModal').modal('show');
        },
        'submit form': function (event, template) {
            event.preventDefault();
            var emailVar = template.find('#login-email').value;
            var passwordVar = template.find('#login-password').value;

            Meteor.loginWithPassword(emailVar, passwordVar, function (err) {
                if(err) {
                    $('#failedLogin').show();
                    $('#login-email').focus();
                }
            });

        },
        'keypress #login-email': function () {
            $('#failedLogin').hide();
        },
        'keypress #login-password': function () {
            $('#failedLogin').hide();
        }
    });
}

if (Meteor.isServer) {

    Accounts.config({
        forbidClientAccountCreation: true
    });

    if (!Meteor.users.findOne({username: 'admin'})) {
        Accounts.createUser({username: 'admin', email: 'vanderkram@gmail.com', password: 'honeymoonrise'})
    }

}