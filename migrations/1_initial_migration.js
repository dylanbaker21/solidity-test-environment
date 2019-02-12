// var Migrations = artifacts.require("./Migrations.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Migrations);
// };

var Allowance = artifacts.require("./Allowance.sol");

module.exports = function(deployer) {
  deployer.deploy(Allowance);
};
