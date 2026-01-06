let provider;
let signer;
let contract;

// 🔁 REPLACE THESE WITH YOUR REAL VALUES
const CONTRACT_ADDRESS = "0x93f8dddd876c7dBE3323723500e83E202A7C96CC";
const ABI = [
 
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_actorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "addDistributorRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_actorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "addFarmerRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_actorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "addProcessorRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "assignRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum SupplyChain.Stage",
				"name": "stage",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "actorName",
				"type": "string"
			}
		],
		"name": "RecordAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getProductHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "enum SupplyChain.Stage",
						"name": "stage",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "actorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct SupplyChain.Record[]",
				"name": "",
				"type": "tuple[]"
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
		"inputs": [],
		"name": "productCount",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "roles",
		"outputs": [
			{
				"internalType": "enum SupplyChain.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// 🔌 CONNECT WALLET
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  await ethereum.request({ method: "eth_requestAccounts" });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const address = await signer.getAddress();
  document.getElementById("walletStatus").innerText =
    "Connected: " + address;
}

// 👨‍🌾 FARMER
async function addFarmer() {
  const name = document.getElementById("farmerName").value;
  const location = document.getElementById("farmerLocation").value;
  const details = document.getElementById("farmerDetails").value;

  const tx = await contract.addFarmerRecord(name, location, details);
  await tx.wait();

  alert("Farmer record added!");
}

// 🏭 PROCESSOR
async function addProcessor() {
  const id = document.getElementById("procProductId").value;
  const name = document.getElementById("processorName").value;
  const location = document.getElementById("processorLocation").value;
  const details = document.getElementById("processorDetails").value;

  const tx = await contract.addProcessorRecord(id, name, location, details);
  await tx.wait();

  alert("Processor record added!");
}

// 🚚 DISTRIBUTOR
async function addDistributor() {
  const id = document.getElementById("distProductId").value;
  const name = document.getElementById("distributorName").value;
  const location = document.getElementById("distributorLocation").value;
  const details = document.getElementById("distributorDetails").value;

  const tx = await contract.addDistributorRecord(id, name, location, details);
  await tx.wait();

  alert("Distributor record added!");
}

// 👀 CONSUMER VIEW
async function viewHistory() {
  const id = document.getElementById("viewProductId").value;
  const history = await contract.getProductHistory(id);

  document.getElementById("output").innerText =
    JSON.stringify(history, null, 2);
}

