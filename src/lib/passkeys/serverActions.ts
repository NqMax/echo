"use server";
import { randomBytes } from "crypto";
import type {
  EncodedPublicKeyCredentialOptions,
  EncodedPublicKeyCredential,
} from "@/lib/passkeys/types";
import { validateClientData } from "@/lib/passkeys/utils";
import { Decoder } from "cbor";

// Human-readable title for your website
const rpName = "Echo";
// A unique identifier for your website
const rpId = "localhost";
// The URL at which registrations and authentications should occur
const expectedOrigin = `http://${rpId}:3000`;

export async function generateRegistrationOptions(): Promise<EncodedPublicKeyCredentialOptions> {
  const challenge = randomBytes(24).toString("base64url");
  const userId = randomBytes(16).toString("base64url");

  // SAVE CHALLENGE TO DATABASE

  return {
    challenge: challenge,
    rp: {
      name: rpName,
      id: rpId,
    },
    user: {
      displayName: "",
      id: userId,
      name: "Max",
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" },
      { alg: -257, type: "public-key" },
    ],
    // excludeCredentials: userAuthenticators.map(authenticator => ({
    //   id: authenticator.credentialID,
    //   type: 'public-key',
    //   // Optional
    //   transports: authenticator.transports,
    // })),
  };
}

export async function verifyRegistration(
  credential: EncodedPublicKeyCredential
) {
  const {
    id,
    encodedRawId,
    response,
    type: credentialType,
    authenticatorAttachment,
  } = credential;
  const {
    clientDataJSON,
    attestationObject,
    authenticatorData,
    publicKey,
    publicKeyAlgorithm,
    transports,
  } = response;

  // FETCH CHALLENGE FROM DATABASE
  const expectedChallenge = "challenge";

  if (id !== encodedRawId) {
    throw new Error("Credential ID was not base64url encoded");
  }

  const clientData = JSON.parse(
    Buffer.from(clientDataJSON, "base64url").toString("utf8")
  );
  console.log(clientData);

  // validateClientData(clientData, {
  //   expectedOrigin,
  //   expectedChallenge,
  // });

  // const attestation = Decoder.decodeAllSync(Buffer.from(attestationObject, "base64url"));

  // console.log(attestation);
}
