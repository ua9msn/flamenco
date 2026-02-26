# Bug Fix: Beat Display Shows Next Beat Instead of Current Beat

## Problem
The beat highlighting and pointer arrow were pointing to the next beat to be played, not the beat currently being played. This was a timing synchronization issue between scheduling (which happens 100ms in advance) and display (which should show what's playing NOW).

## Root Cause
The issue was that `onScheduleNote()` was being called **100ms in advance** (due to `scheduleAheadTime = 0.1` seconds). When beats were scheduled, the UI would immediately update to show that beat, even though it wouldn't play for another 100ms.

**Timeline example:**
- At t=0ms: Scheduler runs, schedules beat 1 for t=0ms, updates UI to show beat 1
- At t=0ms-100ms: Display shows beat 1, but beat 1 hasn't actually started playing yet
- At t=100ms: Beat 1 finally starts playing, but scheduler already scheduled beat 2
- At t=100ms-200ms: Display shows beat 2 even though beat 1 is playing

This caused the display to be 1 beat ahead of reality.

## Solution
Implemented **dual beat tracking**:

1. **`currentBeatRef`**: Tracks which beat is being scheduled (for audio playback)
2. **`displayBeatRef`**: Calculated based on actual elapsed time, showing which beat is ACTUALLY playing
3. **Separate update mechanism**: Use `requestAnimationFrame` to continuously update the display with the actual playing beat

### Changes Made:

**In `useScheduler.ts`:**
- Added `displayBeatRef` to track the beat being played based on elapsed time
- Calculate display beat: `beatNumber = Math.floor((currentTime - startTime) / secondsPerBeat)`
- Return `displayBeatRef` from the hook

**In `App.tsx`:**
- Removed `setCurrentBeat()` from `handleScheduleNote()` (which was 100ms ahead)
- Added new `useEffect` that uses `requestAnimationFrame` to update UI based on `displayBeatRef`
- The UI now reads the actual elapsed time to determine what beat is playing

### Code Flow:
```
Scheduler (100ms ahead):
├─ Schedule beat for audio playback ✓
├─ Update displayBeatRef based on ELAPSED TIME (not scheduled time)
└─ Call onScheduleNote() WITHOUT updating UI

UI Update Loop (continuous):
├─ Read displayBeatRef (actual current beat)
├─ Call setCurrentBeat(displayBeatRef)
└─ UI updates to show what's playing NOW ✓
```

## Result
✅ Beat display now shows the beat being played, not the next one
✅ Pointer arrow points to the correct beat position
✅ Accents play on correct beats (3,6,8,10,12)
✅ All visuals perfectly sync with audio

The timing offset between scheduling and display is now eliminated because the display uses elapsed time rather than the scheduled beat counter.

