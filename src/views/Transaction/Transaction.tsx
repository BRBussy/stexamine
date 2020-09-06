import React, {useEffect, useRef, useState} from 'react'
import {
    makeStyles,
    Card,
    CardContent,
    CardHeader,
    Theme,
    TextareaAutosize, Grid
} from '@material-ui/core'
import {xdr, Transaction, FeeBumpTransaction, Networks} from 'stellar-sdk';
import {DisplayField} from 'components/Form'
import moment from 'moment';
import OperationCard from './OperationCard';
import cx from 'classnames';
import {getRandomColor} from 'utilities/color';
import {AccountCard} from 'components/Stellar';
import {AccAuthReq, determineAccAuthReqForTxn} from 'utilities/stellar';
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
    const [xdrString, setXDRString] = useState('AAAAANORsbuSkqxgb/eqzblXLhlbyyoUzHPHvLtZ2ovUzz0aAAABLAAKLKUAAAAOAAAAAQAAAABe4XQAAAAAAF7kFv8AAAAAAAAAAwAAAAEAAAAACz6/QHwR9wauEK9svoz2vvLdVQmI5fcIRg8Q7FIRf0MAAAABAAAAAJGj01gLhCoxsJWb4esLbrGBnXGwhzx/Z27c9mIF5p2MAAAAAVpBUgAAAAAANpE76cTTrt2K+N23jllq6yAMBJyT5UcyYPNV76HFb50AAAAAHc1lAAAAAAEAAAAACz6/QHwR9wauEK9svoz2vvLdVQmI5fcIRg8Q7FIRf0MAAAABAAAAAO26MSgGvtUW+yzC7AB5uccLBAT6y5XNcX+EdBJ5J/ulAAAAAkRCMDRENAAAAAAAAAAAAAATOFwFI/oo9xyImrrraO+G89C0YJmUd4JJkh7WMmxKDQAAAAABMS0AAAAAAQAAAADtujEoBr7VFvsswuwAebnHCwQE+suVzXF/hHQSeSf7pQAAAAEAAAAACz6/QHwR9wauEK9svoz2vvLdVQmI5fcIRg8Q7FIRf0MAAAABWkFSAAAAAAA2kTvpxNOu3Yr43beOWWrrIAwEnJPlRzJg81XvocVvnQAHGv1JjQAAAAAAAAAAAAPUzz0aAAAAQGMvLfr7u9QZrecd8p+F5C0dMKJyvOvOzaHWcEDAkiOa36YgtWypu/hjTHsUFbsp/f9ddYKCKVvzOkLSZWpk9w760huXAAAAQL1Exo6JYfqB9XMsQMTfDdxvV4AD/LHYUrX274+bEmhQH55ZTUCaaxdJfNsP+tLEzXCBj2tjOUZSqWdS1EnZlQfiggWsAAAAQAiCDHv4ixZ708tSbHaTh+oENwPV3tXOzTjWtszloLTAP8onnx0C4dE349M7hngT1r/myi2Qmkok8Z3KXW8pNQ0=');
    const [loading, setLoading] = useState(false);
    const [parsingError, setParsingError] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
    const [feeBumpTransaction, setFeeBumpTransaction] = useState<FeeBumpTransaction | undefined>(undefined);
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
            // first try parse as feebump txn
            try {
                const txnEnv = xdr.TransactionEnvelope.fromXDR(xdrString, 'base64');
                const newTxn = new FeeBumpTransaction(txnEnv, Networks.TESTNET);
                setFeeBumpTransaction(newTxn)
                setTransaction(newTxn.innerTransaction);
                setRequiredAccountAuthorisations(await determineAccAuthReqForTxn(newTxn.innerTransaction, network));
                setLoading(false);
                return;
            } catch (e) {
                console.info('transaction is not fee bump')
            }

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
    }, [xdrString, network])

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
            {feeBumpTransaction && <Card>
                <CardHeader
                    title={'Fee-bump envelope'}
                    titleTypographyProps={{variant: 'body1'}}
                />
                <CardContent>
                    <AccountCard
                        accountID={feeBumpTransaction.feeSource}
                        horizonURL={network}
                        getRandomColorForKey={getRandomColorForKey}
                        label={'Fee-bump Source Account'}
                        invertColors
                    />
                    <DisplayField
                        label={'Fee'}
                        value={`${feeBumpTransaction.fee}`}
                    />
                </CardContent>
            </Card>}
            {(() => {
                if (loading) {
                    return (
                        <div>loading...</div>
                    )
                }
                if (transaction) {
                    return (
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
                                                label={'Transaction Source'}
                                                invertColors
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
                                    title={'Signature Details'}
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
                        </React.Fragment>
                    )
                }

                return (
                    <div>error</div>
                )
            })()}
        </div>
    )
}
