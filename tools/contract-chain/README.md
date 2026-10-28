Checks that each Role Contract a Part II lab ships is the previous lab's sample (in `contracts/`) with only the named cuts in `chain.json`, so what a reader writes in one lab is still there in the next.
Run `python3 tools/contract-chain/check.py` from the repository's root; `--write` writes each shipped draft from its source and cuts.
