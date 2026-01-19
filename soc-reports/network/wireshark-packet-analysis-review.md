# Wireshark Packet Analysis Review

**Date:** 2026-01-19
**Category:** Network
**Lab Type:** TryHackMe
**Focus:** Packet-Level Analysis, Statistics, and Advanced Filtering

---

## Overview

This lab focused on packet-level traffic analysis using Wireshark, building on foundational skills and moving into advanced usage of statistics, protocol analysis, and display filters. The objective was to extract meaningful security-relevant insights from a provided PCAP by leveraging Wireshark’s built-in analytical features rather than manual packet-by-packet inspection.

The exercise mirrors real SOC workflows where analysts must quickly summarize traffic, identify anomalies, and validate hypotheses using structured tooling.

---

## Dataset and Environment

* **PCAP:** `Exercise.pcapng`
* **Tooling:** Wireshark (TryHackMe provided VM)
* **Scope:** Offline packet analysis only
* **Note:** No live interaction with domains or IP addresses

---

## Key Analysis Areas

### 1. Traffic Summary and Scoping

Using the **Statistics** menu to establish a high-level understanding of the capture:

* Protocol distribution and usage
* Endpoint and conversation enumeration
* DNS, HTTP, and IP-level activity trends

This initial scoping step helped narrow areas of interest before applying granular filters.

---

### 2. Resolved Addresses and Attribution

* Identified resolved hostnames directly from DNS responses
* Mapped IP addresses to organizations and geographic locations where available
* Used endpoint statistics to associate traffic volume with specific MAC vendors

**Notable Findings**

* BBC-related hostname resolved to `199.232.24.81`
* Four IP addresses associated with Kansas City
* `Micro-St` MAC address transferred **7474 KB**
* AS Organization **Blicnet d.o.o** mapped to `188.246.82.7`

---

### 3. Conversations and Endpoints

* **IPv4 Conversations:** 435
* Identified dominant destination IPs based on packet and byte counts
* Correlated RX packet volume to identify primary traffic sinks

**Most-used IPv4 destination:**
`10.100.1.33`

---

### 4. Protocol-Specific Statistics

**DNS**

* Maximum request-response time: **0.467897 seconds**
* Type A DNS queries: **51**

**HTTP**

* Requests to `rad.msn.com`: **39**
* HTTP GET requests to port 80: **527**

---

## Packet Filtering and Query-Based Analysis

### Display Filters Used

Examples of applied filters include:

* All IP traffic

  ```
  ip
  ```

* Low TTL packets

  ```
  ip.ttl < 10
  ```

* TCP port activity

  ```
  tcp.port == 4444
  ```

* HTTP GET requests over port 80

  ```
  http.request.method == GET && tcp.port == 80
  ```

* DNS Type A queries

  ```
  dns.qry.type == 1
  ```

**Key Counts**

* Total IP packets: **81,420**
* TTL < 10 packets: **66**
* TCP port 4444 packets: **632**

---

## Advanced Filtering Techniques

### String and Pattern Matching

* IIS servers not originating from port 80:

  ```
  http.server contains "IIS" && tcp.srcport != 80
  ```

  **Result:** 21 packets

* IIS version 7.5 identification:

  ```
  http.server contains "IIS" && http.server contains "7.5"
  ```

  **Result:** 71 packets

* Multi-port aggregation:

  ```
  tcp.port == 3333 or tcp.port == 4444 or tcp.port == 9999
  ```

  **Result:** 2235 packets

* Even TTL values:

  ```
  string(ip.ttl) matches "[02468]$"
  ```

  **Result:** 77,289 packets

---

## Expert Analysis and Profiles

* Switched to **Checksum Control** profile
* Used **Expert Info** to identify integrity issues

**Bad TCP Checksum packets:** **34,185**

Using preconfigured display filter buttons resulted in:

* **Displayed packets:** 261

---

## Outcome and Takeaways

This exercise reinforced practical SOC-level packet analysis techniques, emphasizing:

* Using statistics to guide investigations
* Applying precise display filters instead of manual inspection
* Leveraging profiles, bookmarks, and expert info to scale analysis efficiently

These skills are directly transferable to alert triage, incident investigation, and network-based threat detection in a SOC environment.

---

**Lab Completed:** Wireshark — Packet Operations
**Skill Focus:** Network Traffic Analysis, Protocol Inspection, Filtering Logic
