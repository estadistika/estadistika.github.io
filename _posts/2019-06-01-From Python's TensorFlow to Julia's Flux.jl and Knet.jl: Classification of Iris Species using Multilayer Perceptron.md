---
layout: post
title:  "From Python's TensorFlow to Julia's Flux.jl and Knet.jl: Classification of Iris Species using Multilayer Perceptron"
date:   2019-6-15 12:00:00 +0800
categories: Julia Python Packages Knet Flux TensorFlow Machine-Learning Deep-Learning
comments: true
author: Al-Ahmadgaid B. Asaad
tag: julia python
---
When it comes to complex modeling, specifically in the field of deep learning, the go-to tool for <a href="https://towardsdatascience.com/which-deep-learning-framework-is-growing-fastest-3f77f14aa318">most researchers</a> is the <a href="https://www.tensorflow.org/">Google's TensorFlow</a>. There are a number of good reason as to why, one of it is the fact that it provides both high and low level APIs that suit the needs of both beginners and advanced users, respectively. I have used it in some of my projects, and indeed, it was powerful enough for the task. This is also due to the fact that TensorFlow is one of the <a href="https://github.com/tensorflow/tensorflow/graphs/contributors">most actively</a> developed deep learning framework, with Bayesian inference or probabilistic reasoning as the recent extension (see <a href="https://www.tensorflow.org/probability/">TensorFlow Probability</a>, another extension is the <a href="https://www.tensorflow.org/js">TensorFlow.js</a>). While the library is written majority in C++ for optimization, the main API is served in Python for ease of use. This design, however, resulted in redundancy of the APIs, creating a "mini-language" within Python. For example, TensorFlow's <a href="https://www.tensorflow.org/api_docs/python/tf/while_loop"><code>while_loop</code></a>, as the name suggests, acts as another version of the Python's <a href="https://www.w3schools.com/python/python_while_loops.asp"><code>while</code></a> loop for <a href="https://www.tensorflow.org/guide/tensors">tensor</a> objects. Not only that, even <a href="https://www.tensorflow.org/api_docs/python/tf/cond">conditional operations</a> and huge collection of <a href="https://www.tensorflow.org/api_docs/python/tf/math/add">math operations</a> have APIs in TensorFlow as well, all these are meant for performance when working with low level APIs, such as building custom models, for <a href="https://www.tensorflow.org/guide/tensors">tensor</a> objects. Having said, I wish I don't have to explicitly write <code>tf.placeholder</code> or <code>tf.Variable</code> for variable declaration and assignment, respectively. I wish could simply use <code>+</code> instead of using <code>tf.add</code>, etc.; or use the native API for loops and conditional operations, and only use TensorFlow for parameter optimization on complex loss functions. In this article, we are going to explore the alternatives, in particular the deep learning libraries available in Julia.

As a language that leans towards numerical computation, it's no surprise that Julia offers a number of choices for doing deep learning modeling, here are the stable libraries:
<ol>
  <li>
    <a href="https://github.com/FluxML/Flux.jl">Flux.jl</a> - The Elegant Machine Learning Stack.
  </li>
  <li>
    <a href="https://github.com/denizyuret/Knet.jl">Knet.jl</a> - Koç University deep learning framework.
  </li>
  <li>
    <a href="https://github.com/alan-turing-institute/MLJ.jl">MLJ.jl</a> - Julia machine learning framework by Alan Turing Institute.
  </li>
  <li>
    <a href="https://github.com/apache/incubator-mxnet/tree/master/julia#mxnet">MXNet.jl</a> - Apache MXNet Julia package.
  </li>
  <li>
    <a href="https://github.com/malmaud/TensorFlow.jl">TensorFlow.jl</a> - A Julia wrapper for TensorFlow.
  </li>
</ol>
Other related packages are maintained in <a href="https://github.com/JuliaML">JuliaML</a>. For this article, we are going to focus on the usage of
Flux.jl and Knet.jl, and we are going to use the <a href="https://en.wikipedia.org/wiki/Iris_flower_data_set">Iris dataset</a> for classification task using <a href="https://en.wikipedia.org/wiki/Multilayer_perceptron">Multilayer Perceptron</a>. To start with, we need to install the following packages. I'm using Julia 1.1.0. and Python 3.7.3.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-060319-1', 'tabcontent-1')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-1', 'tabcontent-1')">Python</button>
</div>

