# Scheduled task

Set up in the AI vendor's scheduling feature by Dave Kowalski, April 2026.

- Name: Build the invoice register
- Runs: every Monday, 7:00 a.m., Eastern Time
- Does: opens the shared project, reads the AP inbox since the last run, builds the register for the week through the accounting connector, then types the run notes in the project's chat
