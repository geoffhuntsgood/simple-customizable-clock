import TestElement, { TestArcElement, TestRectElement } from "./test-element";

export const defaultArc = new TestArcElement();
export const defaultIcon = new TestElement();
export const defaultText = new TestElement();
export const defaultRect = new TestRectElement();

export default {
  getElementById(id: string): TestElement {
    if (id.includes("Arc")) {
      return defaultArc;
    } else if (id.includes("Icon")) {
      return defaultIcon;
    } else if (id.includes("Text")) {
      return defaultText;
    } else if (id === "root") {
      return defaultRect;
    }
    return new TestElement();
  }
};
