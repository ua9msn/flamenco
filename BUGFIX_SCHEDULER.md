# Bug Fix: Metronome Stuck at Beat 1

## Problem
After the refactor, the metronome would play all sounds at beat 1 but would not progress to subsequent beats. The pattern would get stuck and the scheduler would stop advancing.

## Root Cause
The issue was in the `useScheduler` hook's dependency chain:

1. The `scheduler` callback depended on `scheduleNote` and `nextNote`
2. `nextNote` depended on `bpm` and `selectedPattern.beats`
3. `start` depended on `scheduler`

This created a **circular dependency problem** where:
- When `bpm` or `selectedPattern.beats` changed, `nextNote` would be recreated
- This caused `scheduler` to be recreated
- Which caused `start` to be recreated
- The old scheduler callback would be cancelled, but the new one might not properly initialize the `timerIdRef`, causing the loop to break

Additionally, the callback reference was lost between renders, preventing the scheduler from continuing to run.

## Solution
Refactored the scheduler to:

1. **Store the scheduler logic in a ref** (`schedulerCallbackRef`) instead of in a callback dependency chain
2. **Inline the `nextNote` logic** directly into the scheduler callback to avoid extra function calls and dependency issues
3. **Simplify the `start` function** to only depend on `audioContextRef`
4. **Ensure timer is properly managed** by checking if it's active before rescheduling

### Key Changes in `useScheduler.ts`:

```typescript
// OLD (broken):
const nextNote = useCallback(() => { ... }, [bpm, selectedPattern.beats]);
const scheduler = useCallback(() => {
  scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);
  nextNote();
  timerIdRef.current = window.setTimeout(scheduler, lookahead);
}, [audioContextRef, scheduleNote, nextNote]);

// NEW (fixed):
schedulerCallbackRef.current = () => {
  const secondsPerBeat = 60.0 / bpm;

  while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
    onScheduleNote(currentBeatRef.current, nextNoteTimeRef.current);

    // Inline nextNote logic
    nextNoteTimeRef.current += secondsPerBeat;
    currentBeatRef.current = (currentBeatRef.current % selectedPattern.beats) + 1;
  }

  if (timerIdRef.current !== null) {
    timerIdRef.current = window.setTimeout(schedulerCallbackRef.current!, lookahead);
  }
};

const start = useCallback(() => {
  // Only depends on audioContextRef
  timerIdRef.current = 1;
  schedulerCallbackRef.current();
}, [audioContextRef]);
```

## Benefits
- ✅ Scheduler now properly advances through all beats in a pattern
- ✅ BPM and pattern changes work smoothly without breaking the scheduler
- ✅ No more dependency chain issues
- ✅ Timer is properly maintained across renders
- ✅ All sounds play in the correct sequence

## Testing
To verify the fix:
1. Start the metronome with a 12-beat pattern
2. Confirm it cycles through beats 1-12 continuously
3. Change BPM while playing - scheduler should restart smoothly
4. Change pattern while playing - scheduler should adapt immediately
5. All enabled sound types should play at their designated accents

