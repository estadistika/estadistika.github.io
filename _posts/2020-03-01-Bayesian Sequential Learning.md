---
layout: post
title:  "Bayesian Sequential Learning"
date:   2020-03-01 12:00:00 +0800
categories: Bayesian Probability Modeling Inference Julia
comments: true
author: Al-Ahmadgaid B. Asaad
tags: julia python
---
In my previous <a href="https://estadistika.github.io/data/analyses/wrangling/julia/programming/packages/2018/10/14/Introduction-to-Bayesian-Linear-Regression.html" target="_blank">article</a>, I discussed how we can use Bayesian approach in estimating the parameters of the model. The process revolves around solving the following conditional probability, popularly known as the <i>Bayes' Theorem</i>:

$$\begin{equation}
	\mathbb{P}(\mathbf{w}|\mathbf{y})=\frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})},
\end{equation}$$

where $\mathbb{P}(\mathbf{w})$ is the *a priori* (prior distribution) for the objective parameters, $\mathbb{P}(\mathbf{y}\|\mathbf{w})$ is the *likelihood* or model evidence, and $\mathbb{P}(\mathbf{y})$ is the *normalizing constant* with the following form:

$$
\begin{equation}
\mathbb{P}(\mathbf{y})=\int_{\forall\mathbf{w}\in\mathscr{P}}\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})\operatorname{d}\mathbf{w},
\end{equation}
$$

where $\mathscr{P}$ is the parameter space. 

### Posterior Distribution
The details on the derivation of the *a posteriori* were also provided in the said article, but there were missing pieces, which I think is necessary for us to support our proposition, and thus we have the following result:
<div class="wrapper">
<div class="title-label" style="background-color: #5e5e5e; color: #fff; padding: 2px 10px; font-family: 'Saira Condensed', sans-serif;"><b>Proposition</b></div>
<div class="proposition" style="padding: 10px; background-color: #efefef; font-family: 'Amita', cursive; text-align: left !important;">
Let $\mathscr{D}\triangleq\{(\mathbf{x}_1,y_1),\cdots,(\mathbf{x}_n,y_n)\}$ be the set of data points s.t. $\mathbf{x}\in\mathbb{R}^{p}$. If 
$$y_i\overset{\text{iid}}{\sim}\mathcal{N}(w_0+w_1x_i,\alpha^{-1})$$
and $\mathbf{w}\triangleq[w_0,w_1]^{\text{T}}$ s.t. $\mathbf{w}\overset{\text{iid}}{\sim}\mathcal{N}_2(\mathbf{0},\mathbf{I})$, then $\mathbf{w}|\mathbf{y}\overset{\text{iid}}{\sim}\mathcal{N}_2(\boldsymbol{\mu},\boldsymbol{\Sigma})$ where

$$
\begin{align}
\boldsymbol{\mu}&=\alpha\boldsymbol{\Sigma}\mathbf{\mathfrak{A}}^{\text{T}}\mathbf{y},\\
\boldsymbol{\Sigma}&=(\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\mathfrak{A}+\beta\mathbf{I})^{-1}
\end{align}
$$

