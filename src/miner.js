var helpers = require("./helpers.js")

var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

// You should be running a local Eth node or use Infura.   
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var prompt = require('prompt');


var sendingAddress = ''  // with your sending ETH address
var pKey = ""; // This will store the corresponding private key.  we'll be getting the private key for this Eth address from a command prompt 


// Keep track of kitties we'll mine to avoid double-mining 
var kittyArray = []

var theNonce = "";
// Gas price.   Todo: Use Eth gas station Oracle to predict gas prices 
var gwei = '26'

// Track # of received 
var num_requested = 0
var num_received = 0

// Contract for Kitty Core 
var address = "";
var abiArray = [{ "constant": true, "inputs": [{ "name": "_interfaceID", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cfoAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_tokenId", "type": "uint256" }, { "name": "_preferredTransport", "type": "string" }], "name": "tokenMetadata", "outputs": [{ "name": "infoUrl", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "promoCreatedCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "ceoAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "GEN0_STARTING_PRICE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "setSiringAuctionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "pregnantKitties", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_kittyId", "type": "uint256" }], "name": "isPregnant", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "GEN0_AUCTION_DURATION", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "siringAuction", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "setGeneScienceAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newCEO", "type": "address" }], "name": "setCEO", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newCOO", "type": "address" }], "name": "setCOO", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_kittyId", "type": "uint256" }, { "name": "_startingPrice", "type": "uint256" }, { "name": "_endingPrice", "type": "uint256" }, { "name": "_duration", "type": "uint256" }], "name": "createSaleAuction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "sireAllowedToAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_matronId", "type": "uint256" }, { "name": "_sireId", "type": "uint256" }], "name": "canBreedWith", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "kittyIndexToApproved", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_kittyId", "type": "uint256" }, { "name": "_startingPrice", "type": "uint256" }, { "name": "_endingPrice", "type": "uint256" }, { "name": "_duration", "type": "uint256" }], "name": "createSiringAuction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "val", "type": "uint256" }], "name": "setAutoBirthFee", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }, { "name": "_sireId", "type": "uint256" }], "name": "approveSiring", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newCFO", "type": "address" }], "name": "setCFO", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_genes", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "createPromoKitty", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "secs", "type": "uint256" }], "name": "setSecondsPerBlock", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "name": "owner", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "GEN0_CREATION_LIMIT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "newContractAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "setSaleAuctionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "count", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_v2Address", "type": "address" }], "name": "setNewAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "secondsPerBlock", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "tokensOfOwner", "outputs": [{ "name": "ownerTokens", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_matronId", "type": "uint256" }], "name": "giveBirth", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawAuctionBalances", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "cooldowns", "outputs": [{ "name": "", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "kittyIndexToOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "cooAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "autoBirthFee", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "erc721Metadata", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_genes", "type": "uint256" }], "name": "createGen0Auction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_kittyId", "type": "uint256" }], "name": "isReadyToBreed", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "PROMO_CREATION_LIMIT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_contractAddress", "type": "address" }], "name": "setMetadataAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "saleAuction", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getKitty", "outputs": [{ "name": "isGestating", "type": "bool" }, { "name": "isReady", "type": "bool" }, { "name": "cooldownIndex", "type": "uint256" }, { "name": "nextActionAt", "type": "uint256" }, { "name": "siringWithId", "type": "uint256" }, { "name": "birthTime", "type": "uint256" }, { "name": "matronId", "type": "uint256" }, { "name": "sireId", "type": "uint256" }, { "name": "generation", "type": "uint256" }, { "name": "genes", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sireId", "type": "uint256" }, { "name": "_matronId", "type": "uint256" }], "name": "bidOnSiringAuction", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "gen0CreatedCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "geneScience", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_matronId", "type": "uint256" }, { "name": "_sireId", "type": "uint256" }], "name": "breedWithAuto", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "matronId", "type": "uint256" }, { "indexed": false, "name": "sireId", "type": "uint256" }, { "indexed": false, "name": "cooldownEndBlock", "type": "uint256" }], "name": "Pregnant", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "to", "type": "address" }, { "indexed": false, "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "approved", "type": "address" }, { "indexed": false, "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "kittyId", "type": "uint256" }, { "indexed": false, "name": "matronId", "type": "uint256" }, { "indexed": false, "name": "sireId", "type": "uint256" }, { "indexed": false, "name": "genes", "type": "uint256" }], "name": "Birth", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newContract", "type": "address" }], "name": "ContractUpgrade", "type": "event" }]
// Set up contracts so we can interact with it 
var myContract = new web3.eth.Contract(abiArray);
myContract._address = address;


