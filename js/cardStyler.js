import {state} from "./script.js";
//import {getHeaderHeight} from "./miscellaneous.js";

export function cardSizing() {
    // getting margin value from style
    let boxClass = document.querySelector(".box");
    let style = boxClass.currentStyle || window.getComputedStyle(boxClass); // info source at the top of HTML file
    let marginAdj = Number(style.margin.slice(0, -2)) * 2; // in px will it work only in Chrome?
    if (!style.margin.endsWith("px")) {
        console.error("Not getting margin value in px!! cardSizing()");
    }

  	// calculate card max size from the current window surface and card count (idealy cards cover whole surface)
  	// if they cover more - recalculate(reduce) their size to fit 1 extra card to row or column(whichever return bigger card size value)...
  	// ...basically meaning adding an extra row or column
  	// repeat till they fit
    let longerAxis = Math.max(window.innerHeight, window.innerWidth);
    let shorterAxis = Math.min(window.innerHeight, window.innerWidth);
	let playAreaSurface = window.innerWidth * window.innerHeight;
    let cardCount = state.cards.length * 2;
    let cardMaxSize = Math.floor(Math.sqrt(playAreaSurface / cardCount)); // (cards are squares, therefore square root detemines their size)
  	
  	let longerAxisCardCount = Math.floor(longerAxis / cardMaxSize);
  	let shorterAxisCardCount = Math.floor(shorterAxis / cardMaxSize);
   	let cardSize = cardMaxSize;
  
  	while(cardCount > (longerAxisCardCount * shorterAxisCardCount)) {
	  	let cardSizeAdjLong = Math.min(longerAxis / (longerAxisCardCount + 1));
	  	let cardSizeAdjShort = Math.min(shorterAxis / (shorterAxisCardCount + 1));
	  	if(cardSizeAdjLong > cardSizeAdjShort) {
		  cardSize = cardSizeAdjLong;
		  longerAxisCardCount++;
		} else {
		  cardSize = cardSizeAdjShort;
		  shorterAxisCardCount++;
		}
	}
  	// adjusting for margin and adding 1 extra pixel(it helps!)
  	cardSize -= (marginAdj + 1);
  
    styleResize(cardSize);
	
	function styleResize(newCardSize) {
		// resize cards
		state.cardSize = newCardSize;
		for (let box of document.getElementsByClassName("box")) {
			box.style.width = newCardSize + "px";
			box.style.height = newCardSize + "px";
		}
		// style cards
		for(let cardNode of state.deck) {
			cardNode.style.fontSize = Math.round(state.cardSize / 10) + "px";
		}
	}
}

export function adjustDOMtoNextPlayer(player) {
    let activeColor = player.color;
    let frontNodes = document.getElementsByClassName("front");
    // redraw now if needed
    if(state.mouseOnCard) {
        state.mouseOnCard.style.boxShadow = "2px 2px 6px " + activeColor + ", -2px -2px 6px " + activeColor;
        state.mouseOnCard.style.color = activeColor;
    }
    // change event listeners
    for (let frontNode of frontNodes) {
        frontNode.innerText = player.name;
        frontNode.addEventListener("mouseover", function () {
            event.target.style.boxShadow = "2px 2px 6px " + activeColor + ", -2px -2px 6px " + activeColor;
            event.target.style.color = activeColor;
        });
        frontNode.addEventListener("mouseout", function () {
            event.target.style.boxShadow = "";
            event.target.style.color = "#fff";
        });
    }
}