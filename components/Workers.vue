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

import Intern from "./Intern.vue";
import Employee from "~/components/Employee.vue";
import Manager from "~/components/Manager.vue";
import Analyst from "~/components/Analyst.vue";
import Salesperson from "~/components/Salesperson.vue";
import Executive from "~/components/Executive.vue";

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
