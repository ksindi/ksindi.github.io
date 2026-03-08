+++
title = "Sola Computa: The Coming AI Reformation"
date = 2026-03-07
+++

In 1517, the Catholic Church held a monopoly not on scripture itself but on its *interpretation*. The Bible was in Latin. You needed a priest to read it to you and tell you what it meant. The priest needed a bishop. The bishop needed Rome. The institution provided real value: it preserved learning, maintained communities, gave moral structure to daily life. But structurally, the arrangement was a monopoly. The cost of understanding scripture included the cost of sustaining an interpretive supply chain that could not be bypassed.

The printing press didn't just make books cheaper. It made the priesthood optional. Luther's wasn't the first vernacular Bible, but the printing press made it the first one that reached thousands of households. The cost of understanding scripture dropped to the price of literacy. You could read, interpret, and decide for yourself. The intermediaries didn't disappear overnight, but the economic logic that sustained them collapsed.

We are building a new priesthood, and this time the scripture is intelligence itself.

Cloud AI is structurally different from cloud storage. When you store files on someone else's server, you outsource custody. When you reason through someone else's model, you outsource judgment. The provider's training choices determine what the model engages with. Its guardrails bound which questions produce useful answers. Its operator can change the model, retire it, or adjust its behavior without asking. The dependency runs deeper than infrastructure. It's cognitive.

Disintermediation isn't new. Three movements have tried to cut out the middlemen between people and their tools. All three fell short, not because the technology was wrong, but because they solved the access problem and ignored the maintenance problem. Access is a one-time event. Maintenance is a permanent condition. The test for any disintermediation movement: does it make maintenance cheaper than dependency? Until AI, none did.

## Three Incomplete Reformations

