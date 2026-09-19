# Search Architecture

query → normalize → local known-road/place index + geocoder → normalize provider result → SearchPlace[] → rank by exactness, HCMC relevance, supported-road proximity.

UI không dùng provider-specific fields trực tiếp.
