/*
 * RW Taggart
 * 2016.3.26
 * 
 * This file is resopnsible for doing all of the youtube related stuff.
 */
 
// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
    console.log("(D):  We've loaded the youtube thingy!");
    
    //Hilarous Video.
//    player = new YT.Player('ytplayer', {
//        height: '258',
//        width: '422',
//        videoId: 'PpMYIUivxS0',
//        playerVars: {'start': 1770},
//        events: {
//            'onReady': onPlayerReady,
//            'onStateChange': onPlayerStateChange
//        }
//    });
//    KCISG0phmbw

    // Count-down shot
    player = new YT.Player('ytplayer', {
        height: '258',
        width: '422',
        videoId: 'hf_pq5EDh7w',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
//    event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}