<div id="julia-060319-1" class="tabcontent-1 first">
  <script src="https://gist.github.com/alstat/0f696956e8856bbd40c4364c8bd526b8.js"></script>
</div>

<div id="python-060319-1" class="tabcontent-1" style="display: none;">
  <script src="https://gist.github.com/alstat/980a3dd113dea6774a8ff9c9d4b65f2b.js"></script>
</div>

### Loading and Partitioning the Data
The Iris dataset is available in the <a href="https://github.com/JuliaStats/RDatasets.jl">RDatasets.jl</a> Julia package and in Python's <a href="https://scikit-learn.org/">Scikit-Learn</a>. The following codes load the libraries and the data itself.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-060319-2', 'tabcontent-2')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-2', 'tabcontent-2')">Python</button>
</div>

<div id="julia-060319-2" class="tabcontent-2 first">
  <script src="https://gist.github.com/alstat/3d7e763b9869d63883df89fb5ff0bf47.js"></script>
</div>

<div id="python-060319-2" class="tabcontent-2" style="display: none;">
  <script src="https://gist.github.com/alstat/9e763b0ddbe0e010da6191322b79a394.js"></script>
</div>
The random seed set above is meant for reproducibility as it will give us the same random initial values for model training. The <code>iris</code> variable in line 11 (referring to Julia code) contains the data, and is a data frame with 150 × 5 dimensions, where the columns are: Sepal Length, Sepal Width, Petal Length, and Petal Width. There are several ways to partition this data into training and testing datasets, one procedure is to do stratified sampling, with simple random sampling without replacement as the sampling selection within each stratum --- the species. The following codes define the function for partitioning the data with the mentioned sampling design:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-060319-3', 'tabcontent-3')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-3', 'tabcontent-3')">Python</button>
</div>

<div id="julia-060319-3" class="tabcontent-3 first">
  <script src="https://gist.github.com/alstat/f1441c844ef4a5f465b00f60aa11ec85.js"></script>
</div>

<div id="python-060319-3" class="tabcontent-3" style="display: none;">
  <script src="https://gist.github.com/alstat/ef9c6e6fdd78dd4931458e1c7a644644.js"></script>
</div>
Extract the training and testing datasets using the function above as follows:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-4', 'tabcontent-4')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-4', 'tabcontent-4')">Julia (Flux.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-4', 'tabcontent-4')">Python</button>
</div>

<div id="julia-knet-060319-4" class="tabcontent-4 first">
  <script src="https://gist.github.com/alstat/b49d14f563a43b2e2d25b1b70860539c.js"></script>
</div>

<div id="julia-flux-060319-4" class="tabcontent-4 first" style="display: none;">
  <script src="https://gist.github.com/alstat/54a248104146c7e94340510b0a1c26eb.js"></script>
</div>

<div id="python-060319-4" class="tabcontent-4" style="display: none;">
  <script src="https://gist.github.com/alstat/9c5c3549794b0918172205235137ad25.js"></script>
</div>
All three codes above extract <code>xtrn</code>, the training data (feature) matrix of size 105 × 4 (105 observations by 4 features) dimensions; <code>ytrn</code>, the corresponding training target variable with 105 × 1 dimension; <code>xtst</code>, the feature matrix for testing dataset with 45 × 4 dimensions; and <code>ytst</code>, the target variable with 45 × 1 dimension for testing dataset. Moreover, contrary to TensorFlow, Knet.jl and Flux.jl need further data preparation from the above partitions. In particular, Knet.jl takes minibatch object as input data for model training, while Flux.jl needs one-hot encoding for the target variables <code>ytrn</code> and <code>ytst</code>. Further, unlike Knet.jl which ships with minibatch function, Flux.jl gives the user the flexibility to create their own.

