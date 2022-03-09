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
      jatos
        .submitResultData(jsPsych.data.get().csv())
        .then(record_group(group))
        .then(() => jatos.endStudy());
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

  const number_of_blocks = 8;
  for (let i = 1; i <= number_of_blocks; ++i)
    sequence.push(produce_sequence(group, "trial", i));

  for (let seq of sequence) {
    timeline.push({
      timeline: trial(jsPsych),
      timeline_variables: seq,
    });
    timeline.push(between_trial(jsPsych));
  }

  timeline.push(
    post_trial(jsPsych, GROUPS[group], group, number_of_blocks + 1)
  );

  jsPsych.data.addProperties({
    subject: jatos.studyResultId,
    workerID: jatos.workerId,
    prolificPID: jatos.urlQueryParameters.PROLIFIC_PID,
    prolificSID: jatos.urlQueryParameters.STUDY_ID,
    prolificSEID: jatos.urlQueryParameters.SESSION_ID,

    top_context: GROUPS[group].upper.congruency_string,
    top_context_color: GROUPS[group].upper.color,
    bottom_context: GROUPS[group].lower.congruency_string,
    bottom_context_color: GROUPS[group].lower.color,
  });

  jsPsych.run(timeline);
}

jatos.onLoad(run);
