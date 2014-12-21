//declare global g_LDA object
var g_LDA = {};
g_LDA.relay = [];
g_LDA.feed = [];

function enable_vis_timeline_button_classes(btn_num) {

    if ($("#vis_controls_id_" + btn_num + " button:nth-child(2)").hasClass('btn-warning')) {

        $("#vis_controls_id_" + btn_num + " button:nth-child(2)").removeClass('active');
        $("#vis_controls_id_" + btn_num + " button:nth-child(3)").addClass('active');
        $("#vis_controls_id_" + btn_num + " button:nth-child(4)").removeClass('active');

    } else {

        $("#vis_controls_id_" + btn_num + " button:nth-child(2)").addClass('active');
        $("#vis_controls_id_" + btn_num + " button:nth-child(3)").removeClass('active');
        $("#vis_controls_id_" + btn_num + " button:nth-child(4)").removeClass('active');

        $("#vis_controls_id_" + btn_num + " div:nth-child(1)").addClass('btn-success').removeClass('btn-warning').removeClass('btn-default');
        $("#vis_controls_id_" + btn_num + " button:nth-child(2)").addClass('btn-success').removeClass('btn-warning').removeClass('btn-default');
        $("#vis_controls_id_" + btn_num + " button:nth-child(3)").addClass('btn-success').removeClass('btn-warning').removeClass('btn-default');
        $("#vis_controls_id_" + btn_num + " button:nth-child(4)").addClass('btn-success').removeClass('btn-warning').removeClass('btn-default');

    }

}

function disable_vis_timeline_button_classes(btn_num) {

    $("#vis_controls_id_" + btn_num + " button:nth-child(2)").removeClass('active');
    $("#vis_controls_id_" + btn_num + " button:nth-child(3)").removeClass('active');
    $("#vis_controls_id_" + btn_num + " button:nth-child(4)").addClass('active');

    $("#vis_controls_id_" + btn_num + " div:nth-child(1)").removeClass('btn-success').removeClass('btn-warning').addClass('btn-default');
    $("#vis_controls_id_" + btn_num + " button:nth-child(2)").removeClass('btn-success').removeClass('btn-warning').addClass('btn-default');
    $("#vis_controls_id_" + btn_num + " button:nth-child(3)").removeClass('btn-success').removeClass('btn-warning').addClass('btn-default');
    $("#vis_controls_id_" + btn_num + " button:nth-child(4)").removeClass('btn-success').removeClass('btn-warning').addClass('btn-default');

}

