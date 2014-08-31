var themes = {
    "default": "css/bootstrap.min.css",
    "cyborg": "css/bootstrap_themes/cyborg/bootstrap.css",
    "darkly": "css/bootstrap_themes/darkly/bootstrap.css",
    "slate": "css/bootstrap_themes/slate/bootstrap.css",
    "spacelab": "css/bootstrap_themes/spacelab/bootstrap.css",
    "superhero": "css/bootstrap_themes/superhero/bootstrap.css",
    "united": "css/bootstrap_themes/united/bootstrap.css",
    "yeti": "css/bootstrap_themes/yeti/bootstrap.css"
}

$(function () {
 
    var themesheet = $('<link href="' + themes['default'] + '" rel="stylesheet" />');
    themesheet.appendTo('head');

    $('.theme-link').click(function () {
        var themeurl = themes[$(this).attr('data-theme')];
        themesheet.attr('href', themeurl);
    });

    function change_skin(cls) {
        $("body").removeClass("skin-blue skin-black");
        $("body").addClass(cls);
    }

    $('.adminlte-link').click(function () {
        var theme_name = $(this).attr('data-theme');
        if(theme_name == 'blue') {
            change_skin("skin-blue");
        } else {
            change_skin("skin-black");
        }        
    });

});
