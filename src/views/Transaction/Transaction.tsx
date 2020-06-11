import React, {useEffect, useRef, useState} from 'react'
import {
    makeStyles,
    Card,
    CardContent,
    CardHeader,
    Theme,
    TextareaAutosize, Grid
} from '@material-ui/core'
import {xdr, Transaction, Networks} from 'stellar-sdk';
import {DisplayField} from 'components/Form'
import moment from 'moment';
import OperationCard from './OperationCard';
import cx from 'classnames';
import {getRandomColor} from 'utilities/color';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridRowGap: theme.spacing(1),
        padding: theme.spacing(1)
    },
    bodyCard: {
        backgroundColor: theme.palette.background.default
    },
    transactionDetailsCardContent: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridRowGap: theme.spacing(1)
    },
    textArea: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        width: 'calc(100vw - 20vw)'
    },
    textAreaError: {
        border: `2px solid ${theme.palette.error.main}`
    }
}));

const disallowedColors: string[] = [
    '#ffffff',
    '#000000',
    '#424242',
    '#303030',
    '#7aa2c9',
    '#354cbd',
    '#2418b6'
]

export default function LandingPage() {
    const classes = useStyles();
    const [xdrString, setXDRString] = useState('AAAAADfgrQSRzlutL3WDCb7QM9k7RdfYvYUcArUyy3VZ64TfAAABLAAD5EMAAAAVAAAAAQAAAABevduAAAAAAF7Afn8AAAAAAAAAAwAAAAEAAAAAGlj/gfWolVfZU/kXk4srlV3GChC3uuYQ1pC6D3abTzQAAAABAAAAAMnpsRnPNl5hPiuVrkhedYFEvJAQ3YmA36SO0UyyJs86AAAAAVpBUgAAAAAAkO9W/jxlIO4CicPesRrvbUhm/5O1ANrEajZDqGOC1J8AAAAAHc1lAAAAAAEAAAAAGlj/gfWolVfZU/kXk4srlV3GChC3uuYQ1pC6D3abTzQAAAABAAAAAC9NUv6pcCKw68E5kP35roXIeDrXNx8vAy+vOYz4ftsvAAAAAkRCMDREMgAAAAAAAAAAAABy51j5jb+OBXwRwTB16HcXMepK65JsYSD+fSwZnFp0ngAAAAAAmJaAAAAAAQAAAAAvTVL+qXAisOvBOZD9+a6FyHg61zcfLwMvrzmM+H7bLwAAAAEAAAAAGlj/gfWolVfZU/kXk4srlV3GChC3uuYQ1pC6D3abTzQAAAABWkFSAAAAAACQ71b+PGUg7gKJw96xGu9tSGb/k7UA2sRqNkOoY4LUnwAAAOjUpRAAAAAAAAAAAANZ64TfAAAAQPe8yaw5vuBwgMknQlSQREQ6GIGZGuHih0MLvfkiH3OgshD/CcFnkgwbS/ahHMCdSNCqXpEtkbV+JDliKEWx4gtQc27WAAAAQNc+iwe9L+4naCRjBANfMZp4BzWeTx5wbybS3H5l8DJVPnncNa0gQitcxkaPIRyeXInFuq4dDMzxqHkGqhVFYgC2a7+bAAAAQNP2NMSYbOS0Ygb3py/nPoTPJCyFml0Bhf/6qdtT9Lz+Ggbw4s6z7sZ6qLuKTDOjoEHmrf0Itghtvt2jiFTK3AE=');
    const [, setLoading] = useState(false);
    const [parsingError, setParsingError] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
    const usedColors = useRef<{ [key: string]: string }>({})

    const getRandomColorForKey = (key: string) => {
        // if a color is already stored for this key, use it
        if (usedColors.current[key]) {
            return usedColors.current[key]
        }
        // otherwise get a new random color
        usedColors.current[key] = getRandomColor([
            ...disallowedColors,
            ...Object.values(usedColors.current)
        ])
        return usedColors.current[key];
    }

    useEffect(() => {
        if (!xdrString) {
            return;
        }
        (async () => {
            setLoading(true);
            setParsingError(false);
            try {
                const transactionEnvelope = xdr.TransactionEnvelope.fromXDR(xdrString, 'base64');
                setTransaction(new Transaction(transactionEnvelope, Networks.TESTNET));
            } catch (e) {
                console.error('error parsing transaction xdr', e);
                setParsingError(true);
            }
            setLoading(false);
        })()
    }, [xdrString])

    console.log(transaction)

    return (
        <div className={classes.root}>
            <Card>
                <CardHeader
                    title={'Input'}
                    titleTypographyProps={{variant: 'h6'}}
                />
                <CardContent>
                    <TextareaAutosize
                        spellCheck={false}
                        rows={7}
                        value={xdrString}
                        placeholder={'Transaction base64 XDR string'}
                        className={cx(
                            classes.textArea,
                            {[classes.textAreaError]: parsingError}
                        )}
                        onChange={(e) => setXDRString(e.target.value)}
                    />
                </CardContent>
            </Card>
            {transaction &&
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <DisplayField
                                    label={'Sequence'}
                                    value={transaction.sequence}
                                />
                                <DisplayField
                                    label={'Source Account'}
                                    value={transaction.source}
                                    valueTypographyProps={{style: {color: getRandomColorForKey(transaction.source)}}}
                                />
                                <DisplayField
                                    label={'Network'}
                                    value={transaction.networkPassphrase}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardHeader
                                title={'Time-bounds'}
                                titleTypographyProps={{variant: 'body1'}}
                            />
                            <CardContent>
                                {transaction.timeBounds
                                    ? (
                                        <React.Fragment>
                                            <DisplayField
                                                label={'Start'}
                                                value={moment.unix(+transaction.timeBounds.minTime).format('LLL')}
                                            />
                                            <DisplayField
                                                label={'End'}
                                                value={moment.unix(+transaction.timeBounds.maxTime).format('LLL')}
                                            />
                                        </React.Fragment>
                                    )
                                    : 'not set'
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Card>
                    <CardHeader
                        title={'Operations'}
                        titleTypographyProps={{variant: 'body1'}}
                    />
                    <CardContent>
                        <Grid container spacing={1}>
                            {transaction.operations.map((op, idx) => (
                                <Grid item key={idx}>
                                    <OperationCard
                                        key={idx}
                                        operation={op}
                                        getRandomColorForKey={getRandomColorForKey}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </React.Fragment>}
        </div>
    )
}
