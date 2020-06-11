import {Operation} from 'stellar-sdk';
import {Card, CardContent, CardHeader, Grid, makeStyles, Theme} from '@material-ui/core';
import {DisplayField} from 'components/Form';
import React from 'react';

interface OperationCardProps {
    transactionSource?: string;
    operation: Operation;
    getRandomColorForKey: (key: string) => string;
}


const useOperationCardStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    }
}));

export default function OperationCard(props: OperationCardProps) {
    const classes = useOperationCardStyles()

    const operationSourceAccount = props.operation.source
        ? props.operation.source
        : props.transactionSource
            ? props.transactionSource
            : 'no source'

    const operationSourceAccountColor = props.getRandomColorForKey(operationSourceAccount);

    switch (props.operation.type) {
        case 'payment':
            return (
                <PaymentOperationCard
                    transactionSource={props.transactionSource}
                    operation={props.operation as Operation.Payment}
                    getRandomColorForKey={props.getRandomColorForKey}
                />
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


interface PaymentOperationCardProps {
    transactionSource?: string;
    operation: Operation.Payment;
    getRandomColorForKey: (key: string) => string;
}

const usePaymentOperationCardStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    }
}));

function PaymentOperationCard(props: PaymentOperationCardProps) {
    const classes = usePaymentOperationCardStyles();

    const destinationAccountColor = props.getRandomColorForKey(props.operation.destination)
    const assetColor = props.getRandomColorForKey(props.operation.asset.code);
    const assetIssuanceAccountColor = props.getRandomColorForKey(props.operation.asset.issuer)

    const operationSourceAccount = props.operation.source
        ? props.operation.source
        : props.transactionSource
            ? props.transactionSource
            : 'no source'

    const operationSourceAccountColor = props.getRandomColorForKey(operationSourceAccount);

    return (
        <Card className={classes.bodyCard}>
            <CardContent>
                <DisplayField
                    label={'Type'}
                    value={'Payment'}
                />
                <DisplayField
                    label={'Source Account'}
                    value={operationSourceAccount}
                    valueTypographyProps={{style: {color: operationSourceAccountColor}}}
                />
                <DisplayField
                    label={'Destination Account'}
                    value={props.operation.destination}
                    valueTypographyProps={{style: {color: destinationAccountColor}}}
                />
                <DisplayField
                    label={'Amount'}
                    value={props.operation.amount}
                    valueTypographyProps={{style: {color: assetColor}}}
                />
                <Grid container>
                    <Grid item>
                        <Card>
                            <CardHeader
                                title={'Asset'}
                                titleTypographyProps={{variant: 'caption'}}
                            />
                            <CardContent>
                                <DisplayField
                                    label={'Code'}
                                    value={props.operation.asset.code}
                                    valueTypographyProps={{style: {color: assetColor}}}
                                />
                                <DisplayField
                                    label={'Issuer'}
                                    value={props.operation.asset.issuer}
                                    valueTypographyProps={{style: {color: assetIssuanceAccountColor}}}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
