# CivicLens — Offline-First Architecture & Synchronization Engine

## 1. Core Mandate
Civic infrastructure failures frequently occur in areas with poor or intermittent mobile connectivity (underpasses, sector basements, storm-affected corridors). Civic reporting must never fail due to absence of internet.

---

## 2. Client-Side Offline Architecture

```
[Citizen UI]
    |
    v
[Capture Photo + GPS/Manual Coordinate + Category]
    |
    v
[Generate UUIDv4 idempotency_key]
    |
    v
[Write to IndexedDB: `civiclens_offline_reports`] -> State: `LOCAL_ONLY`
    |
    +------------------+------------------+
    | (Online)                            | (Offline)
    v                                     v
[SyncWorker / Axios]             [Stay in IndexedDB Queue]
    |                                     |
    |                               [Listen for 'online' event / Periodic Sync]
    v                                     |
[POST /api/v1/sync/reports] <-------------+
    |
    v
[Backend Idempotent Processor]
    |
    v
[Update IndexedDB: State = `SYNCED`, server_incident_id assigned]
```

### Offline Queue Lifecycle
1. `LOCAL_ONLY`: Stored solely on user's device in IndexedDB. User is informed: *"Saved offline — will sync when connection returns."*
2. `PENDING_SYNC`: Network connection detected or user triggers manual sync; payload queued for network transmission.
3. `SYNCING`: Active HTTP request in progress with timeout guard.
4. `SYNCED`: Server returned 201/200; confirmed stored in database.
5. `SYNC_FAILED`: Network or validation error; retry counter incremented with exponential backoff.

---

## 3. Idempotency & Conflict-Free Submission
- Every report is stamped with a client-generated UUIDv4 `idempotency_key`.
- The backend checks `SELECT * FROM reports WHERE idempotency_key = :key`.
- If the record already exists, the server returns the existing report and status without re-inserting or re-triggering duplicate incident fusion.
- A report is **NEVER** created twice due to retries or unstable network reconnection.

---

## 4. Offline GPS & Maps Handling
1. **Device GPS**: Hardware GPS operates independently of mobile data. Geolocation API coordinates, altitude, and horizontal accuracy are acquired offline.
2. **Manual Selection Fallback**: If GPS permissions are denied or satellite fix fails, the user can pick the Chandigarh sector/intersection manually. Stored with `location_source = "MANUAL_SELECTION"`.
3. **Map Display Fallback**: When map tiles are un-cached, the app displays an offline coordinate card with landmark reference rather than a broken map container.
