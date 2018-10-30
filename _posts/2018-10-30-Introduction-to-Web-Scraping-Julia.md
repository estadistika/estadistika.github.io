---
layout: post
title:  "Julia: Introduction to Web Scraping (PHIVOLCS' Seismic Events)"
date:   2018-10-30 12:00:00 +0800
categories: Web Scraping Philippines Julia Programming Packages
comments: true
use_math : true
---
Data nowadays are almost everywhere, often stored in as simple as traditional log books, to as complex as multi-connected-databases. Efficient collection of these datasets is crucial for analytics since data processing takes almost 50% of the overall workflow. An example where manual data collection can be automated is in the case of datasets published in the website, where providers of these are usually government agencies. For example in the Philippines, there is a website dedicated to <a href="http://openstat.psa.gov.ph/" target="_blank">Open Stat</a> initiated by the <a href="https://psa.gov.ph/" target="_blank">Philippine Statistics Authority (PSA)</a>. The site hoards public datasets for researchers to use and are well prepared in CSV format, so consumers can simply download the file. Unfortunately, for some agencies this feature is not yet available. That is, users need to either copy-paste the data from the website, or request it to the agency directly (this also takes time). A good example of this is the seismic events of the <a href="https://www.phivolcs.dost.gov.ph/" target="_blank">Philippine Institute of Volcanology and Seismology (PHIVOLCS)</a>. 

Data encoded in HTML can be parsed and saved into formats that's workable for doing analyses (e.g. CSV, TSV, etc.). The task of harvesting and parsing data from the web is called **web scraping**, and PHIVOLCS' <a href="https://www.phivolcs.dost.gov.ph/html/update_SOEPD/EQLatest.html" target="_blank">Latest Seismic Events</a> is a good playground for beginners. There are several tutorials available especially for Python (see <a href="https://www.dataquest.io/blog/web-scraping-tutorial-python/" target="_blank">this</a>) and R (see <a href="https://www.analyticsvidhya.com/blog/2017/03/beginners-guide-on-web-scraping-in-r-using-rvest-with-hands-on-knowledge/" target="_blank">this</a>), but not much for Julia. Hence, this article is primarily for Julia users.

### Why Julia?
The creators of the language described it well in their first announcement (I suggest you read the full post): <a href="https://julialang.org/blog/2012/02/why-we-created-julia" target="_blank">Why we created Julia?</a> Here's part of it:

> *We are greedy: we want more.*

> *We want a language that’s open source, with a liberal license. We want the speed of C with the dynamism of Ruby. We want a language that’s homoiconic, with true macros like Lisp, but with obvious, familiar mathematical notation like Matlab. We want something as usable for general programming as Python, as easy for statistics as R, as natural for string processing as Perl, as powerful for linear algebra as Matlab, as good at gluing programs together as the shell. Something that is dirt simple to learn, yet keeps the most serious hackers happy. We want it interactive and we want it compiled.*

> *(Did we mention it should be as fast as C?)*

I used Julia on my master's thesis for my <a href="https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo" target="_blank">MCMC simulations</a> and compared it to R. It took seconds in Julia while R took more than an hour (sampling over the posterior distribution). I could have optimized my R code using <a href="http://www.rcpp.org/" target="_blank">Rcpp</a> (writting the performance-critical part in C++ to speed up and wrapped/call it in R), but I have no time for that. Hence, Julia solves the <a href="https://www.quora.com/What-is-the-2-language-problem-in-data-science" target="_blank">two-language problem</a>.

### Getting to know HTML
Since the data published in the website are usually encoded as a table, it is therefore best to understand the structure of the HTML document before performing web scraping. HTML (Hypertext Markup Language) is a standardized system for tagging text files to achieve font, color, graphic, and hyperlink effects on World Wide Web pages \[<a href="https://www.google.com/search?q=what+is+HTML&ie=utf-8&oe=utf-8&client=firefox-b-ab" target="_blank">1</a>\]. For example, bold text in HTML is enclosed inside the `<b>` tag, e.g. `<b>`text`</b>`, the result is <b>text</b>. A webpage is a HTML document often structured as follows:
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/html-4.png?sanitize=true">
Scrapers must be familiar with the hierarchy of the HTML document as this will be the template for the frontend source code of every website. Following the structure of the above figure, data encoded in HTML table are placed inside the `td` (table data) tag, where `td` is under `tr` (table row), `tr` is under `tbody` (table body), and so on. `td` is the lowest level tag (sorting by hierarchy) from the figure above that can contain data. However, `td` can also take precedence over `p` (paragraph), `a` (hyperlink), `b` (bold), `i` (italic), `span` (span), and even `div` (division). So expect to encounter these under `td` as well.

