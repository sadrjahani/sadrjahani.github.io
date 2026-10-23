---
layout: research-project
order: 5
title: "Dynamic Pricing Optimizer"
subtitle: "A pricing system overhaul that improved efficiency by 30% while cutting execution time, built freelance."
description: "Freelance pricing optimization system with a beam-search-style candidate ranking approach."
status: "completed"
date: 2023-01-01
tags: ["Python", "Optimization", "Automation"]
thumbnail:
links: {}
---

## Overview

A freelance engagement rebuilding a client's dynamic pricing system, which recalculated prices
across a large catalog on a schedule and had grown slow enough to lag behind real market
movement.

## Approach

The core loop ranks candidate price points per item against a cost/demand model, keeping only
the top-scoring candidates at each step rather than exhaustively evaluating the full price
range:

```pseudocode
\begin{algorithm}
\caption{Candidate Price Ranking}
\begin{algorithmic}
\PROCEDURE{RankPrices}{$$item, candidates, model$$}
    \STATE $$scores \gets \emptyset$$
    \FOR{$$p \in candidates$$}
        \STATE $$scores[p] \gets$$ \CALL{ExpectedMargin}{$$item, p, model$$}
    \ENDFOR
    \RETURN \CALL{TopK}{$$scores, k$$}
\ENDPROCEDURE
\end{algorithmic}
\end{algorithm}
```

## Result

| Metric | Before | After |
|---|---|---|
| Full catalog recompute | 100% (baseline) | 70% of runtime |
| Pricing efficiency | baseline | +30% |

Cutting the candidate set early, rather than scoring every possible price, was most of the
runtime win — the remainder came from batching the model calls instead of issuing them one
item at a time.
