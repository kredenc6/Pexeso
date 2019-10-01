import {getHeaderHeight} from "./miscellaneous.js";

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