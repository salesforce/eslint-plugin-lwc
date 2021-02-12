# Prevent usage of the `moment` library (no-moment)

The use of `moment` library is not recommended because it has bad performance and is large in size.

You should be using the `@salesforce/i18n-service` methods instead.

Usage of following `moment` imports are detected:

-   `require('moment');`
-   `import moment from 'moment';`

## Rule details

Example of **incorrect** code:

```js
var moment = require('moment');

// OR

import moment from 'moment';
});
```

Example of **correct** code:

```js
import { getDateTimeFormat, getNumberFormat } from '@salesforce/i18n-service';
```
