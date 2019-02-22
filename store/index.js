export const state = () => ({
	VERSION: "0.4.99",
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

		productsUnlocked: false,
		products: 0,

		internsUnlocked: false,
		interns: 0,

		employeesUnlocked: false,
		employees: 0,
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
	},

	checkUnlocks (state) {
		// Projects
		if (!state.player.projectsUnlocked && state.player.productivity >= 10) {
			state.player.projectsUnlocked = true;
		}
		// Products
		if (!state.player.productsUnlocked && state.player.projects >= 10) {
			state.player.productsUnlocked = true;
		}
		// Interns
		if (!state.player.internsUnlocked && state.player.products >= 1) {
			state.player.internsUnlocked = true;
		}
		// Employees
		if (!state.player.employeesUnlocked && state.player.products >= 2) {
			state.player.employeesUnlocked = true;
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

			productsUnlocked: false,
			products: 0,

			internsUnlocked: false,
			interns: 0,

			employeesUnlocked: false,
			employees: 0,
		};
	},
};
