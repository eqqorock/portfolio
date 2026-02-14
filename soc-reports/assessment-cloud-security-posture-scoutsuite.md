# Assessment | Vulnerability Management: Cloud Security Posture Review (ScoutSuite)

**Assessment Type:** Proactive Vulnerability & Misconfiguration Assessment  
**Cloud Provider:** Amazon Web Services (AWS)  
**Tool Used:** ScoutSuite v5.12.0  
**Date:** 2026-02-08  
**Scope:** Training AWS environment (us-east-1)

---

## Executive Summary

I ran ScoutSuite against a practice AWS account as part of a cloud security training exercise. The tool automatically scanned AWS services and identified 21 configuration issues including some high-risk problems with IAM permissions, public S3 buckets, and missing logging. This report documents the findings and what I learned about common cloud misconfigurations.

---

## Findings Summary

| Severity | Count | Main Issues |
|----------|-------|-------------|
| High | 3 | IAM wildcard permissions, public S3 bucket, missing CloudTrail |
| Medium | 6 | Open security groups, unencrypted database |
| Low | 4 | Password policy gaps, Config not enabled |
| Informational | 8 | Best practice recommendations |

**Main Problems Found:**
- IAM user with full admin permissions (`*:*`)
- S3 bucket accessible to public internet
- No logging enabled in one region
- Security groups allowing SSH from anywhere (0.0.0.0/0)

---

## Scope and Environment

**Training Account ID:** 123456789012 (lab environment)  
**Region Scanned:** us-east-1  
**Services Checked:**
- IAM (users, roles, policies)
- S3 (buckets and permissions)
- EC2 (instances and security groups)
- RDS (databases)
- CloudTrail (logging)

---

## How I Ran the Assessment

This was a hands-on training exercise to learn cloud security basics. I was given read-only access to a practice AWS account and followed a guided procedure:

1. **Setup:** Installed ScoutSuite using pip: `pip install scoutSuite`
2. **Credentials:** Configured AWS CLI with read-only credentials
3. **Scan Command:**
   ```
   scout aws --profile training-account
   ```
4. **Wait Time:** Scan took about 5 minutes to complete
5. **Review:** Opened the HTML report ScoutSuite generated
6. **Documentation:** Went through each high/medium finding to understand what it meant

---

## Key Findings (What ScoutSuite Flagged)

### High Severity Issues

**1. IAM User Has Full Admin Access**
- **What I Found:** User called `legacy-admin` has a policy allowing any action on any resource
- **Why It's Bad:** If someone gets these credentials, they control the entire AWS account
- **Location:** IAM → Users → legacy-admin → Inline Policies

**2. Public S3 Bucket**
- **What I Found:** Bucket named `company-data-archive` is set to public read
- **Why It's Bad:** Anyone on the internet can view/download files in this bucket
- **Location:** S3 → company-data-archive → Permissions

**3. CloudTrail Not Logging in us-west-2**
- **What I Found:** No CloudTrail trail active in the us-west-2 region
- **Why It's Bad:** Can't see who did what in that region (blind spot for investigations)

### Medium Severity Issues

**4. Security Group Allows SSH from Anywhere**
- **What I Found:** Security group `sg-0a1b2c3d` allows port 22 from 0.0.0.0/0
- **Why It's Bad:** Makes it easy for attackers to try brute-forcing SSH login
- **Location:** EC2 → Security Groups → sg-0a1b2c3d

**5. Database Not Encrypted**
- **What I Found:** RDS instance `prod-db-01` doesn't have encryption turned on
- **Why It's Bad:** Data stored on disk is in plaintext
- **Location:** RDS → Databases → prod-db-01

**6. Weak Password Policy**
- **What I Found:** Account password settings don't require special characters
- **Why It's Bad:** Users can set weaker passwords like "Password123"

---

## What This Means

These findings are common mistakes people make when setting up AWS resources. The ScoutSuite report shows things that could let attackers:
- Steal credentials and take over the account (admin user issue)
- Access sensitive data (public S3 bucket)
- Brute force their way in (open SSH port)
- Read database data if they get access to storage (unencrypted RDS)

Most of these happen because security wasn't considered during initial setup or no one reviewed the configurations afterward.

---

## MITRE ATT&CK Mapping

- **T1078 – Valid Accounts:** Overly permissive IAM could be abused
- **T1530 – Data from Cloud Storage:** Public S3 bucket allows data theft
- **T1526 – Cloud Service Discovery:** Exposed resources help attackers map environment

---

## What Should Be Fixed

**High Priority:**
1. Remove or restrict the `legacy-admin` user permissions
2. Turn off public access on the S3 bucket
3. Enable CloudTrail logging in all regions

**Medium Priority:**
4. Change security group to only allow SSH from specific IP addresses
5. Enable encryption on the RDS database (might need to recreate it)
6. Update password policy to require special characters and longer passwords

**Note:** I documented these findings for review by senior team members who handle AWS configuration changes. Some fixes (like RDS encryption) require planning since they impact production systems.

---

## What I Learned

- ScoutSuite is useful for quickly finding common AWS security issues
- A lot of cloud problems come from default settings that aren't secure
- IAM permissions and S3 bucket policies are easy to misconfigure
- Logging is important for investigations but people often forget to enable it
- Security groups need to be locked down to specific IPs, not 0.0.0.0/0

This exercise helped me understand cloud security basics that would be useful for SOC work when investigating cloud-related incidents or reviewing security alerts.

---

## Artifacts

- `scoutsuite-report-2026-02-08.html` – Full report with all findings
- `scoutsuite-results.json` – Raw scan data
- Screenshots of high-severity findings

---

## References

- ScoutSuite Documentation: https://github.com/nccgroup/ScoutSuite
- AWS Security Best Practices guide
- MITRE ATT&CK Cloud Matrix
- Training lab materials
