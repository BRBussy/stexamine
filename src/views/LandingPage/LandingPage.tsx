import React, {useEffect, useState} from 'react'
import {
    makeStyles,
    Card,
    CardContent,
    CardHeader,
    Theme,
    TextField, Grid
} from '@material-ui/core'
import {xdr, Transaction, Networks, Operation, OperationType} from 'stellar-sdk';
import {DisplayField} from 'components/Form'
import moment from "moment";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridRowGap: theme.spacing(1)
    },
    bodyCard: {
        backgroundColor: theme.palette.background.default
    },
    transactionDetailsCardContent: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridRowGap: theme.spacing(1)
    }
}));

export default function LandingPage() {
    const classes = useStyles();
    const [xdrString, setXDRString] = useState('AAAAADfgrQSRzlutL3WDCb7QM9k7RdfYvYUcArUyy3VZ64TfAAABLAAD5EMAAAAVAAAAAQAAAABevduAAAAAAF7Afn8AAAAAAAAAAwAAAAEAAAAAGlj/gfWolVfZU/kXk4srlV3GChC3uuYQ1pC6D3abTzQAAAABAAAAAMnpsRnPNl5hPiuVrkhedYFEvJAQ3YmA36SO0UyyJs86AAAAAVpBUgAAAAAAkO9W/jxlIO4CicPesRrvbUhm/5O1ANrEajZDqGOC1J8AAAAAHc1lAAAAAAEAAAAAGlj/gfWolVfZU/kXk4srlV3GChC3uuYQ1pC6D3abTzQAAAABAAAAAC9NUv6pcCKw68E5kP35roXIeDrXNx8vAy+vOYz4ftsvAAAAAkRCMDREMgAAAAAAAAAAAABy51j5jb+OBXwRwTB16HcXMepK65JsYSD+fSwZnFp0ngAAAAAAmJaAAAAAAQAAAAAvTVL+qXAisOvBOZD9+a6FyHg61zcfLwMvrzmM+H7bLwAAAAEAAAAAGlj/gfWolVfZU/kXk4srlV3GChC3uuYQ1pC6D3abTzQAAAABWkFSAAAAAACQ71b+PGUg7gKJw96xGu9tSGb/k7UA2sRqNkOoY4LUnwAAAOjUpRAAAAAAAAAAAANZ64TfAAAAQPe8yaw5vuBwgMknQlSQREQ6GIGZGuHih0MLvfkiH3OgshD/CcFnkgwbS/ahHMCdSNCqXpEtkbV+JDliKEWx4gtQc27WAAAAQNc+iwe9L+4naCRjBANfMZp4BzWeTx5wbybS3H5l8DJVPnncNa0gQitcxkaPIRyeXInFuq4dDMzxqHkGqhVFYgC2a7+bAAAAQNP2NMSYbOS0Ygb3py/nPoTPJCyFml0Bhf/6qdtT9Lz+Ggbw4s6z7sZ6qLuKTDOjoEHmrf0Itghtvt2jiFTK3AE=');
    const [loading, setLoading] = useState(false);
    const [parsingError, setParsingError] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);

    useEffect(() => {
        if (!xdrString) {
            return;
        }
        (async () => {
            setLoading(true);
            setParsingError(false);
            try {
                const transactionEnvelope = xdr.TransactionEnvelope.fromXDR(xdrString, "base64");
                setTransaction(new Transaction(transactionEnvelope, Networks.TESTNET));
            } catch (e) {
                console.error('error parsing transaction xdr', e);
            }
            setParsingError(false);
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
                    <TextField
                        fullWidth
                        label={'Transaction base64 XDR'}
                        value={xdrString}
                        onChange={(e) => setXDRString(e.target.value)}
                        placeholder={'bas64 transaction XDR'}
                        error={parsingError}
                        helperText={parsingError ? 'unable to parse' : undefined}
                    />
                </CardContent>
            </Card>
            {transaction &&
            <Card>
                <CardHeader
                    title={'Transaction Details'}
                    titleTypographyProps={{variant: 'h6'}}
                />
                <CardContent className={classes.transactionDetailsCardContent}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <DisplayField
                                label={'Sequence'}
                                value={transaction.sequence}
                            />
                        </Grid>
                        <Grid item>
                            <Card className={classes.bodyCard}>
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
                    <Card className={classes.bodyCard}>
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
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>}
        </div>
    )
}

interface OperationCardProps {
    transactionSource?: string;
    operation: Operation;
}


const useOperationCardStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    }
}));

function OperationCard(props: OperationCardProps) {
    const classes = useOperationCardStyles()

    switch (props.operation.type) {
        case "payment":
            const paymentOperation = props.operation as Operation.Payment;
            return (
                <Card>
                 <CardContent>
                     <DisplayField
                         label={'Type'}
                         value={props.operation.type}
                     />
                     <DisplayField
                         label={'Source'}
                         value={props.operation.source
                             ? props.operation.source
                             : props.transactionSource
                                 ? props.transactionSource
                                 : 'no source'
                         }
                     />
                     <DisplayField
                         label={'Destination'}
                         value={paymentOperation.destination}
                     />
                     <DisplayField
                         label={'Amount'}
                         value={paymentOperation.amount}
                     />
                     <Grid container>
                         <Grid item>
                             <Card className={classes.bodyCard}>
                                 <CardHeader
                                     title={'Asset'}
                                     titleTypographyProps={{variant: 'caption'}}
                                 />
                                 <CardContent>
                                     <DisplayField
                                         label={'Code'}
                                         value={paymentOperation.asset.code}
                                     />
                                     <DisplayField
                                         label={'Issuer'}
                                         value={paymentOperation.asset.issuer}
                                     />
                                 </CardContent>
                             </Card>
                         </Grid>
                     </Grid>
                 </CardContent>
                </Card>
            )

    }

    return (
        <Card>
            <DisplayField
                label={'Type'}
                value={props.operation.type}
            />
            <DisplayField
                label={'Source'}
                value={props.operation.source
                    ? props.operation.source
                    : props.transactionSource
                        ? props.transactionSource
                        : 'no source'
                }
            />
        </Card>
    )
}