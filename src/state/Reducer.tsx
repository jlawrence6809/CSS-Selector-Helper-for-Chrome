import { AttributesHierarchy, AttributeType } from "../helpers/ChromeExtensionApi";
import { buildSelector, testCustomTagFilters } from "../helpers/Helpers";
import {
	Actions,
	UpdateQuerySelectorStateType,
	SetAttributesHierarchyType,
	ToggleVisibilityClickType,
	UpdateMatchStateType,
	ToggleDarkModeClickType,
	CopyResultActionType,
	ToggleSettingsExpansionActionType,
	CustomTagFilterChangeActionType,
	ShowClassesClickedActionType,
	ShowIdsClickedActionType,
	ShowOtherAttributesClickedActionType,
	ShowTagNamesClickedActionType,
	CustomTagFilterSaveActionType,
	CustomTagFilterCancelActionType,
	ShowQuerySelectorActionType,
} from "./Actions";
import { INITIAL_STATE, IState } from "./Store";

function applyFiltersToAttributeHierarchy(state: IState): IState {
    const tagFilters = state.customTagFiltersUnsaved?.split('\n')
        ?.filter(s => s !== '');
    // sanity check these to make sure the component does not break
    const sanityCheckTagFilter = testCustomTagFilters(state.customTagFiltersUnsaved);
    if (sanityCheckTagFilter !== null) {
        state.customTagFiltersError = sanityCheckTagFilter;
    }

    state.attributesHierarchies = state.unfilteredAttributesHierarchies.map(ah => {
        return ah.filter(attr => {

            if (!state.showTagNames && attr.name === AttributeType.TagName) {
                return false;
            }
            if (!state.showIds && attr.name === AttributeType.Id) {
                return false;
            }
            if (!state.showClasses && attr.name === AttributeType.Class) {
                return false;
            }
            const isOther = attr.name !== AttributeType.TagName && attr.name !== AttributeType.Id && attr.name !== AttributeType.Class;
            if (!state.showOtherAttributes && isOther) {
                return false;
            }
            if (isOther && sanityCheckTagFilter === null) {
                const selector = buildSelector(attr);
                if (!!tagFilters.find(f => selector.match(f))) {
                    return false;
                }
            }
            return true;
        });
    }) as AttributesHierarchy[];
    return state;
}

export function reducer(state: IState, action: Actions): IState {
    switch(action.type) {
        case UpdateQuerySelectorStateType:
            return {
                ...state,
                querySelectorState: action.querySelectorState,
            };
        case SetAttributesHierarchyType:
            return applyFiltersToAttributeHierarchy({
                ...state,
                querySelectorState: INITIAL_STATE.querySelectorState,
                unfilteredAttributesHierarchies: action.attributesHierarchy,
                attributesHierarchies: action.attributesHierarchy,
            });
        case ToggleVisibilityClickType:
            return {
                ...state,
                visibleOnly: !state.visibleOnly,
            }
        case UpdateMatchStateType:
            return {
                ...state,
                matchState: action.matchState,
            };
        case ToggleDarkModeClickType:
            return {
                ...state,
                themeMode: action.theme,
            };
        case CopyResultActionType:
            return {
                ...state,
                copyResult: action.copyResult,
            };
        case ToggleSettingsExpansionActionType:
            return {
                ...state,
                settingsExpanded: !state.settingsExpanded,
            };
        case ShowQuerySelectorActionType:
            return {
                ...state,
                showQuerySelector: !state.showQuerySelector,
            };
        case ShowTagNamesClickedActionType:
            return applyFiltersToAttributeHierarchy({
                ...state,
                showTagNames: !state.showTagNames,
            });
        case ShowIdsClickedActionType:
            return applyFiltersToAttributeHierarchy({
                ...state,
                showIds: !state.showIds,
            });
        case ShowClassesClickedActionType:
            return applyFiltersToAttributeHierarchy({
                ...state,
                showClasses: !state.showClasses,
            });
        case ShowOtherAttributesClickedActionType:
            return applyFiltersToAttributeHierarchy({
                ...state,
                showOtherAttributes: !state.showOtherAttributes,
            });
        case CustomTagFilterChangeActionType:
            return applyFiltersToAttributeHierarchy({
                ...state,
                customTagFiltersUnsaved: action.value,
                customTagFiltersError: testCustomTagFilters(action.value),
            });
        case CustomTagFilterCancelActionType:
            return {
                ...state,
                customTagFiltersUnsaved: state.customTagFilters,
            };
        case CustomTagFilterSaveActionType:
            return {
                ...state,
                customTagFilters: state.customTagFiltersUnsaved,
            };
    }
    return state;
}