import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import { JsPsych } from "jspsych";

import { display, context_boxes, center_text, box_text, paragraphs } from "./components";

export function choice (jsPsych: JsPsych, version: number): object {

    let choices: string[], stimulus: () => string;

    if (version) {
        choices = ['s', 'f'];
        stimulus = () => display(
            context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
            center_text(
                `Please choose between <span class='${jsPsych.timelineVariable("s_key_color")}'>[S]</span> and <span class='${jsPsych.timelineVariable("f_key_color")}'>[F]</span>`
            )
        );
    }
    else {
        choices = ['e', 'x'];
        stimulus = () => display(
            context_boxes(jsPsych.timelineVariable("top_color"), jsPsych.timelineVariable("bottom_color")),
            center_text(
                `Please choose between <span class='${jsPsych.timelineVariable("top_color")}'>[E]</span> and <span class='${jsPsych.timelineVariable("bottom_color")}'>[X]</span>`
            )
        );
    }

    const choice = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: stimulus,
        choices: choices,
        trial_duration: 1500,
        data: () => ({
            s_color: jsPsych.timelineVariable("s_key_color"),
            s_context: jsPsych.timelineVariable("s"),
            f_color: jsPsych.timelineVariable("f_key_color"),
            f_context: jsPsych.timelineVariable("f"),
        })
    }

    return choice;
}