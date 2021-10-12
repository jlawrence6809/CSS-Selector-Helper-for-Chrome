import { Attribute, AttributeType } from "./ChromeExtensionApi";
import { QuerySelectorState } from "../state/Store";

export function compareAttributesForSort(a: Attribute, b: Attribute): number {
  if (a.name === b.name) {
    // should only apply to classes and "other"
    return a.value > b.value ? 1 : -1;
  }
  const getOrder = (type: AttributeType | string) => {
    switch(type) {
      case AttributeType.TagName:
        return 3;
      case AttributeType.Id:
        return 2;
      case AttributeType.Class:
        return 1;
    }
    return 0;
  };
  const orderA = getOrder(a.name);
  const orderB = getOrder(b.name);
  if (orderA === 0 && orderB === 0) {
    // when they are both type "other" we should sort by the name instead
    return a.name > b.name ? 1 : -1;
  }
  return orderB - orderA;
}
 
export function buildSelector(attribute: Attribute): string {
  switch(attribute.name){
    case AttributeType.TagName:
      return attribute.value;
    case AttributeType.Id:
      return '#' + attribute.value;
    case AttributeType.Class:
      return '.' + attribute.value;
  }
  return "[" + attribute.name + "='" + attribute.value + "']";
}

export function getQuerySelectorString(selectors: QuerySelectorState): string {
  return selectors.filter(arr => !!arr)
      .map(rowSelectors => rowSelectors.join(''))
      .filter(sel => !!sel)
      .join(' ');
}

export function testCustomTagFilters(customTagFilters: string): string | null {
  const tagFilters = customTagFilters?.split('\n')
      ?.filter(s => s !== '');
  try {
      tagFilters.forEach(f => RegExp(f));
  } catch(e) {
      return e.message;
  }
  return null;
}
