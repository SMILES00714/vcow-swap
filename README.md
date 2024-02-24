# vCOW Swap

A repository with scripts to facilitate the swapping of vCOW tokens directly to
other tokens, without temporarily holding COW.

**:warning: This repository contains untested and unaudited code. USE AT YOUR
OWN RISK! :warning:**

## Usage

Unfortunately, this script is currently **very** bare-bones, and requires
running things on the command line. That being said, it was designed so that no
private keys are needed, and the Safe{Wallet} interface is used for everything.

### Step 1

The first step is to generate the order pre-hook to swap vCOW for COW and set
the expected COW allowance.

```sh
make hook AMOUNT=42.1337
```

This will generate a file in `out/hook-$(date).json` that contains a
Safe{Wallet} transaction builder compatible JSON. Using the generated hook file,
create a new transaction in the Safe{Wallet} interface. Sign it, **BUT DO NOT
EXECUTE IT**. This transaction will be included as a CoW Swap order pre-hook and
executed as part of the swap.

Note that if you would like to add additional transactions to the hook - feel
free to do so **at the end of the batch**.

### Step 2

The next step is to generate a CoW Swap order EIP-712 typed data and signing
message. This typed data needs to be signed by the Safe owners in order to
create a CoW Swap order.

```sh
make typed-data SAFE=0x5afe5afE5afE5afE5afE5aFe5aFe5Afe5Afe5AfE
```

This will generate an EIP-712 typed data message to sign. Unfortunately, there
is currently no support for signing user-specified EIP-712 typed data in the
Safe{Wallet} interface, only for signing typed data from Safe apps. Luckily, I
have a Safe app for signing user specified typed data:
[`nlordell/safe-message-app`](https://github.com/nlordell/safe-message-app).

Note that currently, the price is chosen using a quote from the CoW Swap API. If
you want different behaviour, then you need to modify `src/message.js`.

### Step 3

Once the EIP-712 typed data message above is signed, the final step is to place
the order on CoW Swap API.

```sh
make order ORDERUID=0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef5afe5afe5afe5afe5afe5afe5afe5afe5afe5afeffffffff
```

The script will output a link to the order in the CoW Swap explorer.

## Disclaimer

The tools in this repository were created for personal use. Please make sure you
understand exactly what they do before using them yourself!

If you would like to support this repository, don't. Instead send the money to a
charity of your choice, as there are a lot more poeple in a lot more need than
myself.
