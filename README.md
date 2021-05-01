## Web Builder Module - Inline SASS files

This module allows the [@deskeen/web-builder](https://github.com/deskeen/web-builder) engine to inline CSS/SASS files.

It uses [dart-sass](https://github.com/sass/dart-sass) under the hood to parse and minify the text.


## Install

```
npm install @deskeen/web-builder
npm install @deskeen/web-builder-inline-sass
```


### Usage

And add the module to the list of modules: 

```javascript
const builder = require('@deskeen/web-builder')
await builder.build({
  source: [
    // List of files or directories that include
    // {{inlineSASS:file.scss}} tags
  ],
  modules: [
    [
      '@deskeen/web-builder-inline-sass',
      {
        assets: [
          // List of directories that contain
          // the sass files included in the tags
        ],
        sassOptions: {
          // See https://github.com/sass/dart-sass
          // for a complete list of options
        },
        // Minify output
        // Same as option: outputStyle='compressed'
        minify: true,
      }
    ]
  ]
})
```


## Contact

You can reach me at {my_firstname}@{my_name}.fr


## Licence

MIT Licence - Copyright (c) Morgan Schmiedt