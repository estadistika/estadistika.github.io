---
layout: post
title:  "Julia: Data Wrangling using JuliaDB.jl and JuliaDBMeta.jl"
date:   2018-6-8 12:00:00 +0800
categories: Data Analyses Wrangling Julia Programming Packages
comments: true
author: Al-Ahmadgaid B. Asaad
tags: julia
---
I'm a heavy user of Python's [pandas](https://pandas.pydata.org/) and R's [dplyr](https://cran.r-project.org/web/packages/dplyr/index.html) both at work and when I was taking my master's degree. Hands down, both of these tools are very good at handling the data. So what about Julia? It's a fairly new programming language that's been around for almost 6 years already with a very active community. If you have no idea, I encourage you to visit [Julialang.org](http://julialang.org/). In summary, it's a programming language that walks like a [Python](https://www.python.org/), but runs like a [C](https://en.wikipedia.org/wiki/C_%28programming_language%29). 

For data wrangling, there are two packages that we can use, and these are [DataFrames.jl](https://github.com/JuliaData/DataFrames.jl) and [JuliaDB.jl](http://juliadb.org/latest/). Let me reserve a separate post for [DataFrames.jl](https://github.com/JuliaData/DataFrames.jl), and instead focus on [JuliaDB.jl](http://juliadb.org/latest/) and [JuliaDBMeta.jl](https://piever.github.io/JuliaDBMeta.jl/latest/) (an alternative for querying the data, like that of R's [dplyr](https://cran.r-project.org/web/packages/dplyr/index.html)) packages.
<h3 class="section">Package Installation</h3>
By default, the libraries I mentioned above are not built-in in Julia, and hence we need to install it:
<script src="https://gist.github.com/alstat/78138748ba87580653416a6181693caa.js"></script>
<h3 class="section">Data: nycflights13</h3>
In order to compare Julia's capability on data wrangling with that of R's [dplyr](https://cran.r-project.org/web/packages/dplyr/index.html), we'll reproduce the example in this [site](https://cran.rstudio.com/web/packages/dplyr/vignettes/dplyr.html). It uses all 336,776 flights that departed from New York City in 2013. I have a copy of it on github, and the following will download and load the data:
<script src="https://gist.github.com/alstat/c0c2bc4e5355ac55ad83fc07fa8561c8.js"></script>
The rows of the data are not displayed as we execute <code>nycflights</code> in line 7, that's because we have a lot of columns, and by default [JuliaDB.jl](http://juliadb.org/latest/) will not print all these unless you have a big display (unfortunately, I'm using my 13 inch laptop screen, and that's why). Hence, for the rest of the article, we'll be using selected columns only:
<script src="https://gist.github.com/alstat/2cde6bb6e7ede38ddcdba7d47fb1fed7.js"></script>
<h3 class="section">Filter Rows</h3>
Filtering is a row-wise operation and is done using the <code>Base.filter</code> function with extended method for <code>JuliaDB.IndexedTables</code>.
Therefore, to filter the data for month equal to 1 (January) and day equal to 1 (first day of the month), is done as follows:
<script src="https://gist.github.com/alstat/fe17e7133a3de644bfc853b624bb6af3.js"></script>
To see the output for line 2 using <code>Base.filter</code>, simply remove the semicolon and you'll have the same output as that of line 5 (using <code>JuliaDBMeta.@filter</code>).

<h3 class="section">Arrange Rows</h3>
To arrange the rows of the columns, use <code>Base.sort</code> function:
<script src="https://gist.github.com/alstat/1211792bac2febc1d7c4ba058107e2d9.js"></script>
<h3 class="section">Select Columns</h3>
We've seen above how to select the columns, but we can also use ranges of columns for selection.
<script src="https://gist.github.com/alstat/785e35fe4535c84cc8f60dafa9b39e69.js"></script>
<h3 class="section">Rename Column</h3>
To rename the column, use <code>JuliaDB.renamecol</code> function:
<script src="https://gist.github.com/alstat/048463d348450873dba81f3a96a473d1.js"></script>
<h3 class="section">Add New Column</h3>
To add a new column, use <code>insertcol</code>, <code>insertcolafter</code> and <code>insertcolbefore</code> of the [JuliaDB.jl](http://juliadb.org/latest/).
<script src="https://gist.github.com/alstat/a5a2df1fbdb3feaad408a2ca92244e30.js"></script>
or use the <code>@transform</code> macro of the [JuliaDBMeta.jl](https://piever.github.io/JuliaDBMeta.jl/latest/):
<script src="https://gist.github.com/alstat/ee7f0ab8405473aa88c5f52193ede352.js"></script>
<h3 class="section">Summarize Data</h3>
The data can be summarized using the <code>JuliaDB.summarize</code> function
<script src="https://gist.github.com/alstat/3891fec973a923dcc0f6cc451ead4859.js"></script>
<code>@with</code> macro is an alternative from [JuliaDBMeta.jl](https://piever.github.io/JuliaDBMeta.jl/latest/).
<h3 class="section">Grouped Operations</h3>
For grouped operations, we can use the <code>JuliaDB.groupby</code> function or the <code>JuliaDBMeta.@groupby</code>:
<script src="https://gist.github.com/alstat/523976efd34a747f8fe6211b16ad6bf0.js"></script>
We'll use the summarized data above and plot the flight delay in relation to the distance travelled. We'll use the [Gadfly.jl](http://gadflyjl.org/stable/) package for plotting and [DataFrames.jl](https://github.com/JuliaData/DataFrames.jl) for converting [JuliaDB.jl](http://juliadb.org/latest/)'s IndexedTable objects to DataFrames.DataFrame object, that's because Gadfly.plot has no direct method for JuliaDB.IndexedTables.
<script src="https://gist.github.com/alstat/c8485c39992d82c9129ccd2e5e2745c2.js"></script>
To plot, run the following:
<script src="https://gist.github.com/alstat/2d6322571f78ec940af76c6011ed9f1f.js"></script>
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/2018-6-8-p2.svg?sanitize=true">
To find the number of planes and the number of flights that go to each possible destination, run:
<script src="https://gist.github.com/alstat/6a78c1dc19914326c39a4c47eecb7b8e.js"></script>
<h3 class="section">Piping Multiple Operations</h3>
For multiple operations, it is convenient to use piping and that is the reason why we have tools like [JuliaDBMeta.jl](https://piever.github.io/JuliaDBMeta.jl/latest/). The following example using [R's dplyr](https://cran.rstudio.com/web/packages/dplyr/vignettes/dplyr.html):
<script src="https://gist.github.com/alstat/1ef5992f368ebdb4be5e8b95678e6021.js"></script>
is equivalent to the following Julia code using [JuliaDBMeta.jl](https://piever.github.io/JuliaDBMeta.jl/latest/):
<script src="https://gist.github.com/alstat/a91f46846a8bc6ef0ac2992293734f90.js"></script>
<h3 class="section">Conclusion</h3>
I've demonstrated how easy it is to use Julia for doing data wrangling, and I love it. In fact, there is a library that can query any table-like data structure in Julia, and is called [Query.jl](https://github.com/davidanthoff/Query.jl) (will definitely write a separate article for this in the future).

For more on [JuliaDB.jl](http://juliadb.org/latest/), watch the [Youtube tutorial](https://www.youtube.com/watch?v=d5SzUh2_ono).