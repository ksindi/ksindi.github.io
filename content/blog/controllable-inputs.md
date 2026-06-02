+++
title = "Controllable Inputs"
date = 2026-01-31
+++

{{ image(src="/images/amazon-flywheel.webp", width="400px", alt="Amazon's growth flywheel", caption="Amazon's flywheel showing controllable inputs feeding growth") }}

In the autumn of 2001, in the middle of the dot-com bust, Jim Collins sat down with Bezos and a few of his executives and walked them through the flywheel. The team sketched their own version on a napkin: lower prices would attract more customers, more customers would attract more sellers, more sellers would increase selection, and better selection would improve customer experience, drive more traffic, lower costs through scale, and feed back into lower prices.[^flywheel]

By 2009, Bezos had codified the logic into Amazon's annual goal-setting process. From that year's shareholder letter:

> Senior leaders that are new to Amazon are often surprised by how little time we spend discussing actual financial results or debating projected financial outputs. To be clear, we take these financial outputs seriously, but we believe that focusing our energy on the controllable inputs to our business is the most effective way to maximize financial outputs over time.[^bezos-2009]

Amazon set 452 detailed goals that year. Of those, 360 directly impacted customer experience. The word "revenue" appeared eight times. "Free cash flow" appeared four times. "Net income," "gross profit or margin," and "operating profit" appeared zero times. Instead it focused on controllable inputs which are levers teams can directly control to drive outcome metrics.

Most companies do it the other way. They set high-level goals, usually in the form of quarterly OKRs, like "increase revenue by 20%" or "grow active users by 50%" and then push it down to the teams. Sure these are measurable, but they're lagging and -- more importantly -- no one team controls them. How can an engineer sitting in a Dashboard team directly grow sales?

Between shipping a feature and seeing it move revenue lies a long chain of confounders: competitive dynamics, market conditions, sales cycles, pricing decisions. In enterprise the problem is worse: new features get rolled into existing contracts at renewal. No one knows whether the feature mattered. By the time the signal reaches the team that built it, it's noise.

What you need to do is work backwards, identifying the value you're creating and the controllable inputs that help drive that value. And a way to get there is by writing *mission* and *tenets*.

A mission tells a team *what* to build, but not *how* to choose when two good options collide. For that it's helpful to write tenets, the standing tradeoffs written down, that let a team make the call a founder would have made without being in the room. Amazon Kindle's mission was every book ever printed, in any language, available in under 60 seconds. The tenets that followed were those tradeoffs frozen in prose, each one a team could apply on any given Tuesday without escalating.

"Books need to be at least 50% cheaper." When the marginal cost of delivering bits is zero, a digital book should cost half the physical one; build tools that reduce the cost of getting a book to a reader such that at 50% of the current price, authors still earn more than before.

"Better than physical books." People have read the same way since paper was invented; changing a behavior that old requires magical experiences, and unless a feature is magical, err on the side of the physical book. It took Amazon more than three years to ship the first Kindle because of that tenet.

"Bring authors closer to readers." Remove every barrier between author and reader without compromising value for the reader. That tenet eventually produced Kindle Direct Publishing, which let authors reach readers without a publisher at all.

Each tenet is a controllable input in disguise. "50% cheaper" points a team straight at cost levers, "better than physical" tells the hardware team when to ship and when to hold, and "authors closer to readers" names the middlemen the platform team should be trying to cut out. A good tenet makes the tradeoff explicit and points at something a team can actually move, where a bad one like "build scalable systems" could be pinned on any team in the company.

Sometimes you can't trace the chain at all. A company walking into a genuinely new market often has no idea which inputs matter. You should run experiments to find the inputs. Amazon had the data to know which arcs were real.

[^flywheel]: Jim Collins describes the autumn 2001 session with Bezos and his executive team in *Turning the Flywheel* (2019), a monograph extending the flywheel concept from *Good to Great*. The napkin sketch of Amazon's virtuous cycle is recounted in Brad Stone, *The Everything Store* (2013).
[^bezos-2009]: Jeff Bezos, [2009 Letter to Shareholders](https://www.sec.gov/Archives/edgar/data/1018724/000119312510082914/dex991.htm), Amazon.com, Inc.
