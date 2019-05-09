<template>
	<div class="prestigeUpgradeWrapper">
		<PUpgrade1 />
		<PUpgrade2 />
		<PUpgrade3 />
		<PUpgrade4 />
	</div>
</template>

<script>

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
	}

};

</script>

<style>

.prestigeUpgradeWrapper {
	padding-top: 20px;
	padding-left: 20px;
}

.prestigeUpgrade {
	display: inline-block;
	margin-right: 18px;
	margin-bottom: 19px;
	height: 100px;
	width: 100px;
	border: 1px solid black;
}

</style>