and $\boldsymbol{\mathfrak{A}}\triangleq\left[(\mathbf{x}_i^{\text{T}})\right]_{\forall i}$.
</div>
</div>
<div class="wrapper" style="margin-top: 10px">
<div style="text-align: left !important;">
<b><i>Proof</i></b>. Let $\hat{y}_i\triangleq w_0+w_1x_i$ be the model, then the data can be described as follows:
\begin{align}
y_i=\hat{y}_i+\varepsilon_i,\quad\varepsilon_i\overset{\text{iid}}{\sim}\mathcal{N}(0,1/\alpha),
\end{align}
where $\varepsilon_i$ is the innovation that the model can't explain, and $\mathbb{Var}(\varepsilon_i)=\alpha^{-1}$ since $\mathbb{Var}(y_i)=\alpha^{-1}$ as given above. Then the likelihood of the model is given by:
<div style="overflow-x: auto;">
\begin{align}
\mathcal{L}(\mathbf{w}|\mathbf{y})\triangleq\mathbb{P}(\mathbf{y}|\mathbf{w})&=\prod_{\forall i}\frac{1}{\sqrt{2\pi}\alpha^{-1}}\text{exp}\left[-\frac{(y_i-\hat{y}_i)^2}{2\alpha^{-1}}\right]\\
&=\frac{\alpha^n}{(2\pi)^{n/2}}\text{exp}\left[-\alpha\sum_{\forall i}\frac{(y_i-\hat{y}_i)^2}{2}\right],
\end{align}
</div>
or in vector form:
<div style="overflow-x: auto;">
\begin{align}
\mathcal{L}(\mathbf{w}|\mathbf{y})\propto\text{exp}\left[-\frac{\alpha(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})^{\text{T}}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})}{2}\right],
\end{align}
</div>
where $\mathbf{\mathfrak{A}}\triangleq[(\mathbf{x}_i^{\text{T}})]_{\forall i}$ is the <i>design matrix</i> given above. If the <i>a priori</i> of the parameter is assumed to be standard bivariate Gaussian distribution, i.e. $\mathbf{w}\overset{\text{iid}}{\sim}\mathcal{N}_2(\mathbf{0}, \mathbf{I})$, then 
<div style="overflow-x: auto;">
\begin{align}
\mathbb{P}(\mathbf{w}|\mathbf{y})&\propto\mathcal{L}(\mathbf{w}|\mathbf{y})\mathbb{P}(\mathbf{w})\\
&\propto\text{exp}\left[-\frac{\alpha(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})^{\text{T}}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})}{2}\right]\exp\left[-\frac{1}{2}\mathbf{w}^{\text{T}}\beta\mathbf{I}\mathbf{w}\right]\\
&\propto\text{exp}\left\{-\frac{1}{2}\left[\alpha(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})^{\text{T}}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})+\mathbf{w}^{\text{T}}\beta\mathbf{I}\mathbf{w}\right]\right\}.
\end{align}
</div>
Expanding the terms in the exponential function returns the following:
<div style="overflow-x: auto;">
$$
\alpha\mathbf{y}^{\text{T}}\mathbf{y}-2\alpha\mathbf{w}^{\text{T}}\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}+\mathbf{w}^{\text{T}}(\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\boldsymbol{\mathfrak{A}}+\beta\mathbf{I})\mathbf{w},
$$
</div>
thus
<div style="overflow-x: auto;">
\begin{equation}
\mathbb{P}(\mathbf{w}|\mathbf{y})\propto\mathcal{C}\text{exp}\left\{-\frac{1}{2}\left[\mathbf{w}^{\text{T}}(\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\boldsymbol{\mathfrak{A}}+\beta\mathbf{I})\mathbf{w}-2\alpha\mathbf{w}^{\text{T}}\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}\right]\right\}.
\end{equation}
</div>
The inner terms of the exponential function is of the form $ax^2-2bx$. This a quadratic equation and therefore can be factored by completing the square. To do so, let $\mathbf{D}\triangleq\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\boldsymbol{\mathfrak{A}}+\beta\mathbf{I}$ and $\mathbf{b}\triangleq\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}$, then
<div style="overflow-x: auto;">
\begin{align}
\mathbb{P}(\mathbf{w}|\mathbf{y})&\propto\mathcal{C}\text{exp}\left[-\frac{1}{2}\left(\mathbf{w}^{\text{T}}\mathbf{D}\mathbf{w}-2\mathbf{w}^{\text{T}}\mathbf{b}\right)\right]\\&=\mathcal{C}\text{exp}\left[-\frac{1}{2}\left(\mathbf{w}^{\text{T}}\mathbf{D}\mathbf{w}-\mathbf{w}^{\text{T}}\mathbf{b}-\mathbf{b}^{\text{T}}\mathbf{w}\right)\right].
\end{align}
</div>
In order to proceed, the matrix $\mathbf{D}$ must be symmetric and invertible (<i>this can be proven separately</i>). If satisfied, then $\mathbf{I}\triangleq\mathbf{D}\mathbf{D}^{-1}=\mathbf{D}^{-1}\mathbf{D}$, so that the terms inside the exponential function above become:
<div style="overflow-x: auto;">
$$
\mathbf{w}^{\text{T}}\mathbf{D}\mathbf{w}-\mathbf{w}^{\text{T}}\mathbf{D}\mathbf{D}^{-1}\mathbf{b}-\mathbf{b}^{\text{T}}\mathbf{D}^{-1}\mathbf{D}\mathbf{w}+\underset{\text{constant introduced}}{\underbrace{(\mathbf{b}^{\text{T}}\mathbf{D}^{-1}\mathbf{D}\mathbf{D}^{-1}\mathbf{b}-\mathbf{b}^{\text{T}}\mathbf{D}^{-1}\mathbf{D}\mathbf{D}^{-1}\mathbf{b})}}.
$$
</div>
Finally, let $\boldsymbol{\Sigma}\triangleq\mathbf{D}^{-1}$ and $\boldsymbol{\mu}\triangleq\mathbf{D}^{-1}\mathbf{b}$, then 
<div style="overflow-x: auto;">
\begin{align}
\mathbb{P}(\mathbf{w}|\mathbf{y})&\propto\mathcal{C}\text{exp}\left[-\frac{1}{2}\left(\mathbf{w}^{\text{T}}\boldsymbol{\Sigma}^{-1}\mathbf{w}-\mathbf{w}^{\text{T}}\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}-\boldsymbol{\mu}^{\text{T}}\boldsymbol{\Sigma}^{-1}\mathbf{w}+\boldsymbol{\mu}^{\text{T}}\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}\right)\right]\\
&=\mathcal{C}\text{exp}\left[-\frac{(\mathbf{w}-\boldsymbol{\mu})^{\text{T}}\boldsymbol{\Sigma}^{-1}(\mathbf{w}-\boldsymbol{\mu})}{2}\right],
\end{align}
</div>
where $-\mathbf{b}^{\text{T}}\mathbf{D}^{-1}\mathbf{D}\mathbf{D}^{-1}\mathbf{b}$ becomes part of $\mathcal{C}$, and that proves the proposition. $\blacksquare$
</div>
</div>
### Simulation Experiment
The above result can be applied to any linear models (*cross-sectional* or *time series*), and I'm going to demonstrate how we can use it to model the following simulated data. I will be using Julia in <a href="https://nextjournal.com/">Nextjournal</a> (be sure to head over to <a href="https://nextjournal.com/al-asaad/bayesian-sequential-learning">this link</a> for reproducibility), which already has an image available for version 1.3.1. Having said, some of the libraries are already pre-installed in the said image, for example <a href="https://github.com/JuliaPlots/Plots.jl" target="_blank">Plots.jl</a>. Thus, we only have to install the remaining libraries that we will need for this experiment.
<script src="https://gist.github.com/alstat/b444c7054c0f119f38ce773e6040ba07.js"></script>
Load the libraries as follows:
<script src="https://gist.github.com/alstat/5eb8fba973b4527b578bba9874642818.js"></script>
The <code>theme</code> above simply sets the theme of the plots below. Further, for reproducibility purposes, I provided a seed as well. The following function will be used to simulate a cross-sectional data with population parameters $w_0\triangleq-.3$ and $w_1\triangleq-.5$ for 20 sample size. 
<script src="https://gist.github.com/alstat/3c4e971a5aa2bd40e019b5c2f500f585.js"></script>
From the above results, the parameters of the <i>a posteriori</i> can be implemented as follows:
<script src="https://gist.github.com/alstat/00fb06b4b55c23a85b0c05801c5c4afb.js"></script>
One feature of Julia is it supports unicode, making it easy to relate the codes to the math above, i.e. <code>Σ</code> and <code>μ</code> in the code are obviously $\boldsymbol{\mu}$ and $\boldsymbol{\Sigma}$ above, respectively. The vector operations in Julia are also cleaner compared to that in R and in Python, for example we can encode Julia's <code>A'A</code> above as <code>t(A) %*% A</code> in R, and <code>A.T.dot(A)</code> in Python. 

