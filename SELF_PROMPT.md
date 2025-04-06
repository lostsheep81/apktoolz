# Self-Prompt for Development

This document is intended to foster a culture of continuous improvement. Use the following self-prompts regularly to evaluate your current development and testing processes, and to adjust your approach as your project evolves.

---

## 1. Testing and Quality Assurance

- **Test Coverage & Effectiveness**
  - Are all critical paths covered by tests (unit, integration, end-to-end)?
  - Is the test coverage threshold being met, and if not, which areas need more tests?
  - Do the tests effectively isolate and simulate real-world usage?
  - _Implementation_: Run `npm test -- --coverage` weekly and add the results to a tracking document to monitor trends.

- **Reliability & Performance**
  - Are tests running efficiently without frequent timeouts or open handle warnings?
  - Which tests take the longest to run, and can they be optimized or parallelized?
  - Are there intermittent failures (flaky tests) that need closer investigation?
  - _Implementation_: Add Jest's `--logHeapUsage` and `--detectOpenHandles` flags to identify resource-intensive tests.

- **Environment & Mocks**
  - Are all environment variables correctly set and isolated for testing purposes?
  - Are the global mocks (bcrypt, mongoose, bullmq, etc.) in `jest.setup.js` up-to-date and relevant?
  - Do we need to introduce additional mocks or adjust existing ones as new dependencies are added?
  - _Implementation_: Review mock implementations monthly against actual implementation changes.

- **APK Analysis-Specific Testing**
  - Are we testing with a diverse set of APK files (malware, clean apps, different Android versions)?
  - Do our tests simulate the various failure modes of APK decompilation and analysis?
  - Are there tests to verify proper sanitization and validation of APK inputs?
  - _Implementation_: Create a test fixture library with sample APKs representing different scenarios.

---

## 2. Documentation and Developer Workflow

- **Documentation Clarity**
  - Is each documentation file (TESTING.md, NEXT_STEPS.md, TROUBLESHOOTING.md, FUTURE_ENHANCEMENTS.md, WRAP_UP.md) up-to-date with the latest processes and changes?
  - Are the instructions clear and actionable for new team members or external collaborators?
  - _Implementation_: Schedule documentation reviews coinciding with sprint reviews.

- **Process Transparency**
  - Are CI/CD integration details (see CI_INTEGRATION_GUIDE.md) clearly documented and easily accessible to the team?
  - Are the change logs or commit messages providing enough context for subsequent reviews of why and how changes were made?
  - _Implementation_: Adopt a commit message template with sections for "What", "Why", and "How".

- **Knowledge Architecture**
  - Is architectural knowledge documented with diagrams showing component relationships?
  - Do we maintain a glossary of domain-specific terms related to APK analysis?
  - Are key algorithms and analysis techniques documented with explanations and citations?
  - _Implementation_: Create a visual diagram of the APK analysis pipeline that can be updated quarterly.

---

## 3. CI/CD Pipeline Integration

- **Automation and Reliability**
  - Are both backend and frontend tests integrated and running smoothly through the CI/CD pipeline?
  - Are there any failing builds in CI/CD that require adjustments in dependencies or configuration?
  - Is adequate logging enabled in CI to help diagnose issues quickly?
  - _Implementation_: Set up a "test health" dashboard to monitor test statistics over time.

- **Feedback Loop**
  - Do automated reports (coverage, performance metrics) clearly indicate the health of the codebase?
  - How promptly is feedback from CI/CD processed and acted upon by the team?
  - Are pre-commit hooks (using tools like Husky) and branch protection rules helping maintain code quality?
  - _Implementation_: Configure Slack/Teams notifications for build failures with direct links to logs.

- **Security Scanning**
  - Are we regularly scanning dependencies for security vulnerabilities?
  - Is static analysis integrated into the CI pipeline to catch security issues?
  - Do we perform penetration testing on the API endpoints that receive APK files?
  - _Implementation_: Add npm audit and OWASP dependency checking to the CI pipeline.

---

## 4. Iterative Improvement & Future Enhancements

