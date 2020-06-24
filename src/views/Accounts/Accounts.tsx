import React, {useRef, useState} from 'react';
import {getRandomColor} from 'utilities/color';
import {Card, CardContent, CardHeader, makeStyles, TextareaAutosize, TextField, Theme} from '@material-ui/core';
import cx from 'classnames';
import {AccountCard} from "../../components/Stellar";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridRowGap: theme.spacing(1),
        padding: theme.spacing(1)
    }
}))

export default function Accounts() {
    const classes = useStyles();
    const [network] = useState('https://horizon-testnet.stellar.org');
    const usedColors = useRef<{ [key: string]: string }>({})
    const [accountID, setAccountID] = useState('');

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
        <div className={classes.root}>
            <Card>
                <CardContent>
                    <TextField
                        fullWidth
                        label={'Account Being Stexamined'}
                        value={accountID}
                        onChange={(e) => setAccountID(e.target.value)}
                        placeholder={'Enter Account ID'}
                    />
                </CardContent>
            </Card>
            <AccountCard
                getRandomColorForKey={getRandomColorForKey}
                accountID={accountID}
                horizonURL={network}
            />
        </div>
    )
}