Finally, we simulate the data as follows:
<script src="https://gist.github.com/alstat/2664db066600c54ea2e31edffe17831a.js"></script>
We don't really have to write down the <code>wtrue</code> variable above since that's the default values of <code>w0</code> and <code>w1</code> arguments, but we do so just for emphasis. 

While the main subject here is Bayesian Statistics, it would be better if we have an idea as to what the Frequentist solution would be. As most of you are aware of, the solution to the weights above is given by the following <i>normal equation</i>:
$$
\hat{\mathbf{w}}=(\boldsymbol{\mathfrak{A}}^{\text{T}}\boldsymbol{\mathfrak{A}})^{-1}\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y},
$$
this is a known result, and we can prove this in a separate article. The above equation is implemented as follows:
<script src="https://gist.github.com/alstat/a13f83140f692ca94fe67c8569c0ba31.js"></script>
Therefore, for the current sample data, the estimate we got when assuming the weights as fixed and unknown is $\hat{\mathbf{w}}=[-0.32264, -0.59357]^{\text{T}}$. The figure below depicts the corresponding fitted line.
<script src="https://gist.github.com/alstat/42d38f37c05b4cc6249bd10f4a81a433.js"></script>
<img src="https://drive.google.com/uc?export=view&id=1LpAcFwC3pCOzCvsMsINmR-d52D83X8bi">
Not bad given that we have very small dataset. Now let's proceed and see how we can infer the parameters in Bayesian framework. The prior distribution can be implemented as follows:
<script src="https://gist.github.com/alstat/ab32e9a8f171975532910c6305a4f95f.js"></script>
As indicated in the above proposition, the parameters are jointly modelled from a bivariate Normal distribution, as indicated by the dimension of the hyperparameter <code>μ</code> above. Indeed, the true parameter we are interested in is the weight vector, $\mathbf{w}$, but because we considered it to be random, then the parameters of the model we assign to it are called <i>hyperparameters</i>, in this case the vector $\boldsymbol{\mu}$ and the identity matrix $\mathbf{I}$ of the prior distribution. 

