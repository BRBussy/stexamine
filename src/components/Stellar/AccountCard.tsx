import {AccountResponse, Server} from 'stellar-sdk';
import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    makeStyles,
    Theme,
    Tooltip,
    useTheme
} from '@material-ui/core';
import {DisplayField} from 'components/Form';
import {ExpandLess as CloseCardBodyIcon, ExpandMore as OpenCardBodyIcon} from '@material-ui/icons';

interface Props {
    accountID: string;
    horizonURL: string;
    getRandomColorForKey?: (key: string) => string;
    label?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    bodyCard: {
        backgroundColor: theme.palette.background.default
    },
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    }
}));

export default function AccountCard(props: Props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [accountResponse, setAccountResponse] = useState<AccountResponse | undefined>(undefined)
    const [cardOpen, setCardOpen] = useState(false);
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
        <Card>
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
                    account stuff
                </CardContent>
            </Collapse>
        </Card>
    )
}
