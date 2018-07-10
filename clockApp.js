// Initialize Firebase
var config = {
    apiKey: "AIzaSyBgSsPWXNag-QHEfyFUD448bfD_wvX7jag",
    authDomain: "alarm-7560f.firebaseapp.com",
    databaseURL: "https://alarm-7560f.firebaseio.com",
    projectId: "alarm-7560f",
    storageBucket: "",
    messagingSenderId: "197126652447"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


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
        var artist = $("#soch").val();
        var artistName = "";
        var previewUrl = "";
        console.log(artist);

        function generateSpotifyAccessToken() { //cb is callback?  What else could it be?
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
                console.log(res);
                getArtist(artist);
            }).catch(err => console.error(err));
        };
        
        //         //
        // Spotify //
        //         //
        function getArtist(artist) {
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
            }).then(
                function(res) {
                    console.log(res);
                    artistName = res.tracks.items[0].artists[0].name;
                    previewUrl = res.tracks.items[1].preview_url;
                    console.log(previewUrl);
                    $("#song-info").html(
                        "<p>" + artistName + "</p>");
                    var audioElement = document.createElement("audio");
                    audioElement.setAttribute("src", previewUrl);
                    audioElement.play();
                    $(document).on("click", "#snooze-button", function()
                    {
                        event.preventDefault();
                        // alert("Snoozed for 1 minute!");
                        audioElement.pause();
                        setInterval(function() {
                            audioElement.play();
                        }, 60000);
                    });
                    $(document).on("click", "#stop-button", function()
                    {
                        event.preventDefault();
                        audioElement.pause();
                        alert("No more alarm!");
                    });
                    }
            
                ).catch(() => generateSpotifyAccessToken(() => getArtist(artist)));
        }
                
        var alarm = setInterval(function() {
            if (moment().format("H:mm") == clock) {
                console.log("wake up idiot");
                generateSpotifyAccessToken(artist);
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