# Alert Triage | Credential Access: Brute Force Attack with Credential Compromise and Privilege Escalation

**Date:** 2026-02-14

## Investigation Summary

Investigation of a successful brute force attack against a web application admin panel and subsequent SSH compromise. Analysis revealed an attacker used dictionary-based credential attacks to gain initial access, exfiltrated SSH private keys, cracked the passphrase offline, and escalated privileges to root using misconfigured sudo permissions.

## Detection / Alert

- **Alert name:** Multiple failed authentication attempts from single source
- **Time observed:** 2026-02-14 13:45 UTC
- **Affected host:** WEB-SERVER-01 (10.80.180.17)
- **Attacker IP:** [External IP - Redacted for lab]
- **Source:** Splunk correlation rule + Apache access logs

## Triage / Logs

Initial alert triggered on 50+ failed login attempts to `/admin/index.php` within a 2-minute window from a single external IP address. Upon review of authentication logs and web server access patterns, identified successful admin panel login followed by SSH authentication attempts using an RSA private key.

## Data Sources

- Apache access logs (`/var/log/apache2/access.log`)
- Apache error logs (`/var/log/apache2/error.log`)
- Linux authentication logs (`/var/log/auth.log`)
- Splunk SIEM (log aggregation and correlation)
- Web application login audit trail
- SSH daemon logs

## Investigation Steps

1. **Alert review:** Reviewed Splunk alert showing spike in HTTP POST requests to admin login page
2. **Web log analysis:** Analyzed Apache access logs to identify failed vs. successful login attempts
3. **Credential enumeration:** Identified username "admin" was discovered by attacker (found in HTML source comments)
4. **Brute force confirmation:** Observed sequential password attempts matching common wordlist patterns (rockyou.txt indicators)
5. **Post-compromise activity:** Traced successful admin login and subsequent access to sensitive files (RSA private key exposure)
6. **SSH attack correlation:** Cross-referenced SSH authentication logs showing RSA key-based login attempts for user "john"
7. **Privilege escalation detection:** Identified sudo command execution of `cat` binary to read `/etc/shadow` and `/root/root.txt`
8. **Timeline reconstruction:** Built complete attack timeline from initial reconnaissance through root compromise

## Evidence

**Phase 1: Web Application Brute Force**
- **Failed login attempts:** 50+ POST requests to `/admin/index.php` with varying password values
- **Attack source:** Single external IP address
- **Successful credential:** Username `admin` with weak password (cracked via dictionary attack)
- **Exposed username:** HTML source code comment revealed username: `<!-- Hey john, if you do not remember, the username is admin -->`

**Phase 2: Post-Compromise Reconnaissance**
- **Admin panel access:** Successful login timestamp showed immediate navigation to sensitive areas
- **Data exfiltration:** Download of RSA private key file (`id_rsa`) from admin panel
- **Information disclosure:** Web application exposed SSH credentials in downloadable format

**Phase 3: SSH Lateral Movement**
- **Private key attack:** SSH connection attempts using exfiltrated RSA private key
- **Username enumeration:** Attacker used "john" as SSH username (discovered from source code comment)
- **Passphrase cracking:** Offline brute force of RSA key passphrase (evidence: successful SSH login after initial failures)
- **Successful SSH login:** Authentication via cracked private key for user `john`

**Phase 4: Privilege Escalation**
- **Sudo enumeration:** Execution of `sudo -l` to identify privilege escalation paths
- **Binary abuse:** Sudo permissions allowed `john` to run `/usr/bin/cat` as root without password
- **Shadow file access:** Command `sudo cat /etc/shadow` executed to dump password hashes
- **Root flag access:** Command `sudo cat /root/root.txt` executed to confirm root-level access
- **Hash exfiltration:** Root user SHA512crypt hash extracted from `/etc/shadow`

**Attack Tools Identified:**
- `nmap` - Port scanning and service enumeration (ports 22/SSH and 80/HTTP identified)
- `gobuster` or `dirb` - Directory enumeration (discovered `/admin` directory)
- `hydra` - HTTP form brute force tool (http-post-form attack syntax)
- `ssh2john` - RSA private key hash extraction
- `john the ripper` - Password/passphrase cracking with rockyou.txt wordlist

## Analysis

This attack demonstrates a complete kill chain from initial reconnaissance through root compromise. The attacker leveraged multiple security weaknesses in a coordinated attack:

**Initial Access Vector:**
The web application exposed usernames in HTML comments, eliminating the need to enumerate valid accounts. Combined with no rate limiting on login attempts, this allowed successful dictionary-based brute force using common passwords from `rockyou.txt`.

**Credential Exposure:**
After gaining admin panel access, the attacker discovered an exposed RSA private key and additional username information. Storing SSH keys in web-accessible locations represents a critical security misconfiguration.

**Lateral Movement:**
Rather than cracking the RSA passphrase online (which would generate additional failed SSH attempts), the attacker used offline cracking techniques with `ssh2john` and `john the ripper`. This minimized detection surface during the credential access phase.

**Privilege Escalation:**
The `sudo -l` output revealed that user `john` could execute `/usr/bin/cat` as root without a password. The attacker leveraged this to read privileged files including `/etc/shadow` (containing all user password hashes) and root-owned files. This represents overly permissive sudo configuration and follows known GTFOBins techniques for privilege escalation.

