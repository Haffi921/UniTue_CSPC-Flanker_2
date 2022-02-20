import { Position, ContextColor, CongruencyString } from "./constants";

export interface ContextData {
    // Function
    distractor: string,
    target: string,
    correct_key: string,
    position?: Position;

    // Data
    congruency: string,
    type: string,
    context?: CongruencyString;
    group_nr?: number;
    block_type?: string;
    block_nr?: number;
    context_trial_nr?: number;
};

export const TRIAL_TYPES: ContextData[] = [
    {
        distractor: "HH HH",
        target: "HHHHH",
        correct_key: "l",
        congruency: "congruent",
        type: "inducer",
    },
    {
        distractor: "HH HH",
        target: "HHSHH",
        correct_key: "j",
        congruency: "incongruent",
        type: "inducer",
    },
    {
        distractor: "SS SS",
        target: "SSSSS",
        correct_key: "j",
        congruency: "congruent",
        type: "inducer",
    },
    {
        distractor: "SS SS",
        target: "SSHSS",
        correct_key: "l",
        congruency: "incongruent",
        type: "inducer",
    },
    {
        distractor: "AA AA",
        target: "AAAAA",
        correct_key: "j",
        congruency: "congruent",
        type: "transfer",
    },
    {
        distractor: "AA AA",
        target: "AAFAA",
        correct_key: "l",
        congruency: "incongruent",
        type: "transfer",
    },
    {
        distractor: "FF FF",
        target: "FFFFF",
        correct_key: "l",
        congruency: "congruent",
        type: "transfer",
    },
    {
        distractor: "FF FF",
        target: "FFAFF",
        correct_key: "j",
        congruency: "incongruent",
        type: "transfer",
    },
];