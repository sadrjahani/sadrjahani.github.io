---
layout: research-project
order: 8
title: "E-Commerce Pipeline Automation"
subtitle: "Automated data pipelines and marketing-data optimization for an e-commerce platform's decision-making."
description: "Automated SQL/Python data pipeline built at Sabke Zandegi Khallagh (Mihan GP)."
status: "completed"
date: 2022-09-01
tags: ["Data Engineering", "Automation", "SQL"]
thumbnail:
links: {}
---

## Overview

At Sabke Zandegi Khallagh (Mihan GP), marketing and sales data was being pulled and joined by
hand ahead of every planning cycle. This project replaced that manual process with a
scheduled pipeline.

## Pipeline step

Each run pulls the latest orders, joins them against the campaign attribution table, and
writes a refreshed summary table the marketing team's dashboards read from directly:

```sql
INSERT INTO marketing_summary
SELECT
    o.campaign_id,
    COUNT(o.order_id)      AS orders,
    SUM(o.total_amount)    AS revenue,
    DATE_TRUNC('day', o.created_at) AS day
FROM orders o
JOIN campaign_attribution c ON c.order_id = o.order_id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '1 day'
GROUP BY o.campaign_id, day;
```

## Result

Reporting turnaround for the marketing team went from an end-of-week manual pull to a same-day
refreshed dashboard, freeing up the time that had previously gone into assembling the numbers
by hand.
