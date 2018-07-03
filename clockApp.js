var clockApp = {
    dropDownSet: function() {
        for (var i = 0; i < 24; i++) {
            $("#hoursInput").append("<option>" + i + "</option>");
        }

        for (var i = 0; i < 60; i++) {
            if (i < 10) {
                $("#minutesInput").append("<option>0" + i + "</option>");
            }
            else {
                $("#minutesInput").append("<option>" + i + "</option>");
            }
        }
    },

    clockSet: function(e) {
        e.preventDefault();
        var hours = $("#hoursInput").val();
        var minutes = $("#minutesInput").val();
        var clock = hours + ":" + minutes;        
        var alarm = setInterval(function() {
            if (moment().format("H:mm") == clock) {
                var widget = SC.Widget("widg");
                widget.play();
                clearInterval(alarm);
            }
        }, 1000);
    }
}


$(document).ready(function() {clockApp.dropDownSet()})

$("#clockSet").on("click", function(e) {clockApp.clockSet(e)})