import {
    Transaction, Server, AccountResponse,
    Keypair, xdr, Signer, Account, ServerApi
} from 'stellar-sdk';
import {isEqual} from 'lodash';

export enum StellarHorizonURL {
    Test = 'https://horizon-testnet.stellar.org'
}

export enum SignatureAnalysisResult {
    verified = 'Verified',
    unknown = 'Unknown'
}

export class Wrapper {
    public networkPassphrase: string = '';
    public server: Server = new Server(StellarHorizonURL.Test);

    constructor(stellarHorizonURL: StellarHorizonURL) {
        if (stellarHorizonURL !== StellarHorizonURL.Test) {
            this.server = new Server(stellarHorizonURL)
        }
    }

    async loadAccount(accountAddress: string): Promise<AccountResponse> {
        try {
            return await this.server.loadAccount(accountAddress)
        } catch (e) {
            console.error(`error loading account: ${e}`)
            throw new Error(`error loading account: ${e}`)
        }
    }

    async getAccountSigners(accountAddress: string): Promise<ServerApi.AccountRecordSigners[]> {
        try {
            return (await this.server.loadAccount(accountAddress)).signers;
        } catch (e) {
            console.error(`error getting account signatories: ${e}`)
            throw new Error(`error getting account signatories: ${e}`)
        }
    }

    async analyseFeeBumpTransactionSignatures() {

    }

    async analyseTransactionSignatures(tx: Transaction): Promise<{
        signature: string,
        publicKey: string,
        result: SignatureAnalysisResult
    }[]> {
        const results: {
            signature: string,
            publicKey: string,
            result: SignatureAnalysisResult
        }[] = []
        const signers: ServerApi.AccountRecordSigners[] = [];

        // get all potential signers on transaction source account
        if (tx.source) {
            try {
                signers.push(...(await this.getAccountSigners(tx.source)).filter((signerForThisAccount) => !(
                        signers.find(
                            (existingSigner) => (isEqual(existingSigner, signerForThisAccount))
                        )
                    )
                ))
            } catch (e) {
                console.error(`error getting txn source account signatories: ${e}`);
            }
        }

        // get all potential signers across all operation source accounts
        await Promise.all(
            tx.operations.map(async (op) => {
                if (op.source) {
                    try {
                        signers.push(...(await this.getAccountSigners(op.source)).filter((signerForThisAccount) => !(
                                signers.find(
                                    (existingSigner) => (isEqual(existingSigner, signerForThisAccount))
                                )
                            )
                        ))
                    } catch (e) {
                        console.error(`error getting txn source account signatories: ${e}`);
                    }
                }
            })
        )

        const txnData = tx.hash();
        // for every signature...
        nextSignature:
            for (const sig of tx.signatures) {
                // try and verify with each potential signer...
                for (const potentialSigner of signers) {
                    try {
                        if (signedBySigner(potentialSigner, txnData, sig.signature())) {
                            // if it can be verified this signature is accounted for
                            results.push({
                                signature: sig.toXDR('base64'),
                                publicKey: potentialSigner.key,
                                result: SignatureAnalysisResult.verified
                            })
                            continue nextSignature;
                        }
                    } catch (e) {
                        console.error(`error verifying: ${e}`)
                        throw new Error(`error verifying: ${e}`)
                    }
                }
                // if execution reaches here then the signature could not be verified
                results.push({
                    signature: sig.toXDR('base64'),
                    publicKey: '---',
                    result: SignatureAnalysisResult.verified
                })
            }

        return results
    }
}

export function signedBySigner(signer: ServerApi.AccountRecordSigners, data: Buffer, signature: Buffer): boolean {
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