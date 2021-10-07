export interface CreateCertificate {
  accessToken: string;
  clientId: string;
  partnerName: string;
  city: string;
  state: string;
}

export interface CertificatePayload {
  accessToken: string;
  certificate: string;
}

export interface CertificateResponse {
  clientSecret: string;
  crtCertificate: string;
  privateKey: string;
}
