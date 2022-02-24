import { Position, CongruencyMatrix } from "./components/constants";
import { TRIAL_TYPES, ContextData } from "./components/context_trials";
import { GROUPS, ContextInfo } from "./components/groups";
import { TrialData } from "./components/trial_data";

import {
  randomSampleSequencer,
  randomRepetitionLockedSequencer,
} from "./util/sequencer";

export function produce_sequence(
  group_nr: number,
  block_type: string,
  block_nr: number
): TrialData[] {
  const group = GROUPS[group_nr];

  function add_data(position: Position, context: ContextInfo) {
    return function (
      trial: ContextData,
      context_trial_nr: number
    ): ContextData {
      // Function
      trial.position = position;

      // Data
      trial.context = context.congruency_string;
      trial.group_nr = group_nr;
      trial.block_type = block_type;
      trial.block_nr = block_nr;
      trial.context_trial_nr = context_trial_nr + 1;

      return trial;
    };
  }

  function zip<T>(a: T[], b: T[]): T[][] {
    return a.map((a_trial, i) => [a_trial, b[i]]);
  }

  let sequence: TrialData[] = zip(
    // Upper
    randomSampleSequencer(CongruencyMatrix[group.upper.congruency_string])
      .map((trial_type: number) => Object.assign({}, TRIAL_TYPES[trial_type]))
      .map(add_data(Position.upper, group.upper)),

    // Lower
    randomSampleSequencer(CongruencyMatrix[group.lower.congruency_string])
      .map((trial_type: number) => Object.assign({}, TRIAL_TYPES[trial_type]))
      .map(add_data(Position.lower, group.lower))
  ).map((context_data: ContextData[]): TrialData => {
    return {
      //version: group.version,
      top_color: group.upper.color,
      bottom_color: group.lower.color,
      context_trials: context_data,
    };
  });

  const key_context_sequence = randomRepetitionLockedSequencer([50, 50], 3);

  sequence.map((trial: TrialData, i: number) => {
    switch (key_context_sequence[i]) {
      case 0:
        trial.s_key_color = trial.top_color;
        trial.s = Position.upper;
        trial.f_key_color = trial.bottom_color;
        trial.f = Position.lower;
        break;
      case 1:
        trial.s_key_color = trial.bottom_color;
        trial.s = Position.lower;
        trial.f_key_color = trial.top_color;
        trial.f = Position.upper;
        break;
    }
    return trial;
  });

  return sequence;
}
