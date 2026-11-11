# Rule card: how a shared worker in Slack decides what it can do

Eight rules from Anthropic's Claude Tag documentation, as verified on November 10, 2026. Claude Tag was in public beta. Use only these rules in Parts 2 and 6.

| # | Rule | In the documentation's words | Page |
|---|---|---|---|
| 1 | **In a channel, the worker acts as itself.** Its actions appear under its own accounts in each tool. | "Claude acts with its own service accounts, rather than as a specific user." | How agent identity works |
| 2 | **The channel's shared access belongs to the channel, and it is the same for every member.** | "What Claude can do never changes based on who asked." A credential "is shared by everyone in the channels where it applies. Anyone in one of those channels can ask Claude to act with the credential". | How agent identity works. Security and data handling |
| 3 | **A credential exists only where an admin applied it.** That can be all of Slack, one workspace or one channel. A credential added on the main Connectors tab applies in all of Slack. | "An admin chooses where each connector applies, from every channel down to one". Sessions in other channels "run as if that credential doesn't exist." "The first credential you add for a service on the Connectors tab applies in all of Slack as soon as you save it." | Security and data handling |
| 4 | **You cannot limit who may ask in one channel.** | A "Per-channel responder allowlist" is not available: "you can't narrow it to a list of people for one channel only." | Restrict where Claude Tag operates |
| 5 | **A routine has the channel's access, and anyone in the channel can manage it.** | A routine "uses that channel's connections with the same permissions as a typed request." "Anyone in the channel can manage its standing work". | Set up routines |
| 6 | **A person's own access is different from the channel's.** A one-to-one message runs as the member. In a channel, the worker can use a member's own connector only for that member's own task, after the member allows it. Either way, the work carries the member's name. | A direct message session "runs with your own claude.ai account", with "results attributed to you". In a channel, personal connectors are used "only for that user's own tasks, after the user allows it", and the work "is recorded under their name." | How agent identity works. Security and data handling |
| 7 | **Private channels are walls. Public channels are doors.** | "From a private channel, Claude doesn't post anywhere else, and nothing asked elsewhere makes Claude post into a private channel." Access on a public channel "reaches anyone who joins". | Security and data handling |
| 8 | **In a channel shared with another company, their people can use the channel's credentials.** This applies once Claude is turned on there, for credentials attached directly to that channel. | Claude "can use them for anyone it answers there, including the other company's people." | Security and data handling |

**One thing the documentation does not say:** whether the worker asks for a confirmation before it sends an email. Do not assume it does.
