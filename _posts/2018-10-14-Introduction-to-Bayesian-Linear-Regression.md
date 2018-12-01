---
layout: post
title:  "Julia, Python, R: Introduction to Bayesian Linear Regression"
date:   2018-10-14 12:00:00 +0800
categories: Data Analyses Wrangling Julia Programming Packages
comments: true
use_math : true
tag: julia
---
<a href="https://en.wikipedia.org/wiki/Thomas_Bayes" target="_blank">Reverend Thomas Bayes</a> (see Bayes, 1763) is known to be the first to formulate the Bayes' theorem, but the comprehensive mathematical formulation of this result is credited to the works of <a href="https://en.wikipedia.org/wiki/Pierre-Simon_Laplace" target="_blank">Laplace</a> (1986). The Bayes' theorem has the following form:
<div class="math">
\begin{equation}
\label{eq:bayes-theorem}
\mathbb{P}(\mathbf{w}|\mathbf{y}) = \frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})}
\end{equation}
</div>
where $\mathbf{w}$ is the weight vector and $\mathbf{y}$ is the data. This simple formula is the main foundation of Bayesian modeling. Any model estimated using Maximum Likelihood can be estimated using the above conditional probability. What makes it different, is that the Bayes' theorem considers uncertainty not only on the observations but also uncertainty on the weights or the objective parameters. 

As an illustration of Bayesian inference to basic modeling, this article attempts to discuss the Bayesian approach to linear regression. Let ${\mathscr{D}=\{(\mathbf{x}_1,y_1),\cdots,(\mathbf{x}_n,y_n)\}}$ where $\mathbf{x}_i\in\mathbb{R}^{d}, y_i\in \mathbb{R}$ be the pairwised dataset. Suppose the response values, $y_1,\cdots,y_n$, are independent given the parameter $\mathbf{w}$, and is distributed as $y_i\sim\mathcal{N}(\mathbf{w}^{\text{T}}\mathbf{x}_i,\alpha^{-1})$, where $\alpha^{-1}$ (assumed to be known in this article) is referred to as the <i>precision</i> parameter --- useful for later derivation. In Bayesian perspective, the weights are assumed to be random and are governed by some <i>a priori</i> distribution. The choice of this distribution is subjective, but choosing arbitrary <i>a priori</i> can sometimes or often result to an intractable integration, especially for interesting models. For simplicity, a conjugate prior is used for the latent weights. Specifically, assume that ${\mathbf{w}\sim\mathcal{N}(\mathbf{0},\beta^{-1}\mathbf{I})}$ such that $\beta>0$ is the hyperparameter supposed in this experiment as known value. The posterior distribution based on the Bayes' rule is given by
\begin{equation}\label{eq:bayesrulepost}
	\mathbb{P}(\mathbf{w}|\mathbf{y})=\frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})},
\end{equation}
where $\mathbb{P}(\mathbf{w})$ is the <i>a priori</i> distribution of the parameter, $\mathbb{P}(\mathbf{y}|\mathbf{w})$ is the likelihood, and $\mathbb{P}(\mathbf{y})$ is the normalizing factor. The likelihood is given by
$$
\begin{align}
    \mathbb{P}(\mathbf{y}|\mathbf{w})&=\prod_{i=1}^{n}\frac{1}{\sqrt{2\pi\alpha^{-1}}}\exp\left[-\frac{\alpha(y_i-\mathbf{w}^{\text{T}}\mathbf{x}_i)^2}{2}\right]\nonumber\\
    &=\left(\frac{\alpha}{2\pi}\right)^{n/2}\exp\left[-\sum_{i=1}^n\frac{\alpha(y_i-\mathbf{w}^{\text{T}}\mathbf{x}_i)^2}{2}\right].\label{eq:likelihood:blreg}
\end{align}
$$
In matrix form, this can be written as
\begin{equation}
    \mathbb{P}(\mathbf{y}|\mathbf{w})\propto\exp\left[-\frac{\alpha}{2}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})^{\text{T}}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})\right]
