// Helper functions

module.exports = {
    getRandomIntInclusive: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },

    needsBirth: function(cat) {
        if (cat[0] == true && cat[1] == true) {
            return true;
        } else {
            return false;
    }}

};