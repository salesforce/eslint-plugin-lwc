# Prefer usage of `@salesforce/i18n-service` functions over use of `$A.localizationService` (no-aura-localization-service)

The use of `$A.localizationService` for formatting and parsing date, time and numbers is deprecated.

You should be using the `@salesforce/i18n-service` methods instead.

Usage of `$A.localizationService` methods like below prohibited:

-   `$A.localizationService.formatDateTimeUTC()`
-   `$A.localizationService.parseDateTime()`
-   `...`

## Rule details

Example of **incorrect** code:

```js
var actualStartTime = $A.localizationService.formatDateTimeUTC(actualEvent.startDate, format);
var today = $A.localizationService.parseDateTime(cmp.get('v.todayDate'));

return window.$A !== undefined && window.$A.localizationService;
```

Example of **correct** code:

```js
import { getDateTimeFormat, getNumberFormat } from '@salesforce/i18n-service';

var numberFormatter = getNumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
var dateFormatter = getDateTimeFormat('fi', { year: 'numeric', month: 'long', day: 'numeric' });
var formattedNumber = numberFormatter.format(number);
var formattedDate = dateFormatter.format(date);
```
