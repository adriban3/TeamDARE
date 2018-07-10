var clockApp = {

    SDKinit: function(artist, spotify_access_token) {

        window.onSpotifyWebPlaybackSDKReady = (spotify_access_token) => {
            // You can now initialize Spotify.Player and use the SDK
            // const token = 'BQAFGjO5ohTTX7xuRiUWRzxZaA1nkCWoOa-Vzerp1C9b4EYzCvz0YZLGfkQlmZYo9GEO_XoFK2ses601QzTUsNMyvXHJvQsyBiTcuaCnKAerNqdLEL0hK4aMLHyszaXkuouEiWUsaug_TvlGEuWe0xkxrBtm0gmp-1nxHQ';
              const player = new Spotify.Player({
                  name: 'Web Playback SDK Quick Start Player',
                  getOAuthToken: cb => { cb(spotify_access_token); }
              });
  
              // Error handling
              player.addListener('initialization_error', ({ message }) => { console.error(message); });
              player.addListener('authentication_error', ({ message }) => { console.error(message); });
              player.addListener('account_error', ({ message }) => { console.error(message); });
              player.addListener('playback_error', ({ message }) => { console.error(message); });
  
              // Playback status updates
              player.addListener('player_state_changed', state => { console.log(state); });
  
              // Ready
              player.addListener('ready', ({ device_id }) => {
                  console.log('Ready with Device ID', device_id);
              });
  
              // Not Ready
              player.addListener('not_ready', ({ device_id }) => {
                  console.log('Device ID has gone offline', device_id);
              });
  
              // Connect to the player!
              player.connect();
              };
        clockApp.getArtist(artist, spotify_access_token);
    },

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

    generateSpotifyAccessToken: function(artist) {
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token',
            method: "POST",
            data: {
                grant_type: "client_credentials",
                scope: "user-modify-playback-state",
            },
            headers: {
                Authorization: "Basic " + btoa("21dad2969f2947419ba9fa2cac7560d8" + ":" + "5d62cecbdad943d9b8c5047a6c9e8aac")
            }
        }).then(res => {
            spotify_access_token = res.access_token;
            console.log(res);
            console.log(spotify_access_token);
            clockApp.SDKinit(artist, spotify_access_token);
        }).catch(err => console.error(err));
    },

    getArtist: function(artist, spotify_access_token) {
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
        }).then(res => {console.log(res), clockApp.playSong(res.tracks.items[0].uri, spotify_access_token)});
        // .catch(() => generateSpotifyAccessToken(() => getArtist(artist)))
    },

    playSong: function(uri, spotify_access_token) {

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
            playerInstance: new Spotify.Player({ name: "test" }),
            spotify_uri: uri,
          });

        // $.ajax({
        //     method: 'PUT',
        //     url: 'https://api.spotify.com/v1/me/player/play',
        //     data: {
        //         context_uri: uri
        //     },
        //     headers: {
        //     Authorization: "Bearer" + spotify_access_token
        // },
        // })

        //need this to play song
        //check these links:
        //https://developer.spotify.com/documentation/web-playback-sdk/reference/#playing-a-spotify-uri
        //https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/
    },

    clockSet: function(e) {
        e.preventDefault();
        var hours = $("#hoursInput").val();
        var minutes = $("#minutesInput").val();
        var clock = hours + ":" + minutes;  
        var artist = $("#soch").val();
        console.log(artist);
        
        var alarm = setInterval(function() {
            if (moment().format("H:mm") == clock) {
                console.log("wake up idiot");
                clockApp.generateSpotifyAccessToken(artist);
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