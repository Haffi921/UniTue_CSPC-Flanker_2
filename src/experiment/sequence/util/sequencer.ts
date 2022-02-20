import { cloneDeep } from "lodash";

export function randomSampleSequencer(weights: number[]): number[] {
    let w = cloneDeep(weights);
    const sum = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0);

    const nr_trials = sum(w);
    let sequence = Array(nr_trials).fill(0);
    const probabilities: number[] = w.map((a: number) => a / nr_trials).map((a: number, i: number, d: number[]) => i === 0 ? a : a + sum(d.slice(0, i)));

    function get_index(): number {
        const r = Math.random();
        return probabilities.findIndex(a => r < a);
    }

    for (let trial in sequence) {
        let found = false;
        while (!found) {
            const factor = get_index();
            if (w[factor] > 0) {
                sequence[trial] = factor;
                --w[factor];
                found = true;
            }
        }
    }

    return sequence;
}

export function randomRepetitionLockedSequencer(weigths: number[], rep_max: number): number[] {
    const sum = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0);
    const n = sum(weigths);
    const levels = weigths.length;
    
    const randLevel = () => Math.floor(Math.random() * levels);
    
    let w = cloneDeep(weigths);
    let sequence = Array(n).fill(undefined);
    let rep = 1;
    
    for (let i = 0; i < n; ++i) {
        let found = false;
        let tries = 0;
        while (!found) {
            if (tries > levels * 1.5) {
                w = cloneDeep(weigths);
                sequence = Array(n).fill(undefined);
                rep = 1;
                i = 0;
            }

            const new_number = randLevel();

            if (w[new_number] < 1) {
                ++tries;
                continue;
            }

            if (sequence[i-1] === new_number) ++rep;
            else rep = 1;

            if (rep > rep_max) {
                ++tries;
                --rep;
                continue;
            }

            found = true;
            sequence[i] = new_number;
            --w[new_number];
        }
    }

    return sequence;
}