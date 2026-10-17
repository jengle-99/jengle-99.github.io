---
layout: default
title: Databases Narrative
---

# Databases Enhancement

[Home](../) | [Travlr Artifact](../artifacts/travlr/) | [Software Design Narrative](software-design.html) | [Algorithms Narrative](algorithms.html)

## Artifact Description

The artifact I continued to use is the Travlr Getaways full-stack web application that I created in CS 465 in 2026. It uses an Express and Node.js backend, MongoDB through Mongoose, a customer-facing website, and an Angular administrative application. The database enhancement built on the previous two enhancement stages and focused on persistent data integrity and security.

## Why I Selected the Artifact and How I Improved It

Travlr was a good fit for the database enhancement because it already stores trip records and user accounts in MongoDB. I strengthened the trip schema with minimum and maximum string lengths, required values, and a unique trip code that accepts only letters, numbers, and hyphens. User email addresses are trimmed, converted to lowercase, checked for valid format, and protected by a unique index.

The application also now includes an `auditLogs` collection for successful logins, failed logins, trip creation, and trip modification. Audit records store the event type, user identifier, timestamp, and affected resource, but do not store passwords, password hashes, JWTs, or IP addresses. Additional indexes support review by timestamp and event type.

## Data Migration and Audit Behavior

Stronger constraints can create problems when records were originally stored under looser rules, so I added a migration process rather than assuming the existing database already matched the new schemas. A dry-run mode identifies proposed changes before data is modified. Safe updates normalize non-conflicting email addresses, convert invalid trip-code characters to hyphens, and resolve duplicate trip codes with numeric suffixes.

Normalized-email collisions are treated differently because automatically merging or deleting accounts could damage valid user data. Those conflicts are flagged for manual review. Instructor feedback specifically identified this decision as a good example of protecting data integrity.

The audit system uses fail-closed behavior. A successful login does not issue a JWT when its required audit entry cannot be stored. Trip creation or modification attempts to roll back the database change when its audit record fails so the operation does not appear successful without the required audit trail.

## Skills Demonstrated and Course Outcomes

This enhancement demonstrates Mongoose schema design, validation, normalization, uniqueness constraints, index selection, database migration, audit logging, and handling data-integrity failures. It makes the strongest progress toward Course Outcomes 3, 4, and 5. Outcome 3 is represented by evaluating design trade-offs such as stronger validation versus compatibility with existing records. Outcome 4 is supported through database tooling, migration, and testing practices. Outcome 5 is demonstrated through explicit validation, restricted audit contents, unique identifiers, and security-focused logging.

## Reflection on the Enhancement Process

The largest lesson from this enhancement was that stricter database rules cannot be treated as only a schema change. Existing persistent records have to be considered before unique indexes or new validation requirements are enabled. The migration process gave me a way to separate changes that could be made safely from conflicts that required human review.

The work also made the difference between in-memory and persistent data more concrete. The failed-login tracker from the algorithms enhancement is intentionally in memory, while audit data is stored in MongoDB and survives process restarts. If the application were later scaled across multiple servers, the same shared-storage concepts could be applied to the login-attempt state.

Instructor feedback confirmed that the enhancement meaningfully improved validation, normalization, uniqueness, indexing, audit logging, migration handling, and compatibility with existing records. The feedback also reinforced the importance of planning database changes around data that already exists instead of only designing for new records.

[Download the Word Narrative]("../downloads/CS-499 Milestone 4 Narrative.docx")
