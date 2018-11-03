# Webpack Summary

Webpack plugin for displaying a short summary at the end of the build process.

Useful for replacing the many lines of Webpack's output to the terminal with a single, concise, customizable line containing all the info you need.

## Install

```shell
$ npm install --save webpack-summary
```

## Usage

```js
import SummaryPlugin from 'webpack-summary';

const options = {/* ... */};

export default {
  /* ... */
  plugins: [
    /* ... */
    new SummaryPlugin ( options )
  ]
};
```

## Options

The optional options object has the following shape:

```js
{
  normal: template,
  watching: template
}
```

And it defines the templates to use when in watching mode or not.

If a falsy value is used as a template nothing will be outputted.

## Template

A template is just a string that may contain placeholders, that look like `{foo}` or `{foo.bar}`, that will be replaced with the appropriate value.

Some example templates:

`[{entry.name}] Bundled into "{entry.asset}" ({entry.size.MB}MB) in {time.s}s`

`Bundle rebuilt in {time.s}s.`

`Webpack {stats.version} - Bundled in {time.s} seconds.`

`Bundled in {time.m} minutes. {stats.errors.length} errors. {stats.warnings.length} warnings.`

## Placeholders

A placeholder is just a path that retrieves a value from the following object:

```js
{
  stats, // Raw Webpack stats file
  size: { // Size of the bundle, available in different units
    B, // Number of bytes
    KB, // Number of kilobytes
    MB // Number of megabytes
  } ,
  time: { // Time it took to bundle, available in different units
    ms, // Milliseconds
    s, // Seconds
    m // Minutes
  },
  entries: [{ // Array of data about each entries
    name, // Name of the entry
    asset, // Name of the bundled entry file
    size: { // Size of the bundled entry file
      B, // Number of bytes
      KB, // Number of kilobytes
      MB // Number of megabytes
    }
  }]
}
```

There's also a special path, `entry`. If you use it a summary will be displayed for each of the entries in your Webpack configuration. The shape of the `entry` object will be that of one of the elements of `entries`.

## License

MIT © Fabio Spampinato
