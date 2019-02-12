pragma solidity ^0.4.25;

contract Allowance {
    
    address public owner;
    uint public balance;
    
    address[] public Payees;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor () public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender, "You must be the owner");
        _;
    }
    
    function giveOwnership(address _newOwner) public onlyOwner returns (byte status) {
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(oldOwner, owner);
        return hex"01"; //Success
    } 
    
    function fundAllowance() public payable returns (byte status, uint newBalance) {
        balance += msg.value;
        return (hex"01", balance); //Success 
    }
    
    function payAllowance(uint _amountToPayEach) public onlyOwner returns (byte status) {
        for (uint i=0;i<Payees.length;i++){
            Payees[i].transfer(_amountToPayEach);
            balance -= _amountToPayEach;
        }
        return hex"51"; //Transfer success
    }
    
    function addPayee(address _newPayee) public onlyOwner returns (byte status, address payee) {
        Payees.length++;
        uint payN = Payees.length-1;
        Payees[payN] = _newPayee;
        return (hex"11", _newPayee); //Allowed
    }
    
    function selfDestruct(address _fundsReceiver) public onlyOwner {
        selfdestruct(_fundsReceiver);
    }
    
    function() external payable {
        revert("Call a function to interact with this contract");
    }
    
}