Moreover, the likelihood of the data can be implemented as follows:
<script src="https://gist.github.com/alstat/b0fa92ec05c0a03c2d91bb82c1c5ca5e.js"></script>
The mean of the likelihood is the specified linear model itself, which in vector form is the inner product of the transformed <i>design matrix</i>, $\boldsymbol{\mathfrak{A}}$, and the weights vector, $\mathbf{w}$, i.e. <code>A[i, :]'w</code>. This assumption is valid since the fitted line must be at the center of the data points, and that the error should be random. One of my favorite features of Julia language is the <i>multiple dispatch</i>. For example, the two <code>likelihood</code> functions defined above are not in conflict since Julia evaluates the inputs based on the type of the function arguments. The same is true for the posterior distribution implemented below. Unlike in R and in Python, I usually have to write this as a helper function, e.g. <code>likelihood_helper</code>.
<script src="https://gist.github.com/alstat/1eb7917d65287d6726cb800955c99077.js"></script>
Finally, the prediction is done by sampling the weights from the posterior distribution. The center of these weights is of course the mean of the <i>a posteriori</i>.
<script src="https://gist.github.com/alstat/cfc5d39166922ca852c781517beed170.js"></script>
For example, to sample 30 weights from the posterior distribution using all the sampled data, and return the corresponding predictions, is done as follows:
<script src="https://gist.github.com/alstat/f284bacb094b5f4eca795a6606ef0fc6.js"></script>
The predicted function returns both <i>x</i> and <i>y</i> values, that's why we indexed the above result to 2, to show the predicted <i>y</i>s only. Further, to use only the first 10 observations of the data for calculating the $\hat{y}$, is done as follows:
<script src="https://gist.github.com/alstat/17861ce8cea5cdb67cd0104c4d74c794.js"></script>
So you might be wondering, what's the motivation of only using the first 10 and not all observations? Well, we want to demonstrate how Bayesian inference learns the weights or the parameters of the model sequentially.

