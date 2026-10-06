/* ==========================================================================
   BLACK VEIL // archive data
   --------------------------------------------------------------------------
   Every entry carries a `label`:
     DOC  = DOCUMENTED              (real, historically recorded events)
     UNV  = UNVERIFIED              (real claims / legends without evidence)
     FICZ = FICTIONALIZED           (real subject, invented details)
     CSF  = CLASSIFIED-STYLE FICTION (entirely invented for this site)
   Fictional content is NEVER presented as fact. Documented entries summarise
   the public historical record and mainstream explanations.
   ========================================================================== */
window.BV = {};

BV.labels = {
  DOC:  { name: 'DOCUMENTED',              note: 'Historically recorded. Summary of the public record.' },
  UNV:  { name: 'UNVERIFIED',              note: 'Claim or legend circulating publicly. No supporting evidence.' },
  FICZ: { name: 'FICTIONALIZED',           note: 'Real subject with invented narrative details.' },
  CSF:  { name: 'CLASSIFIED-STYLE FICTION', note: 'Entirely fictional. Part of the BLACK VEIL story.' }
};

BV.threat = [
  null,
  { lvl: 1, name: 'OBSERVATION', desc: 'No immediate threat. Passive monitoring only.' },
  { lvl: 2, name: 'CONTAINMENT', desc: 'Potential biological or environmental hazard.' },
  { lvl: 3, name: 'CRITICAL',    desc: 'Unknown behaviour or significant human risk.' },
  { lvl: 4, name: 'BLACK',       desc: 'Information restricted. Interface integrity reduced.' },
  { lvl: 5, name: 'EXTINCTION',  desc: 'Global consequences possible.' }
];

/* Recurring signatures. The story hides these across unrelated files. */
BV.signatures = ['03:17:42', '1420.4', '3-17-42', 'THRESHOLD', 'seventeen seconds', 'lattice', 'the response'];

