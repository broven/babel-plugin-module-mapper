# babel-plugin-module-mapper

This plugin aim to map particular import to another module.

## demo

for some reason, you can't modify code, you need babel to do this

```javascript
import { createElement, PropTypes } from 'react';
```
to
```javascript
import { createElement } from 'react';
import PropTypes from 'prop-types';
```

## config
```jsonc

{
    '${targetModuleName}': {
        '${targetExport (defaultExport alias to default)}': ['${targetModuleName}', '${targetExportName}']
    }
}

// demo config for demo
{
    'react': {
        'PropTypes': ['prop-types', 'default']
    }
}
```

# lis

WTF lis.