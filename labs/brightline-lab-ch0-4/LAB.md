# Lab 0.4: Your 4D plan, before the run

Chapter 0.4 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 0.4: Your 4D plan, before the run](https://agentfactory2.panaversity.org/how-ai-works/ai-fluency/lab/), so you can do the lab without the book.

In this lab the AI does the typing, and you make the decisions. It quizzes you on the three ways of working with AI, then asks you for each line of a 4D plan and writes the plan down. Then you test one of its lines. It takes about 15 minutes, on Claude or ChatGPT, and every message you send is printed below.

**What you will learn.** To tell the three ways of working with AI apart, and to decide each D's line, with when it is done, before an AI works alone.

## Step 1. Sort three jobs

Open a new chat, and send this:

```text
Quiz me on three ways of working with AI. Automation: the AI does a specific task that I describe. Augmentation: the AI and I think a problem through together. Agency: the AI works alone, on tasks still to come. Show me one job at a time, and ask me which way it is. After each answer, tell me in one sentence whether I am right, and why. The jobs:
1. "Turn this list of twenty invoice numbers into a table."
2. "Help me work out why this vendor's balance does not match ours." We go back and forth.
3. "Each month, once the month ends, check every vendor's statement against our register, and leave me a table." Nobody watches it run.
```

Answer each job in one word: automation, augmentation or agency. If it shows buttons for the three, you can click one instead.

**What you probably saw.** Job 1 is automation, a specific task from your instructions. Job 2 is augmentation, where you think it through together. Job 3 is agency, where the AI works alone, on tasks still to come ([0.4.1](https://agentfactory2.panaversity.org/how-ai-works/ai-fluency/three-ways/)).

## Step 2. Decide the 4D plan

In the same chat, send this:

```text
Now help me write a 4D plan for a job an AI will do alone. Every Monday at 7:00, it makes a table of the invoices due that week, from Brightline's register, and leaves it for me. Nobody watches it run. Ask me about one D at a time, and wait for my answer:
- Delegation: what may the AI do alone, and what waits for a person?
- Description: what does it hand back, and what does it do when the register does not show something, such as a due date?
- Discernment: who checks its table, when, and against what?
- Diligence: what may go in, who is told that AI made the table, and who signs?
With each D, also ask when it is done: before the first run, after each run, or throughout. Use my words, and add no lines of your own. At the end, show the plan as a table with three columns: the D, the line, and when.
```

Answer each question in a few words, in your own words.

**What a good plan has.** Every line has a "when". Delegation keeps any change to the register, and any contact with a vendor, for a person. Description says what to write when the register does not show something, such as "no due date". Discernment names a person and a set time. Diligence names what goes in, how people are told, and who signs ([0.4.2](https://agentfactory2.panaversity.org/how-ai-works/ai-fluency/the-four-ds/)). Compare your table with these, and with Dave's plan for the monthly reconciliation in [0.4.3](https://agentfactory2.panaversity.org/how-ai-works/ai-fluency/putting-them-together/).

## Step 3. Test the Description line

Open a temporary chat, so that memory cannot carry your plan's line into it. On Claude, click the ghost icon at the top right of a new chat. On ChatGPT, click the dashed circle at the top right, then choose Unpersonalized. Send this:

```text
When a line does not show a due date, write "no due date" instead of guessing. Today is Monday, August 31. Which of these invoices from our register are due this week?
Midwest Packaging, $1,240.00, due September 4
Buckeye Office Supply, $310.50, received August 6
County Freight, $2,980.00, due September 15
```

Then open another temporary chat, and send the same message without its first sentence.

**What you probably saw.** Both chats named Midwest Packaging. The first chat wrote "no due date" for Buckeye Office Supply, the words you asked for. The second chose its own words, and it may have guessed a date, such as September 5, 30 days after the invoice arrived. A run that nobody watches has only what is written down before it starts. Your line makes every run say the same thing, in words the person who checks the table can look for ([0.4.2](https://agentfactory2.panaversity.org/how-ai-works/ai-fluency/the-four-ds/)).

## Step 4. Keep it

Go back to the chat with your plan, and send this:

```text
Show the plan as a markdown page, in one code block.
```

Copy the code block into a plain text editor, and save it as `4d-plan.md`, as in Lab 0.3. It is your 4D plan for this chapter.

## If something goes wrong

- **It answers the quiz for you, or writes the plan without asking.** Send: "Ask me one question at a time, and wait for my answer."
- **It adds lines you did not give it.** Ask it to take them out. The plan holds only your decisions.
- **Both chats wrote the same thing.** That can happen, because replies vary. A written line makes the right words far more likely, not certain. That is why the plan also has a person check the table.
- **You reach a usage limit.** Free plans limit how much you can send. Wait until it resets, and go on from your step.