/* ---------------------------------------------------------------- SITES */
/* type: facility (fictional) | event (documented / unverified) | hidden */
BV.sites = [
  {
    id: 'F07', type: 'facility', label: 'CSF', veil: true,
    name: 'FACILITY 07', region: 'NEVADA DESERT', lat: 37.62, lon: -116.31,
    status: 'SIGNAL DETECTED', threat: 3, threatText: 'UNKNOWN', last: '03:17:42 UTC',
    discovered: '1947-07-02', classification: 'TS // VEIL-ORANGE', division: 'PERCEPTION & SIGNALS (DIV. M)',
    purpose: 'Recovered-material analysis; later, human perception research (PROJECT MIRROR).',
    security: 'TIER 4', built: '1951', depth: '214 m (7 sub-levels)', personnel: '~340 (1988) / 41 (current)',
    activity: 'Intermittent power draw at 03:17 UTC nightly. No scheduled operations.',
    summary: 'Desert installation built around material recovered in July 1947. The material was catalogued, sealed, and — according to the last inventory — never removed. The vault still reports a carrier tone.',
    incidents: ['1951 — Sub-level 6 sealed after "orientation failures" among staff.', '1974 — MIRROR trial 22 halted. Subject described "a room that looks back."', '2024 — Vault telemetry resumes after 31 years of silence.'],
    observations: ['Recovered material is non-magnetic but deflects compasses by exactly 17°.', 'Carrier tone measured at 1420.4 MHz within the shielded vault.', 'All staff clocks on sub-level 6 run 17 seconds slow.'],
    evidence: ['Inventory card V-001 (photograph)', 'Vault telemetry trace, 2024-10-31', 'MIRROR session audio, trial 22'],
    timeline: [['1947', 'Material recovered, area cordoned.'], ['1951', 'Facility 07 commissioned.'], ['1974', 'PROJECT MIRROR trials.'], ['1993', 'Facility mothballed.'], ['2024', 'Telemetry resumes.']],
    notes: 'Whatever is in the vault did not arrive in 1947. 1947 is when we started looking at it.',
    audio: { kind: 'carrier', caption: 'VAULT MIC 2 — continuous tone, 1420.4 MHz downconverted' },
    projects: ['MIRROR'], docs: ['DOC-1947'], keys: ['F07']
  },
  {
    id: 'OMEGA', type: 'facility', label: 'CSF', veil: true, denied: true,
    name: 'STATION OMEGA', region: 'ANTARCTICA — DOME SECTOR', lat: -80.2, lon: 61.4,
    status: 'NO CARRIER', threat: 4, threatText: 'BLACK', last: '— — : — — : — —',
    discovered: '1959-01-14', classification: 'BLACK // NO FOREIGN', division: '[REDACTED]',
    purpose: '[ACCESS DENIED]', security: 'TIER 5', built: '1961', depth: '3,700 m (ice borehole)', personnel: '[REDACTED]',
    activity: 'Station dark since 1998. Borehole temperature rising 0.4 °C / year.',
    summary: 'Deep-ice drilling station positioned above a subglacial cavity. Ice cores from below 3,400 m contain a repeating crystalline inclusion pattern. Remaining file content restricted.',
    incidents: ['1966 — Winter crew reports "knocking" from borehole. [REMAINDER REDACTED]', '1998 — Final transmission. [REDACTED]'],
    observations: ['Inclusion spacing ratio: 3 : 17 : 42.', '[REDACTED]', '[REDACTED]'],
    evidence: ['Ice core OM-3412 (cross-section)', '[ACCESS DENIED]'],
    timeline: [['1959', 'Survey identifies cavity.'], ['1961', 'Station built.'], ['1966', '[REDACTED]'], ['1998', 'Contact lost.']],
    notes: '[ACCESS DENIED — CLEARANCE VEIL-BLACK REQUIRED]',
    audio: { kind: 'static', caption: 'LAST TRANSMISSION 1998 — carrier absent' },
    projects: ['ZERO'], docs: [], keys: ['OMEGA']
  },
  {
    id: 'BS12', type: 'facility', label: 'CSF', veil: true,
    name: 'BLACK SITE 12', region: 'SIBERIA — EVENKI PLATEAU', lat: 62.4, lon: 98.6,
    status: 'EM ACTIVITY', threat: 3, threatText: 'CRITICAL', last: '03:17:42 UTC',
    discovered: '1958-08-21', classification: 'TS // VEIL-RED', division: 'ELECTROMAGNETIC STUDIES (DIV. N)',
    purpose: 'Long-baseline magnetometer array studying periodic geomagnetic disturbance (PROJECT NIGHTFALL).',
    security: 'TIER 4', built: '1962', depth: '60 m', personnel: '~90 (seasonal)',
    activity: 'Magnetometers record a disturbance every night at 03:17 UTC, regardless of solar conditions.',
    summary: 'Remote array in permafrost tracking a geomagnetic pulse with a period that drifts by exactly seventeen seconds per year. Local wildlife avoids a 4 km circle centred on Sensor 9.',
    incidents: ['1971 — Sensor 9 crew evacuated; equipment found arranged in a spiral.', '1989 — Aurora observed at latitude where none is possible. Photographed.', '2019 — Array goes silent for 42 minutes.'],
    observations: ['Pulse shape matches the Cairn Station signal envelope (1968).', 'Permafrost core shows ordered magnetic grains in 3-17-42 banding.', 'No solar or tectonic correlation.'],
    evidence: ['Magnetogram strip, 1971-03-03', 'Aurora photograph, 1989', 'Grain-alignment micrograph'],
    timeline: [['1958', 'Survey anomaly logged.'], ['1962', 'Array installed.'], ['1971', 'Sensor 9 evacuation.'], ['2019', '42-minute silence.']],
    notes: 'The pulse is not natural. It is also not ours. It comes up from below.',
    audio: { kind: 'pulse', caption: 'MAGNETOMETER 9 — sonified, ×4000' },
    projects: ['NIGHTFALL'], docs: [], keys: ['BS12']
  },
  {
    id: 'DEEPNODE', type: 'facility', label: 'CSF', veil: true,
    name: 'DEEP NODE', region: 'NORTH ATLANTIC — ABYSSAL PLAIN', lat: 46.8, lon: -31.7,
    status: 'LISTENING', threat: 2, threatText: 'CONTAINMENT', last: '03:17:39 UTC',
    discovered: '1964-05-09', classification: 'SECRET // VEIL-AMBER', division: 'OCEANIC ACOUSTICS (DIV. O)',
    purpose: 'Seabed hydrophone node, ostensibly for submarine tracking.',
    security: 'TIER 3', built: '1966', depth: '4,880 m (seabed)', personnel: 'Unmanned',
    activity: 'Recording a low-frequency call that responds when the node transmits.',
    summary: 'Unmanned acoustic node on the abyssal plain. Since 2012 it records a call that answers its own calibration pings — after a delay of exactly seventeen seconds.',
    incidents: ['2012 — First recorded "answer" to a calibration ping.', '2016 — Ping schedule suspended by order of Div. O.', '2024 — Answer received with no ping sent.'],
    observations: ['Call frequency sweeps through 3, 17 and 42 Hz.', 'Source localisation fails: the call arrives from all bearings at once.', 'Whale traffic diverts 60 km around the node.'],
    evidence: ['Hydrophone spectrogram 2012-06-03', 'Ping/response log', 'Bathymetric survey'],
    timeline: [['1966', 'Node deployed.'], ['2012', 'First answer.'], ['2016', 'Pings suspended.'], ['2024', 'Unprompted answer.']],
    notes: 'We stopped asking. It kept answering.',
    audio: { kind: 'whale', caption: 'HYDROPHONE H-2 — 2012-06-03, pitch-shifted ×12' },
    projects: ['ORPHEUS'], docs: ['DOC-2012'], keys: ['DEEPNODE']
  },
  {
    id: 'ORPHEUS', type: 'facility', label: 'CSF', veil: true,
    name: 'SITE ORPHEUS', region: 'REMOTE PACIFIC — ATOLL 3', lat: -11.6, lon: -151.2,
    status: 'QUARANTINE', threat: 3, threatText: 'CRITICAL', last: '02:41:07 UTC',
    discovered: '1979-11-30', classification: 'TS // VEIL-RED', division: 'MARINE BIOLOGY (DIV. O)',
    purpose: 'Atoll laboratory processing deep-ocean biological samples (PROJECT ORPHEUS).',
    security: 'TIER 4', built: '1981', depth: '38 m (lagoon wet-lab)', personnel: '~25',
    activity: 'Lagoon water bioluminescence pulses in 3-17-42 rhythm since containment breach.',
    summary: 'Atoll wet-laboratory for organisms recovered from hadal depths. Specimen ORP-3 grows toward sound sources. The lagoon is now under quarantine.',
    incidents: ['1994 — ORP-3 filament breaches tank; lagoon sealed.', '2008 — Two researchers report shared dream of "a door under water".', '2024 — Bioluminescence pulse synchronises with Deep Node answer.'],
    observations: ['ORP-3 filaments orient toward hydrophones, not light.', 'Cell walls arranged in lattice spacing identical to Omega ice inclusions.', 'Specimen dormant when not observed by instruments. [UNVERIFIED]'],
    evidence: ['Lagoon timelapse', 'ORP-3 micrograph', 'Dream reports (2)'],
    timeline: [['1979', 'Atoll surveyed.'], ['1981', 'Lab built.'], ['1994', 'Breach.'], ['2024', 'Synchronisation.']],
    notes: 'It grows toward whoever is listening.',
    audio: { kind: 'drip', caption: 'WET-LAB AMBIENT — tank 4' },
    projects: ['ORPHEUS'], docs: [], keys: ['ORPHEUS']
  },
  {
    id: 'KASAI', type: 'facility', label: 'CSF', veil: true,
    name: 'KASAI ARRAY', region: 'CENTRAL AFRICA — RAINFOREST BASIN', lat: -3.2, lon: 21.9,
    status: 'CONTAINMENT FAILURE', threat: 3, threatText: 'CRITICAL', last: '02:41:00 UTC',
    discovered: '1983-02-17', classification: 'TS // VEIL-RED', division: 'BIOHAZARD (DIV. B)',
    purpose: 'Field biocontainment laboratory (PROJECT REDLINE).',
    security: 'TIER 4', built: '1984', depth: '22 m', personnel: '~60 (1986) / 0 (current)',
    activity: 'Facility abandoned. Automated freezers still running on geothermal tap.',
    summary: 'BSL-4 field laboratory established to study an agent recovered from a fictional village outbreak. A 1986 incident ended operations. Specimen VX-17 is listed as missing.',
    incidents: ['1986 — Biological incident. Facility sealed. [SEE DOC-1986]', '1986 — VX-17 freezer found open, empty, frost intact.', '2024 — Freezer 3 door logged opening at 02:41 UTC.'],
    observations: ['VX-17 replicates only in the presence of active electrical equipment.', 'Infected cultures arrange in lattice spacing 3-17-42.', 'No transmission to humans ever confirmed.'],
    evidence: ['Freezer access log', 'Culture plate photograph', 'Evacuation roster'],
    timeline: [['1983', 'Agent recovered.'], ['1984', 'Lab built.'], ['1986', 'Incident; abandoned.'], ['2024', 'Freezer 3 opens.']],
    notes: 'It is not a virus. It is behaving like one because that is what we expected to see.',
    audio: { kind: 'alarm', caption: 'FACILITY PA — automated, 1986 loop' },
    projects: ['REDLINE'], docs: ['DOC-1986'], keys: ['KASAI']
  },
  {
    id: 'VERDANT', type: 'facility', label: 'CSF', veil: true,
    name: 'VERDANT-9', region: 'AMAZON BASIN — UPPER RIO NEGRO', lat: -0.9, lon: -65.8,
    status: 'ACTIVE', threat: 2, threatText: 'CONTAINMENT', last: '03:17:40 UTC',
    discovered: '1991-09-04', classification: 'SECRET // VEIL-AMBER', division: 'REGENERATIVE BIOLOGY (DIV. B)',
    purpose: 'Canopy research station studying a regenerative fungal network (PROJECT HELIX).',
    security: 'TIER 3', built: '1993', depth: 'Surface + 12 m root vault', personnel: '~18',
    activity: 'Mycelial network conductivity spikes nightly at 03:17 UTC.',
    summary: 'Field station built around a fungal network whose extract accelerates tissue repair. Treated tissue regrows with a structure that was never in the original organism.',
    incidents: ['1997 — Lab rat HX-R4 regrows limb with an extra joint.', '2003 — Network expands 2 km toward station generator.', '2024 — Conductivity spike coincides with global pattern advisory.'],
    observations: ['Regrown tissue contains lattice microstructure.', 'Network electrical activity resembles a slowed signal from Cairn (1968).', 'Tissue repair halts when instruments are switched off.'],
    evidence: ['HX-R4 x-ray', 'Network conductivity chart', 'Soil core'],
    timeline: [['1991', 'Network discovered.'], ['1993', 'Station built.'], ['1997', 'HX-R4.'], ['2024', 'Spike.']],
    notes: 'It is not healing. It is rebuilding toward a template.',
    audio: { kind: 'forest', caption: 'CANOPY MIC — night chorus stops at 03:17' },
    projects: ['HELIX'], docs: [], keys: ['VERDANT']
  },
  {
    id: 'CAIRN', type: 'facility', label: 'CSF', veil: true,
    name: 'CAIRN STATION', region: 'HIMALAYA — HIGH PLATEAU', lat: 30.2, lon: 84.1,
    status: 'OBSERVATION', threat: 1, threatText: 'OBSERVATION', last: '03:17:42 UTC',
    discovered: '1959-04-12', classification: 'SECRET // VEIL-AMBER', division: 'SIGNALS (DIV. E)',
    purpose: 'High-altitude radio listening post (PROJECT ECHO).',
    security: 'TIER 3', built: '1964', depth: 'Surface', personnel: '6',
    activity: 'Receiving a narrowband signal near 1420.4 MHz since 1968.',
    summary: 'Listening post established after a 1959 survey party vanished nearby (fictional). In 1968 it detected a signal that has repeated every night since. Part of the signal is Morse.',
    incidents: ['1959 — Survey party of four lost. Camp found intact, stove still warm.', '1968 — First reception of the ECHO signal.', '1991 — Signal briefly carries Morse code.'],
    observations: ['Signal arrives from no fixed point in the sky.', 'Contains a Morse segment (see PROJECT ECHO transcript).', 'Doppler shift implies the source is stationary relative to Earth’s core.'],
    evidence: ['Chart recorder trace 1968', 'Morse transcript 1991', 'Survey party camp photograph'],
    timeline: [['1959', 'Survey party lost.'], ['1964', 'Station built.'], ['1968', 'Signal.'], ['1991', 'Morse segment.']],
    notes: 'Signal is not from the sky. The dish is pointed up, but the signal comes up through the mountain.',
    audio: { kind: 'morse', caption: 'ECHO — 1991 segment. Listen carefully.' },
    projects: ['ECHO'], docs: ['DOC-1968'], keys: ['CAIRN']
  },
  {
    id: 'HADAL', type: 'facility', label: 'CSF', veil: true, denied: true,
    name: 'HADAL-4', region: 'DEEP OCEAN — MARIANA SECTOR', lat: 11.4, lon: 142.4,
    status: 'SIGNAL DETECTED', threat: 4, threatText: 'BLACK', last: '03:17:42 UTC',
    discovered: '1997-08-11', classification: 'BLACK // VEIL-BLACK', division: '[REDACTED]',
    purpose: 'Deep-trench lander array. [PARTIAL ACCESS]', security: 'TIER 5', built: '1999', depth: '10,6■■ m', personnel: 'Unmanned',
    activity: 'Lander cameras record a slow light pattern at the trench floor.',
    summary: 'Lander array deployed after a 1997 satellite anomaly over the trench. [REMAINDER REDACTED]',
    incidents: ['1997 — Satellite "STAIN" anomaly centred on trench.', '2012 — Lander 2 lost. [REDACTED]'],
    observations: ['[REDACTED]', 'Light pattern period: 3 : 17 : 42 minutes.'],
    evidence: ['[ACCESS DENIED]'],
    timeline: [['1997', 'STAIN anomaly.'], ['1999', 'Landers deployed.'], ['2012', '[REDACTED]']],
    notes: '[ACCESS DENIED]',
    audio: { kind: 'static', caption: '[ACCESS DENIED]' },
    projects: ['ZERO'], docs: ['DOC-1997'], keys: ['HADAL']
  },
  {
    id: 'NULL', type: 'hidden', label: 'CSF', veil: true,
    name: 'SITE NULL', region: 'OCEANIC POLE OF INACCESSIBILITY', lat: -48.88, lon: -123.39,
    status: 'IT IS LISTENING', threat: 5, threatText: 'EXTINCTION', last: '03:17:42 UTC',
    discovered: '— — — —', classification: 'VEIL // NULL', division: 'NONE',
    summary: 'There is no facility here. There never was. Every signal, every lattice, every seventeen-second delay triangulates to this point — and then to every point at once.',
    incidents: [], observations: [], evidence: [], timeline: [], notes: '',
    audio: { kind: 'carrier', caption: '—' }, projects: [], docs: [], keys: ['NULL']
  },

  /* ---------- DOCUMENTED / UNVERIFIED real-world events (cold-blue markers) */
  { id: 'R-TUNGUSKA', type: 'event', label: 'DOC', name: 'TUNGUSKA EVENT', region: 'SIBERIA, RUSSIA', lat: 60.89, lon: 101.89, year: '1908', ref: 'U-TUNGUSKA', threat: 1 },
  { id: 'R-ROSWELL',  type: 'event', label: 'DOC', name: 'ROSWELL DEBRIS', region: 'NEW MEXICO, USA', lat: 33.39, lon: -104.52, year: '1947', ref: 'U-ROSWELL', threat: 1 },
  { id: 'R-DYATLOV',  type: 'event', label: 'DOC', name: 'DYATLOV PASS', region: 'NORTHERN URALS, RUSSIA', lat: 61.75, lon: 59.45, year: '1959', ref: 'U-DYATLOV', threat: 1 },
  { id: 'R-WOW',      type: 'event', label: 'DOC', name: 'WOW! SIGNAL', region: 'OHIO, USA', lat: 40.07, lon: -83.07, year: '1977', ref: 'U-WOW', threat: 1 },
  { id: 'R-SVERD',    type: 'event', label: 'DOC', name: 'SVERDLOVSK ANTHRAX', region: 'YEKATERINBURG, RUSSIA', lat: 56.84, lon: 60.6, year: '1979', ref: 'U-SVERD', threat: 1 },
  { id: 'R-VELA',     type: 'event', label: 'DOC', name: 'VELA INCIDENT', region: 'SOUTH INDIAN OCEAN', lat: -46.9, lon: 37.8, year: '1979', ref: 'U-VELA', threat: 1 },
  { id: 'R-BLOOP',    type: 'event', label: 'DOC', name: 'THE BLOOP', region: 'SOUTH PACIFIC', lat: -50.0, lon: -100.0, year: '1997', ref: 'U-BLOOP', threat: 1 },
  { id: 'R-NIMITZ',   type: 'event', label: 'DOC', name: 'NIMITZ ENCOUNTER', region: 'OFF BAJA CALIFORNIA', lat: 31.3, lon: -117.6, year: '2004', ref: 'U-NIMITZ', threat: 1 },
  { id: 'R-HESS',     type: 'event', label: 'DOC', name: 'HESSDALEN LIGHTS', region: 'TRØNDELAG, NORWAY', lat: 62.8, lon: 11.19, year: '1981–', ref: 'U-HESS', threat: 1 },
  { id: 'R-KOLA',     type: 'event', label: 'UNV', name: 'KOLA "WELL TO HELL"', region: 'KOLA PENINSULA, RUSSIA', lat: 69.4, lon: 30.6, year: '1989', ref: 'U-KOLA', threat: 1 },
  { id: 'R-FLIGHT19', type: 'event', label: 'DOC', name: 'FLIGHT 19', region: 'WESTERN ATLANTIC', lat: 28.9, lon: -78.6, year: '1945', ref: 'U-FLIGHT19', threat: 1 },
  { id: 'R-VOSTOK',   type: 'event', label: 'DOC', name: 'LAKE VOSTOK', region: 'EAST ANTARCTICA', lat: -77.5, lon: 106.0, year: '2012', ref: 'U-VOSTOK', threat: 1 }
];

