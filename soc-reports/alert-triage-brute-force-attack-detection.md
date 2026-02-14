# Alert Triage | Credential Access: Brute Force Attack Detection and Initial Analysis

**Date:** 2026-02-14

## Investigation Summary

Investigated a Splunk alert for multiple failed web application login attempts from a single external IP. Confirmed successful brute force attack against admin panel with subsequent suspicious SSH activity. Due to the complexity of the attack and system-level access observed, escalated to senior SOC analyst for full incident response.

## Detection / Alert

- **Alert name:** Multiple failed authentication attempts from single source
- **Time observed:** 2026-02-14 13:45 UTC
- **Affected host:** WEB-SERVER-01 (10.80.180.17)
- **Attacker IP:** [External IP - Redacted for lab]
- **Source:** Splunk correlation rule

## Triage / Logs

Reviewed Splunk alert showing 50+ failed POST requests to `/admin/index.php` within a 2-minute window from single external IP. Checked if this was followed by successful login - confirmed admin account authentication succeeded at 13:47 UTC. Also noticed SSH login from same source IP shortly after web compromise.

## Data Sources

- Splunk SIEM (web server logs and SSH authentication logs)
- Apache access logs (via Splunk forwarder)
- Linux authentication logs (via Splunk forwarder)

## Investigation Steps

1. **Alert review:** Opened Splunk alert showing spike in HTTP POST requests to `/admin/index.php`
2. **Failed login analysis:** Queried Splunk for all requests to admin page from attacker IP - found 57 failed attempts with different password values in POST data
3. **Success check:** Searched for HTTP 200 responses from same IP to admin panel - found successful login at 13:47 UTC (2 minutes after start of attack)
4. **Post-compromise activity:** Checked what the attacker accessed after successful login - saw requests to download files from admin panel
5. **SSH correlation:** Noticed SSH authentication logs showing connection from same external IP about 10 minutes later using username "john"
6. **Escalation decision:** Attack appeared successful with potential system-level access, escalated to senior analyst for deeper investigation

## Evidence

**Brute Force Activity:**
- **Failed attempts:** 57 POST requests to `/admin/index.php` from single IP between 13:45-13:47 UTC
- **Pattern observed:** Sequential requests with 1-2 second intervals (automated tool behavior)
- **Successful login:** HTTP 200 response at 13:47:23 UTC for username "admin"
- **No account lockout:** System allowed all 57 attempts without blocking attacker

**Post-Compromise Indicators:**
- Immediate navigation to admin panel file management pages
- Download requests for multiple files including what appeared to be configuration or credential files
- Session remained active for approximately 15 minutes

**SSH Activity:**
- SSH authentication log showed successful login for user "john" from same attacker IP at 13:58 UTC
- Authentication method: public key (not password)
- Session duration: ~20 minutes before disconnect

**Splunk Query Examples:**
```
index=web_logs sourcetype=apache_access uri="/admin/index.php" src_ip="[ATTACKER_IP]" | stats count by status
index=linux_auth sourcetype=sshd src_ip="[ATTACKER_IP]" | table _time, user, auth_method, status
```

## Analysis

This appears to be a successful brute force attack against a web application with follow-on SSH compromise. The attacker used an automated tool to try multiple passwords against the admin account until finding the correct one. 

**Observations:**
- No rate limiting or account lockout was configured, allowing the attacker unlimited attempts
- The time between failed attempts (1-2 seconds) suggests automated tooling like Hydra or similar
- Successful admin login immediately led to file downloads, indicating the attacker knew what they were looking for
- SSH login using public key authentication suggests credentials or keys were obtained from the web application
- The gap between web compromise (13:47) and SSH login (13:58) may indicate offline preparation or credential processing

**Risk Assessment:**
From the logs available in Splunk, I can confirm the attacker gained admin-level web access and SSH access to the server. I don't have visibility into what commands were run during the SSH session or what level of system access was achieved. This requires deeper investigation by senior analysts with access to command history and system logs.

**Concerns flagged for escalation:**
- How did attacker know to use "john" username for SSH?
- What files were downloaded from admin panel?
- What actions were performed during SSH session?
- Is there persistent access remaining on the system?

## MITRE ATT&CK

- **T1110.001** - Brute Force: Password Guessing (web application login)
- **T1078** - Valid Accounts (after successful brute force)
- **T1021.004** - Remote Services: SSH (lateral movement to system)

## Decision

- **Classification:** True Positive
- **Severity:** High
- **Justification:** Confirmed successful brute force attack with subsequent SSH system access. Full extent of compromise unknown and requires escalation.

## Response / Escalation

**Immediate Actions (L1):**
1. **Documented findings:** Created this incident report with timeline and Splunk queries
2. **Blocked attacker IP:** Submitted firewall block request to network team
3. **Notified stakeholders:** Alerted system owner about confirmed compromise
4. **Escalated to L2:** Handed off to senior SOC analyst for full incident response

**Escalation Notes:**
- Provided Splunk workspace with saved searches for L2 investigation
- Recommended system owner disable "admin" and "john" accounts pending investigation
- Suggested isolating WEB-SERVER-01 from network if feasible
- Senior analyst will need to investigate: command history, file integrity, persistence mechanisms, extent of data access

**Additional Detection:**
- Recommended creating Splunk alert for successful login after multiple failed attempts
- Suggested implementing rate limiting on web application login pages

## Lessons Learned

1. **Splunk visibility was good:** Having web and SSH logs in Splunk made it easy to correlate the attack across different systems
2. **Detection worked:** Our failed login correlation rule caught the brute force attempt in real-time
3. **No prevention in place:** The web application had no rate limiting or account lockout to stop brute force attacks
4. **Escalation was necessary:** As L1, I could identify the compromise but needed senior analyst for deeper forensics and remediation
5. **Alert tuning needed:** Should configure alerts for successful login following multiple failures, not just the failures themselves

## Artifacts

**Indicators of Compromise:**
- Attacker IP: [Redacted for lab environment]
- Compromised accounts: `admin` (web), `john` (SSH)
- Attack target: `/admin/index.php` on WEB-SERVER-01 (10.80.180.17)
- Timeframe: 2026-02-14 13:45 - 14:18 UTC

**Splunk Saved Searches:**
- "BruteIt_Failed_Logins" - All failed admin attempts from attacker IP
- "BruteIt_Success_and_Post_Compromise" - Successful login and subsequent activity
- "BruteIt_SSH_Correlation" - SSH activity from same source IP

---
*Source: TryHackMe BruteIt lab (brute force attack detection training)*
