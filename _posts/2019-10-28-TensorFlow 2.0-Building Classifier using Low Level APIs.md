---
layout: post
title:  "TensorFlow 2.0: Building Simple Classifier using Low Level APIs"
date:   2019-10-28 12:00:00 +0800
categories: Python TensorFlow
comments: true
author: Al-Ahmadgaid B. Asaad
tags: julia python software-engineering
---
At the end of my comparison --- <a href="https://estadistika.github.io/julia/python/packages/knet/flux/tensorflow/machine-learning/deep-learning/2019/06/20/Deep-Learning-Exploring-High-Level-APIs-of-Knet.jl-and-Flux.jl-in-comparison-to-Tensorflow-Keras.html">TensorFlow 1.14 Keras' API versus Julia's Flux.jl and Knet.jl high level APIs</a> --- I indicated some future write-ups I plan to do, one of which is to compare (obviously) on the low level APIs. However, with the release of the much anticipated TensorFlow 2.0, I decided not to wait for the next comparison and instead dedicate a separate article for the said release. The goal of this blog post then is to simply replicate the modeling in my <a href="https://estadistika.github.io/julia/python/packages/knet/flux/tensorflow/machine-learning/deep-learning/2019/06/20/Deep-Learning-Exploring-High-Level-APIs-of-Knet.jl-and-Flux.jl-in-comparison-to-Tensorflow-Keras.html">previous article</a>, without using the Keras API. Specifically, I'll discuss the steps on constructing a custom layer, how we can chain multiple layers as in Keras' <code>Sequential</code>, do a feedforward, a backward by updating the gradient, and batching the training datasets. 

### Load the Libraries
To start with, load the necessary libraries by running the following codes:
<script src="https://gist.github.com/alstat/6ca5094612c2031fa80a6ca42fac34b7.js"></script>
I should emphasize that Line 7 is optional, and I'm using this for annotation purposes on function parameters.

### Define the Constants
The following are the constants that we will be using on the specification of the succeeding codes:
<script src="https://gist.github.com/alstat/454aa49e0ccf7d3ca86d65c35a1002c7.js"></script>
As you notice, these are the hyperparameters that we configured for the model below. Specifically, we use ReLU (<code>tf.nn.relu</code>) as the activation for the first hidden layer and a softmax (<code>tf.nn.softmax</code>) for the output layer. Other parameters include batch-size, the number of epochs, and of course the optimizer which in this case is set to Adam (<code>tf.keras.optimizers.Adam</code>). Feel free to change the items, for example, you can explore on the different optimizers, or on the activation functions. 

### Load the Data
The Iris dataset is available in Python's <a href="https://scikit-learn.org/">Scikit-Learn</a> and can be loaded as follows:
<script src="https://gist.github.com/alstat/80e748cd186d94d51736348d607efc03.js"></script>
<code>xdat</code> and <code>ydat</code> are both <code>np.ndarray</code> objects, and we are going to partition these into training and testing datasets using the <code>Data</code> class defined in the next section.

### Define the Data Class
To organize the data processing, below is the class with methods on partitioning, tensorizing, and batching the input data:
<script src="https://gist.github.com/alstat/e24d40807d6816b92076c300b57a4bce.js"></script>

### Data Cleaning/Processing
We are going to apply then the above class to the iris dataset, as shown below:
<script src="https://gist.github.com/alstat/0284a46ed09b92bcf19de4e5cee527d2.js"></script>

<!-- The unit that TensorFlow crunches during computation is of type <code>tf.Tensor</code>. Thus, we need to convert the <code>np.ndarray</code> to <code>tf.Tensor</code> objects, as in Lines 2-5 above. -->