/* ------------------------------------------------------------- PROJECTS */
BV.projects = [
  {
    id: 'HELIX', pid: 'BV-P-0117', codename: 'PROJECT HELIX', label: 'CSF', veil: true,
    site: 'VERDANT', location: 'Verdant-9, Amazon Basin', org: 'Meridian Biosciences (front entity)',
    category: 'REGENERATIVE BIOLOGY', status: 'ACTIVE', threat: 2,
    discovered: '1991-09-04', updated: '2024-10-31 03:17:42 UTC',
    researchers: ['Dr. Inês Albuquerque-Rao (lead)', 'Dr. Tomasz Varga', 'Dr. [REDACTED]'],
    summary: 'Experimental biological regeneration research using an extract from a mycelial network. Regrowth is complete — and structurally different from the original.',
    findings: ['Extract HX-2 restores amputated limbs in rodents within 9 days.', 'Regrown bone contains an ordered lattice not present in any rodent.', 'Regrowth pauses whenever monitoring equipment is switched off.'],
    evidence: ['HX-R4 x-ray series', 'Lattice micrograph ×40,000', 'Network conductivity log'],
    incidents: ['IR-1997-04: HX-R4 limb regrows with additional joint.'],
    related: ['REDLINE', 'ORPHEUS'], grants: 'HELIX'
  },
  {
    id: 'NIGHTFALL', pid: 'BV-P-0062', codename: 'PROJECT NIGHTFALL', label: 'CSF', veil: true,
    site: 'BS12', location: 'Black Site 12, Siberia', org: 'Directorate N (joint)',
    category: 'ELECTROMAGNETIC ANOMALY', status: 'MONITORING', threat: 3,
    discovered: '1958-08-21', updated: '2019-07-14',
    researchers: ['Dr. Yevgenia Sorokina', 'Cpt. R. Halloran (liaison)', 'Eng. D. Batmönkh'],
    summary: 'Investigation into unexplained electromagnetic activity: a nightly geomagnetic pulse with no solar or tectonic source.',
    findings: ['Pulse occurs at 03:17 UTC nightly since 1962.', 'Period drifts by seventeen seconds per year — toward synchrony with ECHO.', 'Magnetic grains in permafrost aligned in 3-17-42 bands.'],
    evidence: ['Magnetogram archive 1962–2019', 'Aurora photograph 1989', 'Sensor 9 evacuation report'],
    incidents: ['IR-1971-03: Sensor 9 equipment rearranged.', 'IR-2019-07: 42-minute array silence.'],
    related: ['ECHO', 'MIRROR'], grants: 'NIGHTFALL'
  },
  {
    id: 'ORPHEUS', pid: 'BV-P-0140', codename: 'PROJECT ORPHEUS', label: 'CSF', veil: true,
    site: 'ORPHEUS', location: 'Site Orpheus, Pacific / Deep Node, N. Atlantic', org: 'Pelagic Survey Consortium',
    category: 'DEEP-OCEAN BIOLOGY', status: 'QUARANTINE', threat: 3,
    discovered: '1979-11-30', updated: '2024-10-31',
    researchers: ['Dr. Kaimana Akana', 'Dr. Henrik Solberg', 'Dr. Ade Ogunleye'],
    summary: 'Deep-ocean biological discovery: filamentous colonies recovered near hydrothermal vents that grow toward sound and answer acoustic signals.',
    findings: ['ORP-3 orients toward active hydrophones.', 'Colony emits bioluminescent pulses in 3-17-42 rhythm.', 'Deep Node receives responses to pings after seventeen seconds.'],
    evidence: ['Lagoon timelapse', 'Hydrophone spectrogram', 'Dream reports'],
    incidents: ['IR-1994-02: ORP-3 tank breach.', 'IR-2012-06: First "answer" at Deep Node.'],
    related: ['HELIX', 'ECHO'], grants: 'ORPHEUS'
  },
  {
    id: 'ECHO', pid: 'BV-P-0031', codename: 'PROJECT ECHO', label: 'CSF', veil: true,
    site: 'CAIRN', location: 'Cairn Station, Himalaya', org: 'Division E (Signals)',
    category: 'SIGNAL INTELLIGENCE', status: 'ONGOING', threat: 1,
    discovered: '1968-11-04', updated: '2024-10-31 03:17:42 UTC',
    researchers: ['Dr. Priya Raghunathan', 'Sgt. M. Ozturk', 'Dr. Lars Eklund'],
    summary: 'Research into an unidentified narrowband signal near 1420.4 MHz received nightly since 1968. In 1991 the signal briefly carried Morse code.',
    findings: ['Signal begins at 03:17:42 UTC every night.', 'Source appears stationary relative to Earth, not the sky.', 'Morse segment, 1991: — .... .-. . ... .... --- .-.. -..'],
    evidence: ['Chart recorder trace', 'Morse transcript (play the transmission)', 'Survey party photograph'],
    incidents: ['IR-1959-04: Survey party lost.', 'IR-1991-09: Morse segment received.'],
    related: ['NIGHTFALL', 'ZERO'], grants: 'ECHO', morse: 'THRESHOLD'
  },
  {
    id: 'REDLINE', pid: 'BV-P-0088', codename: 'PROJECT REDLINE', label: 'CSF', veil: true,
    site: 'KASAI', location: 'Kasai Array, Central Africa', org: 'Division B (Biohazard)',
    category: 'PATHOGEN CONTAINMENT', status: 'TERMINATED', threat: 3,
    discovered: '1983-02-17', updated: '1986-03-19',
    researchers: ['Dr. Celestin Mbuyi', 'Dr. Hannah Whitcombe', 'Tech. S. Ilunga'],
    summary: 'Experimental pathogen containment program studying agent VX-17. Terminated after the 1986 incident.',
    findings: ['VX-17 replicates only near active electrical equipment.', 'Infected cultures self-organise into lattice spacing.', 'Specimen VX-17 missing since 1986.'],
    evidence: ['Freezer log', 'Culture plate', 'Evacuation roster'],
    incidents: ['IR-1986-03: Containment failure. See DOC-1986.'],
    related: ['HELIX', 'MIRROR'], grants: 'REDLINE'
  },
  {
    id: 'MIRROR', pid: 'BV-P-0074', codename: 'PROJECT MIRROR', label: 'CSF', veil: true,
    site: 'F07', location: 'Facility 07, Nevada', org: 'Division M (Perception)',
    category: 'ANOMALOUS COGNITION', status: 'SUSPENDED', threat: 3,
    discovered: '1972-01-10', updated: '1993-12-01',
    researchers: ['Dr. Miriam Castellanos', 'Dr. Owen Pryce', 'Subject pool: 61 volunteers'],
    summary: 'Research into anomalous perception: subjects exposed to the recovered material report the sensation of being studied in return.',
    findings: ['78% of subjects describe "a room that looks back".', 'EEG coherence spikes at 03:17 local-equivalent time.', 'Subjects draw the same lattice without having seen it.'],
    evidence: ['Subject drawings (61)', 'Trial 22 audio', 'EEG composite'],
    incidents: ['IR-1974-11: Trial 22 halted.'],
    related: ['NIGHTFALL', 'REDLINE'], grants: 'MIRROR'
  },
  {
    id: 'ZERO', pid: 'BV-P-0000', codename: 'PROJECT ZERO', label: 'CSF', veil: true, locked: true,
    site: 'OMEGA', location: '████████████', org: '████████████',
    category: '██████', status: 'UNKNOWN', threat: 4,
    discovered: '████-██-██', updated: '████',
    researchers: ['████████', '████████'],
    summary: 'FILE SEALED. Enter passphrase to decrypt.',
    unlocked: {
      location: 'Station Omega, Antarctica / Hadal-4, Mariana / [all sites]', org: 'BLACK VEIL (founding charter, 1968)',
      category: 'CORRELATION', status: 'ACTIVE — UNCONTAINABLE', discovered: '1947-07-02', updated: 'NOW',
      researchers: ['All of them.', 'You.'],
      summary: 'PROJECT ZERO is not a research project. It is the index of every other one. Each division believed it had found something different — a signal, an organism, a pulse, a dream. Zero is the file where the coordinates converge: 48.88 S, 123.39 W.',
      findings: ['Every phenomenon intensifies under observation and pauses without it.', 'Every phenomenon contains the same ratio: 3 : 17 : 42.', 'Every phenomenon began, or was first noticed, after we started looking.'],
      evidence: ['Convergence plot (all sites)', 'Coordinates: -48.88, -123.39', '[OPEN SITE NULL ON THE GLOBAL MAP]']
    },
    incidents: ['████'], related: ['ECHO', 'HELIX', 'NIGHTFALL', 'ORPHEUS', 'REDLINE', 'MIRROR'], grants: 'ZERO'
  },
  {
    id: 'LANTERN', pid: 'BV-P-0001', codename: 'PROJECT LANTERN', label: 'CSF', veil: true, secret: true,
    site: 'F07', location: 'All Black Veil sites', org: 'BLACK VEIL Correlation Office',
    category: 'META-ANALYSIS', status: 'DISCOVERED BY YOU', threat: 4,
    discovered: '1968-11-04', updated: 'THIS SESSION',
    researchers: ['Correlation Officer [REDACTED]'],
    summary: 'Hidden project. LANTERN was the cross-division audit that first suspected the incidents were connected. Its auditor requested a total moratorium on observation. The request was denied.',
    findings: ['Observation acts as a nutrient.', 'Moratorium proposal (1988) rejected 4–1.', 'Auditor’s final memo: "Stop looking at it and it stops growing. We will not stop looking."'],
    evidence: ['Moratorium proposal', 'Vote record'], incidents: [], related: ['ZERO'], grants: 'LANTERN'
  }
];

