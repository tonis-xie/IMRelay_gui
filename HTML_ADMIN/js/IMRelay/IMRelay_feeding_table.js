$(function () {

    $('#toogle_edit_button').click( function() {

        console.log('button clicked');

        var cell = $('table#feeding_table tr td');
        var is_editable = cell.is('.editable');
        cell.prop('contenteditable', !is_editable).toggleClass('editable')
    })

});
