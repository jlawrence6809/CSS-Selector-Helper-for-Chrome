import { describe, it, expect } from 'vitest';
import {
  buildSelector,
  getQuerySelectorString,
  testCustomTagFilters,
  compareAttributesForSort,
} from './Helpers';
import { AttributeType } from './ChromeExtensionApi';

describe('buildSelector', () => {
  it('should build tag name selector', () => {
    expect(buildSelector({ name: AttributeType.TagName, value: 'div' })).toBe('div');
    expect(buildSelector({ name: AttributeType.TagName, value: 'span' })).toBe('span');
  });

  it('should build id selector with #', () => {
    expect(buildSelector({ name: AttributeType.Id, value: 'main' })).toBe('#main');
    expect(buildSelector({ name: AttributeType.Id, value: 'header' })).toBe('#header');
  });

  it('should build class selector with .', () => {
    expect(buildSelector({ name: AttributeType.Class, value: 'container' })).toBe('.container');
    expect(buildSelector({ name: AttributeType.Class, value: 'btn-primary' })).toBe('.btn-primary');
  });

  it('should build attribute selector for other attributes', () => {
    expect(buildSelector({ name: 'data-testid', value: 'submit-btn' })).toBe("[data-testid='submit-btn']");
    expect(buildSelector({ name: 'href', value: '/home' })).toBe("[href='/home']");
    expect(buildSelector({ name: 'role', value: 'button' })).toBe("[role='button']");
  });
});

describe('getQuerySelectorString', () => {
  it('should return empty string for empty array', () => {
    expect(getQuerySelectorString([])).toBe('');
  });

  it('should join selectors within a row', () => {
    expect(getQuerySelectorString([['.class1', '.class2']])).toBe('.class1.class2');
  });

  it('should join rows with spaces (descendant combinator)', () => {
    expect(getQuerySelectorString([['.parent'], ['.child']])).toBe('.parent .child');
  });

  it('should handle complex selector chains', () => {
    expect(getQuerySelectorString([
      ['div', '.container'],
      ['#main'],
      ['span', '.highlight']
    ])).toBe('div.container #main span.highlight');
  });

  it('should filter out empty rows', () => {
    expect(getQuerySelectorString([[], ['.class'], []])).toBe('.class');
  });

  it('should handle sparse arrays (undefined entries)', () => {
    const sparse: string[][] = [];
    sparse[2] = ['.class'];
    expect(getQuerySelectorString(sparse)).toBe('.class');
  });
});

describe('testCustomTagFilters', () => {
  it('should return null for valid regex patterns', () => {
    expect(testCustomTagFilters('.*')).toBeNull();
    expect(testCustomTagFilters('data-.*')).toBeNull();
    expect(testCustomTagFilters('[a-z]+')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(testCustomTagFilters('')).toBeNull();
  });

  it('should return null for multiple valid patterns', () => {
    expect(testCustomTagFilters('pattern1\npattern2\npattern3')).toBeNull();
  });

  it('should return error message for invalid regex', () => {
    const result = testCustomTagFilters('[invalid');
    expect(result).not.toBeNull();
    expect(result).toContain('Invalid');
  });

  it('should handle patterns with empty lines', () => {
    expect(testCustomTagFilters('valid\n\npattern')).toBeNull();
  });
});

describe('compareAttributesForSort', () => {
  it('should sort tagName before id', () => {
    const tagName = { name: AttributeType.TagName, value: 'div' };
    const id = { name: AttributeType.Id, value: 'main' };
    expect(compareAttributesForSort(tagName, id)).toBeLessThan(0);
    expect(compareAttributesForSort(id, tagName)).toBeGreaterThan(0);
  });

  it('should sort id before class', () => {
    const id = { name: AttributeType.Id, value: 'main' };
    const cls = { name: AttributeType.Class, value: 'container' };
    expect(compareAttributesForSort(id, cls)).toBeLessThan(0);
    expect(compareAttributesForSort(cls, id)).toBeGreaterThan(0);
  });

  it('should sort class before other attributes', () => {
    const cls = { name: AttributeType.Class, value: 'container' };
    const other = { name: 'data-testid', value: 'test' };
    expect(compareAttributesForSort(cls, other)).toBeLessThan(0);
    expect(compareAttributesForSort(other, cls)).toBeGreaterThan(0);
  });

  it('should sort same-type attributes by value', () => {
    const classA = { name: AttributeType.Class, value: 'alpha' };
    const classB = { name: AttributeType.Class, value: 'beta' };
    expect(compareAttributesForSort(classA, classB)).toBeLessThan(0);
    expect(compareAttributesForSort(classB, classA)).toBeGreaterThan(0);
  });

  it('should sort other attributes by name', () => {
    const attrA = { name: 'aria-label', value: 'test' };
    const attrB = { name: 'data-testid', value: 'test' };
    expect(compareAttributesForSort(attrA, attrB)).toBeLessThan(0);
    expect(compareAttributesForSort(attrB, attrA)).toBeGreaterThan(0);
  });
});

