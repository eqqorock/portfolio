# Alert Triage | Credential Access: Weak Credential Detection and Password Hash Cracking

**Date:** 2025-12-25

## Investigation Summary

Analysis of compromised password hashes extracted from a vulnerable web application database. Investigation involved identifying hash types, attempting offline password cracking, and assessing the risk of weak credentials across user accounts.

## Detection / Alert

- **Alert name:** Suspicious database access / Authentication anomaly
- **Time observed:** 2025-12-25 09:15 UTC
- **Affected system:** Web server DB-01 (192.168.1.50)
- **Source:** TryHackMe lab exercise

## Triage / Logs

Initial alert indicated abnormal database queries suggesting possible SQL injection or credential dumping. Upon investigation, discovered that password hashes for multiple user accounts were accessible in plaintext database dump.

## Data Sources

- Database export file (`users.db`)
- Authentication logs
- Web application logs
- Hash cracking tool output

## Investigation Steps

1. **File analysis:** Reviewed the database export to identify stored credentials
2. **Hash identification:** Used `hash-identifier` tool to determine hash algorithm
3. **Hash cracking:** Attempted offline cracking using John the Ripper and rockyou.txt wordlist
4. **Credential validation:** Cross-referenced cracked passwords against authentication logs
5. **Scope assessment:** Checked if any cracked accounts had privileged access
6. **Password policy review:** Evaluated current password requirements

## Evidence

**Database Contents:**
- Total user accounts in database: 8
- Accounts with crackable hashes: 5
- Hash algorithm identified: MD5 (unsalted)

**Sample Hash Data:**
```
admin:5f4dcc3b5aa765d61d8327deb882cf99
user1:e10adc3949ba59abbe56e057f20f883e
user2:25d55ad283aa400af464c76d713c07ad
dbuser:482c811da5d5b4bc6d497ffa98491e38
```

**Cracking Results:**
| Username | Hash (MD5) | Cracked Password | Time to Crack |
|----------|------------|------------------|---------------|
| admin | 5f4dcc3b5a... | password | <1 second |
| user1 | e10adc3949... | 123456 | <1 second |
| user2 | 25d55ad283... | 12345678 | <1 second |
| dbuser | 482c811da5... | password123 | <1 second |
| guest | 7c6a180b36... | guest | <1 second |

**Tools Used:**
- `hash-identifier` - Identified hash type as MD5
- `john --format=raw-md5 hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt`
- Alternative: `hashcat -m 0 -a 0 hashes.txt rockyou.txt`

## Analysis

All five cracked passwords were extremely weak and commonly found in breach databases and default password lists. The use of unsalted MD5 hashing made offline cracking trivial - all hashes were cracked in under 1 second using a standard wordlist.

MD5 is cryptographically broken and should not be used for password storage. The lack of salting means identical passwords produce identical hashes, making rainbow table attacks effective.

**Risk Assessment:**
- **High Risk:** The `admin` account uses "password" - full application access with weakest possible credential
- **Medium Risk:** Other users also use common passwords from top-10 most common lists
- **Critical:** Unsalted MD5 means all passwords are vulnerable to offline brute force

Searching authentication logs showed the `admin` account had been accessed from an external IP (45.33.32.156) on 2025-12-24, one day before this investigation. This suggests the weak credential may have already been exploited.

## MITRE ATT&CK

- **Tactic:** Credential Access
- **Technique:** Brute Force: Password Cracking (T1110.002)
- **Tactic:** Initial Access
- **Technique:** Valid Accounts (T1078)

## Decision / Remediation

**Classification:** True Positive  
**Severity:** High  
**Actions Taken:**

1. **Immediate:**
   - Force password reset for all accounts with crackable hashes
   - Disabled `admin` account pending ownership verification
   - Blocked suspicious IP 45.33.32.156 at firewall

2. **Short-term:**
   - Migrated database to use bcrypt hashing with per-user salts
   - Implemented minimum password complexity requirements:
     - At least 12 characters
     - Must include uppercase, lowercase, number, and special character
   - Enabled account lockout after 5 failed login attempts

3. **Long-term:**
   - Recommend implementing multi-factor authentication (MFA)
   - Deploy password breach monitoring service
   - Schedule quarterly password audits

## Response / Escalation

- Notified application owner of weak credential policy and unsalted MD5 usage
- Escalated to development team for urgent password hashing upgrade
- Provided IOCs (suspicious IP) to threat intel team for correlation with other incidents
- Documented recommendations for IT policy team

## Lessons Learned

1. MD5 and other fast hashing algorithms should never be used for passwords
2. Password policies must enforce minimum complexity and length requirements
3. Regular password audits can identify weak credentials before attackers exploit them
4. Multi-factor authentication would have prevented unauthorized access even with compromised credentials
5. Monitoring for authentication from unexpected IPs can help detect credential abuse

## Artifacts

- Database export: `users.db` (secured)
- John the Ripper output: `cracked_passwords.txt`
- Hash list: `hashes.txt`
- Authentication log excerpt showing suspicious login

## References

- OWASP Password Storage Cheat Sheet
- NIST SP 800-63B (Digital Identity Guidelines)
- MITRE ATT&CK T1110.002
- TryHackMe Lab Exercise



