export default {
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    removeElement(elem) {
        elem.parentNode.removeChild(elem);
    },

    mapToString(map){
        return JSON.stringify(Array.from(map));
    },

    stringToMap(string){
        return new Map(JSON.parse(string));
    }
}