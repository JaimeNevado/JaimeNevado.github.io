document.addEventListener("DOMContentLoaded", function() {
    const playButton = document.getElementById("play-btn");
    
    playButton.addEventListener("click", function() {
        window.open("juegoPrincipal.html", "_self");
    });
});
