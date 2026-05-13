import forge from 'node-forge';

export const SECURE_ENVELOPE_ALGORITHM = 'AES-256-GCM';
export const SECURE_ENVELOPE_VERSION = 1;
export const SECURE_ENVELOPE_KEY_BYTES = 32;
export const SECURE_ENVELOPE_NONCE_BYTES = 12;
export const SECURE_ENVELOPE_TAG_BITS = 128;

export type SecureEnvelope = {
  version: number;
  algorithm: typeof SECURE_ENVELOPE_ALGORITHM;
  nonce: string;
  ciphertext: string;
  tag: string;
};

export class SecureEnvelopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecureEnvelopeError';
  }
}

const bytesFromBase64 = (value: string) => forge.util.decode64(value);
const base64FromBytes = (value: string) => forge.util.encode64(value);

export const generateSecureEnvelopeKey = () =>
  base64FromBytes(forge.random.getBytesSync(SECURE_ENVELOPE_KEY_BYTES));

const keyBytes = (keyBase64: string) => {
  const key = bytesFromBase64(keyBase64);
  if (key.length !== SECURE_ENVELOPE_KEY_BYTES) {
    throw new SecureEnvelopeError('AES-256-GCM requires a 32-byte key');
  }
  return key;
};

export const encryptSecureEnvelope = (
  plaintext: string,
  keyBase64: string,
  associatedData = '',
): SecureEnvelope => {
  const iv = forge.random.getBytesSync(SECURE_ENVELOPE_NONCE_BYTES);
  const cipher = forge.cipher.createCipher('AES-GCM', keyBytes(keyBase64));

  cipher.start({
    iv,
    additionalData: associatedData,
    tagLength: SECURE_ENVELOPE_TAG_BITS,
  });
  cipher.update(forge.util.createBuffer(plaintext, 'utf8'));

  if (!cipher.finish()) {
    throw new SecureEnvelopeError('AES-GCM encryption failed');
  }

  return {
    version: SECURE_ENVELOPE_VERSION,
    algorithm: SECURE_ENVELOPE_ALGORITHM,
    nonce: base64FromBytes(iv),
    ciphertext: base64FromBytes(cipher.output.getBytes()),
    tag: base64FromBytes(cipher.mode.tag.getBytes()),
  };
};

export const decryptSecureEnvelope = (
  envelope: SecureEnvelope,
  keyBase64: string,
  associatedData = '',
) => {
  if (envelope.version !== SECURE_ENVELOPE_VERSION) {
    throw new SecureEnvelopeError(`Unsupported secure envelope version: ${envelope.version}`);
  }
  if (envelope.algorithm !== SECURE_ENVELOPE_ALGORITHM) {
    throw new SecureEnvelopeError(`Unsupported secure envelope algorithm: ${envelope.algorithm}`);
  }

  const decipher = forge.cipher.createDecipher('AES-GCM', keyBytes(keyBase64));
  decipher.start({
    iv: bytesFromBase64(envelope.nonce),
    additionalData: associatedData,
    tagLength: SECURE_ENVELOPE_TAG_BITS,
    tag: forge.util.createBuffer(bytesFromBase64(envelope.tag)),
  });
  decipher.update(forge.util.createBuffer(bytesFromBase64(envelope.ciphertext)));

  if (!decipher.finish()) {
    throw new SecureEnvelopeError('AES-GCM authentication failed');
  }

  return decipher.output.toString();
};
