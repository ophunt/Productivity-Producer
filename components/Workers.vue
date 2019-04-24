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

</style>