/* ------------------------------------------------------------ SPECIMENS */
BV.specimens = [
  { id: 'VX-17', label: 'CSF', cls: 'UNKNOWN BIOLOGICAL ENTITY', status: 'CONTAINMENT FAILURE', last: '02:41 UTC', origin: 'Kasai Array', threat: 3,
    morph: 'Sub-micron particles that assemble into lattices on contact with live circuitry.', contain: 'Faraday-shielded BSL-4 freezer. Power isolation mandatory.',
    note: 'Freezer 3 opened itself at 02:41 UTC. Frost undisturbed.', micro: { hue: 0, kind: 'lattice' } },
  { id: 'ORP-3', label: 'CSF', cls: 'HADAL FILAMENT COLONY', status: 'QUARANTINED', last: '02:41 UTC', origin: 'Hadal vent, Pacific', threat: 3,
    morph: 'Bioluminescent filaments up to 4 m. Grow toward acoustic sources.', contain: 'Acoustically dead tank. No hydrophones within 30 m.',
    note: 'Filaments turned toward the observation window when the intercom was switched on.', micro: { hue: 170, kind: 'filament' } },
  { id: 'HX-2', label: 'CSF', cls: 'REGENERATIVE MYCELIAL EXTRACT', status: 'ACTIVE RESEARCH', last: '03:17 UTC', origin: 'Verdant-9, Amazon', threat: 2,
    morph: 'Amber extract; hyphae visible at ×400 form branching helices.', contain: 'BSL-2. Monitoring logs must remain continuous.',
    note: 'Regrowth template does not match donor genome.', micro: { hue: 85, kind: 'hyphae' } },
  { id: 'N-44', label: 'CSF', cls: 'MAGNETOTACTIC CRYSTAL SPORE', status: 'DORMANT', last: '03:17 UTC', origin: 'Black Site 12, Siberia', threat: 2,
    morph: 'Hexagonal spores containing magnetite chains in 3-17-42 banding.', contain: 'Mu-metal shielded vault.',
    note: 'Spores re-orient each night toward the same bearing: south-south-east.', micro: { hue: 45, kind: 'crystal' } },
  { id: 'MR-0', label: 'CSF', cls: 'COGNITIVE CONTAMINANT (SUSPECTED)', status: 'UNCLASSIFIABLE', last: '— —', origin: 'Facility 07, Nevada', threat: 4,
    morph: 'No physical sample. Recorded as recurring drawing produced by MIRROR subjects.', contain: 'Do not reproduce the drawing. [THIS CARD VIOLATES THAT RULE]',
    note: 'Image redacted from all copies of this card.', micro: { hue: 280, kind: 'eye' } },
  { id: 'OM-3412', label: 'CSF', cls: 'ICE CORE INCLUSION', status: 'ACCESS DENIED', last: '1998', origin: 'Station Omega, Antarctica', threat: 4,
    morph: '[REDACTED]', contain: '[REDACTED]', note: '[ACCESS DENIED]', micro: { hue: 200, kind: 'ice' }, denied: true }
];

