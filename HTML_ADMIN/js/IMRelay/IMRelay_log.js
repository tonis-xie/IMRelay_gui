$(window).load(function () {
    "use strict";

    function generate_csv_from_table() {

        var csv = "data:text/csv; charset=utf-8,";
        csv += $('#log_table').table2CSV({ delivery: 'value' });

        $('a#download_log_button').attr("href", encodeURI(csv));
        $('a#download_log_button').attr("download", "IMRelay_log.csv");
    }

    g_LDA.log_table = new vis.DataSet();
    var log_table_localstorage = localStorage["feeder.log"];

    if (log_table_localstorage != null) {
        var log_table_json = JSON.parse(log_table_localstorage);
        g_LDA.log_table.update(log_table_json);
    }

    g_LDA.log_table.on('*', function () {

        var log_table_to_localstorage = g_LDA.log_table.get();
        localStorage["feeder.log"] = JSON.stringify(log_table_to_localstorage);
        dynatable_log.settings.dataset.originalRecords = log_table_to_localstorage;
        dynatable_log.process();
    });

    $('#log_table').dynatable({        
        dataset: {
            records: g_LDA.log_table.get(),
            perPageOptions: [10,20,50,100,200,500,1000]
        },        
        inputs: {
            queries: $('#search_relay_id')
        }
    }).bind('dynatable:afterProcess', generate_csv_from_table);

    var dynatable_log = $('#log_table').data('dynatable');
    dynatable_log.sorts.clear();
    dynatable_log.sorts.add('date', 1); // 1=ASCENDING, -1=DESCENDING
    dynatable_log.process();

})
