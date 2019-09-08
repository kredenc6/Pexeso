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

// let "max-height" css property override "height" when needed
export function getHeaderHeight() {
    let headerNode = document.getElementById("header");
    let headerStyle = headerNode.currentStyle || window.getComputedStyle(headerNode);
    let headerMaxHeight = headerStyle["max-height"];
    let headerHeight = Math.min(/\d+/.exec(headerNode.style.height), /\d+/.exec(headerMaxHeight));
    return headerHeight;
}