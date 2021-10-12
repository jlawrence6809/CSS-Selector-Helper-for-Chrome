import { ThemeMode } from "../components/Settings";

export enum BooleanStorage {
    TRUE = 'true',
    FALSE = 'false'
}

export const INITIAL_LOCAL_STORAGE: LocalStorage = {
    showQuerySelector: BooleanStorage.TRUE,
    showTagNames: BooleanStorage.TRUE,
    showIds: BooleanStorage.TRUE,
    showClasses: BooleanStorage.TRUE,
    showOtherAttributes: BooleanStorage.TRUE,
    customTagFilters: '',
};

// local storage always has string values for it's keys AND values
export type LocalStorage = {
    showQuerySelector: BooleanStorage;
    showTagNames: BooleanStorage;
    showIds: BooleanStorage;
    showClasses: BooleanStorage;
    showOtherAttributes: BooleanStorage;
    customTagFilters: string;
};


export default class LocalStorageHelper {
    static getShowQuerySelector(): boolean {
        return LocalStorageHelper.getAndCheckBooleanStorage('showQuerySelector');
    }

    static setShowQuerySelector(value: boolean) {
        window.localStorage.setItem('showQuerySelector', value ? BooleanStorage.TRUE : BooleanStorage.FALSE);
    }
    
    static getShowTagNames(): boolean {
        return LocalStorageHelper.getAndCheckBooleanStorage('showTagNames');
    }

    static setShowTagNames(value: boolean) {
        window.localStorage.setItem('showTagNames', value ? BooleanStorage.TRUE : BooleanStorage.FALSE);
    }
    
    static getShowIds(): boolean {
        return LocalStorageHelper.getAndCheckBooleanStorage('showIds');
    }

    static setShowIds(value: boolean) {
        window.localStorage.setItem('showIds', value ? BooleanStorage.TRUE : BooleanStorage.FALSE);
    }
    
    static getShowClasses(): boolean {
        return LocalStorageHelper.getAndCheckBooleanStorage('showClasses');
    }
    
    static setShowClasses(value: boolean) {
        window.localStorage.setItem('showClasses', value ? BooleanStorage.TRUE : BooleanStorage.FALSE);
    }

    static getShowOtherAttributes(): boolean {
        return LocalStorageHelper.getAndCheckBooleanStorage('showOtherAttributes');
    }

    static setShowOtherAttributes(value: boolean) {
        window.localStorage.setItem('showOtherAttributes', value ? BooleanStorage.TRUE : BooleanStorage.FALSE);
    }
    
    static setThemeMode(value: ThemeMode) {
        window.localStorage.setItem('themeMode', value);
    }

    static getThemeMode(): ThemeMode {
        return window.localStorage.getItem("themeMode") as ThemeMode || "system";
    }
    

    static setStickyFooter(value: boolean) {
        window.localStorage.setItem('stickyFooter', value ? BooleanStorage.TRUE : BooleanStorage.FALSE);
    }

    static getStickyFooter() {
        return LocalStorageHelper.getAndCheckBooleanStorage('stickyFooter');
    }

    static getCustomTagFilters(): string {
        let value = window.localStorage.getItem('customTagFilters');
        const isValid = typeof value === 'string';
        if (!isValid) {
            value = INITIAL_LOCAL_STORAGE.customTagFilters;
            window.localStorage.setItem('customTagFilters', value);
        }
        return value as string;
    }

    static setCustomTagFilters(value: string) {
        window.localStorage.setItem('customTagFilters', value);
    }

    private static getAndCheckBooleanStorage(key: string): boolean {
        let value = window.localStorage.getItem(key);
        const isValid = (typeof value === 'string') && (value === BooleanStorage.TRUE || value === BooleanStorage.FALSE);
        if (!isValid) {
            value = (INITIAL_LOCAL_STORAGE as any)[key] as string;
            window.localStorage.setItem(key, value);
        }
        return value === BooleanStorage.TRUE;
    }
}
