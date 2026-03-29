+++
title = "Controllable Inputs"
date = 2026-01-31
+++

Most companies optimize for the wrong metrics. They set goals like "increase revenue by 20%" or "grow active users by 50%," then cascade these targets down to individual teams. Product teams get revenue targets. Engineering teams get user growth targets. Everyone nods in agreement during planning sessions, then spends the quarter building features with no clear line of sight to those outcomes.

The problem is control.

OKRs, the dominant goal-setting framework, codify this mistake. Key Results are supposed to be measurable, but measurable isn't the same as controllable. "Increase revenue by 15%" is measurable. It's also a lagging indicator shaped by dozens of variables no single team controls. Teams set OKRs each quarter, align them on slide decks, then spend twelve weeks building features with no way to know whether they're on track until the numbers come in. The framework creates alignment theater: everyone's goals connect on paper, but no one's daily work connects to their KR.

A product team cannot directly create enterprise bookings. They can build features that sales might include in pitches. They can improve the product experience that might reduce churn. But between shipping a feature and seeing it impact revenue, there's a maze of confounding variables: sales cycles, competitive dynamics, market conditions, pricing decisions, customer success effectiveness. The signal degrades at every step.

This is especially acute in enterprise settings where new features often get rolled into existing contracts at renewal. You build something significant, sales uses it in conversations, deals close, and you have no idea if your work mattered or if the deals were happening anyway. Optimizing for an outcome you can't measure or control is just hoping with extra steps.

## Amazon's Flywheel

Amazon figured this out early. Not by abandoning outcome metrics, but by identifying the controllable inputs that drive those outcomes.

{{ image(src="/images/amazon-flywheel.png", width="400px", alt="Amazon's growth flywheel", caption="Amazon's flywheel showing controllable inputs feeding growth") }}

Look at what's in that loop: selection, customer experience, traffic, sellers, cost structure, prices. Every single one is directly controllable.

Want more selection? Product teams work with merchant tools. Track SKU count.

Want better customer experience? Improve page load times, checkout flow, delivery estimates. Measure NPS, conversion rates, return rates.

Want more traffic? SEO, marketing, referral programs. Track visits and sources.

Want more sellers? Build seller tools, reduce friction, improve margins. Count new seller signups and GMV.

Want lower costs? Improve warehouse efficiency, negotiate with suppliers, optimize logistics. Measure cost per unit.

Want lower prices? Reduce prices. Immediate and obvious.

Each input connects directly to team actions. Each can be measured without waiting for quarterly earnings. Each gives fast feedback.

Compare this to "increase revenue 20%." What does a product manager do with that? Build more features? Which ones? How do you know if you're making progress before the quarter ends?

Amazon's flywheel works because they identified metrics teams can actually control and measure.

## Finding the Constraint

Elon Musk's companies illustrate a more aggressive version of this. He doesn't just identify controllable inputs, he sets targets so ambitious that hitting them changes the entire competitive landscape.

SpaceX shows how multiple controllable inputs feed a single constraint. The dominant constraint in rocketry is cost per kilogram to orbit. Thrust-to-weight ratio on the engines, reusability of boosters, test cadence: all controllable, all feeding the same number. The Merlin 1D achieves a 184:1 thrust-to-weight ratio. Starship ran 11 test flights in 2025. But the ambition isn't incremental improvement. If you can get cost per kilogram low enough, you don't compete with other launch providers. You unlock markets that didn't exist. Satellite internet becomes viable. Mars colonization moves from science fiction to engineering problem. The economics flip entirely.

The same pattern repeats. Tesla targets cost per vehicle low enough that EVs become cheaper than gas cars without subsidies, at which point the transition is inevitable. FSD has logged 7 billion miles, collecting 14.4 million per day, betting that if autonomous driving is a data problem, fleet scale becomes an insurmountable advantage. xAI's constraining factor is electricity. Colossus 2 runs at 1 gigawatt, scaling to 2, because if you can secure enough power you can train models no one else can. Boring Company targets tunnel cost under $8 million per mile versus the industry's $100-200 million, a threshold where underground transit goes from boondoggle to obvious.

Each target is a threshold. Cross it and the economics change so fundamentally that you become inevitable. That's what separates this from normal goal-setting. It's not "improve cost by 10%," it's "get cost to the point where the entire market restructures around you."

## Find Your Controllable Inputs

Most companies don't have flywheels as clean as Amazon's. Most problems don't reduce to a single constraint like rocketry. So how do you figure out what to control so you can prioritize effectively?

Start with tenets: specific beliefs that make tradeoffs explicit and point to controllable inputs.

Netflix had a tenet: minimize the time between user intent and satisfaction. Every product decision traced to that. Streaming beat DVDs because it reduced delay from days to seconds. Recommendation algorithms mattered because they reduced browsing time. Auto-playing the next episode tested well because it eliminated friction. The controllable inputs: seconds from opening app to starting content, percentage of sessions that end in viewing something.

These are specific beliefs about what matters and what you'll sacrifice to get it. Each one points directly to metrics you can control.

Identify what you can directly control that affects those beliefs. If time to first value matters, you control: documentation quality, onboarding flow steps, API error messages, default configurations. You don't control: whether developers like your brand, whether competitors release something better, whether your market grows.

Make the controllable inputs measurable. "Improve documentation" is not measurable. "Reduce time from signup to successful API call from 15 minutes to 5 minutes" is. "Better onboarding" is not measurable. "Increase percentage of new users who complete core workflow in first session from 40% to 60%" is.

Organize teams around inputs, not outcomes. Don't assign a team "grow revenue." Assign them "increase seller count" or "reduce cost per transaction" or "improve search relevance." Give them a metric they can move through their actions, with a clear causal story to the outcome that matters.

## The Lag Kills You

In stable markets, optimizing for lagging outcomes works fine. Revenue is a good proxy because the lag between action and result is short enough to get feedback.

In startups, the lag kills you. By the time you see revenue impact, the world has shifted. You need leading indicators you can control.

AI makes this worse. Products evolve faster. Features ship daily instead of quarterly. Customer expectations shift as competitors move. The OKR cadence of "set quarterly goals, measure at quarter-end, adjust next quarter" doesn't generate enough signal.

Controllable inputs give you weekly or daily feedback. You know immediately if you're making progress. You can course-correct before the quarter ends. You can run more experiments because you don't need to wait for revenue data to know what worked.

Amazon built a company where every team could wake up and know exactly what to move, how to measure it, and why it mattered. That clarity compounds.

Most companies never get there because they never do the hard work of translating "grow revenue" into "these are the ten things we directly control that cause revenue to grow." It's easier to set outcome goals and hope teams figure it out.

No one agreed on what was actually executable. Strategy begins when you name the inputs.
