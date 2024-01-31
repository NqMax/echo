interface EncodePublicKeyCredentialUserEntity
  extends Omit<PublicKeyCredentialUserEntity, "id"> {
  displayName: string;
  id: string;
}

export interface EncodedPublicKeyCredentialOptions
  extends Omit<PublicKeyCredentialCreationOptions, "challenge" | "user"> {
  challenge: string;
  user: EncodePublicKeyCredentialUserEntity;
}

export interface EncodedPublicKeyCredential extends Credential {
  readonly encodedRawId: string;
  readonly response: {
    clientDataJSON: string;
    attestationObject: string;
    authenticatorData: string;
    publicKey: string;
    publicKeyAlgorithm: number;
    transports: string[];
  };
  readonly authenticatorAttachment: string | null;
}