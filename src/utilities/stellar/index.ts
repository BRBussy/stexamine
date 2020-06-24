import {Transaction, Operation, Server, AccountResponse} from 'stellar-sdk';

interface AccAuthReq {
    accountID: string;
    weight: number;
    signers: { key: string, type: string, weight: number }[]
}

export async function determineAccAuthReqForTxn(txn: Transaction, horizonURL: string): Promise<AccAuthReq[]> {
    const requiredAuthIdx: { [key: string]: AccAuthReq } = {};

    const stellarServer = new Server(horizonURL);

    try {
        const sourceAccountResp = await stellarServer.loadAccount(txn.source);
        requiredAuthIdx[sourceAccountResp.accountId()] = {
            accountID: sourceAccountResp.accountId(),
            weight: determineSignatureWeightOfOperationOnAccount(sourceAccountResp, 'bumpSequence'),
            signers: sourceAccountResp.signers
        }
    } catch (e) {
        console.error(`unable to retrieve transaction source account: ${e}`);
        throw new Error()
    }

    for (const op of txn.operations) {
        if (!op.source) {
            // if no source account then no auth required for this op
            continue;
        }

        // get the source account for operation
        let opSourceAcc: AccountResponse;
        try {
            opSourceAcc = await stellarServer.loadAccount(txn.source);
        } catch (e) {
            console.error(`unable to retrieve operation source account: ${e}`);
            throw new Error()
        }

        // determine signature weight of this operation
        const signatureWeightOfOp = determineSignatureWeightOfOperationOnAccount(opSourceAcc, op.type)

        // check if another operation on this account has already resulted in
        // a required authorisation being recorded for it
        const recordedAuth = requiredAuthIdx[op.source];
        const alreadyBeenRecorded = !!recordedAuth;

        if (!alreadyBeenRecorded || recordedAuth.weight < signatureWeightOfOp) {
            requiredAuthIdx[op.source] = {
                accountID: op.source,
                weight: signatureWeightOfOp,
                signers: opSourceAcc.signers
            }
        }
    }

    return Object.keys(requiredAuthIdx).map((key) => (requiredAuthIdx[key]));
}

export function determineSignatureWeightOfOperationOnAccount(account: AccountResponse, operationType: string): number {
    switch (operationType) {
        case 'bumpSequence':
        case 'allowTrust':
            return account.thresholds.low_threshold;

        case 'changeTrust':
        case 'createAccount':
        case 'createPassiveSellOffer':
        case 'inflation':
        case 'manageBuyOffer':
        case 'manageData':
        case 'manageSellOffer':
        case 'pathPaymentStrictSend':
        case 'pathPaymentStrictReceive':
        case 'payment':
            return account.thresholds.med_threshold;

        case 'setOptions':
        case 'accountMerge':
            return account.thresholds.high_threshold;
    }
    throw new Error('unable to determine signature weight of operation on account');
}
