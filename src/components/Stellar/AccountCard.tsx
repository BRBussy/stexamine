import {AccountResponse, Server} from 'stellar-sdk';
import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Collapse, Grid,
    IconButton,
    makeStyles,
    Theme,
    Tooltip, Typography,
    useTheme
} from '@material-ui/core';
import {DisplayField} from 'components/Form';
import {ExpandLess as CloseCardBodyIcon, ExpandMore as OpenCardBodyIcon} from '@material-ui/icons';
import cx from 'classnames';

interface Props {
    accountID: string;
    horizonURL: string;
    getRandomColorForKey?: (key: string) => string;
    label?: string;
    invertColors?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    detailCard: {
        backgroundColor: theme.palette.background.default
    }
}));

export default function AccountCard(props: Props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [accountResponse, setAccountResponse] = useState<AccountResponse | undefined>(undefined)
    const [cardOpen, setCardOpen] = useState(false);
    const [balancesOpen, setBalancesOpen] = useState(false);
    const [signatoriesOpen, setSignatoriesOpen] = useState(false);
    const theme = useTheme();

    const color = props.getRandomColorForKey
        ? props.getRandomColorForKey(props.accountID)
        : theme.palette.text.primary

    useEffect(() => {
        (async () => {
            const stellarServer = new Server(props.horizonURL);
            setLoading(true);
            try {
                setAccountResponse(await stellarServer.loadAccount(props.accountID))
            } catch (e) {
                console.error(`unable to get account from stellar: ${e}`);
            }
            setLoading(false);
        })()
    }, [props.accountID, props.horizonURL])

    return (
        <Card className={cx({[classes.detailCard]: !!props.invertColors})}>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.accountCardHeader}>
                        <DisplayField
                            label={props.label ? `${props.label} Account` : 'Account'}
                            value={props.accountID}
                            valueTypographyProps={{style: {color}}}
                        />
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
                    {(() => {
                        if (loading) {
                            return (
                                <div>loading...</div>
                            )
                        }

                        if (accountResponse) {
                            return (
                                <Grid container spacing={1} direction={'column'}>
                                    {/* Balances */}
                                    <Grid item>
                                        <Card className={cx({[classes.detailCard]: !props.invertColors})}>
                                            <CardHeader
                                                disableTypography
                                                title={
                                                    <div className={classes.accountCardHeader}>
                                                        <Typography
                                                            children={'Balances'}
                                                        />
                                                        <Tooltip
                                                            title={balancesOpen ? 'Hide Balances' : 'Show Balances'}
                                                            placement={'top'}
                                                        >
                                                            <IconButton
                                                                size={'small'}
                                                                onClick={() => setBalancesOpen(!balancesOpen)}
                                                            >
                                                                {balancesOpen
                                                                    ? <CloseCardBodyIcon/>
                                                                    : <OpenCardBodyIcon/>
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            />
                                            <Collapse in={balancesOpen}>
                                                <CardContent>
                                                    {accountResponse.balances.map((b, idx) => {
                                                        switch (b.asset_type) {
                                                            case 'native':
                                                                return (
                                                                    <DisplayField
                                                                        key={idx}
                                                                        label={'XLM'}
                                                                        labelTypographyProps={{
                                                                            style: {
                                                                                color: props.getRandomColorForKey
                                                                                    ? props.getRandomColorForKey('XLM')
                                                                                    : theme.palette.text.primary
                                                                            }
                                                                        }}
                                                                        valueTypographyProps={{
                                                                            style: {
                                                                                color: props.getRandomColorForKey
                                                                                    ? props.getRandomColorForKey('XLM')
                                                                                    : theme.palette.text.primary
                                                                            }
                                                                        }}
                                                                        value={b.balance}
                                                                    />
                                                                )

                                                            default:
                                                                const otherBalance = b as any as {
                                                                    balance: string,
                                                                    asset_code: string,
                                                                    asset_issuer: string
                                                                }
                                                                return (
                                                                    <DisplayField
                                                                        key={idx}
                                                                        label={`${otherBalance.asset_code} - [ ${otherBalance.asset_issuer} ]`}
                                                                        value={otherBalance.balance}
                                                                        labelTypographyProps={{
                                                                            style: {
                                                                                color: props.getRandomColorForKey
                                                                                    ? props.getRandomColorForKey(otherBalance.asset_code)
                                                                                    : theme.palette.text.primary
                                                                            }
                                                                        }}
                                                                        valueTypographyProps={{
                                                                            style: {
                                                                                color: props.getRandomColorForKey
                                                                                    ? props.getRandomColorForKey(otherBalance.asset_code)
                                                                                    : theme.palette.text.primary
                                                                            }
                                                                        }}
                                                                    />
                                                                )
                                                        }
                                                    })}
                                                </CardContent>
                                            </Collapse>
                                        </Card>
                                    </Grid>

                                    {/* Signatories */}
                                    <Grid item>
                                        <Card className={cx({[classes.detailCard]: !props.invertColors})}>
                                            <CardHeader
                                                disableTypography
                                                title={
                                                    <div className={classes.accountCardHeader}>
                                                        <Typography
                                                            children={'Signatories'}
                                                        />
                                                        <Tooltip
                                                            title={signatoriesOpen ? 'Hide Signatories' : 'Show Signatories'}
                                                            placement={'top'}
                                                        >
                                                            <IconButton
                                                                size={'small'}
                                                                onClick={() => setSignatoriesOpen(!signatoriesOpen)}
                                                            >
                                                                {signatoriesOpen
                                                                    ? <CloseCardBodyIcon/>
                                                                    : <OpenCardBodyIcon/>
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            />
                                            <Collapse in={signatoriesOpen}>
                                                {accountResponse.signers.map((s, idx) => (
                                                    <CardContent key={idx}>
                                                        <DisplayField
                                                            label={'Public Key'}
                                                            labelTypographyProps={{
                                                                style: {
                                                                    color: props.getRandomColorForKey
                                                                        ? props.getRandomColorForKey(s.key)
                                                                        : theme.palette.text.primary
                                                                }
                                                            }}
                                                            valueTypographyProps={{
                                                                style: {
                                                                    color: props.getRandomColorForKey
                                                                        ? props.getRandomColorForKey(s.key)
                                                                        : theme.palette.text.primary
                                                                }
                                                            }}
                                                            value={s.key}
                                                        />
                                                        <DisplayField
                                                            label={'Weight'}
                                                            labelTypographyProps={{
                                                                style: {
                                                                    color: props.getRandomColorForKey
                                                                        ? props.getRandomColorForKey(s.key)
                                                                        : theme.palette.text.primary
                                                                }
                                                            }}
                                                            valueTypographyProps={{
                                                                style: {
                                                                    color: props.getRandomColorForKey
                                                                        ? props.getRandomColorForKey(s.key)
                                                                        : theme.palette.text.primary
                                                                }
                                                            }}
                                                            value={s.weight.toString()}
                                                        />
                                                    </CardContent>
                                                ))}
                                            </Collapse>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )
                        }

                        return (
                            <div>error</div>
                        )
                    })()}
                </CardContent>
            </Collapse>
        </Card>
    )
}
