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
				v-b-tooltip.hover.html title="Gain Productivity for<br>10 Effort and 1 Time">
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

		<transition name="fade">
			<div class="project-wrapper" v-if="projectsUnlocked">
				<div
				class="make-project"
				v-b-tooltip.hover title="Create new Project for 10 Productivity (15 max)"
				v-on:click="makeProject()">
					<p>Make<br>Project</p>
				</div>
				<div
				class="project"
				v-for="n in projects" :key="n"
				v-b-tooltip.hover.html title="Earns you 1<br>Money per second">
				<p>Project<br>{{ n }}</p>
				</div>
			</div>
		</transition>
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
			products: state => state.player.products,
		}),

	},

	methods: {

		...mapMutations ([
			"tick",
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
			return this.productivity;
		},

		calcTimePerSecond() {
			return 0;
		},

		calcProductivityPerSecond() {
			return 0;
		},

		calcMoneyPerSecond() {
			return this.projects + this.products * 10;
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
					"Gain Productivity for<br>10 Effort and 1 Time",
					"productivity-inner",
					1000);
			}
		},

		makeProject() {
			if (this.productivity >= 10 && this.projects + this.products < 15) {
				this.adjustCurrency("projects", 1);
				this.adjustCurrency("productivity", -10);
				this.updateRates();
			}
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

.project-wrapper {
	margin: 5px;
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
}

.project {
	background-color: silver;
}


.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
