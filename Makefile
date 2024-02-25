DENO := deno

AMOUNT :=
SAFE :=
DAUGHTER :=
TOKEN :=
ORDERUID :=

.PHONY: hook
hook:
	@ if [ -z "${AMOUNT}" ]; then echo "ERROR: AMOUNT not set"; exit 1; fi
	@ mkdir -p out
	@ deno run --allow-write=out ./src/hook.js "${AMOUNT}"

.PHONY: hook-nested
hook-nested:
	@ if [ -z "${AMOUNT}" ]; then echo "ERROR: AMOUNT not set"; exit 1; fi
	@ if [ -z "${SAFE}" ]; then echo "ERROR: SAFE not set"; exit 1; fi
	@ if [ -z "${DAUGHTER}" ]; then echo "ERROR: DAUGHTER not set"; exit 1; fi
	@ mkdir -p out
	@ deno run --allow-write=out ./src/hook-nested.js "${AMOUNT}" "${SAFE}" "${DAUGHTER}"

.PHONY: typed-data
typed-data:
	@ if [ -z "${SAFE}" ]; then echo "ERROR: SAFE not set"; exit 1; fi
	@ if [ -z "${TOKEN}" ]; then echo "ERROR: TOKEN not set"; exit 1; fi
	@ mkdir -p out
	@ deno run --allow-write=out --allow-net=api.cow.fi,eth.llamarpc.com,safe-transaction-mainnet.safe.global ./src/typed-data.js "${SAFE}" "${TOKEN}"

.PHONY: order
order:
	@ if [ -z "${ORDERUID}" ]; then echo "ERROR: ORDERUID not set"; exit 1; fi
	@ mkdir -p out
	@ deno run --allow-read=out --allow-write=out --allow-net=api.cow.fi,safe-transaction-mainnet.safe.global ./src/order.js "${ORDERUID}"

.PHONY: clean
clean:
	rm -rf out