### Specify the Model
The model that we are going to use is a <a href="https://en.wikipedia.org/wiki/Multilayer_perceptron">Multilayer Perceptron</a> with the following architecture: 4 neurons for the input layer, 10 neurons for the hidden layer, and 3 neurons for the output layer.  The first two layers contain bias, and the neurons of the last two layers are activated with Rectified Linear Unit (ReLU) and softmax functions, respectively.  The diagram below illustrates the architecture described:
<img src="http://drive.google.com/uc?export=view&id=1oYnD8KZ1NQqbJccw8NYugj0kqihQZBJX">
<!-- https://drive.google.com/file/d/1jqASeBjmbSImp5hEoEZxHMizKUkSLyC8/view?usp=sharing -->
The codes below specifies the model:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-5', 'tabcontent-5')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-5', 'tabcontent-5')">Julia (Flux.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-5', 'tabcontent-5')">Python (TensorFlow)</button>
</div>

<div id="julia-knet-060319-5" class="tabcontent-5 first">
  <script src="https://gist.github.com/alstat/e5ebdd980786a552511ceafcc70905f5.js"></script>
</div>

<div id="julia-flux-060319-5" class="tabcontent-5 first" style="display: none;">
  <script src="https://gist.github.com/alstat/b84fe0bc6c5bfba22d903f1bc8b1f774.js"></script>
</div>

<div id="python-060319-5" class="tabcontent-5" style="display: none;">
  <script src="https://gist.github.com/alstat/b99baeaf255f8704e64a0ff9077e0283.js"></script>
</div>
Coming from TensorFlow, Flux.jl provides Keras-like API for model specification, with <code>Flux.Chain</code> as the counterpart for Keras' <code>Sequential</code>. In addition, since both Flux.jl and Knet.jl are 100% written in Julia, makes the source codes under the hood accessible to beginners. Thus, giving the user a full understanding of not just the code, but also the math. Check the screenshot below for the distribution of the file types in the Github repos of the three frameworks:
<img src="http://drive.google.com/uc?export=view&id=1hmWiYy6C01q_X8HGl5xDSjQClJz5H7Ym">
<img src="http://drive.google.com/uc?export=view&id=17VAf7wOT9Ej47OZQu9B6o4kOCCs4G_tw">
<img src="http://drive.google.com/uc?export=view&id=1ZJn6gKATLLGgnQlQFrOItbWljs_EOzn9">
From the above figure, it's clear that Flux.jl is 100% Julia. On the other hand, Knet.jl while not apparent is actually 100% Julia as well. The 41.4% of Jupyter Notebooks and other small percentages account for the tutorials, tests and examples and not the <a href="https://github.com/denizyuret/Knet.jl/tree/master/src">source codes</a>.
<!-- There are several -->
<!-- <img src="http://drive.google.com/uc?export=view&id=1HKlC04oVF_3ggraWE7qnMNvW-Atxc89N"> -->
<!-- https://drive.google.com/file/d/1HKlC04oVF_3ggraWE7qnMNvW-Atxc89N/view?usp=sharing -->
### Train the Model
Finally, train the model as follows for 100 epochs:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-6', 'tabcontent-6')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-6', 'tabcontent-6')">Julia (Flux.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-6', 'tabcontent-6')">Python (TensorFlow)</button>
</div>
<div id="julia-knet-060319-6" class="tabcontent-6 first">
  <script src="https://gist.github.com/alstat/e06a44c5d748f2e0d266f0882b623b2a.js"></script>
</div>

<div id="julia-flux-060319-6" class="tabcontent-6 first" style="display: none;">
  <script src="https://gist.github.com/alstat/c007ed68a89d4974419ad4ffcea2ff81.js"></script>
</div>

<div id="python-060319-6" class="tabcontent-6" style="display: none;">
  <script src="https://gist.github.com/alstat/82525c52d17b5a5b470c392598a99e58.js"></script>
