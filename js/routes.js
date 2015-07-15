var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
        if (!Meteor.userId()) {
            Session.set('currentPage', 5);

            this.render('login');
            //return pause();
        } else {
            $('#loginModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

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
    this.route('/kramer', {where: 'server'}).get(function() {
        this.response.writeHead(302, {
            'Location': "http://calvinwritersonline.org/kramer-mr-kramer/"
        });
        this.response.end();
    });
});

