// TASK LIST:
// make settings style dynamic (resizing) - need some design polishing
// otpimalization: adjust flipback to audios, videos and possibly to an extra click? (simple hardcoded time is not the best)
// styling: fileButtons style interaction stops when file count is maxed out
// finnish needs to be finished - show header, winning message and start over button + button to go back to settings(fixed to screen center, z-index 5)
// when waiting for double click - change cursor and disable card coloring

export const state = {
	cards: [],
	deck: [],
	players: [],
	cSelector: null,
	playerCount: 2,
	files: {
		pictureURLs: [],
		audioURLs: [],
		videoURLs: [],
		fileNames: []
	},
	status: {
		cardFlipped: false,
		previousCard: null,
		currentCard: null,
		pairCount: 0,
		ready: true
	},
	mouseOnCard: null,
	flipbackTime: 0
};

let startButton = document.getElementById("startButt");
let playarea = document.getElementById("playarea");

let gameData = {
    maxPlayers: 4,
    timer: 0
};

import {ColorSelector, createCSelector, removeCSelector, redrawCSelector, isInactiveColor, getInactiveColor} from "./colorSelector.js";
import {getHeaderHeight, hexToRGB} from "./miscellaneous.js";
import {filesIn} from "./fileSetup.js";
import {changeName, isValidName} from "./nameChanger.js";
import {cardSizing, adjustDOMtoNextPlayer} from "./cardStyler.js";
import {styleHeader} from "./headerStyler.js";
import {showCard, hideCard} from "./cardFlipper.js";

class Player {
    constructor(position, name) {
        this.name = name;
        this.defaultName = `Player${position}`;
        this.color = "";
        this.node = null;
        this.colorNode = null;
        this.isInGame = false;
        this.plays = false;
        this.score = 0;
        this.wonRouns = 0;
    }

    changeName(name) {
        this.name = name;
        this.node.querySelector("span").innerText = name;
    }

    changeColor(color) {
        this.color = color;
        sessionStorage.setItem(this.defaultName+"Color",color);
        if(this.colorNode) this.colorNode.style.backgroundColor = color;
    }
    
    changeIsInGame(bool) {
        this.isInGame = bool;
    }

    createNodes(x) {
        let html = `<div id=p${x+1} class="player"><div id="p${x+1}color" class="pColor"></div><span>${this.name}</span></div>`;
        let temp = document.createElement("div");
        temp.innerHTML = html;
        this.node = temp.children[0];
        this.node.querySelector("span").addEventListener("click",changeName);
        
        this.colorNode = this.node.getElementsByClassName("pColor")[0];
        this.colorNode.addEventListener("click", createCSelector);
    }
}

//STARTING FUNCTIONS
setUpGameSettings();
createPlayers();
addPlayer(true);

//SETTINGS, EVENT LISTENERS
startButton.addEventListener("click", start);
document.getElementById("gameoverButt").addEventListener("click", start);
document.getElementById("addPlayerButt").addEventListener("click", () => addPlayer());
document.getElementById("removePlayerButt").addEventListener("click", removePlayer);

let fileTypeInputs = document.querySelectorAll("[type=file]");
for(let input of fileTypeInputs) {
    input.addEventListener("change", filesIn);
}

export function start() {
    playarea.style.display = "flex";
    document.getElementById("settingsHolder").style.display = "none";
    document.getElementById("header").style.display = "block";
    
  	reset();
    
    createCards();
    createDOM();
    createScore();
    cardSizing();
	styleHeader();
    nextPlayer();
    window.addEventListener("resize", cardSizing);
    window.addEventListener("resize", styleHeader);
}

// ***** GAME CREATION *****

function createPlayers(){
    for(let x=0;x<gameData.maxPlayers;x++){
        let name = sessionStorage.getItem(`Player${x+1}`) || `Player${x+1}`;
        state.players.push(new Player(x+1,name));
        state.players[x].createNodes(x);
    }
}

function createCards() {
    if(state.cards.length > 0) return;
    for(let fileType in state.files) {
		if(fileType == `fileNames`) {
			continue;
		}
        for(let blob of state.files[fileType]) {
            let type = /(picture)|(audio)|(video)/.exec(fileType)[0];
            let html = `<div class="box" data-src="${blob}" data-file-type="${type}"><div class="front">click</div><div class="back">`;
			if(type == `audio`) {
				html += `Listen!</div></div>`;
			} else {
				html += `</div></div>`;
			}
            state.cards.push({type, src: blob, html, paired: false, flipped: false});
        }
    }
}

