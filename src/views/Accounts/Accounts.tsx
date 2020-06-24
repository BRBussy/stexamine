import React, {useRef, useState} from 'react';
import {getRandomColor} from '../../utilities/color';

export default function Accounts() {
    const [network] = useState('https://horizon-testnet.stellar.org');
    const usedColors = useRef<{ [key: string]: string }>({})

    const getRandomColorForKey = (key: string) => {
        // if a color is already stored for this key, use it
        if (usedColors.current[key]) {
            return usedColors.current[key]
        }
        // otherwise get a new random color
        usedColors.current[key] = getRandomColor([
            ...Object.values(usedColors.current)
        ])
        return usedColors.current[key];
    }

    return (
        <div>
            accounts!
        </div>
    )
}
