# ksindi.github.io

* Modifications are made in the `source` branch.
* The `master` branch contains the generated output.
* The `pelican-plugins` must be recursive-cloned here: `git clone --recursive https://github.com/getpelican/pelican-plugins`.
* We build with `make publish`.
* We use `gh-import` to push `output` to the `master` branch and we push this to GitHub via travis.
