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

        function generateSpotifyAccessToken(cb) {
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token',
                method: "POST",
                data: {
                    grant_type: "client_credentials"
                },
                headers: {
                    Authorization: "Basic " + btoa("21dad2969f2947419ba9fa2cac7560d8" + ":" + "5d62cecbdad943d9b8c5047a6c9e8aac")
                }
            }).then(res => {
                spotify_access_token = res.access_token;
                cb();
            }).catch(err => console.error(err));
        };
        
        //         //
        // Spotify //
        //         //
        function getArtist(artist, cb) {
            $.ajax({
                method: 'GET',
                url: 'https://api.spotify.com/v1/search',
                data: {
                    q: artist,
                    type: 'track'
                },
                headers: {
                    Authorization: "Bearer " + spotify_access_token
                }
            }).then(cb).catch(() => generateSpotifyAccessToken(() => getArtist(artist, cb)));
        }
        
        var alarm = setInterval(function() {
            if (moment().format("H:mm") == clock) {
                console.log("wake up idiot");
                clearInterval(alarm);
            }
        }, 1000);
    },

    MQapikey: "lk4t8vdc1GbFGarz3jGhhCvcH03NQYbX",

    MQurl: "http://www.mapquestapi.com/directions/v2/route?", //key=KEY&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA"

    mapquest: function(e, MQapikey, MQurl) {
        e.preventDefault();
        url = MQurl + $.param({key: MQapikey, from: $("#yolo").val(), to: $("#dest").val()});
        $.ajax(url, "Get").then(function(response) {
            console.log(response);
            var man = response.route.legs[0].maneuvers;
            for (var i in man) {
                $(dir).append(response.route.legs[0].maneuvers[i].narrative + "<br>");
            }
        })
    },
}


$(document).ready(function() {clockApp.dropDownSet()});

$(document).on("click", "#clockSet", function(e) {clockApp.clockSet(e)});

$(document).on("click", "#go", function(e) {clockApp.mapquest(e, clockApp.MQapikey, clockApp.MQurl)});