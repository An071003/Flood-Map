# Route Filter Contract
```ts
interface RouteRequest {
 origin: RouteSnapResult
 destination: RouteSnapResult
 vehicle:'motorbike'|'car'
 forecastHour:0|1|3|6|12|24
 strategy:'least_flood'|'balanced'|'fastest'
 preferredFloodThreshold?:number
 dataPreference:'default'|'prefer_high_coverage'|'known_only'
}
```
Các field ảnh hưởng routing phải vào cache/memo key.
