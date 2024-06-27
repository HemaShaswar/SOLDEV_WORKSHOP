import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as token from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import "dotenv/config";

const senderKeypair = getKeypairFromEnvironment("KEY1");
const recipientKeypair = getKeypairFromEnvironment("KEY2");

console.log(senderKeypair.publicKey.toString());
console.log(recipientKeypair.publicKey.toString());

const mintString = process.env.MINT;

if (!mintString) {
  throw new Error("Failed to retrieve mint string from environment");
}

const mintAddress = new PublicKey(mintString);

console.log(mintAddress.toString());

const conn = new Connection(clusterApiUrl("devnet"), "confirmed");

const senderTokenAccount = await token.getOrCreateAssociatedTokenAccount(
  conn,
  senderKeypair,
  mintAddress,
  senderKeypair.publicKey
);

console.log(senderTokenAccount.address.toString());

const recipientTokenAccount = await token.getOrCreateAssociatedTokenAccount(
  conn,
  recipientKeypair,
  mintAddress,
  recipientKeypair.publicKey
);

console.log(recipientTokenAccount.address.toString());

const transferSignature = await token.transfer(
  conn,
  senderKeypair,
  senderTokenAccount.address,
  recipientTokenAccount.address,
  senderKeypair,
  10000000000
);

console.log(transferSignature);
