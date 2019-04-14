<template>
	<div>
		<div class="group-hire-buttons">
			<transition name="fade">
				<div class="group-button-wrapper" v-if="groupsUnlocked">
					<button v-on:click="groupHireInterns()">Group Hire Interns</button>
					<button v-on:click="groupHireEmployees()">Group Hire Employees</button>
					<button v-on:click="groupHireManagers()">Group Hire Managers</button>
					<button v-on:click="groupHireAnalysts()">Group Hire Analysts</button>
					<button v-on:click="groupHireSalespeople()">Group Hire Salespeople</button>
					<button v-on:click="groupHireExecutives()">Group Hire Executives</button>
				</div>
			</transition>
		</div>

		<div class="group-hire-all-button">
			<transition name="fade">
				<div class="group-hire-all-button-wrapper" v-if="groupsUnlocked">
					<button v-on:click="hireAllGroup()">Group Hire All Workers</button>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>

import { mapState } from "vuex";

export default {
	computed: {

		...mapState ({
			debug: state => state.debug,

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

		internGroupSize: {
			get () {
				return this.$store.state.player.internGroupSize;
			},
			set: function (size) {
				this.$store.commit("setValue", {
					resource: "internGroupSize",
					value: Math.floor(size)
				});
			}
		},

		employeeGroupSize: {
			get () {
				return this.$store.state.player.employeeGroupSize;
			},
			set: function (size) {
				this.$store.commit("setValue", {
					resource: "employeeGroupSize",
					value: Math.floor(size)
				});
			}
		},

		managerGroupSize: {
			get () {
				return this.$store.state.player.managerGroupSize;
			},
			set: function (size) {
				this.$store.commit("setValue", {
					resource: "managerGroupSize",
					value: Math.floor(size)
				});
			}
		},

		analystGroupSize: {
			get () {
				return this.$store.state.player.analystGroupSize;
			},
			set: function (size) {
				this.$store.commit("setValue", {
					resource: "analystGroupSize",
					value: Math.floor(size)
				});
			}
		},

		salespersonGroupSize: {
			get () {
				return this.$store.state.player.salespersonGroupSize;
			},
			set: function (size) {
				this.$store.commit("setValue", {
					resource: "salespersonGroupSize",
					value: Math.floor(size)
				});
			}
		},

		executiveGroupSize: {
			get () {
				return this.$store.state.player.executiveGroupSize;
			},
			set: function (size) {
				this.$store.commit("setValue", {
					resource: "executiveGroupSize",
					value: Math.floor(size)
				});
			}
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

		updateRates() {
			this.setValue("effortPerSecond", this.calcEffortPerSecond());
			this.setValue("timePerSecond", this.calcTimePerSecond());
			this.setValue("productivityPerSecond", this.calcProductivityPerSecond());
			this.setValue("moneyPerSecond", this.calcMoneyPerSecond());
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

		groupHireInterns() {
			if (this.internGroupSize <= this.executives) {
				this.adjustCurrency("interns", this.internGroupSize);
				this.updateRates();
			}
		},

		groupHireEmployees() {
			if (this.employeeGroupSize <= this.executives) {
				this.adjustCurrency("employees", this.employeeGroupSize);
				this.updateRates();
			}
		},

		groupHireManagers() {
			if (this.managerGroupSize <= this.executives) {
				this.adjustCurrency("managers", this.managerGroupSize);
				this.updateRates();
			}
		},

		groupHireAnalysts() {
			if (this.analystGroupSize <= this.executives) {
				this.adjustCurrency("analysts", this.analystGroupSize);
				this.updateRates();
			}
		},

		groupHireSalespeople() {
			if (this.salespersonGroupSize <= this.executives) {
				this.adjustCurrency("salespeople", this.salespersonGroupSize);
				this.updateRates();
			}
		},

		groupHireExecutives() {
			if (this.executiveGroupSize <= this.executives) {
				this.adjustCurrency("executives", this.executiveGroupSize);
				this.updateRates();
			}
		},

		hireAllGroup() {
			if (this.executives >= this.internGroupSize + this.employeeGroupSize + this.managerGroupSize
								 + this.analystGroupSize + this.salespersonGroupSize + this.executiveGroupSize) {
				this.groupHireInterns();
				this.groupHireEmployees();
				this.groupHireManagers();
				this.groupHireAnalysts();
				this.groupHireSalespeople();
				this.groupHireExecutives();
			}
		},

	}
};

</script>

<style>

.group-hire-buttons {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

.group-button-wrapper > * {
	width: 133px;
	margin-right: -1px;
}

.group-hire-all-button {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

.group-hire-all-button-wrapper > * {
	width: 818px;
	margin-right: -1px;
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
