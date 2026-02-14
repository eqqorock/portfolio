# Alert Triage | Email Security: PowerShell-Driven Phishing Compromise with DNS Exfiltration

**Date:** 2026-01-12

## Investigation Summary

Investigation of a phishing-driven endpoint compromise involving PowerShell abuse for reconnaissance, data staging, and DNS-based exfiltration. Analysis revealed a complete attack chain from initial phishing email delivery through post-compromise activity including data exfiltration and reverse shell establishment.

## Detection / Alert

- **Alert name:** Suspicious PowerShell spawning nslookup with encoded data
- **Time observed:** 2026-01-12 10:47 UTC
- **Affected host:** WORKSTATION-089
- **User context:** michael.ascot@tryhatme.com
- **Source:** Sysmon Event ID 1 (Process Creation)

## Triage / Logs

Upon receiving high-severity process alerts, endpoint telemetry was reviewed to trace the attack sequence. Initial phishing alert correlated with subsequent PowerShell execution and suspicious DNS queries. Sysmon logs showed parent-child process relationships between `powershell.exe` and system utilities with Base64-encoded command-line arguments.

## Data Sources

- Email security logs  
- Sysmon (Process Creation events – Event ID 1)  
- SIEM (Splunk) process and command-line telemetry  

## Investigation Steps

The investigation began with a phishing alert involving an urgent payment-themed email sent to `michael.ascot@tryhatme.com` with a ZIP attachment. Endpoint telemetry was reviewed after correlating subsequent high-severity process alerts tied to the same user and host.

Sysmon logs showed `powershell.exe` spawning `nslookup.exe` with Base64-encoded command-line arguments and execution from a suspicious downloads directory. SIEM searches were used to trace parent-child process relationships, identify repeated encoded DNS queries, and uncover additional malicious tools executed by PowerShell.

## Evidence

- Phishing email with social engineering content and malicious attachment (`ImportantInvoice-Febrary.zip`)
- `powershell.exe` spawning `nslookup.exe` with encoded data sent to `haz4rdw4re.io`
- Base64 decoding revealed ZIP file headers (`PK`), indicating staged file exfiltration
- Execution of reconnaissance commands (`whoami`, `systeminfo`, `net user`)
- `robocopy.exe` used to copy sensitive files into an exfiltration directory
- Download and execution of `powercat.ps1` to establish a reverse shell
- DNS tunneling used for covert data exfiltration

## Analysis

This incident represents a successful phishing attack that escalated into full endpoint compromise. The attacker abused legitimate Windows utilities (PowerShell, nslookup, Robocopy) to evade detection while conducting reconnaissance, collecting sensitive data, and exfiltrating it via DNS queries.

The use of encoded command-line arguments, suspicious external domains, and known offensive tooling confirms malicious intent. All related high-severity process alerts were correlated to a single attack chain originating from the initial phishing email.

## MITRE ATT&CK

- **Tactic:** Execution, Command and Control, Exfiltration  
- **Technique:**  
  - T1059.001 – Command and Scripting Interpreter: PowerShell  
  - T1105 – Ingress Tool Transfer  
  - T1048.003 – Exfiltration Over Alternative Protocol (DNS)  
- **Sub-techniques:**  
  - PowerShell abuse  
  - DNS tunneling  
  - Reverse shell establishment  

## Decision

- **Classification:** True Positive  
- **Severity:** High  
- **Justification:** Confirmed phishing compromise resulting in PowerShell abuse, data staging, DNS-based exfiltration, and remote access capability.

## Response / Escalation

The incident was handled internally. Response actions included host isolation, blocking malicious domains, resetting credentials for the affected user, and removing all identified malicious artifacts. No further escalation was required once containment was completed.

## Lessons Learned

- Phishing emails remain a highly effective initial access vector.
- Legitimate Windows tools can be abused for stealthy post-exploitation.
- Command-line logging and parent-child process analysis are critical for detection.
- DNS monitoring is essential for identifying covert exfiltration techniques.
