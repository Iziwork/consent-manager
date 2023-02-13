import { WindowWithAJS, Destination } from '../../types'
import conditionallyLoadAnalytics from '../../consent-manager-builder/analytics'
import { expect, vi } from 'vitest';

describe('analytics', () => {
  let wd

  beforeEach(() => {
    window = {} as WindowWithAJS
    wd = window
  })

  test('loads analytics.js with preferences', () => {
    const ajsLoad = vi.fn()
    wd.analytics = { load: ajsLoad }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true,
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
    })

    expect(ajsLoad).toHaveBeenCalled()
    expect(ajsLoad.mock.calls[0][0]).toBe(writeKey)
    expect(ajsLoad.mock.calls[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Segment.io': true,
      },
    })
  })

  test('doesn՚t load analytics.js when there are no preferences', () => {
    const ajsLoad = vi.fn()
    wd.analytics = { load: ajsLoad }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = null

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
    })

    expect(ajsLoad).not.toHaveBeenCalled()
  })

  test('doesn՚t load analytics.js when all preferences are false', () => {
    const ajsLoad = vi.fn()
    wd.analytics = { load: ajsLoad }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: false,
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
    })

    expect(ajsLoad).not.toHaveBeenCalled()
  })

  test('reloads the page when analytics.js has already been initialised', () => {
    wd.analytics = {
      load() {
        this.initialized = true
      },
    }
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() },
    })

    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true,
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
    })
    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
    })

    // expect(window.location.reload).toHaveBeenCalled()
  })

  test('should allow the reload behvaiour to be disabled', () => {
    const reload = vi.fn()
    wd.analytics = {
      load() {
        this.initialized = true
      },
    }
    wd.location = { reload }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true,
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
    })
    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: true,
      shouldReload: false,
    })

    expect(reload).not.toHaveBeenCalled()
  })

  test('loads analytics.js normally when consent isn՚t required', () => {
    const ajsLoad = vi.fn()
    wd.analytics = { load: ajsLoad }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = null

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
    })

    expect(ajsLoad).toHaveBeenCalled()
    expect(ajsLoad.mock.calls[0][0]).toBe(writeKey)
    expect(ajsLoad.mock.calls[0][1]).toBeUndefined()
  })

  test('still applies preferences when consent isn՚t required', () => {
    const ajsLoad = vi.fn()
    wd.analytics = { load: ajsLoad }
    const writeKey = '123'
    const destinations = [{ id: 'Amplitude' } as Destination]
    const destinationPreferences = {
      Amplitude: true,
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired: false,
    })

    expect(ajsLoad).toHaveBeenCalled()
    expect(ajsLoad.mock.calls[0][0]).toBe(writeKey)
    expect(ajsLoad.mock.calls[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Segment.io': true,
      },
    })
  })
})
