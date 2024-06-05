# Build Onchain Apps Template experiences (Shield3 Version)

## Getting Started

#### Step 1: Setup Environment Variables

- Obtain a Base RPC URL from [Coinbase Developer Platform](https://www.coinbase.com/developer-platform/products/base-node?utm_source=boat) and assign to the `.env.local` file

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=ADD_WALLET_CONNECT_PROJECT_ID_HERE
NEXT_PRIVATE_RPC_URL=ADD_RPC_URL_HERE
```

- Obtain a Shield3 API Key from [Shield3 Developer Platform](https://shield3.com/) and assign to the `.env.local` file

```bash
NEXT_PUBLIC_SHIELD3_API_KEY=ADD_SHIELD3_API_KEY_HERE
```

#### Step 2: Install and Run your onchain app

```bash
# Install
yarn

# Run
yarn dev
```

## Develop

To format and lint the package locally use these quick steps.

```bash
# Format fix
yarn format

# Lint fix
yarn lint
```

## Using Shield3 Hooks

The hooks to interact with the Shield3 API are available below
_Using BuyMeACoffee smart contract as an example below_

```bash
<project-name>
└── web/src/hooks
    └── useGetPolicyResults.ts
```

Find an example implementation in:

```bash
<project-name>
└── web/app/buy-me-coffee
    └── _components
        └── useSmartContractForms.ts
```


## Updating ABI

After you create a project using BOAT, these are the folders and files you are interested in when updating a smart contract:
_Using BuyMeACoffee smart contract as an example below_

```bash
<project-name>
├── contracts
│   ├── src
│   │   └── BuyMeACoffee.sol          ← smart contract code
│   └──out/BuyMeACoffee.sol
│       └── BuyMeACoffee.json         ← output from "forge build" which contains the updated ABI
│
└── web/app/buy-me-coffee
    └── _contracts
        ├── BuyMeACoffeeABI.ts             ← copy of ABI from contracts/out/BuyMeACoffee.json
        └── useBuyMeACoffeeContract.ts     ← deploy address
```

### Importing updated ABI to frontend code

After updating your smart contract code, run `forge build` in the `contracts` folder. This will create a json in the `contracts/out` directory.

The output json contains additional information. We only need the `abi` property from that json object. Let's use `jq` to extract just the `abi` property

```bash
# from the "contract" folder

jq .abi out/BuyMeACoffee/BuyMeACoffee.json
```

Take the output of `jq` and update `web/app/buy-me-coffee/_contracts/BuyMeACoffeeABI.ts`

Done with first step!

### Deploying your smart contract and updating frontend code

Make sure you got all the environment variables squared away in `contracts/.env` and get some base sepolia eth from a faucet!

To deploy your smart contract,

```bash
# from the "contract" folder

source .env && forge script script/LocalContract.s.sol:LocalContractScript  --broadcast --rpc-url https://sepolia.base.org
```

In the long output, find the value for `Contract Address`.

Copy that value and update `web/app/buy-me-coffee/_contracts/useBuyMeACoffeeContract.ts` with the new address.

## Outro

This is one of the more error prone steps. Take it step by step.

If you are new smart contract deployment, just try deploying the existing `BuyMeACoffee` contract and replace the contract address. After, try updating `BuyMeACoffee.sol` and get the new ABI in your frontend code.

We are thinking of ways to make this step easier in the future! Happy hacking!
