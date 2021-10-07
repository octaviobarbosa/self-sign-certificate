import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { md, pki } from 'node-forge';
import axios, { AxiosError } from 'axios';
import {
  CertificatePayload,
  CertificateResponse,
  CreateCertificate,
} from './certificate.interface';

@Injectable()
export class CertificateService {
  constructor(private readonly configService: ConfigService) {}

  async createCertificate(
    data: CreateCertificate,
  ): Promise<CertificateResponse> {
    const key = pki.rsa.generateKeyPair(2048);
    const cert = pki.createCertificationRequest();

    cert.publicKey = key.publicKey;
    cert.setSubject([
      {
        shortName: 'CN',
        value: data.clientId,
      },
      {
        shortName: 'OU',
        value: data.partnerName,
      },
      {
        shortName: 'L',
        value: data.city,
      },
      {
        shortName: 'ST',
        value: data.state,
      },
      {
        shortName: 'C',
        value: 'BR',
      },
    ]);
    cert.sign(key.privateKey, md.sha512.create());

    const pem = pki.certificationRequestToPem(cert);

    const result = await this.sendCertificate({
      accessToken: data.accessToken,
      certificate: pem,
    });

    const resultSplited = result.split(/\r?\n/);
    const clientSecret = resultSplited.shift().replace('Secret: ', '');
    const crtCertificate = resultSplited.join(`\r\n`);

    return {
      clientSecret,
      crtCertificate: Buffer.from(crtCertificate).toString('base64'),
      privateKey: Buffer.from(pki.privateKeyToPem(key.privateKey)).toString(
        'base64',
      ),
    };
  }

  async sendCertificate(payload: CertificatePayload): Promise<string> {
    try {
      const url = this.configService.get<string>('API_URL');

      const response = await axios.post<any>(url, payload.certificate, {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${payload.accessToken}`,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError && axiosError.response) {
          throw new HttpException(
            axiosError.response.data,
            axiosError.response.status,
          );
        }
      }

      throw new HttpException('Not handled error', 500);
    }
  }
}
