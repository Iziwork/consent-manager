import { doNotTrack } from '../';
import { expect } from 'vitest';

describe('doNotTrack', () => {
  beforeEach(() => {
    navigator = {} as Navigator
    window = {} as Window & typeof globalThis
  })

  test('doNotTrack() supports standard API', () => {
    navigator = { doNotTrack : '1'}  as Navigator
    expect(doNotTrack()).toBe(true)

    navigator = { doNotTrack : '0'}  as Navigator
    expect(doNotTrack()).toBe(false)

    navigator = { doNotTrack : 'unspecified'}  as Navigator
    expect(doNotTrack()).toBe(null)
  })

  test('doNotTrack() supports window', () => {
    window = { doNotTrack : '1'} as Window & typeof globalThis & Navigator
    expect(doNotTrack()).toBe(true)

    window = { doNotTrack : '0'} as Window & typeof globalThis & Navigator
    expect(doNotTrack()).toBe(false)

    window = { doNotTrack : 'unspecified'} as Window & typeof globalThis & Navigator
    expect(doNotTrack()).toBeNull()
  })

  test('doNotTrack() support yes/no', () => {
    navigator = { doNotTrack : 'yes'}  as Navigator
    expect(doNotTrack()).toBe(true)

    navigator = { doNotTrack : 'no'}  as Navigator
    expect(doNotTrack()).toBe(false)
  })

  test('doNotTrack() supports ms prefix', () => {
    navigator = { msDoNotTrack : '1'} as Navigator & { msDoNotTrack : string };
    expect(doNotTrack()).toBe(true)

    navigator = { msDoNotTrack : '0'} as Navigator & { msDoNotTrack : string };
    expect(doNotTrack()).toBe(false)

    navigator = { msDoNotTrack : 'unspecified'} as Navigator & { msDoNotTrack : string };
    expect(doNotTrack()).toBeNull()
  })
})
