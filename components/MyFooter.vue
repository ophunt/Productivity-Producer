<template>
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
</template>


<script>

import { mapState, mapMutations } from "vuex";

export default {

	computed: {

		...mapState ({
			debug: state => state.debug,

			effort: state => state.player.effort,
			time: state => state.player.time,
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
	}

};

</script>

<style>

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

.fade-enter-active, .fade-leave-active {
	transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