**Risk Assessment:**
- **High:** Complete system compromise with root-level access
- **High:** Exposure of all user password hashes from `/etc/shadow`
- **Medium:** SSH private key exposed via web application
- **Medium:** No brute force protection mechanisms (rate limiting, account lockout)

## MITRE ATT&CK

**Initial Access:**
- **T1078** - Valid Accounts (compromised admin credentials)

**Credential Access:**
- **T1110.001** - Brute Force: Password Guessing (web admin panel)
- **T1110.002** - Brute Force: Password Cracking (RSA passphrase, root hash)
- **T1552.004** - Unsecured Credentials: Private Keys (exposed id_rsa)
- **T1003.008** - OS Credential Dumping: /etc/passwd and /etc/shadow

**Lateral Movement:**
- **T1021.004** - Remote Services: SSH (using compromised private key)

**Privilege Escalation:**
- **T1548.003** - Abuse Elevation Control Mechanism: Sudo and Sudo Caching
- **T1068** - Exploitation for Privilege Escalation (GTFOBins sudo cat abuse)

**Discovery:**
- **T1046** - Network Service Discovery (nmap scanning)
- **T1083** - File and Directory Discovery (gobuster/dirb enumeration)

## Decision

- **Classification:** True Positive
- **Severity:** Critical
- **Justification:** Confirmed multi-stage attack resulting in full system compromise with root access, credential theft, and persistent backdoor capability via SSH keys

## Response / Escalation

**Immediate Actions Taken:**
1. **Containment:** Blocked attacker source IP at firewall and web application firewall (WAF)
2. **Credential reset:** Forced password reset for `admin` and `john` user accounts
3. **Key rotation:** Regenerated all SSH keys for affected accounts and revoked compromised `id_rsa`
4. **Sudo review:** Removed overly permissive sudo rule allowing passwordless `cat` execution
5. **System isolation:** Temporarily isolated WEB-SERVER-01 for forensic analysis

**Remediation Actions:**
1. **Rate limiting:** Implemented fail2ban rules to block IPs after 5 failed login attempts within 10 minutes
2. **Account lockout:** Configured web application to lock accounts after 5 consecutive failed logins
3. **Code review:** Removed sensitive information (usernames, hints) from HTML comments
4. **File permissions:** Removed SSH private keys from web-accessible directories
5. **Sudo hardening:** Reviewed and restricted sudo permissions across all accounts (principle of least privilege)
6. **Password policy:** Enforced strong password requirements (minimum 12 characters, complexity rules)
7. **MFA implementation:** Recommended multi-factor authentication for admin panel and SSH access

**Monitoring Enhancements:**
- Created Splunk correlation rule to detect multiple failed logins followed by successful authentication
- Implemented alerting for sudo command execution of file-reading binaries (`cat`, `less`, `more`, `tail`)
- Added detection for SSH private key exfiltration patterns in web access logs
- Configured anomaly detection for unusual SSH login times or source IPs

## Lessons Learned

1. **Defense in depth failed:** Multiple security layers were absent or misconfigured (no rate limiting, weak passwords, exposed credentials, excessive sudo permissions)
2. **Information disclosure:** HTML comments leaked usernames, reducing attacker effort for credential enumeration
3. **Credential storage:** SSH private keys should never be stored in or accessible via web applications
4. **Sudo misconfiguration:** Allowing passwordless execution of file-reading utilities effectively grants root access
5. **Offline attacks:** RSA passphrase cracking performed offline meant no additional failed login alerts were generated
6. **Detection gap:** Initial nmap scan and directory enumeration were not logged or alerted on

**Recommendations:**
- Implement web application firewall (WAF) with brute force protection
- Deploy intrusion detection system (IDS) to detect reconnaissance activities (port scans, directory enumeration)
- Regular security assessments and penetration testing to identify misconfigurations
- Security awareness training on secure credential storage and sudo configuration

## Artifacts

**Indicators of Compromise (IOCs):**
- Attacker IP: [Redacted for lab environment]
- Compromised accounts: `admin`, `john`
- Compromised file: `/home/john/.ssh/id_rsa`
- Attack vectors: `/admin/index.php` (HTTP POST brute force)
- Sudo abuse: `/usr/bin/cat /etc/shadow`, `/usr/bin/cat /root/root.txt`

**Attack Timeline:**
1. Network reconnaissance (nmap scan of ports 22, 80)
2. Directory enumeration (discovered `/admin` endpoint)
3. Username discovery (HTML source code comment)
4. Password brute force (hydra with rockyou.txt)
5. Admin panel compromise
6. RSA private key exfiltration
7. Offline passphrase cracking (ssh2john + john)
8. SSH lateral movement
9. Privilege escalation (sudo cat abuse)
10. Root compromise and credential dumping

## References

- TryHackMe Lab: BruteIt Room (Brute Force Training Exercise)
- GTFOBins: https://gtfobins.github.io/gtfobins/cat/
- MITRE ATT&CK: Brute Force (T1110)
- Splunk Documentation: Failed Authentication Detection

---
*Source: Hands-on security lab (brute force attack detection and response)*
