# Investigation: Network Traffic Analysis Using Wireshark

**Date:** 2026-01-19

## Overview

This report documents a packet-level traffic analysis performed using Wireshark as part of a controlled investigation exercise. The objective was to analyze a large packet capture (PCAP), identify notable traffic patterns, and demonstrate practical proficiency with Wireshark statistics, protocol analysis, and advanced display filtering techniques commonly used in a SOC environment.

## Scope and Data

* **Artifact analyzed:** `Exercise.pcapng`
* **Analysis focus:** Network traffic visibility, protocol distribution, endpoint behavior, and targeted packet filtering
* **Tools used:** Wireshark statistics, protocol hierarchy, endpoint analysis, DNS/HTTP statistics, and advanced display filters

## Initial Traffic Assessment

The investigation began with a high-level review of the capture using Wireshark’s Statistics menu to establish baseline context. Protocol hierarchy and conversation views revealed a traffic set dominated by IPv4 communications, with significant TCP and application-layer activity. This initial assessment helped narrow the scope and identify where deeper analysis was warranted.

Resolved address analysis identified multiple external domains and organizations present in the capture, providing early indicators of external communications worth examining further. Endpoint and conversation statistics were then used to understand which systems were most active and how data was flowing between them.

## Endpoint and Geographic Observations

Endpoint statistics highlighted a small number of systems responsible for a disproportionate amount of traffic. Enabling name resolution and GeoIP enrichment allowed IP addresses to be associated with organizations and geographic locations. This made it possible to identify:

* Multiple IP addresses linked to the same city and autonomous system
* High-volume endpoints that could warrant further investigation in a real-world scenario

These techniques mirror how analysts quickly triage traffic to identify unusual concentrations of activity or unexpected external connections.

## Protocol-Specific Analysis

Protocol-level statistics were used to examine DNS and HTTP behavior in more detail:

* DNS statistics exposed request/response timing and query volumes, useful for spotting latency issues or abnormal resolution behavior.
* HTTP statistics revealed request distributions and frequently contacted domains, supporting identification of dominant services and potential anomalies.

This phase demonstrated how protocol statistics can provide insight without immediately resorting to packet-by-packet inspection.

## Targeted Packet Filtering

With context established, display filters were applied to isolate traffic of interest:

* IP-based filters were used to quantify total IP traffic and identify packets with unusually low TTL values.
* TCP filters isolated traffic on specific ports often associated with suspicious or non-standard activity.
* Application-layer filters identified HTTP GET requests and DNS query types.

Advanced filtering operators (such as `contains`, `matches`, logical operators, and string functions) were used to refine results further, demonstrating the ability to pivot quickly based on evolving investigative questions.

## Advanced Analysis and Validation

The investigation concluded with more advanced techniques, including:

* Identifying Microsoft IIS server traffic and distinguishing between standard and non-standard port usage
* Correlating server version information with packet counts
* Aggregating traffic across multiple high-risk ports
* Validating packet integrity through checksum analysis using a specialized Wireshark profile

These steps reflect real SOC workflows where analysts validate assumptions, reduce false positives, and confirm findings through multiple analytical angles.

## Conclusion

This exercise demonstrates practical SOC-level packet analysis skills, including traffic triage, endpoint identification, protocol analysis, and advanced filtering in Wireshark. Rather than focusing on individual lab questions, the investigation emphasized building situational awareness from raw network data and progressively narrowing scope to answer specific analytical questions.

The techniques used here are directly applicable to incident investigation, network anomaly detection, and threat-hunting activities in a production SOC environment.
