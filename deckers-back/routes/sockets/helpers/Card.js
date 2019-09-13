class Card {
    static compareCards(a, b) {
        if (a.level !== b.level) return false;
        if (a.rarity !== b.rarity) return false;
        if (a.race !== b.race) return false;
        if (a.role !== b.role) return false;

        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a.inGame.stats);
        var bProps = Object.getOwnPropertyNames(b.inGame.stats);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName] && propName !== "_id") {

                return false;
            }
        }
        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}

module.exports = Card