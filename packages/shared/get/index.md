---
category: Utilities
---

# get

Shorthand for accessing `ref.value`

## Usage

```ts twoslash
import { get } from '@vueuse/core'
import { ref } from 'vue'

const a = ref(42)

console.log(get(a)) // 42
```
