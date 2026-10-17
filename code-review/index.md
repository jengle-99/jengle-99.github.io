---
layout: default
title: Informal Code Review
---

# Informal Code Review

[Home](../) | [Travlr Artifact](../artifacts/travlr/) | [Narratives](../narratives/software-design.html)

The code review examines the original Travlr Getaways application before the CS 499 enhancements were implemented. It explains the existing functionality, identifies weaknesses and limitations, and describes the planned enhancements for software design and engineering, algorithms and data structures, and databases.

## Code Review Video

[Watch the CS 499 Code Review](https://drive.google.com/file/d/1s2B_mEk7c8uZ1Qtu7NxivgR94mrMH6LN/view?usp=sharing)

## Areas Reviewed

### Software Design and Engineering

The original project included authentication and protected administrative requests, but authentication and authorization responsibilities were not fully separated. The review identified reusable middleware, role-based authorization, route protection, stronger server-side validation, and testing as practical improvements.

### Algorithms and Data Structures

The original login process checked credentials one request at a time but did not track repeated failed attempts over time. The planned enhancement used a `Map` and timestamp-based sliding window to solve that security problem.

### Databases

The original MongoDB schemas provided basic storage for users and trips but had limited validation, integrity controls, indexing, and security auditing. The planned database enhancement addressed those weaknesses through validation, normalization, uniqueness constraints, migration handling, and audit logging.

## Resulting Enhancement Sequence

1. Software Design and Engineering: reusable JWT middleware, role-based access control, Angular guards, validation, and security testing.
2. Algorithms and Data Structures: failed-login tracking with a `Map`, timestamps, and a 30-minute sliding window.
3. Databases: stronger schemas, unique and normalized data, migration tooling, indexing, and audit logging.
