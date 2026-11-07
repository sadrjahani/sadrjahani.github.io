---
layout: research-project
order: 4
title: "Neo4j Semantic Search for LLM Applications"
subtitle: "Consent-based data collection on GCP feeding a Neo4j graph that powers semantic search for LLM applications — built at Goodfolio."
description: "Consent-based data pipelines on Google Cloud and Neo4j-backed semantic search for LLM applications, built at Goodfolio."
status: "completed"
date: 2025-02-01
tags: ["Neo4j", "RAG", "GCP"]
thumbnail:
links: {}
---

## Overview

Built at Goodfolio (London, remote) as part of a UK-based product team: a data pipeline that
collects professional profile data **only from users who voluntarily share it with explicit
permission**, models it in a Neo4j graph, and lets LLM applications retrieve relevant
insights through semantic search.

## Consent-based data collection

Users shared professional profile data (for example from LinkedIn) through Google Forms and
other Google Workspace tools, with explicit permission. The data flowed into Google Cloud
Platform, where LLMs analyzed it to power end-to-end service delivery.

```mermaid
flowchart TB
    A[Users share data with explicit permission] --> B[Google Forms / Workspace]
    B --> C[GCP pipeline]
    C --> D[(Neo4j graph)]
    D --> E[LLM application: semantic search]
    classDef io fill:#2F3E56,stroke:#2F3E56,color:#F8FAFB
    classDef store fill:#EAF3F2,stroke:#587880,color:#1F2D40
    classDef tool fill:#F8FAFB,stroke:#44688F,color:#1F2D40
    class A,E io
    class D store
```

## Graph-backed semantic search

Neo4j graph databases model the relationships in the collected data so an LLM application can
retrieve relevant context for a question instead of relying on plain keyword or vector lookup
alone.

## Prompting

Few-shot and structured prompting raised LLM output accuracy in production.

## Results

| Metric | Change |
|---|---|
| Relevant data-insight retrieval | ~30% improvement |
| LLM output accuracy | ~15% improvement |
