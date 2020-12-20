import document from "document";

// Sets x/y coordinates for an activity item.
export const placeItem = (name: string, x: number, y: number): void => {
  let arc = document.getElementById(`${name}Arc`) as ArcElement;
  let icon = document.getElementById(`${name}Icon`) as ImageElement;
  let text = document.getElementById(`${name}Text`) as TextElement;
  arc.style.display = "inline";
  icon.style.display = "inline";
  text.style.display = "inline";
  arc.x = x - 30;
  arc.y = y - 30;
  icon.x = x - 15;
  icon.y = y - 15;
  text.x = x - 2;
  text.y = y + 55;
};
