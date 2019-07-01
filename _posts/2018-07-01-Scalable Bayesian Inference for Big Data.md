---
layout: post
title:  "Bayesian Inference: Introduction to Probabilistic Programming using TensorFlow Probability and Turing.jl"
date:   2019-06-31 12:00:00 +0800
categories: Big-Data Bayesian Inference
comments: true
use_math : true
author: Al-Ahmadgaid B. Asaad
tag: julia
---
In Statistics, inference is a process of characterizing the population from a given data. There are two approaches to inference, namely <b>Frequentist</b> and <b>Bayesian</b> approaches. The former is based on the assumption that, the objective parameter of the model (e.g. density curve for the population distribution) given the data, is fixed and unknown. On the other hand, the latter (Bayesian inference) describes this parameter as random (following some distribution) and unknown. Having this understanding then, suggests that Bayesian inference somehow extends the Frequentist solution by giving out multiple parameter estimates that behave according to some derived distribution --- referred to as the posterior distribution or <b>a posteriori</b> --- as opposed to single point estimate on the objective parameters. Therefore, of the two approaches, the Frequentist procedure to inference is more popular in terms of the availability of tools, ranging from handling small data to big data. Big data as <a href="https://www.ibmbigdatahub.com/infographic/four-vs-big-data">defined by the International Business Machines (IBM)</a>, can refer to data that are either big in <b>volume</b>, real-time in <b>velocity</b>, varied in <b>variety</b>, and dirty in <b>veracity</b>. The last two attributes (<b>variety</b> and <b>veracity</b>) mentioned are well-studied in Statistics, but not the first two attributes. Hence, with the advent of big data, recent theoretical developments now include statistics for analyzing data that are big in both <b>volume</b> and <b>velocity</b>. For this paper, however, the focus will be on handling the <b>volume</b>; but needless to say, there are interesting research for handling streaming data as well, one of it is called <b>online statistics</b> [1].

### Big Data, Deep Learning and Bayesian Inference
Data that are big in <b>volume</b> can either refer to big in <b>n</b> or <b>tall data</b>, which means the number of records is big (e.g. in the range of millions, billions and more); or big in <b>p</b> also referred to as <b>wide data</b>, in which the number of variables or features not only is bigger than the number of records or rows, but also large enough that it could also go millions and more. In theory, Bayesian is well-known to be good at handling small data in comparison to Frequentist, thanks to the prior specification. However, when it comes to big data, the availability of stable software leaned towards the Frequentist algorithms. A good example of this is the Machine Learning (ML) library of the <a href="https://spark.apache.org/">Apache Spark</a> --- a software developed for handling big data (mostly big <b>n</b>). A typical example of big in <b>n</b> data is the transaction log of store front business, where records goes Gigabytes to Terabytes or more in size, but are often stored in relational table. On the other hand, wide data or data that are big in <b>p</b> often are unstructured in form, for example images and videos. This follows from the fact that, images are represented by its pixels and channels (e.g. RGB --- Red, Green, and Blue channels) of each pixel. Hence, vectorizing these pixels across height ($h$), width ($w$) and channels ($\lambda$) of an image, generates a $h\times w\times\lambda$ dimensions. In matrix format, this translate to saying, each row represents an image, and each image (row) has corresponding $h\times w\times\lambda$ columns/variables that describe this image. So for a 500$\times$500 colored image with 3 channels (RGB), if vectorized, can have 750,000 dimensions. For this paper, we refer to images as a type of big data since it is unstructured as well. Having said, numerous models have been proposed including the complex ones for handling images, these models are called <b>Deep Learning</b> (DL) models. In fact, the success of AI nowadays are due to these models, most of which are not Bayesian in nature. The success is also due to the availability of software that can do <b>automatic differentiation</b> on any specified models. As such, derivation of complex loss functions is not anymore a problem of doing it manually, since computers can do it quite well already. Thus, coming up with a new architecture or a new variant of <b>Deep Neural Networks</b> or any other complex models is now relatively easy to implement and train, thanks to high-level Application Program Interfaces (APIs) of tools like <b>Google's Tensorflow</b> and <b>Torch</b> projects. Therefore, the success of AI recently in terms of computer vision and natural language processing as stressed above, is partly due to the availability of the stable tools, of which the estimation is based on the Frequentist's assumption of the weights.

