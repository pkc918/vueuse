---
category: Reactivity
---

# reactifyObject

Apply `reactify` to an object

## Usage

```ts twoslash
import { reactifyObject } from '@vueuse/core'
import { ref } from 'vue'

const reactifiedConsole = reactifyObject(console)

const a = ref('42')

reactifiedConsole.log(a) // no longer need `.value`
```
