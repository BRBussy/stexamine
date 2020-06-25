import React, {useLayoutEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    makeStyles,
    Theme,
    Tooltip,
    useTheme,
    Icon, Typography, Grid
} from '@material-ui/core';
import {
    ErrorOutlined as NotMetIcon,
    DoneOutlined as MetIcon
} from '@material-ui/icons';
import {DisplayField} from 'components/Form';
import {ExpandLess as CloseCardBodyIcon, ExpandMore as OpenCardBodyIcon} from '@material-ui/icons';
import {AccAuthReq, AuthMetResult, authRequirementMet} from 'utilities/stellar';
import {Transaction} from 'stellar-sdk'

interface Props {
    getRandomColorForKey?: (key: string) => string;
    accAuthReq: AccAuthReq;
    transaction: Transaction;
}

const useStyles = makeStyles((theme: Theme) => ({
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto 1fr',
        gridColumnGap: theme.spacing(1),
        justifyItems: 'end',
        alignItems: 'center'
    },
    detailCard: {
        backgroundColor: theme.palette.background.default
    },
    potentialSignatoryCardHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    authMetResultLayout: {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        alignItems: 'center',
        gridColumnGap: theme.spacing(1)
    },
    success: {
        color: theme.palette.success.main
    },
    error: {
        color: theme.palette.error.main
    }
}));

export default function AccAuthReqCard(props: Props) {
    const classes = useStyles();
    const [cardOpen, setCardOpen] = useState(false);
    const [authMetResult, setAuthMetResult] = useState<AuthMetResult>({
        met: false,
        signatures: []
    });
    const theme = useTheme();

    useLayoutEffect(() => {
        setAuthMetResult(authRequirementMet(props.accAuthReq, props.transaction));
    }, [props.accAuthReq, props.transaction])

    return (
        <Card className={classes.detailCard}>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.accountCardHeader}>
                        <DisplayField
                            label={'Signatures are required for the account with Key:'}
                            value={props.accAuthReq.accountID}
                            valueTypographyProps={{
                                style: {
                                    color: props.getRandomColorForKey
                                        ? props.getRandomColorForKey(props.accAuthReq.accountID)
                                        : theme.palette.text.primary
                                }
                            }}
                        />
                        <DisplayField
                            label={'They must have a cumulative weight of:'}
                            value={props.accAuthReq.weight.toString()}
                        />
                        {authMetResult.met
                            ? (
                                <div className={classes.authMetResultLayout}>
                                    <Icon className={classes.success}>
                                        <MetIcon/>
                                    </Icon>
                                    <Typography
                                        children={'Requirement Met'}
                                        className={classes.success}
                                    />
                                </div>
                            )
                            : (
                                <div className={classes.authMetResultLayout}>
                                    <Icon>
                                        <NotMetIcon className={classes.error}/>
                                    </Icon>
                                    <Typography
                                        children={'Not Met'}
                                        className={classes.success}
                                    />
                                </div>
                            )
                        }
                        <Tooltip
                            title={cardOpen ? 'Show Less' : 'Show More'}
                            placement={'top'}
                        >
                            <IconButton
                                size={'small'}
                                onClick={() => setCardOpen(!cardOpen)}
                            >
                                {cardOpen
                                    ? <CloseCardBodyIcon/>
                                    : <OpenCardBodyIcon/>
                                }
                            </IconButton>
                        </Tooltip>
                    </div>
                }
            />
            <Collapse in={cardOpen}>
                <React.Fragment>
                    {props.accAuthReq.signers.map((s, idx) => {
                        const signatureByThisSigner = authMetResult.signatures.find((sig) => (sig.signedBy === s.key));

                        return (
                            <CardContent key={idx}>
                                <Grid container spacing={1} direction={'row'} alignItems={'center'}>
                                    <Grid item>
                                        <DisplayField
                                            label={'Public Key'}
                                            value={s.key}
                                            valueTypographyProps={{
                                                style: {
                                                    color: props.getRandomColorForKey
                                                        ? props.getRandomColorForKey(s.key)
                                                        : theme.palette.text.primary
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <DisplayField
                                            label={'Weight'}
                                            value={s.weight.toString()}
                                        />
                                    </Grid>
                                    {!!signatureByThisSigner &&
                                    <Grid item>
                                        <div className={classes.authMetResultLayout}>
                                            <Icon className={classes.success}>
                                                <MetIcon/>
                                            </Icon>
                                            <Typography
                                                children={'Contributed Signature'}
                                                className={classes.success}
                                            />
                                        </div>
                                    </Grid>}
                                </Grid>
                            </CardContent>
                        )
                    })}
                </React.Fragment>
            </Collapse>
        </Card>
    )
}
