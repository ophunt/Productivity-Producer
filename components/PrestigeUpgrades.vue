<template>
	<transition name="fade">
		<div class="prestigeUpgradeWrapper" v-if="prestigeUpgradesUnlocked">
			<PUpgrade1 />
			<PUpgrade2 />
			<PUpgrade3 />
			<PUpgrade4 />
		</div>
	</transition>
</template>

<script>

import { mapState } from "vuex";

import PUpgrade1 from "~/components/PrestigeUpgrades/PUpgrade1.vue";
import PUpgrade2 from "~/components/PrestigeUpgrades/PUpgrade2.vue";
import PUpgrade3 from "~/components/PrestigeUpgrades/PUpgrade3.vue";
import PUpgrade4 from "~/components/PrestigeUpgrades/PUpgrade4.vue";

export default {

	components: {
		PUpgrade1,
		PUpgrade2,
		PUpgrade3,
		PUpgrade4,
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

			prestigeUpgradesUnlocked: state => state.player.prestigeUpgradesUnlocked,
		}),

	}

};

</script>

<style>

.prestigeUpgradeWrapper {
	padding-top: 20px;
	padding-left: 20px;
}

.prestigeUpgrade {
	float: left;
	margin-right: 18px;
	margin-bottom: 18px;
	height: 100px;
	width: 100px;
	border: 1px solid black;
}

</style>
