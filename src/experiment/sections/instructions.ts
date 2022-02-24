import InstructionsPlugin from "@jspsych/plugin-instructions";

import {
  display,
  center_text,
  box_text,
  context_boxes,
} from "../html_components";
import { ContextColor } from "../sequence/components/constants";

export function instructions(
  upperColor: ContextColor,
  lowerColor: ContextColor
) {
  const continue_hint = "Please press the right arrow key to continue &#x27A1";
  const backtrack_hint = "&#x2B05 Left arrow key to go back";

  const hint = (backtrack = false) => {
    if (backtrack) {
      return box_text(continue_hint + "</p><p>" + backtrack_hint, ["hint"]);
    } else {
      return box_text(continue_hint, ["hint"]);
    }
  };

  const boxes = context_boxes(upperColor, lowerColor);

  const instructions_text = [
    display(center_text("Welcome!"), hint()),
    display(
      center_text(
        "Please move your mouse to the edge of your screen, so that is no longer visible."
      ),
      hint(true)
    ),
    display(
      boxes,
      center_text(
        "In this experiment you will see a box surrounding a sequence of five letters like this:"
      ),
      box_text("AAFAA", ["bottom"]),
      hint(true)
    ),
    display(
      center_text(
        "There are four possible letters you can encounter: <br>'A' or 'F', and 'S' or 'H'"
      ),
      hint(true)
    ),
    display(
      boxes,
      center_text(
        "The four outermost letters will always be the same while the center letter can be different, like this:"
      ),
      box_text("FFAFF", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text(
        "You should respond to the middle letter, in this case to the letter 'A'"
      ),
      box_text(
        "<span class='gray'>FF</span><b>A</b><span class='gray'>FF</span>",
        ["bottom"]
      ),
      hint(true)
    ),

    // Response keys
    display(
      center_text(
        "You respond using keys [J] and [L]. Use your right hand to respond." +
          "<br><br>[J] is for letters 'A' and 'S'" +
          "<br><br>[L] is for letters 'F' and 'H'"
      ),
      hint(true)
    ),

    // Show-case
    display(
      boxes,
      center_text(
        "You will now see all the possible combinations of letters and responses"
      ),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should respond with the [J] key"),
      box_text("AAAAA", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should also respond with the [J] key"),
      box_text("FFAFF", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should respond with the [L] key"),
      box_text("FFFFF", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should also respond with the [L] key"),
      box_text("AAFAA", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should respond with the [J] key"),
      box_text("SSSSS", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should also respond with the [J] key"),
      box_text("HHSHH", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should respond with the [L] key"),
      box_text("HHHHH", ["bottom"]),
      hint(true)
    ),
    display(
      boxes,
      center_text("Here you should also respond with the [L] key"),
      box_text("SSHSS", ["bottom"]),
      hint(true)
    ),

    // Context show-case
    display(
      center_text(
        "There are two boxes in which these letters will be shown<br>",
        "You will select whether the stimulus is to be displayed above or below. " +
          `For this selection, please use the keys [S] and [F] with your left hand.`
      ),
      hint(true)
    ),
    display(
      boxes,
      center_text(
        `Whether the [S] and [F] keys select the <span class="${upperColor}">upper</span> or <span class="${lowerColor}">lower</span> boxes changes from trial to trial`,
        "You will see which key selects what box by their color"
      ),
      hint(true)
    ),
    display(
      center_text(`You might get a trial where it looks like this:`),
      hint(true)
    ),
    display(
      boxes,
      center_text(
        `Please choose between <span class='${upperColor}'>[S]</span> and <span class='${lowerColor}'>[F]</span>`
      ),
      hint(true)
    ),
    display(center_text(`or this...`), hint(true)),
    display(
      boxes,
      center_text(
        `Please choose between <span class='${lowerColor}'>[S]</span> and <span class='${upperColor}'>[F]</span>`
      ),
      hint(true)
    ),
    display(
      center_text(
        "Selecting the key that matches the color of a box will select that box",
        `That is, <span class='${upperColor}'>[S]</span> for upper box, ` +
          `<span class='${lowerColor}'>[S]</span> for lower box, ` +
          `<span class='${upperColor}'>[F]</span> for upper box, ` +
          `and <span class='${lowerColor}'>[F]</span> for lower box.`
      ),
      hint(true)
    ),
    display(
      center_text(
        "Decide spontaneously and do not use any particular strategy. Please try to choose both positions about the same number of times."
      ),
      hint(true)
    ),
    display(
      center_text(
        "Before each trial, a '+' will be displayed here in the center. Please center your eyes on this area before each trial."
      ),
      hint(true)
    ),
    display(boxes, center_text("+"), hint(true)),
    display(boxes, box_text("HHSHH", ["top"]), hint(true)),
    display(
      boxes,
      center_text("Here you should respond with the [J] key"),
      box_text("HHSHH", ["top"]),
      hint(true)
    ),
    display(boxes, center_text("+"), hint(true)),
    display(boxes, box_text("FFFFF", ["bottom"]), hint(true)),
    display(
      boxes,
      center_text("Here you should respond with the [L] key"),
      box_text("FFFFF", ["bottom"]),
      hint(true)
    ),

    // Last slide
    display(
      center_text(
        "You will begin with a practice round and then there will be 8 blocks of 100 trials." +
          "<br><br><br><br>When you are ready to <b>start</b> press the right arrow key &#x27A1"
      ),
      box_text(backtrack_hint, ["hint"])
    ),
  ];

  return {
    type: InstructionsPlugin,
    pages: instructions_text,
  };
}
