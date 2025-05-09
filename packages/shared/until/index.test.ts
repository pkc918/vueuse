import type { Equal, Expect } from '@type-challenges/utils'
import type { Ref, ShallowRef } from 'vue'
import { invoke } from '@vueuse/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref as deepRef, shallowRef } from 'vue'
import { until } from './index'

describe('until', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it('should toBe', () => {
    return new Promise<void>((resolve, reject) => {
      const r1 = shallowRef(0)
      const r2 = shallowRef(0)

      invoke(async () => {
        expect(r1.value).toBe(0)
        expect(r2.value).toBe(0)
        let x = await until(r1).toBe(1)
        expect(x).toBe(1)
        x = await until(r2).toBe(shallowRef(2))
        expect(x).toBe(2)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r1.value = 1
        r2.value = 1
      }, 100)

      setTimeout(() => {
        r2.value = 2
      }, 200)
      vi.advanceTimersByTime(200)
    })
  })

  it('should toBeTruthy', async () => {
    const r = shallowRef(false)
    setTimeout(() => {
      r.value = true
    }, 100)
    vi.advanceTimersByTime(100)

    expect(await until(r).toBeTruthy()).toBeTruthy()
  })

  it('should toBeUndefined', async () => {
    const r = shallowRef<boolean | undefined>(false)
    setTimeout(() => {
      r.value = undefined
    }, 100)
    vi.advanceTimersByTime(100)

    expect(await until(r).toBeUndefined()).toBeUndefined()
  })

  it('should toBeNaN', async () => {
    const r = shallowRef(0)
    setTimeout(() => {
      r.value = Number.NaN
    }, 100)
    vi.advanceTimersByTime(100)

    expect(await until(r).toBeNaN()).toBeNaN()
  })

  it('should toBe timeout with ref', async () => {
    vi.useRealTimers()
    const r = shallowRef(0)
    const reject = vi.fn()
    await invoke(async () => {
      await until(r).toBe(shallowRef(1), { timeout: 200, throwOnTimeout: true })
    }).catch(reject)

    expect(reject).toHaveBeenCalledWith('Timeout')
  })

  it('should work for changedTimes', async () => {
    await new Promise<void>((resolve, reject) => {
      const r = shallowRef(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).changed()
        expect(x).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
      vi.advanceTimersByTime(100)
    })
    await new Promise<void>((resolve, reject) => {
      const r = shallowRef(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).changedTimes(3)
        expect(x).toBe(3)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
        r.value = 2
        r.value = 3
      }, 100)
      vi.advanceTimersByTime(100)
    })
  })

  it('should support `not`', () => {
    return new Promise<void>((resolve, reject) => {
      const r = shallowRef(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).not.toBe(0)
        expect(x).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
      vi.advanceTimersByTime(100)
    })
  })

  it('should support `not` as separate instances', () => {
    return new Promise<void>((resolve, reject) => {
      const r = shallowRef(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const instance = until(r)
        const x = await instance.not.toBe(0)
        const y = await instance.not.toBe(2)
        expect(x).toBe(1)
        expect(y).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
      vi.advanceTimersByTime(100)
    })
  })

  it('should support toBeNull()', () => {
    return new Promise<void>((resolve, reject) => {
      const r = shallowRef<number | null>(null)

      invoke(async () => {
        expect(r.value).toBe(null)
        const x = await until(r).not.toBeNull()
        expect(x).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
      vi.advanceTimersByTime(100)
    })
  })

  it('should support array', () => {
    return new Promise<void>((resolve, reject) => {
      const r = deepRef<number[]>([1, 2, 3])

      invoke(async () => {
        expect(r.value).toEqual([1, 2, 3])
        const x = await until(r).toContains(4, { deep: true })
        expect(x).toEqual([1, 2, 3, 4])
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value.push(4)
      }, 100)
      vi.advanceTimersByTime(100)
    })
  })

  it('should support array with not', () => {
    return new Promise<void>((resolve, reject) => {
      const r = deepRef<number[]>([1, 2, 3])

      invoke(async () => {
        expect(r.value).toEqual([1, 2, 3])
        const x = await until(r).not.toContains(2, { deep: true })
        expect(x).toEqual([1])
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value.pop()
        r.value.pop()
      }, 100)
      vi.advanceTimersByTime(100)
    })
  })

  it('should immediately timeout', () => {
    vi.useRealTimers()
    return new Promise<void>((resolve, reject) => {
      const r = shallowRef(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        await until(r).toBe(1, { timeout: 0 })
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })

  it('should type check', () => {
    /* eslint-disable ts/no-unused-expressions */
    async () => {
      const x = deepRef<'x'>()
      // type checks are done this way to prevent unused variable warnings
      // and duplicate name warnings
      'test' as any as Expect<Equal<typeof x, Ref<'x' | undefined>>>

      const one = await until(x).toBe(1 as const)
      'test' as any as Expect<Equal<typeof one, 1>>

      const xTruthy = await until(x).toBeTruthy()
      'test' as any as Expect<Equal<typeof xTruthy, 'x'>>

      const xFalsy = await until(x).not.toBeTruthy()
      'test' as any as Expect<Equal<typeof xFalsy, undefined>>

      const xUndef = await until(x).toBeUndefined()
      'test' as any as Expect<Equal<typeof xUndef, undefined>>

      const xNotUndef = await until(x).not.toBeUndefined()
      'test' as any as Expect<Equal<typeof xNotUndef, 'x'>>

      const y = shallowRef<'y' | null>(null)
      'test' as any as Expect<Equal<typeof y, ShallowRef<'y' | null>>>

      const yNull = await until(y).toBeNull()
      'test' as any as Expect<Equal<typeof yNull, null>>

      const yNotNull = await until(y).not.toBeNull()
      'test' as any as Expect<Equal<typeof yNotNull, 'y'>>

      const z = shallowRef<1 | 2 | 3>(1)
      'test' as any as Expect<Equal<typeof z, ShallowRef<1 | 2 | 3>>>

      const is1 = (x: number): x is 1 => x === 1

      const z1 = await until(z).toMatch(is1)
      'test' as any as Expect<Equal<typeof z1, 1>>

      const zNot1 = await until(z).not.toMatch(is1)
      'test' as any as Expect<Equal<typeof zNot1, 2 | 3>>
    }
    /* eslint-enable ts/no-unused-expressions */
  })
})
