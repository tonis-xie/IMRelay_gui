$(document).ready(function () {
    /* jQueryKnob */

    $(".knob").knob({
        /*change : function (value) {
         //console.log("change : " + value);
         },
         release : function (value) {
         console.log("release : " + value);
         },
         cancel : function () {
         console.log("cancel : " + this.value);
         },*/
        draw: function () {

            // "tron" case
            if (this.$.data('skin') === 'tron') {

                var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = true;

                this.g.lineWidth = this.lineWidth;

                this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                if (this.o.displayPrevious) {
                    ea = this.startAngle + this.angle(this.value);
                    this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                    this.g.beginPath();
                    this.g.strokeStyle = this.previousColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });
    /* END JQUERY KNOB */

});


function relay_indicator_control(relay_number, active, error, timeout) {

    var value1 = active ? "50%" : "";
    var value2, value3;

    /* if active is false, no color. */
    /* if error and timeout is false, blue.  */
    /* if error is true, red.  */
    /* if error is false, and timeout is true, yellow.  */
    value2 = active ? (error | timeout) ? timeout ? "rgba(255, 64, 0, 0.35)"              : "rgba(255, 0, 0, 0.35)"             : "rgba(31, 141, 255, 0.35)"             : "";
    value3 = active ? (error | timeout) ? timeout ? "rgba(255, 64, 0, 0.35) 0px 0px 36px" : "rgba(255, 0, 0, 0.7) 0px 0px 36px" : "rgba(31, 141, 255, 0.7) 0px 0px 36px" : ""

    var cell = $('#imrelay_knob_row > div > div canvas')[relay_number - 1];

    cell.style.borderRadius = value1;
    cell.style.background = value2;
    cell.style.boxShadow = value3;

}