function select_group() {
	const group_counts = jatos.batchSession.get("condition-counter");
	let min_count = Infinity;
	let possible_groups = []

	for (let i in group_counts) {
		if (group_counts[i] < min_count) {
			min_count = group_counts[i];
			possible_groups = [i];
		}
		else if (group_counts[i] === min_count) {
			possible_groups.push(i);
		}
	}

	let selected_group = possible_groups[Math.floor(Math.random() * possible_groups.length)];

	return selected_group;
}

jatos.onLoad(function() {
    jatos.studySessionData.group = select_group();
    jatos.startNextComponent();
});