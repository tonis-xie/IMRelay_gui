$(function () {

    /*
     *  var feeding_table_json = g_LDA.feeding_table.get({
            // output the specified fields only
            fields: ['id', 'state']
        });

        var group_classnames_to_localstorage = g_LDA.groups.get({
            // output the specified fields only
            fields: ['id', 'className']
        });
     */


    //console.log(which_relays_should_toogle(new Date()));
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

        for(var key in relay_states) {
            var relay_id = relay_states[key];
            console.log(relay_id);
        }

        return;
        //g_LDA.relay[]

        $.ajax({
            url: "192.168.0.105",
            data: relay_states
        });

    }
    
    window.setInterval(relay_event_scheduler, 1000);

});