<template>
	<div class="projects">
		<transition name="fade">
			<div class="project-wrapper" v-if="projectsUnlocked">
				<div
				class="make-project" id="project-maker"
				v-b-tooltip.hover.html title="<b>Create new Project</b> for 10 Productivity (15 max)"
				v-on:click="makeProject()">
					<p>Make<br>Project</p>
				</div>
				<div
				class="product"
				v-for="n in products" :key="n*100"
				v-b-tooltip.hover.html title="Earns you 5<br>Money per second">
				<p>Product<br>{{ n }}</p>
				</div>
				<div
				class="make-product"
				v-if="projects >= 5"
				v-on:click="makeProduct()"
				v-b-tooltip.hover.html title="<b>Make a Product</b><br>using 5 Projects">
				<p>Make<br>Product</p>
				</div>
				<div
				class="project"
				v-for="n in (projects - (projects >= 5))" :key="n"
				v-b-tooltip.hover.html title="Earns you 1<br>Money per second">
				<p>Project<br>{{ n + (projects >= 5) }}</p>
				</div>
				<div
				class="slot"
				v-for="n in (15 - products - projects)" :key="n/100">
				<p>Empty<br>Slot</p>
				</div>
			</div>
		</transition>
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

		makeProject() {
			if (this.productivity >= 10 && this.projects + this.products < 15) {
				this.adjustCurrency("projects", 1);
				this.adjustCurrency("productivity", -10);
				this.updateRates();
			} else if (this.projects + this.products < 15) {
				this.tempTooltip("Not enough resources!",
					"<b>Create new Project</b> for 10 Productivity (15 max)",
					"project-maker",
					1000);
			} else {
				this.tempTooltip("Max projects reached!",
					"<b>Create new Project</b> for 10 Productivity (15 max)",
					"project-maker",
					1000);
			}
		},

		makeProduct() {
			if (this.projects >= 5) {
				this.adjustCurrency("products", 1);
				this.adjustCurrency("projects", -5);
				this.updateRates();
			}
		},

		tempTooltip(message, origMessage, elementID, duration) {
			let elem = document.getElementById(elementID);
			elem.setAttribute("title", message);
			this.$root.$emit("bv::hide::tooltip", elementID);
			this.$root.$emit("bv::show::tooltip", elementID);
			setTimeout(() => {
				elem.setAttribute("title", origMessage);
				this.$root.$emit("bv::hide::tooltip", elementID);
				if (elem.matches(":hover")) {
					this.$root.$emit("bv::show::tooltip", elementID);
				}
			}, duration);
		},
	}

};

</script>

<style>

.projects {
	display: block;
	clear: both;
	width: 900px;
	margin: 5px;
}

.project-wrapper {
	margin: 0px;
}

.project-wrapper > * {
	display: inline-table;
	float: left;
	width: 97px;
	height: 97px;
	border: 1px solid black;
	text-align: center;
	margin-bottom: 6px;
	margin-right: 6px;
}

.project-wrapper > * > p {
	display: table-cell;
	vertical-align: middle;
}

.make-project {
	background-color: #00FF00;
	cursor: pointer;
}

.project {
	background-color: silver;
}

.make-product {
	background-color: green;
	cursor: pointer;
}

.product {
	background-color: gold;
}

.slot {
	background-color: white;
	display: table;
}

.slot > p {
	display: table-cell;
	vertical-align: center;
}

</style>
