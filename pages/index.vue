<template>
	<div class="app">
		<div class="footer">
			<button id="save-button" v-on:click="save()">Save</button>
			<button id="load-button" v-on:click="load()">Load</button>
			<!-- DEBUG -->
			<button id="debug-button" v-on:click="debugSet()">Debug Button</button>
			<input id="debug-resource"><input id="debug-value">
			<!-- /DEBUG -->
		</div>

		<div class="currencies">
			<div class="effort currency">
				<div
				class="currency-inner"
				v-on:click="effortClick()"
				v-b-tooltip.hover title="Gain Effort">
					<p>
						Effort:<br>{{ formatNumber(effort) }}
					</p>
				</div>
			</div>

			<div class="time currency">
				<div
				class="currency-inner"
				v-on:click="timeClick()"
				v-b-tooltip.hover title="Gain Time">
					<p>
						Time:<br>{{ formatNumber(time) }}
					</p>
				</div>
			</div>

			<div class="productivity currency">
				<div
				class="currency-inner" id="productivity-inner"
				v-on:click="makeProductivity()"
				v-b-tooltip.hover.html title="Gain Productivity
				<br>Earns 1 Effort per second<br>Costs 10 Effort and 1 Time">
					<p>
						Productivity:<br>{{ formatNumber(productivity) }}
					</p>
				</div>
			</div>

			<transition name="fade">
				<div class="money currency" v-if="projectsUnlocked">
					<div
					class="currency-inner" id="money-inner"
					v-b-tooltip.hover.html title="Money is earned<br>from Projects">
						<p>
							Money:<br>{{ formatNumber(money) }}
						</p>
					</div>
				</div>
			</transition>
		</div>

		<div class="projects">
			<transition name="fade">
				<div class="project-wrapper" v-if="projectsUnlocked">
					<div
					class="make-project" id="project-maker"
					v-b-tooltip.hover title="Create new Project for 10 Productivity (15 max)"
					v-on:click="makeProject()">
						<p>Make<br>Project</p>
					</div>
					<div
					class="product"
					v-for="n in products" :key="n*100"
					v-b-tooltip.hover.html title="Earns you 10<br>Money per second">
					<p>Product<br>{{ n }}</p>
					</div>
					<div
					class="make-product"
					v-if="projects >= 10 && products &lt; 6"
					v-on:click="makeProduct()"
					v-b-tooltip.hover.html title="Make a Product<br>using 10 Projects">
					<p>Make<br>Product</p>
					</div>
					<div
					class="project"
					v-for="n in (projects - (projects >= 10 && products &lt; 6))" :key="n"
					v-b-tooltip.hover.html title="Earns you 1<br>Money per second">
					<p>Project<br>{{ n + (projects >= 10 && products &lt; 6) }}</p>
					</div>
				</div>
			</transition>
		</div>

		<div class="workers">
			<transition name="fade">
				<div class="intern-wrapper" v-if="internsUnlocked">
					<div
					id="intern-gain" class="worker-gain"
					v-on:click="hireIntern()"
					v-b-tooltip.hover.html title="Hire Intern<br>Earns 0.2 Time per second
							<br>Costs 1 Money per second">
					<p class="add-worker">+</p>
					<br>
					<p>Interns</p>
					<br>
					<p class="remove-worker">-</p>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="employee-wrapper" v-if="employeesUnlocked">
					<div
					id="employee-gain" class="worker-gain"
					v-on:click="hireEmployee()"
					v-b-tooltip.hover.html title="Hire Employee<br>Earns 0.1 Productivity<br>per second
							<br>Costs 1 Effort, 0.1 Time,<br>and 1 Money per second">
					<p>Employees</p>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>

import { mapState, mapMutations } from "vuex";
const numberformat = require("swarm-numberformat");

