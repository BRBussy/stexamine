import {Operation} from 'stellar-sdk';
import {Card, CardContent, CardHeader, Grid, makeStyles, Theme} from '@material-ui/core';
import {DisplayField} from 'components/Form';
import React from 'react';
import {AccountCard} from 'components/Stellar';

interface OperationCardProps {
    transactionSource?: string;
    operation: Operation;
    getRandomColorForKey: (key: string) => string;
    network: string;
}

export default function OperationCard(props: OperationCardProps) {
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

        case 'setOptions':
            return (
                <SetOptionsOperationCard
                    network={props.network}
                    transactionSource={props.transactionSource}
                    operation={props.operation as Operation.SetOptions}
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
            </CardContent>
            <CardContent>
                {/* Operation Source Account */}
                <AccountCard
                    label={'Source'}
                    accountID={operationSourceAccount}
                    horizonURL={props.network}
                    getRandomColorForKey={props.getRandomColorForKey}
                />

                <div style={{height: 8}}/>

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


const useSetOptionsOperationCardStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    },
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    signerLayout: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto auto'
    }
}));


interface SetOptionsOperationCardProps {
    transactionSource?: string;
    operation: Operation.SetOptions;
    network: string;
    getRandomColorForKey: (key: string) => string;
}

function SetOptionsOperationCard(props: SetOptionsOperationCardProps) {
    const classes = useSetOptionsOperationCardStyles();

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
                    value={'Set Options'}
                />
            </CardContent>
            <CardContent>
                {/* Operation Source Account */}
                <AccountCard
                    label={'Source'}
                    accountID={operationSourceAccount}
                    horizonURL={props.network}
                    getRandomColorForKey={props.getRandomColorForKey}
                />

                {props.operation.clearFlags &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.clearFlags.toString()}
                />}

                {props.operation.highThreshold &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.highThreshold.toString()}
                />}

                {props.operation.homeDomain &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.homeDomain.toString()}
                />}

                {props.operation.lowThreshold &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.lowThreshold.toString()}
                />}

                {props.operation.masterWeight &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.masterWeight.toString()}
                />}

                {props.operation.medThreshold &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.medThreshold.toString()}
                />}

                {props.operation.setFlags &&
                <DisplayField
                    label={'Clear Flags'}
                    value={props.operation.setFlags.toString()}
                />}

                {props.operation.signer &&
                <div className={classes.signerLayout}>
                    <DisplayField
                        label={'Signer Key'}
                        value={getSignerKey(props.operation.signer)}
                        valueTypographyProps={{style: {color: props.getRandomColorForKey(getSignerKey(props.operation.signer))}}}
                    />
                    <DisplayField
                        label={'Signer Weight'}
                        valueTypographyProps={{style: {color: props.getRandomColorForKey(getSignerKey(props.operation.signer))}}}
                        value={getSignerWeight(props.operation.signer)}
                    />
                </div>}

            </CardContent>
        </Card>
    )
}

function getSignerKey(signer: any): string {
    switch (true) {
        case !!signer.ed25519PublicKey:
            return signer.ed25519PublicKey
    }
    return 'could not find key'
}

function getSignerWeight(signer: any): string {
    return signer.weight ? signer.weight : 'could not find weight'
}
