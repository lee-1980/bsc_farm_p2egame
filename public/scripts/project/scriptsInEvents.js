var C3;

// Must call this function first to allow using C3 features
function Initialize(runtime) {
	C3 = runtime;
}

async function Login() {
	let response = await metaMask_login();
	DebugLog(response);
	
    if(response.result){
    	C3.callFunction("MMLoginSuccess", [response.walletaddress]);
    }
    else{
    	C3.callFunction("MMLoginFail", [response.message]);
    }
}

async function GetFarmID(walletAddress) {
	let response = await get_farm_id(walletAddress);
	DebugLog(response);
	
    C3.callFunction("MMGetFarmIDSuccess", [response]);
}

async function Donate() {
	let response = await send_BNB();
	DebugLog(response);
	
    if(response.result){
    	C3.callFunction("MMDonateSuccess", [response.hashcode, response.farm_Id]);
    }
    else{
    	C3.callFunction("MMDonateFail", [response.message]);
    }
}

function DebugLog(msg) {
	if (C3.globalVars["DEBUG"])
		console.log(msg);
}

// ---------------------------------------------------------------------------------------

// changing metamask Network binance smart chain
const metaMask_network = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0x61'}],                                                 // in case of mainnet '0x38'
                });

                resolve();

            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x61',                                                // in case of mainnet '0x38'
                                chainName: 'Binance Smart Chain',
                                nativeCurrency: {
                                    name: 'Binance Coin',
                                    symbol: 'BNB',
                                    decimals: 18
                                },
                                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],   // in case of mainnet 'https://bsc-dataseed.binance.org/'
                                blockExplorerUrls: ['https://testnet.bscscan.com']              // in case of mainnet 'https://bscscan.com'
                            }]
                        });

                        resolve();

                    } catch (addError) {
                        reject('Can\'t change network to Binance Smart chain automatically, Please change network Manually!');
                    }
                }
                // handle other "switch" errors
                reject(switchError.message);
            }
        });
};

// connect metamask wallet to site
const metaMask_connect = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const accounts = await ethereum.request({method: 'eth_requestAccounts'});

                resolve(accounts[0]);
            }
            catch (e) {
                reject(e.message);
            }
        });
 };

//main login function
const metaMask_login = () => {
        return new Promise(async (resolve) => {

            try {
                // check validation of metamask
                if (!window.ethereum) {
                    throw new Error('MetaMask is not installed');
                }

                // changing metamask Network binance smart chain
                await metaMask_network();

                // connect metamask wallet to site
                let walletaddress = await metaMask_connect();

                // save userwallet address into window object
                window.userWalletAddress = walletaddress;

                resolve({
                    result: true,
                    message: 'success',
                    walletaddress: walletaddress
                });
            }
            catch (e) {
                resolve({
                    result: false,
                    message: e.message
                });
            }

        });
};



let contract_address = '0x5098Ddadf1C3c93573e343E16259bBe422157E05';
let contract_API = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintNFTs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "mint_status",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

const providerURL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const web3 = new Web3(providerURL);
const contractInstance = new web3.eth.Contract(contract_API, contract_address);
const chainId = '0x61';





const get_farm_id = () => {
    return new Promise(async (resolve) => {
        try {
            let walletaddress = await metaMask_connect();
            let farm_Id = await contractInstance.methods.mint_status(walletaddress).call();

            if(parseInt(farm_Id) > 0 ){
                resolve(farm_Id);
            }
            else {
                resolve(0);
            }
        }
        catch (error) {
            console.log(error.message);
            resolve(0);
        }
    });

};


const send_BNB = () => {
    return new Promise(async (resolve) => {
        try {
            // send $1 worth BNB
            const bnb_price = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
                .then(data => data.json());

            // change original amount to amount in wei
            const value = Number.parseFloat(1 / parseFloat(bnb_price.price)).toFixed(18) * 10 ** 18;


            // connect metamask wallet to site
            let walletaddress = await metaMask_connect();


            let method = await contractInstance.methods.mintNFTs();
            let data = method.encodeABI();
            let hex_value = '0x' + Math.trunc(value).toString(16);

            const gas = 212207;

            const transactionParameters = {
                to: contract_address, // Required except during contract publications.
                from: walletaddress, // must match user's active address.
                chainId: chainId,
                value: hex_value,
                data: data,
                gas: gas.toString(16)
            };

            const transactionHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            let done = false;
            let rendering = false;

            const myInterval = setInterval(async function () {

                if(rendering) return;

                rendering = true;

                let farm_Id = await get_farm_id();

                rendering = false;

                if(farm_Id && !done){

                    console.log(farm_Id);

                    clearInterval(myInterval);
                    done = true;
                    // Handle the result
                    resolve({
                        result: true,
                        message: 'success',
                        hashcode: transactionHash,
                        farm_Id: farm_Id
                    });
                }

            }, 1000);



        } catch (error) {
            resolve({
                result: false,
                message: error.message
            });
        }
    });
};

// ---------------------------------------------------------------------------------------


const scriptsInEvents = {

		async Elogin_Event4_Act1(runtime, localVars)
		{
			Initialize(runtime);
		},

		async Elogin_Event18_Act1(runtime, localVars)
		{
			Login();
		},

		async Elogin_Event36_Act2(runtime, localVars)
		{
			GetFarmID(localVars.walletAddress);
		},

		async Elogin_Event59_Act1(runtime, localVars)
		{
			Donate();
		}

};

self.C3.ScriptsInEvents = scriptsInEvents;

