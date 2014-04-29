define(['durandal/system','knockout'], function(system,ko){

    var viewModel = {
        signUp : signUp,
        signIn : signIn,
        getUsers : getUsers,
        getUserNames: getUserNames,
        logOut: logOut,
        user: {
            username: ko.observable(''),
            userID: ko.observable(''),
            sessionToken: ko.observable(''),
            email: ko.observable('')
        }
    };

    return viewModel;




    function getUserNames(userIDs){

        gettingUsers().then(function(data){


            if (data && data.results) {

                var userNames = [];

                var users = _.map(data.results, function(item) {
                    return { userID: item.objectId, username: item.username, email: item.email }
                });

                for (var i = 0; i < users.length; i++) {
                    for (var j = 0; j < userIDs; j++){
                        if (users[i].userID == userIDs[j]) {
                            userNames.push(users[i].username);
                        }
                    }

                }

                debugger;
                console.log('usernames',userNames);
                return userNames;

//                var userNames = [];
//                for (var i = 0; i < users.length; i++) {
//                    userNames.push(_.find(users,function(user){
//                        return user.userID == userIDs[i];
//                    }).username);
//                }

//                console.log(userNames);
//                return userNames;
            }

            else {
                return [];
            }

        });

    }

    function signUp(username,email,password) {

        var dfd = Q.defer();

        var user = {
            "username": username,
            "password": password,
            "email": email
        };


        console.log(JSON.stringify(user));

        $.ajax({

            url: 'https://api.parse.com/1/users',
            type: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json',
            beforeSend: function(request) {
                request.setRequestHeader('X-Parse-Application-Id','x3m45LnP7ptPaG3G3cdtXE0uGbAF8NBDU3l75Www');
                request.setRequestHeader('X-Parse-REST-API-Key','mOPIKcL0DAmp1Z1E1n9WE659aTx8J11JZwSsIzn8');
            },
            success: function(response) {
                dfd.resolve(response);
            },
            error: function() {
                dfd.resolve(undefined);
            }

        });

        return dfd.promise;

    }

    function signIn(username,password) {



        var dfd = Q.defer();

        $.ajax({

            url: 'https://api.parse.com/1/login',
            type: 'GET',
            data: 'username='+username+"&password="+password,
            beforeSend: function(request) {
                request.setRequestHeader('X-Parse-Application-Id','x3m45LnP7ptPaG3G3cdtXE0uGbAF8NBDU3l75Www');
                request.setRequestHeader('X-Parse-REST-API-Key','mOPIKcL0DAmp1Z1E1n9WE659aTx8J11JZwSsIzn8');
            },
            success: function(response) {
                dfd.resolve(response);
            },
            error: function() {
                dfd.resolve('');
            }

        });




        return dfd.promise;

    }

    function getUsers() {

        return gettingUsers().then(function(data) {

            var users = [];


            if (data && data.results) {
                users = _.map(data.results, function(item) {
                   return { userID: item.objectId, username: item.username, email: item.email }
                });
            }

            return users;

        });
    }


    function gettingUsers() {
        var dfd = Q.defer();

        $.ajax({

            url: 'https://api.parse.com/1/users',
            type: 'GET',
            beforeSend: function(request) {
                request.setRequestHeader('X-Parse-Application-Id','x3m45LnP7ptPaG3G3cdtXE0uGbAF8NBDU3l75Www');
                request.setRequestHeader('X-Parse-REST-API-Key','mOPIKcL0DAmp1Z1E1n9WE659aTx8J11JZwSsIzn8');
            },
            success: function(response) {
                dfd.resolve(response);
            },
            error: function() {
                console.log('ERROR');
                dfd.resolve('');
            }
        });

        return dfd.promise;
    }

    function logOut() {

        viewModel.user.username('');
        viewModel.user.userID('');
        viewModel.user.sessionToken('');
        viewModel.user.email('');

    }


});