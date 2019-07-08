---
layout: post
title:  "Interfacing with Relational Database using MySQL.jl and PyMySQL"
date:   2019-07-07 12:00:00 +0800
categories: Julia Python Packages Relational-Databases
comments: true
author: Al-Ahmadgaid B. Asaad
tag: julia python
---
Prior to the advent of computing, relational database can be thought of log books typically used for inventory and visitor's time-in time-out. These books contain rows that define the item/transaction, and columns describing the features of each row. Indeed, these are the core attributes of any relational database. Unlike spreadsheets, which are used for handling small datasets, databases are mostly used for storing huge transactional data for later use. They run on a server and often at the backend of any user (client) interface such as websites and mobile applications. These applications communicate with database via processing servers (e.g. <a href="http://flask.pocoo.org/">Flask</a> and <a href="https://www.djangoproject.com/">Django</a>). The figure below illustrates the request and response communcations between client and servers.
<img src="http://drive.google.com/uc?export=view&id=1cedn62AXe6LS-jxCjXBxCYmL1iDFRlYQ">
As mentioned earlier, databases are meant to store data for <i>later use</i> --- in the sense that we can use it as a response to client's requests, such as viewing or data extraction for insights. In this article, we are interested in data extraction from the database. In particular, the objective is to illustrate how to send request to MySQL server, and how to process response both from Julia and Python.
### MySQL Server Setup
To start with, we need to setup MySQL server in our machine. Click the following link to download and install the application.

* <a href="https://docs.google.com/document/d/1B3ol7-Hte08mqzB5J8dBn1wFlpkxZ1Lgb2W7OUpIu60/edit?usp=sharing">MySQL Server Download and Installation on macOS</a>
* <a href="https://docs.google.com/document/d/1GaZ5dPOH9o5rQPmxFWjGS4ZmUjEEeDM497UdXwcEgco/edit?usp=sharing">MySQL Server Download and Installation on Windows</a>

Note that I recommend you to download the latest version of MySQL since the setup above is using the old version.
### Query: Creating Database
In order to appreciate what we are aiming in this article, we need to go through some basic SQL queries to understand what type of request to send to MySQL server. I'm using macOS, but the following should work on Windows as well. For macOS users, open the MySQL Server Shell by running <code>mysql -u root -p</code> (hit <kbd>return</kbd> or <kbd>enter</kbd> , and type in your MySQL root password you specified during the installation setup from the previous section) in the terminal. For windows, try to look for it in the Start Menu.
<!-- <img src="http://drive.google.com/uc?export=view&id=1wRuD_gG4tJpp1ZKj3jCbwbzWAtERSjsn" style="margin: -4px auto -30px auto;"> -->
<img src="http://drive.google.com/uc?export=view&id=1hcAnM6KYuASiBhu5AzHqZpf2P1EBneYb" style="margin: -4px auto -30px auto;">
<!-- https://drive.google.com/file/d/1hcAnM6KYuASiBhu5AzHqZpf2P1EBneYb/view?usp=sharing -->
From here, we are going to check the available databases in MySQL server. To do this, run the following:
<script src="https://gist.github.com/alstat/1dbad1187130a31091aead6145dc0151.js"></script>
Indeed, there are four out-of-the-box defined databases already, and we don't want to touch that. Instead, we going to create our own database, let's call it <code>tutorial</code>. To do this, run the following codes:
<script src="https://gist.github.com/alstat/3d62031b3a0f2f2236568ffe0b9ec189.js"></script>
The best thing about SQL syntax is that, everything is self-explanatory, except maybe for line 19, which simply confirmed that we are using <code>tutorial</code> as our database.
### Query: Creating Table
Next is to create a table for our database, we are going to use the <a href="https://halalanresults.abs-cbn.com/">2019 Philippine Election results</a> with columns: Last Name, First Name, Party, Votes. Further, for purpose of illustration, we are going to use the top 5 senators only.
<script src="https://gist.github.com/alstat/79d2c2c420a781d14834ef2307413045.js"></script>
### Query: Inserting Values
The following codes will insert the top five senators from the 2019 Philippine election results.
<script src="https://gist.github.com/alstat/771051ecfca7075229a965e5861353f8.js"></script>
### Query: Show Data
To view the encoded data, we simply select all (<code>*</code>) the columns from the table.
<script src="https://gist.github.com/alstat/dd620c5151a14261d8095d614d80b81a.js"></script>
## MySQL Clients on Julia and Python
In this section, we are going to interface with MySQL server on Julia and Python. This is possible using <a href="https://github.com/JuliaDatabases/MySQL.jl">MySQL.jl</a> and <a href="https://pymysql.readthedocs.io/en/latest/index.html">PyMySQL</a> libraries. To start with, install the necessary libraries as follows:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-1', 'tabcontent-1')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-1', 'tabcontent-1')">Python</button>
</div>