\end{equation}
where $\boldsymbol{\mathfrak{A}}=\left[(\mathbf{x}_i^{\text{T}})\right]$, i.e. $\boldsymbol{\mathfrak{A}}\in(\mathbb{R}^{n}\times\mathbb{R}^d)$, this matrix is known as the <i>design matrix</i>. Given that $\mathbf{w}$ has the following prior distribution
\begin{equation}\label{eq:wpriori}
    \mathbb{P}(\mathbf{w})=\frac{1}{\sqrt{(2\pi)^{d}|\beta^{-1}\mathbf{I}|}}\exp\left[-\frac{1}{2}\mathbf{w}^{\text{T}}\beta\mathbf{I}\mathbf{w}\right],
\end{equation}
implies that the posterior has the following form:
$$
\begin{align}
    \mathbb{P}(\mathbf{w}|\mathbf{y})&\propto\exp\left[-\frac{\alpha}{2}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})^{\text{T}}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})\right]\exp\left[-\frac{1}{2}\mathbf{w}^{\text{T}}\beta\mathbf{I}\mathbf{w}\right]\nonumber\\
&=\exp\left\{-\frac{1}{2}\left[\alpha(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})^{\text{T}}(\mathbf{y}-\boldsymbol{\mathfrak{A}}\mathbf{w})+\mathbf{w}^{\text{T}}\beta\mathbf{I}\mathbf{w}\right]\right\}.
\end{align}
$$
Expanding the terms in the exponent, becomes
\begin{equation}\label{eq:expterms}
    \alpha\mathbf{y}^{\text{T}}\mathbf{y}-2\alpha\mathbf{w}^{\text{T}}\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}+\mathbf{w}^{\text{T}}(\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\boldsymbol{\mathfrak{A}}+\beta\mathbf{I})\mathbf{w}.
\end{equation}
The next step is to complete the square of the above equation such that it resembles the inner terms of the exponential factor of the Gaussian distribution. That is, the quadratic form of the exponential term of a $\mathcal{N}(\mathbf{w}|\boldsymbol{\mu},\boldsymbol{\Sigma}^{-1})$ is given by
$$
\begin{align}
    (\mathbf{w}-\boldsymbol{\mu})^{\text{T}}\boldsymbol{\Sigma}^{-1}(\mathbf{w}-\boldsymbol{\mu})&=(\mathbf{w}-\boldsymbol{\mu})^{\text{T}}(\boldsymbol{\Sigma}^{-1}\mathbf{w}-\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu})\nonumber\\
&=\mathbf{w}^{\text{T}}\boldsymbol{\Sigma}^{-1}\mathbf{w}-
2\mathbf{w}^{\text{T}}\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}+\boldsymbol{\mu}^{\text{T}}\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}.\label{eq:expnorm}
\end{align}
$$
The terms in Equation (\ref{eq:expterms}) are matched up with that in (\ref{eq:expnorm}), so that
\begin{equation}\label{eq:sigmablrgauss}
    \boldsymbol{\Sigma}^{-1}=\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\boldsymbol{\mathfrak{A}}+\beta\mathbf{I}
\end{equation}
and
$$
\begin{align}
    \mathbf{w}^{\text{T}}\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}&=\alpha\mathbf{w}^{\text{T}}\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}\nonumber\\
    \boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}&=\alpha\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}\nonumber\\
    \boldsymbol{\mu}&=\alpha\boldsymbol{\Sigma}\boldsymbol{\mathfrak{A}}^{\text{T}}\mathbf{y}.\label{eq:mublrgauss}
\end{align}
$$
Thus the <i>a posteriori</i> is a Gaussian distribution with location parameter in Equation (\ref{eq:mublrgauss}) and scale parameter given by the inverse of Equation (\ref{eq:sigmablrgauss}). I'll leave to the reader the proper mathematical derivation of $\boldsymbol{\mu}$ and $\boldsymbol{\Sigma}$ without matching like what we did above. 
### Simulation Experiment
In this section, we are going to apply the theory above using simulated data. I will use Julia as the primary programming language for this article, but I also provided codes for R and Python. To start with, load the following libraries:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-1', 'tabcontent-1')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-1', 'tabcontent-1')">Python</button>
</div>

<div id="julia-1" class="tabcontent-1 first">
  <script src="https://gist.github.com/alstat/00ac3ea439baddddab166ca40902f4b0.js"></script>
</div>

<div id="python-1" class="tabcontent-1" style="display: none;">
  <script src="https://gist.github.com/alstat/e814d09d53a8c3cba1e27d7be4c46d02.js"></script>
