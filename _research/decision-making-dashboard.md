---
layout: research-project
order: 10
title: "Decision-Making Dashboard"
subtitle: "A management dashboard consolidating network and infrastructure health for faster operational decisions."
description: "Management dashboard built as an IT Expert at Arian Saeed Industrial Groups (ASIGI)."
status: "completed"
date: 2018-06-01
tags: ["Dashboard Design", "Infrastructure", "Reporting"]
thumbnail:
links: {}
---

## Overview

As an IT Expert at Arian Saeed Industrial Groups (ASIGI), I supported virtualization servers,
printers, and the broader network — and noticed that leadership was making infrastructure
decisions (when to provision more capacity, which sites needed attention) from scattered
status emails rather than any single source of truth. This project consolidated that into one
dashboard.

## What it tracked

<figure class="research-figure">
  <img src="{{ '/assets/img/dashboard-mockup.svg' | relative_url }}" alt="Illustrative mockup of an infrastructure operations dashboard with KPI cards, uptime and incident charts, a service status table and a capacity gauge">
  <figcaption>Illustrative mockup of the dashboard layout (sample values, not real data): KPI cards, trends, service status and capacity.</figcaption>
</figure>

| Metric | Refresh | Audience |
|---|---|---|
| Server & virtualization uptime | Hourly | IT team |
| Printer fleet status | Daily | Office admin |
| Network incident count | Daily | Leadership |
| Capacity headroom | Weekly | Leadership |

## Result

Leadership could check current infrastructure status in one place instead of waiting on an
email summary, which shortened the lag between an emerging capacity issue and the decision to
act on it.