BV.quarantine = [
  { zone: 'QZ-01 KASAI', radius: '12 km', since: '1986', status: 'SEALED', level: 3 },
  { zone: 'QZ-02 ATOLL 3 LAGOON', radius: '1.4 km', since: '1994', status: 'ACTIVE', level: 3 },
  { zone: 'QZ-03 SENSOR 9 CIRCLE', radius: '4 km', since: '1971', status: 'MONITORED', level: 2 },
  { zone: 'QZ-04 VERDANT ROOT VAULT', radius: '0.2 km', since: '2003', status: 'ACTIVE', level: 2 },
  { zone: 'QZ-05 [REDACTED]', radius: '████', since: '1998', status: 'DENIED', level: 4 }
];

BV.procedures = [
  'Never switch monitoring equipment off without Division sign-off. Specimens accelerate when observation resumes after a gap.',
  'Personnel must not hum, whistle or tap rhythmically within containment.',
  'Report any clock discrepancy of exactly 17 seconds immediately.',
  'If a specimen appears to turn toward you, leave the room facing it.',
  'Do not reproduce subject drawings from PROJECT MIRROR in any medium.'
];

/* --------------------------------------------------------- DOCUMENTED / REAL */
/* Factual summaries of real events. Kept deliberately sober. */
BV.unexplained = [
  { id: 'U-TUNGUSKA', label: 'DOC', title: 'Tunguska Event', date: '30 June 1908', place: 'Podkamennaya Tunguska River, Siberia',
    record: 'A massive explosion flattened an estimated 80 million trees over roughly 2,150 km² of remote forest. Eyewitnesses hundreds of kilometres away reported a fireball and shockwave. The first scientific expedition, led by Leonid Kulik, reached the area in 1927 and found no impact crater.',
    explanation: 'Mainstream view: the airburst of a stony asteroid or comet fragment several kilometres above the ground.',
    open: 'The precise nature and size of the impactor are still debated.' },
  { id: 'U-ROSWELL', label: 'DOC', title: 'Roswell Debris Recovery', date: 'July 1947', place: 'Near Roswell, New Mexico, USA',
    record: 'A rancher found debris on his property. On 8 July 1947 Roswell Army Air Field issued a press release saying it had recovered a "flying disc", then quickly said it was a weather balloon. U.S. Air Force reports in 1994–95 identified the debris as coming from Project Mogul, a classified balloon program designed to detect Soviet nuclear tests.',
    explanation: 'Official explanation: Project Mogul balloon train. A 1997 Air Force report suggested that later "alien body" accounts came from anthropomorphic test dummies used in 1950s high-altitude drops, combined with mistaken memories of the dates.',
    open: 'Claims of a recovered craft or non-human bodies are UNVERIFIED and unsupported by evidence.' },
  { id: 'U-FLIGHT19', label: 'DOC', title: 'Flight 19', date: '5 December 1945', place: 'Off the coast of Florida, USA',
    record: 'Five U.S. Navy TBM Avenger torpedo bombers were lost on a training flight from NAS Fort Lauderdale. A PBM Mariner flying boat sent to search for them was also lost, probably in an explosion.',
    explanation: 'Investigators concluded the flight became disoriented, likely ran out of fuel and ditched in rough seas at night.',
    open: 'The wreckage has never been conclusively found. The "Bermuda Triangle" legend that grew around it is not supported by insurance or Coast Guard data.' },
  { id: 'U-DYATLOV', label: 'DOC', title: 'Dyatlov Pass Incident', date: 'February 1959', place: 'Northern Ural Mountains, USSR',
    record: 'Nine experienced ski hikers led by Igor Dyatlov died on the slopes of Kholat Syakhl. Their tent had been cut open from the inside. Several were found poorly dressed for the cold, and some had severe internal injuries.',
    explanation: 'In 2020 Russian prosecutors attributed the deaths to a slab avalanche. A 2021 study in Communications Earth & Environment showed how a small slab avalanche could explain the injuries.',
    open: 'Some researchers and relatives still dispute the avalanche conclusion. Out of respect for the victims, this archive does not fictionalise this event.' },
  { id: 'U-MKULTRA', label: 'DOC', title: 'Project MKUltra', date: '1953–1973', place: 'United States / Canada',
    record: 'A CIA program that tested drugs such as LSD, along with other methods, on human subjects, often without their knowledge or consent. Most records were destroyed in 1973. About 20,000 surviving documents surfaced through a FOIA request in 1977.',
    explanation: 'Investigated by the Church Committee (1975) and in a 1977 Senate hearing.',
    open: 'Its full scope is unknown because the records were destroyed.' },
  { id: 'U-WOW', label: 'DOC', title: 'The Wow! Signal', date: '15 August 1977', place: 'Big Ear radio telescope, Ohio State University',
    record: 'A strong narrowband radio signal near the 1420 MHz hydrogen line lasted about 72 seconds, the time the telescope beam took to sweep across its source. Astronomer Jerry Ehman circled it on the printout and wrote "Wow!".',
    explanation: 'No confirmed explanation. Many follow-up searches have not detected it again. A 2024 proposal suggests a natural brightening of a hydrogen cloud.',
    open: 'Its origin is still unidentified.' },
  { id: 'U-SVERD', label: 'DOC', title: 'Sverdlovsk Anthrax Leak', date: 'April 1979', place: 'Sverdlovsk (now Yekaterinburg), USSR',
    record: 'Anthrax spores were accidentally released from a Soviet military microbiology facility, killing at least 64 people. Soviet officials blamed contaminated meat.',
    explanation: 'In 1992 Russian president Boris Yeltsin acknowledged the military origin. An epidemiological study published in 1994 traced the cases along the wind plume from the facility.',
    open: 'Some details of the facility’s work are still classified.' },
  { id: 'U-VELA', label: 'DOC', title: 'Vela Incident', date: '22 September 1979', place: 'South Atlantic / Indian Ocean, near Prince Edward Islands',
    record: 'A U.S. Vela satellite recorded a double flash of light, the signature associated with an atmospheric nuclear explosion.',
    explanation: 'A 1980 White House-commissioned panel suggested a possible instrument glitch or meteoroid strike. Many analysts consider an undeclared nuclear test more likely.',
    open: 'The cause has never been officially confirmed.' },
  { id: 'U-HESS', label: 'DOC', title: 'Hessdalen Lights', date: '1981 – present', place: 'Hessdalen valley, Norway',
    record: 'Unexplained lights have been seen in the valley, especially often between 1981 and 1984. Project Hessdalen began in 1983, and an automated measuring station has run since 1998.',
    explanation: 'Proposed explanations include burning airborne dust, a natural "battery" effect in the valley’s rocks, and plasma phenomena. None has been confirmed.',
    open: 'This is a genuine, ongoing scientific study.' },
  { id: 'U-KOLA', label: 'UNV', title: 'Kola Superdeep Borehole & the "Well to Hell"', date: '1970–1994 (hoax c. 1989)', place: 'Kola Peninsula, Russia',
    record: 'DOCUMENTED: a Soviet scientific drilling project reached 12,262 m in 1989, still the deepest artificial point on Earth.',
    explanation: 'UNVERIFIED: a widely shared story that drillers recorded "screams from hell" is a hoax. The audio has been traced to an altered horror-film soundtrack.',
    open: 'This entry shows how a real scientific project becomes the seed of a legend.' },
  { id: 'U-BLOOP', label: 'DOC', title: 'The Bloop', date: '1997', place: 'Remote South Pacific',
    record: 'NOAA hydrophones detected an extremely loud, ultra-low-frequency sound that was picked up by sensors thousands of kilometres apart.',
    explanation: 'NOAA later concluded that it matched the sound of an icequake: large icebergs cracking and breaking away from Antarctic ice.',
    open: 'This case is considered resolved. The legend of a giant animal lingers.' },
  { id: 'U-NIMITZ', label: 'DOC', title: 'USS Nimitz UAP Encounter', date: 'November 2004', place: 'Pacific Ocean, off Southern California / Baja',
    record: 'Navy aviators from the Nimitz carrier strike group reported tracking and seeing a fast-moving object. Infrared footage ("FLIR1") became public in 2017, and the Department of Defense officially released it in April 2020.',
    explanation: 'Officially classified as unidentified aerial phenomena (UAP). No public determination of what the object was.',
    open: 'Its identity is unresolved. This is not evidence of extraterrestrial origin.' },
  { id: 'U-VOSTOK', label: 'DOC', title: 'Lake Vostok', date: 'Reached 2012', place: 'East Antarctica',
    record: 'A subglacial lake buried under roughly 4 km of ice. After decades of drilling, Russian scientists reached its water in February 2012.',
    explanation: 'Researchers are studying whether microbial life exists there. Results have been contested because samples are easily contaminated.',
    open: 'It is one of the most isolated environments on Earth.' },
  { id: 'U-OURANG', label: 'UNV', title: 'SS Ourang Medan', date: 'c. 1947–48 (claimed)', place: 'Strait of Malacca (claimed)',
    record: 'UNVERIFIED: a story about a ship found with its entire crew dead and showing expressions of terror.',
    explanation: 'No registry record of a ship by this name has been found. The early reports are unreliable.',
    open: 'This is probably maritime folklore.' }
];

