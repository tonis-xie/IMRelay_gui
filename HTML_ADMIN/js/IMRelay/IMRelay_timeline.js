// Called when the Visualization API is loaded.
var timeline1;
var timeline2;
var timeline3;
var timeline4;
var timeline5;
var timeline6;
var timeline7;
var timeline8;
var timeline9;
var timeline10;
var timeline11;
var timeline12;
var timeline13;
var timeline14;
var timeline15;
var timeline16;
var timeline_axis;

$(function () {

    // Create a JSON data table
    var data0 = [];
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var data4 = [];
    var data5 = [];
    var data6 = [];
    var data7 = [];
    var data8 = [];
    var data9 = [];
    var data10 = [];
    var data11 = [];
    var data12 = [];
    var data13 = [];
    var data14 = [];
    var data15 = [];
    var data16 = [];

    var start_date = new Date();
    start_date.setHours(0, 0, 0, 0);

    var end_date = new Date();
    end_date.setHours(23, 59, 59, 999);

    add_data(data1, 1, start_date, end_date);
    add_data(data2, 2, start_date, end_date);
    add_data(data3, 3, start_date, end_date);
    add_data(data4, 4, start_date, end_date);
    add_data(data5, 5, start_date, end_date);
    add_data(data6, 6, start_date, end_date);
    add_data(data7, 7, start_date, end_date);
    add_data(data8, 8, start_date, end_date);
    add_data(data9, 9, start_date, end_date);
    add_data(data10, 10, start_date, end_date);
    add_data(data11, 11, start_date, end_date);
    add_data(data12, 12, start_date, end_date);
    add_data(data13, 13, start_date, end_date);
    add_data(data14, 14, start_date, end_date);
    add_data(data15, 15, start_date, end_date);
    add_data(data16, 16, start_date, end_date);

    drawVisualization(data0, data1, data2, data3, data4, data5, data6, data7, data8, data9,
        data10, data11, data12, data13, data14, data15, data16, start_date, end_date);

});