<div id="julia-062819-1" class="tabcontent-1 first">
  <script src="https://gist.github.com/alstat/844cee7187081181baea0aeb13efafa7.js"></script>
</div>

<div id="python-062819-1" class="tabcontent-1" style="display: none;">
  <script src="https://gist.github.com/alstat/f38f27e23bc74549930bd439af5075f9.js"></script>
</div>
For this exercise, our goal is to save the NYC Flights data into the database and query it from Julia and Python.

### Downloading NYC Flights Data
I have a copy of the dataset on Github, and so the following code will download the said data:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-2', 'tabcontent-2')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-2', 'tabcontent-2')">Python</button>
</div>

<div id="julia-062819-2" class="tabcontent-2 first">
  <script src="https://gist.github.com/alstat/c0cf42053baa058cb3336867d9040d1d.js"></script>
</div>

<div id="python-062819-2" class="tabcontent-2" style="display: none;">
  <script src="https://gist.github.com/alstat/47d181a0efd1a63b829eded83cfe7402.js"></script>
</div>

### Connect to MySQL Server
In order for the client to send request to MySQL server, the user/client needs to connect to it using the credentials set in the installation.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-3', 'tabcontent-3')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-3', 'tabcontent-3')">Python</button>
</div>

<div id="julia-062819-3" class="tabcontent-3 first">
  <script src="https://gist.github.com/alstat/ef8e9274a0abf17055fa1cd35e343b02.js"></script>
</div>

<div id="python-062819-3" class="tabcontent-3" style="display: none;">
  <script src="https://gist.github.com/alstat/e7b04fe16d4ae8f324ba2eab2fe3a47e.js"></script>
</div>
Note that you need to have a strong password, and this configuration should not be exposed to the public. The above snippets are meant for illustration.
### First Request
To test the connection, let's send our first request --- to show the tables in the database:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-4', 'tabcontent-4')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-4', 'tabcontent-4')">Python</button>
</div>

<div id="julia-062819-4" class="tabcontent-4 first">
  <script src="https://gist.github.com/alstat/ab4d2403017c7b0a2e57e87590b202ad.js"></script>
</div>

<div id="python-062819-4" class="tabcontent-4" style="display: none;">
  <script src="https://gist.github.com/alstat/84b1c60e618d93b00ab2294c13438c35.js"></script>
</div>
In Julia, the response is recieved as a MySQL.Query object and can be viewed using DataFrame. For Python, however, you will get a tuple object.
### Create NYC Flights Table
At this point, we can now create the table for our dataset. To do this, run the following:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-5', 'tabcontent-5')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-5', 'tabcontent-5')">Python</button>
</div>

<div id="julia-062819-5" class="tabcontent-5 first">
  <script src="https://gist.github.com/alstat/edd6aff9b0d5fc9a45b808b36a2d3f95.js"></script>
</div>

<div id="python-062819-5" class="tabcontent-5" style="display: none;">
  <script src="https://gist.github.com/alstat/890fe4cdc2e50f694a749448594cb248.js"></script>
</div>
As shown in the previous section, sending request to the server both in Julia and in Python is done by simply using a string of SQL queries as input to MySQL.jl and PyMySQL APIs. Hence, the <code>query</code> object (referring to the Julia code) in line 3 above, simply automates the concatenation of SQL query for creating a table. Having said, you can of course write the query manually. To check if we have indeed created the table, run the following codes:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-6', 'tabcontent-6')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-6', 'tabcontent-6')">Python</button>
</div>

<div id="julia-062819-6" class="tabcontent-6 first">
  <script src="https://gist.github.com/alstat/3694845948496741bd3256729a1d8469.js"></script>
</div>

<div id="python-062819-6" class="tabcontent-6" style="display: none;">
  <script src="https://gist.github.com/alstat/789b5aae723486aee01b6c018e61c60a.js"></script>
