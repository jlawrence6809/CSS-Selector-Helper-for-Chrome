import InjectString from "./EvalFunctions";

/**
 * Fill this in as new extension api features are used.
 */
type EvalFunc = (
  evalString: string,
  callback: (result: any, isException: boolean) => void
) => void;
type RawChrome = {
  runtime: object;
  devtools: {
    panels: {
      themeName: ChromeTheme;
    };
    inspectedWindow: {
      eval: EvalFunc;
    };
  };
  storage: {
    sync: any;
  };
};

type HelperScript = "getAttributesFromElems" | "selectElem" | "isElemVisible";

/**
 * Note that frames isn't really used. I don't think its possible to extend the extension to inner iframes. Needs more
 * research
 */
type RawAttributesAndFramesHierarchy = {
  frames: [];
  attributes: AttributesHierarchy[];
};

export type ChromeTheme = "default" | "dark";

export enum CopyResult {
  DEFAULT = "DEFAULT",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

export type AttributesHierarchy = [Attribute];

export type Attribute = {
  name: string;
  value: string;
};

export enum AttributeType {
  TagName = "tagName",
  Id = "id",
  Class = "class",
}

export type SelectElementResult = {
  currentMatch: number;
  matchCount: number;
};

export default class ChromeExtensionApi {
  getTheme(): ChromeTheme {
    return this.getRawChromeApi().devtools.panels.themeName;
  }

  async getAttributesHierarchyForCurrentlySelectedElementOnPage(): Promise<
    AttributesHierarchy[]
  > {
    const rawAttributesAndFramesHierarchy: RawAttributesAndFramesHierarchy =
      await this.runHelperScript("getAttributesFromElems");
    return rawAttributesAndFramesHierarchy.attributes.reverse();
  }

  async getNumberOfMatches(
    querySelector: string,
    visibleOnly: boolean
  ): Promise<number> {
    let result = await this.runSelectElemScript(
      querySelector,
      -1,
      visibleOnly,
      false
    );
    return result.matchCount;
  }

  async runSelectElemScript(
    querySelector: string,
    desiredMatch: number,
    visibleOnly: boolean,
    inspectCurrentMatch: boolean
  ): Promise<SelectElementResult> {
    const args = [
      querySelector,
      desiredMatch + "",
      visibleOnly + "",
      inspectCurrentMatch + "",
    ];
    const { curMatch, numMatch } = await this.runHelperScript(
      "selectElem",
      args
    );
    return {
      currentMatch: curMatch,
      matchCount: numMatch,
    };
  }

  private async runHelperScript(
    script: HelperScript,
    args?: string[]
  ): Promise<any> {
    const alreadyInjectedEval =
      "(function(){return (typeof " + script + " !== 'undefined');}());";
    const alreadyInjected = await this.runInInspectedWindow(
      alreadyInjectedEval
    ); // error handling?

    //unroll args into script
    let evalStr = "var lastSelectedElem = $0; var myInspect = inspect; ";
    if (!alreadyInjected) {
      evalStr += InjectString; // injectString is in evalHelpers.js
    }

    // build args string. Args themselves must be strings.
    let argsStr = "";
    if (!!args && args.length > 0) {
      argsStr = `"${args.join('","')}"`;
    }

    // create function call of script. Eg: myFunc("arg0", "arg1").
    evalStr += `${script}(${argsStr});`;

    return await this.runInInspectedWindow(evalStr);
  }

  // todo: make private
  public async runInInspectedWindow(evalString: string): Promise<any> {
    const evalF = this.getRawChromeApi().devtools.inspectedWindow.eval;
    return new Promise((resolve, reject) => {
      evalF(evalString, (result, isException) => {
        if (isException) {
          console.error(`Eval string rejected\n${evalString}`);
          reject(result);
        }
        resolve(result);
      });
    });
  }

  private getRawChromeApi(): RawChrome {
    const chrome = (window as any)?.chrome as RawChrome | null;
    if (!chrome) {
      throw new Error("Could not access chrome!");
    }
    return chrome;
  }
}
