import {state} from "./script.js";

export function setupFullscreen() {
  document.getElementById("enterFS").addEventListener("click",enterFS);
  document.getElementById("exitFS").addEventListener("click",exitFS);
  for(let button of document.getElementsByClassName("mainMenuBtt")) {
      button.addEventListener("click", exitFS);
  }

  document.addEventListener("fullscreenchange", () => {
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

export function enterFS() {
  document.querySelector("body").requestFullscreen({navigationUI: "hide"})
  .catch(err => {
      // try fullscreen without "navigationUI" before disregard
      console.log(err);
      document.querySelector("body").requestFullscreen()
      .catch(err => console.log(err));
  });
}

function exitFS() {
  if(!document.fullscreenElement) return;
  document.exitFullscreen()
  .catch(err => console.log(err));
}