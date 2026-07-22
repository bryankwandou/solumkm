// bs58 v4 ships no type declarations; web3.js pulls it in transitively.
declare module "bs58" {
  const bs58: {
    encode(source: Uint8Array | number[]): string;
    decode(str: string): Uint8Array;
  };
  export default bs58;
}
