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

    var html_table;
    var json_log_to_write = g_LDA.log_table.get({

        filter: function (item) {
            return item.relay_number == relay_id;            
        }

    });

    var len = $("#log_table").find("tr:first th").length;
    var columns = [];

    for (var i = 0; i < len; i++) {
        columns[i] = $('#log_table').find('th').eq(i).attr('data-dynatable-column');        
    }

    for (row in json_log_to_write) {
        html_table += log_table_row_writer(json_log_to_write[row], columns);
    }

    $("#log_table > tbody").append(html_table);

    console.log("html_table", html_table);

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
        tr += log_table_cell_writer(row[columns[i]]);
    }

    return '<tr>' + tr + '</tr>';
}