- **Continuous Self-Healing**
  - Are there recurring issues flagged in TROUBLESHOOTING.md that need a more permanent fix?
  - Are changes to the testing setup or mock behavior regularly reviewed and refined?
  - What new practices or tools can be evaluated to improve the testing and development process?
  - _Implementation_: Track recurring issues in an "Technical Debt" backlog and allocate time for resolution.

- **Innovation and Adaptation**
  - What emerging trends or tools in the testing ecosystem can be adopted to enhance efficiency?
  - Are there opportunities to move toward incremental test execution or advanced performance monitoring?
  - How can we better automate documentation updates based on CI/CD feedback?
  - _Implementation_: Schedule a monthly "innovation hour" to explore and test new tools.

- **APK Analysis Techniques**
  - Are we keeping up with the latest Android security features and how they impact our analysis?
  - Have new obfuscation techniques emerged that our tools need to handle?
  - Can machine learning be applied to improve our APK analysis results?
  - _Implementation_: Subscribe to Android security bulletins and schedule quarterly reviews of our analysis techniques.

---

## 5. Team Collaboration and Review

- **Regular Reviews**
  - Schedule periodic reviews (weekly or biweekly) to discuss test results, CI/CD performance, and documentation updates with the team.
  - Are there recurring discussion points or pain areas that need focused improvement sessions?
  - _Implementation_: Create a rotating role of "Quality Champion" who leads these reviews.

- **Knowledge Sharing**
  - How effectively are insights and lessons learned being communicated across the team?
  - Can the documentation be enhanced with annotated examples or real-world scenarios from recent development cycles?
  - _Implementation_: Start a team tech blog or wiki where team members can document interesting challenges and solutions.

- **Pair Programming and Code Review**
  - Are we using pair programming for complex analysis algorithms or security-critical code?
  - Do our code reviews focus on both technical correctness and knowledge transfer?
  - Are review comments constructive and actionable?
  - _Implementation_: Create a code review checklist specifically for security-sensitive APK analysis code.

---

## 6. User Feedback and Metrics

- **Usage Patterns**
  - Are we tracking how users interact with the APK analysis results?
  - Which features are most valued vs. underutilized?
  - What user friction points can be identified through analytics?
  - _Implementation_: Set up basic analytics to track feature usage and error occurrences.

- **Performance Benchmarks**
  - Are we measuring and tracking performance metrics for APK analysis over time?
  - Do we have performance regression tests in place?
  - Is the system scaling effectively with user growth?
  - _Implementation_: Create a benchmark suite with various APK sizes and complexities.

---

## 7. Self-Review Techniques

- **Code Walkthroughs**
  - Schedule personal code walkthroughs where you narrate your code's functionality
  - Use the "rubber duck debugging" technique to explain your logic out loud
  - _Implementation_: Record voice notes explaining complex algorithms and review them later

- **Deliberate Reflection**
  - After completing a feature or fixing a bug, write a brief reflection on:
    - What was challenging?
    - What would you approach differently next time?
    - What did you learn?
  - _Implementation_: Keep a developer journal with these reflections

- **Personal Metrics**
  - Track your own metrics like:
    - Types of bugs you commonly introduce
    - Areas where you spend the most debugging time
    - Code that you frequently have to revisit
  - _Implementation_: Create a simple spreadsheet to identify patterns

---

## Implementation Schedule

To ensure this self-prompting becomes part of your regular workflow:

1. **Daily**: 5-minute self-reflection on code written that day
2. **Weekly**: Run test coverage analysis and review any failing tests
3. **Bi-weekly**: Documentation review and updates
4. **Monthly**: Comprehensive review using all sections of this guide
5. **Quarterly**: Full review of the self-prompt document itself to add new questions and remove irrelevant ones

---

## Final Thoughts

Use this self-prompt guide as a living document. Update it with new questions, insights, or challenges as they arise. By regularly revisiting these prompts, you can ensure that your development process maintains its robustness and adaptability through continuous self-healing and iterative improvement.

Remember that the goal is not perfection but continuous improvement. Each cycle of self-reflection should lead to incremental enhancements in your code quality, process efficiency, and team collaboration.

Happy Testing and Continuous Development!