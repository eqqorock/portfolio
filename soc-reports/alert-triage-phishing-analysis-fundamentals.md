# Alert Triage: Phishing Email Analysis (User-Reported)

**Date:** 2026-01-03

## Investigation Summary

Analysis of a user-reported suspicious email suspected to be a phishing attempt. Investigation involved header analysis, URL defanging, attachment reconstruction, and sender IP enrichment. Email was confirmed as a credential harvesting phishing attempt with multiple indicators of spoofing and social engineering.

## Detection / Alert

- **Alert name:** User-reported suspicious email
- **Time observed:** 2026-01-03 14:22 UTC
- **Affected user:** [Redacted]
- **Email subject:** Urgent account verification required
- **Source:** Email security gateway + user report

## Triage / Logs

Initial triage focused on email header analysis to identify sender spoofing and mismatched reply addresses. Raw email headers and body content were extracted for detailed inspection. Attachment was safely reconstructed in isolated environment for analysis.

## Data Sources

- Raw email headers (From, To, Return-Path, Reply-To, sender IP)
- Email body (HTML and plaintext)
- Base64-encoded attachment
- ARIN WHOIS lookups for sender IP enrichment
- Domain reputation services

## Investigation Steps

1. **Header analysis:** Reviewed email headers for mismatches between From, Return-Path, and Reply-To fields
2. **Sender verification:** Enriched sender IP via ARIN WHOIS to verify ownership and reputation
3. **Body inspection:** Analyzed HTML content and identified externally-hosted images and embedded hyperlinks
4. **URL defanging:** Defanged and analyzed suspicious links to reveal credential harvesting pages
5. **Attachment reconstruction:** Decoded Base64 attachment and scanned in isolated environment
6. **Social engineering assessment:** Evaluated subject line and content for urgency indicators

## Evidence

**Email Header Anomalies:**
- **Return-Path:** Did not match legitimate sender domain (spoofing indicator)
- **Sender IP:** ARIN WHOIS enrichment showed ownership/reputation misalignment with claimed sender
- **From/Reply-To mismatch:** Indicated potential sender impersonation

**URL Analysis:**
- Defanged links revealed redirection to non-legitimate domain
- Destination URL patterns consistent with credential harvesting pages
- No association with claimed sender organization

**Attachment Analysis:**
- PDF delivered as Base64-encoded attachment
- Reconstructed and scanned in isolated environment
- Content confirmed benign in this lab exercise

**Social Engineering Indicators:**
- Subject line used urgency keywords
- Brand impersonation with legitimate-looking HTML formatting
- Externally-hosted images (blocked during analysis)

## Analysis

Email displayed multiple high-confidence phishing indicators including header spoofing, malicious URL redirection, and social engineering tactics. Mismatches between From, Return-Path, and Reply-To fields indicate sender impersonation. 

The credential harvesting page linked in the email body posed immediate risk if the user clicked through. Use of urgency in subject line and brand impersonation are classic phishing techniques designed to bypass user skepticism.

Although the Base64-encoded PDF attachment was benign in this case, this delivery method is commonly used in phishing campaigns to evade detection. Combined with header anomalies and malicious URLs, the email represents a credible credential theft attempt.

## MITRE ATT&CK

- **Tactic:** Initial Access
- **Technique:** Phishing (T1566)
- **Sub-technique:** Spearphishing Link (T1566.002)

## Decision

- **Classification:** True Positive
- **Severity:** Medium
- **Justification:** Multiple corroborating indicators of phishing (header spoofing, malicious redirect, social engineering content) with credential theft intent

## Response / Escalation

- Block sender domain and associated URLs at email gateway and web proxy
- Add identified sender indicators, domains, and URLs to deny lists and security filters
- Notify reporting user that email is confirmed phishing and advise no further interaction
- Send phishing awareness reminder to impacted user group

**Indicators of Compromise:**
- Sender IP: [Redacted for lab]
- Malicious domains: [Redacted for lab]
- Attachment hash: [Redacted for lab]

## Lessons Learned

- Combining header and body analysis strengthens detection confidence
- URL defanging is critical to prevent accidental navigation during analysis
- Base64-encoded attachments require safe reconstruction in isolated environments



