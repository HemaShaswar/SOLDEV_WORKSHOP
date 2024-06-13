import {
  airdropIfRequired,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import "dotenv/config";

const sender = getKeypairFromEnvironment("KEY1");
const recipient = getKeypairFromEnvironment("KEY2");

console.log("Sender: " + sender.publicKey.toBase58());
console.log("Recipient: " + recipient.publicKey.toBase58());

const conn = new Connection("https://api.devnet.solana.com", "confirmed");

const senderBalance = await conn.getBalance(sender.publicKey);

const senderBalanceInSol = senderBalance / LAMPORTS_PER_SOL;

console.log("Sender balance initially is " + senderBalanceInSol);

if (senderBalanceInSol >= 0.5) {
  await airdropIfRequired(
    conn,
    sender.publicKey,
    0.5 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
  );

  const tx = new Transaction();

  const sendSolIx = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL,
  });

  tx.add(sendSolIx);

  const signature = await sendAndConfirmTransaction(conn, tx, [sender]);

  const senderBalanceAfter = await conn.getBalance(sender.publicKey);

  console.log(
    "Sender balance after transfer is " + senderBalanceAfter / LAMPORTS_PER_SOL
  );

  console.log("Tx signature: " + signature);
}
