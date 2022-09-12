import { options } from "@dsnp/frequency-api-augment";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { ExtrinsicStatus } from "@polkadot/types/interfaces/author/types";
import { EventRecord } from "@polkadot/types/interfaces/system/types";

/**
 * DsnpCallback represents a type for publication callback function
 */
 export type DsnpCallback = (
    status: ExtrinsicStatus,
    events: EventRecord[]
  ) => void;
  
  /**
   * DsnpErrorCallback represents a type for publication callback function
   */
  export type DsnpErrorCallback = (error: any) => void;

  // SCHEMA_CHAIN_HOST (environment variable)
// The value is a URL for the chain.  e.g. ws://localhost:9944 
const ChainURL = process.env.DEPLOY_SCHEMAS_CHAIN_HOST;
//const ChainURL = "ws://localhost:9944";

const DefaultWsProvider = new WsProvider(ChainURL);

  export async function requireGetProviderApi(): Promise<ApiPromise> {
    const api = await ApiPromise.create({
      provider: DefaultWsProvider,
      ...options
    });
    return api;
  }

  export const requireGetServiceKeys = (): KeyringPair => {
    const keyring = new Keyring();
  
    return keyring.addFromUri("//Alice", { name: "Alice default" }, "sr25519");
  };
  