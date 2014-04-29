define(['authorization','knockout','plugins/router'], function(authorization,ko,router){

    var viewModel = {

        activate: activate,
        signUp: signUp,
        hasProgress: ko.observable(false)

    };

    viewModel.username = ko.observable('');
    viewModel.email = ko.observable('');
    viewModel.password = ko.observable('');


    return viewModel;


    function signUp() {

        viewModel.hasProgress(true);

        authorization.signUp(viewModel.username(), viewModel.email(), viewModel.password()).then( function(data) {

            if (data) {

                authorization.signIn(viewModel.username(),viewModel.password()).then(function(data){

                    if (data) {

                        authorization.user.username(data.username);
                        authorization.user.userID(data.objectId);
                        authorization.user.sessionToken(data.sessionToken);
                        authorization.user.email(data.email);

                        viewModel.hasProgress(false);
                        router.navigate('groups');
                    }

                    else {
                        console.log('ERROR');
                    }

                });


            }
            else {
                console.log('Error');
            }


            $('button[type=submit]').closest('form').find('input[type=text], input[type=password], input[type=email]').val('');

        });

    }

    function activate() {


    }

});
