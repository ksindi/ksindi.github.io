# ksindi.github.io

[![Build Status](https://travis-ci.org/ksindi/ksindi.github.io.svg?branch=source)](https://travis-ci.org/ksindi/ksindi.github.io)

* Modifications are made in the `source` branch.
* The `master` branch contains the generated output.
* The `pelican-plugins` must be recursive-cloned here: `git clone --recursive https://github.com/getpelican/pelican-plugins`.
* Build with `make publish`.
* Use `gh-import` to push `output` to the `master` branch and push to GitHub via Travis CI.