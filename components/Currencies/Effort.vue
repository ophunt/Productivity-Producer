<template>
	<div class="effort currency">
		<div
		class="currency-inner"
		v-on:click="adjustCurrency('effort', 1)"
		v-b-tooltip.hover.html title="<b>Gain Effort</b>">
			<p></p>
			<p>
				Effort:<br>{{ formatNumber(effort) }}
			</p>
			<p v-if="analysts >= 1"
			v-bind:class="{ positiveIncome: approximateEffortPerSecond > 0,
							negativeIncome: approximateEffortPerSecond < 0 }">
				{{ formatNumber(approximateEffortPerSecond) }} /s
			</p>
		</div>
	</div>
</template>

<script>

import { mapState } from "vuex";

const numberformat = require("swarm-numberformat");

export default {

	computed: {

		...mapState ({
			showOfflineMessage: state => state.player.showOfflineMessage,
			offlineMessage: state => state.player.offlineMessage,

			effort: state => state.player.effort,
			effortPerSecond: state => state.player.effortPerSecond,

			timeUnlocked: state => state.player.timeUnlocked,
			time: state => state.player.time,
			timePerSecond: state => state.player.timePerSecond,

			productivityUnlocked: state => state.player.productivityUnlocked,
			productivity: state => state.player.productivity,
			productivityPerSecond: state => state.player.productivityPerSecond,
			productivityCrippled: state => state.player.productivityCrippled,

			money: state => state.player.money,
			moneyPerSecond: state => state.player.moneyPerSecond,

			projectsUnlocked: state => state.player.projectsUnlocked,
			projects: state => state.player.projects,

			productsUnlocked: state => state.player.products,
			products: state => state.player.products,

			internsUnlocked: state => state.player.internsUnlocked,
			interns: state => state.player.interns,

			employeesUnlocked: state => state.player.employeesUnlocked,
			employees: state => state.player.employees,

			managersUnlocked: state => state.player.managersUnlocked,
			managers: state => state.player.managers,
			projectsToMake: state => state.player.projectsToMake,
			productsToMake: state => state.player.productsToMake,

			analystsUnlocked: state => state.player.analystsUnlocked,
			analysts: state => state.player.analysts,

			salespeopleUnlocked: state => state.player.salespeopleUnlocked,
			salespeople: state => state.player.salespeople,
			projectsToSell: state => state.player.projectsToSell,
			productsToSell: state => state.player.productsToSell,

			executivesUnlocked: state => state.player.executivesUnlocked,
			executives: state => state.player.executives,

			groupsUnlocked: state => state.player.groupsUnlocked,
		}),

		approximateEffortPerSecond: function() {
			let approx = this.effortPerSecond;
			return Math.floor(100*approx)/100;
		},

	},

	methods: {
		setValue (resource, value) {
			this.$store.commit(
				"setValue",
				{
					resource: resource,
					value: value
				}
			);
		},

		adjustCurrency (resource, amount) {
			this.$store.commit(
				"adjustCurrency",
				{
					resource: resource,
					amount: amount
				}
			);
		},

		calcEffortPerSecond() {
			let income = this.productivity;
			let costs = this.employees * 10 * 0.1;
			return income - costs;
		},

		calcTimePerSecond() {
			let income = this.timeUnlocked + this.interns * 0.2;
			let costs = this.employees * 0.1;
			return income - costs;
		},

		calcProductivityPerSecond() {
			let income = this.employees * 0.1;
			let costs = 0;
			return income * (this.productivityCrippled ? 0 : 1) - costs;
		},

		calcMoneyPerSecond() {
			let income = this.projects * 1 + this.products * 5;
			let costs = this.interns * 1
					  + this.employees * 1
					  + this.managers * 1
					  + this.analysts * 2.5
					  + this.salespeople * 1
					  + this.executives * 5;
			return income - costs;
		},

		updateRates() {
			this.setValue("effortPerSecond", this.calcEffortPerSecond());
			this.setValue("timePerSecond", this.calcTimePerSecond());
			this.setValue("productivityPerSecond", this.calcProductivityPerSecond());
			this.setValue("moneyPerSecond", this.calcMoneyPerSecond());
		},

		formatNumber(num) {
			return numberformat.formatShort(num, {maxSmall: "0", sigFigs: 3});
		},
	}

};

</script>

<style>

</style>
