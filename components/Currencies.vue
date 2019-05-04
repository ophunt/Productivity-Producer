<template>
	<div class="currencies">
		<Effort />
		<Time />
		<Productivity />
		<Money />
	</div>
</template>

<script>

import Effort from "./Currencies/Effort.vue";
import Time from "./Currencies/Time.vue";
import Productivity from "./Currencies/Productivity.vue";
import Money from "./Currencies/Money.vue";

export default {

	components: {
		Effort,
		Time,
		Productivity,
		Money
	},

};

</script>

<style>

.currencies {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

.currency {
	display: block;
	float: left;
	cursor: pointer;
	margin-bottom: 6px;
	margin-right: 6px;
}

.currency-inner {
	display: table;
	width: 200px;
	height: 200px;
	border: 1px solid black;
	background-color: lightgrey;
	text-align: center;
}

.currency p {
	display: table-row;
	vertical-align: middle;
}

.positiveIncome {
	color: green;
}

.negativeIncome {
	color: red;
}

</style>
