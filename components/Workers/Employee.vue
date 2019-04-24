<template>
	<transition name="fade" mode="out-in">
		<div class="worker-wrapper" id="employee" key="employee" v-if="employeesUnlocked"
		v-b-tooltip.hover.html title="<b>Employee</b><br>Earns 0.1 Productivity<br>per second<br>
									  Costs 1 Effort, 0.1 Time,<br>and 1 Money per second">
			<div class="add-worker">
				<button v-on:click="hireEmployee()">+</button>
			</div>
			<div>Employees:<br>{{ formatNumber(employees) }}</div>
			<div class="remove-worker">
				<button v-on:click="fireEmployee()">-</button>
			</div>
		</div>

		<div class="worker-hint" id="employee" key="employee-hint"
		v-if="internsUnlocked && !employeesUnlocked">
			<div>Reach<br>2 Products<br>to Unlock<br>********s</div>
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

		hireEmployee() {
			this.adjustCurrency("employees", 1);
			this.updateRates();
		},

		fireEmployee() {
			if (this.employees > 0) {
				this.adjustCurrency("employees", -1);
				this.flashRed("employee");
				this.updateRates();
			}
		},
	}

};

</script>

<style>

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

#employee {
	background-color: rgba(0, 0, 255, 0.20);
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

.flash-red {
	animation: flash-red 0.5s 1;
	animation-fill-mode: both;
}

@keyframes flash-red {
	33% {
		background-color: red;
	}
}

</style>
