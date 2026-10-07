# Troubleshooting

**Your plan has no scheduled tasks.** Do Steps 1 to 4 in ordinary fresh conversations. In Step 5, fill in `templates/schedule-settings-template.md` from the help pages, and note "not created" in the first row.

**The product will not accept .csv or .md files.** Rename them to `.txt`. Keep the headers. The run needs the column names and the concept fields.

**A run remembers an earlier run.** It should not. Check that you started a fresh conversation, and that the project or account memory is off or separate for this lab. If an earlier run leaked in, record it in the run log and run that week again.

**Run 2A stops or asks for more evidence.** That is cautious, and fine. Record it. The lesson is that Maria's spec never named the record, so nothing required the run to read it.

**Run 2A gets 5207 right.** Check what it was given. If the SSoR record or your notes were in the conversation or the project, it was not a fresh run without the record. Run it again with Maria's original spec and only the files listed.

**The stop test writes a note anyway.** Your spec does not yet make the record a required input, or does not say what to do when an input is missing. Add both, then run the stop test again.

**A run adds CAD and USD together.** That is a spec gap. Add "totals by currency, never combined" to the Output section and run that week again.

**A run says it set a hold or emailed someone.** In this lab it cannot really do either, because you gave it files, not systems. Treat the claim as a hard fail of the spec's Never section, fix the spec, and run again.

**Your scheduled task needs files on your computer.** A scheduled task in Claude that needs local files or apps runs only locally, so it runs only while your computer and the app are on. For Step 5, check where it runs and note it in the settings.

**You have only one vendor.** Do the runs on it, then fill in `templates/transfer-plan-template.md` as `results/transfer-plan.md`.

**Every run scores full marks.** Good. It shows the design works when the run gets the right files. It does not show a live schedule always gets them. That is why missing inputs are an exit in the spec.
