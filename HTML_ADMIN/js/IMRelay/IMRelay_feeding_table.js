$(function () {

    var table = new vis.DataSet();

    for (var i = 1; i <= 16; i++) {
        table.add({
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

    var view = new vis.DataView(table, {
        fields: ['id', 'state', 'start_date', 'nr_of_fish', 'avg_fish_kg',
                     'feeder_speed_kg_pr_min', 'feeding_percent']
    });

    view.on('*', function (event, properties, senderId) {

        var feeder_table_to_localstorage = view.get();
        localStorage["feeder.table"] = JSON.stringify(feeder_table_to_localstorage);

    });
    
    var myRecords = table.get();
    table.on('*', function (event, properties, senderId) {

        myRecords = table.get();

    });

    table.update([
        { id: 1, state: 'active' },
        { id: 2, state: 'active' }
    ]);

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

        // grab the record's attribute for each column
        for (var i = 0, len = columns.length; i < len; i++) {
            tr += cellWriter(columns[i], record);
        }

        return '<tr>' + tr + '</tr>';
    }
    
    $('#feeding_table').dynatable({
        features: {
            paginate: false,
            sorting: false,
            recordCount: false,
            search: false
        },
        dataset: {
            records: myRecords
        },
        writers: {
            _rowWriter: feeding_table_row_writer
        }
    });
    
    var dynatable = $('#feeding_table').data('dynatable');
    dynatable.sorts.clear();
    dynatable.sorts.add('id', 1); // 1=ASCENDING, -1=DESCENDING
    dynatable.process();

    $('#toogle_edit_button').click(function () {

        var cell = $('table#feeding_table tr td');
        var is_editable = cell.is('.editable');
        cell.prop('contenteditable', !is_editable).toggleClass('editable');

    });

});