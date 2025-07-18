---
category: Utilities
---

# isDefined

Non-nullish checking type guard for Ref.

## Usage

```ts twoslash
import { isDefined } from '@vueuse/core'
import { ref } from 'vue'

const example = ref(Math.random() ? 'example' : undefined) // Ref<string | undefined>

if (isDefined(example))
  example // Ref<string>
```