### Defining the Dense Layer
The model as mentioned in my <a href="https://estadistika.github.io/julia/python/packages/knet/flux/tensorflow/machine-learning/deep-learning/2019/06/20/Deep-Learning-Exploring-High-Level-APIs-of-Knet.jl-and-Flux.jl-in-comparison-to-Tensorflow-Keras.html">previous article</a> is a MultiLayer Perceptron (MLP) with one hidden layer, please refer to the said article for more details. In order to use the low level APIs, we need to define the <code>Dense</code> layer from scratch. As a guide, below is the mathematical formulation of the said layer:
\begin{equation}
\mathbf{y} = \sigma\left\(\mathbf{x}\cdot\mathbf{W} +  \mathbf{b}\right\),
\end{equation}
where $\sigma$ is the activation function, which can either be ReLU, sigmoid, etc. Now in order for the above dot product to work, $\mathbf{x}$ must be a row-vector, i.e.:
\begin{equation}
\mathbf{x} = \left\[
  x_1,x_2,\cdots,x_n 
\right\]
\end{equation}
where $n$ is the number of features. Thus, $\mathbf{W}$ is a $n\times j$-matrix, with $n$ as the dimension of the input layer and  $j$ as the dimension of the next layer (it could be hidden or output). With regards to the weights matrix and the bias vector, we need to initialize them to some random starting values. There are several ways to do this, one of which is to use samples from the standard Gaussian distribution, i.e. 

$$
\begin{align}
\mathbf{W} = [(w_{ij})]\quad &\textrm{and}\quad \mathbf{b} = [(b_i)],\nonumber\\
w_{ij}, b_i \sim \mathcal{N}(0,1), \;i = &\{1,\cdots,m\}, \;j=\{1,\cdots,n\}\nonumber
\end{align}
$$

Translating all these into codes, we have the following:
<script src="https://gist.github.com/alstat/6b743375c1b3b5a468de559f77408aa7.js"></script>
Lines 3-6 initialize the <code>Dense</code> layer by assigning the starting values to the weights, and Lines 8-12 define the feedforward. I should emphasize that, prior to TensorFlow 2.0, <code>tf.random.normal</code> was defined as <code>tf.random_normal</code>. 

If there is something special in the above code, it's the <code>tf.Variable</code>. This class tells TensorFlow which object are learnable during gradient optimization. We can now use this layer to perform feedforward computation as follows:
<script src="https://gist.github.com/alstat/7ade32577acd6c5f22007eaa6e3ac894.js"></script>
The above code uses the first and the first five rows, respectively, of <code>xtrn</code> as input. Of course, these values may change since we didn't specify any seed for the initial values of weights and biases.

### Defining the Chain
Now that we know how to initialize a single <code>Dense</code> layer, we need to extend it to multiple layers to come up with a MLP architecture. Hence, what we need to have now is a <code>Chain</code> for layers. In short, we need to replicate (not all attributes and methods) the Keras' <code>Sequential</code>, and this is done as follows:
<script src="https://gist.github.com/alstat/832bf930c99beeae550c93c3d8fbb0e8.js"></script>
Let me walk you through, method-by-method. To initialize this class, we need to have a list of <code>Dense</code> layers (referring to <code>self.layers</code> at Line 4 above) as input. Once we have that, we can do feedforward computation using the untrained weights by simply calling the object (as defined by <code>__call__</code>). 

To train the weights, we need to call the <code>backward</code> method, which does backpropagation. This is done by <code>optimize</code>-ing the weights, via the <code>grad</code>ient computed from the <code>loss</code> of the model. In TensorFlow 2.0, it is recommended to use the Keras optimizers (<code>keras.optimizers</code>) instead of the <code>tf.train.GradientDescentOptimizer</code>. One thing to note as well, is the loss function which is a <code>.categorical_crossentropy</code> as opposed to <code>.sparse_categorical_crossentropy</code> which is used in my <a href="https://estadistika.github.io/julia/python/packages/knet/flux/tensorflow/machine-learning/deep-learning/2019/06/20/Deep-Learning-Exploring-High-Level-APIs-of-Knet.jl-and-Flux.jl-in-comparison-to-Tensorflow-Keras.html">previous article</a>. This is because the target variable we have here is encoded as one-hot vector (you can confirm this under the <code>to_tensor</code> method of the <code>Data</code> class above), and thus <i>cross entropy</i> is used as opposed to integer encoding from my previous article, in which case <i>sparse cross entropy</i> is more appropriate. 

