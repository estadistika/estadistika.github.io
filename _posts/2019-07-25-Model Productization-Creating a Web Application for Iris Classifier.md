---
layout: post
title:  "Model Productization: Crafting a Web Application for Iris Classifier"
date:   2019-7-25 12:00:00 +0800
categories: Julia Python Software-Engineering UI-UX Model-Deployment Productization
comments: true
author: Al-Ahmadgaid B. Asaad
tags: julia python software-engineering
---
Any successful data science project must end with productization. This is the stage where trained models are deployed as application that can be easily accessed by the end users. The application can either be part of already existing system, or it could also be a standalone application working in the back-end of any interface. In any case, this part of the project deals mainly with software engineering --- a task that involves front-end programming.

In my previous article, we talked about data engineering by <a href="https://estadistika.github.io/julia/python/packages/relational-databases/2019/07/07/Interfacing-with-Relational-Database-using-MySQL.jl-and-PyMySQL.html">interfacing with relational database using MySQL.jl and PyMySQL</a>; and we've done <a href="https://estadistika.github.io/data/analyses/wrangling/julia/programming/packages/2018/06/08/Julia-Introduction-to-Data-Wrangling.html">data wrangling</a> as well. Moreover,  we also touched on modeling using <a href="https://estadistika.github.io/julia/python/packages/knet/flux/tensorflow/machine-learning/deep-learning/2019/06/20/Deep-Learning-Exploring-High-Level-APIs-of-Knet.jl-and-Flux.jl-in-comparison-to-Tensorflow-Keras.html">Multilayer Perceptron (MLP) for classifying the Iris species</a>. Hence, to cover the end-to-end spectrum of a typical data science project (excluding the business part), we're going to deploy our Iris model as a web application. 

There are of course several options for user-interface other than web, for example desktop and mobile front-ends; but I personally prefer web-based since you can access the application without having to install anything --- only the browser.
### Final Output
The final interface of our application is given below. The app is powered by a server on both ends, with two models (Julia and Python) running in the back-end. Try playing with the app to see how it works.
<p class="codepen" data-height="747" data-theme-id="dark" data-default-tab="result" data-user="alstat" data-slug-hash="YoMMOY" style="height: 550px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Tutorial">
  <span>See the Pen <a href="https://codepen.io/alstat/pen/YoMMOY/">
  Tutorial</a> by Al Asaad (<a href="https://codepen.io/alstat">@alstat</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
As indicated in the status pane of the application, the UI above is not powered by the back-end servers. That is, the prediction is not coming from the model, but rather randomly sampled from a set of possible values of Iris species, i.e. Setosa, Versicolor, and Virginica. The same case when estimating the model, the app simply mimics the model training. This is because I don't have a cloud server, so this only works in the local server in my machine. The application above, however, does send request to the server (localhost:8081 and port 8082, in this case), but if unaccessible, then it will randomly sample from the set of species when classifying; and randomly generates a test accuracy when training --- and this is why we still get prediction despite no communication to the back-end servers. In succeeding sections though, I will show you (via screencast) how the application works with the back-end servers.

### Project Source Codes
The complete codes for this article are available <a href="https://github.com/estadistika/projects/tree/master/2019-07-25-Iris-Web-App/model-deployment">here</a> as a Github repo, and I encourage you to have it in your machine if you want to follow the succeeding discussions. The repo has the following folder structure:
<script src="https://gist.github.com/alstat/1c5b9f777d05373f1be8801dc2bb100c.js"></script>
### Software Architecture
As mentioned earlier, the application is powered by back-end servers that are instances of Julia and Python. The communication between the user-interface (client) and the servers is done via HTTP (HyperText Transfer Protocol). The following is the architecture of our application:
<img src="http://drive.google.com/uc?export=view&id=1zRt5mOCgy5hY2F23QVHpFcvzA4TtCsIS">
As shown in the figure, the client side handles response asynchronously. That is, we can send multiple request without waiting for the response of the preceding request. On the other hand, the server side processes the request synchronously, that is, the request from the client are handled one-at-a-time. These networks work via <a href="https://github.com/JuliaWeb/HTTP.jl">HTTP.jl</a> for Julia, and <a href="https://palletsprojects.com/p/flask/">Flask</a> for Python. If you are interested in asynchronous back-end server, checkout Python's <a href="https://klein.readthedocs.io/en/latest/">Klein</a> library (Flask only works synchronously); and for Julia you can set HTTP.jl to work asynchronously. I should mention though that HTTP.jl is a bit lower in terms of API level compared to Flask. In fact, HTTP.jl is better compared to Python's <a href="https://2.python-requests.org/en/master/">Requests</a> library. For Flask counterpart, however, Julia offers <a href="https://github.com/GenieFramework/Genie.jl">Genie.jl</a> and I encourage you to check that out as well.

### HyperText Transfer Protocol (HTTP)
We've emphasized in the previous section that, the communication between the interface and the model is done via HTTP. In this section, we'll attempt to briefly cover the basics of this protocol. To do this, we'll setup a client and server instances both in Julia and in Python. This is done by first running the server in the Terminal/CMD, before running the client in a separate Terminal/CMD (follow the order, execute the server first before the client). Here are the codes:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-072019-1', 'tabcontent-1')">Julia (Client)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-072019-2', 'tabcontent-1')">Julia (Server)</button>
  <button class="tablinks" onclick="openCity(event, 'python-072019-1', 'tabcontent-1')">Python (Client)</button>
  <button class="tablinks" onclick="openCity(event, 'python-072019-2', 'tabcontent-1')">Python (Server)</button>
</div>

