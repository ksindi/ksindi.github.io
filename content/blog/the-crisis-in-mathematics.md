+++
title = "Empty Cathedrals"
date = 2026-03-28
+++

{{ image(src="/images/kronecker.jpg", alt="Leopold Kronecker", width="300px", caption="Leopold Kronecker, 1865. God made the integers; the rest was up for debate. Credit: Getty Images.") }}

In 1886, Leopold Kronecker told the Berlin Society of Natural Scientists: *"Die ganzen Zahlen hat der liebe Gott gemacht, alles andere ist Menschenwerk."* God made the integers; all else is the work of man.[^1] For years I read this as the ramblings of a reactionary who didn't understand progress. Kronecker as the man who harassed Cantor, blocked his appointments, called him a "corrupter of youth."[^2]

Except Kronecker wasn't a crank. He proved the Kronecker-Weber theorem, a foundational result in algebraic number theory. His *Jugendtraum* became Hilbert's twelfth problem. Still largely open. His concern wasn't irrationals specifically. It was *finitism*: only objects constructible in finitely many steps from the integers deserve to exist as mathematics. He anticipated Brouwer's intuitionism and the homotopy type theory that computer scientists now use to verify proofs. Hilbert declared that no one shall be expelled from Cantor's paradise. Kronecker would have asked whether paradise was load-bearing.

The instinct to dismiss him is itself the problem. Not because he was right about the specifics (completed infinities turned out to be extraordinarily useful) but because his underlying question was serious. Mathematics is *Menschenwerk*. The work of human hands, for human purposes. When it forgets that, something goes wrong.

## The Baroque Warning

In 1947, John von Neumann wrote an essay called "The Mathematician." Mathematical ideas, he argued, originate in empirics. But once conceived, the subject "begins to live a peculiar life of its own" and becomes "governed by almost entirely aesthetical motivations."[^3]

This is fine. Aesthetic motivation produces extraordinary mathematics. The danger comes later:

> At a great distance from its empirical source, or after much "abstract" inbreeding, a mathematical subject is in danger of degeneration. At the inception the style is usually classical; when it shows signs of becoming baroque, the danger signal is up.

The remedy, von Neumann wrote, is "the rejuvenating return to the source: the reinjection of more or less directly empirical ideas." Mathematics drifting from empirical origins doesn't collapse. It decays into *l'art pour l'art*, into "a disorganized mass of details and complexities," into work that proceeds "along the line of least resistance" within its own formalism.

## Ceres and Quadratic Reciprocity

The pure/applied distinction is roughly 80 years old. The greatest mathematicians never recognized it.

Gauss proved quadratic reciprocity. He also directed the Göttingen Observatory for 48 years, led a geodetic survey of the Kingdom of Hanover, built one of the first electromagnetic telegraphs with Weber, and predicted the orbit of Ceres from three observations using the method of least squares.

Riemann's 1854 habilitation lecture is the most striking case. He introduced the geometry of curved manifolds, the framework Einstein would need 60 years later for general relativity. But Riemann didn't present it as pure abstraction. He argued that geometry's axioms are "not necessary but of a merely *empirical* certainty," hypotheses about the real world, "to be examined within observable bounds."[^4] Fourier developed Fourier series to solve the heat equation. Euler founded graph theory while about actual bridges in Königsberg. The 19th century's most profound abstractions grew out of concrete problems, not the other way around.

## 3 + 2

In 1935, a group of French mathematicians writing under the collective pseudonym Nicolas Bourbaki began rebuilding mathematics from scratch on rigorous axiomatic foundations. Their project, *Éléments de mathématique*, sought to unify the field under a single structural language: groups, rings, topological spaces, all derived from set theory.

Bourbaki produced real benefits. They standardized terminology, raised the bar for rigor, and influenced a generation of brilliant mathematicians: Serre, Grothendieck, Lang. The structural perspective was genuinely clarifying.

The damage was subtler and took decades to surface. Vladimir Arnold delivered the indictment at the Palais de Découverte in Paris in 1997. "Mathematics is a part of physics," he began. "Physics is an experimental science, a part of natural science. Mathematics is the part of physics where experiments are cheap."[^5] Then:

> In the middle of the twentieth century it was attempted to divide physics and mathematics. The consequences turned out to be catastrophic. Whole generations of mathematicians grew up without knowing half of their science and, of course, in total ignorance of any other sciences.

Arnold gave specific examples from French education, where Bourbaki's philosophy had been imported into schools as the "New Math." A French primary school pupil, asked what is 2 + 3, replied: "3 + 2, since addition is commutative." He could not compute the sum. Students at the École Normale Supérieure had never seen a paraboloid. The surface \(xy = z^2\) put them into a stupor.

Category theory is the logical endpoint of this trajectory. Developed in the 1940s by Eilenberg and Mac Lane, it studies the structure of mathematical structures themselves: abstraction of abstraction. Its practitioners called it "abstract nonsense" and meant it affectionately. Its claimed applications in computer science are real but revealing: category theory found its audience among people who already think in category theory. That's the formalist culture reproducing itself.

Arnold was extreme. Few mathematicians would agree that math is literally a part of physics. But his core observation holds: when formalism becomes the culture rather than the tool, mathematicians stop noticing what their formalism can't express.

## The Bitter Lesson

