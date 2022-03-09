import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import { JsPsych } from "jspsych";

import { display, center_text } from "../html_components";

export function between_trial(jsPsych: JsPsych) {
  return {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      // @ts-ignore
      let last_trial = jsPsych.data.get().trials;
      last_trial = last_trial[last_trial.length - 2];

      return display(
        center_text(
          "During the last block you have selected:",
          `the upper context ${last_trial.upper_context_selected} times`,
          `and the lower context ${last_trial.lower_context_selected} times.`,
          `Furthermore you switched between context ${last_trial.context_switces} times.`,
          "<br/>Please - try to select both contexts equally often.",
          "<br/>Press [space] when you want to continue...."
        )
      );
    },
    choices: [" "],
  };
}
