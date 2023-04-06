import { URL } from 'node:url'
import { WindowWithAJS } from '../../types'
import { loadPreferences, savePreferences } from '../../consent-manager-builder/preferences'
import { expect, vi } from 'vitest';

describe('preferences', () => {
  beforeEach(() => {
    window = {
      location: {
        href: 'http://localhost/'
      }
    } as WindowWithAJS & typeof globalThis

    document = {
      createElement(type: string) {
        if (type === 'a') {
          return new URL('http://localhost/')
        }

        return
      }
    } as Document
  })

  test('loadPreferences() returns preferences when cookie exists', () => {
    document.cookie =
      'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}%2C%22custom%22:{%22functional%22:true}}'

    expect(loadPreferences()).toMatchObject({
      destinationPreferences: {
        Amplitude: true
      },
      customPreferences: {
        functional: true
      }
    })
  })

  test('savePreferences() saves the preferences', () => {
    const ajsIdentify = vi.fn();

    window.analytics = { identify: ajsIdentify } as unknown as WindowWithAJS['analytics']
    document.cookie = ''

    const destinationPreferences = {
      Amplitude: true
    }
    const customPreferences = {
      functional: true
    }

    savePreferences({
      destinationPreferences,
      customPreferences,
      cookieDomain: undefined
    })

    expect(ajsIdentify).toHaveBeenCalled()
    expect(ajsIdentify.mock.calls[0][0]).toMatchObject({
      destinationTrackingPreferences: destinationPreferences,
      customTrackingPreferences: customPreferences
    })

    expect(
      document.cookie.includes(
        'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}%2C%22custom%22:{%22functional%22:true}}'
      )
    ).toBe(true)
  })

  test('savePreferences() sets the cookie domain', () => {
    const ajsIdentify = vi.fn();
    window.analytics = { identify: ajsIdentify } as unknown as WindowWithAJS['analytics']
    document.cookie = ''

    const destinationPreferences = {
      Amplitude: true
    }

    savePreferences({
      destinationPreferences,
      customPreferences: undefined,
      cookieDomain: 'example.com'
    })

    expect(ajsIdentify).toHaveBeenCalled()
    expect(ajsIdentify.mock.calls[0][0]).toMatchObject({
      destinationTrackingPreferences: destinationPreferences,
      customTrackingPreferences: undefined
    })

    // TODO: actually check domain
    // expect(document.cookie.includes('domain=example.com')).toBe(true)
  })
})
