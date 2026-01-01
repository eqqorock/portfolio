This folder organizes SOC-style alert triage writeups by investigative scenario rather than platform. Each scenario folder should contain a `README.md` written in SOC L1 format and a `screenshots/` subfolder.

Directory structure (by category):

- `credential-access/` — scenarios involving credential theft, password cracking, or compromised accounts.
- `authentication/` — authentication-related alerts, unusual logins, MFA failures, brute-force attempts.
- `endpoint-activity/` — host/process/activity-level alerts such as persistence, suspicious execution, or lateral movement.
- `network-activity/` — network-level detections like C2, scanning, or unusual outbound traffic.

Screenshot naming:

- Use the following filenames inside each scenario's `screenshots/` folder:
	- `step-01-alert.png`
	- `step-02-logs.png`
	- `step-03-analysis.png`
	- `step-04-decision.png`

File naming and placement guidance:

- Name each scenario file using a short, hyphenated SOC-style alert name, e.g. `weak-credential-detection.md`, `rdp-login-restriction.md`, and place it in the most appropriate category folder above.
- Do not add PDFs; keep writeups as Markdown so GitHub renders them directly.

Current scenarios by category:

- credential-access/
	- `weak-credential-detection.md` (migrated from 2025-12-08 - THM CTF - Crack The Hash)
- endpoint-activity/
	- `persistence-mechanism-detected.md` (migrated from 2025-12-23 - THM CTF - Shadow Trace)

When you add or update scenarios, push them to the `main` branch and keep screenshots referenced with relative paths.
