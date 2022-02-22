import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import { produce_sequence } from "./sequence/produce_sequence";
import { GROUPS } from "./sequence/components/groups";

import { choice } from "./sections/choice";
import { trial } from "./sections/trial";

const jsPsych = initJsPsych();

const timeline = [];

// TODO: Add informed consent, possible as another component

// Switch to fullscreen
timeline.push({
  type: FullscreenPlugin,
  fullscreen_mode: true,
});

// Select group
const group = 0;

// Produce sequence
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