</div>
Next, define the following functions for data simulation and parameter estimation. The estimate of the paramters is governed by the <i>a posteriori</i> which from above is a multivariate Gaussian distribution, with mean given by Equation (\ref{eq:mublrgauss}) and variance-covariance matrix defined by the inverse of Equation (\ref{eq:sigmablrgauss}).
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-2', 'tabcontent-2')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-2', 'tabcontent-2')">Python</button>
  <button class="tablinks" onclick="openCity(event, 'r-2', 'tabcontent-2')">R</button>
</div>

<div id="julia-2" class="tabcontent-2 first">
  <script src="https://gist.github.com/alstat/df66b766a478aac49c45c2d792184534.js"></script>
</div>

<div id="python-2" class="tabcontent-2" style="display: none;">
  <script src="https://gist.github.com/alstat/42c43fe8cbf482e192da1283c0e7756c.js"></script>
</div>

<div id="r-2" class="tabcontent-2" style="display: none;">
  <script src="https://gist.github.com/alstat/a100a97eaf25659490a01121d1da8fa3.js"></script>
</div>

Execute the above functions and return the necessary values as follows:
<div class="tab" style="margin-bottom: -16px;">
  <button class="tablinks" onclick="openCity(event, 'julia-3', 'tabcontent-3')">Julia</button>
  <button class="tablinks" onclick="openCity(event, 'python-3', 'tabcontent-3')">Python</button>
  <button class="tablinks" onclick="openCity(event, 'r-3', 'tabcontent-3')">R</button>
</div>

<div id="julia-3" class="tabcontent-3 first">
  <script src="https://gist.github.com/alstat/0a60ea652e1caca60544cea239ccae4b.js"></script>
</div>

<div id="python-3" class="tabcontent-3" style="display: none;">
  <script src="https://gist.github.com/alstat/5dfa29ebb09275b961806f67e89e5530.js"></script>
</div>

<div id="r-3" class="tabcontent-3" style="display: none;">
  <script src="https://gist.github.com/alstat/5defe8880d40bdbf35ae36688bbcf98a.js"></script>
</div>
Finally, plot the fitted lines whose weights are samples from the <i>a posteriori</i>. The red line in the plot below is the Maximum <i>A Posteriori</i> (MAP) of the parameter of interest. Note that, however, the code provided for the animated plot below is Julia. Python and R users can use <a href="https://matplotlib.org/index.html" target="_blank">matplotlib.pyplot</a> (Julia's Plots backend) and <a href="https://github.com/thomasp85/gganimate" target="_blank">gganimate</a>, respectively.
<script src="https://gist.github.com/alstat/023ff855025d0da2fa50b7923b834fd8.js"></script>
<img src="https://raw.githubusercontent.com/estadistika/assets/master/imgs/2018-10-10-p1-c.gif?sanitize=true">

### End Note
There are many libraries available for Bayesian modeling, for Julia we have: <a href="https://github.com/JuliaStats/Klara.jl" target="_blank">Klara.jl</a>, <a href="https://github.com/brian-j-smith/Mamba.jl" target="_blank">Mamba.jl</a>, <a href="https://github.com/goedman/Stan.jl" target="_blank">Stan.jl</a>, <a href="https://github.com/TuringLang/Turing.jl" target="_blank">Turing.jl</a> and <a href="https://juliaobserver.com/categories/Bayesian" target="_blank">more related</a>;
for Python, my favorite is <a href="https://docs.pymc.io/" target="_blank">PyMC3</a>; and for R, I prefer <a href="http://mc-stan.org/users/interfaces/rstan" target="_blank">RStan</a>.

As always, coding from scratch is a good exercise and it helps you appreciate the math. Further, I found Julia to be quite easy to use as a tool for statistical problems. In fact, Julia's linear algebra API is very close to the mathematical formulae above.

### References
* Bayes, T. (1763). An essay towards solving a problem in the doctrine of chances. *Philosophical Transactions*, 53, 370-418. URL: http://www.jstor.org/stable/105741
* Laplace, P. S. (1986). Memoir on the probability of the causes of events. *Statist. Sci.*, 1(3), 364–378. URL: http://dx.doi.org/10.1214/ss/1177013621 doi: 10.1214/ss/1177013621

### Software Versions
<script src="https://gist.github.com/alstat/53a54b8e96ec1f45883d1447efeab0ff.js"></script>