export default {
	components: {},

	computed: {

		...mapState ({
			debug: state => state.debug,
			effort: state => state.player.effort,
			time: state => state.player.time,
			productivity: state => state.player.productivity,
			money: state => state.player.money,
			projectsUnlocked: state => state.player.projectsUnlocked,
			projects: state => state.player.projects,
			productsUnlocked: state => state.player.products,
			products: state => state.player.products,
			internsUnlocked: state => state.player.internsUnlocked,
			interns: state => state.player.interns,
			employeesUnlocked: state => state.player.employeesUnlocked,
			employees: state => state.player.employees,
		}),

	},

	methods: {

		...mapMutations ([
			"tick",
			"checkUnlocks",
		]),

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
			let income = this.interns;
			let costs = this.employees * 0.1;
			return income - costs;
		},

		calcProductivityPerSecond() {
			let income = this.employees * 0.1;
			let costs = 0;
			return income - costs;
		},

		calcMoneyPerSecond() {
			let income = this.projects * 1 + this.products * 10;
			let costs = this.interns * 1 + this.employees * 1;
			return income - costs;
		},

		updateRates() {
			this.setValue("effortPerSecond", this.calcEffortPerSecond());
			this.setValue("timePerSecond", this.calcTimePerSecond());
			this.setValue("productivityPerSecond", this.calcProductivityPerSecond());
			this.setValue("moneyPerSecond", this.calcMoneyPerSecond());
		},

		effortClick() {
			this.adjustCurrency("effort", 1);
		},

		timeClick() {
			this.adjustCurrency("time", 1);
		},

		makeProductivity() {
			if (this.effort >= 10 && this.time >= 1) {
				this.adjustCurrency("effort", -10);
				this.adjustCurrency("time", -1);
				this.adjustCurrency("productivity", 1);
				this.updateRates();
			} else {
				this.tempTooltip("Not enough resources!",
					"Gain Productivity<br>Earns 1 Effort per second<br>Costs 10 Effort and 1 Time",
					"productivity-inner",
					1000);
			}
		},

		makeProject() {
			if (this.productivity >= 10 && this.projects + this.products < 15) {
				this.adjustCurrency("projects", 1);
				this.adjustCurrency("productivity", -10);
				this.updateRates();
			} else if (this.projects + this.products < 15) {
				this.tempTooltip("Not enough resources!",
					"Create new Project for 10 Productivity (15 max)",
					"project-maker",
					1000);
			} else {
				this.tempTooltip("Max projects reached!",
					"Create new Project for 10 Productivity (15 max)",
					"project-maker",
					1000);
			}
		},

		makeProduct() {
			if (this.projects >= 10 && this.products < 6) {
				this.adjustCurrency("products", 1);
				this.adjustCurrency("projects", -10);
				this.updateRates();
			}
		},

		fireLowestWorker() {
			if (interns > 0) {
				this.adjustCurrency("interns", -1);
				adjustRates();
			} else if (employees > 0) {
				this.adjustCurrency("employees", -1);
				adjustRates();
			}
		},

		hireIntern() {
			this.adjustCurrency("interns", 1);
			this.updateRates();
		},

		hireEmployee() {
			this.adjustCurrency("employees", 1);
			this.updateRates();
		},

		formatNumber(num) {
			return numberformat.formatShort(num);
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

		save() {
			let parsed = JSON.stringify(this.$store.state);
			localStorage.setItem("saveFile", parsed);
			console.log("Game saved");
		},

		load() {
			this.$store.commit("load");
		},

		debugSet() {
			let res = document.getElementById("debug-resource").value;
			let val = parseInt(document.getElementById("debug-value").value);
			console.log(res);
			console.log(val);
			this.setValue(res, val);
		},

	},

	mounted: function () {
		this.$nextTick(function () {
			this.load();
			let autosaveCounter = 1200;
			setInterval(() => {
				if (autosaveCounter === 0) {
					this.save();
					autosaveCounter = 1200;
				}
				autosaveCounter--;
				this.tick();
				this.checkUnlocks();
			}, 100);
		});
	},
};

</script>

<style>

* {
	user-select: none;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app {
	margin: 0px;
	margin-bottom: 0px;
}

.footer {
	position: absolute;
	height: 38px;
	padding-left: 2px;
	left: 0;
	right: 0;
	bottom: 0;
	border: 1px solid black;
	background-color: lightskyblue;
}

.footer > * {
	margin: 2px;
}

.currencies {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

/* replace currency and currency inner with a single element of inline-table */
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
	display: table-cell;
	vertical-align: middle;
}

.money-fader {
	display: inline;
}

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

.workers {
	display: block;
	clear: both;
	width: 100%;
	margin: 5px;
}

.workers > * {
	float: left;
	margin-bottom: 5px;
	margin-right: 5px;
}

.worker-gain {
	display: table;
	background-color: aqua;
	border: 1px solid black;
	width: 125px;
	height: 100px;
	cursor: pointer;
}

.worker-gain > p {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
