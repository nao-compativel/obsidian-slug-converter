# Slug Converter - Obsidian Extension

A simple extension to convert selected text into slugs in Obsidian, with configurable options.

## Features

✅ Converts selected text to slug
✅ Choose between `-` or `_` separator
✅ Option to convert to lowercase
✅ Option to remove accents
✅ Integrated command shortcuts
✅ User-friendly settings interface

## Installation

### Method 1: Manual Installation (Development)

1. Clone or extract the extension files to:

``
VaultFolder/.obsidian/plugins/obsidian-slug-converter/

``

2. Install the dependencies:

``bash
npm install

```

3. Compile the extension:

``bash
npm run build

```

4. Restart Obsidian

5. In Settings → Community Extensions, enable "Slug Converter"

### Method 2: Installation via BRAT (Recommended for testing)

1. Install the BRAT plugin
2. Open BRAT and click "Add Beta plugin"
3. Paste the repository URL: `https://github.com/your-username/obsidian-slug-converter`
4. Click "Add Plugin"
5. In Extensions, enable "Slug Converter"

## Usage

### Available Commands

1. **Convert selection to slug**

- Select the desired text

- Use the command (Ctrl+P or Cmd+P) and search for "Convert selection to slug"

- The text will be replaced by the slug

2. **Convert to slug with hyphen (-)**

- Uses the separator `-` regardless of the current configuration

3. **Convert to slug with underscore (\_)**

- Uses the separator `_` regardless of the current configuration

### Examples

```
Input: "My Incredible Title"
Output (dash): "my-incredible-title"
Output (underline): "my_incredible_title"

Input: "Coffee with Sugar"
Output: "coffee-with-sugar" (without accents)

Input: "Hello World!!!"

Output: "hello-world"

## Settings

Access in **Settings → Slug Converter**:

- **Separator**: Choose between `-` (hyphen) or `_` (underscore)
- **Convert to lowercase**: Enables/disables lowercase conversion
- **Remove accents**: Enables/disables accent removal

## Development

### Project Structure

```

obsidian-slug-converter/
├── main.ts # Main extension code
├── manifest.json # Extension metadata
├── package.json # Dependencies
├── tsconfig.json # TypeScript configuration
├── esbuild.config.mjs # Build configuration
├── styles.css # CSS Styles
├── README.md # This file
└── .gitignore # Files ignored by git

````

### Available Scripts

```bash
npm install # Installs dependencies
npm run dev # Starts development mode with watch
npm run build # Compiles for production
````

### Suggested Modifications

To add new separators, edit `main.ts`:

```typescript
// In the SlugConverterSettingTab class, in the display() method:
new Setting(containerEl)

.setName('Separator')

.setDesc('Choose the separator character for the slug')

.addDropdown((dropdown) =>

dropdown

.addOption('-', 'Dash (-)')

.addOption('_', 'Underscore (_)')

.addOption('', 'None') // New separator

.setValue(this.plugin.settings.separator)

/ // ... rest of the code

);

```

## Troubleshooting

**Extension not appearing in Community Extensions?**

- Restart Obsidian completely
- Check if the files are in the correct folder

**Commands not working?**

- Make sure the text is selected
- Check if the extension is enabled

**Compilation errors?**

- Delete the `node_modules` and `main.js` folders
- Run `npm install` again
- Run `npm run build`

## License

GNU GENERAL PUBLIC LICENSE

## Contributions

Contributions are welcome! Open an issue or pull request.
