+++
title = "Systems Pilots"
date = 2026-02-28
+++

Years back I worked at RapidSOS. Today when you call 9-1-1, the GPS coordinates of your phone get routed to the dispatcher. It's a life-saving service. The FCC's number before this was grim: more than 10,000 people a year die because the dispatcher can't tell where the caller is.[^fcc] Say you call for help in the middle of some monotonous highway. Before RapidSOS, dispatchers had to mostly rely on cell tower triangulation which can be miles off. The irony is 9-1-1 couldn't find you but your Uber could and you had no idea.

Maintaining life-saving infrastructure like this requires five nines uptime. The bugs that scared me the most during my time there were quiet ones that slowly compounded but appeared to be noise. Thankfully we spent a lot of time on testing and QA and I never encountered this scenario. But I worry in the age of LLMs these will be more common.

Pilots have a name for the human half of this. They call it automation complacency. Lean on the autopilot long enough and your skills atrophy. Air France 447 is a solemn textbook case. That crew had hand-flown so little in recent years that when the autopilot cut out they couldn't read what the airplane was telling them. The stall warning sounded seventy-five times and not one of them heard it for what it was.

Software is walking into the same thing. For years entry-level jobs helped train people to think from smaller systems growing larger. Maybe you'd start with CRUD apps and LeetCode grinding and shipping small bugs, which was the right thing to optimize for. Now this effort is practically free as part of an LLM trajectory. But that routine work is how juniors used to earn their judgment, the way a new pilot logs hours in calm weather before anyone trusts them in a storm. Take those hours away and the judgment has to come from somewhere else.

Flight training today leans hard on simulators. They throw an engine failure at you, a nasty crosswind, and maybe the whole panel going black at the worst possible moment. You practice losing the airplane on purpose, over and over.

The way we train engineers should rhyme with that. We should be simulating failures without an LLM to help engineers understand how to think in systems. What LLMs don't have is a feel for tradeoffs, because they don't have the entire context to be able to think in systems. There will be organizational barriers in being able to feed it all the context.

Aviation already worked out the right format for this. It's called a checkride. An examiner climbs into the cockpit with you and starts breaking things on purpose. Interviews could do the same. Drop a service that's throwing intermittent 502s in front of someone and have them reason out loud toward the cause, or hand them a chunk of AI-written code with a concurrency bug buried in it and watch whether they catch it, or sketch an architecture and ask where it falls over first once traffic goes up tenfold. I wouldn't be surprised if in future there are services that just specialize in creating this simulation for universities and interviews and maybe even annual training.

[^fcc]: FCC, [*Notice of Proposed Rulemaking*, PS Docket No. 07-114](https://www.fcc.gov/document/fcc-proposes-improvements-wireless-e911-location-accuracy-rules) (February 2014), estimating that inadequate wireless caller location contributes to more than 10,000 deaths per year.
