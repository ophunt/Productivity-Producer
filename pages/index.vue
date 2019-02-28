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

			<transition name="fade">
				<div class="time currency" v-if="timeUnlocked">
					<div
					class="currency-inner"
					v-on:click="timeClick()"
					v-b-tooltip.hover.html title="<b>Gain Time</b>">
						<p></p>
						<p>
							Time:<br>{{ formatNumber(time) }}
						</p>
						<p v-if="analysts >= 2"
						v-bind:class="{ positiveIncome: approximateTimePerSecond > 0,
										negativeIncome: approximateTimePerSecond < 0 }">
							{{ formatNumber(approximateTimePerSecond) }} /s
						</p>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="productivity currency" v-if="productivityUnlocked">
					<div
					class="currency-inner" id="productivity-inner"
					v-bind:class="{ redBackground: productivityCrippled }"
					v-on:click="makeProductivity()"
					v-b-tooltip.hover.html title="<b>Gain Productivity</b><br>
												  Earns 1 Effort per second<br>Costs 10 Effort and 1 Time">
						<p></p>
						<p>
							Productivity:<br>{{ formatNumber(productivity) }}
						</p>
						<p v-if="analysts >= 3"
						v-bind:class="{ positiveIncome: approximateProductivityPerSecond > 0,
										negativeIncome: approximateProductivityPerSecond < 0 }">
							{{ formatNumber(approximateProductivityPerSecond) }} /s
						</p>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="money currency" v-if="projectsUnlocked">
					<div
					class="currency-inner" id="money-inner"
					v-b-tooltip.hover.html title="<b>Money</b> is earned<br>from Projects<br>
												  If you run out,<br>workers will be fired">
						<p></p>
						<p>
							Money:<br>{{ formatNumber(money) }}
						</p>
						<p v-if="analysts >= 4"
						v-bind:class="{ positiveIncome: approximateMoneyPerSecond > 0,
										negativeIncome: approximateMoneyPerSecond < 0 }">
							{{ formatNumber(approximateMoneyPerSecond) }} /s
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
					v-b-tooltip.hover.html title="<b>Create new Project</b> for 10 Productivity (15 max)"
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

		<div class="workers">
			<transition name="fade">
				<div class="intern-wrapper" v-if="internsUnlocked">
					<div
					id="intern-gain" class="worker-gain"
					v-b-tooltip.hover.html title="<b>Hire Intern</b><br>Earns 0.2 Time per second<br>
												  Costs 1 Money per second">
					<div class="add-worker"
					v-on:click="hireIntern()"><button>+</button></div>
					<div>Interns: {{ interns }}</div>
					<div class="remove-worker"
					v-on:click="fireIntern()"><button>-</button></div>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="employee-wrapper" v-if="employeesUnlocked">
					<div
					id="employee-gain" class="worker-gain"
					v-b-tooltip.hover.html title="<b>Hire Employee</b><br>Earns 0.1 Productivity<br>per second<br>
												  Costs 1 Effort, 0.1 Time,<br>and 1 Money per second">
					<div class="add-worker">
						<button v-on:click="hireEmployee()">+</button>
					</div>
					<div>Employees: {{ employees }}</div>
					<div class="remove-worker">
						<button v-on:click="fireEmployee()">-</button>
					</div>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="manager-wrapper" v-if="managersUnlocked">
					<div
					id="manager-gain" class="worker-gain"
					v-b-tooltip.hover.html title="<b>Hire Manager</b><br>Attempts to make<br>a Project every minute<br>
												  and to make a Product<br>every 5 minutes<br>
												  Costs 1 Money per Second">
					<div class="add-manager">
						<button v-on:click="hireManager()">+</button>
					</div>
					<div>Managers: {{ managers }}</div>
					<div class="remove-manager">
						<button v-on:click="fireManager()">-</button>
					</div>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="analyst-wrapper" v-if="analystsUnlocked">
					<div
					id="analyst-gain" class="worker-gain"
					v-b-tooltip.hover.html title="<b>Hire Analyst</b><br>Each one measures<br>
												  net income for<br>a single currency<br>
												  Costs 2.50 Money per Second">
					<div class="add-analyst">
						<button v-on:click="hireAnalyst()">+</button>
					</div>
					<div>Analysts: {{ analysts }}</div>
					<div class="remove-analyst">
						<button v-on:click="fireAnalyst()">-</button>
					</div>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="salesperson-wrapper" v-if="salespeopleUnlocked">
					<div
					id="salesperson-gain" class="worker-gain"
					v-b-tooltip.hover.html title="<b>Hire Salesperson</b><br>
												  Attempts to sell a<br>
												  Project ($400) every minute<br>
												  and sell a Product ($2000)<br>
												  every 5 minutes<br>
												  Costs 1 Money per Second">
					<div class="add-salesperson">
						<button v-on:click="hireSalesperson()">+</button>
					</div>
					<div>Salespeople: {{ salespeople }}</div>
					<div class="remove-salesperson">
						<button v-on:click="fireSalesperson()">-</button>
					</div>
					</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="executives-wrapper" v-if="executivesUnlocked">
					<div
					id="executive-gain" class="worker-gain"
					v-b-tooltip.hover.html title="<b>Hire Executive</b><br>
												  ">
					<div class="add-executive">
						<button v-on:click="hireExecutive()">+</button>
					</div>
					<div>Executives: {{ executives }}</div>
					<div class="remove-executive">
						<button v-on:click="fireExecutive()">-</button>
					</div>
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
			managerProjectProgress: state => state.player.managerProjectProgress,
			managerProductProgress: state => state.player.managerProductProgress,
			analystsUnlocked: state => state.player.analystsUnlocked,
			analysts: state => state.player.analysts,
			salespeopleUnlocked: state => state.player.salespeopleUnlocked,
			salespeople: state => state.player.salespeople,
			salespeopleProjectProgress: state => state.player.salespeopleProjectProgress,
			salespeopleProductProgress: state => state.player.salespeopleProductProgress,
			executivesUnlocked: state => state.player.executivesUnlocked,
			executives: state => state.player.executives,
		}),

		approximateEffortPerSecond: function() {
			return this.effortPerSecond + this.managers * -1;
		},

		approximateTimePerSecond: function() {
			return this.timePerSecond + this.managers * -0.1;
		},

		approximateProductivityPerSecond: function() {
			return this.productivityPerSecond + this.managers * -1/6;
		},

		approximateMoneyPerSecond: function() {
			return this.moneyPerSecond + this.salespeople * 400/60 * 2;
		},

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
			let income = this.interns * 0.2;
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
					  + this.salespeople * 1;
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
					"<b>Gain Productivity</b><br>Earns 1 Effort per second<br>Costs 10 Effort and 1 Time",
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

		managerWork() {
			while (this.managerProjectProgress > 60) {
				if (this.productivity >= 10 && this.projects + this.products < 15) {
					this.adjustCurrency("projects", 1);
					this.adjustCurrency("productivity", -10);
					this.updateRates();
				}
				this.adjustCurrency("managerProjectProgress", -60);
			}

			while (this.managerProductProgress > 300) {
				if (this.projects >= 5) {
					this.adjustCurrency("products", 1);
					this.adjustCurrency("projects", -5);
					this.updateRates();
				}
				this.adjustCurrency("managerProductProgress", -300);
			}
		},

		salespeopleWork() {
			while (this.salespeopleProjectProgress > 60) {
				if (this.projects > 0) {
					this.adjustCurrency("projects", -1);
					this.adjustCurrency("money", 400);
					this.updateRates();
				}
				this.adjustCurrency("salespeopleProjectProgress", -60);
			}

			while (this.salespeopleProductProgress > 300) {
				if (this.products > 0) {
					this.adjustCurrency("products", -1);
					this.adjustCurrency("money", 2000);
					this.updateRates();
				}
				this.adjustCurrency("salespeopleProductProgress", -300);
			}
		},

		fireLowestWorker() {
			if (this.interns > 0) {
				this.fireIntern();
			} else if (this.employees > 0) {
				this.fireEmployee();
			} else if (this.managers > 0) {
				this.fireManager();
			} else if (this.analysts > 0) {
				this.fireAnalyst();
			} else if (this.salespeople > 0) {
				this.fireSalesperson();
			}
		},

		hireIntern() {
			this.adjustCurrency("interns", 1);
			this.updateRates();
		},

		fireIntern() {
			if (this.interns > 0) {
				this.adjustCurrency("interns", -1);
				this.updateRates();
			}
		},

		hireEmployee() {
			this.adjustCurrency("employees", 1);
			this.updateRates();
		},

		fireEmployee() {
			if (this.employees > 0) {
				this.adjustCurrency("employees", -1);
				this.updateRates();
			}
		},

		hireManager() {
			this.adjustCurrency("managers", 1);
			this.updateRates();
		},

		fireManager() {
			if (this.managers > 0) {
				this.adjustCurrency("managers", -1);
				this.updateRates();
			}
		},

		hireAnalyst() {
			this.adjustCurrency("analysts", 1);
			this.updateRates();
		},

		fireAnalyst() {
			if (this.analysts > 0) {
				this.adjustCurrency("analysts", -1);
				this.updateRates();
			}
		},

		hireSalesperson() {
			this.adjustCurrency("salespeople", 1);
			this.updateRates();
		},

		fireSalesperson() {
			if (this.salespeople > 0) {
				this.adjustCurrency("salespeople", -1);
				this.updateRates();
			}
		},

		hireExecutive() {
			this.adjustCurrency("executives", 1);
			this.updateRates();
		},

		fireExecutive() {
			if (this.executives > 0) {
				this.adjustCurrency("executives", -1);
				this.updateRates();
			}
		},

		formatNumber(num) {
			return numberformat.formatShort(num, {maxSmall: "100", sigFigs: 3});
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

		gameTick() {
			this.tick();
			this.managerWork();
			this.salespeopleWork();
			this.checkUnlocks();
			if (this.money < 0) {
				while (this.moneyPerSecond < 0) {
					this.fireLowestWorker();
					this.setValue("money", 0);
				}
			}
			this.updateRates();
		}

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
				this.gameTick();
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
	display: table-row;
	vertical-align: middle;
}

