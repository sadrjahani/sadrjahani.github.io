---
layout: research-project
order: 9
title: "Market Intelligence Web Scraping"
subtitle: "Automated collection of competitor and market data to feed pricing and demand models."
description: "Freelance web scraping pipeline for market intelligence, feeding the pricing optimizer."
status: "completed"
date: 2023-03-01
tags: ["Python", "Web Scraping", "Market Intelligence"]
thumbnail:
links: {}
---

## Overview

A companion piece to the [Dynamic Pricing Optimizer](/projects/dynamic-pricing-optimizer/),
built during the same freelance engagement: the pricing model is only as good as the market
data feeding it, so this project automated the collection of competitor prices and demand
signals that had previously been gathered by hand.

## Approach

A scheduled scraper walks a set of competitor listing pages, extracts price and availability,
and normalizes everything into a shared schema regardless of which site it came from:

```python
def scrape_listing(url, parser):
    """Fetch and normalize a single competitor listing."""
    response = fetch_with_backoff(url)
    raw = parser.extract(response.text)
    return {
        "sku": normalize_sku(raw["sku"]),
        "price": parse_price(raw["price"]),
        "in_stock": raw["availability"] == "available",
        "scraped_at": now_utc(),
    }
```

Retry-with-backoff and per-domain rate limiting kept the scraper polite and stable against
sites that rotated their markup periodically — a per-site `parser` adapter meant a markup
change only broke one adapter, not the whole pipeline.

## Result

Feeding fresher, more complete competitor data into the pricing model was a direct input into
the 30% efficiency gain described in the pricing optimizer write-up — stale market data had
been causing the model to misprice against competitors who'd already moved.
