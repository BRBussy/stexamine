import React, {useState} from 'react';
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
import {AccAuthReq, authRequirementMet} from 'utilities/stellar';
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
    }
}));

export default function AccAuthReqCard(props: Props) {
    const classes = useStyles();
    const [cardOpen, setCardOpen] = useState(false);
    const [potentialSignersOpen, setPotentialSignersOpen] = useState(false);
    const theme = useTheme();

    const authMet = authRequirementMet(props.accAuthReq, props.transaction);

    return (
        <Card className={classes.detailCard}>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.accountCardHeader}>
                        <DisplayField
                            label={'Signature Required For Account:'}
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
                            label={'Weight Required:'}
                            value={props.accAuthReq.weight.toString()}
                        />
                        {authMet.met
                            ? (
                                <Icon>
                                    <MetIcon/>
                                </Icon>
                            )
                            : (
                                <Icon>
                                    <NotMetIcon/>
                                </Icon>
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
                <CardContent>
                    <Card>
                        <CardHeader
                            disableTypography
                            title={
                                <div className={classes.potentialSignatoryCardHeader}>
                                    <Typography
                                        children={'Potential Signatories'}
                                        variant={'body1'}
                                    />
                                    <Tooltip
                                        title={potentialSignersOpen ? 'Hide Signatories' : 'Show Signatories'}
                                        placement={'top'}
                                    >
                                        <IconButton
                                            size={'small'}
                                            onClick={() => setPotentialSignersOpen(!potentialSignersOpen)}
                                        >
                                            {potentialSignersOpen
                                                ? <CloseCardBodyIcon/>
                                                : <OpenCardBodyIcon/>
                                            }
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            }
                        />
                        <Collapse in={potentialSignersOpen}>
                            {props.accAuthReq.signers.map((s, idx) => (
                                <CardContent key={idx}>
                                    <Grid container spacing={1} direction={'row'}>
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
                                    </Grid>
                                </CardContent>
                            ))}
                        </Collapse>
                    </Card>
                </CardContent>
            </Collapse>
        </Card>
    )
}
