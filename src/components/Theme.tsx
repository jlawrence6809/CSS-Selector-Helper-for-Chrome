import { useContext } from "react";
import { StoreContext } from "../state/Store";

export const useTheme = (): "dark" | "light" => {
  const { state } = useContext(StoreContext);
  const useDark =
    state.themeMode === "dark" ||
    (state.themeMode === "system" &&
      state.chromeExtensionApi.getTheme() === "dark");
  return useDark ? "dark" : "light";
};

export const PlusDarkTheme = (classString: string) => {
  const theme = useTheme();
  return classString + (theme === "dark" ? " dark-theme" : "");
};
