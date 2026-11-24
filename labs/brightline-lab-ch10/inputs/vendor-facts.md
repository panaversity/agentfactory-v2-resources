# What each AI vendor's own pages say

Anthropic makes Claude. OpenAI makes ChatGPT. Free, Pro, Max, Plus, Team, Business, Enterprise and Edu are their plans. Each line says what the vendor's page said on the date given. Products change: these are statements, dated, not advice.

## 1. Training, temporary chats, retention and memory (verified 8 October 2026)

**Claude**
- Training: on Free, Pro and Max, each user's privacy setting decides whether chats may be used to improve Claude. Feedback a user sends, and chats flagged for a safety review, can be used even with it off. With it on, chats can be kept in de-identified form for up to five years. On Team, Enterprise and the API, inputs and outputs are not used for training by default, unless a user sends feedback or the organization opts in.
- Incognito chats: not used for training, not saved to history, not used for memory, and kept for 30 days by default. Not available inside projects.
- Retention: on individual plans, deleted chats are removed from back-end systems within 30 days, with exceptions. Chats flagged under the Usage Policy can be kept up to two years, and feedback up to five years. Enterprise Owners can set a custom retention period of at least 30 days. Without one, Enterprise data is kept with no time limit.
- Memory: on Team and Enterprise, Owners control whether memory is available, and it is off for each member until the member turns it on.

**ChatGPT**
- Training: on plans for individuals, the "Improve the model for everyone" setting decides it. When it is off, new conversations are not used for training. On Business, Enterprise and Edu, business data is not used for training by default.
- Temporary Chat: not in history, does not create memories, not used to improve models. It may be kept for up to 30 days for safety. A chat cannot be added to a project while it is temporary.
- Retention: workspace admins on Business and Enterprise control how long data is kept.
- Memory: Business workspace owners can turn memory and personalization off for the whole workspace. On Enterprise, admins control memory through workspace and role settings.

## 2. Connectors, apps and their actions (verified 8 October 2026)

**Claude**
- On Team and Enterprise, an Owner must enable a connector before members can use it.
- Owners on Team and Enterprise set each connector's tools, grouped as read-only or write and delete, to always allow, needs approval or blocked. The setting applies to everyone using the connector, and members cannot override it. It can only limit what the connected system already permits.

**ChatGPT**
- On Business, apps are on by default, and admins can change that. On Enterprise and Edu, new apps are off by default, with role-based access.
- On Business, Enterprise and Edu, admins choose which read and write actions of each app are enabled. They also set how ChatGPT asks: always ask, allow read actions but ask before changes, or allow low-risk actions. On Enterprise and Edu, roles decide who can use each app. Some apps have no action controls, so admins can manage only whether the app is available.

**Both:** the documented controls work for each tool or action, not for each recipient.

## 3. Work accounts and personal accounts (verified 12 October 2026)

**Claude**
- Team and Enterprise offer single sign-on, so staff sign in with their work account.
- Once the company's email domain is verified, an Owner on Team or Enterprise can stop people creating new personal accounts with it.
- On Enterprise, domain capture goes further: personal accounts on the domain must move into the company's organization or close within 30 days, and the setting cannot be reversed.

**ChatGPT**
- Business and Enterprise support single sign-on.
- Verifying the company's domain does not delete or merge anyone's personal workspace. Claiming the domain is only for approved use cases, by request to OpenAI.
- On Business, admins cannot require anyone to merge or delete a personal workspace. On Enterprise, joining can require one on the company's domain to be merged or deleted.

**Both:** these domain settings do not reach an account made with a personal email address.

## 4. Records of what happened (verified 8 and 12 October 2026)

**Claude**
- Audit logs are for Enterprise only. Owners can export the audit log for the past 180 days. It records events such as file uploads and deleted conversations, but not chat titles or content.
- Only the Primary Owner can turn on the Compliance API, which can also pull chat data and files. On Team and Enterprise, the Primary Owner can export the organization's data.

**ChatGPT**
- The Compliance Platform is for Enterprise and Edu. Only a workspace Owner can grant access to conversation messages. Its logs are kept for 30 days.

**Both:** neither offers these logs on Claude Team or ChatGPT Business.

## 5. Where the company's own AI policy shows (verified 12 October 2026)

**Claude**
- Owners on Team and Enterprise can write organization instructions, which Claude follows in every conversation. Only Owners and the Primary Owner can see them. In rare cases, when instructions directly contradict each other, behavior may vary.

**ChatGPT**
- On Enterprise, a workspace can set its own AI policy. ChatGPT shows it to users in a pop-up every 30 days, and again when the policy changes.

## 6. Who switches features on (verified 12 October 2026)

**Claude**
- Of the standard roles, only Owners and the Primary Owner can turn on capabilities, such as web search, and integrations.
- On Enterprise, custom roles give features to groups. If an Owner turns a feature off for the whole organization, no custom role can turn it back on.

**ChatGPT**
- On Enterprise, only Owners create and assign custom roles, which decide who may use each feature. If any role a member holds grants a feature, the member has it.

## 7. Usage policies (verified 8 and 12 October 2026)

**Claude**
- A new Usage Policy takes effect on November 12, 2026. Its high-risk rules cover recommendations about one person, such as a credit, housing or employment decision. A qualified person must review each one, with authority to change it, before it is delivered or used, and the person affected must be clearly told that AI was used. Internal drafts that are not the final recommendation are excluded.

**ChatGPT**
- The Usage Policies prohibit automating high-stakes decisions in sensitive areas, including credit, employment, housing, legal, medical, insurance and education, without human review.

## 8. Sharing a result (verified 17 October 2026)

**Claude**
- Artifacts start private to you. On Team and Enterprise, they stay inside the organization by default. A member can share one with invited people or with everyone in the organization. "Anyone with the link" is offered only when an Owner turns on external sharing, or allows that one artifact. Accepted invitations do not expire.
- In a shared project, members can see its knowledge and instructions. Each member's chats in it stay private unless that member shares them.
- A shared chat is a snapshot: later messages stay private unless you update it. On Team and Enterprise, only signed-in members of the same organization can see it.

**ChatGPT**
- A shared conversation link made in a Business, Enterprise or Edu workspace opens only for members of that workspace. It can include messages added after sharing. A link cannot be limited to chosen people and has no end date, so delete it when it is no longer needed. Anyone who can open a link can forward it.
- On Enterprise and Edu, admins can turn sharing off. Business has no such control for the whole workspace.
- In a shared project, members with chat access can see the project's chats, files and instructions.

**Both:** removing a link does not remove a copy someone already saved.

**A test share on the two free plans, run on 17 October 2026.**
- Claude Free: the share control started at "Only people invited". The test chose "Anyone with the link", and Claude warned that no sign-in is needed, that you will not see who opened it, and that turning the link off cannot take back copies. A private browser window opened the link. A line added after sharing did not show. The link was taken back in Settings, Privacy, Shared chats, Manage. Within about a minute, the private window no longer opened it.
- ChatGPT Free: one click on Share made a public link at once: "Anyone with the link can view this conversation." A private browser window opened the link. A line added after sharing did not show. The link was deleted in Settings, Data controls, Shared links, Manage. At once, the private window no longer opened it.

## 9. Open-source tools (verified 23 October 2026)

- An open-source tool can run on your own computer, and its records stay there. It still sends the conversation to the company whose model it uses.
- For data that must never leave, the only route is a model that runs on your own computer. OpenCode, an open-source coding agent, can use one through Ollama, LM Studio or vLLM.
- Each OpenCode agent starts from a rule that allows every action. Your own rules can set an action to allow, ask or deny.
