const mongoose = require("mongoose");
const { Store } = require("./../models/store.model");
const User = require("./../models/user.model");

module.exports = {
	getStore: (req, res) => {
		try {
			Store.find().then((store) => res.json(store));
		} catch (error) {
			res.status(404).json({ message: error.message });
		}
	},
	getStoreByUser: (req, res) => {
		if (req.params.owner.match(/^[0-9a-fA-F]{24}$/)) {
			try {
				Store.find({ owner: req.params.owner }).then((stores) =>
					User.findOne({ _id: req.params.owner }).then((user) => {
						console.log("test");
						res.json({ stores, userName: user.name });
					})
				);
			} catch (error) {
				res.status(404).json({ message: error.message });
			}
		}
	},
	getOneStore: (req, res) => {
		try {
			Store.findById(req.params.id)
				.then((store) => res.json(store))
				.catch((error) => res.json(null));
		} catch (error) {
			res.status(404).json({ message: error.message });
		}
	},
	addStore: async (req, res) => {
		const store = req.body;
		try {
			await Store.find({ owner: store.owner })
				.count()
				.then((count) => {
					count_owner = count;
				});
			await Store.find({ fullName: store.fullName })
				.count()
				.then((count) => {
					count_name = count;
				});

			if (count_owner > 1) {
				res.status(400).json({ message: "Maximum Stores by User Reached" });
			}
			if (count_name > 0) {
				res.status(400).json({ message: "Store name already exists" });
			}
			const newStore = new Store(store);
			newStore.save();
			res.status(201).json(newStore);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	updateStore: (req, res) => {
		console.log(req.body);
		const {
			fullName,
			profileImage,
			description,
			address,
			phone,
			email,
			website,
			facebook,
			instagram,
			twitter,
		} = req.body;
		try {
			Store.findByIdAndUpdate(req.params.id, {
				fullName,
				profileImage,
				description,
				address,
				phone,
				email,
				contact: {
					website,
					facebook,
					instagram,
					twitter,
				},
			}).then((store) => {
				res.json(store);
			});
		} catch (error) {
			res.status(400).json({ message: error });
		}
	},
	deleteStore: (req, res) => {
		try {
			let id = mongoose.Types.ObjectId(req.params.id);
			Store.deleteMany({ _id: id }).exec(function (err, results) {
				console.log("Store Removed.", results);
			});
			Store.findByIdAndDelete({ _id: req.params.id }).then((store) =>
				res.json(store)
			);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	verifyStore: async (req, res) => {
		try {
			await Store.updateOne({ _id: req.params.id }, { verified: true });
			res.json("Store Verified");
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
};