**Open source** gave you the code. The code was free. Maintaining it was not. About 96% of codebases incorporate open-source components,[^1] yet 60% of maintainers work entirely unpaid.[^2] Widely used infrastructure routinely depends on a handful of volunteers; when they burn out, [critical projects lose their maintainers](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/). Self-hosting email is the canonical example: technically possible, practically miserable. [One engineer self-hosted for 23 years and gave up](https://cfenollosa.com/blog/after-self-hosting-my-email-for-twenty-three-years-i-have-thrown-in-the-towel-the-oligopoly-has-won.html). "My emails simply aren't delivered," he wrote.

**Right to repair** won legal access but didn't make repair easier. The [FTC sued John Deere](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-states-sue-deere-company-protect-farmers-unfair-corporate-tactics-high-repair-costs) in January 2025, alleging the company forces farmers through its dealer network for software repairs. Winning the right to fix your tractor doesn't give you the diagnostic expertise to do it.

**Blockchain** solved distributed trust at the cost of distributed complexity. Most users chose centralized exchanges. Custodial wallets on Coinbase recreated exactly the intermediary structure blockchain was supposed to eliminate.

Same mistake, three times: sovereignty made *possible* without being made *easier*. Free but hard to run. Legal but hard to do. Trustless but hard to use. Each solved the access problem and left the maintenance problem untouched.

AI closes the maintenance gap. An AI system reads logs, correlates errors with recent changes, generates a patch, runs tests, rolls back if tests fail. This observe-diagnose-act-verify loop is exactly what made self-hosting impractical. Today it requires human supervision (the AI proposes, a human approves), but reviewing a proposed fix takes minutes where diagnosing from scratch takes hours. The threshold isn't perfection. It's cheaper-than-delegation. For a growing set of systems, it's already crossed.

## What's Real Today

In early 2025, a $2,000 GPU ran a reasoning model competitive with GPT-4o on a growing set of benchmarks, locally and offline. A year later, Alibaba's [Qwen3.5](https://github.com/QwenLM/Qwen3.5), 27 billion parameters quantized, runs on a laptop and approaches frontier commercial models on several software engineering benchmarks, including tasks where AI autonomously resolves real GitHub issues. No internet. No subscription. A model on your hardware, closing in on the best cloud service you can buy.

Three dynamics reinforce this trajectory. Inference cost has historically fallen by an order of magnitude every few hardware generations. Quantization cuts memory requirements by 75% with near-zero quality loss. Mixture-of-experts architectures activate only a fraction of parameters per token. In 2024, running a GPT-4-class model locally required exotic hardware. In early 2025, a high-end GPU. By early 2026, a laptop. The trendline points toward phones within a few years. The marginal cost of local intelligence converges on electricity.

The model is half the story. The tooling is the other half. In February 2026, Claude Code shipped multi-agent orchestration: a single command spawns agents for analysis, implementation, testing, and pull request creation. Background agents run autonomously while the developer does other work. In 2024, AI suggested completions. In 2025, it executed multi-step tasks with approval. In early 2026, agents coordinate on a shared codebase for hours. Not an assistant you invoke. A maintainer that runs.

## "Not Your Weights, Not Your Brain"

A local model doesn't give you a neutral mind. You're importing someone else's training: Qwen carries Alibaba's choices, LLaMA carries Meta's. Every model has baked-in biases and blind spots. What local inference gives you is *choice*: which model to run, when to swap it, how to fine-tune it, whether to run two models and compare their outputs. The sovereignty isn't in escaping bias. It's in not being locked to one provider's version of it. (What infrastructure you need to audit, compare, and mitigate model biases is its own problem, and a necessary one to build.)

The deeper issue is cognitive sovereignty. A cloud provider determines what its model will engage with. Those boundaries shift with each update, shaped by legal exposure, public pressure, and commercial strategy. The question isn't whether any particular boundary is reasonable. It's that someone else sets it, changes it, and owes you no explanation. Sovereignty means deciding your own cognitive boundaries, not evaluating someone else's.

None of this requires malice. It requires only the structural fact of dependency.

The internet democratized information. It didn't democratize the capacity to reason about it. A parent navigating an IEP for their child, a farmer interpreting soil reports, a retiree parsing Medicare options, an immigrant filling out asylum paperwork. The information exists, but applying it to a specific situation has always required hiring someone. The bottleneck was never access to knowledge. It was the cognitive work of using it. Local AI collapses that cost. The same infrastructure that keeps your reasoning private makes expert-level cognition available without the expert, or the expert's fees.

This is the shift that extends beyond software. Every institution that mediates between people and their own reasoning, from schools to legal systems to healthcare to financial advisors, faces the same structural pressure the Church faced when scripture became readable. The economic case, which follows, is where the disruption is most measurable. The cognitive case is where it matters most.

## What This Means for Software

Software is where the economic case is clearest. Project management tools generate billions in annual SaaS revenue from databases of tasks, views, automation rules, integrations, permissions. SaaS companies don't sell software. They sell the avoidance of maintenance. The moat is switching cost. AI collapses switching costs: it generates an app from a prompt, stores data in portable schemas, maintains itself through the observe-diagnose-act-verify loop. For a five-person team, $60/year on a VPS versus $3,000/year in subscriptions.

The disruption runs deeper than replacing one app with a cheaper one. When generation is instant, the interface becomes ephemeral. You say "what's blocking the launch?" and a purpose-built view appears: tasks, dependencies, owners, sorted by urgency. When you're done, it dissolves. Navigation, settings, feature menus, the scaffolding of shared software, vanish when every interface is generated for one person and one moment. You can't charge per seat for a screen the user regenerates in seconds. The durable product is the data beneath it and the rules that govern it.

The pattern starts where SaaS economics fail. A plumber with three employees, a freelance translator, a nonprofit running operations from personal email. Businesses too small for any software company to acquire profitably. The customer acquisition cost exceeds the lifetime value. They're not underserved. They're *unserviceable*. So they track projects in text files, manage jobs on paper, send invoices as email attachments.

AI makes the unserviceable serviceable. The system generates itself from a prompt, no sales team. It maintains itself, no support team. The interface appears per task, no onboarding. The cost to serve a customer drops from hundreds of dollars to the price of compute. Thirty million American small businesses that no software company could profitably reach become reachable at once. By the time these systems mature enough for larger organizations, the ecosystem has hardened from below. Incumbents can't follow. Their revenue depends on being the system you can't leave. Offering "generate your own tool and leave" is self-cannibalization.

## What Has to Be Built

Thirty million small businesses in the United States use invoicing software. The median freelancer pays $30–80/month for a SaaS platform to store what is, at bottom, a PDF and a database row (client lists, payment histories, margins) on someone else's servers. An agent generates the same system from a description and maintains it on a VPS you own. "Who owes me money?" produces a view of outstanding receivables. "Draft an invoice for the Henderson project, net-30, 2% early payment discount" produces an invoice ready to send. No app to install. No interface to learn. $5/month versus $30–80. Intuit hosts your financial history, raises prices at will, and trains models on data from millions of businesses including yours. A system you own does none of that.

Now extend the scenario. Your agent sends a structured invoice to your client's AI-maintained accounting system. Their agent receives it, matches it to a purchase order, flags discrepancies, queues payment. No human touches it.. Your system was generated from one prompt, theirs from another: different schemas, different infrastructure, different assumptions about what "net-30" means when your calendars disagree on holidays. The first fully autonomous business transaction: invoice to payment, agent to agent, between systems that have never seen each other's code.

### The Missing Layers

Work backwards from "sovereign invoicing that just works" and every missing layer reveals itself. Some of what's missing is plumbing: inference scheduling, diagnostic traces, credential scoping. Hard but tractable, and increasingly solvable by the same AI that creates the need.

Once AI collapses maintenance costs, the deeper question emerges: what happens when code generation is essentially free? When anyone can produce a working system in seconds, you stop maintaining code and start regenerating from spec. Technical debt is voluntary: rewriting from scratch beats patching. The implementation, and the interface on top of it, are disposable. What becomes scarce is everything around them: knowing the system is correct, making it talk to other systems, proving who you are, and settling what you owe. The value stack inverts. Code is cheap. Verification, protocols, identity, and payments are expensive. When software can be regenerated from a spec in seconds, the spec itself becomes the durable artifact, not the code, not the interface. Compliance and correctness, which used to be costs layered on top of development, become the primary products. The companies that matter won't write code. They'll define correctness.

**Verification.** Does the invoicing system calculate California sales tax correctly? Florida's? VAT for a UK client? "Tests passed" only covers what tests cover. The question shifts from "does it work?" to "is it *correct*?", and correctness requires domain expertise the generator doesn't have. Tax codes across fifty states plus international jurisdictions demand independent, continuously updated test suites. Specification, not implementation, becomes the artifact worth paying for. Whoever builds the verification suites becomes the UL of generated software.

**Protocols.** Your invoicing agent sends a structured invoice to your client's accounting agent. But their system was generated from a different prompt, stores data in a different schema, runs on different infrastructure. This is agent-to-agent coordination across systems that were never designed to work together. You need protocols for discovery (how do agents find each other?), schema negotiation (what does "invoice" mean to your system versus mine?), and dispute resolution (when the amounts don't match, how do they reconcile?). A million sovereign applications that can't interoperate is just a million islands. The protocol layer for agent-to-agent collaboration is what HTTP was for documents and SMTP was for messages: the boring infrastructure that makes everything else possible. It doesn't exist yet.

