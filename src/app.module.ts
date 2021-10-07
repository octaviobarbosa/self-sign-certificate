import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CertificateController } from './certificate/certificate.controller';
import { CertificateModule } from './certificate/certificate.module';

@Module({
  imports: [ConfigModule.forRoot(), CertificateModule],
  controllers: [AppController, CertificateController],
  providers: [AppService],
})
export class AppModule {}
