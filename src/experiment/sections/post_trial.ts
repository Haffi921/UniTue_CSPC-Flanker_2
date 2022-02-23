import { JsPsych } from "jspsych";

import InstructionsPlugin from "@jspsych/plugin-instructions";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import {
  display,
  context_boxes,
  center_text,
  box_text,
} from "../html_components";

function instructions(upperColor: string, lowerColor: string) {
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

  const instructions = [
    display(
      center_text(
        "This is the final portion of the experiment<br>",
        "There will be a total of 8 trials. " +
          "Contrary to earlier trial, there is no time limit." +
          " So, please take your time to select carefully..."
      ) + hint()
    ),
    display(
      center_text(
        "Like before, you will be presented with a sequence of letters. However, this time the middle letter will not be shown.",
        'Your task is to select the letter you <strong>"feel"</strong> should be in the middle'
      ) + hint(true)
    ),
    display(
      boxes,
      box_text("AA AA", ["top"]),
      center_text(
        "An example is shown here above. Here you can select either A or F, using the [a] or [f] keys."
      ) + hint(true)
    ),
    display(
      boxes,
      box_text("SS SS", ["bottom"]),
      center_text(
        "Here you can select either S or H, using the [s] or [h] keys."
      ) + hint(true)
    ),
    display(
      center_text(
        "You can now begin...",
        "When you are ready to <b>start</b> press the right arrow key &#x27A1"
      ) + hint(true)
    ),
  ];

  return {
    type: InstructionsPlugin,
    pages: instructions,
  };
}

export function post_trial(
  jsPsych: JsPsych,
  upperColor: string,
  lowerColor: string
) {
  const values = [
    {
      center_text: "S\tor\tH?",
      target: "HH HH",
      context: "top",
      keys: ["s", "h"],
    },
    {
      center_text: "S\tor\tH?",
      target: "SS SS",
      context: "top",
      keys: ["s", "h"],
    },
    {
      center_text: "S\tor\tH?",
      target: "HH HH",
      context: "bottom",
      keys: ["s", "h"],
    },
    {
      center_text: "S\tor\tH?",
      target: "SS SS",
      context: "bottom",
      keys: ["s", "h"],
    },
    {
      center_text: "A\tor\tF?",
      target: "AA AA",
      context: "top",
      keys: ["a", "f"],
    },
    {
      center_text: "A\tor\tF?",
      target: "FF FF",
      context: "top",
      keys: ["a", "f"],
    },
    {
      center_text: "A\tor\tF?",
      target: "AA AA",
      context: "bottom",
      keys: ["a", "f"],
    },
    {
      center_text: "A\tor\tF?",
      target: "FF FF",
      context: "bottom",
      keys: ["a", "f"],
    },
  ];

  const boxes = context_boxes(upperColor, lowerColor);

  const target = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () =>
      display(
        boxes,
        center_text(jsPsych.timelineVariable("center_text")),
        box_text(jsPsych.timelineVariable("target"), [
          jsPsych.timelineVariable("context"),
        ])
      ),
    data: () => ({
      target: jsPsych.timelineVariable("target"),
      position: jsPsych.timelineVariable("context"),
      trial: "post_trial",
    }),
    choices: () => jsPsych.timelineVariable("keys"),
  };

  const answer = {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      const answer = jsPsych.data
        .getLastTrialData()
        //@ts-ignore
        .trials[0].response.toUpperCase();
      return display(
        boxes,
        box_text(jsPsych.timelineVariable("target").split(" ").join(answer), [
          jsPsych.timelineVariable("context"),
        ])
      );
    },
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  const iti = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: display(
      context_boxes(
        jsPsych.timelineVariable("top_color"),
        jsPsych.timelineVariable("bottom_color")
      )
    ),
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  return {
    timeline: [
      instructions(upperColor, lowerColor),
      {
        timeline: [target, answer, iti],
        timeline_variables: values,
        sample: {
          type: "without-replacement",
        },
      },
    ],
  };
}