**Identity.** Your agent sends an invoice on your behalf. How does the recipient's system verify it's from you and not a fraudster? Invoice fraud is a multi-billion-dollar annual problem. When any agent acts on your behalf, how does either side prove authorization? You need agent identity, delegation chains (this agent acts on behalf of this person with these permissions), and verifiable records of every commitment.

**Payments.** The invoicing system processes payments as its core function, and the agent spends money provisioning servers and contracting services. Current payment infrastructure assumes a human authorizing each charge. Agents need programmatic, scopeable, auditable payment rails: a virtual card capped at $20/month for infrastructure, automatically revoked if spending deviates. For agent-to-agent settlement (a client's system paying your invoice, your system paying for tax verification), stablecoin on a fast settlement layer eliminates card processing overhead and enables sub-dollar payments between parties that have never transacted before.

Identity needs cryptographic delegation. Payments need programmable money. Both were blockchain's original promise, and both failed because humans couldn't bear the complexity. Agents can. Wallet management, transaction signing, fee optimization: routine computation, not UX problems. The technology that couldn't reach ordinary people may yet serve them through machines that handle the complexity humans never would.

When your agent sends an invoice and the client's agent disputes the amount, who arbitrates? When a tax verification service certifies a calculation and it's wrong, who's liable? Protocol design is an engineering problem. Liability is not. Courts will answer it before engineers do.

The current stack was built for humans doing one thing at a time. Autonomous agents break every assumption in it. The new layers (verification, protocols, identity, payments) won't be planned into existence. They'll be built because their absence is intolerable.

## The Hardest Counterarguments

**Behavioral.** Most people don't care about sovereignty. Correct. The Reformation spread not through individual conviction but because institutional sponsors (German princes, city councils) found it useful for consolidating power. The AI equivalent: a CFO mandates the switch after seeing $47,000/year in SaaS spend replicable for $720. A hospital CIO moves to local models when cloud AI creates liability. Sovereignty is a side effect of cost rationalization, not a consumer preference.

**Quality.** Frontier cloud models are better and may stay that way. But the threshold isn't parity on every benchmark. It's being good enough that keeping your thinking local outweighs the gap. For a growing number of tasks, the threshold is already crossed.

**The whole-product gap.** Self-hosted AI has no vendor, no SLA, no Gartner quadrant. This barrier is real, and it's the business opportunity: companies providing hosting, monitoring, support, and compliance for locally-run AI. The Red Hat of this era.

**Liability.** Cloud vendors don't just sell software. They sell someone to blame, someone to audit, and someone to sue. For regulated industries (healthcare, finance, government), dependency isn't a bug. It's purchased legibility. A self-hosted system that fails has no vendor to hold accountable. This is the strongest reason the transition will be slower than the economics alone suggest, and it's the gap the Red Hat of this era must close first.

**Historical.** Computing oscillates: mainframes, PCs, web, cloud. Every decentralization wave recentralizes. But the question isn't whether recentralization occurs. It's whether credible alternatives exist that discipline incumbents. Local AI doesn't need to replace the cloud. It needs to make the cloud earn your dependency.

**Structural.** AI makes vendors more productive too. Right, for infrastructure: Stripe's fraud models, Cloudflare's security. But most SaaS revenue comes from the application layer, where vendors amortize *development cost*, not aggregate data. When AI compresses development cost toward zero, the amortization advantage evaporates.

Decentralization carries real risks. The same local model that helps a researcher study extremism helps a propagandist automate it. The same maintenance loop that patches your server patches someone else's malware. These are the predictable costs of a technology that doesn't discriminate by intent. The case for local AI isn't that the risks are small. It's that the alternative, permanent dependence on a handful of providers for your cognitive tools, is a risk too, just one that compounds quietly.

---

*Sola scriptura*, by scripture alone, didn't mean every Christian became a scholar. It meant the priesthood lost its monopoly on interpretation. And it didn't happen because peasants demanded it. It happened because powerful institutions found the new model served their interests.

*Sola computa*, by your own compute, doesn't mean everyone runs their own infrastructure. It means the platforms lose their monopoly on intelligence. For software, the driver will be cost: someone with budget authority looks at the bill. For everything else, the driver will be something harder to price: the right to think through your own machine.

The first reformation didn't eliminate intermediaries. It replaced a monopoly with a market: universities, publishers, nation-states, institutions that earned authority rather than inheriting it. This reformation will produce its own. Verification bodies, protocol consortia, identity registrars, the new institutions of the AI era. The difference: when the underlying capability runs on every device, no institution can lock you in. They persist only while they're useful.

The reformation didn't destroy the Church. It made the intermediary optional. Once optional, it had to be good.

[^1]: Linux Foundation and Harvard, [Census III of Free and Open Source Software](https://www.linuxfoundation.org/research/census-iii-of-free-and-open-source-software-application-libraries) (2024).
[^2]: Tidelift, [2024 State of the Open Source Maintainer Report](https://tidelift.com/open-source-maintainer-survey-2024).
[^3]: I explored this shift in [Systems Pilots](/blog/systems-pilots/).
