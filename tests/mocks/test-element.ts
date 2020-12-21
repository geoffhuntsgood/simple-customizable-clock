export class TestElement {
  text = "";
  x = 0;
  y = 0;
  style = {
    display: "none",
    fill: ""
  };
}

export class TestArcElement extends TestElement {
  sweepAngle = 360;
}

export class TestRectElement extends TestElement {
  width = 300;
  height = 300;
}
