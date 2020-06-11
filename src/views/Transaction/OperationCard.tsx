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
            const paymentOperation = props.operation as Operation.Payment;
            const destinationAccountColor = props.getRandomColorForKey(paymentOperation.destination)
            const assetColor = props.getRandomColorForKey(paymentOperation.asset.code);
            const assetIssuanceAccountColor = props.getRandomColorForKey(paymentOperation.asset.issuer)

            return (
                <Card className={classes.bodyCard}>
                    <CardContent>
                        <DisplayField
                            label={'Type'}
                            value={props.operation.type}
                        />
                        <DisplayField
                            label={'Source Account'}
                            value={operationSourceAccount}
                            valueTypographyProps={{style: {color: operationSourceAccountColor}}}
                        />
                        <DisplayField
                            label={'Destination Account'}
                            value={paymentOperation.destination}
                            valueTypographyProps={{style: {color: destinationAccountColor}}}
                        />
                        <DisplayField
                            label={'Amount'}
                            value={paymentOperation.amount}
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
                                            value={paymentOperation.asset.code}
                                            valueTypographyProps={{style: {color: assetColor}}}
                                        />
                                        <DisplayField
                                            label={'Issuer'}
                                            value={paymentOperation.asset.issuer}
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
