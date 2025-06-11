require('dotenv').config();
const { ethers } = require('ethers');

const provider   = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet     = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const to         = process.env.TO_ADDRESS;
const valueWei   = ethers.parseEther(process.env.VALUE_ETH);

let txCount = 0;
const delayMs = 10_000;        // send every 10 s; tweak as you like
let running = true;

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('\nStopping bot…');
  running = false;
});

async function sendLoop() {
  while (running) {
    try {
      const tx = await wallet.sendTransaction({ to, value: valueWei });
      console.log(`#${++txCount}  tx sent → ${tx.hash}`);
    } catch (err) {
      console.error('Tx failed:', err.reason || err);
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
}

sendLoop();
