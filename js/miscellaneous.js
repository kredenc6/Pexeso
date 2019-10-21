export function randomColor() {
    let letters = `0123456789abcdef`;
    let color = "#";
    for (let x = 0; x < 6; x++) {
        let randomN = Math.floor(Math.random() * 16);
        color += letters[randomN];
    }
    return color;
}

export function transferToHex(colorStr) {
    let hexColor = "#" + colorStr.split(",")
                        .map(piece => {
                            let hex = Number(/\d+/.exec(piece)[0]).toString(16);
                            if(hex.length == 1) hex = "0" + hex;
                            return hex;
                        })
                        .join("");
    return hexColor;
}

// let "max-height" and "min-height" css property override "height" when needed
export function getHeaderHeight() {
    let headerNode = document.getElementById("header");
    let headerStyle = headerNode.currentStyle || window.getComputedStyle(headerNode);
    
    let headerMaxHeight = Number(/\d+/.exec(headerStyle["max-height"])[0]);
    let headerMinHeight = Number(/\d+/.exec(headerStyle["min-height"])[0]);
    let headerHeight = Number(/\d+/.exec(headerNode.style.height)[0]);

    if(headerHeight > headerMaxHeight) {
        return headerMaxHeight;
    } else
    if(headerHeight < headerMinHeight) {
        return headerMinHeight;
    }
    return headerHeight;
}

export function hexToRGB(hex, alpha) {
	if(hex.length == 4) {
		hex = "#" + hex.slice(1).repeat(2);
	}
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
		return `rgba( ${r}, ${g}, ${b}, ${alpha} )`;
    } else {
        return `rgba( ${r}, ${g}, ${b}, 1 )`;
    }
}


export function detectEdgeBrowser() {
    const userAgentArr = window.navigator.userAgent.split(" ");
    const edgeWarningNode = document.getElementById("edgeWarning");

    edgeWarningNode.addEventListener("click", () => {
        event.target.style.display = "none";
    })

    if(!userAgentArr[userAgentArr.length - 1].includes("Edge")) {
        edgeWarningNode.style.display = "none";
    }
}