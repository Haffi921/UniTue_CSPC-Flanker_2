import { ContextColor, Version, Position } from "./constants";

import { ContextData } from "./context_trials";

export interface TrialData {
    // version: Version
    top_color: ContextColor,
    bottom_color: ContextColor,

    s_key_color?: ContextColor,
    f_key_color?: ContextColor,
    s?: Position,
    f?: Position,

    context_trials: ContextData[],
};
