define(['authorization','knockout','plugins/router'], function(authorization,ko,router){

    var viewModel = {

        activate: activate,
        signIn: signIn,
        hasProgress: ko.observable(false)

    };

    viewModel.username = ko.observable('');
    viewModel.password = ko.observable('');

    return viewModel;

    function signIn() {


        viewModel.hasProgress(true);

        authorization.signIn(viewModel.username(), viewModel.password()).then( function(data) {


            console.log('DATA',data);
            if (data) {

                authorization.user.username(data.username);
                authorization.user.userID(data.objectId);
                authorization.user.sessionToken(data.sessionToken);
                authorization.user.email(data.email);

                $('button[type=submit]').closest('form').find('input[type=text], input[type=password]').val('');
                viewModel.username('');
                viewModel.password('');

                viewModel.hasProgress(false);
                router.navigate('groups');

            }


            else {

                viewModel.hasProgress(false);
                $(".alert").show();

            }

            $('button[type=submit]').closest('form').find('input[type=text], input[type=password]').val('');
            viewModel.username('');
            viewModel.password('');

        });

    }

    function activate() {
        setTimeout(function(){
            $(".alert").hide();
        },100);

    }

});
