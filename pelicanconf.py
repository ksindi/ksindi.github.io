#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals


AUTHOR = 'Kamil Sindi'
SITENAME = 'TL;DR Data Science'
SITEURL = ''
PATH = 'content'

DEFAULT_DATE = 'fs'
WITH_FUTURE_DATES = True
FILENAME_METADATA = '(?P<date>\d{4}-\d{2}-\d{2})-(?P<slug>.*)'
STATIC_PATHS = ['images', 'pdfs', 'widgets']
PAGE_EXCLUDES = ['widgets', '.ipynb_checkpoints']
ARTICLE_EXCLUDES = ['widgets', '.ipynb_checkpoints']
EXTRA_PATH_METADATA = {
    'images/favicon.jpg': {'path': 'favicon.jpg'},
}
THEME = 'themes/pure'
MD_EXTENSIONS = ['codehilite(css_class=highlight,'
                 'guess_lang=False,linenums=False)',
                 'headerid',
                 'extra']
DEFAULT_PAGINATION = 5
PAGINATION_PATTERNS = (
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html'),
)

DISPLAY_CATEGORIES_ON_MENU = False
DISPLAY_PAGES_ON_MENU = False
DIRECT_TEMPLATES = ('index', 'archives')
ARCHIVES_SAVE_AS = 'archives/index.html'
ARTICLE_URL = '{slug}/'
ARTICLE_SAVE_AS = '{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
TAG_URL = 'tag/{slug}/'
TAG_SAVE_AS = 'tag/{slug}/index.html'
TAGS_SAVE_AS = ''
AUTHOR_URL = ''
AUTHOR_SAVE_AS = ''
CATEGORY_URL = ''
CATEGORY_SAVE_AS = ''
TWITTER_USERNAME = 'capitalistpug'
GITHUB_USERNAME = 'ksindi'
LINKEDIN_USERNAME = 'kamilsindi'
STATCOUNTER = '7297581'
DISQUS_SITENAME = ''
MENUITEMS = [('Home', '/'),
             ('About', '/about/'),
             ]
DATE_FORMATS = {
    'en': '%Y-%m-%d',
}

TIMEZONE = 'America/New_York'
DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = ()

# Social widget
SOCIAL = ()

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True


MARKUP = ('md', 'ipynb')

PLUGIN_PATHS = ['pelican-plugins', 'plugins']
PLUGINS = ['render_math',
           'summary',
           'neighbors',
           'pdf',
           'ipynb.markup',
           ]