While recent computer visions and natural language processing techniques gained significant improvements on the predictive capability under the Frequentist approach, this type of inference, as mentioned earlier is based on the assumption that the objective parameter is fixed. Having this nature, however, somehow limits the researcher on specifying other known characteristics of the model that could further contribute to the solutions of the problem. As an illustration, consider the Michaelis-Menten model below:
\begin{equation}\label{eq:mm}
    y = \frac{\beta_0 x}{\beta_1 + x}.
\end{equation}
This equation is popular for modeling enzyme kinetics, and the goal is to find the optimal value for $\beta_0$ and $\beta_1$ given the data. The estimation procedure can be done via <b>mathematical programming</b> since there is no closed form solution to this nonlinear regression. However, this model can be linearly transformed and have a closed form solution. In any case, the user will only get single solution for the values of $\beta_0$ and $\beta_1$, which is not a problem, but wouldn't it be nice to further express what we know about the parameters we are interested in? For example, the two parameters above must be positive in practice. Wouldn't it be useful to specify this? Wouldn't it be predictive if we can specify how they behave? If so, then consider using Bayesian inference --- where instead of minimizing the error of Equation (\ref{eq:mm}) given below:
\begin{equation}\label{eq:mm-error}
    \varepsilon = y - \frac{\beta_0 x}{\beta_1 + x},
\end{equation}
and optimized over the weights, what Bayesian does is to solve this probabilistically by first specifying the problem as follows, for example:

$$
\begin{align}
    \label{eq:iidys}
    y &\sim \mathcal{N}\left(\mu = \frac{\beta_0 x}{\beta_1 + x}, \frac{1}{5}\right)\\
    \label{eq:apriori}
    (\beta_0, \beta_1) &\sim \mathcal{TN}(\mu = 0, \sigma = 100, a = 0, b = \infty),
\end{align}
$$

where $\mathcal{TN}(\cdot)$ is the notation for the Truncated Normal distribution.
After that, estimation is done by deriving the posterior distribution of the objective parameters by simplifying the Bayes' theorem given below:
\begin{equation}\label{eq:bayes-thm-0}
\mathbb{P}(\boldsymbol{\beta}|\mathbf{y}) = \frac{\mathbb{P}(\boldsymbol{\beta})\mathbb{P}(\mathbf{y}|\boldsymbol{\beta})}{\mathbb{P}(\mathbf{y})},
\end{equation}
where $\mathbb{P}(\mathbf{y}|\boldsymbol{\beta})$ is the likelihood, which is the product of Equation (\ref{eq:iidys}), and is described by a Normal density function; $\mathbb{P}(\boldsymbol{\beta})$ is the prior distribution or <b>a priori</b> given by Equation (\ref{eq:apriori}), and is characterized by a Truncated Normal with support between 0 and $\infty$; $\mathbb{P}(\mathbf{y})$ is the normalizing constant obtained by integrating out $\boldsymbol{\beta}$ from the likelihood, i.e. $\mathbb{P}(\mathbf{y})=\int \mathbb{P}(\mathbf{y}|\boldsymbol{\beta})\operatorname{d}\boldsymbol{\beta}$. Therefore, in comparison to Frequentist approach, inference in Bayesian is based fully on probability theory.
<!-- In this paper, the author will review the recent advances of Bayesian inference with regards to big data problems, specifically for big <b>n</b> and big <b>p</b>. Along these, is a review on actively developed open-source tools for scaling Bayesian inference, which is computationally referred to as <b>probabilistic programming</b>; and finally a review on the application of Bayesian inference for big data, specifically for computer vision and natural language processing. -->
### Sequential Bayesian Learning
As an illustration of how Bayesian inference works,  consider the input variable $x$ and a target variable $y$ such that the true function is the simple linear regression with parameters $w_0\triangleq-.3$ and $w_1\triangleq-.5$. Suppose the random values of $x$ are taken from a uniform distribution having domain $[-1,1]$; then the target variable $y=h(x,\mathbf{w})+\varepsilon=w_0+w_1x+\varepsilon$, where $\varepsilon$ is a Gaussian noise having mean $0$ and standard deviation $5$. The goal is to recover the true value of $w_0$ and $w_1$ from the data. Using the <b>a priori</b> defined by a standard Gaussian distribution, the plot of this density is given in the first row, second column of Figure 1. This is the case in which no data point yet is observed. The white diamond point in the contour plot of the prior density is the true value of the parameters that needs to be estimated. The corresponding 20 samples of straight lines with weights sampled from the <b>a priori</b> are plotted in the far right hand side of the first row of the figure. These sampled lines form the so called <b>model uncertainty</b>. The second row depicts the case where first observation is observed. The likelihood of this data point is shown in the left hand side of the row, and using this likelihood multiplied by the <b>a priori</b> in the previous row, and further multiply it with the normalizing constant, returns the <b>a posteriori</b> in the middle column of the second row. The corresponding fitted lines are placed in the right hand side of the row. Following the same procedure for the third row, with likelihood of the first five observations shown in the left hand side of the row, and <b>a priori</b> given by the <b>a posteriori</b> of the second row, returns a more concentrated posterior distribution of the weights with 20 sampled fitted lines in the third column of the third row. The process is repeated until the fourth row consisting of 20 observations. This example is based from [2] which illustrates the sequential Bayesian learning to fitting a straight line to a simulated data.
<img src="http://drive.google.com/uc?export=view&id=1o9kg2rtzb77eFSUtGGQmeYLqxWPW3ONL" style="width: 95%">
<center>Figure 1: Sequential Bayesian Learning of Fitting Straight Line.</center>

