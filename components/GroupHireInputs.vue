<template>
	<div class="group-hire-inputs">
		<transition name="fade">
			<div class="group-inputs-wrapper" v-if="groupsUnlocked">
				<input type="number" min="0" value="0" step="1" placeholder="0"
					   id="intern-group" v-model.number="internGroupSize">
				<input type="number" min="0" value="0" step="1" placeholder="0"
					   id="employee-group" v-model.number="employeeGroupSize">
				<input type="number" min="0" value="0" step="1" placeholder="0"
					   id="manager-group" v-model.number="managerGroupSize">
				<input type="number" min="0" value="0" step="1" placeholder="0"
					   id="analyst-group" v-model.number="analystGroupSize">
				<input type="number" min="0" value="0" step="1" placeholder="0"
					   id="salesperson-group" v-model.number="salespersonGroupSize">
				<input type="number" min="0" value="0" step="1" placeholder="0"
					   id="executive-group" v-model.number="executiveGroupSize">
			</div>
		</transition>
	</div>
</template>

<script>

import { mapState, mapMutations } from "vuex";

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
	}
};

</script>

<style>

.group-hire-inputs {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

.group-inputs-wrapper > * {
	width: 133px;
	margin-right: -1px;
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
