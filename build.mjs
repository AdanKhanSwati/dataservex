import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const chunks = fs.readdirSync('.').filter(f => /^payload\.\d+$/.test(f)).sort();
const b64 = chunks.map(f => fs.readFileSync(f, 'utf8').trim()).join('');
const zip = Buffer.from(b64, 'base64');
fs.rmSync('public', { recursive: true, force: true });
fs.mkdirSync('public', { recursive: true });
let p = 0, count = 0;
while (p + 30 <= zip.length && zip.readUInt32LE(p) === 0x04034b50) {
  const flags = zip.readUInt16LE(p + 6);
  const method = zip.readUInt16LE(p + 8);
  const compSize = zip.readUInt32LE(p + 18);
  const nameLen = zip.readUInt16LE(p + 26);
  const extraLen = zip.readUInt16LE(p + 28);
  if (flags & 0x08) throw new Error('Unsupported ZIP data descriptor');
  const name = zip.subarray(p + 30, p + 30 + nameLen).toString('utf8');
  const dataStart = p + 30 + nameLen + extraLen;
  const compressed = zip.subarray(dataStart, dataStart + compSize);
  const data = method === 0 ? compressed : method === 8 ? zlib.inflateRawSync(compressed) : (() => { throw new Error(`Unsupported ZIP method ${method}`); })();
  const dest = path.join('public', name);
  if (name.endsWith('/')) fs.mkdirSync(dest, { recursive: true });
  else { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, data); }
  count++;
  p = dataStart + compSize;
}
if (!fs.existsSync('public/index.html')) throw new Error('index.html missing after extraction');
console.log(`Static site extracted: ${count} files`);