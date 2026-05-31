import {
  App,
  Editor,
  MarkdownView,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";

interface SlugConverterSettings {
  separator: string;
  lowercase: boolean;
  removeAccents: boolean;
}

const DEFAULT_SETTINGS: SlugConverterSettings = {
  separator: "-",
  lowercase: true,
  removeAccents: true,
};

export default class SlugConverterPlugin extends Plugin {
  settings: SlugConverterSettings;

  async onload() {
    await this.loadSettings();

    // Command to convert selected text to slug using global settings
    this.addCommand({
      id: "convert-selection-to-slug",
      name: "Convert selection to slug",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const selection = editor.getSelection();

        if (!selection || selection.trim().length === 0) {
          console.log("No text selected");
          return;
        }

        const slug = this.textToSlug(selection);
        editor.replaceSelection(slug);
      },
    });

    // Command to convert to slug forcing '-' (dash) separator
    this.addCommand({
      id: "convert-to-slug-dash",
      name: "Convert to slug with dash (-)",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const previousSeparator = this.settings.separator;
        this.settings.separator = "-";

        const selection = editor.getSelection();
        if (selection && selection.trim().length > 0) {
          const slug = this.textToSlug(selection);
          editor.replaceSelection(slug);
        }

        this.settings.separator = previousSeparator;
      },
    });

    // Command to convert to slug forcing '_' (underscore) separator
    this.addCommand({
      id: "convert-to-slug-underscore",
      name: "Convert to slug with underscore (_)",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const previousSeparator = this.settings.separator;
        this.settings.separator = "_";

        const selection = editor.getSelection();
        if (selection && selection.trim().length > 0) {
          const slug = this.textToSlug(selection);
          editor.replaceSelection(slug);
        }

        this.settings.separator = previousSeparator;
      },
    });

    // Adds settings tab to the Obsidian menu
    this.addSettingTab(new SlugConverterSettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // Fixed and optimized function for slug generation
  textToSlug(text: string): string {
    let slug = text;

    // 1. Remove accents if configured
    if (this.settings.removeAccents) {
      slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // 2. Convert to lowercase if configured
    if (this.settings.lowercase) {
      slug = slug.toLowerCase();
    }

    // 3. Replace spaces with the active separator before removing special characters
    slug = slug.replace(/\s+/g, this.settings.separator);

    // 4. Escape the separator to prevent breaking regex-sensitive characters
    const escapedSeparator = this.settings.separator.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      "\\$&",
    );

    // 5. Keep only letters, numbers, and the current separator (clears '_' if separator is '-')
    const allowedCharsRegex = new RegExp(
      `[^A-Za-z0-9${escapedSeparator}]`,
      "g",
    );
    slug = slug.replace(allowedCharsRegex, "");

    // 6. Clean duplicate separators or those left at the edge of the text
    const duplicateRegex = new RegExp(`${escapedSeparator}+`, "g");
    const edgeRegex = new RegExp(
      `^${escapedSeparator}|${escapedSeparator}$`,
      "g",
    );

    slug = slug
      .replace(duplicateRegex, this.settings.separator)
      .replace(edgeRegex, "");

    return slug;
  }
}

class SlugConverterSettingTab extends PluginSettingTab {
  plugin: SlugConverterPlugin;
  examplesContainer: HTMLElement;

  constructor(app: App, plugin: SlugConverterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Slug Converter Settings" });

    // Separator character configuration
    new Setting(containerEl)
      .setName("Separator")
      .setDesc("Choose the separator character for the slug")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("-", "Dash (-)")
          .addOption("_", "Underscore (_)")
          .setValue(this.plugin.settings.separator)
          .onChange(async (value) => {
            this.plugin.settings.separator = value;
            await this.plugin.saveSettings();
            this.updateExamples();
          }),
      );

    // Lowercase configuration
    new Setting(containerEl)
      .setName("Convert to lowercase")
      .setDesc("If enabled, converts all text to lowercase")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.lowercase)
          .onChange(async (value) => {
            this.plugin.settings.lowercase = value;
            await this.plugin.saveSettings();
            this.updateExamples();
          }),
      );

    // Accent removal configuration
    new Setting(containerEl)
      .setName("Remove accents")
      .setDesc("If enabled, removes diacritics/accents from the text")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.removeAccents)
          .onChange(async (value) => {
            this.plugin.settings.removeAccents = value;
            await this.plugin.saveSettings();
            this.updateExamples();
          }),
      );

    // Renders the reactive preview section
    containerEl.createEl("h3", { text: "Real-time Preview" });
    this.examplesContainer = containerEl.createEl("ul");
    this.updateExamples();
  }

  // Dynamically updates example strings based on current configurations
  updateExamples(): void {
    if (!this.examplesContainer) return;

    this.examplesContainer.empty();

    const ex1 = this.plugin.textToSlug("My Awesome Title");
    const ex2 = this.plugin.textToSlug("Café with Sugar");
    const ex3 = this.plugin.textToSlug("Final_Version_Of_Text!");

    this.examplesContainer.createEl("li", {
      text: `"My Awesome Title" → "${ex1}"`,
    });
    this.examplesContainer.createEl("li", {
      text: `"Café with Sugar" → "${ex2}"`,
    });
    this.examplesContainer.createEl("li", {
      text: `"Final_Version_Of_Text!" → "${ex3}"`,
    });
  }
}
