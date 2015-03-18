var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
        if (!Meteor.userId()) {
            this.render('login');
            $('#loginModal').modal('show');
            //return pause();
        } else {
            this.render('admin');
            //return;
        }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: ['admin']
});

Router.map(function(){
    this.route('home', {path: '/'} );
    this.route('admin', {path: '/admin'});
});
