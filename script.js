
let player;
buttonClicked = 0;
let playlist = [];
var done = false;

//loads the youtube API
function onYouTubeIframeAPIReady(playerID) {

    // Check if the page was just refreshed
    if (localStorage.getItem('refreshed') === 'true') {
        // If it was, clear the flag and return early
        localStorage.removeItem('refreshed');
        return;
    }
    //if the user clicks the button more than once, the playlist will be cleared and a new one will be created
    if (buttonClicked > 1){
        loadNewVideo(playlist[0]);
        
    }

    
    console.log("API ready");
    console.log(playerID);
    
    //creates the player converting the div player to an iframe
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: playerID,
        playerVars: {
          'playsinline': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

}


//loads the youtube API
function loadYoutubeAPI(){
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.querySelector("script");
    firstScriptTag.parentNode.insertBefore(iframe, firstScriptTag);
}

// when the player is ready, it plays the video
function onPlayerReady(event) {
    event.target.playVideo();
    console.log("Player ready");
}

// loads a new video replacing the current one
function loadNewVideo(videoId) {
    player.loadVideoById(videoId);
}


// when the video ends, it loads a new one
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

// stops the video
function stopVideo() {
    player.stopVideo();
}

// when the submit button is clicked, it gets the values from the form and calls the API
function submitClicked(){
    buttonClicked++;
    playlist = [];

    //gets the values from the form
    const COUNTRY = document.querySelector("#country");
    const TYPE = document.querySelector("#type");
    const GENRE = document.querySelector("#genre");
    console.log("Button clicked");

    //calls the API
    fetch("https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=" + COUNTRY.value + "%20" + GENRE.value + "%20" + TYPE.value + "&key=AIzaSyCdqhFKYhaeCSDjFgITfnxM05-jLgQyEbo")
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.items.forEach(item => {
                playlist.push(item.id.videoId);
                
            });
            storePlaylist();
            onYouTubeIframeAPIReady(playlist[0]); 
        });            
};


//stores the playlist in the local storage
function storePlaylist(){
    localStorage.setItem("playlist", JSON.stringify(playlist));
}  

//runs when the page is loaded
window.addEventListener('unload', function() {
    localStorage.setItem('refreshed', 'true');
});
