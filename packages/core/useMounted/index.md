---
category: Component
---

# useMounted

Mounted state in ref.

## Usage

```js
import { useMounted } from '@vueuse/core'

const isMounted = useMounted()
```

Which is essentially a shorthand of:

```ts twoslash
import { onMounted, ref } from 'vue'

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
```
