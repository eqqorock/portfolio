```markdown
# Alert Triage: Phishing Email Analysis

**Date:** 2026-01-03

**Summary:**
- **Incident:** User-reported suspicious email suspected phishing.
- **Outcome:** Classified as True Positive — Medium severity.

**Sources Reviewed:**
- **Raw email headers:** From, To, Subject, Date, Return-Path, Reply-To, sender IP
- **Email body:** HTML and plaintext
- **Attachments:** Base64-encoded attachment reconstructed
- **Enrichment:** ARIN WHOIS for sender IP and domain lookups

**Evidence:**
- **Return-Path:** Identified as the effective reply address and did not match legitimate sender domains.
- **Sender IP:** Enriched via ARIN WHOIS; ownership and reputation did not align with claimed sender.
- **HTML content:** Contained an externally-hosted image (blocked during analysis) and an embedded hyperlink that resolved to a suspicious domain when defanged.
- **URLs:** Defanged links revealed redirecting behavior to a non-legitimate domain (indicator of credential harvesting).
- **Attachment:** PDF delivered as base64; reconstructed file content scanned and confirmed benign text in this exercise.

**Analysis:**
- **Header anomalies:** Mismatches between `From`, `Return-Path`, and `Reply-To` indicate possible sender spoofing.
- **Phishing indicators:** Use of urgency in the subject line, impersonation of a trusted brand, and link redirection to non-official domains.
- **Attachment risk:** Although the reconstructed PDF was benign here, attachments delivered in base64 are commonly used in phishing campaigns and require careful inspection.
- **Likely intent:** Credential harvesting via deceptive link and social engineering.

**MITRE ATT&CK:**
- **Tactic:** Initial Access
- **Technique:** Phishing (T1566)
- **Sub-technique:** Phishing via Email (T1566.001)

**Decision:**
- **Classification:** True Positive
- **Severity:** Medium
- **Justification:** Multiple corroborating indicators of phishing (header spoofing, malicious redirect, social-engineering content) that could lead to credential compromise if clicked.

**Response / Escalation:**
- **Immediate:** Block sender domain and associated URLs at the mail gateway and web proxy.
- **Filters:** Add identified sender indicators, domains, and URLs to email security filters (block/deny lists and rule signatures).
- **User action:** Notify the reporting user that the email is confirmed phishing and advise no further interaction.
- **Awareness:** Send a short phishing awareness reminder to the impacted user group with examples and reporting steps.

**Indicators of Compromise (IOCs):**
- **Return-Path:** [redacted for lab]
- **Suspicious domain(s):** [redacted for lab]
- **Sender IP:** [redacted for lab]
- **Attachment filename:** [redacted for lab] (base64 PDF)

**Lessons Learned:**
- Combining header and body analysis strengthens detection confidence.
- Always defang URLs during analysis to prevent accidental clicks.
- Base64-encoded attachments should be reconstructed and scanned in an isolated environment.

**Next Steps / Recommendations:**
- Block domains and IPs in email and network controls.
- Update signatures and detection rules for similar header anomalies and redirect patterns.
- Run a short user awareness campaign emphasizing the reporting process and safe handling of urgent-looking emails.
- Consider sender authentication monitoring (DMARC, DKIM, SPF) enforcement and reporting if not already strict.

*Source: Hands-on security lab (phishing email analysis simulation)*

```
