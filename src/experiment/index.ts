import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import { produce_sequence } from "./sequence/produce_sequence";
import { GROUPS } from "./sequence/components/groups";

import { choice } from "./sections/choice";
import { trial } from "./sections/trial";

const jsPsych = initJsPsych();

const timeline = [];

// // Welcome screen
// timeline.push({
//   type: HtmlKeyboardResponsePlugin,
//   stimulus: "<p>Welcome to CSPC_Flanker_2!<p/>",
// });

// // Switch to fullscreen
// timeline.push({
//   type: FullscreenPlugin,
//   fullscreen_mode: true,
// });

// const choice = {
//   type: HtmlKeyboardResponsePlugin,
//   stimulus: '<p>A or b?</p>',
//   choices: ['a', 'b'],
// }

// const trial = {
//   type: HtmlKeyboardResponsePlugin,
//   on_start: (trial) => {
//     //@ts-ignore
//     const selection = jsPsych.data.getLastTrialData().trials[0].response;
//     trial.stimulus = jsPsych.timelineVariable(selection);
//   }
// }

// timeline.push({
//   timeline: [choice, trial],
//   timeline_variables: [{a: "Hello", b: "Goodbye"}]
// })

const group = 0;

const sequence = produce_sequence(group, "trial", 1);

jsPsych.data.addProperties({
  version: GROUPS[group].version,
  top_context: GROUPS[group].upper.congruency_string,
  top_context_color: GROUPS[group].upper.color,
  bottom_context: GROUPS[group].lower.congruency_string,
  bottom_context_color: GROUPS[group].lower.color,
});

timeline.push({
  timeline: [choice(jsPsych, GROUPS[group].version), ...trial(jsPsych)],
  timeline_variables: sequence
})

jsPsych.run(timeline);
