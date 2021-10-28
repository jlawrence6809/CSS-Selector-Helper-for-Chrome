import React, {createContext, useReducer} from 'react';
import { Actions } from './Actions';
import ChromeExtensionApi, { AttributesHierarchy, CopyResult, SelectElementResult } from '../helpers/ChromeExtensionApi';
import { reducer } from './Reducer';
import { dispatchEffectsMiddleware } from './Effects';
import { EN, Localization } from '../helpers/Localization';
import LocalStorageHelper from '../helpers/LocalStorage';
import { testCustomTagFilters } from '../helpers/Helpers';
import { ThemeMode } from '../components/Settings';

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm

const chromeExtensionApi = new ChromeExtensionApi();

export type QuerySelectorState = string[][];
export type MatchState = SelectElementResult;

export interface IState {
    themeMode: ThemeMode;
    localization: Localization,
    chromeExtensionApi: ChromeExtensionApi,
    matchState: MatchState;
    unfilteredAttributesHierarchies: AttributesHierarchy[];
    attributesHierarchies: AttributesHierarchy[];
    querySelectorState: QuerySelectorState;
    visibleOnly: boolean;
    copyResult: CopyResult;
    settingsExpanded: boolean;
    showQuerySelector: boolean;
    showTagNames: boolean;
    showIds: boolean;
    showClasses: boolean;
    showOtherAttributes: boolean;
    stickyFooterButtons: boolean;
    customTagFilters: string;
    customTagFiltersUnsaved: string;
    customTagFiltersError: string | null;
}

export const INITIAL_STATE: IState = {
    themeMode: LocalStorageHelper.getThemeMode(),
    localization: EN,
    chromeExtensionApi: chromeExtensionApi,
    matchState: {
        currentMatch: -1,
        matchCount: -1
    },
    unfilteredAttributesHierarchies: [],
    attributesHierarchies: [],
    querySelectorState: [],
    visibleOnly: false,
    copyResult: CopyResult.DEFAULT,
    settingsExpanded: false,
    showQuerySelector: LocalStorageHelper.getShowQuerySelector(),
    showTagNames: LocalStorageHelper.getShowTagNames(),
    showIds: LocalStorageHelper.getShowIds(),
    showClasses: LocalStorageHelper.getShowClasses(),
    showOtherAttributes: LocalStorageHelper.getShowOtherAttributes(),
    stickyFooterButtons: LocalStorageHelper.getStickyFooter(),
    customTagFilters: LocalStorageHelper.getCustomTagFilters(),
    customTagFiltersUnsaved: LocalStorageHelper.getCustomTagFilters(),
    customTagFiltersError: testCustomTagFilters(LocalStorageHelper.getCustomTagFilters()),
};

export type DispatchMiddleware = (action: Actions) => Promise<void>;
export const StoreContext = createContext<{state: IState; dispatch: DispatchMiddleware}>({state: INITIAL_STATE, dispatch: () => new Promise(() => null)});

// inpiration for effects/reducer pattern I used: https://gist.github.com/astoilkov/013c513e33fe95fa8846348038d8fe42

const Store: React.FC = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const middleware = dispatchEffectsMiddleware(dispatch, state, chromeExtensionApi);
    return (<StoreContext.Provider value={{state, dispatch: middleware}}>{children}</StoreContext.Provider>);
}

export default Store;
