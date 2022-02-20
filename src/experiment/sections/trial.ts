import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import { JsPsych } from "jspsych";

import { Position } from "../sequence/components/constants";
import { ContextData } from "../sequence/components/context_trials";
import { display, center_text, box_text, context_boxes } from "./components";

export function trial (jsPsych: JsPsych): object[] {
    // Utility functions
    function removeStim() {
        const stim = document.getElementsByClassName("Target")[0];
        if (stim === null) {
            stim.removeChild(stim.firstChild);
        }
    }

    function get_choice(): string {
        //@ts-ignore
        return jsPsych.data.getLastTrialData().trials[0].response;
    }

    function get_trial_data(): ContextData {
        const selection = get_choice();
        switch(selection) {
            case "e":
                return jsPsych.timelineVariable('context_trials')[0];
            case "x":
                return jsPsych.timelineVariable('context_trials')[1];
            default:
                const context = jsPsych.timelineVariable(selection) === Position.upper ? 0 : 1;
                return jsPsych.timelineVariable('context_trials')[context];
        }
    }

    function getFeedbackText() {
        //@ts-ignore
        const data = jsPsych.data.getLastTrialData().trials[0];
        const feedback_text = data.response === null ? "Too late" : (data.correct ? "" : "Wrong");
        return box_text(feedback_text, ["feedback", trial_data.position]);
    }

    let trial_data: ContextData;

    // Trial components
    const fixation = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(
            context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
            center_text("+"),
        ),
        choices: "NO_KEYS",
        trial_duration: 500,
        on_start: () => {
            trial_data = get_trial_data();
        }
    }

    const context = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(
            context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
        ),
        choices: "NO_KEYS",
        trial_duration: 1000,
    }

    const distractor = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: "",
        choices: "NO_KEYS",
        trial_duration: 140,
        on_start: (distractor: any) => {
            distractor.stimulus = display(
                context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
                box_text(trial_data.distractor, [trial_data.position]),
            )
        }
    }

    const target = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: "error",
        choices: ['j', 'l'],
        trial_duration: 1990,
        on_start: (target: any) => {        
            target.stimulus = display(
                context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
                box_text(trial_data.target, ["target", trial_data.position]),
            )
        },
        data: () => ({
            distractor: trial_data.distractor,
            target: trial_data.target,
            correct_key: trial_data.correct_key,
            position: trial_data.position,

            congruency: trial_data.congruency,
            type: trial_data.type,
            context: trial_data.context,
            group_nr: trial_data.group_nr,
            block_type: trial_data.block_type,
            block_nr: trial_data.block_nr,
            trial_nr: trial_data.context_trial_nr,
        }),
        on_load: function() {
            setTimeout(removeStim, 590)
        },
        on_finish: function(data) {
            data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_key);
        },
    }

    const feedback = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(
            context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
            getFeedbackText()
        ),
        choices: "NO_KEYS",
        trial_duration: 1500,
    }
    
    return [fixation, context, distractor, target, feedback];
}