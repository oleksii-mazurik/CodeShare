define(['authorization','knockout'], function(authorization,ko) {

    var viewModel = {
        activate: activate,
        users: ko.observableArray([
        ]),
        getUsers: getUsers
    }

    return viewModel;

    function activate() {

        return authorization.getUsers().then(function (data) {

            viewModel.users(data);

        });

    }

    function getUsers() {

        return authorization.getUsers().then(function (data) {

            viewModel.users(data);

        });



//        for (var i = 0; i < data.length; i++) {
//            viewModel.users.push(data[i]);
//        }


    }

});