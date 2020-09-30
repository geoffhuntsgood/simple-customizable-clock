class TestElement {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  style = {
    display: 'none'
  };
}

let arc = new TestElement() as ArcElement;
let icon = new TestElement() as ImageElement;
let text = new TestElement() as TextElement;
let root = new TestElement() as RectElement;

function getElementById(id: string) {
  if (id.includes('Arc')) {
    return arc;
  } else if (id.includes('Icon')) {
    return icon;
  } else if (id.includes('Text')) {
    return text;
  } else {
    return root;
  }
}

module.exports = {getElementById, arc, icon, text, root};
