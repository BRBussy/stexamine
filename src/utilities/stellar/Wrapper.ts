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
    unverified = 'Unverified',
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

    async analyseTransactionSignatures(tx: Transaction): Promise<{ publicKey: string, result: SignatureAnalysisResult }[]> {
        const results: { publicKey: string, result: SignatureAnalysisResult }[] = []
        const signers: ServerApi.AccountRecordSigners[] = [];

        // get all potential signers on transaction source account
        if (tx.source) {
            try {
                signers.push(...(await this.getAccountSigners(tx.source)))
            } catch (e) {
                console.error(`error getting txn source account signatories: ${e}`);
            }
        }

        // get all potential signers across all operation source accounts
        await Promise.all(
            tx.operations.map(async (op) => {
                if (op.source) {
                    try {
                        signers.push(...(await this.getAccountSigners(op.source)))
                    } catch (e) {
                        console.error(`error getting txn source account signatories: ${e}`);
                    }
                }
            })
        )

        return results
    }
}