function drawVisualization(data0, data1, data2, data3, data4, data5, data6, data7, data8, data9,
    data10, data11, data12, data13, data14, data15, data16, start_date, end_date) {
    
    // specify options  
    var options_primary = {

        //styling
        width: "auto",
        height: "52px",

        showMajorLabels: true,
        showMinorLabels: true,
        axisOnTop: false,

        animate: true,
        animateZoom: true,
        zoomable: true, //fires rangechange event
        //min and max viewable content
        "zoomMin": 1000 * 60,
        "zoomMax": 1000 * 60 * 60 * 24,

        //progress bar
        //start: start_date,
        //end: end_date,
        showCurrentTime: false, //show red bar
        //showCustomTime: true, //show blue bar

        //min and max content
        min: start_date,
        max: end_date,
    };
    /*var options_primary = {

        //styling
        width: "auto",
        height: "52px",
        //minHeight: 24, // pixels

        showMajorLabels: true,
        showMinorLabels: true,
        axisOnTop: false,

        style: "box",
        animate: true,
        animateZoom: true,
        //cluster: true,
        stackEvents: false,
        eventMargin: 6,  // minimal margin between events
        eventMarginAxis: 0, // minimal margin beteen events and the axis
        groupsOnRight: true,
        //groupsOrder: function,
        //groupsWidth: "40px",
        moveable: true, //fires rangechange event
        zoomable: true, //fires rangechange event
        //min and max viewable content
        "zoomMin": 1000 * 60,
        "zoomMax": 1000 * 60 * 60 * 24,

        //progress bar
        start: start_date,
        end: end_date,
        showCurrentTime: true, //show red bar
        //showCustomTime: true, //show blue bar

        //min and max content
        min: start_date,
        max: end_date,

        //editing of items
        dragAreaWidth: 0,
        editable: true,
        groupsChangeable: false,
        selectable: true, //fires select event
        unselectable: true,
        snapEvents: true,

        //button options
        showNavigation: false
        //showButtonNew: true          
    };*/

    // specify options    
    var options_secondary = {

        //styling
        width: "auto",
        height: "28px",
        //minHeight: 26, // pixels

        showMajorLabels: false,
        showMinorLabels: false,
        axisOnTop: false,

        style: "box",
        animate: true,
        animateZoom: true,
        //cluster: true,
        stackEvents: false,
        eventMargin: 6,  // minimal margin between events
        eventMarginAxis: 0, // minimal margin beteen events and the axis
        groupsOnRight: true,
        //groupsOrder: function,
        //groupsWidth : "40px",
        moveable: true, //fires rangechange event
        zoomable: true, //fires rangechange event
        //min and max viewable content
        "zoomMin": 1000 * 60,
        "zoomMax": 1000 * 60 * 60 * 24,

        //progress bar
        start: start_date,
        end: end_date,
        showCurrentTime: true, //show red bar
        //showCustomTime: true, //show blue bar

        //min and max content
        min: start_date,
        max: end_date,

        //editing of items
        dragAreaWidth: 10,
        editable: true,
        groupsChangeable: false,
        selectable: true, //fires select event
        unselectable: true,
        snapEvents: true,

        //button options
        showNavigation: false
        //showButtonNew: true
    };

    // Instantiate our timeline objects.
    timeline1 = new links.Timeline(document.getElementById('timeline' + 1));
    timeline2 = new links.Timeline(document.getElementById('timeline' + 2));
    timeline3 = new links.Timeline(document.getElementById('timeline' + 3));
    timeline4 = new links.Timeline(document.getElementById('timeline' + 4));
    timeline5 = new links.Timeline(document.getElementById('timeline' + 5));
    timeline6 = new links.Timeline(document.getElementById('timeline' + 6));
    timeline7 = new links.Timeline(document.getElementById('timeline' + 7));
    timeline8 = new links.Timeline(document.getElementById('timeline' + 8));
    timeline9 = new links.Timeline(document.getElementById('timeline' + 9));
    timeline10 = new links.Timeline(document.getElementById('timeline' + 10));
    timeline11 = new links.Timeline(document.getElementById('timeline' + 11));
    timeline12 = new links.Timeline(document.getElementById('timeline' + 12));
    timeline13 = new links.Timeline(document.getElementById('timeline' + 13));
    timeline14 = new links.Timeline(document.getElementById('timeline' + 14));
    timeline15 = new links.Timeline(document.getElementById('timeline' + 15));
    timeline16 = new links.Timeline(document.getElementById('timeline' + 16));
    timeline_axis = new links.Timeline(document.getElementById('timeline_axis'));

    // attach an event listener using the links events handler
    create_timeline_event_handlers(timeline1, 1);
    create_timeline_event_handlers(timeline2, 2);
    create_timeline_event_handlers(timeline3, 3);
    create_timeline_event_handlers(timeline4, 4);
    create_timeline_event_handlers(timeline5, 5);
    create_timeline_event_handlers(timeline6, 6);
    create_timeline_event_handlers(timeline7, 7);
    create_timeline_event_handlers(timeline8, 8);
    create_timeline_event_handlers(timeline9, 9);
    create_timeline_event_handlers(timeline10, 10);
    create_timeline_event_handlers(timeline11, 11);
    create_timeline_event_handlers(timeline12, 12);
    create_timeline_event_handlers(timeline13, 13);
    create_timeline_event_handlers(timeline14, 14);
    create_timeline_event_handlers(timeline15, 15);
    create_timeline_event_handlers(timeline16, 16);
    links.events.addListener(timeline_axis, 'ready', function () { timeline_axis.redraw(); });
    links.events.addListener(timeline_axis, 'rangechange', function () { onrangechange(timeline_axis); });

    // Draw our timelines with the created data and options
    timeline1.draw(data1, options_secondary);
    timeline2.draw(data2, options_secondary);
    timeline3.draw(data3, options_secondary);
    timeline4.draw(data4, options_secondary);
    timeline5.draw(data5, options_secondary);
    timeline6.draw(data6, options_secondary);
    timeline7.draw(data7, options_secondary);
    timeline8.draw(data8, options_secondary);
    timeline9.draw(data9, options_secondary);
    timeline10.draw(data10, options_secondary);
    timeline11.draw(data11, options_secondary);
    timeline12.draw(data12, options_secondary);
    timeline13.draw(data13, options_secondary);
    timeline14.draw(data14, options_secondary);
    timeline15.draw(data15, options_secondary);
    timeline16.draw(data16, options_secondary);
    timeline_axis.draw(data0, options_primary);

    timeline1.setOptions(options_secondary);
}

