ko.extenders.required = function (target, message) {

    target.isValid = ko.computed(function () {
        var val = target().trim();
        return val.length > 0;
    });
    target.errorMessage = ko.computed(function() {
        return target.isValid() ? "" : message;
    });
    target.isModified = ko.observable(false);
    

    return target;
};

ko.extenders.notify = function(target, message) {
    target.subscribe(function() {
        alert(message);
    });

    return target;
};

ko.observable.fn.asNumeric = function(n) {
    var that = this;    

    return ko.computed({
        read: that,
        write: function(val) {
            var v = parseInt(val, 10);            
            that(isNaN(v) ? 0 : v);
        }
    });
};


var amount = ko.observable().asNumeric("aaa");


var viewModel = (function () {
    var today = new Date();

    var self = {
        _tasks: {}
    };

    self._tasks[getKey(today)] = ko.observableArray([{ text: ko.observable('Доделать 1 домашнее задание').extend({ required: 'message' }), completed: ko.observable(false) }, { text: ko.observable('Проверить 1 домашнее задание').extend({ required: 'message' }), completed: ko.observable(true) }]);
    
    var viewModel = {
        currentDate: ko.observable(today),
        tasks: ko.observableArray([])
    };


    viewModel.currentDate.subscribe(applyTasks);

    applyTasks(viewModel.currentDate());

    viewModel.taskToAdd = ko.observable('').extend({ required: "You should specify a text" });
    
    viewModel.addTask = function () {
        if (!viewModel.taskToAdd.isValid()) {
            viewModel.taskToAdd.isModified(true);
            return;
        }

        viewModel.tasks.push({ text: ko.observable(viewModel.taskToAdd()).extend({ required: "Task text is required", notify: 'Task text was changed' }), completed: ko.observable(false).extend({ notify: 'Task was marked as completed'}) });
        viewModel.taskToAdd.isModified(false);
        viewModel.taskToAdd('');
    };
    viewModel.removeTask = function (item) {
        viewModel.tasks.remove(item);
    };
    viewModel.toggleCompleted = function (item) {
        item.completed(!item.completed());
    };
    
    viewModel.filter = ko.observable('');
    viewModel.filteredTasks = ko.computed(function () {
        var filter = viewModel.filter().trim();
        
        if (filter.length < 1) {
            return viewModel.tasks();
        }
        
        var result = [];

        _.each(viewModel.tasks(), function (item) {
            if (item.text().indexOf(filter) > -1) {
                result.push(item);
            }
        });

        return result;

    });

    return viewModel;


    function getKey(date) {
        return "" + date.getFullYear() + date.getMonth() + date.getDate();
    }

    function applyTasks(date) {
        if (!self._tasks[getKey(date)]) {
            self._tasks[getKey(date)] = ko.observableArray([]);
        }

        viewModel.tasks(self._tasks[getKey(date)]());
    }

})();

ko.applyBindings(viewModel);