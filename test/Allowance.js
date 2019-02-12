const Allowance = artifacts.require("Allowance");
const {
  BN,
  constants,
  expectEvent,
  shouldFail
} = require("openzeppelin-test-helpers");

const mode = process.env.MODE;

let allowanceInstance;

contract("Allowance", accounts => {
  before(async function() {
    allowanceInstance = await Allowance.deployed();
  });

  after("write coverage/profiler output", async () => {
    if (mode === "profile") {
      await global.profilerSubprovider.writeProfilerOutputAsync();
    } else if (mode === "coverage") {
      await global.coverageSubprovider.writeCoverageAsync();
    }
  });

  it("Should have owner addresss be same address that deployed contract", async () => {
    assert.equal(
      await allowanceInstance.owner(),
      accounts[0],
      "Owner isn't address 0 (msg.sender)"
    );
  });

  it("Emits an OwnershipTransferred event on successful transfer", async () => {
    const owner = await allowanceInstance.owner();
    const { logs } = await allowanceInstance.giveOwnership(accounts[1], {
      from: owner
    });
    expectEvent.inLogs(logs, "OwnershipTransferred", {
      previousOwner: owner,
      newOwner: accounts[1]
    });
    assert.equal(
      await allowanceInstance.owner(),
      accounts[1],
      "Owner wasn't successfully switched"
    );
  });

  it("Transfer ownership back to original owner", async () => {
    const owner = await allowanceInstance.owner();
    const { logs } = await allowanceInstance.giveOwnership(accounts[0], {
      from: owner
    });
    expectEvent.inLogs(logs, "OwnershipTransferred", {
      previousOwner: owner,
      newOwner: accounts[0]
    });
    assert.equal(
      await allowanceInstance.owner(),
      accounts[0],
      "Owner wasn't successfully switched"
    );
  });

  it("Should add funds and increment the balance by value sent", async () => {
    const balanceBefore = await allowanceInstance.balance();
    const value = 1000;
    await allowanceInstance.fundAllowance({
      from: accounts[0],
      value: value
    });
    const balanceAfter = await allowanceInstance.balance();
    assert.equal(
      balanceAfter,
      value,
      "Balance after doesn't match the funds sent"
    );
    assert.equal(balanceBefore, 0, "Balance before should be 0 but isn't");
  });

  it("Should add an address to the Payee array", async () => {
    await allowanceInstance.addPayee(accounts[4], {
      from: accounts[0]
    });
    const addressAfter = await allowanceInstance.Payees(0);
    assert.equal(
      addressAfter,
      accounts[4],
      "Address specified in call doesn't match the address in array"
    );
  });

  it("Pay out allowance to each payee", async () => {
    await allowanceInstance.addPayee(accounts[5], {
      from: accounts[0]
    });
    const firstAddy = await allowanceInstance.Payees(0);
    const secondAddy = await allowanceInstance.Payees(1);

    const bal1b4 = await web3.eth.getBalance(accounts[4]);
    const bal2b4 = await web3.eth.getBalance(accounts[5]);

    await allowanceInstance.payAllowance(50, {
      from: accounts[0]
    });

    const bal1after = await web3.eth.getBalance(accounts[4]);
    const bal2after = await web3.eth.getBalance(accounts[5]);

    assert.equal(
      bal1b4,
      parseInt(bal1b4, 10) + 50,
      "Balance before payout should be the default account balance"
    );
    assert.equal(
      bal2b4,
      parseInt(bal2b4, 10) + 50,
      "Balance before payout should be the default account balance"
    );
    assert.equal(
      bal1after,
      bal2after,
      "Both accounts should have been paid the same amount"
    );
    assert.equal(firstAddy, accounts[4], "accounts out of sync in array");
    assert.equal(secondAddy, accounts[5], "accounts out of sync in array");
  });

  it("Should call no function, hit the fallback and revert", async () => {
    const bal1b4 = await web3.eth.getBalance(accounts[4]);

    await shouldFail.reverting(allowanceInstance.send());

    const bal1after = await web3.eth.getBalance(accounts[4]);

    assert.equal(
      bal1b4,
      bal1after,
      "Address that called fallback didn't get their funds back"
    );
  });

  it("Should call the self destruct function and destroy the contract", async () => {
    const bal1 = await web3.eth.getBalance(accounts[6]);

    const contBal = await allowanceInstance.balance();

    await allowanceInstance.selfDestruct(accounts[6]);

    await shouldFail.reverting.withMessage(
      allowanceInstance.balance(
        "Returned values aren't valid, did it run Out of Gas?"
      )
    );

    const bal1aft = await web3.eth.getBalance(accounts[6]);

    assert.equal(
      bal1,
      parseInt(bal1aft, 10) + parseInt(contBal, 10),
      "Address should have recieved the contract's funds after deletion"
    );
  });
});
