$(function () {

    $("a#download_log_button").click(save_table_to_csv);

    function save_table_to_csv() {

        var csv = "data:text/csv; charset=utf-8,";
        csv += $('#log_table').table2CSV({ delivery: 'value' });

        var dl = document.createElement("a");
        dl.setAttribute("href", encodeURI(csv));
        dl.setAttribute("download", "IMRelay_log.csv");
        dl.click();
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
            records: g_LDA.log_table.get()
        },        
        inputs: {
            queries: $('#search_relay_id')
        }
    });

    var dynatable_log = $('#log_table').data('dynatable');
    dynatable_log.sorts.clear();
    dynatable_log.sorts.add('date', 1); // 1=ASCENDING, -1=DESCENDING
    dynatable_log.process();


})
