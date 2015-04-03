$(window).load(function () {
    "use strict";

    g_LDA.log_table = new vis.DataSet();
    var log_table_localstorage = localStorage["feeder.log"];

    if (log_table_localstorage != null) {
        var log_table_json = JSON.parse(log_table_localstorage);
        g_LDA.log_table.update(log_table_json);
    }

    g_LDA.log_table.on('*', function () {

        var log_table_to_localstorage = g_LDA.log_table.get();
        localStorage["feeder.log"] = JSON.stringify(log_table_to_localstorage);

        var value = $("input[name=event_relay]:radio").val();
        write_log_table(value);

    });

});

function generate_csv_from_table() {

    var csv = "data:text/csv; charset=utf-8,";
    csv += $('#log_table').table2CSV({ delivery: 'value' });

    $('a#download_log_button').attr("href", encodeURI(csv));
    $('a#download_log_button').attr("download", "IMRelay_log.csv");
}

function write_log_table(relay_id) {

    $("#log_table > tbody").html("");
    $("#log_table > tfoot").html("");

    var html_table_body;
    var html_table_foot;
    var json_log_to_write = g_LDA.log_table.get({

        filter: function (item) {
            return item.relay_number == relay_id;            
        }

    });

    var len = $("#log_table").find("tr:first th").length;
    var columns = [];
    var footer = [];

    for (var i = 0; i < len; i++) {
        columns[i] = $('#log_table').find('th').eq(i).attr('data-dynatable-column');
        footer[columns[i]] = "";
    }
    
    footer.relay_name = "SUM"
    footer.nr_of_dead_fish = 0;
    footer.required_feed_pr_day = 0;
    footer.feed_progress_today = 0;
    footer.time_feeder_active = 0;
    footer.time_feeding_intervals = 0;

    var rows_in_json = 0;

    for (row in json_log_to_write) {
    
        html_table_body += log_table_row_writer(json_log_to_write[row], columns);
        footer.nr_of_dead_fish += +json_log_to_write[row].nr_of_dead_fish;
        footer.required_feed_pr_day += +json_log_to_write[row].required_feed_pr_day;
        footer.feed_progress_today += +json_log_to_write[row].feed_progress_today;
        footer.time_feeder_active += +json_log_to_write[row].time_feeder_active;
        footer.time_feeding_intervals += +json_log_to_write[row].time_feeding_intervals;
        rows_in_json++;

    }

    footer.date = rows_in_json + " days";
    html_table_foot += log_table_row_writer(footer, columns);

    $("#log_table > tbody").append(html_table_body);
    $("#log_table > tfoot").append(html_table_foot);

    generate_csv_from_table();

}

function log_table_cell_writer(cell_content) {

    var td = '<td';
    //td += ' style="text-align: right;"';
    //td += ' class="user_editable"';

    return td + '>' + cell_content + '</td>';
}

function log_table_row_writer(row, columns) {

    var tr = '';

    for (var i = 0; i < columns.length; i++) {

        var val = row[columns[i]];
        if (columns[i] == "required_feed_pr_day" || columns[i] == "feed_progress_today") {
            val = parseInt(val).toFixed(3);
            tr += log_table_cell_writer(val);
        } else if (columns[i] == "time_feeder_active" || columns[i] == "time_feeding_intervals") {
            val = parseInt(val).toFixed(1);
            tr += log_table_cell_writer(val);
        } else {
            tr += log_table_cell_writer(val);
        }
        
    }

    return '<tr>' + tr + '</tr>';
}