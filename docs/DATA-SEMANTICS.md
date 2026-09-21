# Data Semantics & Modeling Guidelines — Flood Map HCMC

## 1. Data Provenance Classes
Data points are partitioned into 5 strictly separate provenance classes:
1. **Observed (`observed`)**: Physical gauge, automated water level sensor, or verified field report. Must cite timestamp and source station.
2. **Forecast (`forecast`)**: Time-stepped numerical model output driven by rainfall and tidal predictions.
3. **Estimated (`estimated`)**: Statistical interpolation derived from elevation, road slope, and drainage capacity.
4. **Static (`static`)**: Base geographical properties (road class, length, lane count, historical flood score).
5. **Mock (`mock`)**: Fixture data reserved strictly for offline testing and QA scenarios (e.g. `qaUnknownFixture`).

> [!CAUTION]
> **Strict Rule**: Never present estimated or simulated model values as physical sensor measurements. Never claim "an toàn tuyệt đối" (absolute safety).

## 2. UNKNOWN Data Semantics
When hydrological data is absent, incomplete, or unverified:
- **`UNKNOWN` is NOT 0 cm**: Lack of data does not equal dry pavement.
- **Coverage Impact**: Each unmeasured meter reduces the candidate route's `coveragePercent`.
- **Routing Engine Penalty**: Unknown segments incur a risk penalty based on vehicle profile (`unknownPenalty: 1.5x - 2.5x`).
- **Visual Encoding**: UNKNOWN road segments are rendered exclusively with neutral dashed lines (`#94a3b8`, dasharray `[2, 2]`), never with green or safe colors.

## 3. Confidence & Completeness Bands
- **`high`**: Verified drainage model, current tide reading, and precipitation radar within past 15 minutes.
- **`medium`**: Regional weather forecast without localized street rain gauges.
- **`low`**: Static interpolation or historical flood propensity.

## 4. Search Precision Terminology
- **`exact`**: Verified geocoded point matching specific building coordinates.
- **`approximate`**: Address or alley entrance interpolated from street centerlines.
- **`street-level`**: Roadway centerline anchor point.
- **`poi`**: Named landmark or intersection hub.