</div>
The codes (referring to Julia codes) above save both loss and accuracy for every epoch into a data frame and then into a CSV file. These will be used for visualization. Moreover, unlike Flux.jl and Knet.jl which require minibatch preparation prior to training, TensorFlow specifies this on <code>fit</code> method as shown above. Further, it is also possible to train the model in Knet.jl using a single function without saving the metrics. This is done as follows:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-6-a', 'tabcontent-6-a')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-6-a', 'tabcontent-6-a')">Julia (Flux.jl)</button>
</div>
<div id="julia-knet-060319-6-a" class="tabcontent-6-a first">
  <script src="https://gist.github.com/alstat/cc3882f36e47ef8c289392626131af9d.js"></script>
</div>

<div id="julia-flux-060319-6-a" class="tabcontent-6-a first" style="display: none;">
  <script src="https://gist.github.com/alstat/5002d261a67eccebd174ad0ea43969e4.js"></script>
</div>
The Flux.jl code above simply illustrates the use of <code>Flux.@epochs</code> macro for looping instead of the <code>for</code> loop. The loss of the model for 100 epochs is visualized below across frameworks:
<img src="http://drive.google.com/uc?export=view&id=1x0UzScMtzKawcCVbc55PSMxEIktIB5zv">
The above figure was plotted using <a href="http://gadflyjl.org/stable/index.html">Gadfly.jl</a>. Install this package using <code>Pkg</code> as described in the first code block, along with <a href="https://github.com/JuliaGraphics/Cairo.jl">Cario.jl</a> and <a href="https://github.com/JuliaGraphics/Fontconfig.jl">Fontconfig.jl</a>. The latter two packages are used to save the plot in PNG format, see the code below to reproduce:
<script src="https://gist.github.com/alstat/f0d63cf8cd0b41125f9bc072e0fc451b.js"></script>
### Evaluate the Model
The output of the model ends with a vector of three neurons. The index or location of the neurons in this vector defines the corresponding integer encoding, with 1st index as setosa, 2nd as versicolor, and 3rd as virginica. Thus, the codes below take the argmax of the vector to get the integer encoding for evaluation.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-7', 'tabcontent-7')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-7', 'tabcontent-7')">Julia (Flux.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-7', 'tabcontent-7')">Python (TensorFlow)</button>
</div>

<div id="julia-knet-060319-7" class="tabcontent-7 first">
  <script src="https://gist.github.com/alstat/668465ba90240dc071a71c8132f07268.js"></script>
</div>

<div id="julia-flux-060319-7" class="tabcontent-7 first" style="display: none;">
  <script src="https://gist.github.com/alstat/59a20104dcdce45045e28a5d60ffd86d.js"></script>
</div>

<div id="python-060319-7" class="tabcontent-7" style="display: none;">
  <script src="https://gist.github.com/alstat/59d17503d149abbe4ec338b4190affec.js"></script>
</div>
The figure below shows the traces of the accuracy during training:
<img src="http://drive.google.com/uc?export=view&id=1dIfb3yj5_Dl2BXbBbZJaVtmAvFXJUhIy">
To reproduce the figure above, run the following codes (make sure to load Gadfly.jl and other related libraries mentioned earlier in generating the loss plots):
<script src="https://gist.github.com/alstat/9539e00aef208062b1c6b900efa6c258.js"></script>
### Benchmark
At this point, we are going to record the training time of each framework.
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-8', 'tabcontent-8')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-8', 'tabcontent-8')">Julia (Flux.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-8', 'tabcontent-8')">Python (TensorFlow)</button>
</div>

<div id="julia-knet-060319-8" class="tabcontent-8 first">
  <script src="https://gist.github.com/alstat/0381d47e59cc9dd401fc9fb1342f2374.js"></script>
</div>

<div id="julia-flux-060319-8" class="tabcontent-8 first" style="display: none;">
  <script src="https://gist.github.com/alstat/d738aeeaa2cddb62ee41478748d4446b.js"></script>
</div>

<div id="python-060319-8" class="tabcontent-8" style="display: none;">
  <script src="https://gist.github.com/alstat/cf2bf0fac9fe9e55051f524d353aaf97.js"></script>  