### Markov Chain Monte Carlo
In Bayesian statistics, Reverend Thomas Bayes \cite{bayes} is known to be the first to formulate the Bayes' theorem, but the comprehensive mathematical formulation of this result is credited to the works of \cite{laplace1986}. The Bayes' theorem has the following form:
\begin{equation}\label{eq:bayestheoremch2}
\mathbb{P}(\mathbf{w}|\mathbf{y})=\frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})},
\end{equation}
where $\mathbf{w}$ is the weight vector and $\mathbf{y}$ is the data. This simple formula is   the main   foundation of Bayesian modeling. Any model estimated using Maximum Likelihood can be estimated using   the above   conditional probability. As mentioned in   the preceding   chapter,   the Bayes'   theorem considers uncertainty not only on the observations but also uncertainty on   the weights   or   the objective   parameters. Moreover, while Equation (\ref{eq:bayestheoremch2}) has simplicity in its form, this expression can be challenging to solve, especially when   the dimension   of   the parameter   $\mathbf{w}$ is high, or when   the problem   involves complex models. Specifically,   the main   concern lies in   the computation   of   the $\mathbb{P}(\mathbf{y})$}, which involve hierarchical summation for discrete variable or high-dimensional integration for continuous variable. In order to address the limitation, \cite{hasting} worked on   the generalization   of the proposed algorithm by \cite{Metropolis}, and became known as the Metropolis-Hasting algorithm.   The idea   of   the proposed   algorithm is to compute the <b>a posteriori</b> by approximation through the use of sampling. This family of algorithms for approximate Bayesian inference is called Markov Chain Monte Carlo (MCMC). However, MCMC by nature is expensive to do, especially at the time of its invention, wherein computers are not fast enough to run such algorithms efficiently. Hence, with   the advancement   in machines, more MCMC algorithms were proposed for efficient sampling. Unfortunately,   Metropolis-Hasting   (MH) algorithm has limitations. First,   the specification   of   the proposal   distribution is difficult for high-dimensional posterior distribution; and second,   the assumption   of independent samples is also difficult to achieve since the markov chains often have high autocorrelations. This limitation makes this algorithm not suitable for dealing with big data, specifically big in <b>p</b> data.

