addLayer("b", {
    name: "balloons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#854550",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "balloons", // Name of prestige currency
    baseResource: "air", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.833333333333333, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for balloons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "BU1",
            description: "Doubles your air gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "BU2",
            description: "Adds 2 to your base air gain.",
            cost: new Decimal(3),
        },
        13: {
            title: "BU3",
            description: "Multiplies your air gain by (balloons+log(balloons+10))^0.8",
            cost: new Decimal(5),
            effect() {
                let balloons = player.b.points;
                let logPart = balloons.add(10).log10(); 
                let baseValue = balloons.add(logPart);
                let finalEffect = baseValue.pow(0.8);
                return finalEffect;
            },
            effectDisplay() {
                return "*" + format(upgradeEffect(this.layer, this.id));
            },
        },
    }
})
