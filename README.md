# `react-tater` 🥔

> A React component to add annotations to any element on a page

![Screenshot](./screenshot.png)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flocaljo%2Freact-tater.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flocaljo%2Freact-tater?ref=badge_shield)

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

If you want to make changes to this library in a local development environment,
first you need to symlink some packages:

```bash
cd ../example-app/node_modules/react && yarn link
cd react-tater && yarn link && yarn link react
cd ../example-app && yarn link react-tater
```

This allows you to see changes to this package immediately in your example app
and prevents the example app from seeing more than one copy of React.

Then start the dev server which will build the module and watch for changes to
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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flocaljo%2Freact-tater.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Flocaljo%2Freact-tater?ref=badge_large)