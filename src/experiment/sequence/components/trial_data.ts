import { ContextColor } from "./constants";

import { ContextData } from "./context_trials";

export interface TrialData {
  top_color: ContextColor;
  bottom_color: ContextColor;

  context_trials: ContextData[];
}
