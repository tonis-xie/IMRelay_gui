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

        column.textAlign = 'center';

        if (column.hidden || column.textAlign) {

            td += ' style="';

            // keep cells for hidden column headers hidden
            if (column.hidden) {
                td += 'display: none;';
            }

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

        editable_columns = [ "nr_of_fish", "avg_fish_kg", "feeder_speed_kg_pr_min", "feeding_percent" ];

        return $.inArray(column_name, editable_columns) != -1 ? true : false;

    }

    function feeding_table_row_writer(rowIndex, record, columns, cellWriter) {

        var tr = '';

        var start_date_datetime_object = new Date(record.start_date);
        var start_date_datetime_string =        start_date_datetime_object.getFullYear().toString() + '-' +
                                        ("0" + (start_date_datetime_object.getMonth() + 1).toString()).slice(-2) + '-' +
                                        ("0" +  start_date_datetime_object.getDate().toString()).slice(-2);

        record.start_date = start_date_datetime_string;
        record.biomass = record.nr_of_fish * record.avg_fish_kg;
        record.required_feed_pr_day = record.biomass * record.feeding_percent;
        record.time_feeder_active = record.required_feed_pr_day / record.feeder_speed_kg_pr_min;
        record.feeder_toggle_speed = record.time_feeder_active / record.time_feeding_intervals;

        tr += feeding_table_button_cell_writer(record.id);

        // grab the record's attribute for each column
        for (var i = 1, len = columns.length; i < len; i++) {
            tr += cellWriter(columns[i], record, feeding_table_column_iseditable(columns[i].id));
        }

        return '<tr>' + tr + '</tr>';
    }

    var feeding_table = new vis.DataSet();

    var feeding_table_localstorage = localStorage["feeder.table"];

    if (feeding_table_localstorage != null) {

        var feeding_table_json = JSON.parse(feeding_table_localstorage);
        feeding_table.update(feeding_table_json);

    } else {
        for (var i = 1; i <= 16; i++) {
            feeding_table.add({
                id: i,
                state: 'inactive',
                start_date: new Date().setHours(0, 0, 0, 0),
                nr_of_fish: '0',
                avg_fish_kg: '1',
                biomass: '1',
                feeder_speed_kg_pr_min: '1',
                feeding_percent: '1',
                required_feed_pr_day: '1',
                feed_progress_today: '1',
                time_feeding_intervals: '1',
                time_feeder_active: '1',
                feeder_toggle_speed: '1'
            });
        }
    }

    var view = new vis.DataView(feeding_table, {
        fields: ['id', 'state', 'start_date', 'nr_of_fish', 'avg_fish_kg',
                     'feeder_speed_kg_pr_min', 'feeding_percent']
    });

    view.on('*', function () {

        console.log('saved');

        var feeder_table_to_localstorage = view.get();
        localStorage["feeder.table"] = JSON.stringify(feeder_table_to_localstorage);

    });

    var feeding_table_records = feeding_table.get();
    feeding_table.on('*', function () {

        feeding_table_records = feeding_table.get();

    });

    feeding_table.update([
        { id: 1, state: 'active' },
        { id: 2, state: 'active' }
    ]);

    $('#feeding_table').dynatable({
        features: {
            paginate: false,
            sorting: false,
            recordCount: false,
            search: false
        },
        dataset: {
            records: feeding_table_records
        },
        writers: {
            _rowWriter: feeding_table_row_writer,
            _cellWriter: feeding_table_cell_writer
        }
    });

    var dynatable = $('#feeding_table').data('dynatable');
    dynatable.sorts.clear();
    dynatable.sorts.add('id', 1); // 1=ASCENDING, -1=DESCENDING
    dynatable.process();

//   for (var btn_num = 1; btn_num <= 16; btn_num++) {
//
//       $('#toogle_edit_button' + btn_num).click(function () {
//
//           var cells = $('table#feeding_table tr:nth-child(' + btn_num + ') td.user_editable');
//           var is_not_editable = !cells.is('.editable');
//
//           this.innerHTML = is_not_editable ? (btn_num + ': Save') : (btn_num + ': Edit');
//           cells.prop('contenteditable', is_not_editable).toggleClass('editable');
//
//
//       });
//   }
    function edit_save_feeding_table_button(btn_num) {

        $('#toogle_edit_button' + btn_num).click(function () {

            var cell = $('table#feeding_table tr:nth-child(' + btn_num + ') td.user_editable');
            var is_not_editable = !cell.is('.editable');

            this.innerHTML = is_not_editable ? (btn_num + ': Save') : (btn_num + ': Edit');
            cell.prop('contenteditable', is_not_editable).toggleClass('editable');

            if (!is_not_editable) {

                var html_nr_of_fish             = $('table#feeding_table tr:nth-child(' + btn_num + ') td:nth-child(4)').html();
                var html_avg_fish_kg            = $('table#feeding_table tr:nth-child(' + btn_num + ') td:nth-child(5)').html();
                var html_feeder_speed_kg_pr_min = $('table#feeding_table tr:nth-child(' + btn_num + ') td:nth-child(7)').html();
                var html_feeding_percent        = $('table#feeding_table tr:nth-child(' + btn_num + ') td:nth-child(8)').html();

                feeding_table.update([
                    { id: btn_num,
                        nr_of_fish: html_nr_of_fish,
                        avg_fish_kg: html_avg_fish_kg,
                        feeder_speed_kg_pr_min: html_avg_fish_kg,
                        feeding_percent: html_feeding_percent
                    },
                ]);
            }

        });

    }

    for (var btn_num = 1; btn_num <= 16; btn_num++) {
        edit_save_feeding_table_button(btn_num);
    }

    function daily_event_updater(init) {

        if (!init) {
            console.log("daily event has fired");
        }

        var datetime_now = new Date();
        //var midnight_tomorrow = new date().setHours(24, 0, 0, 0);
        //update every x seconds, testing with: 
        var midnight_tomorrow = new Date();
        midnight_tomorrow.setSeconds(midnight_tomorrow.getSeconds() + 10);

        window.setTimeout(daily_event_updater, midnight_tomorrow - datetime_now);

    }

    daily_event_updater(true);

});
