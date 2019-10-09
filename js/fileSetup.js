import {state} from "./script.js";
let startButton = document.getElementById("startButt");


//  creating URLs for pictures/sounds/videos + some styling
export function filesIn() {
  let {pictureURLs, audioURLs, videoURLs, fileNames} = state.files;
  let id = event.target.id;
  //chosenFiles refer! to the files object
  let chosenFiles;
  if(id.includes(`picture`)) chosenFiles = pictureURLs;
  else if(id.includes(`sound`)) chosenFiles = audioURLs;
  else if(id.includes(`video`)) chosenFiles = videoURLs;
  window.URL = window.URL || window.webkitURL || window.mozURL;
  let fileCount = pictureURLs.length + audioURLs.length + videoURLs.length;
  let maxFiles = 20;
  
  for (let x = 0; x < event.target.files.length; x++) {
	  	if(fileCount == maxFiles) {
        	window.alert(`Maximum number of files (${maxFiles}) reached.`);
		  	break;
		}
	  	if(fileCount > maxFiles) {console.error(`File count exceedet!`);}
      
        let file = event.target.files[x];
        // skip duplicate (by file name) files
        if(fileNames.includes(file.name)) {
            console.log(`Skipping duplicate file.`);
            continue;
        } else {
            fileNames.push(file.name);
          }
        let urlFile = URL.createObjectURL(file);
        chosenFiles.push(urlFile);
        fileCount++;
    }
    
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
    startButton.style.display = "block";
}

export function styleFileCounter(fileCount, maxFiles) {
	let percent = Math.round(fileCount / maxFiles * 100);
	document.getElementById("countBar").style.width = `${percent}%`;
	document.getElementById("fileCount").innerText = `${fileCount} / ${maxFiles}`;
}
