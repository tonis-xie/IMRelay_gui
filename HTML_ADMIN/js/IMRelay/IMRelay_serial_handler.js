function parse(s) {

    var str_array = s.split(',');

    if (str_array[0] === "$PLDAS") {

        switch (str_array[1]) {
            case "RLY":

                if (str_array[2] !== "OK" && str_array[2] !== "CRC" && str_array[2] !== "RST") {

                    var relay_mask = parseInt("0x" + str_array[2]);
                    var time = str_array[3];

                    /* update synced time label */
                    $("label#mcu_clock").text("Synchronized time: " + second_utc_to_hhmmss_local(time));
                    update_clock(time);

                    /* update relay activity indicators */
                    for (var i = 0; i < 16; i++) {
                        relay_indicator_control(i + 1, relay_mask & (1 << i));
                    }
                }
                break;
            case "VER":
                $("p#imrelay_header").text(str_array[2].split("'")[1] + " v" + str_array[3].split("'")[1]);
                break;
            default:
                break;
        }
    } else if (str_array[0] === "$PLDAM") {

        switch (str_array[1]) {
            case "RLY":
                break;
            default:
                break;
        }
    }

}

function rs232_data(s) {

    /* if s contains CRC */
    if (~s.indexOf('CRC')) {

        $("ul#serial_crc_list").prepend("<li class=\"list-group-item\">" + s + "</li>");
        if ($("ul#serial_crc_list li").length > 50) {

            $("ul#serial_crc_list li:last").remove();
        }
    }

    var str_array = s.split(',');

    if (str_array[0] === "$PLDAS") {

        $("ul#serial_data_list").prepend("<li class=\"list-group-item\">" + s + "</li>");
        if ($("ul#serial_data_list li").length > 50) {
            $("ul#serial_data_list li:last").remove();
        }
    } else {
        $("ul#serial_send_list").prepend("<li class=\"list-group-item\">" + s + "</li>");
        if ($("ul#serial_send_list li").length > 50) {
            $("ul#serial_send_list li:last").remove();
        }
    }

    parse(s);
}

function rs232_status(port_name, connecting, connect_success) {

    var s;

    if (connecting === 1) {
        s = "Connecting to " + port_name;
        $("p#com_status").text(s);
    } else if (connect_success === 1) {
        s = "Connected to IMRelay on " + port_name;
        $("p#com_status").text(s);
    } else {
        s = "Connecting to " + port_name + " - Connection Failed ... retry";
        $("p#com_status").text(s);
    }

}