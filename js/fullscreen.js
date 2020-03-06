import {state} from "./script.js";


const PREFIXES = ["", "webkit",	"moz", "ms"];
const bodyNode = document.querySelector("body");

export function setupFullscreen() {
  document.getElementById("enterFS").addEventListener("click",enterFS);
  document.getElementById("exitFS").addEventListener("click",exitFS);
  for(let button of document.getElementsByClassName("mainMenuBtt")) {
      button.addEventListener("click", exitFS);
  }

  for(const prefix of PREFIXES) {
    document.addEventListener(`${prefix}fullscreenchange`, () => {
        const enterIcon = document.getElementById("enterFS");
        const exitIcon = document.getElementById("exitFS");
        if(state.fullscreen) {
            enterIcon.style.display = "inline";
            exitIcon.style.display = "none";
        }
        else {
            enterIcon.style.display = "none";
            exitIcon.style.display = "inline";
        }
        state.fullscreen = !state.fullscreen;
    });
  }
}

export function enterFS() {
  openFullscreen(bodyNode, {navigationUI: "hide"})
  .catch(err => {
      // try fullscreen without "navigationUI" before disregard
      console.log(err);
      openFullscreen(bodyNode, {})
      .catch(err => console.log(err));
  });
}

export function exitFS() {
  closeFullscreen()
  .catch(err => console.log(err));
}

async function openFullscreen(elem, settings) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen(settings);
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen(settings);
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen(settings);
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen(settings);
  }
}

async function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}