/* --------------------------------------------------------- ANOMALIES (fiction) */
BV.anomalies = [
  { id: 'A-0031', label: 'CSF', title: 'THE SEVENTEEN-SECOND HOUR', threat: 2, veil: true,
    text: 'Clocks at six separate Black Veil sites lost exactly seventeen seconds overnight on 31 Oct 2024. Atomic references disagree about whether any time was lost.' },
  { id: 'A-0042', label: 'CSF', title: 'ROOM THAT LOOKS BACK', threat: 3, veil: true,
    text: 'PROJECT MIRROR subjects independently describe the same room: bare concrete, one chair, the sense of being the specimen rather than the observer.' },
  { id: 'A-0077', label: 'CSF', title: 'STAIN', threat: 4, veil: true,
    text: 'Satellite imagery from 1997 shows a 40 km dark ellipse over the Mariana Trench that appears in visible, infrared and radar bands simultaneously. Weather was clear.' },
  { id: 'A-0090', label: 'CSF', title: 'INVERTED CHORUS', threat: 2, veil: true,
    text: 'Humpback song recorded near Deep Node includes a phrase that, reversed, matches the ECHO signal envelope.' },
  { id: 'A-0103', label: 'CSF', title: 'AURORAL SCRIPT', threat: 3, veil: true,
    text: 'A 1989 aurora over Black Site 12 (latitude 62° N, off-season) was photographed showing three parallel bands in the ratio 3 : 17 : 42.' },
  { id: 'A-0117', label: 'CSF', title: 'NEGATIVE SPACE', threat: 4, veil: true,
    text: 'Every Black Veil site, when plotted on a sphere and connected by great circles, leaves a single empty point in the South Pacific. Nothing has ever been recorded there. Nothing is ever recorded there.' }
];

