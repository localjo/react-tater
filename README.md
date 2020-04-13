# `react-tater` 🥔

> A React component to add annotations to any element on a page

![Screenshot](./screenshot.png)

[![NPM](https://img.shields.io/npm/v/react-tater.svg)](https://www.npmjs.com/package/react-tater)

## Install

```bash
yarn add react-tater
```

## Usage

```jsx
import React from 'react';
import Tater from 'react-tater';
import YourElement from './your-element';

const taterOptions = {
  name: 'your-element-1', // The namespace used for local storage
  space: 30 // The size, in pixels, of the grid and emojis
};

const App = () => (
  <>
    <Tater options={taterOptions}>
      <YourElement /> {/* any element you want to annotate */}
    </Tater>
  </>
);
```

## Development

To develop locally, first symlink this package to an example project:

```bash
cd react-tater && yarn link
cd ../example-app && yarn link react-tater
```

To start the dev server which will build the module and watch for changes to
automatically rebuild:

```bash
cd react-tater && yarn start
```

Then add `import Tater from 'react-tater';` to your example project to use it.

To run tests:

```bash
cd react-tater && yarn test
```

Or:

```bash
cd react-tater && yarn test:watch
```
