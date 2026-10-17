---
layout: default
title: Computer Science ePortfolio
---

# Computer Science ePortfolio

**Information Security Focus**

[Code Review](code-review/) | [Travlr Artifact](artifacts/travlr/) | [Software Design Narrative](narratives/software-design.html) | [Algorithms Narrative](narratives/algorithms.html) | [Database Narrative](narratives/databases.html)

## Professional Self-Assessment

Completing the Computer Science program and building this ePortfolio gave me a clearer way to connect the individual technical skills I developed into a single professional skill set. Throughout the program, I worked with software development, databases, networking, testing, algorithms, and secure coding. The capstone required me to revisit an existing application, identify weaknesses, improve it in multiple stages, and explain why those changes mattered. That process helped me move beyond simply making software function and focus more on how design decisions affect maintainability, security, data integrity, and the people who use a system. Those areas directly support my career goal in Information Security because security work requires understanding how applications are designed, how data moves between components, and where technical assumptions can create weaknesses.

Most of my academic work was completed individually, so my strongest example of collaboration comes from my work on the GearFit program. I worked as a software developer on an Agile Scrum-style team and contributed to testing, user-interface work, backend development, and some database work. Working in that environment required coordinating technical work with other team members rather than treating each task as an isolated assignment. It also showed me why clear requirements, incremental development, testing, and communication matter when several people are contributing to the same product. That experience gave me practical exposure to collaborative development practices that complement the individual technical work shown in this portfolio.

Communication became just as important as implementation during that work. I was responsible for a large portion of a project briefing delivered to senior leadership and elected officials, including a general officer, a senator, and a member of Congress. The audience was different from a group of developers, so the technical details had to be presented in a way that explained the value, status, and purpose of the project without relying on source-code-level explanations. That experience reinforced the importance of adapting technical communication to the audience. In the capstone, I applied the same idea through the code review, written narratives, and ePortfolio by explaining not only what I changed, but why the changes were useful and what trade-offs were involved.

The program also gave me experience outside the Travlr artifact that helped broaden my technical background. Networking coursework included working with routing concepts and Packet Tracer, while mobile-development work exposed me to application integration using technologies such as Dio and Mapbox. Other programming assignments required data processing, debugging, and working with different software structures. These experiences helped me become more comfortable learning unfamiliar tools and understanding how separate parts of a computing environment interact. That broader background is useful in Information Security because vulnerabilities and failures often occur at the boundaries between applications, networks, data stores, and users rather than inside only one component.

The Travlr Getaways artifact brings together the strongest technical areas I wanted to demonstrate. In the Software Design and Engineering enhancement, I separated authentication and authorization responsibilities, added reusable JWT middleware, implemented role-based authorization, protected administrative routes in Angular, improved server-side validation, and expanded security testing. This work demonstrates software architecture, secure coding, testing, and the ability to improve an existing design without changing its main purpose. It also shows why authentication alone is not enough when different users require different privileges.

The Algorithms and Data Structures enhancement addressed repeated failed login attempts. I implemented a JavaScript `Map` keyed by normalized email address and used timestamps to create a sliding 30-minute window. Five failed attempts within that period temporarily lock the account for 30 minutes, while successful authentication clears the stored history. This enhancement demonstrates how an appropriate data structure can make a security control easier to implement and test. It also required evaluating a design trade-off: an in-memory `Map` is simple and efficient for a single process, but it does not persist across restarts or automatically share state across multiple servers.

The Databases enhancement focused on data integrity and accountability. I strengthened Mongoose validation, normalized user email addresses, added uniqueness constraints and indexes, restricted trip-code formats, created a security audit-log collection, and added migration logic for older records. I also chose not to automatically merge or delete accounts when normalized email addresses collide because doing so could damage valid user data. Instead, unsafe conflicts are flagged for manual review. This enhancement reinforced that database changes have to account for existing persistent data, not only the ideal schema for new records.

Together, the three enhancement stages demonstrate the five Computer Science program outcomes across the portfolio. The collaboration outcome is supported by my Agile Scrum team experience and by communicating technical decisions to different audiences. Professional communication is represented by the code review, narratives, stakeholder briefing experience, and organization of this ePortfolio. Algorithmic problem solving is demonstrated by the sliding-window login protection and its design trade-offs. Professional computing techniques are shown through full-stack development, testing, middleware, migration tooling, and database design. The security outcome ties the portfolio together through access control, failed-login protection, explicit validation, audit logging, and data-integrity decisions.

My goal is to continue into Information Security with a strong understanding of how software is actually built and maintained. The work represented here shows that I can examine an existing system, identify weaknesses, implement practical improvements, test those changes, and explain the reasoning behind them. More importantly, the capstone helped me see security as something that should be considered throughout architecture, algorithms, databases, testing, and communication rather than as a separate feature added at the end.

## Portfolio Overview

This ePortfolio uses one multifaceted artifact, **Travlr Getaways**, to demonstrate growth in three areas of computer science:

- **Software Design and Engineering:** reusable authentication middleware, role-based authorization, Angular route protection, server-side validation, and security testing.
- **Algorithms and Data Structures:** a `Map`-based sliding-window failed-login tracker with a temporary lockout mechanism.
- **Databases:** stronger Mongoose validation, normalized and unique data, indexing, migration handling, and security audit logging.

## Course Outcome Evidence

### Collaboration and Decision Making

- Agile Scrum-style teamwork on GearFit.
- Technical coordination across development, testing, UI, backend, and database work.
- Project briefing adapted for senior leadership and elected officials.

### Professional Communication

- Informal code review video.
- Enhancement narratives.
- Technical documentation and organized ePortfolio presentation.

### Algorithms and Design Trade-Offs

- Sliding-window login-attempt algorithm.
- `Map` keyed by normalized email address.
- Evaluation of in-memory state versus persistent/shared storage.

### Professional Computing Techniques

- Full-stack Node.js, Express, Angular, MongoDB, and Mongoose development.
- Reusable middleware and route guards.
- Automated testing and migration tooling.

### Security Mindset

- Authentication and role-based authorization.
- Failed-login protection.
- Explicit input and schema validation.
- Audit logging and data-integrity protections.

## Continue Through the Portfolio

1. [Watch the Code Review](code-review/)
2. [Review the Travlr Artifact](artifacts/travlr/)
3. [Read the Software Design and Engineering Narrative](narratives/software-design.html)
4. [Read the Algorithms and Data Structures Narrative](narratives/algorithms.html)
5. [Read the Databases Narrative](narratives/databases.html)
