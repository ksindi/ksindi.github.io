+++
title = "Surgeons vs. Medics: The Two Startup Engineer Archetypes"
date = 2025-09-18
+++

If you spend enough time in startups, you’ll notice the best engineers fall into two archetypes: surgeons and field medics. This isn’t a spectrum. It’s bimodal. The difference is not about seniority, but about temperament and instinct.

Picture the medic in a MASH unit. Chaos everywhere. Shrapnel wounds and gunshots arriving by the minute. They move fast, making split-second decisions with incomplete information. Their tools are crude but effective: tourniquets, morphine, quick patches to keep patients alive long enough to fight again. Precision is a luxury they cannot afford.

Now picture the cardiac surgeon in an operating room. Years of training have etched every pathway of the heart into memory. When they cut, it is with precision born of deep understanding. One wrong move and the patient dies on the table.

The medic optimizes for speed under fire. The surgeon optimizes for precision under control. Put them in the wrong setting, and both fail.

Medics cover ground quickly. Debug a deployment in the morning. Wire up an integration in the afternoon. They won't find the perfect solution, but they’ll find something that works before the deadline. To surgeons, their code looks hacky. Sometimes it is. But medics move forward.

Surgeons work differently. Single-threaded but thorough. They hold entire systems in mind, anticipate edge cases others miss. Deadlines make them uncomfortable. Not because they're slow, but because they see hidden complexity. When surgeons speak, take it as ground truth. That level of clarity takes years of scar tissue. You usually only see it at Staff and above. Not because title makes them surgeons, but because it takes that long to accumulate the depth. Seniority creates the conditions. Temperament makes the surgeon. Many senior engineers never become surgeons. Some never want to.

To surgeons, medics are cowboys piling up technical debt. To medics, surgeons are perfectionists ignoring business reality. Both are right.

Some problems demand surgeons: database migrations, payment processing, architectural redesigns. Deep understanding required. Zero tolerance for error.

Other problems reward medics: urgent customer requests, third-party integrations, production fires. Quick thinking wins.

Think of the Eisenhower matrix. High-importance, low-urgency work belongs to surgeons. High-urgency, low-importance work belongs to medics. The danger zone is high-importance and high-urgency. If failure risks your business, you need a surgeon, even if customers must wait. If the change is urgent but contained and reversible, medics can handle it.

Most engineers don’t fall cleanly into either archetype. They sit in the middle: not fast enough to thrive as medics, not precise enough to succeed as surgeons. The leverage is at the extremes. Think of it in terms of gradient descent. Surgeons make large, precise gradient updates that move the system toward an optimum. Medics make rapid, noisy updates that converge by sheer speed of iteration. What you don’t want is the middle: engineers with low precision and slow iteration.

Hiring patterns follow company stage. Early startups optimize for iteration speed until they find product-market fit. You want medics who can build, integrate, and debug in one day. Once product-market fit arrives, the calculus shifts. Wrong architectural decisions become crippling. Leverage matters more than speed. This is when surgeons become indispensable.

AI is widening the gap, not closing it. Medics are evolving into orchestrators, directing fleets of AI agents across many small problems. Surgeons are using AI to strip away routine implementation and focus on the highest-leverage design choices.

The biggest mistake companies make is forcing everyone into one mold. You don't want medics architecting authentication systems. You don't want surgeons spending days optimizing an internal tool used twice a month. The best startups balance both. They give surgeons the space to design durable systems and medics the freedom to move quickly when fires break out. Survival depends on both: precision in the operating room and speed on the battlefield.

---

*Thanks to Howard Tyson for helping come up with the analogy.*
