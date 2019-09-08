import {state} from "./script.js";
import {randomColor, transferToHex} from "./miscellaneous.js";

let pColors = ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#7f00ff", "#e0e0e0", "#994c00"];

export class ColorSelector {
    constructor(node) {
        this.colors = [];
        this.cSNode = null;
        this.playerColorNode = node;
        this.playerNode = node.parentElement;
        this.intID;
    }
    
    setColors() {
        this.colors = [];
        for(let color of pColors) {
            if(isInactiveColor(color)) this.colors.push(color);
        }
    }
    
    createNode() {
        let playerID = this.playerNode.id[1] - 1;
        let cSelector = document.createElement("div");
        cSelector.id = "cSelector";
        for (let x = 0; x < this.colors.length; x++) {
            // allow max 8 color nodes (because of styling)
            if(x >= 8) break;
            let colorNode = document.createElement("div");
            colorNode.classList.add("selectorColor");
            colorNode.style.backgroundColor = this.colors[x];
            colorNode.addEventListener("click", colorSelected);
            cSelector.appendChild(colorNode);
        }
        // placing input colorNode in the end
        cSelector.appendChild(createInputColorNode(this.intID));
        // saving created node
        this.cSNode = cSelector;
        
        function colorSelected() {
            let newColor = transferToHex(event.target.style.backgroundColor);
            state.players[playerID].changeColor(newColor);
            removeCSelector();
        }
        
        // when using input color
        function chooseColor(){
            let newColor = document.getElementById("inputColor").value;
            state.players[playerID].changeColor(newColor);
            removeCSelector();
        }
        
        function createInputColorNode(cSelectorIntID) {
            let colorNode = document.createElement("label");
            colorNode.setAttribute("for","inputColor");
            colorNode.innerHTML = `<svg id="colorPalette"><use xlink:href="#icon-color-palette"></use></svg><input id="inputColor" type="color" name="inputColor" style="display:none">`;
            colorNode.lastChild.addEventListener("change",chooseColor);
            colorNode.classList.add("selectorColor");
            colorNode.firstChild.style.color = randomColor();

            cSelectorIntID = setInterval(() => {
                colorNode.firstChild.style.color = randomColor();
            },3000);
            return colorNode;
        }
    }
    
    appendCSNode() {
        this.playerNode.appendChild(this.cSNode);
    }
    
}

export function createCSelector() {
    //replace event listeners till the color choice is complete
    for(let player of state.players) {
        player.colorNode.removeEventListener("click", createCSelector);
        if(event.target == player.colorNode) continue;
        player.colorNode.addEventListener("click", redrawCSelector);
    }
    event.target.addEventListener("click",removeCSelector);
    
    state.cSelector = new ColorSelector(event.target);
    let {cSelector} = state;
    cSelector.setColors();
    cSelector.createNode();
    cSelector.appendCSNode();
    
    window.addEventListener("keyup",removeCSelector);
}

export function removeCSelector(){
    // for keyup event let only "Escape" through
    if(event.key && event.key != "Escape") return;

    let {cSelector, players} = state;
    cSelector.playerNode.removeChild(cSelector.cSNode);

    for (let player of players) {
        player.colorNode.addEventListener("click", createCSelector);
        if(cSelector.playerColorNode == player.colorNode) continue;
        player.colorNode.removeEventListener("click", redrawCSelector);
    }
    
    cSelector.playerColorNode.removeEventListener("click",removeCSelector);
    window.removeEventListener("keyup",removeCSelector);
    clearInterval(cSelector.intID);
    state.cSelector = null;
}

export function redrawCSelector() {
    // check if clicked on player color node and take it, else take node from color selector
    let playerColorNode = state.players.some(player => player.colorNode == event.target) && event.type == "click" ?
        event.target : state.cSelector.playerColorNode;
    removeCSelector();
    // use "click" event listener to draw new color selector
    playerColorNode.click();
}

export function isInactiveColor(color) {
    let activeColors = state.players.filter(player => player.isInGame).map(player => player.color);
    if(activeColors.some(activeColor => activeColor == color)) {
        return false;
    }
    return true;
}

export function getInactiveColor(){
    for(let color of pColors){
        if(isInactiveColor(color)) return color;
    }
}