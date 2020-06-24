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
import {AccountCard} from 'components/Stellar';
import {AccAuthReq, determineAccAuthReqForTxn, signedBy} from '../../utilities/stellar';
import AccountAuthReq from 'components/Stellar/AccountAuthReq';

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

export default function LandingPage() {
    const classes = useStyles();
    const [xdrString, setXDRString] = useState('AAAAAKvmwKiw6/QYhmhICfO8FyYrsTbdNwZ/SdcvZptkPo0hAAAAyAANUXUAAAAPAAAAAQAAAAAAAAAAAAAAAF7zP6sAAAAAAAAAAgAAAAAAAAABAAAAAMujTV9OQmldNWpM9ou2BfYg9dqpAHSZxLmovo0P2g7tAAAAAAAAAAAATEtAAAAAAQAAAADLo01fTkJpXTVqTPaLtgX2IPXaqQB0mcS5qL6ND9oO7QAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAOUR25IGi5VBTC88q65Dk3VgH+atYBPiFXsDJS4AwN0UAAAABAAAAAAAAAAJkPo0hAAAAQLeVgLQidEjC32v2XYExUHcxisXxqSfBuhzyABO8F+zoLDnsFMyo6PSIznBPCK5uKHARp6A5a2AYgh4sfUuFSAQP2g7tAAAAQHS5b8AxKOPcAdsu0olE1jNFihFuvGf8hvodA/nNF/pNCBREoG3Jb+aS27d1btmLlfXKCvUGTlt1mW/o+oZU9Ag=');
    const [, setLoading] = useState(false);
    const [parsingError, setParsingError] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
    const usedColors = useRef<{ [key: string]: string }>({})
    const [network] = useState('https://horizon-testnet.stellar.org');
    const [requiredAccountAuthorisations, setRequiredAccountAuthorisations] = useState<AccAuthReq[]>([])

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

    useEffect(() => {
        if (!xdrString) {
            return;
        }
        (async () => {
            setLoading(true);
            setParsingError(false);
            try {
                const transactionEnvelope = xdr.TransactionEnvelope.fromXDR(xdrString, 'base64');
                const newTxn = new Transaction(transactionEnvelope, Networks.TESTNET);
                setTransaction(newTxn);
                setRequiredAccountAuthorisations(await determineAccAuthReqForTxn(newTxn, network));
            } catch (e) {
                console.error('error parsing transaction xdr', e);
                setParsingError(true);
            }
            setLoading(false);
        })()
    }, [xdrString])

    return (
        <div className={classes.root}>
            <Card>
                <CardHeader
                    title={'Input'}
                    titleTypographyProps={{variant: 'body1'}}
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
                                <AccountCard
                                    accountID={transaction.source}
                                    horizonURL={network}
                                    getRandomColorForKey={getRandomColorForKey}
                                    label={'Transaction Source Account'}
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
                                        network={network}
                                        transactionSource={transaction.source}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader
                        title={'Signing'}
                        titleTypographyProps={{variant: 'body1'}}
                    />
                    <CardContent>
                        <Grid container direction={'column'} spacing={1}>
                            {requiredAccountAuthorisations.map((accAuthReq, idx) => (
                                <Grid item key={idx}>
                                    <AccountAuthReq
                                        accAuthReq={accAuthReq}
                                        getRandomColorForKey={getRandomColorForKey}
                                        transaction={transaction}
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
