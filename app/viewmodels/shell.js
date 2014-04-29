define(['plugins/router','knockout','authorization','bootstrap'], function (router,ko,authorization) {

    var viewModel = {
        router: router,
        activate: activate,
        logOut: logOut,
        username: ko.computed(function() {
            return (authorization.user.username());
        }),
        authorized: ko.computed(function(){
              return  (authorization.user.username()) ? true : false;
        })
    };


    return viewModel;

    function activate() {

        setTimeout(function(){

            $('.active-links').click(function(){
                $('.active-links').removeClass('active');
                $(this).addClass('active');
            })

        }, 1000);

        router.map([
            { route: ['', 'home'], moduleId:'viewmodels/home', title: 'Home'},
            { route: 'signIn', moduleId: 'viewmodels/signIn', title: 'Sign In'},
            { route: '404', moduleId: 'viewmodels/404', title: 'Not found'  },
            { route: 'group/:id', moduleId: 'viewmodels/workingSpace', title: 'Work Space' },
            { route: 'signUp', moduleId: 'viewmodels/signUp', title: 'Sign Up' },
            { route: 'users', moduleId: 'viewmodels/users', title: 'Users' },
            { route: 'groups', moduleId: 'viewmodels/groups', title: 'Groups' }
        ]);

        return router.activate();
    }

    function logOut() {
        router.navigate('');
        authorization.logOut();
    }



});