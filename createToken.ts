import { getKeypairFromEnvironment } from "@solana-developers/helpers";

import {
  createAssociatedTokenAccount,
  createMint,
  mintTo,
} from "@solana/spl-token";

import { Connection, clusterApiUrl } from "@solana/web3.js";

import "dotenv/config";

const ownerKeypair = getKeypairFromEnvironment("KEY1");

const conn = new Connection(clusterApiUrl("devnet"), "confirmed");

const tokenMintAddress = await createMint(
  conn,
  ownerKeypair,
  ownerKeypair.publicKey,
  ownerKeypair.publicKey,
  6
);

console.log(tokenMintAddress.toString());

const destinationAccount = await createAssociatedTokenAccount(
  conn,
  ownerKeypair,
  tokenMintAddress,
  ownerKeypair.publicKey
);

console.log(destinationAccount);

const mintSignature = await mintTo(
  conn,
  ownerKeypair,
  tokenMintAddress,
  destinationAccount,
  ownerKeypair,
  10000000000000000000
);

console.log(mintSignature);
