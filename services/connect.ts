import { options } from "@dsnp/frequency-api-augment";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { ExtrinsicStatus } from "@polkadot/types/interfaces/author/types";
import { EventRecord } from "@polkadot/types/interfaces/system/types";

/**
 * DsnpCallback represents a type for publication callback function
 */
export type DsnpCallback = (status: ExtrinsicStatus, events: EventRecord[]) => void;

/**
 * DsnpErrorCallback represents a type for publication callback function
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DsnpErrorCallback = (error: any) => void;

// DEPLOY_SCHEMA_ENDPOINT_URL (environment variable)
// The value is a URL for the RPC endpoint.  e.g. ws://localhost:9944
export async function getFrequencyAPI(): Promise<ApiPromise> {
  let DEPLOY_SCHEMA_ENDPOINT_URL = process.env.DEPLOY_SCHEMA_ENDPOINT_URL;
  if (DEPLOY_SCHEMA_ENDPOINT_URL === undefined) {
    // One would think that localhost would also work here but it doesn't consistently.
    DEPLOY_SCHEMA_ENDPOINT_URL = "ws://127.0.0.1:9944";
  }
  const DefaultWsProvider = new WsProvider(DEPLOY_SCHEMA_ENDPOINT_URL);

  const api = await ApiPromise.create({
    provider: DefaultWsProvider,
    ...options,
  });
  await api.isReady;
  return api;
}

// DEPLOY_SCHEMA_ACCOUNT_URI (environment variable)
// The value is a URI for the account.  e.g. //Alice or a mnemonic (seed words)
export const getSignerAccountKeys = (): KeyringPair => {
  const keyring = new Keyring();

  let DEPLOY_SCHEMA_ACCOUNT_URI = process.env.DEPLOY_SCHEMA_ACCOUNT_URI;
  if (DEPLOY_SCHEMA_ACCOUNT_URI === undefined) {
    DEPLOY_SCHEMA_ACCOUNT_URI = "//Alice";
  }
  return keyring.addFromUri(DEPLOY_SCHEMA_ACCOUNT_URI, {}, "sr25519");
};
