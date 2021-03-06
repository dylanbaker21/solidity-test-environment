# solidity-test-environment
Basic JavaScript test environment for Ethereum smart contracts written in Solidity. Includes coverage tests.

## Intro

First run `npm i` to install the dependencies.

Also need Truffle and Ganache.

## Tests

First in a terminal run:

```bash
ganache-cli
```

Now we're ready to run tests, open another terminal and:

```bash
truffle test
```

## Coverage Tests

With ganache running:

```bash
npm run coverage
```

## Change Coverage Compiler

In node_modules > solidity-coverage > lib > truffleConfig.js

## Change Truffle Compiler

truffle.js > compilers > solc > version

# Allowance.sol contract

Simple contract by Dylan Baker implementing two patterns onlyOwner and status codes.

The contract provides functionality to pay out ether allowances programmatically.

The status codes provide contracts with tools to react to different situations autonomously.

More info on status codes -> https://eips.ethereum.org/EIPS/eip-1066