$(document).ready(function () {
    "use strict";

    function feeding_table_button_cell_writer(id) {

        var html_group_button = document.createElement('button');
        html_group_button.className = 'btn btn-default';
        html_group_button.type = 'button';
        html_group_button.id = 'toogle_edit_button' + id;
        html_group_button.innerText = id + ': Edit';

        return '<td style="width:65px;">' + html_group_button.outerHTML + '</td>';
    }

    function feeding_table_cell_writer(column, record, user_editable) {

        var html = column.attributeWriter(record);
        var td = '<td';

        //column.textAlign = 'center';

        if (column.hidden || column.textAlign) {

            td += ' style="';

            // keep cells aligned as their column headers are aligned
            if (column.textAlign) {
                td += 'text-align: ' + column.textAlign + ';';
            }

            td += '"';

        }

        if (user_editable) {
            td += ' class="user_editable"';
        }

        return td + '>' + html + '</td>';
    }

    function feeding_table_column_iseditable(column_name) {
        var editable_columns = ["relay_name", "nr_of_fish", "nr_of_dead_fish", "avg_fish_kg", "feeder_speed_kg_pr_min", "feeding_percent", "growth_factor"];
        return $.inArray(column_name, editable_columns) !== -1 ? true : false;
    }

    $("table#feeding_table").on("input", "td", function(e) {

        if ($.isNumeric($(this).html())) {
            $(this).css("color", "green");
        } else {
            $(this).css("color", "red");
        }
    });

    $("table#feeding_table").on("keypress", "td", function(e) {

        var regex = new RegExp("^[a-zA-Z0-9\.]+$");
        var str = String.fromCharCode(e.which);

        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
    });

    function feeding_table_row_writer(rowIndex, record, columns, cellWriter) {

        var tr = '';

        record.biomass = ((record.nr_of_fish - record.nr_of_dead_fish) * record.avg_fish_kg / 1000);
        record.required_feed_pr_day = record.biomass * record.feeding_percent / 100;
        record.time_feeder_active = +((record.required_feed_pr_day / record.feeder_speed_kg_pr_min) * 60).toFixed(0);

        if (isNaN(g_LDA.feed[rowIndex])) {
            g_LDA.feed[rowIndex] = 0;
        }

        record.feed_progress_today = (+g_LDA.feed[rowIndex]).toFixed(3);

        var relay_indicator_toggle_factor = 100 * record.time_feeder_active / record.time_feeding_intervals;

        /* Calculate on-off times */
        if ( relay_indicator_toggle_factor < 0.1 ) {
            record.feeder_toggle_speed = "<0.1";
        } else if ( relay_indicator_toggle_factor < 1 ) {
            record.feeder_toggle_speed = relay_indicator_toggle_factor.toFixed(1);
        } else {
            record.feeder_toggle_speed = relay_indicator_toggle_factor.toFixed(0);
        }

        if (record.state === "generic") {

            $("#vis_controls_id_" + (rowIndex + 1) + " div:nth-child(1) i").removeClass('fa-cutlery').addClass('fa-plug').removeClass('fa-ban');

            g_LDA.relay[rowIndex] = {
                type: "generic",
                total_on_ticks: record.time_feeder_active,
                total_off_ticks: record.time_feeding_intervals - record.time_feeder_active,
                toggle_factor: 0,
                on_ticks_remaining: 0,
                off_ticks_remaining: 0,
                accumulate: 0,
                on: 0,
                off: 0
            };

        } else {

            if (record.state === "feeder") {
                $("#vis_controls_id_" + (rowIndex + 1) + " div:nth-child(1) i").addClass('fa-cutlery').removeClass('fa-plug').removeClass('fa-ban');
            } else {
                $("#vis_controls_id_" + (rowIndex + 1) + " div:nth-child(1) i").removeClass('fa-cutlery').removeClass('fa-plug').addClass('fa-ban');
            }            

            g_LDA.relay[rowIndex] = {
                type: "feeder",
                total_on_ticks: record.time_feeder_active,
                total_off_ticks: record.time_feeding_intervals - record.time_feeder_active,
                toggle_factor: (record.time_feeder_active / record.time_feeding_intervals),
                on_ticks_remaining: record.time_feeder_active,
                off_ticks_remaining: record.time_feeding_intervals - record.time_feeder_active,
                accumulate: 0,
                on: 0,
                off: 0
            };

        }

        record.avg_fish_kg = (+record.avg_fish_kg).toFixed(0);
        record.biomass = (+record.biomass).toFixed(0);
        record.required_feed_pr_day = (+record.required_feed_pr_day).toFixed(3);
        record.time_feeder_active = (record.time_feeder_active / 60).toFixed(1);
        record.time_feeding_intervals = (record.time_feeding_intervals / 60).toFixed(1);

        /* Update relay names */
        $('#imrelay_knob_row > div > div div.knob_label_below').eq(rowIndex).text(record.relay_name);

        $('#jknob' + (rowIndex + 1)).val(relay_indicator_toggle_factor).trigger('change');

        if (relay_indicator_toggle_factor > 90) {

            $('#jknob' + (rowIndex + 1))
                .trigger(
                    'configure',
                    {
                        "fgColor": "red"
                    }
                );

        } else {

            $('#jknob' + (rowIndex + 1))
                .trigger(
                    'configure',
                    {
                        "fgColor": "#1f8dff"
                    }
                );

        }

        tr += feeding_table_button_cell_writer(record.id);

        // grab the record's attribute for each column
        for (var i = 1, len = columns.length; i < len; i++) {
            tr += cellWriter(columns[i], record, feeding_table_column_iseditable(columns[i].id));
        }

        return '<tr>' + tr + '</tr>';
    }

    function edit_save_feeding_table_button(btn_num) {

        $('#toogle_edit_button' + btn_num).click(function () {

            var cell = $('table#feeding_table tr:nth-child(' + btn_num + ') td.user_editable');
            var is_editable = cell.is('.active');
            this.innerHTML = is_editable ? (btn_num + ': Edit') : (btn_num + ': Save');
            cell.prop('contenteditable', !is_editable).toggleClass('active');

            /* Row is saved */
            if (is_editable) {

                var read = dynatable.records.getFromTable();

                /* Iterate and save all rows */
                var new_values = [];
                for (var relay_id = 0; relay_id < read.length; relay_id++) {
                    new_values.push({
                        id: relay_id+1,
                        relay_name: read[relay_id].relay_name,
                        nr_of_fish: read[relay_id].nr_of_fish,
                        nr_of_dead_fish: read[relay_id].nr_of_dead_fish,
                        avg_fish_kg: read[relay_id].avg_fish_kg,
                        feeder_speed_kg_pr_min: read[relay_id].feeder_speed_kg_pr_min,
                        feeding_percent: read[relay_id].feeding_percent,
                        growth_factor: read[relay_id].growth_factor
                    });
                }

                g_LDA.feeding_table.update(new_values);
            }

        });

    }

    function save_feeder_table_to_log(data_array) {

        data_array.forEach(function (entry) {

            if (entry.state === 'feeder') {

                g_LDA.log_table.add({
                    relay_number: entry.id, 
                    date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                    relay_name: entry.relay_name,
                    nr_of_fish: entry.nr_of_fish, 
                    nr_of_dead_fish: entry.nr_of_dead_fish, 
                    avg_fish_kg: entry.avg_fish_kg, 
                    biomass: entry.biomass, 
                    feeder_speed_kg_pr_min: entry.feeder_speed_kg_pr_min,
                    feeding_percent: entry.feeding_percent,
                    required_feed_pr_day: entry.required_feed_pr_day,
                    growth_factor: entry.growth_factor,
                    feed_progress_today: g_LDA.feed[entry.id - 1],
                    time_feeder_active: entry.time_feeder_active,
                    time_feeding_intervals: entry.time_feeding_intervals,
                    feeder_toggle_speed: entry.feeder_toggle_speed
                });

            }
            
        });

    }

    function daily_event_updater(init) {

        if (!init) {

            var update_feeder_table = g_LDA.feeding_table.get();
            save_feeder_table_to_log(dynatable.settings.dataset.records);

            for (var key in update_feeder_table) {

                if (update_feeder_table[key].state === 'feeder') {

                    update_feeder_table[key].nr_of_fish = update_feeder_table[key].nr_of_fish - update_feeder_table[key].nr_of_dead_fish;

                    if (+g_LDA.feed[key] > 0) {

                        // this adds (amount of food eaten per fish * feed factor) to average fish weight
                        // +operator converts strings to numbers
                        update_feeder_table[key].avg_fish_kg = +update_feeder_table[key].avg_fish_kg +
                                                                (
                                                                    (1000 * +g_LDA.feed[key])
                                                                    /
                                                                    +update_feeder_table[key].nr_of_fish
                                                                    /
                                                                    +update_feeder_table[key].growth_factor
                                                                );

                    }

                }

            }

            g_LDA.feeding_table.update([
                { id:  1, nr_of_fish: update_feeder_table[ 0].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 0].avg_fish_kg, feed_progress_today: 0 },
                { id:  2, nr_of_fish: update_feeder_table[ 1].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 1].avg_fish_kg, feed_progress_today: 0 },
                { id:  3, nr_of_fish: update_feeder_table[ 2].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 2].avg_fish_kg, feed_progress_today: 0 },
                { id:  4, nr_of_fish: update_feeder_table[ 3].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 3].avg_fish_kg, feed_progress_today: 0 },
                { id:  5, nr_of_fish: update_feeder_table[ 4].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 4].avg_fish_kg, feed_progress_today: 0 },
                { id:  6, nr_of_fish: update_feeder_table[ 5].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 5].avg_fish_kg, feed_progress_today: 0 },
                { id:  7, nr_of_fish: update_feeder_table[ 6].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 6].avg_fish_kg, feed_progress_today: 0 },
                { id:  8, nr_of_fish: update_feeder_table[ 7].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 7].avg_fish_kg, feed_progress_today: 0 },
                { id:  9, nr_of_fish: update_feeder_table[ 8].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 8].avg_fish_kg, feed_progress_today: 0 },
                { id: 10, nr_of_fish: update_feeder_table[ 9].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[ 9].avg_fish_kg, feed_progress_today: 0 },
                { id: 11, nr_of_fish: update_feeder_table[10].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[10].avg_fish_kg, feed_progress_today: 0 },
                { id: 12, nr_of_fish: update_feeder_table[11].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[11].avg_fish_kg, feed_progress_today: 0 },
                { id: 13, nr_of_fish: update_feeder_table[12].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[12].avg_fish_kg, feed_progress_today: 0 },
                { id: 14, nr_of_fish: update_feeder_table[13].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[13].avg_fish_kg, feed_progress_today: 0 },
                { id: 15, nr_of_fish: update_feeder_table[14].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[14].avg_fish_kg, feed_progress_today: 0 },
                { id: 16, nr_of_fish: update_feeder_table[15].nr_of_fish, nr_of_dead_fish: 0, avg_fish_kg: update_feeder_table[15].avg_fish_kg, feed_progress_today: 0 }
            ]);

            window.location.reload();

        }

        var datetime_now = new Date();
        var midnight_tomorrow = new Date().setHours(24, 0, 0, 0);
        //update every x seconds, testing with: 
        //var midnight_tomorrow = new Date();
        //midnight_tomorrow.setSeconds(midnight_tomorrow.getSeconds() + 30);
        window.setTimeout(daily_event_updater, midnight_tomorrow - datetime_now);

    }

    g_LDA.feeding_table = new vis.DataSet();
    var feeding_table_localstorage = localStorage["feeder.table"];

    if (feeding_table_localstorage != null) {
        var feeding_table_json = JSON.parse(feeding_table_localstorage);
        g_LDA.feeding_table.update(feeding_table_json);
    } else {

        for (var i = 1; i <= 16; i++) {

            g_LDA.feeding_table.add({
                id: i,
                relay_name: '',
                state: 'inactive',
                nr_of_fish: '0',
                nr_of_dead_fish: '0',
                avg_fish_kg: '0',
                feeder_speed_kg_pr_min: '0',
                feeding_percent: '0',
                growth_factor: '0',
                feed_progress_today: '0',
                time_feeding_intervals: '0'
            });

        }

    }

    g_LDA.feeding_table.on('*', function () {

        var group_buttons_json = g_LDA.groups.get({
            // output the specified fields only
            fields: ['id', 'className']
        });

        var feeder_table_to_localstorage = g_LDA.feeding_table.get();
        localStorage["feeder.table"] = JSON.stringify(feeder_table_to_localstorage);

        for (var key in feeder_table_to_localstorage) {

            if (feeder_table_to_localstorage[key].state === 'inactive') {
                group_buttons_json[key].className = 'vis_group_disabled';
                disable_vis_timeline_button_classes(group_buttons_json[key].id);
            } else {
                group_buttons_json[key].className = 'vis_group_enabled';
                enable_vis_timeline_button_classes(group_buttons_json[key].id);
            }

        }

        g_LDA.groups.update(group_buttons_json);

        dynatable.settings.dataset.originalRecords = feeder_table_to_localstorage;
        dynatable.process();

    });

    $('#feeding_table').dynatable({
        features: {
            paginate: false,
            sorting: false,
            recordCount: false,
            search: false
        },
        dataset: {
            records: g_LDA.feeding_table.get()
        },
        writers: {
            _rowWriter: feeding_table_row_writer,
            _cellWriter: feeding_table_cell_writer
        }
    }).bind('dynatable:afterProcess', function () {

        for (var btn_num = 1; btn_num <= 16; btn_num++) {
            edit_save_feeding_table_button(btn_num);
        }

    });

    var dynatable = $('#feeding_table').data('dynatable');
    dynatable.sorts.clear();
    dynatable.sorts.add('id', 1); // 1=ASCENDING, -1=DESCENDING
    dynatable.process();

    //start daily event updater = true
    daily_event_updater(true);

});