/* --------------------------------------------------------- INCIDENTS */
BV.incidents = [
  { id: 'IR-1951-06', date: '1951-06-11', site: 'F07', label: 'CSF', sev: 3, title: 'Orientation failures, sub-level 6', status: 'CLOSED' },
  { id: 'IR-1959-04', date: '1959-04-12', site: 'CAIRN', label: 'CSF', sev: 3, title: 'Survey party of four lost (fictional)', status: 'UNRESOLVED' },
  { id: 'IR-1966-07', date: '1966-07-30', site: 'OMEGA', label: 'CSF', sev: 4, title: '[REDACTED] — borehole', status: 'DENIED' },
  { id: 'IR-1971-03', date: '1971-03-03', site: 'BS12', label: 'CSF', sev: 3, title: 'Sensor 9 equipment rearranged into spiral', status: 'UNRESOLVED' },
  { id: 'IR-1974-11', date: '1974-11-22', site: 'F07', label: 'CSF', sev: 3, title: 'MIRROR trial 22 halted', status: 'CLOSED' },
  { id: 'R-1979-04', date: '1979-04-02', site: 'R-SVERD', label: 'DOC', sev: 3, title: 'Sverdlovsk anthrax release (real event)', status: 'HISTORICAL' },
  { id: 'IR-1986-03', date: '1986-03-19', site: 'KASAI', label: 'CSF', sev: 3, title: 'Containment failure; VX-17 missing', status: 'OPEN' },
  { id: 'IR-1994-02', date: '1994-02-08', site: 'ORPHEUS', label: 'CSF', sev: 3, title: 'ORP-3 tank breach; lagoon quarantine', status: 'OPEN' },
  { id: 'IR-1997-08', date: '1997-08-11', site: 'HADAL', label: 'CSF', sev: 4, title: 'Satellite anomaly STAIN', status: 'DENIED' },
  { id: 'IR-1998-12', date: '1998-12-24', site: 'OMEGA', label: 'CSF', sev: 4, title: 'Final transmission', status: 'DENIED' },
  { id: 'IR-2012-06', date: '2012-06-03', site: 'DEEPNODE', label: 'CSF', sev: 2, title: 'Calibration ping answered', status: 'OPEN' },
  { id: 'IR-2019-07', date: '2019-07-14', site: 'BS12', label: 'CSF', sev: 3, title: '42-minute array silence', status: 'UNRESOLVED' },
  { id: 'IR-2024-10', date: '2024-10-31', site: 'NULL', label: 'CSF', sev: 5, title: 'Global pattern advisory — all sites synchronised', status: 'ACTIVE' }
];

/* --------------------------------------------------------- TIMELINE */
BV.timeline = [
  { y: 1908, t: 'TUNGUSKA AIRBURST', label: 'DOC', ref: 'U-TUNGUSKA', d: 'Forest flattened across ~2,150 km². No crater.' },
  { y: 1945, t: 'FLIGHT 19 LOST', label: 'DOC', ref: 'U-FLIGHT19', d: 'Five Navy bombers lost off Florida.' },
  { y: 1947, t: 'UNKNOWN OBJECT RECOVERED', label: 'CSF', ref: 'F07', d: 'Material recovered in the Nevada desert. Catalogued. Sealed.', tag: 'CLASSIFIED' },
  { y: 1947, t: 'ROSWELL PRESS RELEASE', label: 'DOC', ref: 'U-ROSWELL', d: '"Flying disc" announced, then retracted.' },
  { y: 1953, t: 'MKULTRA BEGINS', label: 'DOC', ref: 'U-MKULTRA', d: 'CIA human-subject program, 1953–73.' },
  { y: 1959, t: 'REMOTE EXPEDITION DISAPPEARS', label: 'CSF', ref: 'CAIRN', d: 'Fictional Cairn survey party vanishes. Stove still warm.', tag: 'UNVERIFIED' },
  { y: 1966, t: 'OMEGA WINTER CREW REPORT', label: 'CSF', ref: 'OMEGA', d: '█████ ██ ███ ████████', tag: 'REDACTED' },
  { y: 1968, t: 'UNIDENTIFIED SIGNAL DETECTED', label: 'CSF', ref: 'ECHO', d: 'Cairn Station receives a signal at 03:17:42 UTC. It repeats nightly.', tag: 'CLASSIFIED' },
  { y: 1977, t: 'WOW! SIGNAL', label: 'DOC', ref: 'U-WOW', d: '72-second narrowband signal near 1420 MHz.' },
  { y: 1979, t: 'SVERDLOVSK & VELA', label: 'DOC', ref: 'U-SVERD', d: 'Anthrax leak; unexplained double flash in the South Atlantic.' },
  { y: 1986, t: 'BIOLOGICAL INCIDENT', label: 'CSF', ref: 'DOC-1986', d: 'Kasai Array containment failure. VX-17 missing.', tag: 'CLASSIFIED' },
  { y: 1989, t: 'KOLA REACHES 12,262 m', label: 'DOC', ref: 'U-KOLA', d: '"Well to Hell" audio later exposed as hoax.' },
  { y: 1991, t: 'DATA CORRUPTED', label: 'CSF', ref: 'ECHO', d: '.-. . -.-. . .. ...- . -..  ?', tag: 'DATA CORRUPTED' },
  { y: 1997, t: 'CLASSIFIED SATELLITE ANOMALY', label: 'CSF', ref: 'DOC-1997', d: 'STAIN over the Mariana Trench.', tag: 'CLASSIFIED' },
  { y: 1997, t: 'THE BLOOP', label: 'DOC', ref: 'U-BLOOP', d: 'NOAA ultra-low-frequency sound; later attributed to an icequake.' },
  { y: 2004, t: 'NIMITZ UAP', label: 'DOC', ref: 'U-NIMITZ', d: 'Navy aviators track unidentified object.' },
  { y: 2012, t: 'DEEP-OCEAN SIGNAL', label: 'CSF', ref: 'DOC-2012', d: 'Deep Node ping answered after seventeen seconds.', tag: 'UNVERIFIED' },
  { y: 2012, t: 'LAKE VOSTOK REACHED', label: 'DOC', ref: 'U-VOSTOK', d: 'Drill reaches subglacial lake.' },
  { y: 2020, t: 'UAP VIDEOS RELEASED', label: 'DOC', ref: 'U-NIMITZ', d: 'DoD officially releases Navy footage.' },
  { y: 2024, t: 'GLOBAL NETWORK DETECTS UNKNOWN PATTERN', label: 'CSF', ref: 'DOC-2024', d: 'All sites synchronise at 03:17:42 UTC.', tag: 'CLASSIFIED' },
  { y: 2026, t: '████████████', label: 'CSF', ref: 'NULL', d: 'NO DATA — OR NO OBSERVER.', tag: 'REDACTED' }
];

