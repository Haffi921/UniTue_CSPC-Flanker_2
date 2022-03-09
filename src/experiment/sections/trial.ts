import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import { JsPsych } from "jspsych";

// import { Position } from "../sequence/components/constants";
import { ContextData } from "../sequence/components/context_trials";
import {
  display,
  center_text,
  box_text,
  context_boxes,
  center_error,
} from "../html_components";

// Utility functions
function removeStim() {
  const stim = document.getElementsByClassName("target")[0];
  if (stim !== undefined) {
    stim.removeChild(stim.firstChild);
  }
}

export function trial(jsPsych: JsPsych): object[] {
  let context_selection: string,
    trial_data: ContextData,
    context_A = 0,
    context_B = 0,
    switches = 0,
    last_selection = undefined;

  function get_trial_data(): ContextData {
    if (context_selection !== last_selection && last_selection !== undefined)
      ++switches;
    last_selection = context_selection;
    switch (context_selection) {
      case "e":
        ++context_A;
        return jsPsych.timelineVariable("context_trials", true)[0];
      case "x":
        ++context_B;
        return jsPsych.timelineVariable("context_trials", true)[1];
      default:
        return null;
    }
  }

  const selection = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () =>
      display(
        context_boxes(
          jsPsych.timelineVariable("top_color"),
          jsPsych.timelineVariable("bottom_color")
        ),
        center_text(
          `Please choose between <span class='${jsPsych.timelineVariable(
            "top_color"
          )}'>[E]</span> and <span class='${jsPsych.timelineVariable(
            "bottom_color"
          )}'>[X]</span>`
        )
      ),
    choices: ["e", "x"],
    trial_duration: 1500,
    on_finish(data: any) {
      context_selection = data.response;
    },
  };

  const no_choice_feedback = {
    timeline: [
      {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () =>
          display(
            context_boxes(
              jsPsych.timelineVariable("top_color"),
              jsPsych.timelineVariable("bottom_color")
            ),
            center_error("Too late!")
          ),
        choices: "NO_KEYS",
        trial_duration: 1500,
      },
    ],
    conditional_function() {
      return context_selection === null;
    },
  };

  const choice = {
    timeline: [selection, no_choice_feedback],
    loop_function() {
      return context_selection === null;
    },
    on_timeline_finish() {
      if (context_selection) {
        trial_data = get_trial_data();
      }
    },
  };

  // Trial components
  const fixation = {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      return display(
        context_boxes(
          jsPsych.timelineVariable("top_color"),
          jsPsych.timelineVariable("bottom_color")
        ),
        center_text("+")
      );
    },
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  const context = {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      return display(
        context_boxes(
          jsPsych.timelineVariable("top_color"),
          jsPsych.timelineVariable("bottom_color")
        )
      );
    },
    choices: "NO_KEYS",
    trial_duration: 1000,
  };

  const distractor = {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      return display(
        context_boxes(
          jsPsych.timelineVariable("top_color"),
          jsPsych.timelineVariable("bottom_color")
        ),
        box_text(trial_data.distractor, [trial_data.position])
      );
    },
    choices: "NO_KEYS",
    trial_duration: 140,
  };

  const target = {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      return display(
        context_boxes(
          jsPsych.timelineVariable("top_color"),
          jsPsych.timelineVariable("bottom_color")
        ),
        box_text(trial_data.target, ["target", trial_data.position])
      );
    },
    choices: ["j", "l"],
    trial_duration: 1990,
    data() {
      return {
        distractor: trial_data.distractor,
        target: trial_data.target,
        correct_key: trial_data.correct_key,
        position: trial_data.position,

        congruency: trial_data.congruency,
        type: trial_data.type,
        context: trial_data.context,
        group_nr: trial_data.group_nr,
        block_type: trial_data.block_type,
        block_nr: trial_data.block_nr,
        trial_nr: trial_data.context_trial_nr,

        context1: jsPsych.timelineVariable("context_trials")[0],
        context2: jsPsych.timelineVariable("context_trials")[1],

        upper_context_selected: context_A,
        lower_context_selected: context_B,

        context_switces: switches,
      };
    },
    on_load() {
      setTimeout(removeStim, 590);
    },
    on_finish(data: any) {
      data.correct = jsPsych.pluginAPI.compareKeys(
        data.response,
        data.correct_key
      );
    },
  };

  const feedback = {
    type: HtmlKeyboardResponsePlugin,
    stimulus() {
      return display(
        context_boxes(
          jsPsych.timelineVariable("top_color"),
          jsPsych.timelineVariable("bottom_color")
        ),
        (function () {
          //@ts-ignore
          const data = jsPsych.data.getLastTrialData().trials[0];
          const feedback_text =
            data.response === null ? "Too late" : data.correct ? "" : "Wrong";
          const feedback_class = data.correct ? "" : "error";
          return box_text(feedback_text, [
            "feedback",
            trial_data.position,
            feedback_class,
          ]);
        })()
      );
    },
    choices: "NO_KEYS",
    trial_duration: 1500,
  };

  const trial = {
    timeline: [fixation, context, distractor, target, feedback],
  };

  return [choice, trial];
}
