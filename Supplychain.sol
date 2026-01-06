// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // ================= ROLES =================
    enum Role { None, Farmer, Processor, Distributor }
    mapping(address => Role) public roles;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    modifier onlyFarmer() {
        require(roles[msg.sender] == Role.Farmer, "Only Farmer allowed");
        _;
    }

    modifier onlyProcessor() {
        require(roles[msg.sender] == Role.Processor, "Only Processor allowed");
        _;
    }

    modifier onlyDistributor() {
        require(roles[msg.sender] == Role.Distributor, "Only Distributor allowed");
        _;
    }

    function assignRole(address user, Role role) public onlyOwner {
        roles[user] = role;
    }

    // ================= SUPPLY CHAIN =================
    enum Stage { Farmer, Processor, Distributor }

    struct Record {
        Stage stage;
        string actorName;
        string location;
        string details;
        uint256 timestamp;
    }

    mapping(uint256 => Record[]) private productHistory;
    uint256 public productCount;

    event RecordAdded(
        uint256 productId,
        Stage stage,
        string actorName
    );

    // ============ FARMER ============
    function addFarmerRecord(
        string memory _actorName,
        string memory _location,
        string memory _details
    ) public onlyFarmer {
        productCount++;

        productHistory[productCount].push(
            Record(
                Stage.Farmer,
                _actorName,
                _location,
                _details,
                block.timestamp
            )
        );

        emit RecordAdded(productCount, Stage.Farmer, _actorName);
    }

    // ============ PROCESSOR ============
    function addProcessorRecord(
        uint256 _productId,
        string memory _actorName,
        string memory _location,
        string memory _details
    ) public onlyProcessor {
        productHistory[_productId].push(
            Record(
                Stage.Processor,
                _actorName,
                _location,
                _details,
                block.timestamp
            )
        );

        emit RecordAdded(_productId, Stage.Processor, _actorName);
    }

    // ============ DISTRIBUTOR ============
    function addDistributorRecord(
        uint256 _productId,
        string memory _actorName,
        string memory _location,
        string memory _details
    ) public onlyDistributor {
        productHistory[_productId].push(
            Record(
                Stage.Distributor,
                _actorName,
                _location,
                _details,
                block.timestamp
            )
        );

        emit RecordAdded(_productId, Stage.Distributor, _actorName);
    }

    // ============ VIEW ============
    function getProductHistory(uint256 _productId)
        public
        view
        returns (Record[] memory)
    {
        return productHistory[_productId];
    }
}
