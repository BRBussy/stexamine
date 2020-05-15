import React, {useEffect, useState} from 'react'
import {makeStyles, Card, CardContent, FormHelperText, CardHeader, TextareaAutosize, Theme} from '@material-ui/core'
import {xdr} from 'stellar-sdk';
import cx from 'classnames';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center'
    },
    textArea: {
        color: theme.palette.text.primary,
        fontSize: 16,
        backgroundColor: theme.palette.background.paper,
        width: 508,
        maxWidth: 508
    },
    textAreaError: {
        border: `1px solid ${theme.palette.error.main}`
    }
}));

export default function LandingPage() {
    const classes = useStyles();
    const [xdrString, setXDRString] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsingError, setParsingError] = useState(false);

    useEffect(() => {
        if (!xdrString) {
            return;
        }
        (async () => {
            setLoading(true);
            setParsingError(false);
            try {
                console.log(xdr.TransactionEnvelope.fromXDR(xdrString, "base64"));
            } catch (e) {
                console.error('error parsing transaction xdr', e);
            }
            setParsingError(false);
            setLoading(false);
        })()
    }, [xdrString])

    return (
        <div className={classes.root}>
            <Card>
                <CardHeader
                    title={'Transaction'}
                />
                <CardContent>
                    <TextareaAutosize
                        rows={9}
                        rowsMax={9}
                        value={xdrString}
                        onChange={(e) => setXDRString(e.target.value)}
                        placeholder={'bas64 transaction XDR'}
                        className={cx(
                            classes.textArea,
                            {[classes.textAreaError]: parsingError}
                        )}
                    />
                    {parsingError &&
                    <FormHelperText>
                        Unable to parse xdr
                    </FormHelperText>
                    }
                </CardContent>
            </Card>
        </div>
    )
}