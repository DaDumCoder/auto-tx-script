import 'dotenv/config';
// ── quick debug dump ─────────────────────────
console.log('ENV DUMP ↓');
console.log('RPC_URL        =', process.env.RPC_URL);
console.log('TOKEN_ADDRESS  =', process.env.TOKEN_ADDRESS);
console.log('TOKEN_DECIMALS =', process.env.TOKEN_DECIMALS);
console.log('VALUE_TOKENS   =', process.env.VALUE_TOKENS);
console.log('TO_ADDRESS     =', process.env.TO_ADDRESS);
console.log('ENV DUMP ↑\n');
// ─────────────────────────────────────────────

import { JsonRpcProvider, Wallet, parseUnits, Contract } from 'ethers';

// ── CONFIG ────────────────────────────────────────────
const provider        = new JsonRpcProvider(process.env.RPC_URL);
const TOKEN_ADDRESS   = process.env.TOKEN_ADDRESS;
const TOKEN_DECIMALS  = Number(process.env.TOKEN_DECIMALS || 18);
const TO              = process.env.TO_ADDRESS;
const AMOUNT          = parseUnits(process.env.VALUE_TOKENS, TOKEN_DECIMALS);

// ── LOAD WALLETS FROM SECRETS/VARIABLES ───────────────
const privKeys = JSON.parse(process.env.WALLET_KEYS_JSON);
if (!privKeys.length) throw new Error('No private keys loaded');

// (If you also stored addresses separately)
// const addresses = JSON.parse(process.env.WALLET_ADDR_JSON);

// ── ERC-20 CONTRACT ───────────────────────────────────
const token = new Contract(
  TOKEN_ADDRESS,
  ['function transfer(address to,uint256 amt) returns (bool)'],
  provider
);

// ── SEND FROM RANDOM WALLET ───────────────────────────
async function sendRandom() {
  const pk = privKeys[Math.floor(Math.random() * privKeys.length)];
  const w  = new Wallet(pk, provider);

  try {
    const tx = await token.connect(w).transfer(TO, AMOUNT);
    console.log(`tx from ${w.address.slice(0,6)}… → ${tx.hash}`);
  } catch (err) {
    console.error(`wallet ${w.address.slice(0,6)}… failed:`,
                  err.shortMessage || err);
  }
}

sendRandom();
