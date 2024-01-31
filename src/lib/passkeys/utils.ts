export function bytesToUTF8(bytes: AllowSharedBufferSource) {
  return new TextDecoder("utf-8").decode(bytes);
}

export function bytesToBase64Url(bytes: ArrayBuffer) {
  const bytesArray = new Uint8Array(bytes);
  const binaryString = String.fromCharCode(...bytesArray);
  const base64 = btoa(binaryString);
  const base64Url = base64
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return base64Url;
}

export function base64UrlToBytes(base64: string) {
  const binaryString = atob(base64);
  return Uint8Array.from(binaryString, (m) => m.charCodeAt(0));
}

export function validateClientData(
  clientData: {
    type: string;
    origin: string;
    challenge: string;
  },
  expectedValues: {
    expectedOrigin: string;
    expectedChallenge: string;
  }
) {
  const { expectedOrigin, expectedChallenge } = expectedValues;

  if (clientData.type !== "webauthn.create") {
    throw new Error("Authenticator performed an incorrect operation");
  }
  if (clientData.origin !== expectedOrigin) {
    throw new Error("Unexpected origin value");
  }
  if (clientData.challenge !== expectedChallenge) {
    throw new Error("Challenge did not match creation value");
  }
}
