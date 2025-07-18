---
category: State
related: createGlobalState
---

# createSharedComposable

Make a composable function usable with multiple Vue instances.

## Usage

```ts twoslash
import { createSharedComposable, useMouse } from '@vueuse/core'

const useSharedMouse = createSharedComposable(useMouse)

// CompA.vue
const { x: xA, y: yA } = useSharedMouse()

// CompB.vue - will reuse the previous state and no new event listeners will be registered
const { x: xB, y: yB } = useSharedMouse()
```
