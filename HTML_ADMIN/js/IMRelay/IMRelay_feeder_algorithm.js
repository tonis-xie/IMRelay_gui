﻿function find_nearest_value_from_array(input_value) {

    var relay_toggle_array_values = [0, 1 / 10, 2 / 10, 3 / 10, 4 / 10, 5 / 10, 6 / 10, 7 / 10, 8 / 10, 9 / 10];
    var closest = null;

    $.each(relay_toggle_array_values, function () {

        if (closest === null || Math.abs(this - input_value) < Math.abs(closest - input_value)) {
            closest = this;
        }

    });

    return (closest * 10);
}

function which_relays_should_toogle(time) {

    var relay_ids = [];

    var group_states = g_LDA.groups.get({
        // output the specified fields only
        fields: ['id', 'className']
    });

    for (var key in g_LDA.items._data) {

        if ((time < g_LDA.items._data[key].end) && (time >= g_LDA.items._data[key].start) && (group_states[g_LDA.items._data[key].group - 1].className === 'vis_group_enabled')) {
            relay_ids.push(g_LDA.items._data[key].group);
        }
    }

    return relay_ids;
}

function relay_event_scheduler() {

    var relay_states = which_relays_should_toogle(new Date());
    var current_relay_states = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var error = [];
    var each = 0;

    var feeder_speed = g_LDA.feeding_table.get({
        // output the specified fields only
        fields: ['id', 'feeder_speed_kg_pr_min']
    });

    //reset all to 0
    for (each = 0; each < 16; each++) {
        current_relay_states[each] = 0;
    }

    for (var key in relay_states) {

        var relay_id = relay_states[key];

        //check if toggle factor is higher than 9 on 1 off
        if (g_LDA.relay[relay_id - 1].toggle_factor > 0.9) {
            error[relay_id - 1] = true;
        } else {
            error[relay_id - 1] = false;
        }

        //reset relay settings if on and off has reached 0
        if ((g_LDA.relay[relay_id - 1].on <= 0) && (g_LDA.relay[relay_id - 1].off <= 0)) {

            if (g_LDA.relay[relay_id - 1].type === "generic") {

                g_LDA.relay[relay_id - 1].on = g_LDA.relay[relay_id - 1].total_on_ticks;
                g_LDA.relay[relay_id - 1].off = g_LDA.relay[relay_id - 1].total_off_ticks;

            } else if ((g_LDA.relay[relay_id - 1].on_ticks_remaining + g_LDA.relay[relay_id - 1].off_ticks_remaining) >= 10) {

                //Bresenham Line Algorithm. Accumulate delta error over time
                g_LDA.relay[relay_id - 1].accumulate += g_LDA.relay[relay_id - 1].toggle_factor;
                //Calculate new toggle factor each time?
                /*g_LDA.relay[relay_id - 1].accumulate += (g_LDA.relay[relay_id - 1].on_ticks_remaining
                                                          /
                                                          (g_LDA.relay[relay_id - 1].on_ticks_remaining + g_LDA.relay[relay_id - 1].off_ticks_remaining));*/

                //recalculate on/off toggle speed
                var on_time = find_nearest_value_from_array(g_LDA.relay[relay_id - 1].accumulate);
                g_LDA.relay[relay_id - 1].accumulate -= (on_time / 10);

                g_LDA.relay[relay_id - 1].on = on_time;
                g_LDA.relay[relay_id - 1].off = 10 - on_time;

                g_LDA.relay[relay_id - 1].on_ticks_remaining -= on_time;
                g_LDA.relay[relay_id - 1].off_ticks_remaining -= (10 - on_time);

            } else {

                g_LDA.relay[relay_id - 1].on = g_LDA.relay[relay_id - 1].on_ticks_remaining;
                g_LDA.relay[relay_id - 1].off = g_LDA.relay[relay_id - 1].off_ticks_remaining;
                g_LDA.relay[relay_id - 1].on_ticks_remaining = 0;
                g_LDA.relay[relay_id - 1].off_ticks_remaining = 0;

            }

        }           

        var calc_biomass = (g_LDA.feeding_table._data[relay_id].nr_of_fish - g_LDA.feeding_table._data[relay_id].nr_of_dead_fish) * g_LDA.feeding_table._data[relay_id].avg_fish_kg / 1000;
        var total_feed = calc_biomass * g_LDA.feeding_table._data[relay_id].feeding_percent / 100;       

        //set relay output to 0 or 1
        if (g_LDA.relay[relay_id - 1].type === "feeder" && g_LDA.feed[relay_id - 1] >= total_feed) {
            current_relay_states[relay_id - 1] = 0;
        } else if ($("#vis_controls_id_" + relay_id + " button:nth-child(2)").hasClass('btn-warning')) {
            current_relay_states[relay_id - 1] = 0;
        } else if (g_LDA.relay[relay_id - 1].on > 0) {
            --g_LDA.relay[relay_id - 1].on;
            current_relay_states[relay_id - 1] = 1;
        } else if (g_LDA.relay[relay_id - 1].off > 0) {
            --g_LDA.relay[relay_id - 1].off;
            current_relay_states[relay_id - 1] = 0;
        }

    }

    var uuid_lock = localStorage.uuid_lock;

    var message = JSON.stringify({'uuid': uuid_lock, 'relays': current_relay_states});
    console.log(current_relay_states);    

    (function send_relays_to_device_over_ajax(current_relay_states) {

        if (g_LDA.ip_address.indexOf("192.168.") > -1 || g_LDA.ip_address.indexOf("169.254.") > -1) {

            $.ajax({
                url: "http://" + g_LDA.ip_address + "/relays.ajax",
                type: "POST",
                data: message,
                timeout: 500,
                success: function () {

                    var get_index_from_colum_id;

                    $("#feeding_table th").each(function (index) {

                        if ($(this).attr('data-dynatable-column') === 'feed_progress_today') {
                            get_index_from_colum_id = index;
                        }

                    });

                    for (var relay_counter = 0; relay_counter < 16; relay_counter++) {

                        var is_relay_active = current_relay_states[relay_counter] === 1;
                        relay_indicator_control(relay_counter + 1, is_relay_active, error[relay_counter], false);

                        if (is_relay_active && g_LDA.relay[relay_counter].type === "feeder") {

                            //increase feed_progress_today value per tick
                            g_LDA.feed[relay_counter] += (feeder_speed[relay_counter].feeder_speed_kg_pr_min / 60);

                            var cell = $('table#feeding_table tr:nth-child(' + (relay_counter + 1) + ') td:nth-child(' + (get_index_from_colum_id + 1) + ')');
                            cell.text((g_LDA.feed[relay_counter]).toFixed(3));

                        }

                    }

                    /* Animate fish to indicate a live connection */
                    var logo = Snap("#animated_lda_logo");
                    var signal = logo.select("#signal");
                    var ping = logo.select("#ping");

                    ping.attr({"visibility": "visible"});

                    var path_length = Snap.path.getTotalLength(signal);

                    Snap.animate(0, path_length, function(value) {
                        move_point = Snap.path.getPointAtLength(signal, value);
                        ping.attr({ cx: move_point.x, cy: move_point.y });
                    }, 800, 0, function() {
                        ping.attr({"visibility": "hidden"});
                    });

                    /* Set to green since we have success */
                    $("#connected_device_counter").removeClass("label-danger label-warning").addClass("label-success");

                },
                error: function (request, status, error) {

                    for (var each = 0; each < 16; each++) {
                        relay_indicator_control(each + 1, current_relay_states[each] === 1, error[each], true);
                    }

                    if (error === "timeout") {
                        console.log("error: timeout");
                    } else {
                        console.log(request.status, request.responseText, status, error);
                    }

                    /* Set to red since we have an error */
                    $("#connected_device_counter").removeClass("label-success label-warning").addClass("label-danger");

                }
            });

        }

    })(current_relay_states);

}
