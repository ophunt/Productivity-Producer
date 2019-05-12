<template>
	<div class="app">
		<Footer />
		<OfflineModal />

		<div class="left-col">
			<Currencies />
			<Projects />
			<Workers />
			<GroupHire />
		</div>

		<div class="right-col">
			<PrestigeUpgrades />
		</div>
	</div>
</template>

<script>

import { mapState, mapMutations } from "vuex";

import Footer from "~/components/Footer.vue";
import OfflineModal from "~/components/OfflineModal.vue";
import Currencies from "~/components/Currencies.vue";
import Projects from "~/components/Projects.vue";
import Workers from "~/components/Workers.vue";
import GroupHire from "~/components/GroupHire.vue";
import PrestigeUpgrades from "~/components/PrestigeUpgrades.vue";

const numberformat = require("swarm-numberformat");

export default {

	components: {
		Footer,
		OfflineModal,
		Currencies,
		Projects,
		Workers,
		GroupHire,
		PrestigeUpgrades
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
	width: 100%;
	margin: auto;
	margin-bottom: 0px;
}

.left-col {
	float: left;
	width: 824px;
	margin: 5px;
}

.right-col {
	float: right;
	background-color: red;
	width: 260px;
	height: 600px;
	margin: 5px;
}

.redBackground {
	background-color: red;
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
