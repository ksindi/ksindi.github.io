+++
title = "Surgeons vs. Medics: The Two Startup Engineer Archetypes"
date = 2025-09-18
+++

The best startup engineers fall into two archetypes: surgeons and field medics. This isn't a spectrum. It's bimodal, based on temperament, not seniority.

Picture a MASH unit medic. Chaos everywhere, shrapnel wounds arriving by the minute. They move fast with incomplete information, using crude but effective tools to keep patients alive.

Now picture a cardiac surgeon. Years of training have etched every heart pathway into memory. When they cut, it's with precision born of deep understanding. One wrong move kills the patient.

Medics optimize for speed under fire. Surgeons optimize for precision under control. Put them in the wrong setting, and both fail.

Medics cover ground quickly. Debug a deployment in the morning, wire up an integration in the afternoon. They won't find the perfect solution, but they'll find something that works.

Surgeons work single-threaded but thorough. They hold entire systems in mind and anticipate edge cases others miss. Deadlines make them uncomfortable because they see hidden complexity. When surgeons speak, treat it as ground truth.

To surgeons, medics are cowboys piling up technical debt. To medics, surgeons are perfectionists ignoring business reality. Both are right.

Some problems demand surgeons: database migrations, payment processing, architectural redesigns. Deep understanding required, zero tolerance for error.

Others reward medics: urgent customer requests, third-party integrations, production fires. Quick thinking wins.

Use the Eisenhower matrix to decide who is best to assign. High-importance, low-urgency work goes to surgeons. High-urgency, low-importance work goes to medics. The danger zone is high-importance and high-urgency. If failure risks your business, use a surgeon even if customers wait. If the change is urgent but contained and reversible, medics can handle it.

Most engineers sit in the middle: not fast enough for medics, not precise enough for surgeons. The leverage is at the extremes.

Every team needs both. Early startups may skew toward medics for speed but still need surgeons designing data models. Mature companies emphasize architecture but need medics handling escalations. The ratio shifts with context, but the need for both remains constant.

AI is widening the gap. Medics become orchestrators directing AI agents. Surgeons use AI to strip away routine implementation and focus on highest-leverage design choices.

The biggest mistake is forcing everyone into one mold. You don't want medics architecting authentication or surgeons optimizing rarely-used internal tools. The best startups give surgeons space to design durable systems and medics freedom to move when fires break out. Survival depends on both.

---

*Thanks to Howard Tyson and Qiming Fang for feedback.*
