# Lab 4 answer key: Task 10. On the other vendor

The answers for Task 10 of Lab 4, in Chapter 4 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your Runtime needs and Triggers lines are written, Attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your contract document's words. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 10 carries checks 19 and 20 of the lab's 23.

19. **Each vendor's plan reaches the policy's home, or the worker is back to a copy.** On Claude, a custom connector reaches the home, on any plan. On ChatGPT, reading a custom MCP server is documented for Pro, and full MCP for business workspaces. The Free plan is not listed. On a plan with no connector, the worker reads an uploaded copy, and Wednesday's stale copy comes back. Missed: no line on how the worker reaches the home, or no answer to what happens without a connector.
20. **The trigger names the business event and how fast the worker must start.** The worker starts when an invoice reaches the AP inbox, within a delay you chose that keeps a same-day answer, such as within one hour. On Claude, a scheduled check, such as every hour, makes it true. On ChatGPT, an event-triggered task on Gmail activity can, if the AP inbox is in Gmail. Missed: a product feature with no business event, or no delay.

## Why

The products above the line differ, and Brightline's owned layers do not. For Brightline, two differences matter. One is how the worker reaches the governed record, because a plan with no connector brings back the uploaded copy. The other is where the trigger is set. The two trigger designs are equal once the business says how much delay it accepts, so the delay belongs in the contract and the feature belongs in Runtime needs. These product facts were verified on October 15, 2026, and products change.
