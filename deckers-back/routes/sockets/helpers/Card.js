class Card {
    static compareCards(a, b) {
        if (a.level !== b.level) {
            console.log("Card level is not equal")
            return false;
        }
        if (a.rarity !== b.rarity) {
            console.log("Card rarity is not equal")
            return false;
        }
        if (a.race !== b.race) {
            console.log("Card race is not equal")
            return false;
        }
        if (a.role !== b.role) {
            console.log("Card role is not equal")
            return false;
        }

        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a.inGame.stats);
        var bProps = Object.getOwnPropertyNames(b.inGame.stats);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            console.log("Card properties length is not equal")
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName] && propName !== "_id") {
                console.log("Card " + propName + " is not equal")
                return false;
            }
        }
        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}

module.exports = Card