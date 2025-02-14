import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { computedWithControl, controlledComputed } from './index'

describe('computedWithControl', () => {
  it('should export', () => {
    expect(computedWithControl).toBeDefined()
    expect(controlledComputed).toBeDefined()
  })

  it('should work', () => {
    const trigger = ref(0)
    const data = ref('foo')

    const computed = computedWithControl(trigger, () => data.value.toUpperCase())

    expect(computed.value).toBe('FOO')

    data.value = 'bar'

    expect(computed.value).toBe('FOO')

    trigger.value += 1

    expect(computed.value).toBe('BAR')
  })

  it('optional old value', () => {
    const trigger = ref(0)

    const computed = computedWithControl(trigger, (oldValue?: number) =>
      oldValue ? oldValue * 2 : 1)

    expect(computed.value).toBe(1)

    trigger.value += 1

    expect(computed.value).toBe(2)

    trigger.value -= 1

    expect(computed.value).toBe(4)
  })

  it('custom trigger', () => {
    let count = 0
    const computed = computedWithControl(() => {}, () => count)

    expect(computed.value).toBe(0)

    count += 1

    expect(computed.value).toBe(0)

    computed.trigger()

    expect(computed.value).toBe(1)
  })

  it('getter and setter', () => {
    const trigger = ref(0)
    const data = ref('foo')

    const computed = computedWithControl(trigger, {
      get() {
        return data.value.toUpperCase()
      },
      set(v) {
        data.value = v
      },
    })

    expect(computed.value).toBe('FOO')

    data.value = 'bar'

    expect(computed.value).toBe('FOO')

    trigger.value += 1

    expect(computed.value).toBe('BAR')

    computed.value = 'BAZ'

    expect(data.value).toBe('BAZ')
  })
})