As indicated in the figure, each HTML tag can have attributes, such as `id` and `class`. To understand the difference of the two, consider `id="yellow"` and `id="orange"`, these are unique identities (`id`s) of colors. These `id`s can be grouped into a class, e.g. `class="colors"`. HTML tags are not required to have these attributes but are useful for adding custom styles and behavior when doing web development. This article will not dive into the details of the HTML document, but rather to give the reader a high level understanding. There are many resources available on the web, just google.
### Inspecting the Source of the Website
In order to have an idea on the structure of the website, browsers such as Google Chrome and Mozilla Firefox include tools for Web Developers. For purpose of illustration but without loss of generality, this article will only scrape portion (why? read on and see the explanation below) of the <a href="https://www.phivolcs.dost.gov.ph/html/update_SOEPD/EQLatest-Monthly/2018/2018_September.html" target="_blank">September 2018 earthquake events</a>. The web developer tools can be accessed from <b>Tools > Web Developer</b> in Firefox, and can be accessed from <b>View > Developer</b> in Google Chrome. The following video shows how to use the inspector tool of the Mozilla Firefox.
<iframe width="100%" height="400px" src="https://www.youtube.com/embed/RJEnugditnA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Scraping using Julia
To perform web scraping, Julia offers three libraries for the job, and these are <a href="https://github.com/Algocircle/Cascadia.jl" target="_blank">Cascadia.jl</a>, <a href="https://github.com/JuliaWeb/Gumbo.jl" target="_blank">Gumbo.jl</a> and <a href="https://github.com/JuliaWeb/HTTP.jl" target="_blank">HTTP.jl</a>. <a href="https://github.com/JuliaWeb/HTTP.jl" target="_blank">HTTP.jl</a> is used to download the frontend source code of the website, which then is parsed by <a href="https://github.com/JuliaWeb/Gumbo.jl" target="_blank">Gumbo.jl</a> into a hierarchical structured object; and <a href="https://github.com/Algocircle/Cascadia.jl" target="_blank">Cascadia.jl</a> provides a CSS selector API for easy navigation.

To start with, the following code will download the frontend source code of the PHIVOLCS' Seismic Events for September 2018. 
<script src="https://gist.github.com/alstat/4e5bbbb9587b6506c4341a8097804c69.js"></script>
Extract the HTML source code and parsed it as follows:
<script src="https://gist.github.com/alstat/deb9ef2abe52af58fc03be63f0482ccf.js"></script>
Now to extract the header of the HTML table, use the Web Developer Tools for preliminary inspection on the components of the website. As shown in the screenshot below, the header of the table is enclosed inside the `p` tag of the `td`. Further, the `p` tag is of class `auto-style33`, which can be accessed via CSS selector by simply prefixing it with `.`, i.e. `.auto-style33`.
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/firefox-inspector.png?sanitize=true">
<script src="https://gist.github.com/alstat/63c8855a48c9a33669c9bdd4d3ae2e9a.js"></script>
`qres` contains the HTML tags that matched the CSS selector's query. The result is further cleaned by removing the tabs, spaces and line breaks via <a href="https://en.wikipedia.org/wiki/Regular_expression" target="_blank">Regular Expressions</a>, and is done as follows:
<script src="https://gist.github.com/alstat/94e5af21b303b995d93af24a8ae69841.js"></script>
Having the header names, next is to extract the data from the HTML table. Upon inspection, the `td`s containing the data next to the header rows seem to have the following classes (see screenshot below): `auto-style21` for first column (Date-Time), `auto-style81` for second column (Latitude), `auto-style80` for third and fourth columns (Longitude and Depth), `auto-style74` for fifth column (Magnitude), and `auto-style79` for sixth column (Location). Unfortunately, this is not consistent across rows (`tr`s), and is therefore best not to use it with <a href="https://github.com/Algocircle/Cascadia.jl" target="_blank">Cascadia.jl</a>. Instead, use <a href="https://github.com/JuliaWeb/Gumbo.jl" target="_blank">Gumbo.jl</a> to navigate down the hierarchy of the <a href="" target="_blank">Document Object Model</a> of the HTML.
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/firefox-inspector-data.png?sanitize=true">
Starting with the `table` tag which is of class `.MsoNormalTable` (see screenshot below), the extraction proceeds down to `tbody` then to `tr` and finally to `td`.
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/firefox-inspector-table.png?sanitize=true">
The following code describes how parsing is done, read the comments:
<script src="https://gist.github.com/alstat/b4fbfe5dc8330ef16ad1abc05d44056f.js"></script>

### Complete Code for PHIVOLCS' September 2018 (Portion) Seismic Events
The September 2018 Seismic Events are encoded in two separate HTML tables of the same class, named `MsoNormalTable`. For purpose of simplicity but without loss of generality, this article will only scrape the first portion of the table (581 rows) of the data. The second portion is left to the reader to try out and scrape it as well.

The following code wraps the parsers into functions, namely `htmldoc` (downloads and parses the HTML source code of the site), `scraper` (scrapes the downloaded HTML document), `firstcolumn` (logic for parsing the first column of the table, used inside `scraper` function).
<script src="https://gist.github.com/alstat/698125867d853b941ab4284de34d9362.js"></script>
<script src="https://gist.github.com/alstat/5b7463964703db410b05214f124bf028.js"></script>
### End Note
I use Python primarily at work with <a href="https://www.crummy.com/software/BeautifulSoup/bs4/doc/" target="_blank">BeautifulSoup</a> as my go-to library for web scraping. Compared to <a href="https://github.com/Algocircle/Cascadia.jl" target="_blank">Cascadia.jl</a> and <a href="https://github.com/JuliaWeb/Gumbo.jl" target="_blank">Gumbo.jl</a>, <a href="https://www.crummy.com/software/BeautifulSoup/bs4/doc/" target="_blank">BeautifulSoup</a> offers comprehensive documentations and other resources that make it easy to figure out bugs, and understand how the module works. Having said, I hope this article somehow contributed to the documentation of the said Julia libraries, and help beginners understand how these modules work. Further, I am confident to say that <a href="https://github.com/Algocircle/Cascadia.jl" target="_blank">Cascadia.jl</a> and <a href="https://github.com/JuliaWeb/Gumbo.jl" target="_blank">Gumbo.jl</a> are stable enough for the job.

Lastly, as a precaution to beginners, make sure to read the privacy policy (if any) of any website before scraping.

### Software Versions
<script src="https://gist.github.com/alstat/12f52ef5b2c76fdeb5f927fc3239c613.js"></script>