/* --------------------------------------------------------- DOCUMENTS
   Inline markup in `body` paragraphs:
     [[R:text]]           redaction bar (text hidden)
     [[UV:text]]          invisible unless UV inspection is on
     [[ENC:KEY:text]]     encrypted until the reader holds KEY (from another file)
     [[HW:text]]          handwritten margin note
     [[SIG]]              signature
*/
BV.documents = [
  { id: 'DOC-1947', label: 'CSF', title: 'RECOVERY MEMORANDUM', file: 'BV/F07/47-0702', date: '02 JUL 1947', cls: 'TOP SECRET', from: 'Field Officer, Recovery Team 2', to: 'Director, [REDACTED]',
    stamp: 'TOP SECRET', photo: 'debris', threat: 3,
    body: [
      'SUBJECT: Recovery of material, grid 7, Nevada range.',
      'At approximately [[R:0300]] hours the team reached the site and recovered [[R:fourteen]] fragments of a lightweight material that could not be cut, burned or bent. Compass needles near the fragments deflected by exactly 17 degrees.',
      'The largest fragment carries a repeating engraved pattern. Our draughtsman counted the intervals: three, seventeen, forty-two. [[UV:THE WATCHES ALL STOPPED AT 03:17:42.]]',
      'Material moved to temporary storage. Press inquiries are to be redirected to the balloon program cover. [[R:No connection to the Roswell matter is to be acknowledged or denied.]]',
      '[[HW:It was warm when we found it. Not from the sun. — R.]]',
      '[[ENC:MIRROR:Addendum 1974 — MIRROR subjects describe the engraving without having seen it.]]',
      '[[SIG]]'
    ] },
  { id: 'DOC-1968', label: 'CSF', title: 'SIGNAL INTERCEPT LOG', file: 'BV/E/68-1104', date: '04 NOV 1968', cls: 'SECRET', from: 'Cairn Station Duty Officer', to: 'Division E',
    stamp: 'SECRET', photo: 'trace', threat: 1,
    body: [
      'Reception of a narrowband carrier, 1420.4 MHz, beginning 03:17:42 UTC, lasting 72 minutes.',
      'Dish elevation was varied through 40 degrees with no change in strength. The source is not in the sky.',
      'Envelope analysis shows three pulses at intervals of 3, 17 and 42 seconds, repeated.',
      '[[ENC:NIGHTFALL:Cross-reference: Black Site 12 magnetometers registered an identical envelope at the same instant, 3,000 km away.]]',
      '[[UV:We pointed the dish at the ground. The signal got stronger.]]',
      '[[HW:Same time as the Nevada watches? Ask Div. M]]',
      '[[SIG]]'
    ] },
  { id: 'DOC-1986', label: 'CSF', title: 'BIOLOGICAL INCIDENT REPORT', file: 'BV/B/86-0319', date: '19 MAR 1986', cls: 'TOP SECRET', from: 'Dr. H. Whitcombe, Kasai Array', to: 'Division B Oversight',
    stamp: 'BIOHAZARD', photo: 'culture', threat: 3,
    body: [
      'At 02:41 local time all freezer alarms activated at once. Freezer 3, holding agent VX-17, was found open. The frost inside was undisturbed. The vials were gone.',
      'All personnel were evacuated under protocol RED. No infections have been recorded. [[R:Two technicians report hearing a tone in the walls.]]',
      'Culture plates left on the bench show colonies arranged in a regular lattice. Spacing ratio: 3 : 17 : 42.',
      '[[ENC:REDLINE:VX-17 does not replicate in tissue. It replicates in circuitry. It is spreading through the monitoring network.]]',
      '[[ENC:HELIX:The lattice in these plates is the same structure that appears in Verdant-9 regrown bone.]]',
      '[[HW:It is not escaping. It is being invited.]]',
      '[[SIG]]'
    ] },
  { id: 'DOC-1997', label: 'CSF', title: 'SATELLITE TELEMETRY ANOMALY', file: 'BV/O/97-0811', date: '11 AUG 1997', cls: 'TOP SECRET // BLACK', from: 'Orbital Analysis Cell', to: '[REDACTED]',
    stamp: 'RESTRICTED', photo: 'satellite', threat: 4,
    body: [
      'Object designated STAIN: a dark ellipse of about 40 km centred on [[R:11.4 N 142.4 E]]. It was visible in optical, infrared and radar bands at the same time.',
      'Duration: [[R:three hours, seventeen minutes, forty-two seconds]].',
      'Three satellites passing over at the time logged a clock drift of +17 seconds.',
      '[[UV:It was not a shadow. Something was looking up at the satellite.]]',
      '[[R:Hadal-4 lander array authorised under PROJECT ZERO.]]',
      '[[SIG]]'
    ] },
  { id: 'DOC-2012', label: 'CSF', title: 'HYDROPHONE TRANSCRIPT', file: 'BV/O/12-0603', date: '03 JUN 2012', cls: 'SECRET', from: 'Deep Node automated system', to: 'Division O',
    stamp: 'SECRET', photo: 'spectrogram', threat: 2,
    body: [
      '03:17:25 UTC — calibration ping sent (3 kHz, 1 s).',
      '03:17:42 UTC — response received. Response = the ping, inverted in time, followed by a sweep through 3, 17 and 42 Hz.',
      'Bearing: unresolved (the response arrived from all directions at once).',
      '[[ENC:ORPHEUS:At the same moment the Atoll 3 lagoon pulsed with light. ORP-3 filaments in tank 4 turned toward the hydrophone line.]]',
      '[[HW:seventeen seconds. it always waits seventeen seconds. like it is thinking.]]',
      '[[SIG]]'
    ] },
  { id: 'DOC-2024', label: 'CSF', title: 'GLOBAL PATTERN ADVISORY', file: 'BV/HQ/24-1031', date: '31 OCT 2024', cls: 'VEIL', from: 'Black Veil Correlation Office', to: 'ALL DIVISIONS',
    stamp: 'EYES ONLY', photo: 'map', threat: 4,
    body: [
      'At 03:17:42 UTC every monitored Black Veil site registered its signature phenomenon at the same instant.',
      'Nevada: vault carrier. Siberia: pulse. Himalaya: signal. Atlantic: answer. Pacific: luminescence. Amazon: conductivity. Central Africa: freezer 3 opened.',
      'Divisions are reminded that these programs are unrelated. [[UV:They are not unrelated.]]',
      '[[R:Correlation Office recommends immediate cessation of all observation.]] Recommendation rejected.',
      '[[ENC:ECHO:The 1991 Morse segment from Cairn is a passphrase. It opens PROJECT ZERO.]]',
      '[[SIG]]'
    ] },
  { id: 'DOC-VEIL', label: 'CSF', title: 'THE BLACK VEIL PROTOCOL', file: 'BV/0/0000', date: 'UNDATED', cls: 'VEIL // NULL', from: 'UNKNOWN', to: 'WHOEVER CONNECTS THEM',
    stamp: 'VEIL', photo: 'eye', threat: 5, locked: 'correlation',
    body: [
      'If you are reading this, you have done what every division refused to do. You put the files side by side.',
      'The organism, the signal, the pulse, the answer, the room that looks back: different names given by different departments to the same thing.',
      'It does not live in any one place. It is where attention gathers. Each instrument we pointed at it became one more way for it to look back.',
      '[[ENC:ZERO:The coordinates in PROJECT ZERO mark the one place we never looked. Look there now and see what is looking back.]]',
      '[[UV:THEY WERE NEVER INVESTIGATING DIFFERENT INCIDENTS.]]',
      '[[HW:stop reading. — L.]]'
    ] }
];

/* --------------------------------------------------------- TERMINAL hidden files */
BV.hidden = {
  '.veil': 'You found the dotfile.\nACCESS LOG shows you as session #00317.\nThe previous 316 sessions ended at the same file.\nType: trace -48.88 -123.39',
  'readme.txt': 'BLACK VEIL ARCHIVE TERMINAL\nThis archive is a work of fiction mixed with labelled historical records.\nCommands: help, ls, ls -a, open <id>, decode <morse>, unlock <phrase>, trace <lat> <lon>, whoami, status, clear'
};
