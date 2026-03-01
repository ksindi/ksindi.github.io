+++
title = "Systems Pilots"
date = 2026-02-28
+++

Commercial aircraft spend most of their flight under autopilot. Climb, cruise, descent. Managed by software. The pilots monitor. And yet, we do not reduce pilot training because autopilot works. We increase it. When automation fails, it fails abruptly, and the margin for error is thin.

Software engineering is entering its autopilot era. LLMs scaffold projects. Agents refactor entire modules. Copilots generate tests, migrations, API wrappers. Routine coding, the cruise altitude of engineering, is no longer done by humans. The question worth asking is who remains valuable after that shift.

## Stick and Rudder

Autopilot didn't eliminate pilots. It shifted what mattered. Stick-and-rudder proficiency gave way to systems comprehension, failure diagnosis, and the ability to take over decisively when things go wrong. Nobody pays a pilot to hold altitude for eight hours. They pay for the moments when the system does something it shouldn't.

Software is undergoing the same compression. If AI generates 95% of code correctly, the scarce thing is no longer writing code. It's knowing when the AI is subtly wrong, understanding how distributed systems fail, and designing architectures that degrade gracefully rather than shatter.

## Air France 447

Aviation has studied automation complacency for decades. When pilots over-trust automation, skills atrophy, reaction times slow, anomalies go unnoticed.

On June 1, 2009, Air France Flight 447 fell out of the sky over the Atlantic. The Airbus A330 was a highly automated fly-by-wire aircraft. What killed 228 people was not a lack of automation but a three-and-a-half-minute gap in the crew's understanding of it. The pitot tubes iced over at 35,000 feet, feeding garbage to the airspeed indicators. The autopilot, unable to reconcile the data, disconnected and handed control back to the pilots. They had trained on autopilot. They had not trained enough without it. The first officer pulled back on the stick, exactly the wrong input at high altitude, and held it there while the plane stalled and fell for over three minutes. The stall warning blared 75 times. They never recognized what was happening.

The BEA investigation found that the crew had failed to recognize the stall or apply the correct recovery. Not because they were incompetent, but because they had so little practice flying without automation that they couldn't interpret what was happening when it switched off.

The obvious objection: nobody dies from a bad database migration.[^1] True. But aviation is worth borrowing from not because the consequences are identical, but because no other field has studied the automation-human handoff as rigorously. Software has always had these cognitive failure modes, but AI is making them more pronounced and harder to ignore.

Software engineers are walking into the same trap. When you never reason about memory, never inspect generated SQL, never profile runtime behavior, never debug a race condition by hand, you become a passenger in your own system. Modern systems don't fail with a stack trace and a helpful error message. They fail emergently. A slow memory leak. A misconfigured cache. A network partition that only affects 3% of traffic. A model hallucination that slips past validation.

## Keyboard Operators

For years, the industry trained what were essentially keyboard operators. Entry-level engineering optimized for CRUD apps, framework familiarity, LeetCode patterns, and shipping features fast. This made sense when writing code was expensive.

It makes less sense when code generation approaches marginal cost zero. A senior engineer with good AI tooling can now outproduce several juniors on routine implementation work. That collapses the bottom rungs of the training ladder. Juniors used to gain judgment by grinding through repetitive implementation, the same way new pilots accumulate flight hours in calm weather before anyone trusts them in a storm. But if the calm-weather hours are automated away, how does judgment develop? Nobody has a good answer yet, but what's clear is that judgment, historically something engineers developed over years of seniority, has to move earlier in the career. Junior engineers can no longer differentiate on volume of output. The differentiator is whether they can spot where a system will fail before it does.

## Simulators

Aviation doesn't train pilots in clear skies. They train in simulators: engine failures, sensor malfunctions, crosswinds, instrument blackouts. Pilots practice losing control so they can learn to recover it.

Software education should work the same way. Instead of "build a to-do app," the assignment should be: "build a distributed key-value store, inject latency, corrupt packets, observe how it breaks, write the postmortem." Students should create race conditions on purpose. Simulate partial network partitions. Build something, break it, and explain why it broke.

LLMs already know syntax better than most humans. What they don't have is durable mental models of tradeoffs: why abstractions leak, how consistency models constrain architecture, why coupling compounds over time, how latency multiplies across service boundaries. You build those intuitions by touching the hot stove, not by reading the warning label. And you don't build them by accepting whatever the code generator gives you on the first pass.

