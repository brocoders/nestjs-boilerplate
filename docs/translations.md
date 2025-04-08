# Translations

## Table of Contents <!-- omit in toc -->

- [How to add a new translation](#how-to-add-a-new-translation)
- [How to use translations on frontend](#how-to-use-translations-on-frontend)
- [How to use translations in code](#how-to-use-translations-in-code)

## How to add a new translation

1. Copy the `en` folder and rename it to the language you are adding.
2. Translate files in the new folder.

## How to use translations on frontend

1. Add header `x-custom-lang` to the request with the language you want to use.

## How to use translations in code

```typescript
import { I18nContext } from 'nestjs-i18n';

// code ...

@Injectable()
export class SomeService {
  // code ...

  async someMethod(): Promise<void> {
    const i18n = I18nContext.current();

    if (!i18n) {
      throw new Error('I18nContext is not available');
    }

    const emailConfirmTitle = await i18n.t('common.confirmEmail');

    // code ...
  }
}
```

---

Previous: [Automatic update of dependencies](automatic-update-dependencies.md)
