if (Meteor.isClient) {

    Accounts.config({
        forbidClientAccountCreation: true
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