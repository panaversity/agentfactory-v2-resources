# Review rules

Every change reaches `main` through a pull request with the template filled in and every required check green.

## Risk tiers

- **Low:** documentation, notes, comments.
- **Medium:** skills, the changelog, test data that tests do not read.
- **High:** code that runs (`src/`, `py/brightline_ap/`, `scripts/`), manifests, connector files, catalogs, settings, CI.

High-tier changes need the code owner's approval and a reviewer who has not seen the build.

## Always check

- No test changed to make code pass.
- No key, token or full account number in any file.
- Every number a person acts on comes from tested code.
