import { CongruencyString, ContextColor, Version } from './constants';

export interface ContextInfo {
    congruency_string: CongruencyString;
    color: ContextColor;
}

interface GroupContextInfo {
    upper: ContextInfo,
    lower: ContextInfo,
    version: Version,
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

        version: Version.one,
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

        version: Version.one,
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

        version: Version.one,
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

        version: Version.one,
    },

    // 5
    {
        upper: {
            congruency_string: CongruencyString.mostly_congruent,
            color: ContextColor.one,
        },

        lower: {
            congruency_string: CongruencyString.mostly_incongruent,
            color: ContextColor.two,
        },

        version: Version.two,
    },

    // 6
    {
        upper: {
            congruency_string: CongruencyString.mostly_incongruent,
            color: ContextColor.one,
        },
        
        lower: {
            congruency_string: CongruencyString.mostly_congruent,
            color: ContextColor.two,
        },

        version: Version.two,
    },

    // 7
    {
        upper: {
            congruency_string: CongruencyString.mostly_congruent,
            color: ContextColor.two,
        },
        
        lower: {
            congruency_string: CongruencyString.mostly_incongruent,
            color: ContextColor.one,
        },

        version: Version.two,
    },

    // 8
    {
        upper: {
            congruency_string: CongruencyString.mostly_incongruent,
            color: ContextColor.two,
        },
        
        lower: {
            congruency_string: CongruencyString.mostly_congruent,
            color: ContextColor.one,
        },

        version: Version.two,
    }
];