// Called when the Visualization API is loaded.
$(function () {

    function create_html_button(id) {

        var html_group_button = document.createElement('button');
        html_group_button.className = 'btn btn-default vis_btn_disabled';
        html_group_button.type = 'button';
        html_group_button.id = 'vis_group_button_' + id;
        html_group_button.innerText = id + ': Disabled';

        return html_group_button;
    }

    var groups = new vis.DataSet([
      { id: 1, className: 'vis_group_disabled', content: create_html_button(1), value: 1 },
      { id: 2, className: 'vis_group_disabled', content: create_html_button(2), value: 2 },
      { id: 3, className: 'vis_group_disabled', content: create_html_button(3), value: 3 },
      { id: 4, className: 'vis_group_disabled', content: create_html_button(4), value: 4 },
      { id: 5, className: 'vis_group_disabled', content: create_html_button(5), value: 5 },
      { id: 6, className: 'vis_group_disabled', content: create_html_button(6), value: 6 },
      { id: 7, className: 'vis_group_disabled', content: create_html_button(7), value: 7 },
      { id: 8, className: 'vis_group_disabled', content: create_html_button(8), value: 8 },
      { id: 9, className: 'vis_group_disabled', content: create_html_button(9), value: 9 },
      { id: 10, className: 'vis_group_disabled', content: create_html_button(10), value: 10 },
      { id: 11, className: 'vis_group_disabled', content: create_html_button(11), value: 11 },
      { id: 12, className: 'vis_group_disabled', content: create_html_button(12), value: 12 },
      { id: 13, className: 'vis_group_disabled', content: create_html_button(13), value: 13 },
      { id: 14, className: 'vis_group_disabled', content: create_html_button(14), value: 14 },
      { id: 15, className: 'vis_group_disabled', content: create_html_button(15), value: 15 },
      { id: 16, className: 'vis_group_disabled', content: create_html_button(16), value: 16 }
    ]);

    var start_date = new Date();
    start_date.setHours(0, 0, 0, 0);
    var end_date = new Date();
    end_date.setTime(start_date.getTime() + (24 * 60 * 60 * 1000));

    var start_time;
    var end_time;
    var content_string;

    // create a dataset with items
    // note that months are zero-based in the JavaScript Date object, so month 3 is April
    var items = new vis.DataSet([      
      { id: 100, group: 1, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 200, group: 2, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 300, group: 3, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 400, group: 4, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 500, group: 5, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 600, group: 6, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 700, group: 7, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 800, group: 8, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 900, group: 9, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1000, group: 10, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1100, group: 11, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1200, group: 12, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1300, group: 13, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1400, group: 14, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1500, group: 15, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) },
      { id: 1600, group: 16, start: (start_time = getRandomDate(start_date, end_date)), end: (end_time = getRandomDate(start_time, end_date)), content: (date_to_hhmmss(start_time) + " - " + date_to_hhmmss(end_time)) }
    ]);

    // create visualization
    var container = document.getElementById('vis_timeline');
    var options = {

        align: "center",
        autoResize: true,
        editable: {
            add: true,          // add new items by double tapping
            remove: true,       // delete an item by tapping the delete button top right            
            updateGroup: false,  // drag items from one group to another            
            updateTime: true // drag items horizontally
        },
        end: end_date,
        // option groupOrder can be a property name or a sort function
        // the sort function must compare two groups and return a value
        //     > 0 when a > b
        //     < 0 when a < b
        //       0 when a == b
        groupOrder: function (a, b) {
            return a.value - b.value;
        },
        //height: '28px',
        margin: {
            axis: 0,
            item: 6
        },
        max: end_date,
        //maxHeight: '28px',
        min: start_date,
        //minHeight: '28px',
        onAdd: function (item, callback) {
            if (start_date <= item.start && end_date >= item.end && (date_to_hhmmss(item.start) < date_to_hhmmss(item.end) || date_to_hhmmss(item.end) == "00:00:00")) {
                item.content = date_to_hhmmss(item.start) + " - " + date_to_hhmmss(item.end);
                callback(item); // send back adjusted item
            }
            else {
                callback(null); // cancel updating the item
            }
        },
        //onUpdate
        onMove: function (item, callback) {
            if (start_date <= item.start && end_date >= item.end && (date_to_hhmmss(item.start) < date_to_hhmmss(item.end) || date_to_hhmmss(item.end) == "00:00:00")) {
                item.content = date_to_hhmmss(item.start) + " - " + date_to_hhmmss(item.end);
                callback(item); // send back adjusted item
            }
            else {
                callback(null); // cancel updating the item
            }
        },
        onRemove: function (item, callback) {
            if (confirm('Remove item from relay ' + item.group + '? ' + '(' + item.content + ')')) {
                callback(item); // confirm deletion
            }
            else {
                callback(null); // cancel deletion
            }
        },
        orientation: 'bottom',
        //padding
        selectable: true,
        showCurrentTime: true,
        showCustomTime: false,
        showMajorLabels: true,
        showMinorLabels: true,
        stack: false,
        start: start_date,
        type: 'range',
        width: 'auto',
        zoomMax: 1000 * 60 * 60 * 24,
        zoomMin: 1000 * 60

    };

    var timeline = new vis.Timeline(container);
    timeline.setOptions(options);
    timeline.setGroups(groups);
    timeline.setItems(items);

    function toggle_vis_timeline_button_classes(btn_num) {

        $("#vis_group_button_" + btn_num).click(function () {

            if ($("#vis_group_button_" + btn_num).parent().parent().hasClass('vis_group_disabled')) {

                $("#vis_group_button_" + btn_num).parent().parent().removeClass('vis_group_disabled').addClass('vis_group_enabled');
                $("#vis_group_button_" + btn_num).removeClass('btn-default vis_btn_disabled').addClass('btn-success vis_btn_enabled');
                $("#vis_group_button_" + btn_num).html(btn_num + ': Enabled');
                $(".vis.timeline .foreground > div:nth-child(" + btn_num + ")").removeClass('vis_group_disabled').addClass('vis_group_enabled');

            } else {

                $("#vis_group_button_" + btn_num).parent().parent().removeClass('vis_group_enabled').addClass('vis_group_disabled');
                $("#vis_group_button_" + btn_num).removeClass('btn-success vis_btn_enabled').addClass('btn-default vis_btn_disabled');
                $("#vis_group_button_" + btn_num).html(btn_num + ': Disabled');
                $(".vis.timeline .foreground > div:nth-child(" + btn_num + ")").removeClass('vis_group_enabled').addClass('vis_group_disabled');

            }

        });

    }

    for (var btn_num = 1; btn_num <= 16; btn_num++) {
        toggle_vis_timeline_button_classes(btn_num);
    }

});