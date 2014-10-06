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

    function add_imrelay_device_to_list(ip, mac) {
        $("#device_discovery_list").append('<li><a href="#"><h3>IMRelay v2 @ ' + ip + '</h3><p>ID: ' + mac + '</p></a></li>');

        var num_items = $("#device_discovery_list li").length;
        $("#connected_device_counter").html(num_items);

        if (num_items === 1) {

            $("#connected_device_counter").removeClass("label-error label-warning").addClass("label-success");
            $("#connected_device_identifier").html(mac);
            g_LDA.ip_address = ip;
            window.setInterval(relay_event_scheduler, 1000);

            /* Create lock */
            if (localStorage["uuid_lock"] == null) {
                localStorage["uuid_lock"] = generateUUID();
            }

        } else if (num_items > 1) {
            $("#connected_device_counter").removeClass("label-error label-success").addClass("label-warning");
        }

    }

    function imrelay_device_found(ip, mac) {
        add_imrelay_device_to_list(ip, mac);
        console.log("Found: " + mac + " @ " + ip);
    }

    for (var ip_local_subnet = 2; ip_local_subnet < 255; ip_local_subnet++) {

        (function (ip_local_subnet) {

            $.ajax({
                url: "http://192.168.1." + ip_local_subnet + "/IMRelay_v2",
                type: "OPTIONS",
                timeout: 1000,
                success: function (data) {
                    var mac_addr = JSON.parse(data);
                    imrelay_device_found("192.168.1." + ip_local_subnet, mac_addr.id);

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

});

