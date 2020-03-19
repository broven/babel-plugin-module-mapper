# babel-plugin-module-mapper
[![Build Status](https://travis-ci.org/broven/babel-plugin-module-mapper.svg?branch=master)](https://travis-ci.org/broven/babel-plugin-module-mapper)

![npm](https://img.shields.io/npm/dt/babel-plugin-module-mapper)


# TODO
- generate only one import when transform to exist import declaretion

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
        '${targetExport (defaultExport alias to default)}': ['${targetModuleName}', '${targetExportName}', ${targetLocalName?}]
    }
}

// demo config for demo
{
    'react': {
        'PropTypes': ['prop-types', 'default']
    }
}
```
## targetLocalName
```jsonc
    {
     'preact': {
         'preact': ['preact', 'default', 'React']
     }
    }
```
transform:
```javascript
import preact from 'preact';
// will transform to:
import React from 'preact';
```

# lis

WTF lis.

