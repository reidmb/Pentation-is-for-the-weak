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
        let mult = new Decimal(1)
        let exp = new Decimal(1)
        if (hasUpgrade('b',22)) mult = mult.times(upgradeEffect('b',22))
        if (hasUpgrade('b',23)) mult = mult.times(new Decimal("1e10"))
        if (layers.r && player.r && player.r.unlocked) {
            mult = mult.times(layers.r.effect());
        }
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
            unlocked() {return hasUpgrade('b',11);},
        },
        13: {
            title: "BU3",
            description: "Multiplies your air gain based on balloons.",
            cost: new Decimal(5),
            tooltip: "<small>Formula: (balloons+log(balloons+10))^0.8</small>",
            unlocked() {return hasUpgrade('b',12);},
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
            unlocked() {return hasUpgrade('b',13);},
            effect() {
                return new Decimal(Object.keys(player.b.upgrades).length).max(1);
            },
        },
        15: {
            title: "BU5",
            description: "Multiplies your air gain based on air.",
            cost: new Decimal(1000),
            tooltip: "<small>Formula: log2(air+2)^1.25</small>",
            unlocked() {return hasUpgrade('b',14);},
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
            unlocked() {return hasUpgrade('b',15);},
        },
        22: {
            title: "BU7",
            description: "Multiply your balloons based on air.",
            cost: new Decimal("1e11"),
            tooltip: "<small>Formula: (air/10)^0.15, softcaps at 1e201 air</small>",
            unlocked() {return hasUpgrade('b',21);},
            effect() {
                let air = player.points
                if (player.points.lte(new Decimal("1e201"))){
                    return air.times(0.1).pow(0.15);
                }
                return new Decimal(10).pow((air.times(0.1).pow(0.15).log10().times(0.9).add(3)));
            },
            effectDisplay() {
                return "*" + format(upgradeEffect(this.layer, this.id))
            },
        },
        23: {
            title: "BU8",
            description: "Multiply your balloons by 1e10.",
            cost: new Decimal("1e20"),
            unlocked() {return hasUpgrade('b',22);},
        },
        24: {
            title: "BU9",
            description: "Raise your air to 1.2.",
            cost: new Decimal("1e70"),
            unlocked() {return hasUpgrade('b',23);},
        },
        25: {
            title: "BU10",
            description: "Unlock rubber.",
            cost: new Decimal("1e200"),
            unlocked() {return hasUpgrade('b',24);},
        }
    }
}),
addLayer("r", {
    name: "rubber", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00ffff",
    requires(){return new Decimal("2e222").pow(player.r.points.add(1).pow(0.5))}, // Can be a function that takes requirement increases into account
    resource: "rubber", // Name of prestige currency
    baseResource: "air", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        let exp = new Decimal(1)
        return mult.pow(exp)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rubber", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        if (false) {
            player.r.points = player.r.points.add(getResetGain('r').times(diff));
        }
    },
    effect() {
        let rubber = player.r.points;
        if (rubber.lte(100)) {
            return new Decimal(3).pow(rubber);
        } else {
            let basePart = new Decimal(3).pow(100);
            let overPart = rubber.sub(100).pow(0.2);
            let softcapPart = new Decimal(3).pow(overPart);
            return basePart.times(softcapPart);
        }
    },
    effectDisplay() {
        return "*" + format(layers.r.effect());
    },
    tabFormat: [
        "main-display",
        "blank",
        ["display-text", function() { return "Your rubber is providing a <span class='hueshift-text'>*" + format(layers.r.effect()) + "</span> bonus to air and balloon gain."; }],
        "blank",
        "upgrades"
    ],
    upgrades: {
        
    }
}),
addLayer("a", {
    name: "Achievements",
    symbol: "A",
    position: 0, 
    startData() { return {
        unlocked: true, 
    }},
    color: "#E5C158",
    type: "none", 
    row: "side",
    layerShown() { return true; },
    tooltip() {
        if (!player.a || !player.a.achievements) return "0 Achievements earned";
        return Object.keys(player.a.achievements).length + " Achievements earned";
    },
    achievements: {
        11: {
            name: "Getting started",
            done() { return player.points.gte(1); },
            tooltip: "Reach 1 air.",
        },
        12: {
            name: "Pop culture",
            done() { return player.b.points.gte(1); },
            tooltip: "Reach 1 balloon.<br>Reward: multiply air gain by 1.1.",
        },
        13: {
            name: "Now it\'s a party",
            done() { return hasUpgrade('b', 13); },
            tooltip: "Purchase BU3.",
        },
        14: {
            name: "Inflation in both contexts",
            done() { return hasUpgrade('b',24); },
            tooltip: "Purchase BU9."
        },
        15: {
            name: "Flexible",
            done() { 
                return player[this.layer] && hasUpgrade('b', 25) && player.r.points.gte(1); 
            },
            tooltip: "Reach 1 rubber."
        }
    }
})