function createDOM() {
    let htmls;
    let htmlDOM = "";
    for(let x=0;x<2;x++) {
        htmls = state.cards.map(card => card.html);
        let rand;
        while(htmls.length > 0) {
            rand = Math.floor(Math.random() * htmls.length);
            htmlDOM += htmls.splice(rand,1);
        }
    }
    playarea.innerHTML = htmlDOM;
    let childArr = playarea.children;
    for (let x = 0; x < childArr.length; x++) {
        state.deck.push(childArr[x]);
        childArr[x].addEventListener("click", showFace);
    }
}


// **** GAME SETTINGS *****

function addPlayer(newGame=false) {
    let {playerCount, players} = state;
    let playersNode = document.getElementById("players");
    
    if(newGame){
        for(let x=0;x<playerCount;x++){
            assignColor(players[x]);
            players[x].changeIsInGame(true);
            playersNode.appendChild(players[x].node);
        }
        return;
    }
    
    let newPlayer = players[playerCount];
    if (playerCount < gameData.maxPlayers) {
        assignColor(newPlayer);
        playersNode.appendChild(newPlayer.node);
        
        document.getElementById("playerCount").innerText = playerCount + 1;
        state.playerCount++;
        // replace event listener for cSelector if it is already active
        if(state.cSelector) {
            newPlayer.colorNode.removeEventListener("click", createCSelector);
            newPlayer.colorNode.addEventListener("click", redrawCSelector);
        }
        // if "newPlayer.name" is a duplicate set it to default name
        if(state.players.some(player => player.isInGame && player.name == newPlayer.name)) {
            newPlayer.changeName(newPlayer.defaultName);
        }
        
        newPlayer.changeIsInGame(true);
        // redraw cSelector
        if(state.cSelector) redrawCSelector();
    }
	
    function assignColor(player) {
        // assign nonactive color to the player if the color is already taken or if the player has no color assigned
        let sessionColor = sessionStorage.getItem(player.defaultName+"Color");
        if(sessionColor && isInactiveColor(sessionColor)) {
            player.changeColor(sessionColor);
            return;
        }
        if(!isInactiveColor(player.color) || player.color == "") {
            player.changeColor(getInactiveColor());
        }
    }
}

function removePlayer() {
    let {playerCount, players, cSelector} = state;
    let playersNode = document.getElementById("players");
	let player = players[playerCount-1];
    if (playerCount > 1) {
        
        document.getElementById("playerCount").innerText = playerCount - 1;
        player.changeIsInGame(false);
        state.playerCount--;
        if(cSelector) {
            if(cSelector.playerNode == playersNode.lastChild) {
                removeCSelector();
            } else {
                redrawCSelector();
            }
        }
		// player to be removed with active namechange(input) need to have nonvalid new name reseted(to previous name or defaultName)
		if(player.node.querySelector("input")) {
			let newName = player.node.querySelector("input").value;
			if(!isValidName(newName,player)) {
				player.changeName(player.name || player.defaultName);
			}
		}
        playersNode.removeChild(playersNode.lastChild);
    }
}

function setUpGameSettings() {
    startButton.style.display = "none";
    
    for(let button of document.getElementsByClassName("fileButtons")) {
        button.addEventListener("mouseover",biggerFileButton);
        button.addEventListener("mouseout",smallerFileButton);
    }
    
    mouseWheel();
    
    function mouseWheel(){
        document.getElementById("playerArea").addEventListener("wheel",function(event){
            event.preventDefault();
            if(event.deltaY < 0) {
                addPlayer();
            } else {
                removePlayer();
            }
        });
    }
}

// ***** GAME MECHANICS *****

