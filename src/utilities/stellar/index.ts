import {Transaction, Server, AccountResponse, Keypair, xdr} from 'stellar-sdk';

export interface AccAuthReq {
    accountID: string;
    weight: number;
    signers: Signer[]
}

export interface Signer {
    key: string;
    type: string;
    weight: number;
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
            opSourceAcc = await stellarServer.loadAccount(op.source);
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

export function signedBySigner(signer: Signer, data: Buffer, signature: Buffer): boolean {
    // parse key pair
    let kp: Keypair;
    try {
        kp = Keypair.fromPublicKey(signer.key);
    } catch (e) {
        console.error(`unable to parse keypair: ${e}`);
        throw new Error();
    }

    // perform verification
    try {
        return kp.verify(data, signature)
    } catch (e) {
        console.error(`error verifying signature: ${e}`);
        throw new Error();
    }
}

export interface AuthMetResult {
    met: boolean;
    signatures: { signature: xdr.DecoratedSignature, signedBy: string }[];
}

/**
 * Given an account authorisation requirement and a transaction
 * determines if the given requirement is met
 * @param {AccAuthReq} accAuthReq
 * @param {Transaction} txn
 */
export function authRequirementMet(accAuthReq: AccAuthReq, txn: Transaction): AuthMetResult {
    const signatures = txn.signatures;
    const data = txn.hash();

    let outstandingSignatureWeight = accAuthReq.weight;
    const signaturesContributing: { signature: xdr.DecoratedSignature, signedBy: string }[] = [];
    try {
        // for every signature on transaction...
        for (const sig of signatures) {
            // check every signer authorised to meet this requirement...
            for (const authSigner of accAuthReq.signers) {
                // if this signer is responsible for this signature...
                if (signedBySigner(authSigner, data, sig.signature())) {
                    // then this signature is contributing
                    // to this authorisation requirement
                    signaturesContributing.push({
                        signature: sig,
                        signedBy: authSigner.key
                    })
                    outstandingSignatureWeight -= authSigner.weight;
                }
            }
        }
    } catch (e) {
        console.error(`unable to determine if auth requirement met`)
    }

    return {
        met: outstandingSignatureWeight <= 0 && !!signaturesContributing.length,
        signatures: signaturesContributing
    };
}