### Visualization
At this point, we are ready to generate our main vis. The first function (<code>dataplot</code>) plots the generated fitted lines from the <i>a priori</i> or <i>a posteriori</i>, both of which is plotted using the extended method of <code>contour</code> we defined below.
<script src="https://gist.github.com/alstat/dda95d054b6cc702dd78ed61062d56de.js"></script>
Tying all the codes together, gives us this beautiful grid plot.
<script src="https://gist.github.com/alstat/8fca90fe8e0cbb84b36f59367fe130aa.js"></script>
<img src="https://drive.google.com/uc?export=view&id=1rKM8d9ROHw63MvBf83EGoNMOoHe6vx__">
Since we went with style before comprehension, let me guide you then with the axes. All figures has a unit square space, with contour plots having the following axes: $w_0$ (the <i>x</i>-axis) and $w_1$ (the <i>y</i>-axis). Obviously, the data space has the following axes: predictor (the <i>x</i>-axis) and response (the <i>y</i>-axis).
### Discussions
We commenced the article with emphasis on the approach of Bayesian Statistics to modeling, whereby the estimation of the parameters as mentioned is based on the <i>Bayes' Theorem</i>, which is a conditional probability with the following form:
\begin{equation}
	\mathbb{P}(\mathbf{w}|\mathbf{y})=\frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})}.
\end{equation}
Now we will relate this to the above figure using some analogy, as to how the model sequentially learns the optimal estimate for the parameter of the linear model.

Consider the following: say you forgot where you left your phone, and for some reason you can't ring it up, because it could be dead or can't pick up some signals. Further, suppose you don't wanna look for it, rather you let Mr. Bayes, your staff, to do the task. How would he then proceed? Well, let us consider the weight vector, <span>$\mathbf{w}\triangleq[w_0,w_1]^{\text{T}}$</span>, be the location of your phone. In order to find or at least best approximate the exact location, we need to first consider some prior knowledge of the event. In this case, we need to ask the following questions: where were you the last time you had the phone? Were you in the living room? Or in the kitchen? Or in the garage? And so on. In the context of modeling, this prior knowledge about the true location can be described by a probability distribution, and we refer to this as the <i>a priori</i> (or the prior distribution). These set of possible distributions obviously are models itself with parameters, as mentioned above, referred to as the <i>hyperparameters</i>, which we can tweak to describe our prior knowledge of the event. For example, you might consider the kitchen as the most probable place where you left your phone. So we adjust the <i>location</i> parameter of our <i>a priori</i> model to where the kitchen is. Hence Mr. Bayes should be in the kitchen already, assessing the coverage of his search area. Of course, you need to help Mr. Bayes on the extent of the coverage. This coverage or domain can be described by the <i>scale</i> parameter of your <i>a priori</i>. If we relate this to the main plot, we assumed the prior distribution over the weight vector to be standard bivariate Gaussian distribution, centered at zero vector with identity variance-covariance matrix. Since the prior knowledge can have broad domain or coverage on the possible values of the weight vector, the samples we get generates random fitted lines as we see in the right-most plot of the first row of the figure above.

