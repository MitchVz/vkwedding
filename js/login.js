if (Meteor.isClient) {

    Accounts.config({
        forbidClientAccountCreation: true
    });

    Template.login.events({
        'click #loginButton': function () {
            $('#loginModal').modal('show');
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