The limitation of   the MH   MCMC was addressed by \cite{Duane1987}, on their paper entitled "Hybrid Monte Carlo". The idea of this algorithm is based on Hamiltonian dynamics using   the concept   of Gibbs sampling and MH, hence   the name   Hybrid (hybrid of Gibbs and MH) or Hamiltonian Monte Carlo (HMC). The algorithm uses auxilliary distribution, which contains   the so   called <b>kinetic energy</b>, along with   the target   distribution, also called   the <b>potential  </b> <b>energy</b>. Having said, HMC is an effective MCMC for dealing with big <b>p</b> data. In recent literature, HMC was extended to also handle big in <b>n</b> data. This follows from the fact that HMC uses batch gradient descent in its algorithm which can be computationally expensive for large datasets. Thus,   the ideal   solution is to use samples or only one observation for computing   the gradient  , and this approach is called stochastic gradient descent or   the minibatch-gradient   descent. This is the work by \cite{tchen} giving birth to "Stochastic Gradient Hamiltonian Monte Carlo" (SGHMC). This in turn scales HMC not only to big <b>p</b> problems but also for big <b>n</b>. 

### Hamiltonian Monte Carlo (HMC)
One limitation of the Metropolis-Hasting algorithm is that, the samples drawn are based on the rejection criterion where the decision to accept depends on the proposal distribution. The simplest proposal is the random walk, and it works by sampling the next step from the Uniform distribution. The problem with this nature of computation is that the distance traversed through the state space grows only as the square root of the number of steps \cite{bishop}. However, if the step size is increased by expanding the min and max parameters in the case of Uniform proposal function, this will shorten the distance traversed but will lead to high rejection rate. 

The <b>Hamiltonian Monte Carlo</b> originally known as <b>Hybrid Monte Carlo</b> in the paper by \cite{Duane1987}, addresses the issue of the Metropolis-Hasting by considering auxiliary variable for describing the physical system in drawing samples from the target distribution. To understand the process, a brief review in Physics is provided for <b>Hamiltonian dynamics</b>. <b>Dynamic</b> in Physics deals with the study of the causes of motion, that is, the physical factors that can affect the object's motion in the <b>system</b>, which is the event or phenomenon being studied. In particular, Hamiltonian dynamics describe the system using <b>location</b> parameter notated as $\mathbf{w}$ and <b>momentum</b> parameter $\mathbf{p}$.

As an example, consider a ball attached to a <b>frictionless</b> pendulum swinging on a vertical plane. For each location of the ball given by $\mathbf{w}$, there is a corresponding <b>potential energy</b> (PE), denoted by $\mathbb{U}(\mathbf{w})$, and for each momentum $\mathbf{p}$, there is an associated <b>kinetic energy</b> (KE) $\mathbb{K}(\mathbf{p})$. So that at the extreme trajectory of the pendulum, the PE is maximum and KE is minimum; and at the equilibrium point, the KE is maximum and PE is minimum. The system is a function of time, hence the Hamiltonian dynamics evolve in a continuous <b>space</b> called <b>phase space</b>.  
The total energy of the system is characterized by the Hamiltonian 
\begin{equation}
\mathbb{H}(\mathbf{w},\mathbf{p})\triangleq\mathbb{U}(\mathbf{w})+\mathbb{K}(\mathbf{p}),
\end{equation}
and therefore describes the conversion of the two energies as the object moves throughout a system in time. So that the following are the Hamiltonian equations:

$$
\begin{align}\label{eq:hamiltonian}
\begin{split}
\frac{\operatorname{d} \mathbf{w}}{\operatorname{d} t}&=\frac{\partial \mathbb{H}(\mathbf{w}, \mathbf{p})}{\partial \mathbf{p}}=\frac{\operatorname{d} \mathbb{K}(\mathbf{p})}{\operatorname{d} \mathbf{p}}\\
\frac{\operatorname{d} \mathbf{p}}{\operatorname{d} t}&=-\frac{\partial \mathbb{H}(\mathbf{w},\mathbf{p})}{\partial \mathbf{w}}=-\frac{\operatorname{d} \mathbb{U}(\mathbf{w})}{\operatorname{d} \mathbf{w}}.
\end{split}
\end{align}
$$

There are three properties that makes Hamiltonian dynamics good for sampling. The first one is the <b>conservation</b> of the energy, that is, a change in time for both position and momentum won't affect the Hamiltonian total energy. This can be seen from the following equation

