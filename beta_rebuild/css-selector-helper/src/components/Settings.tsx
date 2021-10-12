import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Settings.css';
import { CancelXIcon, checkIcon, settingsIcon } from './Icons';
import { Actions, CustomTagFilterCancelAction, CustomTagFilterChangeAction, CustomTagFilterSaveAction, ShowClassesClickedAction, ShowIdsClickedAction, ShowOtherAttributesClickedAction, ShowQuerySelectorAction, ShowTagNamesClickedAction, ToggleDarkModeClickAction, ToggleSettingsExpansionAction } from '../state/Actions';
import { StoreContext } from '../state/Store';
import {PlusDarkTheme} from './Theme';

export type ThemeMode = "system" | "dark" | "light";


const Settings = () => {
  const {state, dispatch} = useContext(StoreContext);

  return (
    <div className={"settingsBody"}>
        <div className="closeButton" onClick={() => dispatch(new ToggleSettingsExpansionAction())}>
          <CancelXIcon />
        </div>
        <Checkbox
          checked={state.showQuerySelector}
          action={new ShowQuerySelectorAction()}
          label={state.localization.SETTINGS_SHOW_QUERY_SELECTOR}
        />
        <Divider />
        <Checkbox
          checked={state.showTagNames}
          action={new ShowTagNamesClickedAction()}
          label={state.localization.SETTINGS_SHOW_TAG_NAMES}
        />
        <Divider />
        <Checkbox
          checked={state.showIds}
          action={new ShowIdsClickedAction()}
          label={state.localization.SETTINGS_SHOW_IDS}
        />
        <Divider />
        <Checkbox
          checked={state.showClasses}
          action={new ShowClassesClickedAction()}
          label={state.localization.SETTINGS_SHOW_CLASSES}
        />
        <Divider />
        <Checkbox
          checked={state.showOtherAttributes}
          action={new ShowOtherAttributesClickedAction()}
          label={state.localization.SETTINGS_SHOW_OTHER_ATTRIBUTES}
        />
        <Divider />
        <div>
          <select onChange={(e) => dispatch(new ToggleDarkModeClickAction(e.target.value as ThemeMode))}>
            <option value="system">{state.localization.SETTINGS_MODE_SYSTEM}</option>
            <option value="light">{state.localization.SETTINGS_MODE_LIGHT}</option>
            <option value="dark">{state.localization.SETTINGS_MODE_DARK}</option>
          </select>
          <label className="mb-0 ml-2">Dark mode</label>
        </div>
        <Divider />
        <div className="customTagFilters mt-2">
          <label>{state.localization.SETTINGS_CUSTOM_TAG_FILTERS}:</label>
          <div className="ml-3 mr-2">
            <div className="helpText mb-1">{state.localization.SETTINGS_CUSTOM_TAG_FILTERS_HELP}</div>
            <textarea
              className="w-100"
              wrap="soft"
              placeholder="target='_blank'"
              value={state.customTagFiltersUnsaved}
              onChange={(event) => dispatch(new CustomTagFilterChangeAction(event.target.value))}
            ></textarea>
            <div>
              <button
                className="iconButton mr-2"
                disabled={state.customTagFilters === state.customTagFiltersUnsaved}
                onClick={() => dispatch(new CustomTagFilterCancelAction())}
              >
                <CancelXIcon themed={false} />
              </button>
              <button
                className="iconButton"
                disabled={state.customTagFilters === state.customTagFiltersUnsaved}
                onClick={() => dispatch(new CustomTagFilterSaveAction())}
              > {checkIcon} </button>
              <div>{state.customTagFiltersError}</div>
            </div>
          </div>
        </div>
        <Divider />
    </div>
  );
};
export default Settings;

export const SettingsButton = () => {
  const {dispatch} = useContext(StoreContext);
  return (
    <button className="iconButton mb-2" onClick={() => dispatch(new ToggleSettingsExpansionAction())}>
      {settingsIcon}
    </button>
  );
};

type DividerProps = {
  narrow?: boolean;
};
export const Divider = ({
  narrow = false,
}: DividerProps) => (<hr className={PlusDarkTheme(`divider${narrow ? " narrow" : ""}`)}/>);

type CheckboxProps = {checked: boolean, action: Actions, label: string};
const Checkbox = ({checked, action, label}: CheckboxProps) => {
  const {dispatch} = useContext(StoreContext);
  return (
    <div className="checkbox">
      <input type="checkbox" className="mr-2" checked={checked} onClick={() => dispatch(action)}></input>
      <label className="mb-0">{label}</label>
    </div>
  );
};
