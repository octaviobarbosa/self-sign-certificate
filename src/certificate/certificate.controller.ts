import { Body, Controller, Post } from '@nestjs/common';
import {
  CertificateResponse,
  CreateCertificate,
} from './certificate.interface';
import { CertificateService } from './certificate.service';

@Controller('certificate')
export class CertificateController {
  constructor(private certificateService: CertificateService) {}
  @Post()
  async createCertificate(
    @Body() data: CreateCertificate,
  ): Promise<CertificateResponse> {
    return await this.certificateService.createCertificate(data);
  }
}