$$
\begin{align}
\frac{\operatorname{d}\mathbb{H}}{\operatorname{d} t}&=\sum_i\left[\frac{\partial \mathbb{H}}{\partial \mathbf{w}}\frac{\operatorname{d} \mathbf{w}}{\operatorname{d} t}+\frac{\partial \mathbb{H}}{\partial \mathbf{p}}\frac{\operatorname{d} \mathbf{p}}{\operatorname{d} t}\right]\\
&=\sum_i\left[\frac{\partial \mathbb{H}}{\partial \mathbf{w}}\frac{\partial \mathbb{H}}{\partial \mathbf{p}}-\frac{\partial \mathbb{H}}{\partial \mathbf{p}}\frac{\partial \mathbb{H}}{\partial \mathbf{w}}\right]=0.
\end{align}
$$

The second property follows from the <b>Liouville's theorem</b>, which claims that the system <b>preserves</b> the volume of the phase space. The last property is <b>reversibility</b>, all details can be found in \cite{Neal1996,bishop,neal2011}. 

### Leapfrog Method
Since the phase space changes over time which is a continuous variable, then in order to simulate the Hamiltonian dynamics under numerical computations, the time has to be discretized. There are several ways to do this, one such solution is to consider the <b>leapfrog method</b>, which works as follows:

$$
\begin{align}
\mathbf{p}(t+\gamma/2)&=\mathbf{p}(t)-(\gamma/2)\frac{\partial \mathbb{U}(\mathbf{w}(t))}{\partial \mathbf{w}(t)}\\
\mathbf{w}(t+\gamma)&=\mathbf{w}(t)+\gamma\frac{\partial \mathbb{K}(\mathbf{p}(t))}{\partial \mathbf{p}(t)},\\
\mathbf{p}(t+\gamma)&=\mathbf{p}(t+\gamma/2)-(\gamma/2)\frac{\partial \mathbb{U}(\mathbf{w}(t+\gamma))}{\partial \mathbf{w}(t)}
\end{align}
$$

where $\gamma > 0$.
### Hamiltonian/Hybrid Monte Carlo
The Hamiltonian dynamics is related to MCMC using the fact that the total energy is related to the probability distribution of the parameter of interest using   the concept} of <b>canonical distribution</b> from the Statistical Mechanics. That is,
\begin{equation}
\mathbb{P}(\mathscr{P})=\frac{1}{Z}\exp\left[-E(\mathscr{P})\right],
\end{equation}
where $E$ is the total energy and $\mathscr{P}$ is the parameter space. Therefore, $E$ in this case, is $\mathbb{H}(\mathbf{w},\mathbf{p})$. Further, the three properties of the Hamiltonian dynamics mentioned above will make the canonical distribution <b>invariant</b>. So that the equation becomes

$$
\begin{align}
\mathbb{P}(\mathbf{w},\mathbf{p})&\propto\exp\left[-\mathbb{H}(\mathbf{w},\mathbf{p})\right]\\
&=\exp\left[-\mathbb{U}(\mathbf{w})-\mathbb{K}(\mathbf{p})\right]\\
&=\exp\left[-\mathbb{U}(\mathbf{w})\right]\exp\left[-\mathbb{K}(\mathbf{p})\right]\\
&\propto\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{p}).
\end{align}
$$

Therefore the joint canonical distribution of the location parameter $\mathbf{w}$ and   the momentum} parameter $\mathbf{p}$ factors into the products of its marginal density, implying independence. In this case, the momentum parameter serves as the <b>auxiliary</b> <b>variable</b> for the parameter of interest, $\mathbf{w}$, and because $\mathbf{p}$ is used for simulating Hamiltonian dynamics in phase space, making it random plus   the gradient} of its distribution leads to the exploration of high probability region, and thus it is also considered as the proposal distribution with certainty of acceptance on the proposed samples. However, due to the discretization of the phase space, the true samples proposed from the joint distribution of the location and momentum parameters are accepted using some adjustment. This adjustment is the introduction of the Metropolis-Hasting criterion as the decision rule for accepting the sample. Finally, the kinetic energy is often assumed to be standard Gaussian distributed, and thus
\begin{equation}\label{eq:kineticenergy}
\mathbb{K}(\mathbf{p}, \boldsymbol{\mu}\triangleq \mathbf{0}, \boldsymbol{\Sigma}\triangleq \mathbf{I})=\frac{(\mathbf{p}-\boldsymbol{\mu})^{\text{T}}\boldsymbol{\Sigma}^{-1}(\mathbf{p}-\boldsymbol{\mu})}{2}=\frac{\mathbf{p}^{\text{T}}\mathbf{p}}{2}.
\end{equation}
where $\boldsymbol{\mu}$ and $\boldsymbol{\Sigma}$ are the mean vector and the variance-covariance matrix, respectively. The $\boldsymbol{\Sigma}$ of the kinetic energy can be assigned to any positive definite matrix if additional information about the target density is available.

