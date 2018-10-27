---
layout: post
title:  "Julia: Introduction to Web Scraping (PHIVOLCS' Seismic Events)"
date:   2018-10-14 12:00:00 +0800
categories: Web Scraping Philippines Julia Programming Packages
comments: true
use_math : true
---
Data nowadays are almost everywhere, often stored in as simple as traditional log books, to as complex as multi-connected-databases. Efficient collection of these datasets is crucial for analytics since data processing takes almost 50% of the overall workflow. An example where manual data collection can be automated is in the case of datasets published in the website. Providers of these datasets are usually government agencies, for example in the Philippines, there is a website dedicated to Open Data initiated by the Philippine Statistics Authority (PSA). The site hoards public datasets for researchers to use and are well prepared in CSV format, so consumers can simply download the file. Unfortunately, for some agencies this feature is not yet available. Hence, users need to either copy-paste the data from the website, or request it to the agency directly (this also takes time). The best example for this is the seismic events of the Philippine Institute of Volcanology and Seismology (PHIVOLCS). 

How to automate the data collection then? Well, data encoded in HTML can be parsed and saved into formats that's workable for doing analyses (e.g. CSV, TSV, etc.). The task of parsing data from the web is called **web scraping**, and PHIVOLCS' Latest Siesmic Events is the best playground for beginners in web scraping. There are several tutorials available especially for Python and R, but not much for Julia. Hence, this article aims primarily at Julia users but can be useful for beginners using other languages.

### Why Julia?
Google it and try it. As of the moment, this is the fastest scientific programming language. 

### Getting to know HTML
Since the data published in the website are usually encoded in HTML table, it is therefore best to understand the structure of the HTML document before scraping. HTML (Hypertext Markup Language) is a standardized system for tagging text files to achieve font, color, graphic, and hyperlink effects on World Wide Web pages. For example, bold text in HTML is encosed inside the tag `<b>`text`</b>`, the result is <b>text</b>. A webpage is a HTML document often structured as follows:
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/html-3.png?sanitize=true">
Scrapers must be familiar with the hierarchy of the HTML document as this will be the cheatsheet for the blueprints of every website. Following the structure of the above figure, data encoded in HTML table are placed inside the `td` (table data) tag, where `td` is under `tr` (table row), `tr` is under `tbody` (table body), and so on. `td` is the lowest level tag (sorting by hierarchy) from the figure above that can contain data. However, there are further tags that can be placed under `td`, and these are `p` (paragraph), `a` (hyperlink), `b` (bold), `i` (italic), `span` (span), and even `div` (division), a note for beginners.

As indicated in the figure, each html tag can have attributes, such as `id` and `class`. To understand the difference of the two, consider `id="yellow"` and `id="orange"`, these unique identity of the colors belong to a group/class, hence `class="colors"` for example. HTML tags are not required to have these attributes. This article will not dive into the details of HTML document, but rather to give the reader a high level understanding. There are many resources for this, just google.
### Inspecting the Source of the Website
In order to have an idea on the structure of the website, browsers such as Google Chrome and Mozilla Firefox include tools for Web Developers. For purpose of illustrating web scraping, this article will only scrape portion (why? read on and see the explanation below) of the <a href="https://www.phivolcs.dost.gov.ph/html/update_SOEPD/EQLatest-Monthly/2018/2018_September.html" target="_blank">September 2018 latest earthquake events</a>. The web developer tools can be accessed from Tools > Web Developer in Firefox, and can be accessed from View > Developer in Google Chrome. The following video shows how to use the inspector tool of the Mozilla Firefox.
<iframe width="100%" height="400px" src="https://www.youtube.com/embed/RJEnugditnA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Scraping using Julia
To perform web scraping, Julia offers three libraries for the job, and these are Cascadia.jl, Gumbo.jl and HTTP.jl. HTTP.jl is used to download the frontend source code of the website, which then is parsed by Gumbo.jl into a hierarchical structured object. Although, any elements of the HTML document can be accessed using Gumbo.jl by going through the hierarchy of the HTML, Cascadia.jl provides a CSS selector API for easy navigation.

To start with, the following code will download the frontend source code of the PHIVOLCS' Latest Seismic Events for September 2018. 
<script src="https://gist.github.com/alstat/4e5bbbb9587b6506c4341a8097804c69.js"></script>
Extract the HTML source code and parsed it as follows:
<script src="https://gist.github.com/alstat/deb9ef2abe52af58fc03be63f0482ccf.js"></script>
Now to extract the header of the HTML table, the Web Developer Tools mentioned above is used to inspect on the components of the website. It turns out that the header of the table is enclosed inside the `p` tag of the `td`. Further, the `p` tag has class attribute set to `auto-style33`, which can be accessed via CSS by prefixing it with `.`, i.e. `.auto-style33`. See the screenshot below:
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/firefox-inspector.png?sanitize=true">
Therefore, using CSS selector to efficiently access the `p` tag, run the following
<script src="https://gist.github.com/alstat/63c8855a48c9a33669c9bdd4d3ae2e9a.js"></script>
Finally, removing the tabs, spaces and line breaks via Regular Expressions, returns the following cleaned labels.
<script src="https://gist.github.com/alstat/94e5af21b303b995d93af24a8ae69841.js"></script>
### Complete Code for PHIVOLCS' September 2018 (Portion) Seismic Events
The September 2018 Seismic Events are encoded in two separate HTML table of the same class, which is `MsoNormalTable` (see screenshot below). For purpose of simplicity but without loss of generality, this article will only scrape the first table of the data. The following wraps the parsing into functions, namely `htmldoc` (downloads and parses the HTML source code of the site), `scraper` (scrapes the data), `firstcolumn` (logic for parsing the first column of the table and is use inside `scraper`).
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/firefox-inspector-table.png?sanitize=true">
<script src="https://gist.github.com/alstat/698125867d853b941ab4284de34d9362.js"></script>
<script src="https://gist.github.com/alstat/5b7463964703db410b05214f124bf028.js"></script>
### End Note
I use Python primarily at work with BeautifulSoup as my go to library for web scraping. Compared to Julia's library, BeautifulSoup offers comprehensive documentations and other useful resources. However, after trying out this exercise, I am confident to say that Cascadia.jl and Gumbo.jl are stable enough for the job.

### Software Versions
<script src="https://gist.github.com/alstat/12f52ef5b2c76fdeb5f927fc3239c613.js"></script>