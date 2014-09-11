$(function () {

    function which_relays_should_toogle(time) {

        var relay_ids = [];

        var group_states = g_LDA.groups.get({
            // output the specified fields only
            fields: ['id', 'className']
        });

        for (var key in g_LDA.items._data) {

            if ((time < g_LDA.items._data[key].end) && (time > g_LDA.items._data[key].start) && (group_states[g_LDA.items._data[key].group - 1].className === 'vis_group_enabled')) {
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

            //check if settings are OK
            if ((g_LDA.relay[relay_id - 1].off_setting < 0) ||
                (g_LDA.relay[relay_id - 1].on_setting < 0) ||
                (isNaN(g_LDA.relay[relay_id - 1].on_setting)) ||
                (isNaN(g_LDA.relay[relay_id - 1].on_setting))) {
                error[relay_id - 1] = true;
            } else {
                error[relay_id - 1] = false;
            }

            //reset relay settings if on/off has reached 0
            if ((g_LDA.relay[relay_id - 1].on <= 0) &&
                (g_LDA.relay[relay_id - 1].off <= 0) ||
                (g_LDA.relay[relay_id - 1].on === undefined) ||
                (g_LDA.relay[relay_id -1].off === undefined)) {

                g_LDA.relay[relay_id - 1].off = g_LDA.relay[relay_id - 1].off_setting;
                g_LDA.relay[relay_id -1].on = g_LDA.relay[relay_id -1].on_setting;

            }

            //set relay output to 0 or 1
            if (g_LDA.relay[relay_id - 1].on > 0) {

                --g_LDA.relay[relay_id - 1].on;
                current_relay_states[relay_id - 1] = 1;
                //increase feed_progress_today value per tick
                g_LDA.feed[relay_id - 1] += (feeder_speed[relay_id - 1].feeder_speed_kg_pr_min / 60);

            } else if (g_LDA.relay[relay_id - 1].off > 0) {
                --g_LDA.relay[relay_id - 1].off;
                current_relay_states[relay_id - 1] = 0;
            }

        }

        for (each = 0; each < 16; each++) {
            relay_indicator_control(each + 1, current_relay_states[each] === 1, error[each]);
        }

        console.log(current_relay_states);

        return;

        $.ajax({
            url: "192.168.0.105",
            type: "POST",
            data: current_relay_states
        });

    }

    window.setInterval(relay_event_scheduler, 1000);

});