Hence to summarize the parameter of interest $\mathbf{w}$, the following is the target distribution,

$$
\begin{align}
\mathbb{U}(\mathbf{w})&=-\log\mathbb{P}(\mathbf{w}|\mathbf{y})\\
&=-\log[\mathbb{P}(\mathbf{w})\mathcal{L}(\mathbf{w}|\mathbf{y})]-\mathcal{C},
\end{align}
$$

where $\mathcal{C}\triangleq \log\mathbb{P}(\mathbf{y})$, which will be cancelled out at line 9 of Algorithm \ref{algo:mcmch}.

### Probabilistic Programming
As emphasized in the first section of this paper, the significant advancement in AI recently besides from the development of complex models, is partly due to the enablers such as <b>Google's Tensorflow</b> and <b>Torch</b>. Having said, it is therefore important to have tools for doing Bayesian inference as well, that can scale to big data problems and complex models. One popular software for doing Bayesian modeling is called Stan, named after the pioneer of MCMC --- Stanislaw Ulam. It is a probabilistic programming language written in C++ with APIs for R, Python, Julia, and other languages. While Stan can handle big data in terms of variety, this paper will focus on recently developed tools that's tailored towards handling big data problems. 

### Julia's Turing.jl
The first in this list is the Turing Language (Turing.jl) of Julia. Turing is a general-purpose probabilistic programming language that takes advantage of Julia's computing speed. Julia is a fresh programming language aimed at addressing the so called <b>two-language problem</b>. The two-language problem refers to the typical practice in prototyping to productizing journey. The idea is that, scientists create prototypes of the product using the programming language of their choice, common to them are R, Python and Matlab. However upon productizing, the code originally written in any of the mentioned languages is optimized using a low-level (relative to R, Python and Matlab) programming languages such as C++ and Java. This is one of the reason why Julia came into existence since it runs as fast as C, but statistically friendly as R, as general-purpose programming language as Python, as good in linear algebra as Matlab, and more. The creator of the Julia language was recently awarded with the 2019 James H. Wilkinson Prize for Numerical Software --- for inventing Julia. 

