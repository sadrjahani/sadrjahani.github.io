---
layout: research-project
order: 2
title: "ReAct Agent From Scratch"
subtitle: "A ReAct (Reasoning + Acting) agent built in plain Python, without agent frameworks."
description: "ReAct agent in plain Python that switches between Anthropic, OpenAI and local Ollama models, calls tools in a Thought, Action, Observation loop and handles malformed output and tool errors."
status: "in progress"
date: 2026-10-20
tags: ["AI Agents", "Python", "Ollama"]
thumbnail:
links:
  code: "https://github.com/sadrjahani/react-agent-from-scratch"
---

## Overview

A ReAct (Reasoning + Acting) agent built in plain Python, without agent frameworks. It switches
between Anthropic, OpenAI and local Ollama models through a single chat function, calls tools in a
Thought → Action → Observation loop, and handles malformed model output and tool errors
gracefully. It is built to understand what agent frameworks do under the hood, and is later
rebuilt with LangChain for comparison.

## Key features

- **One interface, three providers:** Anthropic, OpenAI and local Ollama models behind a single chat function, selected through environment variables.
- **Thought → Action → Observation loop:** the agent reasons, calls a tool, reads the result and repeats until it can answer.
- **Defensive handling:** malformed model output and tool errors are caught and handled instead of crashing the loop.
- **Tested:** the project uses `pytest`.

## Tech

Python · uv · pytest · Anthropic API · OpenAI API · Ollama

## Status

In progress. Source and updates are in the public repository.
