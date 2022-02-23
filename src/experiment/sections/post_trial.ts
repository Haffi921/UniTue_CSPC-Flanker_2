import { initJsPsych } from "jspsych";

import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import {
  display,
  context_boxes,
  paragraphs,
  center_text,
  center_error,
  box_text,
} from "../../html_components";

export function post_trial(jsPsych) {
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

  const target = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () =>
      display(
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
        .trials[0].response.toUpperCase();
      return display(
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
    stimulus: display(),
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  return {
    post_trial_instructions: {
      type: HtmlKeyboardResponsePlugin,
      stimulus: display(
        center_text(
          "<br><br><br><br>You will now be presented with a sequence of letters with a missing center letter, like shown here above." +
            " Your task is to select which letter you feel belongs in the center, in this case either 'A' or 'F'" +
            "<br><br>Please respond using the 'A', 'S', 'F' and 'H' keys."
        ) +
          box_text("AA AA", ["top"]) +
          box_text("Press 'space' to continue", ["hint"])
      ),
      choices: [" "],
    },
    post_trial: {
      timeline: [target, answer, iti],
      timeline_variables: values,
      sample: {
        type: "without-replacement",
      },
    },
  };
}