Deeply understanding how an operating system schedules threads, how a database enforces isolation, or how a network behaves under load matters more now than knowing five frameworks.

## The Checkride

The characteristic failure mode of AI-generated code is what you might call plausible incorrectness. It reads well, it passes a casual review, and it's slightly wrong in a way that surfaces three months later when a rarely-exercised path finally runs in production. Catching that requires genuine understanding of the system you're building, not just the ability to write a good prompt. As more engineering work shifts to supervising and interrogating AI output, the ability to detect plausible incorrectness becomes a core skill.

Most software interviews don't test for it. They test smooth flying. Invert a binary tree. Build a REST API. Implement a rate limiter on a whiteboard. These questions select for the skill that is being automated fastest: producing correct code from a known specification.

In aviation, a checkride is a practical exam where an FAA examiner sits in the cockpit and deliberately introduces failures. Engine out on takeoff. Instrument malfunction. Hydraulic failure. You pass by handling degradation, not by demonstrating smooth flying in clear air. Software interviews should work the same way. Show a candidate a service that's throwing intermittent 502s and ask them to walk through the diagnosis. Hand them AI-generated code with a subtle concurrency bug and see if they catch it. Present a system architecture and ask where it would break first under ten times the traffic. Give them a real postmortem and ask what they would have done differently.

One reason companies default to LeetCode is that better assessments are hard to build and expensive to maintain. AI changes that calculus. The same tools that generate code can generate realistic broken systems: a service with a subtle memory leak, an API with a race condition under concurrent writes, a deployment pipeline with a misconfigured rollback. Spinning up a simulated production incident for a candidate is no longer a major engineering investment. The gap between what interviews test and what the job demands has always existed, but automation is simultaneously widening that gap and making it cheaper to close.

## The 1%

Automation polarizes professions. Average skill gets commoditized while high skill gets leveraged. Autopilot didn't remove pilots. It made the remaining ones more elite. Software engineering is on the same path.

Engineers who understand systems deeply and use AI as leverage will become wildly productive. Engineers who depend on AI without understanding what it's doing will be displaced, not by AI directly, but by other engineers who use it better.

If universities and bootcamps keep optimizing for framework familiarity and surface-level output, they are training copilots who cannot land. The job now is to teach systems thinking early, make failure a core part of the curriculum, and build engineers who are comfortable operating with ambiguity, incomplete information, and conflicting signals. That is where humans still have the edge, and it's worth defending.

In commercial aviation, 99% of the flight is uneventful. The 1% justifies the pilot. In software, the 1% determines data integrity, security posture, user trust, and whether the company survives. As automation gets better, that 1% only gets more valuable. The question is whether the people sitting behind the autopilot can still fly the plane.

What follows from this:

1. **Study real failures as training material.** Read postmortems from companies that publish them: Cloudflare, Google, Stripe, GitLab. For each one, ask: what assumption broke? What signals were available but ignored? What would I have done differently? Judgment is pattern recognition over failure, and you have to feed it examples.

2. **Go deep on one foundational layer rather than broad on frameworks.** Pick the layer your work depends on most (operating system internals, database isolation mechanics, network behavior under load) and understand it well enough to predict its failure modes. Frameworks change every few years. The fundamentals underneath them don't.

3. **Treat AI output like an autopilot readout.** Verify, don't trust. Diff multiple approaches. Ask yourself what the generated code would do under load, with bad input, or when a dependency is slow. The bugs that matter will be the ones that look correct on first read.

4. **If you manage engineers, give juniors investigation work.** Debugging, incident response, performance analysis. This is where judgment develops. Feature tickets build product. Failure work builds engineers. If the routine implementation hours are being automated away, incident work is the replacement for those flight hours.

5. **If you run interviews, test for degradation handling.** Show candidates broken systems and ask them to diagnose. Hand them AI-generated code and ask what's wrong with it. Present architectures and ask where they'd fail. The skills that matter most are the ones least tested by current interview formats.

[^1]: Though some software does carry life-or-death stakes. I worked at RapidSOS, which handled location routing for 9-1-1 calls. A bad deploy there had a different weight to it.
