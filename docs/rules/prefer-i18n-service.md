# Prefer usage of `@salesforce/i18n-service` functions over direct use of `Intl` (prefer-i18n-service)

The direct use of `Intl` object for formatting date, time and numbers is not recommended in Lightning.

You should be using the `@salesforce/i18n-service` methods instead.

Usage of following `Intl` constructor properties is discouraged:

-   `Intl.DateTimeFormat()`
-   `Intl.NumberFormat()`
-   `Intl.RelativeTimeFormat()`

## Rule details

Example of **incorrect** code:

```js
var numberFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
var dateFormatter = new Intl.DateTimeFormat('fi', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

var formattedNumber = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
    number,
);
var formattedDate = new Intl.DateTimeFormat('fi', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}).format(date);
```

Example of **correct** code:

```js
import { getDateTimeFormat, getNumberFormat } from '@salesforce/i18n-service';

var numberFormatter = getNumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
var dateFormatter = getDateTimeFormat('fi', { year: 'numeric', month: 'long', day: 'numeric' });

var formattedNumber = numberFormatter.format(number);
var formattedDate = dateFormatter.format(date);
```
