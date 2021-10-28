import { ThemeMode } from "../components/Settings";
import { AttributesHierarchy, CopyResult } from "../helpers/ChromeExtensionApi";
import { MatchState, QuerySelectorState } from "./Store";

interface Action {
    type: string;
}

export const AttributeButtonClickType = 'AttributeButtonClick';
export class AttributeButtonClickAction implements Action {
    readonly type = AttributeButtonClickType;
    constructor(
        public querySelectorState: QuerySelectorState,
        public visibleOnly: boolean,
        public metaPressed: boolean,
        public selector: string,
        public rowIdx: number,
        public buttonIdx: number,
    ) {}
}

export const ClickGetSelectorsType = 'ClickGetSelectors';
export class ClickGetSelectorsAction implements Action {
    readonly type = ClickGetSelectorsType;
}

export const ToggleVisibilityClickType = 'ToggleVisibilityClick';
export class ToggleVisibilityClickAction implements Action {
    readonly type = ToggleVisibilityClickType;
    constructor(
        public querySelector: string,
        public visibleOnly: boolean,
    ) {}
}

export const ClickCopySelectorToClipboardType = 'ClickCopySelectorToClipboard';
export class ClickCopySelectorToClipboardAction implements Action {
    readonly type = ClickCopySelectorToClipboardType;
    constructor(public selector: string) {}
}

export const ToggleDarkModeClickType = 'ToggleDarkModeClick';
export class ToggleDarkModeClickAction implements Action {
    readonly type = ToggleDarkModeClickType;
    constructor(public theme: ThemeMode) {}
}

export const ClickPrevType = 'ClickPrev';
export class ClickPrevAction implements Action {
    readonly type = ClickPrevType;
    constructor(
        public querySelector: string,
        public currentMatch: number,
        public visibleOnly: boolean,
    ){}
}

export const ClickNextType = 'ClickNext';
export class ClickNextAction implements Action {
    readonly type = ClickNextType;
    constructor(
        public querySelector: string,
        public currentMatch: number,
        public visibleOnly: boolean,
    ){}
}

export const SetAttributesHierarchyType = 'SetAttributeHierarchy';
export class SetAttributesHierarchyAction implements Action {
    readonly type = SetAttributesHierarchyType;
    constructor(
        public attributesHierarchy: AttributesHierarchy[],
    ) {}
}

export const UpdateMatchStateType = 'UpdateMatchState';
export class UpdateMatchStateAction implements Action {
    readonly type = UpdateMatchStateType;
    constructor(
        public matchState: MatchState,
    ) {}
}

export const UpdateQuerySelectorStateType = 'UpdateQuerySelectorStateType';
export class UpdateQuerySelectorStateAction implements Action {
    readonly type = UpdateQuerySelectorStateType;
    constructor(
        public querySelectorState: QuerySelectorState,
    ) {}
}

export const CopyResultActionType = 'CopyResultActionType';
export class CopyResultAction implements Action {
    readonly type = CopyResultActionType;
    constructor(
        public copyResult: CopyResult,
    ) {}
}

export const ToggleSettingsExpansionActionType = 'ToggleSettingsExpansionActionType';
export class ToggleSettingsExpansionAction implements Action {
    readonly type = ToggleSettingsExpansionActionType;
}

export const ShowQuerySelectorActionType = 'ShowQuerySelectorActionType';
export class ShowQuerySelectorAction implements Action {
    readonly type = ShowQuerySelectorActionType;
}

export const ShowTagNamesClickedActionType = 'ShowTagNamesClickedActionType';
export class ShowTagNamesClickedAction implements Action {
    readonly type = ShowTagNamesClickedActionType;
}

export const ShowIdsClickedActionType = 'ShowIdsClickedActionType';
export class ShowIdsClickedAction implements Action {
    readonly type = ShowIdsClickedActionType;
}

export const ShowClassesClickedActionType = 'ShowClassesClickedActionType';
export class ShowClassesClickedAction implements Action {
    readonly type = ShowClassesClickedActionType;
}

export const ShowOtherAttributesClickedActionType = 'ShowOtherAttributesClickedActionType';
export class ShowOtherAttributesClickedAction implements Action {
    readonly type = ShowOtherAttributesClickedActionType;
}

export const CustomTagFilterChangeActionType = 'CustomTagFilterChangeActionType';
export class CustomTagFilterChangeAction implements Action {
    readonly type = CustomTagFilterChangeActionType;
    constructor(
        public value: string,
    ){}
}

export const CustomTagFilterCancelActionType = 'CustomTagFilterCancelActionType';
export class CustomTagFilterCancelAction implements Action {
    readonly type = CustomTagFilterCancelActionType;
}

export const CustomTagFilterSaveActionType = 'CustomTagFilterSaveActionType';
export class CustomTagFilterSaveAction implements Action {
    readonly type = CustomTagFilterSaveActionType;
}

export type Actions = 
    AttributeButtonClickAction
    | ClickGetSelectorsAction
    | ToggleVisibilityClickAction
    | ClickCopySelectorToClipboardAction
    | ToggleDarkModeClickAction
    | ClickPrevAction
    | ClickNextAction
    | SetAttributesHierarchyAction
    | UpdateMatchStateAction
    | UpdateQuerySelectorStateAction
    | CopyResultAction
    | ToggleSettingsExpansionAction
    | ShowQuerySelectorAction
    | ShowTagNamesClickedAction
    | ShowIdsClickedAction
    | ShowClassesClickedAction
    | ShowOtherAttributesClickedAction
    | CustomTagFilterChangeAction
    | CustomTagFilterCancelAction
    | CustomTagFilterSaveAction;
