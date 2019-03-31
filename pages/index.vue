<template>
	<div class="app">
		<div class="footer">
			<button id="save-button" v-on:click="save()">Save</button>
			<button id="load-button" v-on:click="load()">Load</button>
			<div class="debug" v-if="debug">
				<button id="debug-button" v-on:click="debugSet()">Debug Button</button>
				<input id="debug-resource"><input id="debug-value">
			</div>
			<transition name="fade">
				<button
				 id="bankrupt-button"
				 v-on:click="bankruptcy()"
				 v-if="effort < 0 || time < 0"
				 v-b-tooltip.hover.html title="<b>Declare Bankruptcy</b><br>
				 							   Fires all workers<br>
											   Resets all currencies to 0<br>
											   Use only in the <i><b>direst<br>
											   of circumstances</i></b>">
					Declare Bankruptcy
				</button>
			</transition>
		</div>

		<div>
			<b-modal id="offline-modal" ref="offlineModal" centered :ok-only="true" title="Welcome Back!">
				<p>{{ offlineMessage }}</p>
			</b-modal>
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
			<transition name="fade">
				<div class="worker-wrapper" id="intern" v-if="internsUnlocked"
				v-b-tooltip.hover.html title="<b>Intern</b><br>Earns 0.2 Time per second<br>
											  Costs 1 Money per second">
					<div class="add-worker">
						<button v-on:click="hireIntern()">+</button>
					</div>
					<div>Interns:<br>{{ formatNumber(interns) }}</div>
					<div class="remove-worker">
						<button v-on:click="fireIntern()">-</button>
					</div>
				</div>

				<div class="worker-hint" id="intern" v-if="projectsUnlocked && !internsUnlocked">
					<div>Reach<br>1 Product<br>to Unlock<br>******s</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="worker-wrapper" id="employee" v-if="employeesUnlocked"
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

				<div class="worker-hint" id="employee" v-if="internsUnlocked && !employeesUnlocked">
					<div>Reach<br>2 Products<br>to Unlock<br>********s</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="worker-wrapper" id="manager" v-if="managersUnlocked"
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

				<div class="worker-hint" id="manager" v-if="employeesUnlocked && !managersUnlocked">
					<div>Reach<br>3 Products<br>to Unlock<br>*******s</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="worker-wrapper" id="analyst" v-if="analystsUnlocked"
				v-b-tooltip.hover.html title="<b>Analyst</b><br>Each one measures<br>
											  net income for<br>a single currency<br>
											  Costs 2.50 Money per Second">
					<div class="add-worker">
						<button v-on:click="hireAnalyst()">+</button>
					</div>
					<div>Analysts:<br>{{ formatNumber(analysts) }}</div>
					<div class="remove-worker">
						<button v-on:click="fireAnalyst()">-</button>
					</div>
				</div>

				<div class="worker-hint" id="analyst" v-if="managersUnlocked && !analystsUnlocked">
					<div>Reach<br>4 Products<br>to Unlock<br>*******s</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="worker-wrapper" id="salesperson" v-if="salespeopleUnlocked"
				v-b-tooltip.hover.html title="<b>Salesperson</b><br>
											  Attempts to sell a<br>
											  Project ($400) every minute<br>
											  and sell a Product ($2000)<br>
											  every 5 minutes<br>
											  Costs 1 Money per Second">
					<div class="add-worker">
						<button v-on:click="hireSalesperson()">+</button>
					</div>
					<div>Salespeople:<br>{{ formatNumber(salespeople) }}</div>
					<div class="remove-worker">
						<button v-on:click="fireSalesperson()">-</button>
					</div>
				</div>

				<div class="worker-hint" id="salesperson" v-if="analystsUnlocked && !salespeopleUnlocked">
					<div>Reach<br>5 Products<br>to Unlock<br>***********</div>
				</div>
			</transition>

			<transition name="fade">
				<div class="worker-wrapper" id="executive" v-if="executivesUnlocked"
				v-b-tooltip.hover.html title="<b>Executive</b><br>
											  Allows you to hire in groups<br>
											  Each one increases your<br>
											  group hire limit by one<br>
											  Costs 5 Money per second">
					<div class="add-worker">
						<button v-on:click="hireExecutive()">+</button>
					</div>
					<div>Executives:<br>{{ formatNumber(executives) }}</div>
					<div class="remove-worker">
						<button v-on:click="fireExecutive()">-</button>
					</div>
				</div>

				<div class="worker-hint" id="executive" v-if="salespeopleUnlocked && !executivesUnlocked">
					<div>Reach<br>100k Money<br>to Unlock<br>*********s</div>
				</div>
			</transition>
		</div>

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

