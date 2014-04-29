define(['jquery','knockout','dataContext', 'plugins/router','authorization','hljs','bootstrap','bootstrap-switch'], function($,ko,dataContext,router,authorization){
    var viewModel = {
        groupUsers: ko.observableArray([]),
        groupName: ko.observable(''),
        groupID: ko.observable(''),
        activate: activate,
        reloadPage: reloadPage,
        groupCodes: ko.observableArray([]),
        deactivate: deactivate,
        code: ko.observable(''),
        codeBlockName: ko.observable(''),

        addCodeBlock: addBlock

    };

    return viewModel;


    function deactivate(){
        viewModel.groupCodes([]);
        viewModel.groupUsers([]);
        return dataContext.removeUserFromGroup(authorization.user.userID(),viewModel.groupID());
    }

    function unloadPage() {
        $('.codeBlock').remove();
        viewModel.groupCodes([]);
        viewModel.groupUsers([]);
        dataContext.removeUserFromGroup(authorization.user.userID(),viewModel.groupID());
    }

    function loadPage(id) {

        return dataContext.getGroup(id).then(function (group) {

            if (group) {

                viewModel.groupName(group.groupName);
                dataContext.addUserToGroup(authorization.user.userID(),group.id).then(function(data){

                    if (data) {



                        group.users.push(authorization.user.userID());
                        authorization.getUsers().then(function(users){

                            console.log('ALL USERS:',users);

                            for (var k = 0; k < users.length; k++) {
                                for (var j = 0; j < group.users.length; j++) {
                                    if (group.users[j] == users[k].userID) {
                                        console.log('new user added',users[k]);
                                        viewModel.groupUsers.push(users[k]);
                                    }
                                }
                            }

                            console.log('Group users:', viewModel.groupUsers());
                            viewModel.groupID(group.id);

                            for (var i = 0 ; i < group.codes.length; i++) {
                                dataContext.getCode(group.codes[i]).then(function(curCode) {
                                    viewModel.groupCodes.push({ codeName: curCode.codeName, codeID: curCode.id, code: curCode.code });
                                    addCodeBlock(curCode.code,curCode.codeName);
                                });
                            }

                            $.fn.bootstrapSwitch.defaults.size = 'small';
                            $("[name='my-checkbox']").bootstrapSwitch();


                            viewModel.code('');
                            viewModel.codeBlockName('');

                        });





                    }

                    else {

                        router.navigate('404');
                    }


                });

            }
            else {

                router.navigate('404');

            }
        });

    }


    function reloadPage() {
        unloadPage();
        loadPage(viewModel.groupID());
    }

    function activate(id) {

       return loadPage(id);

    }


    function addBlock() {

        dataContext.addCode(viewModel.code(),viewModel.codeBlockName()).then(function(data) {

            console.log(data);
            if (data) {

                dataContext.addCodeToGroup(viewModel.groupID(),data.objectId).then(function(){

                    addCodeBlock(viewModel.code(),viewModel.codeBlockName());
                    viewModel.groupCodes().push({ codeName: viewModel.codeBlockName(),codeID: data.objectId, code: viewModel.code() });

                    viewModel.code('');
                    viewModel.codeBlockName('');
                });
            }

        });
    }


    function addCodeBlock(codeText,codeName) {

        $('textarea').val('');


        var panel = createDiv('panel panel-default codeBlock');



        //HEAD

        var panelHead = createDiv('panel-heading');

        var row = createDiv('row');


        //1
        var firstCol = createDiv('col-md-9');

        var span = document.createElement('span');
        $(span).addClass('badge bg-info');
        span.innerHTML = codeName;


        firstCol.appendChild(span);


        //2
        var secondCol = createDiv('col-md-3 btn-group-sm controlCode');

        var buttonDelete = createButton('Delete','btn btn-default btnDelete');


        var buttonEdit = createButton('Edit', 'btn btn-default');

        secondCol.appendChild(buttonEdit);
        secondCol.appendChild(buttonDelete);


        row.appendChild(firstCol);
        row.appendChild(secondCol);


        panelHead.appendChild(row);



        //BODY

        var pre = document.createElement('pre');
        var code = document.createElement('code');
        pre.appendChild(code);
        code.innerText = codeText;


        var panelBody = createDiv('panel-body');
        panelBody.appendChild(pre);

        panel.appendChild(panelHead);
        panel.appendChild(panelBody);


        var codeBlock = document.getElementById('codes');

        codeBlock.appendChild(panel);


        $(buttonDelete).on('click',function(e){
            e.preventDefault();

            var self = this;
            $(self).attr('disabled','disabled');

            getCodeId(codeName).then( function(code) {

                console.log(code.codeID);

                dataContext.deleteCodeFromGroup(viewModel.groupID(),code.codeID).then(function(data){
                    if (data) {
                        viewModel.groupCodes.remove({ codeName: code.codeName,codeID: code.codeID, code: code.code});
                        $(self).closest('.codeBlock').remove();
                        console.log("SUCCESSFULLY DELETED!");
                    }
                    else {
                        console.log('ERROR!');
                    }
                });
            });
        });

        $(buttonEdit).on('click',function(e){

            e.preventDefault();
            console.log("EDITING...");

            var self = this;
            $(self).attr('disabled','disabled');

            getCodeId(codeName).then( function(code) {

                console.log(code.codeID);

                dataContext.deleteCodeFromGroup(viewModel.groupID(),code.codeID).then(function(data){
                    if (data) {
                        //console.log('THIS!');
                        viewModel.groupCodes.remove({ codeName: code.codeName,codeID: code.codeID, code: code.code});
                        $(self).closest('.codeBlock').remove();

                        console.log("SUCCESSFULLY DELETED and EDITING...")
                        viewModel.codeBlockName(code.codeName);
                        viewModel.code(code.code);

                        //console.log("SUCCESSFULLY DELETED and EDITING...");

                    }
                    else {

                        console.log('ERROR!');

                    }
                });
            });



        });

        lightCode();


    }



    function lightCode() {
        $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
    }


    function createDiv(className) {

        var div = document.createElement('div');

        if (className) {
            $(div).addClass(className);
        }

        return div;

    }

    function createButton(text,className) {

        var button = document.createElement('button');
        $(button).addClass(className);
        button.innerHTML = text;

        return button;

    }

    function getCodeId(codeName) {

        var dfd = Q.defer();

        var needCode = _.find(viewModel.groupCodes(),function(code) {

            return code.codeName == codeName;

        });


        dfd.resolve(needCode);

        return dfd.promise;

    }




});