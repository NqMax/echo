"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  generateRegistrationOptions,
  verifyRegistration,
} from "@/lib/passkeys/serverActions";
import type {
  EncodedPublicKeyCredentialOptions,
  EncodedPublicKeyCredential,
} from "@/lib/passkeys/types";
import { base64UrlToBytes, bytesToBase64Url } from "@/lib/passkeys/utils";

async function register(
  registrationOptions: EncodedPublicKeyCredentialOptions
) {
  const publicKey: PublicKeyCredentialCreationOptions = {
    ...registrationOptions,
    challenge: base64UrlToBytes(registrationOptions.challenge),
    user: {
      ...registrationOptions.user,
      id: base64UrlToBytes(registrationOptions.user.id),
    },
  };

  const credential = (await navigator.credentials.create({
    publicKey,
  })) as PublicKeyCredential | null;

  console.log(credential);

  if (credential === null) {
    throw new Error("Credential could not be created");
  }

  const { id, rawId, type, authenticatorAttachment } = credential;
  const response = credential.response as AuthenticatorAttestationResponse;

  const authenticatorData = response.getAuthenticatorData();

  const publicKeyBytes = response.getPublicKey();

  if (publicKeyBytes === null) {
    throw new Error("Public key could not be retrieved");
  }

  const publicKeyAlgorithm = response.getPublicKeyAlgorithm();

  const transports = response.getTransports();

  const encodedCredential: EncodedPublicKeyCredential = {
    id,
    encodedRawId: bytesToBase64Url(rawId),
    response: {
      clientDataJSON: bytesToBase64Url(response.clientDataJSON),
      attestationObject: bytesToBase64Url(response.attestationObject),
      authenticatorData: bytesToBase64Url(authenticatorData),
      publicKey: bytesToBase64Url(publicKeyBytes),
      publicKeyAlgorithm,
      transports,
    },
    type,
    authenticatorAttachment,
  };

  return encodedCredential;
}

export default function Home() {
  async function handleRegister(e) {
    try {
      e.preventDefault();

      const registrationOptions = await generateRegistrationOptions();

      const registrationResults = await register(registrationOptions);

      const verificationInfo = await verifyRegistration(registrationResults);
    } catch (e) {
      console.dir(e);
      throw e;
    }
  }

  return (
    <div className="container min-h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => handleRegister(e)}
        className="flex flex-col gap-y-3"
      >
        <Label htmlFor="username">Username</Label>
        <Input type="text" name="username" id="username" />
        <Button>Submit</Button>
      </form>
    </div>
  );
}
