# 2025-12-08 - THM CTF - Crack The Hash

## Investigation Summary

Short summary: This TryHackMe CTF challenge focused on cracking weak password hashes to gain initial access. The writeup below preserves the original observations and steps and is formatted for SOC L1 consumption.

## Detection / Alert

- Alert name: Weak hash detected / suspicious authentication attempts
- Time observed: 2025-12-08
- Source: TryHackMe CTF exercise

![Alert View](screenshots/step-01-alert.png)

## Triage / Logs

- Evidence gathered from logs and services during the exercise.

![Logs View](screenshots/step-02-logs.png)

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

![Analysis View](screenshots/step-03-analysis.png)

## MITRE ATT&CK

- Tactic: Credential Access
- Technique: Password Cracking (T1110)

## Decision / Remediation

- Decision: Contain and remediate weak credentials; rotate compromised accounts; apply stronger hashing / complexity controls for real environments.

![Decision View](screenshots/step-04-decision.png)

## Response / Escalation

- Actions taken: rotated affected credentials, removed tested accounts, and documented findings for escalation to the owner.

## Lessons Learned

1. Enforce stronger password policies and hashing algorithms.
2. Ensure centralized log collection to speed up correlation.

## Artifacts

- Tools used: password crackers, enumeration tools.
- Extracted flags and important outputs are preserved here.

## References

- Original file: 2025-12-08 - THM CTF - Crack The Hash.pdf (archived)
