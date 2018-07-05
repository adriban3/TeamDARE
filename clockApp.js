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
        var q = $("#soch").val().trim();
        
        // // find all sounds of buskers licensed under 'creative commons share alike'
        // SC.connect().then(function(){
        //     SC.get('/tracks', {
        //         q: q }).then(function(tracks) {
        //         console.log(tracks);
        //     });
        // });
        
        var alarm = setInterval(function() {
            if (moment().format("H:mm") == clock) {

                const play = ({
                    spotify_uri,
                    playerInstance: {
                      _options: {
                        getOAuthToken,
                        id
                      }
                    }
                  }) => {
                    getOAuthToken(access_token => {
                      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({ uris: [spotify_uri] }),
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${access_token}`
                        },
                      });
                    });
                  };
                  
                  play({
                    playerInstance: new Spotify.Player({ name: "..." }),
                    spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
                  });

                // var widget = SC.Widget("widg");
                // widget.play();
                // clearInterval(alarm);
            }
        }, 1000);
    },

    MQapikey: "lk4t8vdc1GbFGarz3jGhhCvcH03NQYbX",

    MQurl: "http://www.mapquestapi.com/directions/v2/route?", //key=KEY&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA"

    mapquest: function(e, MQapikey, MQurl) {
        e.preventDefault();
        url = MQurl + $.param({key: MQapikey, from: $("#yolo").val(), to: $("#dest").val()});
        $.ajax(url, "Get").then(function(response) {
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