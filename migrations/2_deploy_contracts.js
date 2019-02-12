var Allowance = artifacts.require("./Allowance.sol");

module.exports = function(deployer) {
  deployer.deploy(Allowance);
};
