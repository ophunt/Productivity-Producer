<template>
	<div class="app">
		<MyFooter />

		<OfflineModal />

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
					v-b-tooltip.hover.html title="<b>Time</b><br>Earned over time">
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

		<div class="workers">
			<Intern />

			<Employee />

			<Manager />

			<Analyst />

			<Salesperson />

			<Executive />
		</div>

		<GroupHire />
	</div>
</template>

<script>

import { mapState, mapMutations } from "vuex";

import MyFooter from "~/components/MyFooter.vue";
import OfflineModal from "~/components/OfflineModal.vue";
import Intern from "~/components/Intern.vue";
import Employee from "~/components/Employee.vue";
import Manager from "~/components/Manager.vue";
import Analyst from "~/components/Analyst.vue";
import Salesperson from "~/components/Salesperson.vue";
import Executive from "~/components/Executive.vue";
import GroupHire from "~/components/GroupHire.vue";

const numberformat = require("swarm-numberformat");

export default {

	components: {
		MyFooter,
		OfflineModal,
		Intern,
		Employee,
		Manager,
		Analyst,
		Salesperson,
		Executive,
		GroupHire
	},

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

		approximateTimePerSecond: function() {
			let approx = this.timePerSecond;
			return Math.floor(100*approx)/100;
		},

		approximateProductivityPerSecond: function() {
			let approx = this.productivityPerSecond + this.managers * -1/3;
			return Math.floor(100*approx)/100;
		},

		approximateMoneyPerSecond: function() {
			let approx = this.moneyPerSecond + this.salespeople * 400/60 * 2;
			return Math.floor(100*approx)/100;
		},

		deployEnv: function() {
			return process.env.DEPLOY_ENV;
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

		effortClick() {
			this.adjustCurrency("effort", 1);
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

		salespeopleManagerWork() {
			let makeableProjects = Math.floor(Math.min(
				this.projectsToMake,
				this.productivity / 10
			));

			let makeableProducts = Math.floor(Math.min(
				this.productsToMake,
				(this.projects + makeableProjects) / 5
			));

			let sellableProducts = Math.floor(Math.min(
				this.productsToSell,
				this.products + makeableProducts
			));

			let sellableProjects = Math.floor(Math.max(
				0,
				Math.min(
					this.projectsToSell,
					this.projects + makeableProjects - 5 * makeableProducts
				)
			));

			let leftoverProjects = makeableProjects - sellableProjects;
			let leftoverProducts = makeableProducts - sellableProducts;

			this.adjustCurrency("products", leftoverProducts);
			this.adjustCurrency("projects", -5 * makeableProducts);

			this.adjustCurrency("projects", leftoverProjects);
			this.adjustCurrency("productivity", -10 * makeableProjects);

			this.adjustCurrency("money", sellableProducts * 2000);
			this.adjustCurrency("money", sellableProjects * 400);

			if (this.products > 11) {
				let refunded = this.products - 11;
				this.setValue("products", 11);
				this.adjustCurrency("projects", refunded * 5);
			}

			if (this.products + this.projects > 15) {
				let refunded = this.products + this.projects - 15;
				this.setValue("projects", 15 - this.products);
				this.adjustCurrency("productivity", refunded * 10);
			}

			this.setValue("projectsToMake", this.projectsToMake % 1);
			this.setValue("productsToMake", this.productsToMake % 1);
			this.setValue("projectsToSell", this.projectsToSell % 1);
			this.setValue("productsToSell", this.productsToSell % 1);

			this.updateRates();
		},

		fireLowestWorkers() {
			if (this.interns > 0 && this.moneyPerSecond < 0) {
				let toFire = Math.min(Math.ceil(this.moneyPerSecond / -1), this.interns);
				this.adjustCurrency("interns", -toFire);
				this.flashRed("intern");
				this.updateRates();
			} else if (this.employees > 0 && this.moneyPerSecond < 0) {
				let toFire = Math.min(Math.ceil(this.moneyPerSecond / -1), this.employees);
				this.adjustCurrency("employees", -toFire);
				this.flashRed("employee");
				this.updateRates();
			} else if (this.managers > 0 && this.moneyPerSecond < 0) {
				let toFire = Math.min(Math.ceil(this.moneyPerSecond / -1), this.managers);
				this.adjustCurrency("managers", -toFire);
				this.flashRed("manager");
				this.updateRates();
			} else if (this.analysts > 0 && this.moneyPerSecond < 0) {
				let toFire = Math.min(Math.ceil(this.moneyPerSecond / -2.5), this.analysts);
				this.adjustCurrency("analysts", -toFire);
				this.flashRed("analyst");
				this.updateRates();
			} else if (this.salespeople > 0 && this.moneyPerSecond < 0) {
				let toFire = Math.min(Math.ceil(this.moneyPerSecond / -1), this.salespeople);
				this.adjustCurrency("salespeople", -toFire);
				this.flashRed("salesperson");
				this.updateRates();
			} else if (this.executives > 0 && this.moneyPerSecond < 0) {
				let toFire = Math.min(Math.ceil(this.moneyPerSecond / -5), this.executives);
				this.adjustCurrency("executives", -toFire);
				this.flashRed("executive");
				this.updateRates();
			}

			this.setValue("money", 0);
		},

		formatNumber(num) {
			return numberformat.formatShort(num, {maxSmall: "0", sigFigs: 3});
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

		flashRed(elementID) {
			let elem = document.getElementById(elementID);
			elem.classList.remove("flash-red");
			elem.classList.add("flash-red");
			setTimeout(() => elem.classList.remove("flash-red"), 500);
		},

		save() {
			let parsed = JSON.stringify(this.$store.state);
			localStorage.setItem("saveFile", parsed);
			console.log("Game saved");
		},

		load() {
			this.$store.commit("load");
		},

		gameTick() {
			this.tick();
			this.salespeopleManagerWork();
			this.checkUnlocks();
			if (this.money < 0) {
				this.fireLowestWorkers();
			}
			this.updateRates();
			if (this.showOfflineMessage) {
				this.$root.$emit("showOfflineModal");
			}
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
	width: 825px;
	margin: auto;
	margin-bottom: 0px;
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
