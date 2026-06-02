window.Decimal = OmegaNum;
let modInfo = {
	name: "The Balloon Tree",
	author: "The universe",
	pointsName: "air",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1000000,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.0.1",
	name: "The first",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0.0.1 (June 1, 2026, 23:3)</h3><br>
		<b>The balloon update</b><br>
		- Added balloons.<br>
		- Added rubber.<br>
		- Added 10 balloon upgrades.<br>`

let winText = `Congratulations! You made a few too many balloons. What now?`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	//Addition
	//B upgrades
	if (hasUpgrade('b',12)) gain = gain.add(2);
	
	//Multiplication
	//R effect
	if (player.r && player.r.unlocked) {
        gain = gain.times(layers.r.effect());
    }
	//B upgrades
	if (hasUpgrade('b',11)) gain = gain.times(2);
	if (hasUpgrade('b',13)) gain = gain.times(upgradeEffect('b',13));
	if (hasUpgrade('b',14)) gain = gain.times(upgradeEffect('b',14));
	if (hasUpgrade('b',15)) gain = gain.times(upgradeEffect('b',15));
	//Achievement rewards
	if (hasAchievement('a',12)) gain = gain.times(1.1);

	//Exponentiation
	//B upgrades
	if (hasUpgrade('b',24)) gain = gain.pow(1.2);
	//Softcaps
	if (player.points.gte(new Decimal("1e300"))) gain = new Decimal(10).pow(player.points.log10().times(0.75).add(75))
	
	return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Unless stated otherwise, addition happens before multiplication, which happens before exponentiation, and so on."
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e300"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}