---
layout: default
title: Algorithms and Data Structures Narrative
---

# Algorithms and Data Structures Enhancement

[Home](../) | [Travlr Artifact](../artifacts/travlr/) | [Software Design Narrative](software-design.html) | [Database Narrative](databases.html)

## Artifact Description

The artifact I continued to use is the Travlr Getaways full-stack web application that I created in CS 465 in 2026. It includes an Express and Node.js backend, MongoDB through Mongoose, a customer-facing website, and an Angular administrative application. This enhancement built on the software-design version rather than returning to the original project.

## Why I Selected the Artifact and How I Improved It

I kept Travlr Getaways for the algorithms and data structures enhancement because the login process provided a security problem that could be solved with an actual data structure instead of adding an unrelated feature. The original login flow checked each attempt independently and did not track repeated failures over time. I added a login-attempt tracker that uses a JavaScript `Map` keyed by normalized email address. Each entry stores recent failed-login timestamps and, when necessary, the time at which the account lock expires.

Failed attempts older than 30 minutes are removed from the active window. If five failed attempts occur within that 30-minute period, the email address is locked for 30 minutes. A successful login clears the stored attempt history.

## Skills Demonstrated and Course Outcomes

This enhancement gave me a practical way to work with a `Map`, timestamp data, filtering, branching logic, and a sliding time window. I separated the tracking logic into its own class so I could test time-dependent behavior without waiting for real 30-minute intervals. The strongest match is Course Outcome 3 because I used an algorithm and data structure to solve a specific problem and evaluated the trade-offs involved. It also supports Outcome 4 through testing and modular design, and Outcome 5 because it addresses repeated failed login attempts as a security concern.

## Reflection on the Enhancement Process

The main thing I learned was that the choice of data structure affects how straightforward the security check is to perform. Using the email address as the `Map` key makes it possible to retrieve one account's attempt history directly instead of searching through every failed attempt in the application.

I tested conditions around the threshold rather than only the normal path: fewer than five failures, the fifth failure, an active lock, lock expiration, timestamps leaving the sliding window, reset after successful authentication, and email normalization. I also kept the previous access-control protections in place and expanded edge-case testing.

One limitation is that the `Map` exists in process memory. Restarting the application clears the state, and separate application instances would not share the same lock information. Instructor feedback specifically identified this as an important design consideration. A scaled production implementation would need a shared or persistent store while preserving the same basic sliding-window behavior.

[Download the Word Narrative]("../downloads/CS-499 Milestone 3 Narrative - Engle.docx")
