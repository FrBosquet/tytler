# Tytler (Work In Progress)

> Inspired by Alexander Fraser Tytler, who wrote one of the earliest essays on the principles of translation.

**Tytler** provides an assisted workflow to work with translations in both server side and client side react applications.

## Development

### CLI

To create a new command, just do it and `npm publish` the package.

### Extension

To create a new version of the extension, run the following command in the extension folder:

```bash
npm version patch
vsce package
```

If you don't have `vsce` installed, you can install it globally with:

```bash
npm install -g vsce
```

This will create a new version of the extension in the root folder.

Next, remove the previous version vsix file from the root folder so the install script can use the new version.

To install the version, build the CLI command and run the following command in:

```bash
tytler install
```

### Releasing

