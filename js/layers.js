addLayer("b", {
    name: "balloons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🎈", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00ffff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "balloons", // Name of prestige currency
    baseResource: "air", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.833333333333333, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        exp = new Decimal(1)
        if (hasUpgrade('b',22)) mult = mult.times(upgradeEffect('b',22))
        return mult.pow(exp)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for balloons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        if (hasUpgrade('b', 21)) {
            let pendingBalloons = getResetGain('b');
            let passiveGain = pendingBalloons.times(diff);
            player.b.points = player.b.points.add(passiveGain);
        }
    },
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
            description: "Multiplies your air gain based on balloons.",
            cost: new Decimal(5),
            tooltip: "<small>Formula: (balloons+log(balloons+10))^0.8</small>",
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
        14: {
            title: "BU4",
            description: "Multiplies your air gain by balloon upgrades bought.",
            cost: new Decimal(100),
            effect() {
                return new Decimal(Object.keys(player.b.upgrades).length).max(1);
            },
        },
        15: {
            title: "BU5",
            description: "Multiplies your air gain based on air.",
            cost: new Decimal(1000),
            tooltip: "<small>Formula: log2(air+2)^1.25</small>",
            effect() {
                let air = player.points;
                let logBase2 = air.add(2).log10().div(new Decimal(2).log10());
                return logBase2.pow(1.25).max(1);
            },
            effectDisplay() {
                return "*" + format(upgradeEffect(this.layer, this.id))
            },
        },
        21: {
            title: "BU6",
            description: "Gain 100% of your balloons on reset every second.",
            cost: new Decimal("1e9"),
            unlocked() { return hasUpgrade('b', 15); },
        },
        22: {
            title: "BU7",
            description: "Multiply your balloons based on air.",
            cost: new Decimal("1e11"),
            tooltip: "<small>Formula: (air/10)^0.15, softcaps at 1e201 air</small>",
            effect() {
                let air = player.points
                if (player.points.lte(new Decimal("1e201"))){
                    return air.times(0.1).pow(0.15);
                }
                return new Decimal(10).pow((air.times(0.1).pow(0.15).log10().pow(0.9).times(new Decimal(1e30).pow(0.1))));
            },
            effectDisplay() {
                return "*" + format(upgradeEffect(this.layer, this.id))
            },
        }
    }
})
