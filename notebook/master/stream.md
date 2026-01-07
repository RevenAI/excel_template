
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const { zlib } = require('node:zlib');

async function runPipeline() {
  try {
    await pipeline(
      fs.createReadStream('input.txt'),
      zlib.createGzip(), // Optional: compress data on the fly
      fs.createWriteStream('input.txt.gz')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}

runPipeline();
