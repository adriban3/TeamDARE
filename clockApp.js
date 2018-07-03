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

        SC.initialize({
            client_id: 'Andrew Driban',
            // redirect_uri: 'http://example.com/callback'
        });
        
        var track_url = 'https://soundcloud.com/olivertree/sets/alien-boy-ep-1';
        SC.oEmbed(track_url, { auto_play: true }).then(function(oEmbed) {
        console.log('oEmbed response: ', oEmbed);
        if (moment().format("H:mm") == clock) {
            $("#music").append(oEmbed.html);
        }
        });
    }
}

$(document).ready(function() {clockApp.dropDownSet()})

$("#clockSet").on("click", function(e) {clockApp.clockSet(e)})

{/* <script src="https://connect.soundcloud.com/sdk/sdk-3.3.0.js"></script>
<script>
SC.initialize({
  client_id: 'YOUR_CLIENT_ID'
});

// stream track id 293
SC.stream('/tracks/293').then(function(player){
  player.play().then(function(){
    console.log('Playback started!');
  }).catch(function(e){
    console.error('Playback rejected. Try calling play() from a user interaction.', e);
  });
});
</script> */}