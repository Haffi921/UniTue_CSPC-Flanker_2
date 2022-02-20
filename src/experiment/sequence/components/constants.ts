export enum CongruencyString {
    mostly_congruent = "Mostly Congruent",
    mostly_incongruent = "Mostly Incongruent",
}

export enum Position {
    upper = "top",
    lower = "bottom",
}

export enum ContextColor {
    one = "blue",
    two = "yellow",
}

export enum Version {
    one,
    two,
}

export const CongruencyMatrix = {
    "Mostly Congruent": [32, 8, 32, 8, 5, 5, 5, 5],
    "Mostly Incongruent": [8, 32, 8, 32, 5, 5, 5, 5],
};