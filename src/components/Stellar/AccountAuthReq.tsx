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
    useTheme
} from '@material-ui/core';
import {DisplayField} from 'components/Form';
import {ExpandLess as CloseCardBodyIcon, ExpandMore as OpenCardBodyIcon} from '@material-ui/icons';
import {AccAuthReq} from 'utilities/stellar';

interface Props {
    getRandomColorForKey?: (key: string) => string;
    accAuthReq: AccAuthReq;
}

const useStyles = makeStyles((theme: Theme) => ({
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
        justifyItems: 'end',
        alignItems: 'center'
    },
    detailCard: {
        backgroundColor: theme.palette.background.default
    }
}));

export default function AccAuthReqCard(props: Props) {
    const classes = useStyles();
    const [cardOpen, setCardOpen] = useState(false);
    const theme = useTheme();

    return (
        <Card className={classes.detailCard}>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.accountCardHeader}>
                        <DisplayField
                            label={'For Account'}
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
                            label={'Weight'}
                            value={props.accAuthReq.weight.toString()}
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
                    asdf
                </CardContent>
            </Collapse>
        </Card>
    )
}
