---
layout: research-project
order: 2
title: "ReAct Agent From Scratch"
subtitle: "A ReAct (Reasoning + Acting) agent built in plain Python without agent frameworks, with a provider-agnostic LLM wrapper."
description: "ReAct agent in plain Python (uv, Ollama) with a provider-agnostic LLM wrapper for Anthropic, OpenAI and local Ollama models."
status: "in progress"
date: 2026-10-20
tags: ["AI Agents", "Python", "Ollama"]
thumbnail:
links:
  code: "https://github.com/sadrjahani/react-agent-from-scratch"
---

## Overview

A ReAct (Reasoning + Acting) agent written in plain Python, deliberately without agent
frameworks, to understand exactly how the reason-act-observe loop works before building the same
system with LangChain. The project has just started and is under active development.

## What exists so far

- **Provider-agnostic LLM wrapper:** one interface for Anthropic, OpenAI and local Ollama models, selected through environment variables, so the agent code does not depend on a specific provider.
- **Tooling:** Python project managed with `uv`; local models run through Ollama.

## Status

In progress. The agent loop, tools and evaluation are being built in the public repository, which
is the source of truth for current status.