</div>
As you can see, we've created it already, but with no entry yet.
### Populating the Table
Finally, we are going to populate the table in the database by inserting the values row by row.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-7', 'tabcontent-7')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-7', 'tabcontent-7')">Python</button>
</div>

<div id="julia-062819-7" class="tabcontent-7 first">
  <script src="https://gist.github.com/alstat/c8ee6c05a99d9cd0f4270dd8a8beb984.js"></script>
</div>

<div id="python-062819-7" class="tabcontent-7" style="display: none;">
  <script src="https://gist.github.com/alstat/2f22ad0b1dd5f3ed39f360d2244c32f7.js"></script>
</div>
Notice from the above Julia code, the result of the <code>stmt</code> is an SQL <code>INSERT</code> query with placeholder values indicated by <code>?</code>. The timed (<code>@time</code> in Julia code) loop in line 9 above maps the values of the vector, one-to-one, to the elements (<code>?</code>) of the tuple in <code>stmt</code>. One major difference between these libraries is that, PyMySQL will not populate the table even after executing all sorts of SQL queries unless you commit it (<code>con.commit</code>), as shown above. This is contrary to MySQL.jl which automatically commits every execution of the SQL queries. I do like the idea of having <code>con.commit</code> in PyMySQL, since this avoids accidental deletion or modification in the database, thus adding a layer of security. To check if we have indeed populated the table, run the following:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-062819-8', 'tabcontent-8')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-062819-8', 'tabcontent-8')">Python</button>
</div>

<div id="julia-062819-8" class="tabcontent-8 first">
  <script src="https://gist.github.com/alstat/40c790d0216614cdcbf41de31dfa4e1a.js"></script>
</div>

<div id="python-062819-8" class="tabcontent-8" style="display: none;">
  <script src="https://gist.github.com/alstat/09cf619f91773599b9902ba77fde7d76.js"></script>
</div>
To disconnect from the server, run <code>MySQL.disconnect(con)</code> (Julia) or <code>con.close()</code> (Python).
### Benchmark
For the benchmark, I added a timelapse recorder in populating and reading the table in the previous section. The figure below summarizes the results.
<img src="http://drive.google.com/uc?export=view&id=1fhMJg3qIPupf3xhvyCW1p5Ph7tzn7UAH">
The figure was plotted using <a href="http://gadflyjl.org/stable/index.html">Gadfly.jl</a>. Install this package using <code>Pkg</code> as described above (see the first code block under <i>MySQL Clients on Julia and Python</i> section), along with <a href="https://github.com/JuliaGraphics/Cairo.jl">Cario.jl</a> and <a href="https://github.com/JuliaGraphics/Fontconfig.jl">Fontconfig.jl</a>. The latter two packages are used to save the plot in PNG format. See the code below to reproduce:
<script src="https://gist.github.com/alstat/370b6b9eb33089f52c3f2f721e10e5d2.js"></script>
### Conclusion
The aim of this article was simply to illustrate the usage of MySQL.jl APIs in comparison to the PyMySQL. Hence, I would say both libraries have similarities in APIs (as expected) and are stable for the tasks. I should emphasize though that, I do like the <code>con.commit</code> of PyMySQL since this adds a level of security, and I think this is a good addition to MySQL.jl in the future.

### Complete Codes
If you are impatient, here are the complete codes excluding the MySQL codes and the plots. These should work after installing the required libraries shown above:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-nn', 'tabcontent-nn')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-nn', 'tabcontent-nn')">Python</button>
</div>

<div id="julia-knet-060319-nn" class="tabcontent-nn first">
  <script src="https://gist.github.com/alstat/eda562ebbd22f3de61385ec79dad2373.js"></script>
</div>

<div id="python-060319-nn" class="tabcontent-nn" style="display: none;">
  <script src="https://gist.github.com/alstat/69d25cb0a6210b3e702fe582c2127ba4.js"></script>
</div>
### References and Resources
* MySQL.jl Github Repo: https://github.com/JuliaDatabases/MySQL.jl
* PyMySQL Github Repo: https://github.com/PyMySQL/PyMySQL
* Flaticon: https://www.flaticon.com/

### Software Versions
<script src="https://gist.github.com/alstat/65dab0d062ea0fd229b4aa23c18fcd21.js"></script>







