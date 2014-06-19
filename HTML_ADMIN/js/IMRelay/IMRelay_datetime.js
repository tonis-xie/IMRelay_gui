function getRandomDate(from, to) {
    if (!from) {
        from = new Date(1900, 0, 1).getTime();
    } else {
        from = from.getTime();
    }
    if (!to) {
        to = new Date(2100, 0, 1).getTime();
    } else {
        to = to.getTime();
    }
    return new Date(from + Math.random() * (to - from));
}

function is_valid_hhmmss(s) {

    var arr = s.split(':');
    return (arr[0].length == 2 &&
        arr[1].length == 2 &&
        arr[2].length == 2 &&
        arr[0] < 24 &&
        arr[1] < 60 &&
        arr[2] < 60);
}

function second_utc_to_hhmmss_local(time) {

    var date = new Date();
    var offset = (date.getTimezoneOffset() * 60);

    var total_seconds = time - offset;
    return second_to_hhmmss(total_seconds);
}

function second_to_hhmmss(time) {

    var hour = Math.floor((time / 3600) % 24);
    var min = Math.floor((time % 3600) / 60);
    var sec = Math.floor(time % 60);

    return format_2_digits(hour) + ":" + format_2_digits(min) + ":" + format_2_digits(sec);
}

function hhmmss_to_second(time) {

    var date_str = time.split(':');

    var hour = parseInt(date_str[0], 10);
    var min = parseInt(date_str[1], 10);
    var sec = parseInt(date_str[2], 10);
    var seconds = sec + (60 * (min + (60 * hour)));

    if (seconds < 86400 && is_valid_hhmmss(time)) {
        return seconds;
    }
    else {
        return -1;
    }
}

function date_d2_sub_d1_second(d1, d2) {

    var sec1 = date_to_second(d1);
    var sec2 = date_to_second(d2);

    var seconds = sec2 - sec1;

    if (sec1 >= 0 && sec2 >= 0 && seconds < 86400) {
        return seconds;
    }
    else {
        return -1;
    }
}

function date_to_second(d) {
    
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();

    var seconds = sec + (60 * (min + (60 * hour)));

    if (seconds < 86400) {
        return seconds;
    }
    else {
        return -1;
    }
}

function date_to_hhmmss(d) {

    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();

    return format_2_digits(hour) + ":" + format_2_digits(min) + ":" + format_2_digits(sec);
}

function format_2_digits(n) {
    return n > 9 ? "" + n : "0" + n;
}