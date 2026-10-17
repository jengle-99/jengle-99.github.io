---
layout: default
title: Travlr Getaways Artifact
---

# Travlr Getaways

[Home](../../) | [Code Review](../../code-review/) | [Software Design Narrative](../../narratives/software-design.html) | [Algorithms Narrative](../../narratives/algorithms.html) | [Database Narrative](../../narratives/databases.html)

## Artifact Overview

Travlr Getaways is a full-stack web application originally created in CS 465 in 2026. The application includes a Node.js and Express backend, MongoDB through Mongoose, a customer-facing website, and an Angular administrative application.

## Original Artifact

The original application supported user registration and login, JWT authentication, trip retrieval, and authenticated trip management. This version serves as the baseline used during the CS 499 code review.

[Browse the Original Source](original/)

## Final Enhanced Artifact

The final enhanced version incorporates all three CS 499 enhancement stages.

[Browse the Final Enhanced Source](enhanced/)

## Enhancement One: Software Design and Engineering

The first enhancement improved the application's security architecture and maintainability.

Changes included:

- Reusable JWT authentication middleware.
- Role-based authorization with `user` and `admin` roles.
- Angular route guards for administrative pages.
- Admin-only trip-management controls.
- Stronger server-side request validation.
- Improved authentication error handling.
- Security-focused tests.

[Read the Software Design Narrative](../../narratives/software-design.html)

## Enhancement Two: Algorithms and Data Structures

The second enhancement added a failed-login tracking algorithm using a JavaScript `Map` keyed by normalized email address.

The algorithm:

1. Removes failed-attempt timestamps older than 30 minutes.
2. Counts the remaining attempts in the active window.
3. Locks the email address after five failed attempts.
4. Keeps the lock active for 30 minutes.
5. Clears the stored attempt history after a successful login.

The design provides fast lookup for one account while also demonstrating the trade-off between simple in-memory state and persistent or shared state in a multi-server environment.

[Read the Algorithms Narrative](../../narratives/algorithms.html)

## Enhancement Three: Databases

The third enhancement strengthened data integrity, validation, and accountability.

Changes included:

- Mongoose string-length and format validation.
- Normalized lowercase email storage.
- Unique user-email and trip-code indexes.
- Restricted trip-code characters.
- A security audit-log collection.
- Audit indexes by timestamp and event type.
- Migration utilities for existing data.
- Manual review for unsafe normalized-email collisions.
- Fail-closed behavior when required audit records cannot be stored.
- Database-focused tests.

[Read the Database Narrative](../../narratives/databases.html)

## Final Architecture Summary

The enhancement sequence changed the project from a basic authenticated full-stack application into a more secure and maintainable system with explicit authorization, algorithmic protection against repeated login attempts, stronger persistent-data validation, migration support, and audit logging.
