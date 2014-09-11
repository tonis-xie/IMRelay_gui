//declare global g_LDA object
var g_LDA = {};
g_LDA.relay = [];
g_LDA.feed = [];

$(function () {

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
        var editable_columns = ["nr_of_fish", "avg_fish_kg", "feeder_speed_kg_pr_min", "feeding_percent", "growth_factor"];
        return $.inArray(column_name, editable_columns) !== -1 ? true : false;
    }

    function reduce_fraction(numerator, denominator) {
        var gcd = function gcd(a, b){
            return b ? gcd(b, a%b) : a;
        };

        gcd = gcd(numerator, denominator);

        return [numerator/gcd, denominator/gcd];
    }

    function feeding_table_row_writer(rowIndex, record, columns, cellWriter) {

        var tr = '';

        var start_date_datetime_object = new Date(record.start_date);
        var start_date_datetime_string =        start_date_datetime_object.getFullYear().toString() + '-' +
                                        ("0" + (start_date_datetime_object.getMonth() + 1).toString()).slice(-2) + '-' +
                                        ("0" +  start_date_datetime_object.getDate().toString()).slice(-2);

        record.start_date = start_date_datetime_string;     
        record.biomass = (record.nr_of_fish * record.avg_fish_kg / 1000);
        record.required_feed_pr_day = record.biomass * record.feeding_percent / 100;
        record.time_feeder_active = ((record.required_feed_pr_day / record.feeder_speed_kg_pr_min) * 60).toFixed(0);
        
        record.avg_fish_kg = (+record.avg_fish_kg).toFixed(0);
        record.biomass = (+record.biomass).toFixed(0);
        record.required_feed_pr_day = (+record.required_feed_pr_day).toFixed(3);

        if (isNaN(g_LDA.feed[rowIndex])) {
            g_LDA.feed[rowIndex] = 0;
        }
        record.feed_progress_today = (g_LDA.feed[rowIndex]).toFixed(0);

        var relay_indicator_toggle_factor = record.time_feeder_active / record.time_feeding_intervals;

        /* Calculate an reduced fraction for the feeder_toogle_speed */
        var feeder_toggle_speed = reduce_fraction(record.time_feeder_active, record.time_feeding_intervals);

        /* Calculate on-off times */
        record.feeder_toggle_speed = feeder_toggle_speed[0] + '/' + (feeder_toggle_speed[1] - feeder_toggle_speed[0]);

        g_LDA.relay[rowIndex] = { on_setting: feeder_toggle_speed[0], off_setting: (feeder_toggle_speed[1] - feeder_toggle_speed[0]) };

        $('#jknob' + (rowIndex + 1)).val(relay_indicator_toggle_factor * 100).trigger('change');

        if (relay_indicator_toggle_factor > 1) {
            
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
            var is_editable = cell.is('.editable');
            this.innerHTML = is_editable ? (btn_num + ': Edit') : (btn_num + ': Save');
            cell.prop('contenteditable', !is_editable).toggleClass('editable');

            if (is_editable) {

                var read = dynatable.records.getFromTable()[btn_num - 1];

                g_LDA.feeding_table.update([{
                    id: btn_num,
                    nr_of_fish: read.nr_of_fish,
                    avg_fish_kg: read.avg_fish_kg,
                    feeder_speed_kg_pr_min: read.feeder_speed_kg_pr_min,
                    feeding_percent: read.feeding_percent,
                    growth_factor: read.growth_factor
                }]);

            }

        });

    }

    function daily_event_updater(init) {

        if (!init) {

            var update_feeder_table = g_LDA.feeding_table.get();

            for (var key in update_feeder_table) {

                if (update_feeder_table[key].state === 'active') {

                    // this adds (amount of food eaten per fish * growth factor) to average fish weight
                    // +operator converts strings to numbers
                    update_feeder_table[key].avg_fish_kg = +update_feeder_table[key].avg_fish_kg +
                        (
                            update_feeder_table[key].avg_fish_kg
                            *
                            update_feeder_table[key].feeding_percent / 100
                            *
                            update_feeder_table[key].growth_factor
                        );

                }

            }

            g_LDA.feeding_table.update([
                { id: 1, avg_fish_kg: update_feeder_table[0].avg_fish_kg, feed_progress_today: 0 },
                { id: 2, avg_fish_kg: update_feeder_table[1].avg_fish_kg, feed_progress_today: 0 },
                { id: 3, avg_fish_kg: update_feeder_table[2].avg_fish_kg, feed_progress_today: 0 },
                { id: 4, avg_fish_kg: update_feeder_table[3].avg_fish_kg, feed_progress_today: 0 },
                { id: 5, avg_fish_kg: update_feeder_table[4].avg_fish_kg, feed_progress_today: 0 },
                { id: 6, avg_fish_kg: update_feeder_table[5].avg_fish_kg, feed_progress_today: 0 },
                { id: 7, avg_fish_kg: update_feeder_table[6].avg_fish_kg, feed_progress_today: 0 },
                { id: 8, avg_fish_kg: update_feeder_table[7].avg_fish_kg, feed_progress_today: 0 },
                { id: 9, avg_fish_kg: update_feeder_table[8].avg_fish_kg, feed_progress_today: 0 },
                { id: 10, avg_fish_kg: update_feeder_table[9].avg_fish_kg, feed_progress_today: 0 },
                { id: 11, avg_fish_kg: update_feeder_table[10].avg_fish_kg, feed_progress_today: 0 },
                { id: 12, avg_fish_kg: update_feeder_table[11].avg_fish_kg, feed_progress_today: 0 },
                { id: 13, avg_fish_kg: update_feeder_table[12].avg_fish_kg, feed_progress_today: 0 },
                { id: 14, avg_fish_kg: update_feeder_table[13].avg_fish_kg, feed_progress_today: 0 },
                { id: 15, avg_fish_kg: update_feeder_table[14].avg_fish_kg, feed_progress_today: 0 },
                { id: 16, avg_fish_kg: update_feeder_table[15].avg_fish_kg, feed_progress_today: 0 }
            ]);

            window.location.reload();

        }

        var datetime_now = new Date();
        //var midnight_tomorrow = new Date().setHours(24, 0, 0, 0);
        //update every x seconds, testing with: 
        var midnight_tomorrow = new Date();
        midnight_tomorrow.setSeconds(midnight_tomorrow.getSeconds() + 60);
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
                start_date: '0',
                nr_of_fish: '0',
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

        var feeder_table_to_localstorage = g_LDA.feeding_table.get();
        localStorage["feeder.table"] = JSON.stringify(feeder_table_to_localstorage);
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