The speed of this new language is also aimed at processing big data. In fact, Julia has libraries already for handling big datasets called <b>JuliaDB.jl</b> which work well with another library for handling streamed (real-time) datasets <a href="https://github.com/joshday/OnlineStats.jl/">OnlineStats.jl</a>. Further, Julia is the first language used for modeling big data using approximate Bayesian inference in a paper by \cite{regier2018}. The said paper compared two approaches of Bayesian inference namely, MCMC and Variational Inference (VI). The paper used Bayesian modeling for constructing astronomical catalogs from optical telescope image set. The results showed that MCMC procedure excels at quantifying uncertainty while the VI procedure is 1000$\times$faster. In approximate Bayesian inference, VI is known to be fast but not good at quantifying uncertainty. In this paper, the focus will be on MCMC. Going back to the work of \cite{regier2018}, the data used in the study is 50 terabytes and the author used supercomputer (among the fastest currently in the world) for doing the computation. In terms of Julia as their language of choice, the authors conclude that, <b>to the best of our knowledge, this experiment (conducted in May 2017) was the first time a supercomputer program in any language other than C, C++, Fortran, or assembly has exceeded one petaflop in double-precision. The source code of the project is freely available on Github under the library name, Celeste.jl\footnote{\texttt{https://github.com/jeff-regier/Celeste.jl}}. While Celeste.jl contains APIs for doing Bayesian inference, it was not made for general-purpose probabilistic programming, it is only intended for reproducing the results of the said paper.

Having said on the efficiency of the new language, a new library for doing general-purpose probabilistic programming, Turing Language (Turing.jl), came into existence. Other than the speed, Turing also inherits the beautiful syntax of Julia. As an example, consider the Michaelis-Menten model mentioned in the first section of this paper (<b>see</b> Equation (\ref{eq:mm})). In Turing Language, the model specification can be done as follows:

MCMC sampling from this statistical program above is simply done as follows:

The sampling algorithm used in the code above is the No-U-Turn Sampler --- another MCMC algorithm. However, for Hamiltonian Monte Carlo, Turing.jl's API is \verb+HMC+. Other APIs for sampling algorithms included are \verb+SGHMC+ (Stochastic Gradient HMC), \verb+SGLD+ (Stochastic Gradient Langevin Dynamics), and few more. Lastly, Turing.jl works well with Julia's deep learning library, Flux.jl \cite{innes2018}. Hence, advancing AI through the use of Bayesian inference in Julia is indeed possible. Figure \ref{fig:turing-output} is the the output of the Julia code above on simulated dataset.

### Python's Tensorflow Probability
As an alternative, a new probabilistic programming language born out of Google's popular deep learning library, Tensorflow, is joining the club of Python's mature Bayesian libraries --- PyMC3\footnote{\texttt{https://docs.pymc.io/}} and Edward\footnote{\texttt{http://edwardlib.org/}}. The goal of this library is to have a high level, easy to use, APIs for doing probabilistic programming on any models, including deep learning models that deal with big datasets (such as images, audios, etc.). The following code is the Tensorflow Probability implementation of specifying the Michaelis-Menten model.

Unlike the construction in Julia, the model specification in TFP must return a joint log probability of the data and the weights. Further, TFP uses broadcasting in specifying Independent and Identically Distributed (IID) observations, <b>see</b> \verb+rv_y+ in comparison to \verb+y[i]+ in Turing.jl's code. Hence TFP don't require \verb+for loop+ for specification of IID data points. In addition, Turing.jl has straightforward sampling API contrary to TFP, since the latter require more lines of code for sampling specification. However, one big advantage of TFP is of course it is owned by Google, and that exposes TFP to the large community of Google's Tensorflow --- implying fast reporting of bugs and improvements.

As a final note, both probabilistic programming languages offer extensive MCMC algorithms, but Google's Tensorflow Probability also offers Variational Inference as an alternative to MCMC algorithms. Further, with the availability of free Graphical Processing Unit (GPU) and Tensor Processing Unit (TPU) on the recently released Google Colab\footnote{\texttt{https://colab.research.google.com/notebooks/welcome.ipynb}} --- gives researchers the ability to try Bayesian inference using Turing.jl\footnote{Although Google Colab only offers Python 2 and Python 3 as a backend, there is actually a way to hack it and install Julia and run Turing.jl. and Tensorflow Probability on complex models and on big data.

### References
* J. T. Day, Online Algorithms for Statistics, Ph.D. thesis, 2018.
* C. M. Bishop, Pattern Recognition and Machine Learning (Information Science and Statistics), Springer-Verlag New York, Inc., Secaucus, NJ, USA, 2006.
* Yuret, Deniz (2016). <a href="https://pdfs.semanticscholar.org/28ee/845420b8ba275cf1d695fbf383cc21922fbd.pdf">Knet: beginning deep learning with 100 lines of Julia</a>. 30th Conference on Neural Information Processing Systems (NIPS 2016), Barcelona, Spain.
* Innes, Mike (2018). <a href="http://joss.theoj.org/papers/10.21105/joss.00602">Flux: Elegant machine learning with Julia</a>. Journal of Open Source Software, 3(25), 602, https://doi.org/10.21105/joss.00602
* Abadi, Martin et al (2016). <a href="https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf">TensorFlow-Keras: A system for large-scale machine learning</a>. 12th USENIX Symposium on Operating Systems Design and Implementation (OSDI 16). p265--283.