.positiveIncome {
	color: green;
}

.negativeIncome {
	color: red;
}

.redBackground {
	background-color: red;
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

.slot {
	background-color: white;
	display: table;
}

.slot > p {
	display: table-cell;
	vertical-align: center;
}

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

.worker-gain {
	display: table;
	background-color: aqua;
	border: 1px solid black;
	width: 133px;
	height: 100px;
}

.worker-gain > div {
	display: table-row;
	text-align: center;
	padding: 0px;
	clear: none;
}

.worker-gain > div > button {
	cursor: pointer;
	background-color: lightskyblue;
	margin-top: 4px;
	width: 50px;
	border: 0px;
	border-radius: 3px;
}

.worker-gain > div:nth-child(2) {
	vertical-align: middle;
	cursor: default;
}

#intern-gain {
	background-color: rgba(0, 0, 255, 0.05);
}

#employee-gain {
	background-color: rgba(0, 0, 255, 0.20);
}

#manager-gain {
	background-color: rgba(0, 0, 255, 0.35);
}

#analyst-gain {
	background-color: rgba(0, 0, 255, 0.5);
}

#salesperson-gain {
	background-color: rgba(0, 0, 255, 0.65);
}

#executive-gain {
	background-color: rgba(0, 0, 255, 0.8);
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
