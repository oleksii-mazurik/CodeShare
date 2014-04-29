define(['jquery'],function($) {
    $(function () {
        $("body").on('keypress','textarea', function (e) {
            if (e.ctrlKey && (e.keyCode == 13 || e.keyCode == 10)) {
                $(this).closest('form').submit();
            }
        });
    });
});