import { describe, it, expect } from 'vitest';
import { reducer } from './Reducer';
import { IState } from './Store';
import { CopyResult, AttributeType } from '../helpers/ChromeExtensionApi';
import { EN } from '../helpers/Localization';
import {
  UpdateQuerySelectorStateAction,
  SetAttributesHierarchyAction,
  ToggleVisibilityClickAction,
  UpdateMatchStateAction,
  ToggleDarkModeClickAction,
  CopyResultAction,
  ToggleSettingsExpansionAction,
  ShowQuerySelectorAction,
  ShowTagNamesClickedAction,
  ShowIdsClickedAction,
  ShowClassesClickedAction,
  ShowOtherAttributesClickedAction,
  CustomTagFilterChangeAction,
  CustomTagFilterCancelAction,
  CustomTagFilterSaveAction,
} from './Actions';

// Create a test-friendly initial state (no localStorage dependencies)
const createTestState = (overrides: Partial<IState> = {}): IState => ({
  themeMode: 'system',
  localization: EN,
  chromeExtensionApi: {} as any,
  matchState: { currentMatch: -1, matchCount: -1 },
  unfilteredAttributesHierarchies: [],
  attributesHierarchies: [],
  querySelectorState: [],
  visibleOnly: false,
  copyResult: CopyResult.DEFAULT,
  settingsExpanded: false,
  showQuerySelector: true,
  showTagNames: true,
  showIds: true,
  showClasses: true,
  showOtherAttributes: true,
  stickyFooterButtons: true,
  customTagFilters: '',
  customTagFiltersUnsaved: '',
  customTagFiltersError: null,
  ...overrides,
});

