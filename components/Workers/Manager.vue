<template>
	<transition name="fade" mode="out-in">
		<div class="worker-wrapper" id="manager" key="manager" v-if="managersUnlocked"
		v-b-tooltip.hover.html title="<b>Manager</b><br>
									  Attempts to make<br>
									  a Project every 30 seconds<br>
									  and to make a Product<br>
									  every 5 minutes<br>
									  Costs 1 Money per Second">
			<div class="add-worker">
				<button v-on:click="hireManager()">+</button>
			</div>
			<div>Managers:<br>{{ formatNumber(managers) }}</div>
			<div class="remove-worker">
				<button v-on:click="fireManager()">-</button>
			</div>
		</div>

		<div class="worker-hint" id="manager" key="manager-hint"
		v-if="employeesUnlocked && !managersUnlocked">
			<div>Reach<br>3 Products<br>to Unlock<br>*******s</div>
		</div>
	</transition>
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
		})

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

		flashRed(elementID) {
			let elem = document.getElementById(elementID);
			elem.classList.remove("flash-red");
			elem.classList.add("flash-red");
			setTimeout(() => elem.classList.remove("flash-red"), 500);
		},

		hireManager() {
			this.adjustCurrency("managers", 1);
			this.updateRates();
		},

		fireManager() {
			if (this.managers > 0) {
				this.adjustCurrency("managers", -1);
				this.flashRed("manager");
				this.updateRates();
			}
		},
	}

};

</script>

<style>

#manager {
	background-color: rgba(0, 0, 255, 0.35);
}

</style>
