import * as functions from "../../app/app-functions";
import { defaultArc, defaultIcon, defaultText } from "../mocks/document.mock";

// placeItem()
test("Places the arc, icon, and text elements for an activity", () => {
  functions.placeItem("test", 150, 150);
  expect(defaultArc.style.display).toBe("inline");
  expect(defaultArc.x).toBe(120);
  expect(defaultArc.y).toBe(120);
  expect(defaultIcon.style.display).toBe("inline");
  expect(defaultIcon.x).toBe(135);
  expect(defaultIcon.y).toBe(135);
  expect(defaultText.style.display).toBe("inline");
  expect(defaultText.x).toBe(148);
  expect(defaultText.y).toBe(205);
});
