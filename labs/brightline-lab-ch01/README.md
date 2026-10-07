# Lab 1: one portable brief, two runtimes

Chapter 1 of *The AI Agent Factory*, Second Edition. The tasks are on the book page, [Build step: one portable brief, two runtimes](https://agentfactory-v2.vercel.app/ai-worker-paradigm/from-chatbots-to-ai-workers/build-step/). Every name, number and company here is invented.

| Path | What it is |
| --- | --- |
| `data/` | What the book's zip holds, and nothing else: `invoices/`, 15 invoice PDFs, and `purchase-orders.csv`. The release zips this folder as `brightline-lab-ch01.zip`. |
| `answers.md` | The answers. The book page links to it last. |
| `source/` | How the data is made: the 15 invoices as text, and `build.py`, which prints them as PDFs. This lab's first version, with LAB.md and the old answer key, is in the repository's history. |

Two facts the tasks need are on the book page, not in the data: today's date in the job, September 30, 2026, and Brightline's payment of invoice 4471 on September 25. A learner has to pass them to the AI. That is the point.

To change an invoice, edit its text file in `source/invoices/` and run `python3 labs/brightline-lab-ch01/source/build.py` from the repository's root. It needs Google Chrome, which prints each invoice as a PDF, and `pdftotext`, which checks that every field and number is in the PDF's text. Then check `answers.md` and `data/purchase-orders.csv` against the change.
