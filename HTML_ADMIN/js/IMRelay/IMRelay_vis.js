// Called when the Visualization API is loaded.
$(document).ready(function () {
    "use strict";

    function create_html_button(id) {

        var html_group_button = document.createElement('button');
        html_group_button.className = 'btn btn-default vis_btn_disabled';
        html_group_button.type = 'button';
        html_group_button.id = 'vis_group_button_' + id;
        html_group_button.innerText = id + ': Disabled';

        return html_group_button;
    }        

    g_LDA.groups = new vis.DataSet();

    for (var i = 1; i <= 16; i++) {
        g_LDA.groups.add({ id: i, className: 'vis_group_disabled', content: create_html_button(i), value: i });
    }    
   
    g_LDA.groups.on('*', function (event, properties, senderId) {

        var group_classnames_to_localstorage = g_LDA.groups.get({
            // output the specified fields only
            fields: ['id', 'className']
        });

        localStorage["timeline.groups"] = JSON.stringify(group_classnames_to_localstorage);

        var feeding_table_json = g_LDA.feeding_table.get({
            // output the specified fields only
            fields: ['id', 'state']
        });

        for (var key in group_classnames_to_localstorage) {

            if (group_classnames_to_localstorage[key].className === 'vis_group_disabled') {
                feeding_table_json[key].state = 'inactive';
            } else {
                feeding_table_json[key].state = 'active';
            }

        }

        g_LDA.feeding_table.update(feeding_table_json);

    });

    var start_date = new Date();
    start_date.setHours(0, 0, 0, 0);
    var end_date = new Date();
    end_date.setTime(start_date.getTime() + (24 * 60 * 60 * 1000));

    function parse_timeline_items_json(data) {

        var total_active_feeding_time = [
            { id: 1, time_feeding_intervals: 0 },
            { id: 2, time_feeding_intervals: 0 },
            { id: 3, time_feeding_intervals: 0 },
            { id: 4, time_feeding_intervals: 0 },
            { id: 5, time_feeding_intervals: 0 },
            { id: 6, time_feeding_intervals: 0 },
            { id: 7, time_feeding_intervals: 0 },
            { id: 8, time_feeding_intervals: 0 },
            { id: 9, time_feeding_intervals: 0 },
            { id: 10, time_feeding_intervals: 0 },
            { id: 11, time_feeding_intervals: 0 },
            { id: 12, time_feeding_intervals: 0 },
            { id: 13, time_feeding_intervals: 0 },
            { id: 14, time_feeding_intervals: 0 },
            { id: 15, time_feeding_intervals: 0 },
            { id: 16, time_feeding_intervals: 0 }
        ];

        for (var key in data) {

            data[key].start = new Date(data[key].start).setFullYear(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
            data[key].end = new Date(data[key].end).setFullYear(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
            total_active_feeding_time[data[key].group - 1].time_feeding_intervals += (data[key].end - data[key].start) / 1000;
            
        }

        g_LDA.feeding_table.update(total_active_feeding_time);

    }

    g_LDA.items = new vis.DataSet();
    var timeline_items_localstorage = localStorage["timeline.items"];

    if (timeline_items_localstorage != null) {

        var timeline_items_json = JSON.parse(timeline_items_localstorage);
        //update start and end dates to today
        parse_timeline_items_json(timeline_items_json);
        g_LDA.items._data = timeline_items_json;
        //save changes back to localstorage
        localStorage["timeline.items"] = JSON.stringify(g_LDA.items._data);

    }

    g_LDA.items.on('*', function (event, properties, senderId) {

        localStorage["timeline.items"] = JSON.stringify(g_LDA.items._data);

        var total_active_feeding_time = [
            { id: 1, time_feeding_intervals: 0 },
            { id: 2, time_feeding_intervals: 0 },
            { id: 3, time_feeding_intervals: 0 },
            { id: 4, time_feeding_intervals: 0 },
            { id: 5, time_feeding_intervals: 0 },
            { id: 6, time_feeding_intervals: 0 },
            { id: 7, time_feeding_intervals: 0 },
            { id: 8, time_feeding_intervals: 0 },
            { id: 9, time_feeding_intervals: 0 },
            { id: 10, time_feeding_intervals: 0 },
            { id: 11, time_feeding_intervals: 0 },
            { id: 12, time_feeding_intervals: 0 },
            { id: 13, time_feeding_intervals: 0 },
            { id: 14, time_feeding_intervals: 0 },
            { id: 15, time_feeding_intervals: 0 },
            { id: 16, time_feeding_intervals: 0 }];

        for (var key in g_LDA.items._data) {
            total_active_feeding_time[g_LDA.items._data[key].group - 1].time_feeding_intervals += (g_LDA.items._data[key].end - g_LDA.items._data[key].start) / 1000;
        }
        
        g_LDA.feeding_table.update(total_active_feeding_time);

        // Tell event table that the timeline has been updated
        dynatable_event.settings.dataset.originalRecords = g_LDA.items.get();
        dynatable_event.process();
        
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
        //onUpdate
        onAdd: check_if_valid_visitem,
        onMove: check_if_valid_visitem,
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

    function check_if_valid_visitem(item, callback) {

        if (check_if_collision_against_other_visitem(item)) {
            callback(null);
        } else if (item.start < start_date) {
            callback(null);
        } else if (item.end > end_date) {
            callback(null);
        } else if (item.start >= item.end) {
            callback(null); // cancel updating the item
        } else {
            item.content = moment(item.start).format("HH:mm:ss") + " - " + moment(item.end).format("HH:mm:ss");
            callback(item); // send back adjusted item
        }

    }


    function check_if_collision_against_other_visitem(item) {

        for (var key in g_LDA.items._data) {

            // Find the visitems belonging to the same relay
            if (g_LDA.items._data[key].group == item.group && g_LDA.items._data[key].id != item.id) {

                // Check if item.start is within another visitem
                if (item.start >= g_LDA.items._data[key].start && item.start <= g_LDA.items._data[key].end) {
                    return 1;
                }

                // Check if item.end is within another visitem
                if (item.end >= g_LDA.items._data[key].start && item.end <= g_LDA.items._data[key].end) {
                    return 1;
                }

                // Check if item is around another visitem
                if (item.start <= g_LDA.items._data[key].start && item.end >= g_LDA.items._data[key].end) {
                    return 1;
                }

            }
        }

        return 0;
    }

    var container = document.getElementById('vis_timeline');
    var timeline = new vis.Timeline(container, g_LDA.items, options);
    timeline.setGroups(g_LDA.groups);

    function enable_vis_timeline_button_classes(btn_num) {
        $("#vis_group_button_" + btn_num).removeClass('btn-default vis_btn_disabled').addClass('btn-success vis_btn_enabled');
        $("#vis_group_button_" + btn_num).html(btn_num + ': Enabled');
    }

    function disable_vis_timeline_button_classes(btn_num) {
        $("#vis_group_button_" + btn_num).removeClass('btn-success vis_btn_enabled').addClass('btn-default vis_btn_disabled');
        $("#vis_group_button_" + btn_num).html(btn_num + ': Disabled');
    }    

    function toggle_vis_timeline_button_classes(btn_num) {             

        $("#vis_group_button_" + btn_num).click(function () {

            if ($("#vis_group_button_" + btn_num).hasClass('vis_btn_disabled')) {
                g_LDA.groups.update({ id: btn_num, className: 'vis_group_enabled' });
                g_LDA.feeding_table.update({ id: btn_num, start_date: new Date().setHours(0, 0, 0, 0) });
                enable_vis_timeline_button_classes(btn_num);
            } else {
                g_LDA.groups.update({ id: btn_num, className: 'vis_group_disabled' });
                disable_vis_timeline_button_classes(btn_num);
            }

        });        

    }

    for (var btn_num = 1; btn_num <= 16; btn_num++) {
        toggle_vis_timeline_button_classes(btn_num);
    }

    var timeline_groups_localstorage = localStorage["timeline.groups"];

    if (timeline_groups_localstorage != null) {

        var timeline_groups_json = JSON.parse(timeline_groups_localstorage);
        g_LDA.groups.update(timeline_groups_json);

        for (var group_index = 0; group_index < 16; group_index++) {

            if (timeline_groups_json[group_index].className == 'vis_group_disabled') {
                disable_vis_timeline_button_classes(group_index + 1);
            } else {
                enable_vis_timeline_button_classes(group_index + 1);
            }

        }

    }

    /* Event settings table */



    function event_table_button_cell_writer(id) {

        var html_group_button = document.createElement('button');
        html_group_button.className = 'btn btn-default event_table_toogle_edit_button';
        html_group_button.type = 'button';
        html_group_button.dataset.id = id;
        html_group_button.innerText = 'Edit';

        return '<td style="width:65px;">' + html_group_button.outerHTML + '</td>';
    }

    function event_table_cell_writer(column, record, user_editable) {

        var html = column.attributeWriter(record);
        var td = '<td';

        //column.textAlign = 'center';

        if (column.hidden || column.textAlign) {

            td += ' style="';

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

    function event_table_row_writer(rowIndex, record, columns, cellWriter) {

        record.relay_number = record.group;
        record.start_time = moment(record.start).format("HH:mm:ss");
        record.end_time = moment(record.end).format("HH:mm:ss");


        var tr = '';

        tr += event_table_button_cell_writer(record.id);

        // grab the record's attribute for each column
        for (var i = 1, len = columns.length; i < len; i++) {
          //tr += cellWriter(columns[i], record, event_settings_column_iseditable(columns[i].id));
          tr += cellWriter(columns[i], record, true);
        }

        return '<tr>' + tr + '</tr>';
    }


    $('#event_table').dynatable({
        features: {
                paginate: false
        },
        dataset: {
            records: g_LDA.items.get(),
        },
        writers: {
            _rowWriter: event_table_row_writer,
            _cellWriter: event_table_cell_writer
        },
        inputs: {
            queries: $('#event_search_relay_id')
        }
    });

    $('#event_table').on('click', 'button.event_table_toogle_edit_button', function() {

        var row = jQuery(this).closest("tr");
        var columns = row.find("td");

        var cells = row.find('td.user_editable');
        var is_editable = cells.is('.editable');
        this.innerHTML = is_editable ? ('Edit') : ('Save');
        cells.prop('contenteditable', !is_editable).toggleClass('editable');

        /* If the user saves the settings*/
        if (is_editable) {
            var row_values = {};
            jQuery.each(columns, function(i, item) {
                var header = $(this).parents('table').find('th').eq(i);
                header = header.text().replace(/\s+/g, '_').replace(/\#/g, 'nr').toLowerCase();
                row_values[header] = item.innerHTML;
            });

            row_values.edit = $(this).data("id");
            //console.log(row_values.edit.data("id"));
            //console.log($(this).data("id"));
            //

            console.log(row_values);

            on_event_table_edit(row_values);
        }
    });

    var dynatable_event = $('#event_table').data('dynatable');
    
    function create_date_from_string_hh_mm_ss(s) {

        /* match: HH:mm:ss */
        if (s.match(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/)) {

            var d = new Date();

            var pieces = s.split(':');
            var hour = parseInt(pieces[0], 10);
            var minute = parseInt(pieces[1], 10);
            var second = parseInt(pieces[2], 10);

            d.setHours(hour);
            d.setMinutes(minute);
            d.setSeconds(second);

            return d;
        } else {
            return false;
        }

    }

    function on_event_table_edit(row) {

        if ($.isNumeric(row.time_on) && $.isNumeric(row.time_on)) {
            g_LDA.relay[row.relay_nr - 1].total_on_ticks = row.time_on;
            g_LDA.relay[row.relay_nr -1].total_off_ticks = row.time_off;
        }

        if (row.time_on > 0 || row.time_off > 0) {

            g_LDA.feeding_table.update([{
                id: parseInt(row.relay_nr,10),
                state: "generic"
            }]);

        } else {

            g_LDA.feeding_table.update([{
                id: parseInt(row.relay_nr,10),
                state: "feeder"
            }]);

        }

        console.log(row.edit);

        g_LDA.items.update([{
            id: row.edit,
            start: create_date_from_string_hh_mm_ss(row.start_time),
            end: create_date_from_string_hh_mm_ss(row.end_time)
        }]);
       
    }

});
