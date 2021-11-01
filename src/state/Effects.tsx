import ChromeExtensionApi, {
  AttributesHierarchy,
  CopyResult,
} from "../helpers/ChromeExtensionApi";
import {
  getQuerySelectorString,
  compareAttributesForSort,
  copyToClipboard,
} from "../helpers/Helpers";
import LocalStorageHelper from "../helpers/LocalStorage";
import {
  Actions,
  AttributeButtonClickType,
  UpdateQuerySelectorStateAction,
  UpdateMatchStateAction,
  ClickGetSelectorsType,
  SetAttributesHierarchyAction,
  ClickCopySelectorToClipboardType,
  ToggleVisibilityClickType,
  ClickNextType,
  ClickPrevType,
  CopyResultAction,
  CustomTagFilterSaveActionType,
  ShowClassesClickedActionType,
  ShowIdsClickedActionType,
  ShowOtherAttributesClickedActionType,
  ShowQuerySelectorActionType,
  ShowTagNamesClickedActionType,
  ToggleDarkModeClickType,
} from "./Actions";
import {
  QuerySelectorState,
  MatchState,
  INITIAL_STATE,
  DispatchMiddleware,
  IState,
} from "./Store";

// intercepts what would normally be a call to the dispatch reducer to do effects. can get an easy reference to current state here?
export function dispatchEffectsMiddleware(
  dispatch: React.Dispatch<Actions>,
  state: IState,
  chromeExtensionApi: ChromeExtensionApi
): DispatchMiddleware {
  return async (action: Actions) => {
    switch (action.type) {
      case AttributeButtonClickType:
        {
          let selector = action.selector;
          if (action.metaPressed) {
            selector = `:not(${selector})`;
          }
          const selectors: QuerySelectorState = [...action.querySelectorState];
          if (!selectors[action.rowIdx]) {
            selectors[action.rowIdx] = [];
          }
          if (!!selectors[action.rowIdx][action.buttonIdx]) {
            delete selectors[action.rowIdx][action.buttonIdx];
          } else {
            selectors[action.rowIdx][action.buttonIdx] = selector;
          }
          const matchState: MatchState = await refreshMatchesState(
            chromeExtensionApi,
            getQuerySelectorString(selectors),
            action.visibleOnly
          );
          dispatch(new UpdateQuerySelectorStateAction(selectors));
          dispatch(new UpdateMatchStateAction(matchState));
        }
        break;
      case ClickGetSelectorsType:
        {
          const result: AttributesHierarchy[] =
            await chromeExtensionApi.getAttributesHierarchyForCurrentlySelectedElementOnPage();
          result.forEach((arr) => arr.sort(compareAttributesForSort));
          dispatch(new SetAttributesHierarchyAction(result));
          dispatch(new UpdateMatchStateAction(INITIAL_STATE.matchState));
        }
        break;
      case ClickCopySelectorToClipboardType:
        const copyResult = copyToClipboard(action.selector);
        dispatch(new CopyResultAction(copyResult ? CopyResult.SUCCESS : CopyResult.FAIL));
        if (copyResult) {
          // if successful we flash a success icon, then we need to reset it
          setTimeout(
            () => dispatch(new CopyResultAction(CopyResult.DEFAULT)),
            600
          );
        }
        break;
      case ToggleVisibilityClickType:
        {
          const matchState: MatchState = await refreshMatchesState(
            chromeExtensionApi,
            action.querySelector,
            action.visibleOnly
          );
          dispatch(action);
          dispatch(new UpdateMatchStateAction(matchState));
        }
        break;
      case ClickNextType:
        {
          const matchState: MatchState =
            await chromeExtensionApi.runSelectElemScript(
              action.querySelector,
              action.currentMatch < 1 ? 1 : action.currentMatch + 1,
              action.visibleOnly,
              true
            );
          dispatch(new UpdateMatchStateAction(matchState));
        }
        break;
      case ClickPrevType:
        {
          const matchState: MatchState =
            await chromeExtensionApi.runSelectElemScript(
              action.querySelector,
              action.currentMatch - 1,
              action.visibleOnly,
              true
            );
          dispatch(new UpdateMatchStateAction(matchState));
        }
        break;
      case ShowQuerySelectorActionType:
        LocalStorageHelper.setShowQuerySelector(!state.showQuerySelector);
        dispatch(action);
        break;
      case ShowTagNamesClickedActionType:
        LocalStorageHelper.setShowTagNames(!state.showTagNames);
        dispatch(action);
        break;
      case ShowIdsClickedActionType:
        LocalStorageHelper.setShowIds(!state.showIds);
        dispatch(action);
        break;
      case ShowClassesClickedActionType:
        LocalStorageHelper.setShowClasses(!state.showClasses);
        dispatch(action);
        break;
      case ShowOtherAttributesClickedActionType:
        LocalStorageHelper.setShowOtherAttributes(!state.showOtherAttributes);
        dispatch(action);
        break;
      case CustomTagFilterSaveActionType:
        LocalStorageHelper.setCustomTagFilters(state.customTagFiltersUnsaved);
        dispatch(action);
        break;
      case ToggleDarkModeClickType:
        LocalStorageHelper.setThemeMode(action.theme);
        dispatch(action);
        break;
      default:
        dispatch(action);
    }
  };
}

async function refreshMatchesState(
  chromeExtensionApi: ChromeExtensionApi,
  querySelector: string,
  visibleOnly: boolean
): Promise<MatchState> {
  let matchCount: number = -1;
  if (!!querySelector) {
    matchCount = await chromeExtensionApi.getNumberOfMatches(
      querySelector,
      visibleOnly
    );
  }
  return {
    currentMatch: -1,
    matchCount,
  };
}
