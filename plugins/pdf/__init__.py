# -*- coding: utf-8 -*-
"""Generate a PDF version of the CV."""

import os

from pelican import signals

CMD = ('pdflatex -output-directory content/pdfs'
       ' -interaction nonstopmode {fn}')


def generate_pdf(p):
    os.system(CMD.format(fn='content/cv/cv.tex'))


def register():
    signals.initialized.connect(generate_pdf)
