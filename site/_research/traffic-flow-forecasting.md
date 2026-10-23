---
layout: research-project
order: 6
title: "Traffic Flow Forecasting"
subtitle: "Predictive models comparing LSTM, XGBoost, ARIMA, and Prophet for vehicular traffic-flow prediction."
description: "Time-series forecasting comparison for vehicular traffic flow at IASBS."
status: "completed"
date: 2022-03-01
tags: ["Time-Series", "LSTM", "Prophet"]
thumbnail:
links: {}
---

## Overview

Research work at IASBS comparing four forecasting approaches on vehicular traffic-flow data,
to see which handled the sharp, recurring peaks of rush-hour traffic best.

## Comparison

| Model | MAE | Handles seasonality |
|---|---|---|
| ARIMA | moderate | manually specified |
| Prophet | moderate | automatic |
| XGBoost | low | via engineered features |
| LSTM | lowest | learned implicitly |

## Takeaway

LSTM captured the sharp rush-hour peaks most accurately, but at a real cost in training time
and tuning effort — XGBoost with well-chosen lag and calendar features came close at a
fraction of the compute, which matters when the model needs to be retrained regularly on
fresh data.
