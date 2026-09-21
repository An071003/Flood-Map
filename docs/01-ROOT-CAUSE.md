# Root Cause

The current overlay problem is caused by sparse hand-authored LineStrings.

Example failure:

```text
actual road:
A ─╮
   ╰──╮
      ╰─ B

current geometry:
A ───── B
```

MapLibre does not invent the shortcut. It renders the supplied geometry.

Therefore the fix belongs in road-network data architecture.
