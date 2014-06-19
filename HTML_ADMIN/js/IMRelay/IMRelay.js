$(document).ready(function () {

    $(window).resize(function () {

        if ($('div#timelines').is(':visible')) {
            timeline1.checkResize();
            timeline2.checkResize();
            timeline3.checkResize();
            timeline4.checkResize();
            timeline5.checkResize();
            timeline6.checkResize();
            timeline7.checkResize();
            timeline8.checkResize();
            timeline9.checkResize();
            timeline10.checkResize();
            timeline11.checkResize();
            timeline12.checkResize();
            timeline13.checkResize();
            timeline14.checkResize();
            timeline15.checkResize();
            timeline16.checkResize();
            timeline_axis.checkResize();
        }

    });

    $("a#relay_list_tabbutton").click(function () {

        for (var r = 0; r < 16; r++) {
            clear_relay_list(r + 1);
        }

        update_relay_list_from_timeline(timeline1, 1);
        update_relay_list_from_timeline(timeline2, 2);
        update_relay_list_from_timeline(timeline3, 3);
        update_relay_list_from_timeline(timeline4, 4);
        update_relay_list_from_timeline(timeline5, 5);
        update_relay_list_from_timeline(timeline6, 6);
        update_relay_list_from_timeline(timeline7, 7);
        update_relay_list_from_timeline(timeline8, 8);
        update_relay_list_from_timeline(timeline9, 9);
        update_relay_list_from_timeline(timeline10, 10);
        update_relay_list_from_timeline(timeline11, 11);
        update_relay_list_from_timeline(timeline12, 12);
        update_relay_list_from_timeline(timeline13, 13);
        update_relay_list_from_timeline(timeline14, 14);
        update_relay_list_from_timeline(timeline15, 15);
        update_relay_list_from_timeline(timeline16, 16);

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
            }
            else if (on_time > 0) {
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
            var hour = Math.floor((end_time_seconds / 3600) % 24);
            var min = Math.floor((end_time_seconds % 3600) / 60);
            var sec = Math.floor(end_time_seconds % 60);
            end_date.setHours(hour, min, sec, 0);

            add_event_to_relay_list(relay_nr, start_time, end_time);
            timeline_add(start_date, end_date, content_string);
            /*if (relay_nr < 10) {
                timeline_add(start_date, end_date, content_string, "0" + relay_nr);
            } else {
                timeline_add(start_date, end_date, content_string, relay_nr);
            }*/
        }
        else {

            /* error message */
            //$("label#status_text").text("Error in format").hide().fadeIn("slow");
        }
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

});

function relay_indicator_control(relay_number, active) {

    var value1 = active ? "#000000" : "";
    var value2 = active ? "#1F8DFF" : "";
    var value3 = active ? "0 0 36px #3275cf" : "";

    document.getElementById("relay_" + relay_number).style.color = value1;
    document.getElementById("relay_" + relay_number).style.background = value2;
    document.getElementById("relay_" + relay_number).style.boxShadow = value3;
}