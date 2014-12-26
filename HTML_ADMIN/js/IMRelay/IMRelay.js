$(document).ready(function () {
    "use strict";

    function hide_timeline(hide) {
        //Find the box parent
        var bf = $(".box").eq(1);
        if (hide) {
            //bf.slideUp();
            //bf.hide();
            bf.css({'visibility':'hidden'});
            bf.css({'position':'absolute'});
        } else {
            //bf.slideDown();
            //bf.show();
            bf.css({'visibility':'visible'});
            bf.css({'position':'static'});
        }
    }

    function hide_event_settings(hide) {
        //Find the box parent
        var bf = $(".box").eq(2);
        if (hide) {
            //bf.slideUp();
            //bf.hide();
            bf.css({'visibility':'hidden'});
            bf.css({'position':'absolute'});
        } else {
            //bf.slideDown();
            //bf.show();
            bf.css({'visibility':'visible'});
            bf.css({'position':'static'});
        }
    }

    function hide_table(hide) {
        //Find the box parent
        var bf = $(".box").eq(3);
        if (hide) {
            //bf.slideUp();
            //bf.hide();
            bf.css({'visibility':'hidden'});
            bf.css({'position':'absolute'});
        } else {
            //bf.slideDown();
            //bf.show();
            bf.css({'visibility':'visible'});
            bf.css({'position':'static'});
        }
    }

    $("a#timeline_menu_button").click(function () {

        hide_timeline(false);
        hide_event_settings(true);
        hide_table(true);

    });

    $("a#event_settings_button").click(function () {

        hide_timeline(true);
        hide_event_settings(false);
        hide_table(true);

    });

    $("a#feeder_settings_button").click(function () {        

        hide_timeline(true);
        hide_event_settings(true);
        hide_table(false);

    });

    hide_event_settings(true);
    hide_table(true);

    $("a#clear_localstorage_button").click(function () {

        if (confirm('Are you sure you want to delete all settings and logs?')) {

            localStorage.clear();
            window.location.reload();
            //localStorage.removeItem(key);

        }

    });

    $( "#font_size_slider" ).slider({
        value:100,
        min: 80,
        max: 200,
        step: 10,
        slide: function( event, ui ) {
            $( "#feeding_table td, #feeding_table th, #feeding_table button" ).css( "font-size", ui.value + "%" );
            $( "#font_size" ).html( ui.value + "%" );
        }
    });

    var device_subnet_localstorage = localStorage.device_subnet;
    if (device_subnet_localstorage != null) {
        $("a span#device_subnet").text(device_subnet_localstorage);
    }

    $("ul#device_subnet_list > li > a").click(function () {

        //var subnet_label = $(this).find("h3").text();
        var device_subnet = $(this).find("p").text();
        $("a span#device_subnet").text(device_subnet);
        localStorage.device_subnet = device_subnet;
        window.location.reload();

    });

});

