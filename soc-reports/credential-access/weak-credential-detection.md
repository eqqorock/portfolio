# weak-credential-detection

**Date:** 2025-12-25

## Investigation Summary

Short summary: This TryHackMe CTF challenge focused on cracking weak password hashes to gain initial access.

## Detection / Alert

- Alert name: Weak hash detected / suspicious authentication attempts
- Time observed: 2025-12-08
- Source: TryHackMe CTF exercise

## Triage / Logs

- Evidence gathered from logs and services during the exercise.

## Data Sources

- Windows Event Logs, authentication logs, and application logs used during the exercise.

## Investigation Steps

1. Initial alert review and context collection
2. Identify key fields (IP, user, host, time)
3. Gather supporting logs and artifacts from hosts/services
4. Attempt correlation across data sources and validate findings
5. Determine containment and remediation actions

## Analysis

- Actions taken: enumerated hash type, attempted cracking with common wordlists, escalated privileges after obtaining credentials.

## MITRE ATT&CK

- Tactic: Credential Access
- Technique: Password Cracking (T1110)

## Decision / Remediation

- Decision: Contain and remediate weak credentials; rotate compromised accounts; apply stronger hashing / complexity controls for real environments.

## Response / Escalation

- Actions taken: rotated affected credentials, removed tested accounts, and documented findings for escalation to the owner.

## Lessons Learned

1. Enforce stronger password policies and hashing algorithms.
2. Ensure centralized log collection to speed up correlation.

## Artifacts

- Tools used: password crackers, enumeration tools.
- Extracted flags and important outputs are preserved here.

## References