describe('reducer', () => {
  describe('UpdateQuerySelectorStateAction', () => {
    it('should update query selector state', () => {
      const state = createTestState();
      const newSelectors = [['.class1'], ['#id']];
      const result = reducer(state, new UpdateQuerySelectorStateAction(newSelectors));
      expect(result.querySelectorState).toEqual(newSelectors);
    });
  });

  describe('SetAttributesHierarchyAction', () => {
    it('should set attributes hierarchy and reset query selector state', () => {
      const state = createTestState({ querySelectorState: [['.old']] });
      const hierarchy = [
        [{ name: AttributeType.TagName, value: 'div' }, { name: AttributeType.Class, value: 'container' }],
      ] as any;
      
      const result = reducer(state, new SetAttributesHierarchyAction(hierarchy));
      
      expect(result.unfilteredAttributesHierarchies).toEqual(hierarchy);
      expect(result.querySelectorState).toEqual([]);
    });

    it('should filter out tag names when showTagNames is false', () => {
      const state = createTestState({ showTagNames: false });
      const hierarchy = [
        [
          { name: AttributeType.TagName, value: 'div' },
          { name: AttributeType.Class, value: 'container' },
        ],
      ] as any;
      
      const result = reducer(state, new SetAttributesHierarchyAction(hierarchy));
      
      expect(result.attributesHierarchies[0]).toHaveLength(1);
      expect(result.attributesHierarchies[0][0].name).toBe(AttributeType.Class);
    });
  });

  describe('ToggleVisibilityClickAction', () => {
    it('should toggle visibleOnly from false to true', () => {
      const state = createTestState({ visibleOnly: false });
      const result = reducer(state, new ToggleVisibilityClickAction('', true));
      expect(result.visibleOnly).toBe(true);
    });

    it('should toggle visibleOnly from true to false', () => {
      const state = createTestState({ visibleOnly: true });
      const result = reducer(state, new ToggleVisibilityClickAction('', false));
      expect(result.visibleOnly).toBe(false);
    });
  });

  describe('UpdateMatchStateAction', () => {
    it('should update match state', () => {
      const state = createTestState();
      const matchState = { currentMatch: 3, matchCount: 10 };
      const result = reducer(state, new UpdateMatchStateAction(matchState));
      expect(result.matchState).toEqual(matchState);
    });
  });

  describe('ToggleDarkModeClickAction', () => {
    it('should set theme to dark', () => {
      const state = createTestState({ themeMode: 'light' });
      const result = reducer(state, new ToggleDarkModeClickAction('dark'));
      expect(result.themeMode).toBe('dark');
    });

    it('should set theme to light', () => {
      const state = createTestState({ themeMode: 'dark' });
      const result = reducer(state, new ToggleDarkModeClickAction('light'));
      expect(result.themeMode).toBe('light');
    });

    it('should set theme to system', () => {
      const state = createTestState({ themeMode: 'dark' });
      const result = reducer(state, new ToggleDarkModeClickAction('system'));
      expect(result.themeMode).toBe('system');
    });
  });

  describe('CopyResultAction', () => {
    it('should update copy result to success', () => {
      const state = createTestState();
      const result = reducer(state, new CopyResultAction(CopyResult.SUCCESS));
      expect(result.copyResult).toBe(CopyResult.SUCCESS);
    });

    it('should update copy result to fail', () => {
      const state = createTestState();
      const result = reducer(state, new CopyResultAction(CopyResult.FAIL));
      expect(result.copyResult).toBe(CopyResult.FAIL);
    });
  });

  describe('ToggleSettingsExpansionAction', () => {
    it('should toggle settings expanded from false to true', () => {
      const state = createTestState({ settingsExpanded: false });
      const result = reducer(state, new ToggleSettingsExpansionAction());
      expect(result.settingsExpanded).toBe(true);
    });

    it('should toggle settings expanded from true to false', () => {
      const state = createTestState({ settingsExpanded: true });
      const result = reducer(state, new ToggleSettingsExpansionAction());
      expect(result.settingsExpanded).toBe(false);
    });
  });

  describe('ShowQuerySelectorAction', () => {
    it('should toggle showQuerySelector', () => {
      const state = createTestState({ showQuerySelector: true });
      const result = reducer(state, new ShowQuerySelectorAction());
      expect(result.showQuerySelector).toBe(false);
    });
  });

  describe('Show attribute type toggles', () => {
    it('ShowTagNamesClickedAction should toggle and refilter', () => {
      const state = createTestState({
        showTagNames: true,
        unfilteredAttributesHierarchies: [
          [{ name: AttributeType.TagName, value: 'div' }],
        ] as any,
      });
      const result = reducer(state, new ShowTagNamesClickedAction());
      expect(result.showTagNames).toBe(false);
      expect(result.attributesHierarchies[0]).toHaveLength(0);
    });

    it('ShowIdsClickedAction should toggle and refilter', () => {
      const state = createTestState({
        showIds: true,
        unfilteredAttributesHierarchies: [
          [{ name: AttributeType.Id, value: 'main' }],
        ] as any,
      });
      const result = reducer(state, new ShowIdsClickedAction());
      expect(result.showIds).toBe(false);
      expect(result.attributesHierarchies[0]).toHaveLength(0);
    });

    it('ShowClassesClickedAction should toggle and refilter', () => {
      const state = createTestState({
        showClasses: true,
        unfilteredAttributesHierarchies: [
          [{ name: AttributeType.Class, value: 'container' }],
        ] as any,
      });
      const result = reducer(state, new ShowClassesClickedAction());
      expect(result.showClasses).toBe(false);
      expect(result.attributesHierarchies[0]).toHaveLength(0);
    });

    it('ShowOtherAttributesClickedAction should toggle and refilter', () => {
      const state = createTestState({
        showOtherAttributes: true,
        unfilteredAttributesHierarchies: [
          [{ name: 'data-testid', value: 'test' }],
        ] as any,
      });
      const result = reducer(state, new ShowOtherAttributesClickedAction());
      expect(result.showOtherAttributes).toBe(false);
      expect(result.attributesHierarchies[0]).toHaveLength(0);
    });
  });

  describe('Custom tag filter actions', () => {
    it('CustomTagFilterChangeAction should update unsaved filter and validate', () => {
      const state = createTestState();
      const result = reducer(state, new CustomTagFilterChangeAction('data-.*'));
      expect(result.customTagFiltersUnsaved).toBe('data-.*');
      expect(result.customTagFiltersError).toBeNull();
    });

    it('CustomTagFilterChangeAction should set error for invalid regex', () => {
      const state = createTestState();
      const result = reducer(state, new CustomTagFilterChangeAction('[invalid'));
      expect(result.customTagFiltersUnsaved).toBe('[invalid');
      expect(result.customTagFiltersError).not.toBeNull();
    });

    it('CustomTagFilterCancelAction should revert to saved filters', () => {
      const state = createTestState({
        customTagFilters: 'saved-filter',
        customTagFiltersUnsaved: 'unsaved-changes',
      });
      const result = reducer(state, new CustomTagFilterCancelAction());
      expect(result.customTagFiltersUnsaved).toBe('saved-filter');
    });

    it('CustomTagFilterSaveAction should save unsaved filters', () => {
      const state = createTestState({
        customTagFilters: 'old-filter',
        customTagFiltersUnsaved: 'new-filter',
      });
      const result = reducer(state, new CustomTagFilterSaveAction());
      expect(result.customTagFilters).toBe('new-filter');
    });
  });

  describe('Custom tag filter application', () => {
    it('should filter out attributes matching custom tag filter regex', () => {
      const state = createTestState({
        customTagFiltersUnsaved: 'data-testid',
        unfilteredAttributesHierarchies: [
          [
            { name: 'data-testid', value: 'submit' },
            { name: 'role', value: 'button' },
          ],
        ] as any,
      });
      
      // Trigger a refilter via SetAttributesHierarchyAction
      const result = reducer(state, new SetAttributesHierarchyAction(
        state.unfilteredAttributesHierarchies
      ));
      
      expect(result.attributesHierarchies[0]).toHaveLength(1);
      expect(result.attributesHierarchies[0][0].name).toBe('role');
    });
  });

  describe('unknown action', () => {
    it('should return state unchanged for unknown action type', () => {
      const state = createTestState();
      const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
      const result = reducer(state, unknownAction);
      expect(result).toBe(state);
    });
  });
});

