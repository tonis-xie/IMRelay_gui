$(document).ready(function () {

    function hide_timeline(hide) {
        //Find the box parent
        var box = $(".box").eq(0);
        //Find the body and the footer
        var bf = box.find(".box-body");
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
        var box = $(".box").eq(1);
        //Find the body and the footer
        var bf = box.find(".box-body");
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

    function hide_log(hide) {
        //Find the box parent
        var box = $(".box").eq(2);
        //Find the body and the footer
        var bf = box.find(".box-body");
        if (hide) {
            //bf.slideUp();
            //bf.hide();
            bf.css({ 'visibility': 'hidden' });
            bf.css({ 'position': 'absolute' });
        } else {
            //bf.slideDown();
            //bf.show();
            bf.css({ 'visibility': 'visible' });
            bf.css({ 'position': 'static' });
        }
    }

    $("a#timeline_menu_button").click(function () {

        hide_timeline(false);
        hide_table(true);
        hide_log(true);

    });

    $("a#feeder_settings_button").click(function () {        

        hide_timeline(true);
        hide_table(false);
        hide_log(true);

    });

    $("a#log_menu_button").click(function () {

        hide_timeline(true);
        hide_table(true);
        hide_log(false);

    });

    hide_table(true);
    hide_log(true);

    /*

    $("a#relay_list_tabbutton").click(function () {

        for (var r = 0; r < 16; r++) {
            clear_relay_list(r + 1);
        }

        update_relay_list_from_timeline(timeline1, 1);

        function update_relay_list_from_timeline(tl, relay_nr) {

            var timeline_data = tl.getData();
            var count = timeline_data.length;
            for (var c = 0; c < count; c++) {
                add_event_to_relay_list(relay_nr, date_to_hhmmss(timeline_data[c].start), date_to_hhmmss(timeline_data[c].end));
            }
        }
    });

    $("div#start_time input").keyup(function () {

        var on_time = parseInt($("div#on_time input").val(), 10);
        var start_time = hhmmss_to_second($("div#start_time input").val());
        var end_time = hhmmss_to_second($("div#end_time_input input").val());

        if (start_time >= 0) {

            var diff = end_time - start_time;
            if (diff > 0) {
                $("div#on_time input").val(diff);
            } else if (on_time > 0) {
                var end = start_time + on_time;
                $("div#end_time_input input").val(second_to_hhmmss(end));
            }
        }

        update_input_status_icons();
    });

    $("div#on_time input").keyup(function () {

        var on_time = parseInt($("div#on_time input").val(), 10);
        var start_time = hhmmss_to_second($("div#start_time input").val());

        if (on_time > 0 && on_time <= (24 * 60 * 60) && start_time > 0) {

            var end = (start_time + on_time);
            if (end < ((24 * 60 * 60))) {
                $("div#end_time_input input").val(second_to_hhmmss(end));
            }
        }

        update_input_status_icons();
    });

    $("div#end_time_input input").on('input', function () {

        var on_time = parseInt($("div#on_time input").val(), 10);
        var start_time = hhmmss_to_second($("div#start_time input").val());
        var end_time = hhmmss_to_second($("div#end_time_input input").val());

        if (start_time >= 0) {

            var diff = end_time - start_time;
            if (diff > 0) {
                $("div#on_time input").val(diff);
            }
        }

        update_input_status_icons();
    });

    $("button#add_event").click(function () {

        var relay_nr = $("#relay_id").val();
        var start_time = $("div#start_time input").val();
        var duration = $("div#on_time input").val();

        var time_seconds = hhmmss_to_second(start_time);
        if (~time_seconds) {

            //var new_event = "You have added an event for relay #" + relay_nr + " at " + start_time;
            //$("label#status_text").text(new_event).hide().fadeIn("slow");
            //jsobject.add_event(relay_nr, start_time, duration);

            var end_time_seconds = time_seconds + parseInt(duration, 10);
            var end_time = second_to_hhmmss(end_time_seconds);

            var content_string = start_time + " - " + end_time;

            var start_date = new Date();
            var hour = Math.floor((time_seconds / 3600) % 24);
            var min = Math.floor((time_seconds % 3600) / 60);
            var sec = Math.floor(time_seconds % 60);
            start_date.setHours(hour, min, sec, 0);

            var end_date = new Date();
            hour = Math.floor((end_time_seconds / 3600) % 24);
            min = Math.floor((end_time_seconds % 3600) / 60);
            sec = Math.floor(end_time_seconds % 60);
            end_date.setHours(hour, min, sec, 0);

            add_event_to_relay_list(relay_nr, start_time, end_time);
            timeline_add(start_date, end_date, content_string);
            //if (relay_nr < 10) {
            //    timeline_add(start_date, end_date, content_string, "0" + relay_nr);
            //} else {
            //    timeline_add(start_date, end_date, content_string, relay_nr);
            //}
        } // else {

            // error message
            //$("label#status_text").text("Error in format").hide().fadeIn("slow");
        //}
    });

    $("button#reset").click(function () {

        jsobject.reset_events();
    });

    $("button#start").click(function () {

        jsobject.start();
    });

    $("button#stop").click(function () {

        jsobject.stop();
    });

    $("button#send").click(function () {

        var cmd_str = $("#send_button").val();
        var relay_nr = $("#relay_id").val();

        jsobject.send(cmd_str, relay_nr);
    });

    */
});

