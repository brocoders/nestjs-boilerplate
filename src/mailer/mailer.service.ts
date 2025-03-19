import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { LanguageEnum } from '../i18n/language.enum';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  private readonly fallbackLanguage: LanguageEnum;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly i18nService: I18nService,
  ) {
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
    });

    // Store fallback language for reuse
    this.fallbackLanguage = this.configService.get('app.fallbackLanguage', {
      infer: true,
    }) as LanguageEnum;

    // Register i18n helper for Handlebars
    Handlebars.registerHelper('t', (key: string, options) => {
      const lang = options.hash.lang || this.fallbackLanguage;
      return this.i18nService.translate(key, { lang });
    });
  }

  // Helper method to get current language
  private getLanguage(contextLang?: string | LanguageEnum): LanguageEnum {
    const i18n = I18nContext.current();
    return (contextLang || i18n?.lang || this.fallbackLanguage) as LanguageEnum;
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown> & { lang?: LanguageEnum };
  }): Promise<void> {
    let html: string | undefined;

    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');

      // Use helper method to get language
      const lang = this.getLanguage(context.lang as LanguageEnum);

      html = Handlebars.compile(template, {
        strict: true,
      })({
        ...context,
        lang,
      });
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
