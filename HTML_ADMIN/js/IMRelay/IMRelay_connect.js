g_LDA.ip_address = "";

$(document).ready(function () {

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    };

    function connect_to_device(ip, mac) {

        localStorage["device_mac"] = mac;

        $("#connected_device_identifier").html(mac);
        g_LDA.ip_address = ip;

        /* Generates a unique ID to identify this instance of the program */
        if (localStorage["uuid_lock"] == null) {
            localStorage["uuid_lock"] = generateUUID();
        }

    }

    function add_imrelay_device_to_list(ip, mac) {

        $("#device_discovery_list").append('<li><a href="#"><h3>IMRelay v2 @ ' + ip + '</h3><p>ID: ' + mac + '</p></a></li>');

        var num_items = $("#device_discovery_list li").length;
        $("#connected_device_counter").html(num_items);

        /* set color on device counter depending on number of devices found. 1 is green, >1 is yellow */
        if (num_items === 1) {
            $("#connected_device_counter").removeClass("label-error label-warning").addClass("label-success");            
        } else if (num_items > 1) {
            $("#connected_device_counter").removeClass("label-error label-success").addClass("label-warning");
        }

        if ($("#connected_device_identifier")[0].innerText === "No device found") {
            $("#connected_device_identifier").html("Select device:");
        }

        if (localStorage["device_mac"] == mac) {
            connect_to_device(ip, mac);
        }

        $("ul#device_discovery_list > li > a:last").click(function () {

            var device_ip = $(this).find("h3")[0].innerText.split(' ')[3];
            var device_mac = $(this).find("p")[0].innerText.split(' ')[1];

            connect_to_device(device_ip, device_mac);

        });

    }

    for (var ip_local_subnet = 2; ip_local_subnet < 255; ip_local_subnet++) {

        (function (ip_local_subnet) {

            $.ajax({
                url: "http://192.168.1." + ip_local_subnet + "/autodiscovery_imrelay",
                type: "GET",
                timeout: 1000,
                success: function (data) {
                    var mac_addr = JSON.parse(data);
                    add_imrelay_device_to_list("192.168.1." + ip_local_subnet, mac_addr.id);

                }
            }).error(function (jXHR) {
                // Disable global error logging
                $.event.global.ajaxError = false;
            }).complete(function () {
                // Enable global error logging
                $.event.global.ajaxError = true;
            });

        })(ip_local_subnet);

    }

    window.setInterval(relay_event_scheduler, 1000);

});

