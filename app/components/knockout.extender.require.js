define(['knockout'], function(ko) {

    ko.extenders.required = function (target, message) {

        target.isValid = ko.computed(function () {
            var val = target().trim();
            return val.length > 0;
        });
        target.errorMessage = ko.computed(function () {
            return target.isValid() ? "" : message;
        });
        target.isModified = ko.observable(false);


        return target;
    };




});