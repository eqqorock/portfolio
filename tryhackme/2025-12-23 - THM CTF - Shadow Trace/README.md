# 2025-12-23 - THM CTF - Shadow Trace

## Investigation Summary

Short summary: This TryHackMe CTF challenge investigated suspicious persistence and lateral movement techniques simulated in the exercise. The writeup below preserves the original notes and is formatted for SOC L1 consumption.

## Detection / Alert

- Alert name: Suspicious persistence observed
- Time observed: 2025-12-23
- Source: TryHackMe CTF exercise

![Alert View](screenshots/step-01-alert.png)

## Triage / Logs

- Evidence gathered from logs and system artefacts during the exercise.

![Logs View](screenshots/step-02-logs.png)

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

![Analysis View](screenshots/step-03-analysis.png)

## MITRE ATT&CK

- Tactic: Persistence / Lateral Movement
- Technique: Scheduled Task or Service Persistence (T1053/T1547)

## Decision / Remediation

- Decision: Remove persistence, rotate affected credentials, monitor for recurrence.

![Decision View](screenshots/step-04-decision.png)

## Response / Escalation

- Actions taken: removed identified persistence mechanism, rotated credentials, and notified stakeholders for follow-up.

## Lessons Learned

1. Harden service configurations and review scheduled tasks regularly.
2. Improve alerting for persistence indicators and enrich SIEM telemetry.

## Artifacts

- Tools used: system enumeration tools and log analysis.

## References

- Original file: 2025-12-23 - THM CTF - Shadow Trace.pdf (archived)
# 2025-12-23 - THM CTF - Shadow Trace

## Investigation Summary

Short summary: This TryHackMe CTF challenge involved tracing suspicious lateral movement and investigating telemetry to identify the attack path. The writeup is organized for SOC L1 review.

## Detection / Alert

- Alert name: Suspicious process execution / lateral movement indicators
- Time observed: 2025-12-23
- Source: TryHackMe CTF exercise

![Alert View](screenshots/step-01-alert.png)

## Triage / Logs

- Logs reviewed: system event logs, process lists, network connections.

![Logs View](screenshots/step-02-logs.png)

## Analysis

- Analysis notes: identified suspicious binaries, correlated with C2 patterns, collected hashes and IOC list.

![Analysis View](screenshots/step-03-analysis.png)

## Decision / Remediation

- Decision: Isolate affected host, kill malicious process, rebuild if persistence confirmed.

![Decision View](screenshots/step-04-decision.png)

## Artifacts

- Tools and outputs preserved; flags and proofs included where relevant.

## References

- Original file: 2025-12-23 - THM CTF - Shadow Trace.pdf (archived)
