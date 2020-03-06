import {state, start} from "./script.js";
const startButtonNode = document.getElementById("startButt");


//  creating URLs for pictures/sounds/videos + some styling
export function filesIn() {
  let {maxFiles, pictureURLs, audioURLs, videoURLs, fileNames} = state.files;
  const id = event.target.id;
  //chosenFiles refer! to the files object
  let chosenFiles;
  let allowedFiles; // MS Edge input[accept] workaround (it's not supported)
  if(id.includes(`picture`)) {
    chosenFiles = pictureURLs;
    allowedFiles = "image";
  }
  else if(id.includes(`sound`)) {
    chosenFiles = audioURLs;
    allowedFiles = "audio";
  }
  else if(id.includes(`video`)) {
    chosenFiles = videoURLs;
    allowedFiles = "video";
  }
  window.URL = window.URL || window.webkitURL || window.mozURL;
  let fileCount = pictureURLs.length + audioURLs.length + videoURLs.length;
  
  for (let x = 0; x < event.target.files.length; x++) {
	  	if(fileCount == maxFiles) {
        	window.alert(`Maximum number of files (${maxFiles}) reached.`);
		  	break;
		}
	  	if(fileCount > maxFiles) {console.error(`File count exceedet!`);}
      
      let file = event.target.files[x];
      if(!file.type.includes(allowedFiles)) { // skip not allowed types
        console.log(`Skipping file - wrong type.`);
        continue;
      } else if(fileNames.includes(file.name)) { // skip duplicate files (by file name)
        console.log(`Skipping duplicate file.`);
        continue;
      }
      fileNames.push(file.name);
      let urlFile = URL.createObjectURL(file);
      chosenFiles.push(urlFile);
      fileCount++;
    }
    if(fileCount === 0) return; // prevent bug in MS Edge
    
    // styling add buttons, countBar and start button
    // ("picture" ||"audio" || "video" + "sBttDesc")
    let fileCountdId = `${id.substring(0, id.length - 5)}sBttDesc`;
    let fileCountNode = document.getElementById(fileCountdId);
    fileCountNode.innerHTML = `<span class="fileCount">${chosenFiles.length}</span> files selected.`;
    for(let button of document.getElementsByClassName("fileButtons")) {
        button.style.color = "green";
        button.style.border = "1px solid green";
    }
    styleFileCounter(fileCount, maxFiles);
    styleStartButton(fileCount);
    startButtonNode.addEventListener("click", start);
}

export function styleFileCounter(fileCount, maxFiles) {
	let percent = Math.round(fileCount / maxFiles * 100);
	document.getElementById("countBar").style.width = `${percent}%`;
	document.getElementById("fileCount").innerText = `${fileCount} / ${maxFiles}`;
}

export function styleStartButton(fileCount) {
    if(fileCount) {
        startButtonNode.classList.add("activeButt");
        startButtonNode.classList.remove("inactiveStartButt");
        startButtonNode.innerText = "Let's start!";
    }
    else {
        startButtonNode.classList.add("inactiveStartButt");
        startButtonNode.classList.remove("activeButt");
        startButtonNode.innerText = "Select files to start.";
    }
}