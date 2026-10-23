---
layout: research-project
order: 7
title: "Fraud & Sentiment Detection"
subtitle: "NLP-driven fraud detection and sentiment analysis models delivered in both English and Persian."
description: "Bilingual NLP models for fraud detection and sentiment analysis, delivered freelance."
status: "completed"
date: 2023-06-01
tags: ["NLP", "Fraud Detection", "Sentiment"]
thumbnail:
links: {}
---

## Overview

Two related freelance deliverables for the same client: a fraud-flagging classifier over
transaction text, and a sentiment model over customer feedback — both needed to work in
English and Persian without maintaining two separate pipelines.

## Preprocessing

The same normalization step handles both languages, so downstream models never need to know
which language they're looking at:

<div class="code-tabs" markdown="1">
<div class="code-tabs-nav">
  <button class="code-tab-btn active" data-tab="py-fraud">Python</button>
  <button class="code-tab-btn" data-tab="py-fraud-alt">Alt. tokenizer</button>
</div>

<div class="code-tabs-panel active" data-tab="py-fraud" markdown="1">
```python
def normalize(text, lang):
    text = strip_diacritics(text)
    return tokenizer[lang].tokenize(text.lower())
```
</div>

<div class="code-tabs-panel" data-tab="py-fraud-alt" markdown="1">
```python
def normalize(text, lang):
    # multilingual fallback when a language-specific tokenizer isn't available
    return multilingual_tokenizer.tokenize(text.lower())
```
</div>

</div>

## Result

A shared preprocessing layer plus separate lightweight classifier heads per task kept the
system maintainable — new languages could be added by dropping in a tokenizer, without
retraining either classifier from scratch.
