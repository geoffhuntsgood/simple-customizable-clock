class TestElement {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  style = {
    display: 'none'
  };
}

let arc: ArcElement = new TestElement() as ArcElement;

let icon: ImageElement = new TestElement() as ImageElement;

let text: TextElement = new TestElement() as TextElement;

let root: RectElement = new TestElement() as RectElement;

function getElementById(id: string) {
  if (id.includes('Arc')) {
    return arc;
  } else if (id.includes('Icon')) {
    return icon;
  } else if (id.includes('Text')) {
    return text;
  } else if (id === 'root') {
    return root;
  } else {
    console.log('What are you doing?');
    return null;
  }
}

module.exports = {getElementById, arc, icon, text, root};