$(function () {

    var csv = "data:text/csv; charset=utf-8,";
    csv += $('#feeding_table').table2CSV({delivery:'value'});

    $('#download_log_button').attr("href", encodeURI(csv));
    $('#download_log_button').attr("download", "log_2014-10-03.csv");
})
