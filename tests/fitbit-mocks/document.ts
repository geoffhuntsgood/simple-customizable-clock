class TestElement {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  style = {
    display: 'none'
  };
}

export default {
  arc: new TestElement() as ArcElement,
  icon: new TestElement() as ImageElement,
  text: new TestElement() as TextElement,
  root: new TestElement() as RectElement,

  getElementById(id: string) {
    if (id.includes('Arc')) {
      return this.arc;
    } else if (id.includes('Icon')) {
      return this.icon;
    } else if (id.includes('Text')) {
      return this.text;
    } else {
      return this.root;
    }
  }
}
