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

    var groups = new vis.DataSet();

    for (var i = 1; i <= 16; i++) {
        groups.add({ id: i, className: 'vis_group_disabled', content: create_html_button(i), value: i });
    }    
   
    groups.on('*', function (event, properties, senderId) {

        var temp_12345 = groups.get({
            fields: ['id', 'className']        // output the specified fields only
        });

        localStorage["timeline.groups"] = JSON.stringify(temp_12345);

    });

    var start_date = new Date();
    start_date.setHours(0, 0, 0, 0);
    var end_date = new Date();
    end_date.setTime(start_date.getTime() + (24 * 60 * 60 * 1000));

    function parse_timeline_from_localstorage(data) {

        for (key in data) {

            data[key].start = new Date(data[key].start);
            data[key].end = new Date(data[key].end);

        }

    }

    var items = new vis.DataSet();
    var local_storage_timeline_items = localStorage["timeline.items"];

    if (local_storage_timeline_items != null) {

        var string_dataset = JSON.parse(local_storage_timeline_items);
        parse_timeline_from_localstorage(string_dataset);
        items["_data"] = string_dataset;
    }

    items.on('*', function (event, properties, senderId) {
        localStorage["timeline.items"] = JSON.stringify(items["_data"]);
        //debug with: localStorage["timeline"] = JSON.stringify(items);
    });

    // create visualization    
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
            if (start_date <= item.start && end_date >= item.end && (date_to_hhmmss(item.start) < date_to_hhmmss(item.end) || date_to_hhmmss(item.end) === "00:00:00")) {
                item.content = date_to_hhmmss(item.start) + " - " + date_to_hhmmss(item.end);
                callback(item); // send back adjusted item
            } else {
                callback(null); // cancel updating the item
            }
        },
        //onUpdate
        onMove: function (item, callback) {
            if (start_date <= item.start && end_date >= item.end && (date_to_hhmmss(item.start) < date_to_hhmmss(item.end) || date_to_hhmmss(item.end) === "00:00:00")) {
                item.content = date_to_hhmmss(item.start) + " - " + date_to_hhmmss(item.end);
                callback(item); // send back adjusted item
            } else {
                callback(null); // cancel updating the item
            }
        },
        onRemove: function (item, callback) {
            if (confirm('Remove item from relay ' + item.group + '? ' + '(' + item.content + ')')) {
                callback(item); // confirm deletion
            } else {
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

    var container = document.getElementById('vis_timeline');
    var timeline = new vis.Timeline(container);
    timeline.setOptions(options);
    timeline.setGroups(groups);
    timeline.setItems(items);

    function enable_vis_timeline_button_classes(btn_num) {

        console.log(btn_num + 'enabled func');

        //$("#vis_group_button_" + btn_num).parent().parent().removeClass('vis_group_disabled').addClass('vis_group_enabled');
        $("#vis_group_button_" + btn_num).removeClass('btn-default vis_btn_disabled').addClass('btn-success vis_btn_enabled');
        $("#vis_group_button_" + btn_num).html(btn_num + ': Enabled');
        //$(".vis.timeline .foreground > div:nth-child(" + btn_num + ")").removeClass('vis_group_disabled').addClass('vis_group_enabled');

    }

    function disable_vis_timeline_button_classes(btn_num) {

        console.log(btn_num + 'disabled func');

        //$("#vis_group_button_" + btn_num).parent().parent().removeClass('vis_group_enabled').addClass('vis_group_disabled');
        $("#vis_group_button_" + btn_num).removeClass('btn-success vis_btn_enabled').addClass('btn-default vis_btn_disabled');
        $("#vis_group_button_" + btn_num).html(btn_num + ': Disabled');
        //$(".vis.timeline .foreground > div:nth-child(" + btn_num + ")").removeClass('vis_group_enabled').addClass('vis_group_disabled');

    }    

    function toggle_vis_timeline_button_classes(btn_num) {             

        $("#vis_group_button_" + btn_num).click(function () {

            if ($("#vis_group_button_" + btn_num).hasClass('vis_btn_disabled')) {
                groups.update({ id: btn_num, className: 'vis_group_enabled' });
                enable_vis_timeline_button_classes(btn_num);
            } else {
                groups.update({ id: btn_num, className: 'vis_group_disabled' });
                disable_vis_timeline_button_classes(btn_num);
            }

        });        

    }

    for (var btn_num = 1; btn_num <= 16; btn_num++) {
        toggle_vis_timeline_button_classes(btn_num);
    }

    var tem_5513 = localStorage["timeline.groups"];

    if (tem_5513 != null) {
        var string_dataset2 = JSON.parse(tem_5513);
        groups.update(string_dataset2);

        for (var cntr_var_temp = 0; cntr_var_temp < 8; cntr_var_temp++) {


            console.log(string_dataset2[cntr_var_temp].className);
            if (string_dataset2[cntr_var_temp].className == 'vis_group_disabled') {
                disable_vis_timeline_button_classes(cntr_var_temp + 1);
                console.log(cntr_var_temp + 'disabled');
            } else {
                enable_vis_timeline_button_classes(cntr_var_temp + 1);
                console.log(cntr_var_temp + 'enabled');
            }

        }
    }

});