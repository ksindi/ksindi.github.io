+++
title = "Sola Computa"
date = 2026-03-07
+++

In 1517 the Bible was in Latin. If you wanted to know what it said, you needed a priest to read it to you and tell you what it meant. The priest answered to a bishop, and the bishop to Rome. The Church controlled the *interpretation* of scripture.

Replace scripture with intelligence and we're in the same place. Whoever trained the model decided what it will and won't discuss. The guardrails wall off whole topics. And the company can swap it out or shut it down tomorrow without telling you.

Three earlier movements tried to cut out the middlemen:

**Open source** handed you the code for free and then left you to maintain it, which was never free at all. About 96% of codebases incorporate open-source components,[^census-iii] yet 60% of maintainers work entirely unpaid.[^tidelift] Widely used infrastructure routinely depends on a handful of volunteers. When they burn out, [critical projects lose their maintainers](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/). [One engineer self-hosted his email for 23 years](https://cfenollosa.com/blog/after-self-hosting-my-email-for-twenty-three-years-i-have-thrown-in-the-towel-the-oligopoly-has-won.html): configured the MX records, maintained the spam filters, kept the server patched, fought the blacklists. After two decades he gave up. "My emails simply aren't delivered," he wrote.

**Right to repair** won legal access but left the expertise gap intact. The [FTC sued John Deere](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-states-sue-deere-company-protect-farmers-unfair-corporate-tactics-high-repair-costs) in January 2025, alleging the company forces farmers through its dealer network for software repairs. Winning the right to fix your tractor doesn't give you the diagnostic expertise to do it.

**Blockchain** solved distributed trust at the cost of distributed complexity. Most users chose centralized exchanges, and custodial wallets on Coinbase recreated exactly the intermediary structure blockchain was supposed to eliminate.

The same mistake, three times over: sovereignty made *possible* without ever being made *easier*. LLMs are what finally close that gap because they can self-maintain.

In 2024, running a GPT-4-class model locally required a rack of GPUs that cost more than a car. By early 2025, a single $2,000 card. By early 2026, you can run Alibaba's [Qwen3.5](https://github.com/QwenLM/Qwen3.5) on a laptop.

Most people will pick convenience anyway. But what you hand a model is more intimate than a tractor or an email server: the half-formed question, the way you reason when you think no one is watching. In 1517 you confessed to a priest who answered to Rome. Now you think out loud to a model whose owner keeps the logs and can change the terms tomorrow.

[^census-iii]: Linux Foundation and Harvard, [Census III of Free and Open Source Software](https://www.linuxfoundation.org/research/census-iii-of-free-and-open-source-software-application-libraries) (2024).
[^tidelift]: Tidelift, [2024 State of the Open Source Maintainer Report](https://tidelift.com/open-source-maintainer-survey-2024).