function create_timeline_event_handlers(tl, relay_nr) {

    links.events.addListener(tl, 'add', function() { onadd(tl); });
    links.events.addListener(tl, 'change', function() { onchange(tl); });
    links.events.addListener(tl, 'delete', function() { ondelete(tl); });
    links.events.addListener(tl, 'edit', function () { onedit(tl, relay_nr); });
    links.events.addListener(tl, 'rangechange', function() { onrangechange(tl); });
    links.events.addListener(tl, 'select', function () { onselect(tl, relay_nr); });
    links.events.addListener(tl, 'ready', function() { tl.redraw(); });
}

// Make a callback function for the select item
function onselect(tl, relay_nr) {

    var row = getSelectedRow(tl);
    var object_properties = tl.getItem(row);

    $("#relay_id").val(relay_nr);
    $("div#on_time input").val(date_d2_sub_d1_second(object_properties.start, object_properties.end));
    $("div#start_time input").val(date_to_hhmmss(object_properties.start));
    $("div#end_time_input input").val(date_to_hhmmss(object_properties.end));

    update_input_status_icons();
}

// callback function for the change item
function onchange(tl) {

    var row = getSelectedRow(tl);    
    update_item(tl, row);
    //document.getElementById("info").innerHTML = "item " + row + " changed<br>";
}

// callback function for the delete item
function ondelete(tl) {

    var row = getSelectedRow(tl);
    //document.getElementById("info").innerHTML = "item " + row + " deleted<br>";
}

// callback function for the edit item
function onedit(tl, relay_nr) {

    var row = getSelectedRow(tl);
    var object_properties = tl.getItem(row);

    $("#relay_id").val(relay_nr);
    $("div#on_time input").val(date_d2_sub_d1_second(object_properties.start, object_properties.end));
    $("div#start_time input").val(date_to_hhmmss(object_properties.start));
    $("div#end_time_input input").val(date_to_hhmmss(object_properties.end));

    update_input_status_icons();
}

// callback function for the add item
function onadd(tl) {

    var row = getSelectedRow(tl);    
    update_item(tl, row);
    //document.getElementById("info").innerHTML = "item " + row + " created<br>";
}

function onrangechange(tl) {

    var range = tl.getVisibleChartRange();
    timeline1.setVisibleChartRange(range.start, range.end);
    timeline2.setVisibleChartRange(range.start, range.end);
    timeline3.setVisibleChartRange(range.start, range.end);
    timeline4.setVisibleChartRange(range.start, range.end);
    timeline5.setVisibleChartRange(range.start, range.end);
    timeline6.setVisibleChartRange(range.start, range.end);
    timeline7.setVisibleChartRange(range.start, range.end);
    timeline8.setVisibleChartRange(range.start, range.end);
    timeline9.setVisibleChartRange(range.start, range.end);
    timeline10.setVisibleChartRange(range.start, range.end);
    timeline11.setVisibleChartRange(range.start, range.end);
    timeline12.setVisibleChartRange(range.start, range.end);
    timeline13.setVisibleChartRange(range.start, range.end);
    timeline14.setVisibleChartRange(range.start, range.end);
    timeline15.setVisibleChartRange(range.start, range.end);
    timeline16.setVisibleChartRange(range.start, range.end);
    timeline_axis.setVisibleChartRange(range.start, range.end);
}

function getSelectedRow(tl) {

    var row = undefined;
    var sel = tl.getSelection();
    if (sel.length) {
        if (sel[0].row != undefined) {
            row = sel[0].row;
        }
    }
    return row;
}

function update_item(tl, row) {

    var object_properties = tl.getItem(row);
    var content_string = date_to_hhmmss(object_properties.start) + " - " + date_to_hhmmss(object_properties.end);

    var properties = {
        'start': object_properties.start,
        'end': object_properties.end,
        'content': content_string
    };

    tl.changeItem(row, properties);
}

function add_data(data, relay_id, start_date, end_date) {

    var start_time = getRandomDate(start_date, end_date);
    var end_time = getRandomDate(start_time, end_date);
    var content_string = date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time);

    data.push({
        'start': start_time,
        'end': end_time,
        'content': content_string        
    });

    /*if (relay_id < 10) {
        data.push({
            'start': start_time,
            'end': end_time,
            'content': content_string
            //'group': '0' + relay_id
            //'className': (j + 1)
            // Optional: a field 'editable'
        });
    } else {
        data.push({
            'start': start_time,
            'end': end_time,
            'content': content_string
            //'group': relay_id
            //'className': (j + 1)
            // Optional: a field 'editable'
        });
    }*/
    
}