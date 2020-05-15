import React, {useContext, useState} from 'react';

interface ContextType {
    getRandomColor: (key: string) => string
}

const RandomColor = React.createContext({} as ContextType)

const disallowedColors: string[] = [
    '#ffffff',
    '#000000',
    '#424242',
    '#303030',
    '#7aa2c9',
    '#354cbd'
]

function getRandomColor() {
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

export default function RandomColorContext({children}: { children?: React.ReactNode }) {
    const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});

    return (
        <RandomColor.Provider
            value={{
                getRandomColor: (key: string) => {
                    // check if a color has been stored for this key
                    if (colorMap[key]) {
                        // if one already has, return it
                        return colorMap[key]
                    }

                    // otherwise generate a new random color
                    let newColor = getRandomColor();

                    // while this newColor is
                    while (
                        // already included in the color map OR
                    Object.values(colorMap).includes(newColor) ||

                    // it is similar to one of the values already included in the color map OR
                    ([...Object.values(colorMap), ...disallowedColors]).reduce((previousValue: boolean, currentValue: string) => (
                        previousValue ? previousValue : colorsAreClose(newColor, currentValue)
                    ), false) ||

                    // it is one of the disallowed colors
                    disallowedColors.includes(newColor)
                        ) {
                        // generate another one
                        newColor = getRandomColor();
                    }

                    // store it
                    setColorMap({
                        ...colorMap,
                        [key]: newColor
                    })

                    // return in
                    return newColor
                }
            }}
        >
            {children}
        </RandomColor.Provider>
    );
}

export const useRandomColorContext = () => (useContext(RandomColor));