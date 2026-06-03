+++
title = "Empty Cathedrals"
date = 2026-03-28
+++

{{ image(src="/images/kronecker.webp", alt="Leopold Kronecker", width="300px", caption="Leopold Kronecker, 1865. God made the integers; the rest was up for debate. Credit: Getty Images.") }}

In 1886, Leopold Kronecker told the Berlin Society of Natural Scientists: *"Die ganzen Zahlen hat der liebe Gott gemacht, alles andere ist Menschenwerk."* God made the integers; all else is the work of man.[^weber-obituary] For years I read this as the ramblings of a reactionary. Kronecker as the man who harassed Cantor, blocked his appointments, called him a "corrupter of youth."{% sidenote() %}Recent scholarship suggests Kronecker may have been a better judge of Cantor's character than of his mathematics. See Joseph Howlett, ["The Man Who Stole Infinity,"](https://www.quantamagazine.org/the-man-who-stole-infinity-20260225/) *Quanta Magazine* (February 2026), on Cantor's appropriation of Dedekind's work.{% end %}

Of course Kronecker wasn't a crank. His real concern was *finitism*: only objects you can build in finitely many steps from the integers deserve to exist. He anticipated Brouwer's intuitionism, and the constructive tradition it grew into is what today's proof assistants run on.

In 1947, von Neumann warned that mathematical ideas originate in empirics but, once conceived, the subject "begins to live a peculiar life of its own" and becomes "governed by almost entirely aesthetical motivations."[^von-neumann] He warned:

> At a great distance from its empirical source, or after much "abstract" inbreeding, a mathematical subject is in danger of degeneration. At the inception the style is usually classical; when it shows signs of becoming baroque, the danger signal is up.

The remedy, von Neumann wrote, is "the rejuvenating return to the source: the reinjection of more or less directly empirical ideas."

The distinction between pure and applied mathematics is a relatively new phenomenon and would feel alien to the 18th century greats. Gauss directed the Göttingen Observatory for 48 years, led a geodetic survey of the Kingdom of Hanover, built one of the first electromagnetic telegraphs with Weber, and predicted the orbit of Ceres from three observations using the method of least squares.

Riemann's 1854 habilitation lecture is an even more striking case. He introduced the geometry of curved manifolds, the framework Einstein would need 60 years later for general relativity. But Riemann didn't present it as pure abstraction. He argued that geometry's axioms are "not necessary but of a merely *empirical* certainty," hypotheses about the real world, "to be examined within observable bounds."[^riemann] Fourier developed his eponymous series to solve the heat equation. Euler founded graph theory thinking about actual bridges in Königsberg.

In 1935, a group of French mathematicians writing under the collective pseudonym Nicolas Bourbaki began rebuilding mathematics from scratch on rigorous axiomatic foundations. Their project, *Éléments de mathématique*, sought to unify the field under a single structural language: groups, rings, topological spaces, all derived from set theory. Bourbaki produced real benefits. They standardized terminology and raised the bar for rigor, and they shaped a generation of brilliant mathematicians: Serre, Grothendieck, Lang. There's a nice Ted Ed video on it.

But Bourbaki's formalism dried mathematics of intuition and empiricism. All books started adopting this formal style. It's almost impossible to find a graduate textbook that references applications.

Category theory to me sits at the end of this spectrum. Developed in the 1940s by Eilenberg and Mac Lane, it studies the structure of mathematical structures themselves: abstraction of abstraction. Its practitioners called it "abstract nonsense" and meant it affectionately. It has exported little. Its proudest contribution to computing, the monads and functors of functional programming, mostly renames patterns programmers already used.

Take a course in machine learning and it's striking how old the math underneath it is. Linear algebra, calculus, probability, optimization, basically all of it 18th and 19th century. Backpropagation is just the chain rule, the attention in a transformer is mostly weighted sums run through a softmax, and gradient descent is older than the periodic table. People keep trying to drag in the heavier machinery like algebraic topology but they keep staying as curiosities.

The 20th century did produce real new mathematical frameworks, but look at where they actually came from. In 1948 Claude Shannon was sitting in a Bell Labs office on a very practical question: how many bits does it take to push a message across a noisy telephone wire? The paper he wrote that summer, "A Mathematical Theory of Communication," invented information theory, a foundation that has underlain everything from modems to satellite links. Dantzig was over at the Air Force optimizing logistics, Nash was modeling economic strategy, and Kalman was working out how to keep a spacecraft on course. Every one of them starting from a concrete problem. Meanwhile the pure departments of the same years were turning out algebraic geometry, homological algebra, category theory, higher topos theory, and none of it has become infrastructure anybody relies on.

Physics has a parallel crisis: string theory has produced no testable predictions in 50 years, and Hossenfelder's *Lost in Math* argues the field has been led astray by mathematical beauty.[^hossenfelder] But physics is bottlenecked by instruments; mathematics has no such excuse.

If machines can create and verify proofs faster, the scarce resource shifts from proof to *taste* of what to work on. Tao called LLMs "a mediocre, but not completely incompetent, graduate student" in September 2024, and has revised that upward repeatedly since.[^tao] DeepMind's AlphaProof reached silver-medal standard at the 2024 International Mathematical Olympiad with machine-verified proofs in Lean.[^alphaproof]

The prime number theorem to me is a great example of mathematical taste. Erdős and Selberg produced an elementary proof in 1949 that avoids complex analysis entirely. It's a technical achievement that illuminates almost nothing about *why* the primes thin out logarithmically. The complex-analytic proof, using the zeta function, is shorter, clearer, and reveals the deep connection between prime distribution and the zeros of an analytic function. Indeed, complex analysis is so powerful in solving so many calculus problems, it's a great theory even though complex numbers are not empirical. I'm pretty sure its study and results were accelerated by the practical considerations.

But who am I to say what math is worth studying? Hardy pursued number theory because it was beautiful, and called it useless with something like pride. Number theory underpins so much of cryptography and it wasn't studied to make communication more secure. Directing mathematicians toward utility would kill innovation pipelines that produce unexpected utility.

But I think Kronecker's instinct, that mathematics is *Menschenwerk*, still holds. God made the integers, Kronecker said. It's up to us what we do with the rest.

[^weber-obituary]: The quote survives only through Heinrich Weber's obituary of Kronecker in the *Jahresbericht der Deutschen Mathematiker-Vereinigung* (1893), p. 19, recounting a lecture at the 1886 Berliner Naturforscher-Versammlung.
[^von-neumann]: John von Neumann, "The Mathematician" (1947), reprinted in *The Works of the Mind*, University of Chicago Press.
[^riemann]: Bernhard Riemann, *"Über die Hypothesen, welche der Geometrie zu Grunde liegen"* (1854), habilitation lecture at Göttingen.
[^hossenfelder]: Sabine Hossenfelder, *Lost in Math: How Beauty Leads Physics Astray* (2018).
[^tao]: Terence Tao, remarks on Mathstodon, September 2024.
[^alphaproof]: DeepMind, "AI achieves silver-medal standard solving International Mathematical Olympiad problems," *Nature* (November 2025).
