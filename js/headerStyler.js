import {getHeaderHeight} from "./miscellaneous.js";

// styleHeaderArrows();

export function styleHeader() {
	let windowWidth = window.innerWidth;
	let headerNode = document.getElementById("header");
	let scoreLineNode = document.getElementById("scoreLine");
	let scoreNumbersNodes = scoreLineNode.querySelectorAll("p");
	let newHeaderHeight = Math.round(windowWidth / 10) + "px";
	//style header
	headerNode.style.height = newHeaderHeight;
	if(headerNode.style.top != "0px") {
		headerNode.style.top = `-${getHeaderHeight()}px`;
	}
	//style score
	scoreLineNode.style.fontSize = Math.round(windowWidth / 30) + "px";
	for(let scoreNode of scoreNumbersNodes) {
		scoreNode.style.fontSize = Math.round(windowWidth / 25) + "px";
	}
}

export function styleHeaderArrows() {
	document.getElementById("arrowDown").addEventListener("click", displayLeftRightArrows);
	document.getElementById("arrowUp").addEventListener("click", hideLeftRightArrows);

	function displayLeftRightArrows() {

		for(let arrow of document.getElementsByClassName("leftRightArrows")) {
			arrow.style.display = "inline";
			// wait for it to display, then change style
			setTimeout(() => {
				if(arrow.id === "arrowLeft") {
					arrow.style.marginRight = "4vmax";
				}
				else {
					arrow.style.marginLeft = "4vmax";
				}
			},0);
		}
	}

	function hideLeftRightArrows() {
		for(let arrow of document.getElementsByClassName("leftRightArrows")) {
			setTimeout(() => {
				arrow.style.display = "none";
			}, 1000);
			if(arrow.id === "arrowLeft") {
				arrow.style.marginRight = "0";
			}
			else {
				arrow.style.marginLeft = "0";
			}
		}
	}
}
