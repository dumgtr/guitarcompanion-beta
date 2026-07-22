# Web Audio Concurrency and Lifecycle Review Checklist

This checklist is used to evaluate the correctness of asynchronous Web Audio voice triggering, scheduling, and resource cleanup logic.

## Core Invariants

1. **First Trigger**:
   - The very first user interaction or trigger must successfully create and start a voice. Check that it doesn't fail due to uninitialized structures or locked AudioContext state.
2. **Request Identity / Generation Tokens**:
   - Every asynchronous request must be tagged with a unique request ID or a generation counter to track obsolescence.
3. **Late Callback Invalidation**:
   - Logical cancellation of a voice request must explicitly invalidate any late callbacks (e.g., fetch, decodeAudioData, or setTimeout callbacks).
4. **Fail-Closed on Stale Callbacks**:
   - Stale or cancelled callbacks must fail closed and must not trigger audio node creation or start playback.
5. **Single-Stop Guarantee**:
   - Each `AudioScheduledSourceNode` (source buffer, oscillator) must have `stop()` called at most once to avoid state exceptions.
6. **Double-Cleanup Safety**:
   - Concurrency logic must handle cases where timer-first and onended-first cleanups are safe and won't throw errors when executed in any order.
7. **Identity-Safe Collection Removal**:
   - Removing active voices from trackers or sets must check exact object identity, preventing accidental removal of new voice instances during overlap.
8. **Gain Ramp-To-Zero on Interruption**:
   - If a playing source is interrupted or stopped early, it must ramp its gain node to zero (e.g., via `linearRampToValueAtTime` or `exponentialRampToValueAtTime`) before calling `stop()` to prevent click or pop artifacts.
9. **Explicit Timing Boundaries**:
   - Start times and offset scheduling must be explicitly calculated against `audioCtx.currentTime` instead of relying on implicit delay assumptions.
10. **Channel Isolation**:
    - Releasing or stopping one channel (e.g., `"soundlab"`) must not stop, mute, or affect active voices on other channels (e.g., `"fsl"`).
11. **Idempotent Cleanup**:
    - Calling voice cleanup or channel release multiple times consecutively must be safe and idempotent.
12. **Collection Emptying**:
    - Trailing references in active sets and releasing queues must eventually empty and release memory when playback completes.
13. **Resurrection Guard**:
    - Fallback pathways must not resurrect or replay a request that was logically cancelled.
14. **Transition Coverage**:
    - The review must cover first-note triggers, overlapping same-note triggers, and different-note trigger transitions.
15. **Participating Structures**:
    - Any declared resource trackers (e.g., `releaseQueue`) must participate in the actual code flow rather than existing as dead or unused variables.

---

## Review Instructions
When analyzing code:
1. Cite specific functions, line numbers, and symbols in the existing file.
2. Clearly distinguish verified code (what exists on disk) from proposed design or recommendations.
3. Explicitly list any missing invariants.
4. Never assume a "PASS" verdict solely because a snippet looks plausible.
5. Always state that **deterministic automated tests** remain mandatory for final verification.
