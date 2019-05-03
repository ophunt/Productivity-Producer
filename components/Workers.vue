<template>
	<div class="workers">
		<Intern />
		<Employee />
		<Manager />
		<Analyst />
		<Salesperson />
		<Executive />
	</div>
</template>

<script>

import Intern from "./Workers/Intern.vue";
import Employee from "./Workers/Employee.vue";
import Manager from "./Workers/Manager.vue";
import Analyst from "./Workers/Analyst.vue";
import Salesperson from "./Workers/Salesperson.vue";
import Executive from "./Workers/Executive.vue";

export default {

	components: {
		Intern,
		Employee,
		Manager,
		Analyst,
		Salesperson,
		Executive
	},

};
</script>

<style>

.workers {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

.workers > * {
	float: left;
	margin-bottom: 4px;
	margin-right: 4px;
}

.worker-wrapper {
	display: table;
	border: 1px solid black;
	width: 133px;
	height: 120px;
}

.worker-wrapper > div {
	display: table-row;
	text-align: center;
	padding: 0px;
	clear: none;
}

.worker-wrapper > div > button {
	cursor: pointer;
	background-color: lightskyblue;
	margin-top: 4px;
	width: 50px;
	border: 0px;
	border-radius: 3px;
}

.worker-wrapper > div:nth-child(2) {
	vertical-align: middle;
	cursor: default;
}

.remove-worker > * {
	margin-top: 0px;
	margin-bottom: 4px;
}

.worker-hint {
	display: table;
	border: 1px solid black;
	width: 133px;
	height: 120px;
}

.worker-hint > div {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
	padding: 0px;
	clear: none;
}

</style>
