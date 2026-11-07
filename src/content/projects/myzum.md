---
title: Myzum
order: 2
year: 2026
tags: [Android, Kotlin, NFC]
status: paused
beforeWebsite: True
summary: "A Kotlin Android app I'm building that simulates a smartphone payment terminal (SoftPOS) for small businesses: NFC tap-to-charge, refunds, a product catalog and a sales dashboard. Real payment processing is currently in progress."
---

## Overview

Myzum is an Android app I'm building in Kotlin and Jetpack Compose that turns a phone into a simulated payment terminal (SoftPOS) for small businesses and freelancers.

It covers the full merchant experience of a card terminal:

- account registration with biometric unlock,
- charging an amount by tapping on the phone's NFC antenna,
- payment history with full and partial refunds,
- a product catalog,
- a statistics dashboard that compares periods and highlights key insights.

Payments are currently simulated through a mock provider; integrating a certified payment SDK is the next milestone.

## Motivation

Small businesses usually have to rent or buy a dedicated card terminal, which means extra cost and one more device to carry, while they already have a phone with an NFC antenna in their pocket.

I wanted to understand what a payment terminal really involves beyond the "tap": accounts, refunds, transaction history and the numbers a merchant needs to run a business. I also wanted to design an app where the payment gateway could be plugged in later without rewriting everything else.

## Architecture

The app follows MVVM with a repository layer and a local Room database, using Kotlin Coroutines and Flow so the UI reacts automatically to data changes.

- **Payments behind an interface.** All charge and refund logic depends on a `PaymentProvider` interface. A mock implementation simulates the gateway today, and a real SDK (Stripe Terminal, Adyen or SumUp) can replace it without touching the UI or the repositories.
- **NFC.** A small manager enables foreground dispatch while the terminal is waiting for a payment and emits each tap as an event to the payment ViewModel.
- **Statistics.** A repository aggregates sales, refunds and averages for the selected period and the previous one. A rule-based engine turns those figures into short, prioritized insights.
- **Navigation.** A single activity with Navigation Compose and Material 3 screens grouped by feature.

**Stack:** Kotlin · Jetpack Compose · Material 3 · Room · Coroutines & Flow · Navigation Compose · Android NFC · Biometric API

## Results

The app runs end to end with simulated payments. So far I have built:

- registration and login for individual and merchant accounts, with optional biometric unlock;
- the charging flow: amount entry or catalog, waiting for an NFC tap, processing and confirmation with sound, vibration and notification;
- payment history and detail views, with full and partial refunds that update the original payment and keep a record of each refund;
- a statistics dashboard (today, 7 or 30 days) with net sales, average ticket, daily evolution, payment-method breakdown, comparison with the previous period and automatic insights;
- payout sources (cards and bank accounts) and settings.

**Next steps:** integrate a certified payment SDK as a real provider, add a backend for payment intents, and harden security and data handling.

## Challenges & lessons

- **Designing for a component I don't have yet.** Real payment processing requires PCI-certified SDKs, so I put the gateway behind an interface from the start. That let me build and test the whole app with a mock provider.
- **Refunds are trickier than charges.** Partial refunds meant tracking how much is left to refund, updating the payment status and keeping each refund as its own movement, so that history and statistics stay consistent.
- **Turning data into something useful.** Showing totals wasn't enough. Comparing with the previous period and generating short insights made the dashboard actually informative for a merchant.
- **What I would do differently.** I learned the hard way that money shouldn't be stored as `Double`, that schema changes need proper Room migrations, and that passwords and personal data must be hashed and encrypted even in a local database. These are next on my list.