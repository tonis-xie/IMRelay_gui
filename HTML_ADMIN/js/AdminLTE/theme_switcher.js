var themes = {
    "default": "css/bootstrap.css",
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

});
