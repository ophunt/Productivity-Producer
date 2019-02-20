export const state = () => ({
	VERSION: "0.3.1",
	debug: true,
	player: {
		lastUpdated: null,
		effort: 0,
		effortPerSecond: 0,
		time: 0,
		timePerSecond: 0,
		productivity: 0,
		productivityPerSecond: 0,
		money: 0,
		moneyPerSecond: 0,
		projectsUnlocked: false,
		projects: 0,
		products: 0,
	},
});

export const mutations = {

	setValue (state, payload) {
		let resource = payload.resource;
		let value = payload.value;
		state.player[resource] = value;
	},

	adjustCurrency (state, payload) {
		let resource = payload.resource;
		let amount = payload.amount;
		state.player[resource] += amount;
	},

	tick (state) {
		let curTime = Date.now();
		if (state.player.lastUpdated) {
			let deltaTime = curTime - state.player.lastUpdated;
			let delSeconds = deltaTime / 1000;
			state.player.effort += state.player.effortPerSecond * delSeconds;
			state.player.time += state.player.timePerSecond * delSeconds;
			state.player.productivity += state.player.productivityPerSecond * delSeconds;
			state.player.money += state.player.moneyPerSecond * delSeconds;
		}
		state.player.lastUpdated = curTime;
		if (!state.player.projectsUnlocked && state.player.productivity >= 10) {
			state.player.projectsUnlocked = true;
		}
	},

	load (state) {
		if (localStorage.getItem("saveFile")) {
			let file = JSON.parse(localStorage.getItem("saveFile"));
			if (file.VERSION === state.VERSION) {
				state.player = file.player;
			} else {
				for (let key of Object.keys(file.player)) {
					if (typeof(key) === "object") {
						for (let key1 of Object.keys(file.player[key])) {
							state.player[key][key1] = file.player[key][key1];
						}
					} else {
						state.player[key] = file.player[key];
					}
				}
			}
		}
	},

	resetState (state) {
		state.player = {
			lastUpdated: null,
			effort: 0,
			effortPerSecond: 0,
			time: 0,
			timePerSecond: 0,
			productivity: 0,
			productivityPerSecond: 0,
			money: 0,
			moneyPerSecond: 0,
			projectsUnlocked: false,
			projects: 0,
			products: 0,
		};
	},
};
