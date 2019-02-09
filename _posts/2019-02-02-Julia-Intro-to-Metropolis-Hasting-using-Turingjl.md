---
layout: post
title:  "Julia: Introduction to Metropolis-Hasting and Gibbs Sampling"
date:   2019-02-01 12:00:00 +0800
categories: Data Analyses Wrangling Julia Programming Packages
comments: true
tag: julia
---
A typical approach to modeling is done by minimizing the residual sum of squares (RSS) with respect to the weights of the model, which is equivalent to maximization of the likelihood of the parameters. This is the universal theme of the estimation procedure for most linear and nonlinear models, including the popular Neural Networks. In Statistics, this approach to estimation or learning is known as <b>Frequentist inference</b>, which assumes the objective parameters to be unknown but fixed. Hence, the estimated parameters return single solution for the given data. On the other hand, by assuming randomness governed by some distribution on the unknown parameters, returns multiple solution characterized by some distribution. In Statistics, this approach to estimation is called <b>Bayesian inference</b>.

In my previous article, I introduced the concept of Bayesian inference for estimating the popular model, linear regression. The estimation as emphasized in the article is centered around the Bayes' theorem defined below:
<div class="math">
\begin{equation}
\label{eq:bayes-theorem}
\mathbb{P}(\mathbf{w}|\mathbf{y}) = \frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})}
\end{equation}
</div>
where $\mathbb{P}(\mathbf{w}|\mathbf{y})$ is the posterior (or *a posteriori*) distribution, $\mathbb{P}(\mathbf{w})$ is the prior (or *a priori*) distribution, $\mathbb{P}(\mathbf{y}|\mathbf{w})$ is the likelihood of the data, and $\mathbb{P}(\mathbf{y})$ is the normalizing factor. While Equation (\ref{eq:bayes-theorem}) is simple in its form, theoretically, it can be complex especially for interesting models. The problem lies in the denominator of Equation (\ref{eq:bayes-theorem}), which is the normalizing factor and is solved by integrating all possible values of the parameters on the likelihood of the data, as seen in Equation (\ref{eq:bayes-theorem-expanded}). This is problematic especially for large number of parameters that lead to high dimensional integration.
<div class="math">
\begin{equation}
\label{eq:bayes-theorem-expanded}
\mathbb{P}(\mathbf{w}|\mathbf{y}) = \frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\mathbb{P}(\mathbf{y})} = \frac{\mathbb{P}(\mathbf{w})\mathbb{P}(\mathbf{y}|\mathbf{w})}{\int_{\mathbf{w}}\mathbb{P}(\mathbf{y}|\mathbf{w})\operatorname{d}\mathbf{w}}
\end{equation}
</div>
Hence, researchers on Bayesian inference mostly worked on algorithms that tries to address the above problem, and one popular solution is to do it computationally via a family of algorithms called Markov Chain Monte Carlo (MCMC).
<h3>Markov Chain Monte Carlo</h3>
MCMC is a family of algorithms that is based on sampling. These algorithms work by taking samples from the posterior distribution, via a set of procedures that avoids having to deal with the denominator of the Bayes' theorem. The goal of the sampling is of course to converge to a stationary distribution, which should be the *a posteriori*.

<h3>Metropolis-Hasting</h3>
The idea of the MH algorithm is to randomly walk in the support of the target density such that the random steps are governed by the proposal distribution $\mathbb{G}$(·). The assumption is that the posterior distribution has no closed-form solution, but the kernel, which is the unnormalized form of the target density is easy to evaluate. This is the advantage of the MH algorithm where the <i>a posteriori</i> is not necessarily be normalized — often the difficulty in simplifying the model evidence of the Bayes’ rule. Let $\mathbb{P}$(·) be the posterior distribution and $\mathbf{x}$ be the data, then MH has the following iterative process detailed in Algorithm 1.
<table class="algorithm">
    <thead>
        <th colspan="2"><b>Algorithm 1: Metropolis-Hasting</b></th>
    </thead>
    <tbody>
        <tr>
            <td style="width: 1%;">1:</td><td style="width: 99%;">Initialize $\theta$, $\mathbf{w}_r \sim \mathbb{G}(\theta), r = 0$</td>
        </tr>
        <tr>
            <td style="width: 1%;">2:</td><td style="width: 99%;">
                <b>for</b> $r\,\in\,\{1,\cdots, r_{\text{max}}\}$ <b>do</b>
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">3:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Propose: $\mathbf{w}_{\text{new}}\sim\mathbb{G}(\mathbf{w}_{r-1})$
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">4:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Acceptance: $\alpha(\mathbf{w}_{\text{new}}|\mathbf{w}_{r-1})\triangleq\text{min}\left\{1, \frac{\mathbb{P}(\mathbf{w}_{\text{new}}|\mathbf{x})\mathbb{G}(\mathbf{w}_{r-1})}{\mathbb{P}(\mathbf{w}_{r-1}|\mathbf{x})\mathbb{G}(\mathbf{w}_{\text{new}})}\right\}$
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">5:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Draw $x\sim\text{Unif}(0, 1)$
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">6:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>if</b> $x < \alpha(\mathbf{w}_{\text{new}}|\mathbf{w}_{r-1})$ <b>then</b>
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">7:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                $\mathbf{w}_r\triangleq\mathbf{w}_{\text{new}}$
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">8:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>else</b>
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">9:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                $\mathbf{w}_r\triangleq\mathbf{w}_{r-1}$
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">10:</td><td style="width: 99%;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>end if</b>        
            </td>
        </tr>
        <tr>
            <td style="width: 1%;">11:</td><td style="width: 99%;">
                <b>end for</b>        
            </td>
        </tr>
    </tbody>
</table>
The line 4 of the Algorithm 1 is the only place where we observed the <i>a posteriori</i>, $\mathbb{P}$(·). At first glance, it is apparent that these posteriors, 
<span>$\mathbb{P}(\mathbf{w}_{\text{new}}|\mathbf{x})$</span> 
and 
<span>$\mathbb{P}(\mathbf{w}_{r-1}|\mathbf{x})$</span>, need not be normalized since the denominators will simply cancel-out. That is, 
<div class="math">
\begin{equation}
\mathbb{P}(\mathbf{w}_{\text{new}}|\mathbf{x})=\frac{\mathbb{P}(\mathbf{x}|\mathbf{w}_{\text{new}})\mathbb{P}(\mathbf{w}_{\text{new}})}{\mathbb{P}(\mathbf{x})}
\end{equation}
</div>