function showFace() {
    if (!state.status.ready) {
        return;
    }
    event.target.parentElement.removeEventListener("click", showFace);
    this.style.transform = "rotateY(180deg)";
	showCard(this);

    if (state.status.cardFlipped) {
        state.status.cardFlipped = false;

        // cards match
        if (state.status.previousCard.dataset.src == this.dataset.src) {
			let playerColor = state.players.filter(player => player.plays).map((player => player.color))[0];
			cardsMatched(state.status.previousCard, this, hexToRGB(playerColor, .8));

            state.status.pairCount++;
			// are all cards matched?
            if (state.status.pairCount == state.cards.length) {
                finnish();
            }
		// cards don't match    
        } else {
			let {flipbackTime} = state;
            let temp = this;
			state.status.currentCard = this;
            state.status.ready = false;
            playarea.addEventListener("mousemove", mouseOnWhatCard);
			if(flipbackTime === 0) {
				window.ondblclick = flipback;
			} else {
				setTimeout(flipback, flipbackTime);
			}
        }
    } else {
        state.status.cardFlipped = true;
        state.status.previousCard = this;
    }
    
	
	function cardsMatched(card1, card2, color) {
		card1.style.transform = `rotateY(-180deg)`;
		let back1Node = card1.querySelector(`.back`);
		let back2Node = card2.querySelector(`.back`);
		back1Node.innerText = ``;
		back1Node.style.backgroundColor = color;
		back2Node.innerText = ``;
		back2Node.style.backgroundColor = color;

		scoreUp();
		hideCard();
	}
	
    function mouseOnWhatCard() {
        if(event.target.classList.contains("front")) {
            state.mouseOnCard = event.target;
        } else {
            state.mouseOnCard = null;
        }
    }
	
	function flipback() {
		window.ondblclick = "";
		let {previousCard, currentCard} = state.status;
		playarea.removeEventListener("mousemove", mouseOnWhatCard);
		nextPlayer();
		flipbackDOM(previousCard, currentCard);
		state.status.ready = true;
		
			function flipbackDOM(...cards) {
				for (let card of cards) {
					card.style.transform = "rotateY(0deg)";
					card.addEventListener("click", showFace);
				}
				hideCard();
			}
	}
}


function findNextPlayer() {
    let {players} = state;
    for (let x = 0; x < players.length; x++) {
        if (players[x].plays) {
            for(let y = x+1; y < players.length; y++) {
                if(players[y].isInGame) {
                    return players[y];
                }
            }
        }
    }
    return players[0];
}

function nextPlayer() {
    let {players} = state;
    let nextPlayer = findNextPlayer();
    if (gameData.timer > 0) {
        timer();
    }
    for(let player of players) {
        player.plays = false;
    }
    nextPlayer.plays = true;
    adjustDOMtoNextPlayer(nextPlayer);
}

function scoreUp() {
    for (let player of state.players) {
        if (player.plays) {
            player.score += 1;
            break;
        }
    }
    createScore();
}

function finnish() {
    let {players} = state;
    let gameOverButt = document.getElementById("gameoverButt");
    let topScore = -1;
    //finding top score
    for (let x = 0; x < players.length; x++) {
        if (players[x].score > topScore) {
            topScore = players[x].score;
        }
    }
    gameOverButt.style.display = "block";
}

function reset(a) {
    let {players} = state;
    for (let x = 0; x < players.length; x++) {
        players[x].score = 0;
    }
  	state.status.cardFlipped = false;
    state.status.pairCount = 0;
    state.status.ready = true;
}


// ***** GAME STYLING *****

function createScore() {
    let {players} = state;
    let scoreLineNode = document.getElementById("scoreLine");
    scoreLineNode.innerHTML = "";
    
    for(let x = 0; x < state.playerCount; x++) {
        fillInScore(scoreLineNode, players[x]);
    }
    setUpHeader();
	styleHeader();
    
    function fillInScore(node,player) {
        node.innerHTML += `<span class="score">${player.name}: <p id="${player.name}Score">${player.score}</p></span>`;
    }
    
    function setUpHeader() {
        document.getElementById("arrowDown").addEventListener("click", () => {
            let arrowUp = document.getElementById("arrowUp");
            arrowUp.style.display = "inline";
            arrowUp.style.paddingTop = "0px";
            document.getElementById("arrowDown").style.display = "none";
            document.getElementById("header").style.top = "0px";
        });

        document.getElementById("arrowUp").addEventListener("click", () => {
            document.getElementById("arrowDown").style.display = "inline";
            document.getElementById("arrowUp").style.display = "none";
            document.getElementById("header").style.top = `-${getHeaderHeight()}px`;
        });
    }
}

// ***** EVENT LISTENER FUNCTIONS *****

function biggerFileButton() {
	this.querySelector(".fileIconHolders").style.width = "48%";
	this.querySelector(".fileIconHolders").style.height = "48%";
}

function smallerFileButton() {
	this.querySelector(".fileIconHolders").style.width = "40%";
	this.querySelector(".fileIconHolders").style.height = "40%";
}


// ***** WORK IN PROGRESS *****