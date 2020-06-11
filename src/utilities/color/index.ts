function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const threshold = 100;

function colorsAreClose(color1: string, color2: string): boolean {
    const color1RGB = hexToRgb(color1);
    const color2RGB = hexToRgb(color2);

    if (!color1RGB) {
        console.error('could not convert color 1 to rgb');
        return false
    }
    if (!color2RGB) {
        console.error('could not convert color 2 to rgb');
        return false
    }

    const rDist = Math.abs(color1RGB.r - color2RGB.r);
    const gDist = Math.abs(color1RGB.g - color2RGB.g);
    const bDist = Math.abs(color1RGB.b - color2RGB.b);

    return (rDist + gDist + bDist) < threshold
}

export function getRandomColor(disallowedColors: string[]) {

    // generate a new random color
    let newColor = randomColor();

    // while this newColor is
    while (
        // in the disallowed colors OR
    disallowedColors.includes(newColor) ||

    // it is similar to one of the values in the disallowed colors
    (disallowedColors.reduce(
        (previousValue: boolean, currentValue: string) => (previousValue ? previousValue : colorsAreClose(newColor, currentValue)),
        false
    ))
        ) {
        // generate another one
        newColor = randomColor();
    }

    // return in
    return newColor
}
