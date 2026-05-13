#!/usr/bin/env node
import forge from 'node-forge';

const algorithm = 'AES-256-GCM';
const key = forge.random.getBytesSync(32);
const iv = forge.random.getBytesSync(12);
const aad = 'sadhana:secure-envelope:v1';
const plaintext = 'inner-phases-local-state-proof';

const cipher = forge.cipher.createCipher('AES-GCM', key);
cipher.start({ iv, additionalData: aad, tagLength: 128 });
cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
if (!cipher.finish()) throw new Error(`${algorithm} encryption failed`);

const ciphertext = cipher.output.getBytes();
const tag = cipher.mode.tag.getBytes();
const decipher = forge.cipher.createDecipher('AES-GCM', key);
decipher.start({
  iv,
  additionalData: aad,
  tagLength: 128,
  tag: forge.util.createBuffer(tag),
});
decipher.update(forge.util.createBuffer(ciphertext));
if (!decipher.finish()) throw new Error(`${algorithm} decryption failed`);
if (decipher.output.toString('utf8') !== plaintext) throw new Error('Roundtrip mismatch');

const tampered = ciphertext.slice(0, -1) + String.fromCharCode(ciphertext.charCodeAt(ciphertext.length - 1) ^ 1);
const tamperedDecipher = forge.cipher.createDecipher('AES-GCM', key);
tamperedDecipher.start({
  iv,
  additionalData: aad,
  tagLength: 128,
  tag: forge.util.createBuffer(tag),
});
tamperedDecipher.update(forge.util.createBuffer(tampered));
if (tamperedDecipher.finish()) throw new Error('Tampered ciphertext unexpectedly authenticated');

console.log(`${algorithm} roundtrip ok; tamper rejected`);
