
// xyz
// x - type
// y - level
// z - unique index
const symbosis = {
    code: {
        race: {
            dwarf: [111, 121, 131],
            forsaken: [112, 122, 132],
            order: [113, 123, 133],
            skaven: [114, 124, 134],
        },
        role: {
            warrior: [211, 221, 231],
            hunter: [212, 222, 232],
            assasin: [213, 223, 233],
            mage: [214, 224, 234],
        },
        raceRole: {
            knight: [311, 321, 331],
            priest: [312, 322, 332],
            warlock: [313, 323, 333],
            merchant: [314, 324, 334],
        }
    },

    text: {
        race: {
            dwarf: ["Spell: +2hp dla każdego Dwarfa na polu bitwy", "Passive: Każdy Dwarf ma +1hp", "Paczka 3 losowych spelli wtasowana do talii"],
            forsaken: ["Spell: 2dmg w aoe dla wszystkich stronników (0g)", "Karty o koszcie 5g kosztują 4g", "Jednostki zranione otrzymują bonus do ataku równy utraconemu zdrowiu."],
            order: ["Spell: Ulecz wszystkie przyjazne cele +2hp (0g)", "Agonia: Jesli zginie jednostka z Order, możesz uleczyć cel o 1.", "Wtasuj to talii: Archanioła 4 /4 i za 3G z prowokacją."],
            skaven: ["Spell: Kopiujesz swojego stronnika (0g)", "Agonia: Jeśli skawen ginie masz 50%, że wróci do decku", "Double deck: wszystkie karty są zduplikowane w decku."],
        },
        role: {
            warrior: ["Pierwszy zagrany wojownik ma prowokacje.", "Po śmierci zadaje 1 obrażenia wybranemu celowi.", "Po każdym ataku zadaje 1 obrażenia wybranemu celowi."],
            hunter: ["Dodaj do talii Peta (1at/1hp/0g]", "Dodaj do talii 2x Peta (1at/1hp/0g]", "Dodaj do talii 3x Peta (2at/2hp/1g]"],
            assasin: ["Spell: Zabij jednostkę z tauntem.", "Może atakować stronników pomijając prowokacje.", "Może atakować dowolny cel pomijając prowokacje."],
            mage: ["Spell: 2dmg o koszcie 0g", "Zmniejsz koszt spelli o 1g (min koszt to 1g)", "Na koniec tury dodaj do ręki wszystkie użyte w tej rundzie karty zaklęć."],
        },
        raceRole: {
            knight: ["Każdy Knight posiada prowokacje.", "Każdy Knight otrzymuje +2hp", "Dodaj do talii 2x Devinie Shield o koszcie 0"],
            priest: ["Na wejściu: ulecz wybranego stronnika o 1hp", "Na wejściu: ulecz dowolny cel o 1hp", "Na koniec tury ulecz bohatera o tyle ile masz priestów na polu walki."],
            warlock: ["Spell: Sakryfajs za 2g", "Agonia: Dobierz karte z decka", "Agonia: Zadaj 1 dmg wrogiemu bohaterowi"],
            merchant: ["Spell: +2g (koszt 0g)", "Spell: +3g (koszt 0g)", "Passive: Na koniec tury otrzymujesz tyle złota ile masz merchantów na polu walki."],
        }
    },

    getCode: function (type, level, uniqueIndex) {
        try {
            if (type > 3) throw new Error("This type is not defined");
            if (level > 3) throw new Error("This level is not defined");

            if (type == 1) uniqueIndex = (uniqueIndex + 1);

            else {
                if (uniqueIndex < 4) uniqueIndex = (uniqueIndex + 1);
                else uniqueIndex = (uniqueIndex - 3);
            }

            return parseInt(type.toString() + level.toString() + uniqueIndex.toString());
        } catch (err) {
            console.log(err)
        }
    },

    getText: function (code) {
        code = code.toString();

        let x, y, z;
        x = parseInt(code[0]) - 1;
        y = parseInt(code[1]) - 1;
        z = parseInt(code[2]) - 1;

        let textFromCode = Object.values(symbosis.text)[x];
        textFromCode = Object.values(textFromCode)[y][z];
        return textFromCode;
    },
};

module.exports = symbosis;
