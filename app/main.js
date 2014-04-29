requirejs.config({
    paths: {
        'text': '../scripts/text',
        'durandal': '../scripts/durandal',
        'transitions': '../scripts/durandal/transitions',
        'plugins': '../scripts/durandal/plugins',
        'knockout': '../scripts/knockout-3.1.0',
        'bootstrap': '../scripts/bootstrap',
        'bootstrap-switch': '../scripts/bootstrap-switch',
        'jquery': '../scripts/jquery-1.9.1',
        'hljs': '../scripts/highlight.pack'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});


define(['durandal/system', 'durandal/app', 'durandal/viewLocator'], function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");



    Parse.initialize("x3m45LnP7ptPaG3G3cdtXE0uGbAF8NBDU3l75Www", "lDwCD6NbMRWIJh1aPqpl9vA5N9xDFErKhRJHW92G");

    app.title = 'Code Share App';

    app.configurePlugins({
        router: true
    });


    app.start().then(function () {

        viewLocator.useConvention();
        app.setRoot('viewmodels/shell','entrance');

    });




});

