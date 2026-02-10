# Alert Triage: Persistence Mechanism Detection on Windows Endpoint

**Date:** 2025-12-15


## Investigation Summary

Short summary: This TryHackMe CTF challenge investigated suspicious persistence and lateral movement techniques simulated in the exercise.

## Detection / Alert

- Alert name: Suspicious persistence observed
- Time observed: 2025-12-23
- Source: TryHackMe CTF exercise


## Triage / Logs

- Evidence gathered from logs and system artifacts during the exercise.


## Data Sources

- Windows Event Logs, system logs, and SIEM records used during the exercise.

## Investigation Steps

1. Initial alert review and context collection
2. Identify key fields (IP, user, host, time)
3. Collect logs and host artefacts relevant to the alert
4. Correlate across sources to determine scope
5. Validate and prepare containment/remediation steps

## Analysis

- Actions taken: enumerated services, discovered persistence mechanism, validated impact and scope.


## MITRE ATT&CK

- Tactic: Persistence / Lateral Movement
- Technique: Scheduled Task or Service Persistence (T1053/T1547)

## Decision / Remediation

- Decision: Remove persistence, rotate affected credentials, monitor for recurrence.


## Response / Escalation

- Actions taken: removed identified persistence mechanism, rotated credentials, and notified stakeholders for follow-up.

## Lessons Learned

1. Harden service configurations and review scheduled tasks regularly.
2. Improve alerting for persistence indicators and enrich SIEM telemetry.

## Artifacts

- Tools used: system enumeration tools and log analysis.

## References
