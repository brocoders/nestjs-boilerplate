import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mail.host', { infer: true }),
      port: configService.get('mail.port', { infer: true }),
      ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      secure: configService.get('mail.secure', { infer: true }),
      requireTLS: configService.get('mail.requireTLS', { infer: true }),
      auth: {
        user: configService.get('mail.user', { infer: true }),
        pass: configService.get('mail.password', { infer: true }),
      },
      authMethod: 'LOGIN',
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    try {
      console.log('Sending email with options:', {
        host: this.configService.get('mail.host', { infer: true }),
        port: this.configService.get('mail.port', { infer: true }),
        ignoreTLS: this.configService.get('mail.ignoreTLS', { infer: true }),
        secure: this.configService.get('mail.secure', { infer: true }),
        requireTLS: this.configService.get('mail.requireTLS', { infer: true }),
        auth: {
          user: this.configService.get('mail.user', { infer: true }),
          pass: this.configService.get('mail.password', { infer: true }),
        },
      });
      let html: string | undefined;
      if (templatePath) {
        const template = await fs.readFile(templatePath, 'utf-8');
        html = Handlebars.compile(template, {
          strict: true,
        })(context);
      }

      await this.transporter
        .sendMail({
          ...mailOptions,
          from: mailOptions.from
            ? mailOptions.from
            : `"${this.configService.get('mail.defaultName', {
                infer: true,
              })}" <${this.configService.get('mail.defaultEmail', {
                infer: true,
              })}>`,
          html: mailOptions.html ? mailOptions.html : html,
        })
        .then(() => {
          console.log('Email sent successfully');
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          throw new Error('Failed to send email');
        });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
