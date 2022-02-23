export function display(...args: string[]) {
  return "<div class='display'>" + Array.from(args).join("") + "</div>";
}

export const context_boxes = (upper: string, lower: string) =>
  `<div class='top ${upper}'></div><div class='bottom ${lower}'></div>`;

//export const trial_display = display.bind(null, context_boxes);

export function paragraphs(...args: string[]) {
  return `<p>${Array.from(args).join("</p><p>")}</p>`;
}

export function center_text(...args: string[]) {
  return `<div class='center-text'><p>${Array.from(args).join(
    "</p><p>"
  )}</p></div>`;
}

export function center_error(...args: string[]) {
  return `<div class='center-text error'><p>${Array.from(args).join(
    "</p><p>"
  )}</p></div>`;
}

export const box_text = (text: string, classes: string[] | undefined) => {
  if (classes === undefined) {
    classes = [];
  }
  return `<div class='${classes.join(" ")}'><p>${text}</p></div>`;
};
