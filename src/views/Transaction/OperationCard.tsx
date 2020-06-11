import {Operation, Server, AccountResponse} from 'stellar-sdk';
import {Card, CardContent, CardHeader, Collapse, Grid, IconButton, makeStyles, Theme, Tooltip} from '@material-ui/core';
import {DisplayField} from 'components/Form';
import React, {useEffect, useState} from 'react';
import {
    ExpandMore as OpenCardBodyIcon,
    ExpandLess as CloseCardBodyIcon,
} from '@material-ui/icons';
import {AccountCard} from "../../components/Stellar";

interface OperationCardProps {
    transactionSource?: string;
    operation: Operation;
    getRandomColorForKey: (key: string) => string;
    network: string;
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
                    network={props.network}
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
    network: string;
    getRandomColorForKey: (key: string) => string;
}

const usePaymentOperationCardStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    },
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    }
}));

function PaymentOperationCard(props: PaymentOperationCardProps) {
    const classes = usePaymentOperationCardStyles();

    const assetColor = props.getRandomColorForKey(props.operation.asset.code);
    const assetIssuanceAccountColor = props.getRandomColorForKey(props.operation.asset.issuer)

    const operationSourceAccount = props.operation.source
        ? props.operation.source
        : props.transactionSource
            ? props.transactionSource
            : 'no source'

    return (
        <Card className={classes.bodyCard}>
            <CardContent>
                <DisplayField
                    label={'Type'}
                    value={'Payment'}
                />

                {/* Operation Source Account */}
                <AccountCard
                    label={'Source'}
                    accountID={operationSourceAccount}
                    horizonURL={props.network}
                    getRandomColorForKey={props.getRandomColorForKey}
                />

                {/* Operation Destination Account */}
                <AccountCard
                    label={'Destination'}
                    accountID={props.operation.destination}
                    horizonURL={props.network}
                    getRandomColorForKey={props.getRandomColorForKey}
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
