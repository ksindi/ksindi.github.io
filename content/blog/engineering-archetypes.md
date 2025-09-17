+++
title = "Surgeons vs. Medics: The Two Startup Engineer Archetypes"
date = 2025-09-16
+++

If you spend enough time in startups, you’ll see engineers fall into two archetypes: surgeons and field medics. The difference isn’t about seniority but rather temperament and instincts.

Picture the medic in a MASH unit. Chaos everywhere. Shrapnel wounds and gunshots arriving by the minute. They move fast, making split-second decisions with incomplete information. Their tools are crude but effective: tourniquets, morphine, quick patches to keep patients alive long enough to fight again. Precision is a luxury they cannot afford.

Now picture the cardiac surgeon in a sterile operating room. Years of training have etched every pathway of the heart into their memory. When they cut, it’s with precision born of deep understanding. One wrong move and the patient dies on the table.

The medic optimizes for speed under fire. The surgeon optimizes for precision under control. Neither thrives in the other’s environment.

Medics cover surface area quickly. They jump between problems, debugging a deployment issue in the morning and wiring up an integration by the afternoon. They may not choose the perfect solution, but they’ll find something that works before the deadline. Their code often looks hacky to surgeons, and sometimes it is. But their focus is forward momentum.

Surgeons work differently. They are single-threaded but thorough. A surgeon can hold an entire system in their head and anticipate edge cases. They dislike deadlines not because they are slow, but because they see hidden complexity others miss. Whatever they can say can be trusted because they have thought it through.

Tension between the two is unavoidable. Surgeons see medics as swashbucklers thoughtlessly accumulating technical debt that will come due as requirements evolve. Medics see surgeons not focused enough on business impact. Both perspectives contain truth.

How can this framework be useful? I've found this a helpful mental model when thinking about resourcing decisions, including project assignments and team building.

Certain problems demand surgeons: database migrations, payment processing, and architectural redesigns. These require deep understanding and zero tolerance for error. Other problems reward medics: urgent customer requests, third-party integrations, and production firefighting. Here, quick thinking and rapid iteration win. Think of the Eisenhower matrix. High-importance, low-urgency work belongs to surgeons. High-urgency, low-importance work belongs to medics. The danger zone is high-importance and high-urgency. If failure risks your business, you need a surgeon, even if customers must wait. If the change is urgent but contained and reversible, medics can handle it.

Who you tend to hire depends on the stage of the startup. Early startups need to optimize for iteration speed until they find product-market fit. You want medics who can build, integrate, and debug all in one day. Once product-market fit arrives, the calculus changes. Wrong architectural decisions become expensive, and leverage matters more than speed. This is when surgeons are indispensable.

How do you spot a surgeon? Surgeons speak carefully and question assumptions. They are deliberate with estimates and comfortable saying “I need to think about it.” They are leveraged because their precision shapes systems that last. Medics are easy to spot. Always moving, context-switching, optimistic about timelines. They thrive in crises and often grow more effective under pressure.

AI is widening the gap rather than closing it. Medics are evolving into orchestrators, directing fleets of AI agents across many small problems. Surgeons are using AI to offload routine implementation and focus on the highest leverage problems.

The biggest mistake companies make is forcing everyone into one mold. You don't want medics architecting authentication systems. You don't want surgeons spending days optimizing an internal tool used twice a month. The best startups balance both. They give surgeons the space to design durable systems and medics the freedom to move quickly when fires break out. Survival depends on both: precision in the operating room and speed on the battlefield.

---

*Thanks to Howard Tyson for helping come up with the analogy and feedback.*