Once we have the prior knowledge in place, that is, we are already in the kitchen and we know how wide the search area likely to be, we can start looking for evidence. The evidence is the realization of your true model, relating to the math above, these realizations are the <span>$y_i$</span>s, coming from <span>$y_i=f(x|\mathbf{w})$</span>, where <span>$f(x|\mathbf{w})$</span> is the link function of the <i>true</i> model, which we attempt to approximate with our hypothesized link function, <span>$h(x|\hat{\mathbf{w}})$</span>, that generated the predicted <span>$\hat{y}_i$</span>s. For example, you may not know where exactly your phone is, but you are sure with your habits. So you inform Mr. Bayes, that the last time you were with your phone in the kitchen was drinking some coffee. Mr. Bayes will then use this as his first evidence, and assess the likelihood of each suspected location in the kitchen. That is, what is the likelihood that a particular location, formed (or realized, generated or connected to) the first evidence (taking some coffee)? For example, is it even comfortable to drink coffee in the sink? Obviously not, so very low likelihood, but likely in the dining table or close to where the coffee maker is. If we assess all possible location within our coverage using the first evidence, we get the <i>profile likelihood</i>, which is what we have in the first column of the grid plot above, <i>profile likelihood for the i</i>th <i>evidence</i>. Further, with the first evidence observed, the prior knowledge of Mr. Bayes needs to be updated to obtain the posterior distribution. The new distribution will have an updated location and scale parameters. If we relate to the above figure, we can see the samples of the fitted lines in the <i>data space</i> plot (third column, second row), starting to make guesses of possible lines given the first evidence observed. Moving on, you inform Mr. Bayes of the second evidence, that you were reading some newspaper while having some coffee. At this point, the prior belief of Mr. Bayes, for the next posterior, will be the posterior of the first evidence, and so the coverage becomes restrictive and with new location, which further help Mr. Bayes on managing the search area. The second evidence, as mentioned, will then return a new posterior. You do this again and again, informing Mr. Bayes of other evidences sequentially until the last evidence. The final evidence will end up with the final posterior distribution, which we expect to have new <i>location</i> parameter, closer to the exact location, and small <i>scale</i> parameter, covering the small circle of the exact solution. The final posterior will then be your best guess that would describe the exact location of your phone.

This may not be the best analogy, but that is how the above figure sequentially learns the optimal estimate for the weight vector in Bayesian framework.
### Bayesian Deep Learning
This section deserves a separate article, but I will briefly give some motivation on how we can generalize the above discussion into complex modeling. 

The intention of the article is to give the reader a low-level understanding of how the Bayes' theorem work, and without loss of generalization, I decided to go with simple linear regression to demonstrate the above subject. However, this can be applied to any model indexed by or a function of some parameters or weights $\mathbf{w}$, with the assumption that the solution is random but govern by some probability distribution. 

Complex modeling such as in Deep Learning are usually based on the assumption that the weights are fixed and unknown, which in Statistics is the Frequentist approach to inference, but without assuming some probability distribution on the error of the model. Therefore, if we are to assume some randomness on the weights, we can then use Bayesian inference to derive or at least approximate (for models with no closed-form solution) the posterior distribution. Approximate Bayesian inference are done via Markov Chain Monte Carlo (MCMC) or Variational Inference, which we can tackle in a separate post.

### Libraries
There are several libraries for doing Bayesian inference, the classic and still one of the most powertful library is <a href="https://mc-stan.org/">Stan</a>. For Python, we have <a href="https://docs.pymc.io/">PyMC3</a>, <a href="http://pyro.ai/examples/index.html">Pyro</a> (based on <a href="https://pytorch.org/">Pytorch</a>), and <a href="https://www.tensorflow.org/probability">TensorFlow Porbability</a>. For Julia, we have <a href="https://turing.ml/dev/">Turing.jl</a>, <a href="https://mambajl.readthedocs.io/en/latest/index.html">Mamba.jl</a>, <a href="http://probcomp.csail.mit.edu/">Gen.jl</a>, and <a href="https://mc-stan.org/users/interfaces/julia-stan">Stan.jl</a>. I will have a separate article for these libraries.
### Next Steps
The obvious next steps for readers to try out is to model the variance as well, since in the above result, the variance of the innovation or the error is known and is equal to $\alpha$. Further, one might consider the Frequentist sequential learning as well. Or proceed with other nonlinear complex models, such as Neural Networks. We can have these in a separate article.
### Software Versions
<script src="https://gist.github.com/alstat/f7b473b4919e3d76681c97dee178fcbc.js"></script>

