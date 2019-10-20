import {state} from "./script.js";

export function showCard(card) {
	let playAreaNode = document.getElementById(`playarea`);
	let {src, fileType} = card.dataset;
	let {flipbackTime} = state;

	removeVideoAndAudio();
	whiteBackground();
	
	if(fileType == `picture`) {
		playAreaNode.style.backgroundPosition = `center`;
		playAreaNode.style.backgroundSize = `contain`;
		playAreaNode.style.backgroundImage = `url("${src}")`;
	} else if(fileType == `video`) {
		let videoContainer = document.createElement(`div`);
		videoContainer.id = `videoContainer`;
		videoContainer.innerHTML = `<video><source src="${src}"></video>`;
		playAreaNode.appendChild(videoContainer);
		
		let videoNode = playAreaNode.querySelector(`video`);
		playNode(videoNode);
	} else if (fileType == `audio`) {
		let audioNode = document.createElement(`audio`);
		audioNode.src = src;
		audioNode.style.display = "none";
		playAreaNode.appendChild(audioNode);
		playNode(audioNode);
	} else {
		throw new Error(`Received unknow fileType.`);
	}
	
	litCards();
	
	function litCards() {
		for(let card of state.deck) {
			card.querySelector(`.front`).style.backgroundColor = `rgba( 0, 0, 0, 0.2 )`;
			
			styleCardBacks(card, `0.01`);
		}
	}
	
	function playNode(node) {
		node.currentTime = 0;
				node.play()
				.catch(err => {
					if(!err.name === "AbortError") { // no need to deal with pausing/deleting(the node) error 
						console.log(err.message);
					}
				}); 
		if(flipbackTime !== 0) {
			setTimeout(() => node.pause(), flipbackTime);
		}
	}
}

export function hideCard() {
	removeVideoAndAudio();
	whiteBackground();
	dimCards();
	
	function dimCards() {
		for(let card of state.deck) {
			card.querySelector(`.front`).style.backgroundColor = `rgba( 0, 0, 0, 0.8 )`;
			
			styleCardBacks(card, `0.2`);
		}
	}
}

function removeVideoAndAudio() {
	const playAreaNode = document.getElementById(`playarea`);
	const videoNode = document.querySelector("video");
	const audioNode = document.querySelector("audio");
	if(videoNode) {
		// videoNode.pause();
		videoNode.currentTime = 0;
		playAreaNode.removeChild(playAreaNode.querySelector(`#videoContainer`));
	}
	if(audioNode) {
		// audioNode.pause();
		audioNode.currentTime = 0;
		playAreaNode.removeChild(playAreaNode.querySelector(`audio`));
	}
}

function whiteBackground() {
	let playAreaNode = document.getElementById(`playarea`);
	playAreaNode.style.backgroundImage = `url("./img/white_background.png")`;
}

function styleCardBacks(card, saturation, text) {
	let backStyle = card.querySelector(`.back`).currentStyle || window.getComputedStyle(card.querySelector(`.back`));
	let backColor = backStyle.backgroundColor;
	if(backColor != `rgba(0, 0, 0, 0)`) {
		let regEx = /\d\.\d/;
		card.querySelector(`.back`).style.backgroundColor = backColor.replace(regEx, saturation);
	}
	if(text !== undefined) {
		card.querySelector(`.back`).innerText = text;
	}
}