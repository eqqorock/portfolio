# Alert Triage | Email Security: Phishing Email Analysis (Multiple Samples)

**Date:** 2026-01-06

## Investigation Summary

Analysis of multiple real-world phishing email samples from a controlled lab exercise. Investigation identified common and advanced phishing techniques across different brand impersonations, delivery methods, and social engineering tactics to assess user risk and document detection patterns.

## Detection / Alert

- **Alert source:** Security awareness training lab / Email security review
- **Time observed:** 2026-01-06
- **Sample count:** 7 phishing emails
- **Impersonated brands:** PayPal, Home Depot, Netflix, Apple, Citrix, DHL, OneDrive
- **Source:** Controlled lab environment (real-world phishing samples)

## Triage / Logs

Multiple phishing samples were analyzed systematically to identify patterns and techniques. Each sample underwent header analysis, URL inspection, attachment analysis, and social engineering assessment. Common indicators were documented to improve detection signatures.

## Data Sources
- Raw email headers
- Email body (HTML and plain text)
- Embedded hyperlinks and shortened URLs
- Email attachments (PDF, Word template, Excel)
- Open-source analysis references

## Investigation Steps
1. Reviewed sender and recipient fields for spoofing and mismatches
2. Assessed subject lines for urgency and social engineering cues
3. Analyzed HTML body structure and brand impersonation
4. Inspected hyperlinks (including shortened URLs) and defanged destinations
5. Identified tracking pixels and blocked external images
6. Examined attachments and observed execution behavior
7. Correlated indicators across samples to identify common phishing patterns

## Evidence
- Spoofed sender domains impersonating PayPal, Home Depot, Netflix, Apple, Citrix and DHL
- URL shortening services obscuring final destinations
- Tracking pixels embedded as small image files
- Credential-harvesting pages impersonating OneDrive, Adobe, and Citrix
- Attachments including PDFs, Word templates (.DOT), and Excel files
- Excel attachment attempting to execute `regasms.exe`
- Recipients BCCed to hide mass distribution

## Analysis
Across all samples, the emails demonstrated classic and advanced phishing techniques designed to induce urgency, trust, and rapid user action. Brand impersonation was reinforced through HTML formatting, logos, and familiar workflows such as invoices, shipping notices, and document delivery.

Several samples attempted credential harvesting by redirecting victims through multiple impersonated login portals. Others relied on malicious attachments to deliver payloads or prompt further interaction. Poor grammar, unusual sender domains, and mismatched email fields were consistent indicators of malicious intent.

These behaviors align with real-world phishing campaigns and present a credible risk of credential compromise or malware execution if a user interacts with the content.

## MITRE ATT&CK
- **Tactic:** Initial Access
- **Technique:** Phishing (T1566)
- **Sub-techniques:**
  - Phishing via Email (T1566.001)
  - Spearphishing Attachment (T1566.001)
  - Spearphishing Link (T1566.002)

## Decision
- **Classification:** True Positive  
- **Severity:** Medium  
- **Justification:** Multiple high-confidence phishing indicators were present across samples, including spoofing, credential harvesting, and malicious attachment behavior.

## Response / Escalation

**Immediate Actions:**
- Documented all phishing indicators and IOCs from 7 samples
- Created comprehensive list of sender domains, URLs, and attachment hashes
- Escalated to email security team with all indicators

**Escalation Requests:**
- Block identified sender domains and malicious URLs at email gateway
- Add attachment hashes to email security filters
- Update detection rules to catch similar phishing patterns
- Recommend phishing awareness training highlighting these techniques
- Monitor authentication logs for credential abuse attempts

## Lessons Learned
- Phishing campaigns often reuse the same techniques across different brands
- Attachment-based phishing remains effective despite user awareness training
