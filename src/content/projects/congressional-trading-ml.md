---
title: Congressional Trading ML
order: 1
year: 2026
tags: [Machine Learning, Quantitative Finance]
status: paused
beforeWebsite: True
summary: Parsing U.S. Congress stock-trade disclosures to test whether copying politicians can beat the S&P 500.
featured: True
links:
  github: https://github.com/Fyced/EEUUSenate
---

## Overview

End-to-end data pipeline that collects and analyzes the stock trades disclosed by members of the U.S. House of Representatives (2017–2026).

- **ETL from unstructured PDFs:** downloads thousands of Periodic Transaction Reports from the House Clerk and parses them into a clean tabular dataset with `pdfplumber`.
- **Feature engineering:** sector lookup and price history for ~1,350 tickers via yfinance.
- **Analysis & modeling:** Random Forest feature importance and rule-based filters.
- **Event-driven backtest:** portfolio simulator benchmarked against SPY buy & hold.

## Motivation

Members of the U.S. Congress are legally required to disclose their stock trades under the STOCK Act, and their portfolios have become a recurring topic in the news and on social media. A whole ecosystem of trackers, copy-trading apps and even ETFs has grown around a simple idea: *if politicians have an information edge, just copy them.*

I wanted to test that idea with data instead of headlines. That raised two questions:

- **Does it actually work?** Do congressional purchases beat the market once you account for the fact that they are only made public days or weeks later?
- **If not all of them, which ones?** Can factors such as who trades, in which sector, how late the trade is reported or the market conditions identify the trades worth following?

The project was also an engineering challenge. The data exists only as thousands of inconsistently formatted PDF filings, so answering either question first meant building a pipeline to turn those documents into a dataset that could be analyzed.


## Architecture

The project is a four-stage Python pipeline, from raw government PDFs to a backtested strategy.

**1. Data acquisition.** A downloader fetches the yearly filing index from the House Clerk and retrieves thousands of Periodic Transaction Report PDFs in parallel (`ThreadPoolExecutor`, 20 workers), logging every failed request per year.

**2. PDF extraction.** The filings have no consistent table structure, so the parser locates the column headers on each page with `pdfplumber` and builds the column boundaries from their positions. It then:

- rebuilds transactions split across rows or pages,
- extracts the ticker and asset type,
- parses the trade and notification dates,
- normalizes the disclosed amount ranges.

Malformed records go to error logs instead of stopping the run.

**3. Feature engineering.** Each purchase is enriched with:

- its sector (Yahoo Finance, with retries and randomized delays to handle rate limits),
- the reporting delay,
- the market regime (SPY vs. its 50-day moving average),
- the member's recent trading activity,
- a "herding" signal: how many members bought the same ticker in the previous 15 days.

**4. Modeling and backtesting.** Trades are entered on their public notification date and held for 19 days, and the target is whether they beat the S&P 500 over that window. A Random Forest (1,500 trees) is used to explore which variables matter, and the findings are turned into simple, interpretable filters. These filters are tested in an event-driven portfolio simulator with capital constraints ($10k, fixed position size, signals skipped when cash runs out), benchmarked against SPY buy & hold.

## Stack

- Python
- pandas
- pdfplumber
- scikit-learn
- yfinance
- Matplotlib
- Jupyter

## Results

The project went through three iterations, each building on the previous one.

### 1. Baseline: copying every purchase

The first experiment simply copied every disclosed purchase (6,364 trades from 2021–2025, $1,000 each, held for 19 days) and compared it with investing the same amount in the S&P 500 over the same windows.

| | Copy all purchases | S&P 500 |
|---|--:|--:|
| Total P&L | $74.1k | $55.5k |
| Trades with a positive return | 55.5% | 63.5% |
| Average return per trade | 1.16% | 0.87% |

Copying Congress beat the index on total return, but with a lower hit rate: the gains were concentrated in fewer, stronger trades. The same notebook also includes:

- a per-member ranking, which showed big differences between politicians and that the most active traders were not the most profitable;
- a holding-period sweep (1–59 days) that was used to choose the **19-day window** for the following stages.

### 2. Feature engineering, Random Forest and rules

The second iteration added the engineered features and used a Random Forest to find which variables matter. The target was whether a trade beat the S&P 500 over 19 days. The findings were turned into simple filters:

| Filter | Trades | Beat the S&P 500 |
|---|--:|--:|
| All purchases (baseline) | 11,186 | 48.8% |
| Selected members only | 727 | 65.6% |
| Energy & Real Estate | 1,096 | 51.6% |
| Sector + reporting delay | 521 | 55.5% |
| **Combined filter** | **1,158** | **61.7%** |

In a portfolio simulation that starts with $10,000 and reinvests from 2020 to 2025 ($1,000 per position), the combined filter ends at **$26.2k**, against **$23.4k** for the S&P 500.

### 3. Final strategy and backtest

The last iteration cleaned up the pipeline and stress-tested the strategy year by year. Each year starts from $10,000, with $750 per position.

| Year | S&P 500 | Strategy | Difference |
|---|--:|--:|--:|
| 2020 | $11,724 | $10,535 | −$1,189 |
| 2021 | $13,051 | $13,891 | +$841 |
| 2022 | $8,135 | $12,748 | **+$4,613** |
| 2023 | $12,671 | $11,170 | −$1,501 |
| 2024 | $12,559 | $11,100 | −$1,459 |
| 2025 | $11,801 | $11,588 | −$213 |

As a single continuous portfolio from January 2020, the strategy ends at **$27.8k**, against **$22.2k** for SPY buy & hold. Most of the edge comes from the 2022 bear market.

### Key takeaways

- Copying Congress blindly beats the index on average return, but most of the gain comes from a minority of trades.
- **Who** trades matters far more than the sector or the reporting delay.
- The edge depends on market conditions: it is strong in downturns and weak in bull years.

**Caveats.** Results are in-sample: the filters were chosen and evaluated on the same data, and the backtests ignore transaction costs. Next step: walk-forward validation.

## Challenges & lessons

**PDFs without a consistent table structure.** Each filing lays out its
table differently, so fixed column positions broke on almost every file.
I switched to locating the column headers on each page and building the
column boundaries from their positions. Lesson: when the input format is
unreliable, anchor the parser to something stable (here, the headers)
instead of to fixed coordinates.

**Transactions split across rows and pages.** Long asset names wrap onto
a second line, and some transactions continue on the next page, which
produced half-records with no ticker or no date. The parser now detects
incomplete rows and merges them with the following one before validating.
Records that still fail go to an error log instead of stopping the run,
so one bad file doesn't cost a full re-download.

**Avoiding look-ahead bias in the backtest.** My first backtest bought on
the trade date, but that information only becomes public when the filing
is published, often weeks later. Using the notification date instead
lowered the results noticeably. Lesson: in a backtest, every decision
must use only what was publicly known at that moment.