import { mapState, mapMutations } from "vuex";
const numberformat = require("swarm-numberformat");

export default {
	components: {},

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

		bankruptcy() {
			this.setValue("interns", 0);
			this.setValue("employees", 0);
			this.setValue("managers", 0);
			this.setValue("analysts", 0);
			this.setValue("salespeople", 0);
			this.setValue("executives", 0);
			this.setValue("effort", 0);
			this.setValue("time", 0);
			this.setValue("productivity", 0);
			this.setValue("money", 0);
			this.setValue("projects", 0);
			this.setValue("products", 0);

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

		hireIntern() {
			this.adjustCurrency("interns", 1);
			this.updateRates();
		},

		groupHireInterns() {
			if (this.internGroupSize <= this.executives) {
				this.adjustCurrency("interns", this.internGroupSize);
				this.updateRates();
			}
		},

		fireIntern() {
			if (this.interns > 0) {
				this.adjustCurrency("interns", -1);
				this.flashRed("intern");
				this.updateRates();
			}
		},

		hireEmployee() {
			this.adjustCurrency("employees", 1);
			this.updateRates();
		},

		groupHireEmployees() {
			if (this.employeeGroupSize <= this.executives) {
				this.adjustCurrency("employees", this.employeeGroupSize);
				this.updateRates();
			}
		},

		fireEmployee() {
			if (this.employees > 0) {
				this.adjustCurrency("employees", -1);
				this.flashRed("employee");
				this.updateRates();
			}
		},

		hireManager() {
			this.adjustCurrency("managers", 1);
			this.updateRates();
		},

		groupHireManagers() {
			if (this.managerGroupSize <= this.executives) {
				this.adjustCurrency("managers", this.managerGroupSize);
				this.updateRates();
			}
		},

		fireManager() {
			if (this.managers > 0) {
				this.adjustCurrency("managers", -1);
				this.flashRed("manager");
				this.updateRates();
			}
		},

		hireAnalyst() {
			this.adjustCurrency("analysts", 1);
			this.updateRates();
		},

		groupHireAnalysts() {
			if (this.analystGroupSize <= this.executives) {
				this.adjustCurrency("analysts", this.analystGroupSize);
				this.updateRates();
			}
		},

		fireAnalyst() {
			if (this.analysts > 0) {
				this.adjustCurrency("analysts", -1);
				this.flashRed("analyst");
				this.updateRates();
			}
		},

		hireSalesperson() {
			this.adjustCurrency("salespeople", 1);
			this.updateRates();
		},

		groupHireSalespeople() {
			if (this.salespersonGroupSize <= this.executives) {
				this.adjustCurrency("salespeople", this.salespersonGroupSize);
				this.updateRates();
			}
		},

		fireSalesperson() {
			if (this.salespeople > 0) {
				this.adjustCurrency("salespeople", -1);
				this.flashRed("salesperson");
				this.updateRates();
			}
		},

		hireExecutive() {
			this.adjustCurrency("executives", 1);
			this.updateRates();
		},

		groupHireExecutives() {
			if (this.executiveGroupSize <= this.executives) {
				this.adjustCurrency("executives", this.executiveGroupSize);
				this.updateRates();
			}
		},

		fireExecutive() {
			if (this.executives > 0) {
				this.adjustCurrency("executives", -1);
				this.flashRed("executive");
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

		debugSet() {
			let res = document.getElementById("debug-resource").value;
			let val = parseInt(document.getElementById("debug-value").value);
			console.log(res);
			console.log(val);
			this.setValue(res, val);
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
				this.$refs.offlineModal.show();
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

.footer {
	position: absolute;
	height: 38px;
	padding-left: 2px;
	padding-right: 2px;
	left: 0;
	right: 0;
	bottom: 0;
	border: 1px solid black;
	background-color: lightskyblue;
}

.footer > * {
	margin: 2px;
}

.debug {
	display: inline-block;
}

#bankrupt-button {
	background-color: red;
	float: right;
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

#intern {
	background-color: rgba(0, 0, 255, 0.05);
}

#employee {
	background-color: rgba(0, 0, 255, 0.20);
}

#manager {
	background-color: rgba(0, 0, 255, 0.35);
}

#analyst {
	background-color: rgba(0, 0, 255, 0.5);
}

#salesperson {
	background-color: rgba(0, 0, 255, 0.65);
}

#executive {
	background-color: rgba(0, 0, 255, 0.8);
}

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
