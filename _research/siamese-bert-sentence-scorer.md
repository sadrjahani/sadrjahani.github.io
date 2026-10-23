---
layout: research-project
order: 4
title: "Siamese BERT Sentence Scorer"
subtitle: "An autoencoder and Siamese BERT model scoring semantic textual similarity between augmented sentence pairs."
description: "Autoencoder + Siamese BERT architecture for semantic textual similarity scoring."
status: "completed"
date: 2022-06-01
tags: ["NLP", "BERT", "PyTorch"]
thumbnail:
links: {}
---

## Overview

This project grew out of my master's thesis at IASBS: given two sentences, produce a single
score describing how semantically similar they are — even when one has been paraphrased,
reordered, or lexically altered from the other. The approach was benchmarked against SBERT (Sentence-BERT) and Augmented SBERT baselines.

## Method

A Siamese BERT encoder maps each sentence to a fixed-length embedding, and similarity is
computed as the cosine of the two embeddings:

$$
\text{sim}(a, b) = \frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert}
$$

where $\mathbf{u} = \text{BERT}(a)$ and $\mathbf{v} = \text{BERT}(b)$ are the pooled sentence
embeddings. An autoencoder is trained alongside the encoder to regularize the embedding space,
minimizing reconstruction loss jointly with a similarity-scoring objective:

<div class="math-block">
$$
\mathcal{L} = \mathcal{L}_{\text{sim}} + \lambda \, \mathcal{L}_{\text{recon}}
$$
</div>

## Result

The combined objective produced tighter, more separable embedding clusters than a similarity
loss alone — augmented (paraphrased) pairs scored consistently higher than unrelated pairs
across held-out validation sets.