// Calls the giveBirth method in the KittyCore smart contract.    
// @param id Integer the kitty id 
// @param earlyBirth Bool .   If true, sends with less gas.   Used for when we are calling the birth method ahead of the birth block. 
function birthKitty(id,earlyBirth) {
	if (earlyBirth) {
		gweiPrice = gwei - 5;
	}
	else {
		gweiPrice = gwei;
	}

    // Increment the nonce for the next transaction.   
    theNonce = theNonce + 1

    // The method being called in hex, with padding.
    dataValue = "0x88c2a0bf00000000000000000000000000000000000000000000000000000000000"
    if (id <= 65535) {
        dataValue += "0"
    }

    // This is the body of the Tx
    var rawTx = {
        nonce: web3.utils.toHex(theNonce),
        gasPrice: web3.utils.toHex(parseInt(web3.utils.toWei(gweiPrice.toString(), 'gwei'))),
        gasLimit: '0x3FB88',
        to: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
        value: '0x00',
        data: dataValue + web3.utils.toHex(id).replace('0x', ''),
        chainId: 1
    }
    console.log(rawTx);

    // Initialize and buffer the private key for your Eth address, and sign the transaction 
    var privateKey = new Buffer(pKey, 'hex')
    console.log(pKey)

    var tx = new Tx(rawTx);
    tx.sign(privateKey);

    var serializedTx = tx.serialize();

    // Don't mine this kitty twice! 
    if (kittyArray.indexOf(id) == -1) {
        p = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
            console.log("##//// Kitty Miner ////##")
            console.log(":: Mining Kitty " + id + "::");
            console.log(":: Sending with nonce" + theNonce + "::");
            console.log("##////////////////////##")

            kittyArray.push(id)

            if (!err) {
                // Spit out the Tx hash
                console.log(hash);

            } else {
                console.log(err.toString().substring(0, 400));
            }
        });
    } else {
        // If something went wrong, decrement the nonce.  
        theNonce = theNonce - 1;
    }

}


function iterateAndBirthCats(from, to) {
    num_requested += (to - from)
    for (i = from; i < to; i++) {
        let k = i;

        // safety check 
        if (k > population) {
            return false;
        }

        var callData = myContract.methods.getKitty(k).call().then(function(cat) {
            num_received += 1;

            if (k % 500 == 0) {
                console.log("Responded " + k);
            }
            if (helpers.needsBirth(cat) == true) {
                console.log(k);
                birthKitty(k,false)
            }
            // Check if birth will happen in the future
            else if (cat[0] == true && cat[1] == false) {
            	// Read which block to expect the birth to occur
                let birthBlock = cat[3];

            	web3.eth.getBlockNumber().then(function(currentBlockNum) {

                    // This is to race ahead of other miners.   If the birth block is within 3 blocks, trying to 'mine' the kitty anyway.
                    // We're taking a bet here that the transaction will be mined in the blockchain by the time the birth block comes around.
            		if ((birthBlock - currentBlockNum) <= 3) {
            		      console.log('Early birthing! ' + k + ' due in block ' + birthBlock);
                          birthKitty(k,true)
            		}
            	});

            }
        });

    }
}



// Main entry point 
prompt.start();

// Get the private key from the prompt
prompt.get(['privatekey'], function(err, result) {
    console.log('Command-line input received:');
    console.log('  privatekey: ' + result.privatekey);
    pKey = result.privatekey;
    // Get the account's current Nonce.   
    web3.eth.getTransactionCount(sendingAddress).then(function(txCount) {
        // Per the Eth docs, the nonce = num of transactions starting at index 0 
    	theNonce = txCount - 1;
        myContract.methods.totalSupply().call().then(function(supply) {
            // Store the population of cats 
            population = supply;
            console.log("Running against supply of " + supply)

            // This just sets up an array of 2000 items that we'll iterate against 
            var ary = helpers.range(2000, 0);

            // Iterate over a range of cats numbers
            var myOffset = 0;
            var myTime = 0;
            var arr;

            // To save time we'll start the total cat population minus 20k.  These are the most likely cats that need birth
            startBlock = supply - 20000;
            console.log(arr);
            var to = 0;
            var iterateBy = 275;

           
            // Iterate over an array and query the blockchain in chunks of 275 cats
            // Anything > 275 simultaneous requests tends to crash Parity. 
            ary.map(function(item) {

                setTimeout(function() {

                    if ((to - (iterateBy * 4)) > supply) {
                        //       if (to > supply140000) {

                        console.log("Starting new loop");
                        startBlock = supply - 20000;
                        myOffset = 0;

                    }

                    myOffset += iterateBy;
                    startBlock += iterateBy;
                    from = startBlock + myOffset - iterateBy;
                    to = startBlock + myOffset + iterateBy;

                    console.log("Running Batch " + from + " to " + to);
                    console.log("Requested: " + num_requested);
                    console.log("Received: " + num_received);
                    console.log("=========================");

                    iterateAndBirthCats(from, to);
                }, 150 + myTime);


                // Add some randomness to briefly but randomly staggar our blocks of requests.
                slowdownTime = (helpers.getRandomIntInclusive(5, 10) * 1000 + (15 * item));
                myTime += slowdownTime;
            });

        });
    });
});