import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";

import { produce_sequence } from "./sequence/produce_sequence";
import { GROUPS } from "./sequence/components/groups";

import { instructions } from "./sections/instructions";
import { trial } from "./sections/trial";
import { between_trial } from "./sections/between_trial";
import { post_trial } from "./sections/post_trial";

function record_group(group: number) {
  const counter = jatos.batchSession.get("condition-counter");
  ++counter[group];
  jatos.batchSession.set("condition-counter", counter).catch(record_group);
}

function run() {
  const jsPsych = initJsPsych({
    exclusions: {
      min_width: 625,
      min_height: 625,
    },
    on_finish() {
      record_group(group);
      jatos.startNextComponent(jsPsych.data.get().csv(), "Finished");
    },
  });

  // Get group
  const group = jatos.studySessionData.group;
  const timeline = [];

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  // Instructions
  timeline.push(
    instructions(GROUPS[group].upper.color, GROUPS[group].lower.color)
  );

  // Produce sequence
  const sequence = [produce_sequence(group, "practice", 1).slice(0, 20)];

  const number_of_trials = 0;
  for (let i = 1; i <= number_of_trials; ++i)
    sequence.push(produce_sequence(group, "trial", i));

  for (let seq of sequence) {
    timeline.push({
      timeline: trial(jsPsych),
      timeline_variables: seq,
    });
    timeline.push(between_trial);
  }

  timeline.push(
    post_trial(jsPsych, GROUPS[group].upper.color, GROUPS[group].lower.color)
  );

  jsPsych.data.addProperties({
    top_context: GROUPS[group].upper.congruency_string,
    top_context_color: GROUPS[group].upper.color,
    bottom_context: GROUPS[group].lower.congruency_string,
    bottom_context_color: GROUPS[group].lower.color,
  });

  jsPsych.run(timeline);
}

jatos.onLoad(run);
