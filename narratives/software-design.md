---
layout: default
title: Software Design and Engineering Narrative
---

# Software Design and Engineering Enhancement

[Home](../) | [Travlr Artifact](../artifacts/travlr/) | [Algorithms Narrative](algorithms.html) | [Database Narrative](databases.html)

## Artifact Description

The artifact I selected is the Travlr Getaways full-stack web application that I created in CS 465 in 2026. The project has an Express and Node.js backend, MongoDB through Mongoose, a customer-facing website, and an Angular administrative application. The original version already supported user registration and login, JSON Web Token authentication, and the ability to add or edit trip information after logging in.

## Why I Selected the Artifact and How I Improved It

I chose Travlr Getaways because it gave me a working application that I could improve instead of starting over with a new project. It also fits my Information Security focus because the application already had authentication and protected API requests, but there were areas where the security design could be stronger. For this enhancement, I moved JWT verification out of the API route file and into reusable middleware, corrected the authentication flow so a protected controller only runs after the token is successfully verified, and added role-based authorization for administrative actions. New accounts are assigned the user role, while an administrator role has to be assigned separately in MongoDB. I also added an Angular route guard so non-admin users cannot directly open the Add Trip or Edit Trip pages, and I changed the interface so those controls are only shown to administrators.

## Skills Demonstrated and Course Outcomes

This enhancement let me work with software architecture, reusable middleware, authentication, authorization, Angular route guards, server-side validation, error handling, and testing. I also added validation middleware for trip write requests so the API checks the data instead of relying only on the Angular form. The work made direct progress toward the course outcomes I planned in Module One. Outcome 4 is shown through the use of reusable middleware, route guards, and testing to improve the existing design. Outcome 5 is the strongest match because the changes address access-control weaknesses and make the server less dependent on client-side checks. The written narrative and code comments also support Outcome 2 by explaining what changed and why.

## Reflection on the Enhancement Process

The biggest thing I learned from this enhancement was the difference between authentication and authorization in an actual application. The original project could tell whether someone had a valid token, but that did not mean every authenticated user should be able to perform administrative actions. Adding roles made that difference much clearer. I also had to think about what should happen to older accounts that do not have a role yet, so I chose to treat them as normal users instead of giving them administrative access by default.

Another issue I corrected was the original JWT middleware calling `next()` outside the verification callback, which could allow the request flow to continue even when verification failed. Moving that logic into its own middleware made the flow easier to follow and test. I added security-focused middleware tests for valid administrator tokens, missing tokens, rejected non-admin users, and trip validation. Later access-control edge-case tests also covered missing roles and malformed JWTs in response to instructor feedback.

[Download the Word Narrative]("../downloads/CS-499 Milestone 2 Narrative.docx")