Machine learning is the most consequential mathematical technology of the last two decades. The math it runs on: linear algebra, calculus, probability, optimization. All of it 18th and 19th century. Backpropagation is the chain rule. Attention in transformers is weighted sums and softmax. Gradient descent is older than the telephone. There have been attempts to import algebraic topology, category theory, differential geometry into deep learning. They remain curiosities. Rich Sutton's bitter lesson keeps reasserting itself: general methods that scale with computation beat clever mathematical structure.[^6]

The 20th century did produce important new mathematical frameworks: information theory, linear programming, game theory, the Kalman filter. But look at where they came from. Shannon was at Bell Labs solving signal transmission, Dantzig at the Air Force optimizing logistics, Nash modeling economic strategy, Kalman navigating spacecraft. Every one was grounded in a concrete problem. Meanwhile, pure mathematics departments in the same period produced algebraic geometry, homological algebra, category theory, higher topos theory. None of it has become infrastructure. The useful 20th century math came from people doing exactly what von Neumann prescribed: reinjecting empirical ideas. The crisis is in the departments that stopped.

Physics has a parallel crisis: string theory has produced no testable predictions in 50 years, and Hossenfelder's *Lost in Math* argues the field has been led astray by mathematical beauty.[^7] But physics is bottlenecked by instruments. Mathematics has no such excuse.

## Taste

Terence Tao's assessment of LLMs in mathematics has shifted rapidly: from "a mediocre, but not completely incompetent, graduate student" in September 2024 to "ready for primetime" by March 2026.[^8] LLMs now "save more time than they waste" in his research. The lower cost of exploration allows him to "try crazier things." DeepMind's AlphaProof achieved silver medal standard at the 2024 International Mathematical Olympiad, solving four of six problems with machine-verified proofs in Lean.[^9]

If machines can prove theorems, the scarce resource shifts from proof to *taste*: choosing which theorems to prove. The prime number theorem illustrates this. Erdős and Selberg produced an elementary proof in 1949 that avoids complex analysis entirely. It's a technical achievement, but it illuminates almost nothing about *why* the primes thin out logarithmically. The complex-analytic proof, using the zeta function, is shorter, clearer, and reveals the deep connection between prime distribution and the zeros of an analytic function. Complex analysis does the same thing to integration: integrals that are brutal on the real line dissolve into a contour and a residue count. Good abstraction exposes the mechanism, not just the result. Machines proving theorems faster makes the choice of *which* abstractions to build more important, not less. A machine that can verify any proof in seconds raises the cost of bad taste, because now you can waste compute on a million provable theorems about structures nobody needs.

LLMs could also help with fragmentation. Subfields have specialized until practitioners in algebraic geometry and combinatorics can barely read each other's papers, even when they study different facets of the same underlying structures. If a machine can read across every subfield simultaneously, it can surface connections that no human specialist would find.

The optimistic case: LLMs as the "rejuvenating return to the source" that von Neumann prescribed, not automating proof production but helping mathematicians choose better problems. The pessimistic case: the incentive structures of academic mathematics (publish, specialize, tenure) reward theorem count over taste, and LLMs just accelerate the production of mathematics no one will read.

## *Menschenwerk*

Every mathematician I've known entered the field because something was beautiful. That impulse isn't the problem. It's the reason mathematics exists. And the strongest counterargument to everything above is that you can't plan serendipity. Hardy pursued number theory because it was beautiful, not because it was useful. If he'd tried to be useful, he might never have done the work that now secures the internet. Directing mathematicians toward utility could kill the very pipeline that produces unexpected utility. I might be as wrong about what's "pointless" today as Hardy was in 1940.

Kronecker's instinct, that mathematics is *Menschenwerk*, the work of human hands for human purposes, was not wrong. The danger isn't beauty. It's institutions that mistake beauty for direction, that treat aesthetic satisfaction as evidence a research program is pointing somewhere. The crisis isn't abstraction. Von Neumann identified it precisely. The crisis is what happens when the baroque sets in and no one remembers the source.

God made the integers. We chose what to do with them. The choice is the part worth defending.

[^1]: The quote survives only through Heinrich Weber's obituary of Kronecker in the *Jahresbericht der Deutschen Mathematiker-Vereinigung* (1893), p. 19, recounting a lecture at the 1886 Berliner Naturforscher-Versammlung.
[^2]: Recent scholarship suggests Kronecker may have been a better judge of Cantor's character than of his mathematics. See Joseph Howlett, ["The Man Who Stole Infinity,"](https://www.quantamagazine.org/the-man-who-stole-infinity-20260225/) *Quanta Magazine* (February 2026), on Cantor's appropriation of Dedekind's work.
[^3]: John von Neumann, "The Mathematician" (1947), reprinted in *The Works of the Mind*, University of Chicago Press.
[^4]: Bernhard Riemann, *"Über die Hypothesen, welche der Geometrie zu Grunde liegen"* (1854), habilitation lecture at Göttingen.
[^5]: Vladimir Arnold, "On Teaching Mathematics," address at the Palais de Découverte, Paris, March 7, 1997. Published in *Russian Mathematical Surveys* 53:1 (1998).
[^6]: Rich Sutton, ["The Bitter Lesson"](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) (2019). "The biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective."
[^7]: Sabine Hossenfelder, *Lost in Math: How Beauty Leads Physics Astray* (2018).
[^8]: Terence Tao, remarks on AI in mathematics research, September 2024 and March 2026.
[^9]: DeepMind, "AI achieves silver-medal standard solving International Mathematical Olympiad problems," *Nature* (November 2025).