</div>
The benchmark was done by running the above code repeatedly for about 10 times for each framework, I then took the lowest timestamp out of the results. In addition, before running the code for each framework, I keep a fresh start of my machine.
<img src="http://drive.google.com/uc?export=view&id=11c1SF1-NEfF9wb6wqd9qO1PiW4iGS6Ne">
The code of the above figure is given below (make sure to load Gadfly.jl and other related libraries mentioned earlier in generating the loss plots):
<script src="https://gist.github.com/alstat/c1bc13ab6e772a4104b51d164f4e172d.js"></script>
### Conclusion
In conclusion, I would say Julia is worth investing even for deep learning as illustrated in this article. With regards to the frameworks, both Flux.jl and Knet.jl provide a clean API that feels 100% Julia. In fact, the <code>for</code> loop which I plainly added in model training just to save the accuracy and loss metrics did not compromise the speed (though Knet.jl is much faster without it). It saves me so much time since you don't have to spend thinking of how to better implement the code for optimal performance. Further, between the two Julia frameworks, I find Knet.jl to be <a href="https://www.youtube.com/watch?v=ijI0BLf-AH0">Julia + little-else</a>, as described by <a href="http://www.denizyuret.com/">Professor Deniz Yuret</a> (the main developer), since there's no special APIs for Dense, Chains, etc. you have to code it. Although this is also possible for Flux.jl, but Knet.jl don't have these out-of-the-box, it ships only with the nuts and bolts which serve as the low level APIs for doing deep learning, and I love that flexibility. Further, if you are interested on Bayesian deep learning, Flux.jl works well with <a href="https://turing.ml/">Turing.jl</a>, a good alternative for <a href="https://www.tensorflow.org/probability/">TensorFlow Probability</a>. For Neural Differential Equations, Flux.jl works well with <a href="https://github.com/JuliaDiffEq/DifferentialEquations.jl">DifferentialEquations.jl</a>, checkout <a href="https://julialang.org/blog/2019/01/fluxdiffeq">DiffEqFlux.jl</a>.
### Next Steps
What's missing from the above exercise is the use of GPU for model training, and that's what I plan for the next article. In addition, I would like to test these Julia libraries on real deep learning problems, such as computer vision and natural language processing (checkout the <a href="https://www.youtube.com/watch?v=21_wokgnNog">workshop</a> on this from JuliaCon 2018).
### Complete Codes
If you are impatient, here are the complete codes excluding the benchmarks and the plots. These should work after installing the required libraries shown above:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-knet-060319-n', 'tabcontent-n')">Julia (Knet.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'julia-flux-060319-n', 'tabcontent-n')">Julia (Flux.jl)</button>
  <button class="tablinks" onclick="openCity(event, 'python-060319-n', 'tabcontent-n')">Python (TensorFlow)</button>
</div>

<div id="julia-knet-060319-n" class="tabcontent-n first">
  <script src="https://gist.github.com/alstat/e51343935f90c972aa6dcf18b60aefe2.js"></script>
</div>

<div id="julia-flux-060319-n" class="tabcontent-n first" style="display: none;">
  <script src="https://gist.github.com/alstat/004cc6d457bd22fce99148d14f37dc32.js"></script>
</div>

<div id="python-060319-n" class="tabcontent-n" style="display: none;">
  <script src="https://gist.github.com/alstat/1bdf9cc7019ca0e5684c991fae4715ec.js"></script>
</div>


### References
* Yuret, Deniz (2016). <a href="https://pdfs.semanticscholar.org/28ee/845420b8ba275cf1d695fbf383cc21922fbd.pdf">Knet: beginning deep learning with 100 lines of Julia</a>. 30th Conference on Neural Information Processing Systems (NIPS 2016), Barcelona, Spain.
* Innes, Mike (2018). <a href="http://joss.theoj.org/papers/10.21105/joss.00602">Flux: Elegant machine learning with Julia</a>. Journal of Open Source Software, 3(25), 602, https://doi.org/10.21105/joss.00602
* Abadi, Martin et al (2016). <a href="https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf">TensorFlow: A system for large-scale machine learning</a>. 12th USENIX Symposium on Operating Systems Design and Implementation (OSDI 16). p265--283.

### Software Versions
<script src="https://gist.github.com/alstat/65dab0d062ea0fd229b4aa23c18fcd21.js"></script>

