import warrior from './icon_class_warrior.png';
import hunter from './icon_class_hunter.png';
import assassin from './icon_class_assassin.png';
import mage from './icon_class_mage.png';
import knight from './icon_class_knight.png';
import priest from './icon_class_priest.png';
import warlock from './icon_class_warlock.png';
import merchant from './icon_class_merchant.png';

import dwarfs from './icon_race_dwarfs.png';
import forsaken from './icon_race_forsaken.png';
import order from './icon_race_order.png';
import skaven from './icon_race_skaven.png';

const classImages = new Map();
const raceImages = new Map();

classImages.set(0, warrior)
classImages.set(1, hunter)
classImages.set(2, assassin)
classImages.set(3, mage)
classImages.set(4, knight)
classImages.set(5, priest)
classImages.set(6, warlock)
classImages.set(7, merchant)

raceImages.set(0, dwarfs)
raceImages.set(1, forsaken)
raceImages.set(2, order)
raceImages.set(3, skaven)


export { classImages, raceImages } 