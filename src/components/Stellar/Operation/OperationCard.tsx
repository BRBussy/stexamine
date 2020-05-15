import {Operation} from "stellar-sdk";
import {Card, CardContent, CardHeader, Grid, makeStyles, Theme} from "@material-ui/core";
import {DisplayField} from "components/Form";
import React from "react";
import {useRandomColorContext} from "context/RandomColor";

interface OperationCardProps {
    transactionSource?: string;
    operation: Operation;
}


const useOperationCardStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    }
}));

export default function OperationCard(props: OperationCardProps) {
    const classes = useOperationCardStyles()
    const {getRandomColor} = useRandomColorContext();

    const operationSourceAccount = props.operation.source
        ? props.operation.source
        : props.transactionSource
            ? props.transactionSource
            : 'no source'

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
                            value={operationSourceAccount}
                            valueTypographyProps={{style: {color: getRandomColor(operationSourceAccount)}}}
                        />
                        <DisplayField
                            label={'Destination'}
                            value={paymentOperation.destination}
                            valueTypographyProps={{style: {color: getRandomColor(paymentOperation.destination)}}}
                        />
                        <DisplayField
                            label={'Amount'}
                            value={paymentOperation.amount}
                            valueTypographyProps={{style: {color: getRandomColor(paymentOperation.asset.code)}}}
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
                                            valueTypographyProps={{style: {color: getRandomColor(paymentOperation.asset.code)}}}
                                        />
                                        <DisplayField
                                            label={'Issuer'}
                                            value={paymentOperation.asset.issuer}
                                            valueTypographyProps={{style: {color: getRandomColor(paymentOperation.asset.issuer)}}}
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