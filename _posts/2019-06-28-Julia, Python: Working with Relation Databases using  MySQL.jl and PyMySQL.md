---
layout: post
title:  "Interfacing with Relational Databases using MySQL.jl and PyMySQL"
date:   2019-06-28 12:00:00 +0800
categories: Julia Python Packages Relational-Databases
comments: true
author: Al-Ahmadgaid B. Asaad
tag: julia python
---
Prior to the advent of computing, relational database can be thought of log books typically used for inventory and visitor's time-in time-out. These books contain rows that define the item/transaction, and columns describing the features of each row. Indeed, these are the core attributes of any relational database. Unlike spreadsheets, which are used for handling small datasets, databases are mostly used for storing huge transactional data for later use. They run on a server and often at the backend of any user (client) interface such as websites and mobile applications. These applications communicate with database via processing servers. The figure below illustrates the request and response communcations between client and servers.
<img src="http://drive.google.com/uc?export=view&id=1cedn62AXe6LS-jxCjXBxCYmL1iDFRlYQ">
As mentioned earlier, databases are meant to store data for <i>later use</i> --- in the sense that we can use it as a response to client's requests, such as viewing or data extraction for insights. In this article, we are interested in data extraction from the database. In particular, the objective is to illustrate how to send request to MySQL server both from Julia and Python.
### MySQL Server Setup
To start with, we need to setup MySQL server in our machine. Click the following link to download and install the application.

* <a href="https://docs.google.com/document/d/1B3ol7-Hte08mqzB5J8dBn1wFlpkxZ1Lgb2W7OUpIu60/edit?usp=sharing">MySQL Server Download and Installation on macOS</a>
* <a href="https://docs.google.com/document/d/1GaZ5dPOH9o5rQPmxFWjGS4ZmUjEEeDM497UdXwcEgco/edit?usp=sharing">MySQL Server Download and Installation on Windows</a>

Note that I recommend you to download the latest version of MySQL since the setup above is using the old version.
### Query: Creating Database
In order to appreciate what we are aiming in this article, we need to go through some basic SQL queries, to understand what type of request to send to MySQL server. I'm using macOS, but the following should work on windows as well. For macOS user, open the MySQL Server Shell by running <code>mysql -u root -p</code> (hit Enter, and type in your MySQL root password you specified during the installation setup from the previous section) in the terminal. For windows, try to look for it in the Start Menu.
<img src="http://drive.google.com/uc?export=view&id=1wRuD_gG4tJpp1ZKj3jCbwbzWAtERSjsn" style="margin: -4px auto -30px auto;">
From here, we are going to check the available databases in MySQL server. To do this, run the following:
<script src="https://gist.github.com/alstat/1dbad1187130a31091aead6145dc0151.js"></script>
Indeed, there are four out-of-the-box defined databases already, and we don't want to touch that. Instead, we going to create our own database, let's call it <code>tutorial</code>. To do this, run the following codes:
<script src="https://gist.github.com/alstat/3d62031b3a0f2f2236568ffe0b9ec189.js"></script>
The best thing about SQL syntax is that, everything is self-explanatory, except maybe for line 19, which simply confirmed that we are using <code>tutorial</code> as our database.
### Query: Creating Table
Next is to create a table for our database, we are going to use the <a href="https://halalanresults.abs-cbn.com/">2019 Philippine Senatorial Election results</a> with columns: Last Name, First Name, Party, Votes. Further, for purpose of illustration, we are going to use the top 5 only.
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
In order for the client to send request to the MySQL server, it needs to connect to it using the credentials set in the installation.
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
Note that you need to have a strong password, and this configuration should not be exposed to the public, but we are doing it here for purpose of illustration.
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
You can manually write the SQL query to create the table, or automate it like what we have above. To check if we have indeed created the table, run the following codes:
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
As you can see, we've created it with no entry yet.
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
Notice from the above code, the result of the <code>stmt</code> is an SQL <code>INSERT</code> query with placeholder values indicated by <code>?</code>. The timed (<code>@time</code> in Julia code) loop in line 8 above pushes the values in vector into the SQL statement <code>stmt</code>, by mapping one-to-one the values of the vector into the tuples of <code>?</code> in <code>stmt</code>. To check if we have indeed populated the table, run the following:
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

### Benchmark
For the benchmark, I recorded the time interval of populating the table by sending request to the MySQL server. I also recorded the reading time of the server response on the populated table. The figure below, summarizes the results.
<img src="http://drive.google.com/uc?export=view&id=1fhMJg3qIPupf3xhvyCW1p5Ph7tzn7UAH">
### Conclusion
In conclusion, I would say MySQL.jl is a stable Julia library for interfacing with MySQL database. While both libraries are not directly comparable in terms of the language.
### Software Versions
<script src="https://gist.github.com/alstat/65dab0d062ea0fd229b4aa23c18fcd21.js"></script>