<div id="julia-072019-1" class="tabcontent-1 first">
  <script src="https://gist.github.com/alstat/efd32b484f5c3066db4aba073d7232e5.js"></script>
</div>

<div id="julia-072019-2" class="tabcontent-1" style="display: none;">
  <script src="https://gist.github.com/alstat/14ac41a9aa0e4f84636dfe0d225e40ab.js"></script>
</div>

<div id="python-072019-1" class="tabcontent-1" style="display: none;">
  <script src="https://gist.github.com/alstat/4a1b41e4ea3cf56dcbbd627245c079fd.js"></script>
</div>

<div id="python-072019-2" class="tabcontent-1" style="display: none;">
  <script src="https://gist.github.com/alstat/47b77733fb514036c1c7483ff4e2eb33.js"></script>
</div>
For your reference, here are the outputs of the above codes.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-072019-output-1', 'tabcontent-1-out')">Julia (Output)</button>
  <button class="tablinks" onclick="openCity(event, 'python-072019-output-1', 'tabcontent-1-out')">Python (Output)</button>
</div>
<div id="julia-072019-output-1" class="tabcontent-1-out first">
  <img id="julia-output" src="http://drive.google.com/uc?export=view&id=1gpJIaqpP7Y4dye0-2dtGLEglcjvcezG0" style="margin-top: 16px">
</div>
<div id="python-072019-output-1" class="tabcontent-1-out" style="display: none;">
  <img id="python-output" src="http://drive.google.com/uc?export=view&id=1vqYNskzKAJiZGfYTmh0gQoshjUI6F88h" style="margin-top: 16px">
</div>

As shown in the screenshots above, the codes were executed at the root folder of the project repo (see the Project Source Codes section for folder tree structure). The server we setup is running at localhost:8081 or 127.0.0.1:8081 --- waiting (or listening) for any incoming request from the client. Thus, when we ran the client codes, which send POST request with the data <code>{"Hello" : "World"}</code>, to localhost:8081, the server immediately responded back to the client --- throwing the data received. The header specified in the response, <code>"Access-Control-Allow-Origin" => "*"</code>, simply tells the server to respond to any (<code>*</code>) client. For more details on HTTP, I think <a href="https://www.youtube.com/watch?v=eesqK59rhGA">this video</a> is useful.
### Server: Iris Classifier
At this point, you should have at least an idea of how HTTP works. To set this up in Julia and in Python, here are the codes for the REST API:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-072019-3', 'tabcontent-2')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-072019-3', 'tabcontent-2')">Python</button>
</div>

<div id="julia-072019-3" class="tabcontent-2 first">
  <script src="https://gist.github.com/alstat/0b6a33e478979665e9adf10c17969f92.js"></script>
</div>

<div id="python-072019-3" class="tabcontent-2" style="display: none;">
  <script src="https://gist.github.com/alstat/d1099efc4d6071488b16f5dbf17bcaee.js"></script>
</div>
The requests are received at line 38 of the Julia code, and are handled depending on the target URL. If the target URL of the client's request is <code>/classify</code>, then the <code>classifier</code> router will handle the request via the <code>classify</code> function defined in line 7. The same case when we receive training request, the <code>train</code> function defined in line 19 will handle the request. Each of these functions then returns a response back to the client with the data. On the other hand, we see that Python's Flask library uses a decorator for specifying the router, with two main helper functions defined in line 32 and 37. The two approaches are indeed easy to follow, despite the difference in implementation. I should emphasize though that the above codes refer to other files to perform the training and classification. These files include <i>model-training.jl</i> and <i>model_training.py</i>, etc. I will leave these to the reader to explore the scripts in the project repo.
### Client: Web Interface
Now that we have an idea of how the request in the servers are processed, in this section, we need to understand how the client prepares and sends requests to the server, and how it processes the response. In the CodePen embedded above, the client codes are in the JS (Javascript) tab. The following is a copy of it:
<script src="https://gist.github.com/alstat/b53164002475b06c559a0b9cc1177365.js"></script>
Lines 23-28 define the event listener for the buttons in the application. Line 24, for example, adds functionality to the <kbd>Classify</kbd> button, which is defined in line 44. This is a void function, but it sends HTTP request in line 79 to the specified url defined in lines 63-67. The <code>httpRequest</code> function in line 5, is the one that handles the communication with the servers. It takes three arguments, the <code>URL</code> (the address of the server), the <code>data</code> (the request data to be sent to the server), and the <code>callback</code> (the function that will handle the response from the server). The request as mentioned is handled asynchronously, and is specified by the third argument --- <code>true</code> (asynchronous) --- of the <code>xhr.open</code> method defined in line 8. The rest of the codes are functions defining the functionalities of the buttons, status pane, output display, etc. of the app.

### HTML/CSS
The other codes that are part of the application are the HTML and CSS files. I will leave these to the reader, since these codes are simply declarations of how the layout and style of the app should look like.

### Screencast
The following video shows how the application works with the back-end servers running.
<!-- <iframe width="100%" height="400px" src="https://www.youtube.com/watch?v=jxM_U9USkv4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> -->
<iframe width="100%" height="400px" src="https://www.youtube.com/embed/jxM_U9USkv4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
### Conclusion
The aim of this exercise is to demonstrate the capability of Julia in production, and one of my concern was precompilations. Specifically, if these occur for every client's request. Fortunately, these only happen at the first request, the succeeding ones are guaranteed to be fast. Having said, just as the stability of Python for production, I think Julia is already stable as a back-end language for creating a fully featured web application, and is therefore capable enough for an end-to-end project.

### Software Versions
<script src="https://gist.github.com/alstat/65dab0d062ea0fd229b4aa23c18fcd21.js"></script>

