import {state, start} from "./script.js";

export function changeName() {
    
    let html = `<input type="text" value="${event.target.innerText}" minlength="3" maxlength="10" size="11" spellcheck="false" required>`;
    event.target.innerHTML = html;
    event.target.firstChild.focus();
    event.target.firstChild.select();
    event.target.firstChild.style.color = "green";
    event.target.firstChild.style.textShadow = "green 1px 1px 6px";
    
    event.target.firstChild.addEventListener("keyup",nameChanged);
    event.target.firstChild.addEventListener("blur",nameChanged);
}

function nameChanged() {
    let newName = event.target.value.trim();
    let player = state.players[event.target.parentElement.parentElement.id[1] - 1];
	let messageNode = document.getElementById("message");
    // styling incoming text
    if(isValidName(newName, player)){
		messageNode.style.visibility = `hidden`;
        event.target.style.color = "green";
        event.target.style.textShadow = "green 1px 1px 6px";
		activateStartButt();
    } else{
		messageNode.style.visibility = `hidden`;
        event.target.style.color = "red";
        event.target.style.textShadow = "red 1px 1px 6px";
		deactivateStartButt();
		if(!player.isInGame) {
			activateStartButt();
		}
    }
    
    // confirming a new name:
    // let only "Escape" and "Enter" keys of "keyup" event through
    if(event.key && !(event.key == "Enter" || event.key == "Escape")) return;
    
    // prevent "blur" event to fire when "keyup" event is activated
    if(event.key) event.target.removeEventListener("blur",nameChanged);
    
	// keep the old name on "Escape"
    if(event.key == "Escape") {
		player.changeName(player.name);
		return;
	}
    
    // conditions for rejecting "newName"
    if(newName.length < 3) {
		styleMessage(`Player name needs to have at least 3 characters.`);
		player.node.querySelector("input").focus();
        return;
    }
    
    if(!isValidName(newName, player)) {
		if(/player[1234]/.exec(newName.toLowerCase())) {
			styleMessage(`"${newName}" is a default name of other player.`);
		} else {
			styleMessage(`"${newName}" is already taken.`);
		}
		player.node.querySelector("input").focus();
        return;
    }
    
    // applying "newName"
    player.changeName(newName);
    sessionStorage.setItem(player.defaultName,newName);
    
    function noDuplicates(newName) {
        for(let p of state.players) {
            if(p == player) continue;
            if(newName.toLowerCase() == p.name.toLowerCase() && p.isInGame) return false;
        }
        return true;
    }
    
    function isOtherDefaultName(newName){
        // check if entered name is in default player names (all lowercased first) and...
        if(state.players.map((p) => p.defaultName.toLowerCase()).indexOf(newName.toLowerCase()) != -1) {
            // ... if it's not this player default name:
            if(player.defaultName.toLowerCase() != newName.toLowerCase()) return true;
        }
        return false;
    }
	
	function deactivateStartButt() {
        const startButtonNode = document.getElementById("startButt");
        startButtonNode.removeEventListener("click", start);
        startButtonNode.classList.add("inactiveStartButt");
        startButtonNode.classList.remove("activeButt");
        startButtonNode.innerText = "Invalid name.";
    }
    
	function activateStartButt() {
        const startButtonNode = document.getElementById("startButt");
        startButtonNode.classList.remove("inactiveStartButt");
        if(state.files.fileNames.length > 0) {
            startButtonNode.addEventListener("click", start);
            startButtonNode.classList.add("activeButt");
            startButtonNode.innerText = "Let's start!";
        }
        else {
            startButtonNode.innerText = "Select files to start.";
        }
	}
	
	function styleMessage(text) {
		messageNode.innerText = text;
		messageNode.style.visibility = `visible`;
		setTimeout(() => messageNode.style.visibility = `hidden`, 3000);
	}
}

export function isValidName(newName, player) {
	let trimedName = newName.trim();
	
	return noDuplicates(trimedName, player) &&
		   !isOtherDefaultName(trimedName, player) &&
		   trimedName.length > 2;
	
	function noDuplicates(newName, player) {
        for(let p of state.players) {
            if(p == player) continue;
            if(newName.toLowerCase() == p.name.toLowerCase() && p.isInGame) return false;
        }
        return true;
    }
    
    function isOtherDefaultName(newName, player){
        // check if entered name is in default player names (all lowercased first) and...
        if(state.players.map((p) => p.defaultName.toLowerCase()).indexOf(newName.toLowerCase()) != -1) {
            // ... if it's not this player default name:
            if(player.defaultName.toLowerCase() != newName.toLowerCase()) return true;
        }
        return false;
    }
}