Moreover, I think Lines 33-34 are self-explanatory and should redirect us to the <code>grad</code> function where we find the <code>tf.GradientTape</code>, which is not obvious as to what exactly it does at first glance, apart from the high level understanding that it has something to do with the gradient computation (or it could really be the main moving part). Well, from the name itself, we can think of it as a "Tape Recorder", which records the gradient of the trainable variables (referring to <code>tf.Variable</code> in Lines 4-5 of the <code>Dense</code> layer) with respect to the loss of the model. That is, when we do forward operation (referring to <code>self(inputs)</code> at Line 29 above), TensorFlow automatically differentiate the loss with respect to the parameters. In order then to update the weights under the Adam (referring to <code>opt</code> in Line 34 above) algorithm, we need to have these gradients at the given iteration. Thus we have a recorder (<code>tf.GradientTape</code> in this case), meant to extract the recorded gradients.

Finally, we chain the layers as follows:
<script src="https://gist.github.com/alstat/94cbf6f01918a7d19d370cbc7b4cc83b.js"></script>
This in effect extends the previous model (referring to <code>layer</code> object above) into chains of two layers, and we can call it as follows:
<script src="https://gist.github.com/alstat/f71a1f966ede34a473ee4308ca6a0dc6.js"></script>
The output above is the prediction of the model using the untrained weights.

### Training
At this point, we can now optimize the parameters. This is done by calling the <code>backward</code> method; and because we are building this from scratch, we can customize our training procedure. To proceed, we will be needing the following for training metrics:
<script src="https://gist.github.com/alstat/757b6796c9cd62c9b6bbadec179c254f.js"></script>
Finally, here's the code for training the model:
<script src="https://gist.github.com/alstat/6e515094992afecb508bfd3ec5e0d7bf.js"></script>
So we have three loops, two of which are inner-loops for the minibatches on both training and testing datasets; and needless to say, the minibatches used in the testing dataset above are not really necessary, since we can have a single batch for validation. However, we them for purpose of comparing the performance of the optimization algorithm on both single batch and three minibatches. The following will save the statistics we obtained from model training, and we will use these to generate the following plots: loss and accuracy.
<script src="https://gist.github.com/alstat/35a1f774a548e60198e9773c79edca6a.js"></script>
The following figure is the loss of the model across 500 epochs.
<img src="http://drive.google.com/uc?export=view&id=1PPMJVt2RPtj7OYnTlPGbpOqS9ffzv89O">
The corresponding accuracy is depicted in the following figure:
<img src="http://drive.google.com/uc?export=view&id=1ROu_mLT7t2D4RFj79YF17g9b-GXXIQAM">
To reproduce the above plots, check out the codes <a href="https://gist.github.com/alstat/a2f7f2725a2456ddfe86b83f9e6c1df6">here</a>. The fact that we have only 105 observations in our training dataset, suggests that we don't really need to do minibatches, since that is so small to have an effect on the speed of doing batch gradient descent. This is of course evident in the accuracy of the model, wherein the gradient vector got into the local minima before the 250 epoch, and then attempted to jump out of that, but still end up on another local minima (or it could be the same local minima earlier). Obviously, this is due to the fact that we limited the optimization algorithm on a few small-sized minibatches, which aren't helpful enough for the algorithm to explore the error surface function. Anyways, the goal of this blog post is just to give you an idea of how training is done in low-level APIs regardless of the number of observations.

### End Note
In this article, I've shown you how to do modeling in TensorFlow using the low-level APIs as promised from the <a href="https://estadistika.github.io/julia/python/packages/knet/flux/tensorflow/machine-learning/deep-learning/2019/06/20/Deep-Learning-Exploring-High-Level-APIs-of-Knet.jl-and-Flux.jl-in-comparison-to-Tensorflow-Keras.html">previous article</a>; and as an end note, I want to emphasize two key points on the importance of using low-level APIs. The first one is the ability to have full control on your model, which is useful especially for special problems where you need to create custom models, loss, and even the optimization algorithms itself. The second point, is the understanding of how everything works. 

### Next Steps
In my next article, we will try out modeling image datasets using low-level APIs. Of course, we will still have a comparison with the Julia's deep learning framework.

### Complete Codes
If you are impatient, here is the complete code excluding the plots. These should work after installing the required libraries used above:
<script src="https://gist.github.com/alstat/8e5af440bc199b8ee8dfc53056c848ec.js"></script>
### References

### Software Versions
<script src="https://gist.github.com/alstat/662ddb50fbe5c61bbebd6dbb6bf21e20.js"></script>

