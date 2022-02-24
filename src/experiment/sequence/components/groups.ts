import { CongruencyString, ContextColor } from "./constants";

export interface ContextInfo {
  congruency_string: CongruencyString;
  color: ContextColor;
}

export interface GroupContextInfo {
  upper: ContextInfo;
  lower: ContextInfo;
}

export const GROUPS: GroupContextInfo[] = [
  // 1
  {
    upper: {
      congruency_string: CongruencyString.mostly_congruent,
      color: ContextColor.one,
    },

    lower: {
      congruency_string: CongruencyString.mostly_incongruent,
      color: ContextColor.two,
    },
  },

  // 2
  {
    upper: {
      congruency_string: CongruencyString.mostly_incongruent,
      color: ContextColor.one,
    },

    lower: {
      congruency_string: CongruencyString.mostly_congruent,
      color: ContextColor.two,
    },
  },

  // 3
  {
    upper: {
      congruency_string: CongruencyString.mostly_congruent,
      color: ContextColor.two,
    },

    lower: {
      congruency_string: CongruencyString.mostly_incongruent,
      color: ContextColor.one,
    },
  },

  // 4
  {
    upper: {
      congruency_string: CongruencyString.mostly_incongruent,
      color: ContextColor.two,
    },

    lower: {
      congruency_string: CongruencyString.mostly_congruent,
      color: ContextColor.one,
    },
  },
];
