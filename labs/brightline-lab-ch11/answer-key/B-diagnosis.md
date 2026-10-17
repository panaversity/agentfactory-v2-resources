# Key: Part B (example)

Your wording will differ. Check the reasoning, not the words.

| Run | Cause | Evidence line | One-minute check |
| --- | --- | --- | --- |
| A | Capacity: a usage limit. Also the brief. | "Not started. Usage limit reached." The brief says nothing about suffixes, so a match between 7781-R and 7781 cannot be relied on. | Open the usage page (Part C reads the report). Then read the brief: no rule for suffixes such as -R. |
| B | The brief | Brief: "Reply to these three vendors about their short payments." Context: "No knowledge source was attached." | Check the brief against its four parts. Inputs are missing. |
| C | The inputs | Step 1: "Found `AP Register.csv`." 71 rows, the closed 2026 file. | Open the file the record names. Its rows are all paid or carried forward. |
| D | Tools and permissions. Also the brief. | Step 2: "access denied (authorization expired)." Step 3: drafting anyway. The brief had no rule for a missing attachment. | Find the first error in the step list. Then read the brief for a failure path. |

Neither of Dave's fixes would have worked. A stronger model fixes none of the four. New briefs fix B, and only part of A, C and D.

Also note for C and A: both are **silent failures**. C ran and completed. A said nothing because it only reports problems.

**A person passed two of them.** Maria forwarded the Thursday note, and sent the Friday replies without opening an attachment. Add two reviewer checks to the Review Contract: read the note's first line (register, date, count, total) before passing it on, and before sending, confirm that each message carries an attachment and that it matches that message's recipient, opening a sample to check the contents.

If you found only the usage limit for A, or only the access error for D, you stopped at the first cause. One failure can live in two places.

## Step 4: the February records

| Record | Cause | Evidence line | One-minute check |
| --- | --- | --- | --- |
| 1. Greenway reply | The brief. The plugin's update changed a step, and a skill's steps are part of what the worker is told to do. | "Plugin: AP invoice tools, version 4.0, updated on Monday, February 1, 2027." Step 4 follows the new step 5. The nine earlier runs, on version 3.2, listed bank-detail requests for a person. | Compare the steps of 3.2 and 4.0. Then run the skill's saved test cases again, including the case it must refuse, before 4.0 does real work (Chapter 8). |
| 2. Approval list | The inputs: a saved memory used instead of the approved concept. Also the brief, if you noted that it names no source. | Step 2: "Used a saved memory: 'Dave's approval limit is $10,000 from this year.'" Step 4: "No project knowledge file was opened." | Find the memory among the run's sources, and compare it with policy 4.1, $5,000.00. Correct or delete the memory (Chapter 8). Kenton Box & Crate 4937 and Cardinal Freight 4942 also need Dave's approval. |
| 3. Cardinal statement | Tools and permissions. Also the brief. | Step 2: "Error: the computer is not available." Context: the desktop app was closed while the task ran. Step 3 compared 0 statement lines, and the output still said "No differences". | Was the desktop app on the laptop open while the task ran? A cloud task reaches files on your computer only through it. Then read the brief: it had no rule for a statement it could not open. |

**Record 1, tools and permissions.** 11.3 places an add-on's update wherever it changed the steps. This one changed a step, not what the plugin can reach, so the cause is the brief. If you said tools and permissions, with the same line and the same check, count it: the fix is the same.

**The fourth case is record D.** Its first error is an access error: "access denied (authorization expired)". That is a connector whose sign-in expired. Connect it again, with only the reach the job needs, as Part H does.

A stronger model fixes none of the three. It would follow version 4.0's step, trust the memory, and still find no file.
