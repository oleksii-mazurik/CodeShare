define(['authorization'], function(authorization){

    var viewModel = {

        getGroups: getGroups,
        addGroup: addGroup,
        addCode: addCode,
        getGroup: getGroup,
        addUserToGroup: addUserToGroup,
        deleteCodeFromGroup: deleteCodeFromGroup,
        removeUserFromGroup: removeUserFromGroup,
        getCode: getCode,
        addCodeToGroup: addCodeToGroup

    };

    return viewModel;

    function getGroups () {

        return parse('https://api.parse.com/1/classes/groups','GET').then( function(data) {
            var groups = [];

            if (data && data.results) {

                groups = _.map(data.results, function(item) {
                   return {

                       groupID : item.objectId,
                       codes: item.codes,
                       groupName: item.name

                   };
                });

            }
            return groups;
        } );

    }

    function addGroup(name) {


        var group = { name : name, codes : [], users: [] };

        return parse('https://api.parse.com/1/classes/groups','POST', group);

    }

    function parse(url,type,data) {

        var dfd = Q.defer();

        var options = {
            url: url,
            type: type,
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader('X-Parse-Application-Id', 'x3m45LnP7ptPaG3G3cdtXE0uGbAF8NBDU3l75Www');
                request.setRequestHeader('X-Parse-REST-API-Key', 'mOPIKcL0DAmp1Z1E1n9WE659aTx8J11JZwSsIzn8');
            },
            success: function(response) {
                dfd.resolve(response);
            },
            error: function(){
                dfd.resolve('');
            }
        };

        if (data) {
            options.data = JSON.stringify(data);
        }

        $.ajax(options);

        return dfd.promise;
    }

    function getGroup(id) {
        return parse('https://api.parse.com/1/classes/groups/' + id, 'GET').then(function(data){

            return data ? { id: data.objectId, groupName: data.name, codes: data.codes, users: data.users } : undefined;

        });
    }

    function getCode(codeId) {
        return parse('https://api.parse.com/1/classes/codes/' + codeId,'GET').then(function(data){
            return data ? { id: data.objectId, codeName: data.name, code: data.code } : undefined;
        })
    }

    function addCodeToGroup(groupID,codeID) {

        return getGroup(groupID).then(function(group){

            if(!group.codes) {
                group.codes = [];
            }
            group.codes.push(codeID);

            return parse('https://api.parse.com/1/classes/groups/' + groupID,'PUT', { codes: group.codes });

        });

    }

    function deleteCodeFromGroup(groupID,codeID) {
        return getGroup(groupID).then(function(group) {

            group.codes = _.reject(group.codes,function(code){
               return code == codeID;
            });

            return parse('https://api.parse.com/1/classes/groups/' + groupID,'PUT', { codes: group.codes }).then(function(){
                return parse('https://api.parse.com/1/classes/codes/' + codeID,'DELETE');
            });
        })
    }

    function addCode(code,name) {

        var codeCur = {
            name: name,
            code: code
        };

        return parse('https://api.parse.com/1/classes/codes','POST',codeCur);
    }



    function addUserToGroup(userID,groupID) {

        return getGroup(groupID).then(function(group) {

            if (userID) {


                if(!group.users) {
                    group.users = [];
                }

                group.users.push(userID);

                return parse('https://api.parse.com/1/classes/groups/' + groupID,'PUT', { users: group.users });
            }
            else {
                return ('');
            }


        });


    }

    function removeUserFromGroup(userID,groupID) {

//        console.log('userID:',userID);
//        console.log('groupID:',groupID);

        return getGroup(groupID).then(function(group) {



            if (!group.users) {
                return 'There are no group users here';
            }

            group.users = _.reject(group.users, function(user){
               return user == userID;
            });

            return parse('https://api.parse.com/1/classes/groups/' + groupID,'PUT', { users: group.users });
        });
    }



});