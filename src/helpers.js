// Helper functions

module.exports = {
    getRandomIntInclusive: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },


    getPopulation: function() {
        myContract.methods.totalSupply().call().then(function(supply) {
            return supply;
        })
    },



    getTransactionCount: function(address) {
        web3.eth.getTransactionCount(address).then(function(txCount) {
            return txCount;
        });

    },

    needsBirth: function(cat) {
        if (cat[0] == true && cat[1] == true) {
            return true;
        } else {
            return false;
        }

    },

    getAuction: function(id) {
        let auctionCatId = id;
        try {
            var callData = buyCatContract.methods.getAuction(auctionCatId).call().then(function(cat) {
                    console.log("This cat is for sale! " + id)
                    console.log(cat);
                },
                function(err) {
                    if (err.toString().indexOf("is not a valid Ethereum address") >= -1)
                        console.log("Cat not for sale");
                });
        } catch (err) {
            console.log("No sale for " + id);
        }
    },

    range: function(a, b, c) { c = []; while (a--) c[a] = a + b; return c }

};