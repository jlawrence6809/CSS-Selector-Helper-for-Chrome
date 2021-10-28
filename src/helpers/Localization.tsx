export const EN = {
    PREVIOUS_BUTTON_TITLE: 'Previous match',
    NEXT_BUTTON_TITLE: 'Next match',
    REFRESH_BUTTON_TITLE: 'Get selectors for current selection',
    VISIBLE_ONLY_BUTTON_TITLE: 'Match only selenium visible elements',
    VISIBLE_ONLY_OFF_BUTTON_TITLE: 'Remove visiblity filter',
    COPY_SELECTOR_BUTTON_TITLE: 'Copy query selector to clipboard',
    COPY_SELECTOR_BUTTON_TITLE_ERROR: 'Function window.copy has been overridden!',
    META_SELECTOR_BUTTON_TITLE: `Hold the ctrl, alt, meta, or shift key to 'not' the selector`,
    CURRENT_QUERY_DISPLAY_TITLE: `Current query selector, right click to copy`,
    CURRENT_QUERY_DISPLAY_PLACEHOLDER: 'Click attributes to build query',
    SETTINGS_SHOW_QUERY_SELECTOR: 'Show query selector',
    SETTINGS_SHOW_TAG_NAMES: 'Show tag name attributes',
    SETTINGS_SHOW_IDS: 'Show Id attributes',
    SETTINGS_SHOW_CLASSES: 'Show class attributes',
    SETTINGS_SHOW_OTHER_ATTRIBUTES: 'Show other attributes',
    SETTINGS_STICKY_FOOTER: 'Sticky footer',
    SETTINGS_DARK_MODE: 'Dark mode',
    SETTINGS_MODE_SYSTEM: 'System',
    SETTINGS_MODE_DARK: 'Dark',
    SETTINGS_MODE_LIGHT: 'Light',
    SETTINGS_CUSTOM_TAG_FILTERS: 'Custom Tag Filters',
    SETTINGS_CUSTOM_TAG_FILTERS_HELP: 'Accepts line separated regex which will filter out tag values',
} as const;

// note: when/if other languages are added change to: Record<keyof EN, string>
export type Localization = typeof EN;
