define(['knockout','dataContext','jquery','bootstrap'], function(ko,dataContext){

    var viewModel = {
        groups: ko.observableArray([]),
        groupToAdd: ko.observable(''),
        activate: activate,
        hasProgress: ko.observable(true),
        addGroup: addGroup
    };

    return viewModel;

    function activate() {




            return dataContext.getGroups().then(function(groups){
                viewModel.hasProgress(true);
                viewModel.groups(groups);
                viewModel.hasProgress(false);
            });



    }

    function addGroup() {


        dataContext.addGroup(viewModel.groupToAdd()).then(function(data){


            if (data) {
                viewModel.groupToAdd('');


                $('#myModal').modal('hide');

                dataContext.getGroups().then(function(groups){
                    viewModel.groups(groups);
                });
            }

            else {
                console.log('ERROR');
            }


        });

    }


});