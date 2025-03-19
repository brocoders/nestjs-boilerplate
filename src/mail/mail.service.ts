import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';

import { MailerService } from '../mailer/mailer.service';
import path from 'path';
import { AllConfigType } from '../config/config.type';
import { LanguageEnum } from '../i18n/language.enum';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly i18nService: I18nService,
  ) {}

  // Helper to get language with proper typing
  private getLanguage(language?: LanguageEnum): LanguageEnum {
    const i18n = I18nContext.current();
    const fallback = this.configService.get('app.fallbackLanguage', {
      infer: true,
    }) as LanguageEnum;
    return (language || i18n?.lang || fallback) as LanguageEnum;
  }

  // Helper to get email subject with i18n support
  private async getSubject(
    key: string,
    language?: LanguageEnum,
  ): Promise<string> {
    const lang = this.getLanguage(language);
    try {
      const translation = await this.i18nService.translate(key, { lang });
      return translation as string;
    } catch {
      // Fallback if translation fails
      return key.split('.').pop() || 'Email Notification';
    }
  }

  // Helper to get template path
  private getTemplatePath(templateName: string): string {
    return path.join(
      this.configService.getOrThrow('app.workingDirectory', { infer: true }),
      'src',
      'mail',
      'mail-templates',
      templateName,
    );
  }

  async userSignUp(
    mailData: MailData<{ hash: string }>,
    language?: LanguageEnum,
  ): Promise<void> {
    // Get language
    const lang = this.getLanguage(language);

    // Generate URL
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', { infer: true }) +
        '/confirm-email',
    );
    url.searchParams.set('hash', mailData.data.hash);

    // Get translated subject
    const subject = await this.getSubject('common.confirmEmail', language);

    // Send email
    await this.mailerService.sendMail({
      to: mailData.to,
      subject,
      text: url.toString(),
      templatePath: this.getTemplatePath('activation.hbs'),
      context: {
        url: url.toString(),
        app_name: this.configService.get('app.name', { infer: true }),
        lang,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
    language?: LanguageEnum,
  ): Promise<void> {
    // Get language
    const lang = this.getLanguage(language);

    // Generate URL
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', { infer: true }) +
        '/password-change',
    );
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    // Get translated subject
    const subject = await this.getSubject('common.resetPassword', language);

    // Send email
    await this.mailerService.sendMail({
      to: mailData.to,
      subject,
      text: url.toString(),
      templatePath: this.getTemplatePath('reset-password.hbs'),
      context: {
        url: url.toString(),
        app_name: this.configService.get('app.name', { infer: true }),
        lang,
      },
    });
  }

  async confirmNewEmail(
    mailData: MailData<{ hash: string }>,
    language?: LanguageEnum,
  ): Promise<void> {
    // Get language
    const lang = this.getLanguage(language);

    // Generate URL
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', { infer: true }) +
        '/confirm-new-email',
    );
    url.searchParams.set('hash', mailData.data.hash);

    // Get translated subject
    const subject = await this.getSubject('common.confirmEmail', language);

    // Send email
    await this.mailerService.sendMail({
      to: mailData.to,
      subject,
      text: url.toString(),
      templatePath: this.getTemplatePath('confirm-new-email.hbs'),
      context: {
        url: url.toString(),
        app_name: this.configService.get('app.name', { infer: true }),
        lang,
      },
    });
  }
}
