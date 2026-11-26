# Lab 20b, Task 7: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran this in the MCP project's basic host, as Luis, with Priya's save sent from a script with her test token, as the task allows.

**What the authors saw.**

1. Luis had INV-6208 open, with Claude's draft from Task 6 in the editor, not saved.
2. Priya's save, from the script: "Saved the note on INV-6208 as version 1, by Priya Shah."
3. Luis pressed *Save*: "This note changed after you opened it: Priya Shah saved version 1 at 2026-11-26 12:08 UTC. Your text was not saved. Reload and compare, then save again." His text was still in the editor, and *Reload and compare* appeared.
4. *Reload and compare*: Priya's note, "reviewed · version 1, saved by Priya Shah", shown beside the editor, with Luis's own text still in it.
5. *Save* again: "Saved as version 2." The database held version 2, saved by Luis Moreno.

Nobody's work was lost without being seen: Luis read Priya's note before he saved over it, and version 2 says what he decided.

**If you used two Claude accounts,** the same happens on the person who saves second.

**Compare with** `answer-key/files/ui/review-workspace.src.html` (`save` and `reloadAndCompare`), and `answer-key/files/servers/review-ts/src/db.ts` (`saveNote`).
