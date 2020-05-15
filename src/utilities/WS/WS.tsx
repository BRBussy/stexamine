import {useEffect, useState} from 'react';

export enum WSState {
    disconnected = 'disconnected',
    connecting = 'connecting',
    connected = 'connected',
    error = 'error'
}

interface WSProps {
    url: string,
    onOpen?: () => void;
    onClose?: () => void;
    onError?: () => void;
    onMessage?: (msg: string) => void;
}

interface WSOpts {
    reconnect: boolean
}

export default function useWS(
    {
        url,
        onOpen,
        onClose,
        onError,
        onMessage
    }: WSProps,
    {reconnect}: WSOpts = {
        reconnect: true
    }
) {
    const [state, setState] = useState<WSState>(WSState.disconnected);
    const [ws, setWS] = useState<WebSocket | undefined>(undefined);

    // on first load and on reconnect
    useEffect(() => {
        setState(WSState.connecting);
        try {
            setWS(new WebSocket(url))
        } catch (e) {
            console.error(`error starting web socket: ${e}`)
            setState(WSState.error);
        }
    }, [url, reconnect])

    // post creation of websocket
    useEffect(() => {
        if (ws) {
            ws.onopen = (e: Event) => {
                // console.debug('web socket opened', e)
                setState(WSState.connected);
                if (onOpen) {
                    onOpen();
                }
            };
            ws.onmessage = (e: MessageEvent) => {
                // console.debug('web socket message', e)
                if (onMessage) {
                    onMessage(e.data);
                }
            };
            ws.onclose = (e: Event) => {
                // console.debug('web socket closed', e)
                setState(WSState.disconnected);
                if (onClose) {
                    onClose();
                }
            };
            ws.onerror = (e: Event) => {
                console.error('web socket error', e);
                setState(WSState.error);
                if (onError) {
                    onError();
                }
            };
        } else {
            setState(WSState.disconnected);
        }
    }, [ws, onMessage, onOpen, onClose, onError]);

    // function to manually close websocket
    const closeWS = () => {
        if (!ws) {
            return;
        }
        try {
            ws.close(1000, 'manual');
        } catch (e) {
            console.error(`error closing web socket: ${e}`);
        }
    }

    return {
        state,
        closeWS
    }
}