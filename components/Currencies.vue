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

</style>
