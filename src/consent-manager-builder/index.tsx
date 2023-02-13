import React, { FC, useEffect, useState } from 'react'
import { loadPreferences, savePreferences } from './preferences'
import fetchDestinations from './fetch-destinations'
import conditionallyLoadAnalytics from './analytics'
import { Destination, CategoryPreferences, CustomCategories } from '../types'

function getNewDestinations(destinations: Destination[], preferences: CategoryPreferences) {
  const newDestinations: Destination[] = []

  // If there are no preferences then all destinations are new
  if (!preferences) {
    return destinations
  }

  for (const destination of destinations) {
    if (preferences[destination.id] === undefined) {
      newDestinations.push(destination)
    }
  }

  return newDestinations
}

type Props = {
  /** Your Segment Write key for your website */
  writeKey: string

  /** A list of other write keys you may want to provide */
  otherWriteKeys?: string[]

  cookieDomain?: string

  /**
   * An initial selection of Preferences
   */
  initialPreferences?: CategoryPreferences

  /**
   * Provide a function to define whether or not consent should be required
   */
  shouldRequireConsent?: () => Promise<boolean> | boolean

  /**
   * Render props for the Consent Manager builder
   */
  children: (props: RenderProps) => React.ReactElement

  /**
   * Allows for customizing how to show different categories of consent.
   */
  mapCustomPreferences?: (
    destinations: Destination[],
    preferences: CategoryPreferences
  ) => { destinationPreferences: CategoryPreferences; customPreferences: CategoryPreferences }

  /**
   * Allows for adding custom consent categories by mapping a custom category to Segment integrations
   */
  customCategories?: CustomCategories

  /**
   * A callback for dealing with errors in the Consent Manager
   */
  onError?: (err: Error) => void | Promise<void>
}

type RenderProps = {
  destinations: Destination[]
  newDestinations: Destination[]
  preferences: CategoryPreferences
  isConsentRequired: boolean
  customCategories?: CustomCategories
  setPreferences: (newPreferences: CategoryPreferences) => void
  resetPreferences: () => void
  saveConsent: (newPreferences?: CategoryPreferences | boolean, shouldReload?: boolean) => void
};


const ConsentManagerBuilder: FC<Props> = ({
  children,
  cookieDomain,
  customCategories,
  initialPreferences= {},
  mapCustomPreferences,
  onError = undefined,
  otherWriteKeys =[],
  shouldRequireConsent =() => true,
  writeKey
}) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newDestinations, setNewDestinations] = useState<Destination[]>([]);
  const [preferences, setPreferences] = useState<CategoryPreferences>({});
  const [isConsentRequired, setIsConsentRequired] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSetPreferences = (newPreferences: CategoryPreferences) => {
    setPreferences(existingPreferences => mergePreferences({
      destinations,
      newPreferences,
      existingPreferences
    }));
  }

  const handleResetPreferences = () => {
    const { destinationPreferences, customPreferences } = loadPreferences()

    let preferences: CategoryPreferences | undefined
    if (mapCustomPreferences) {
      preferences = customPreferences || initialPreferences
    } else {
      preferences = destinationPreferences || initialPreferences
    }

    setPreferences(preferences);
  }

  const handleSaveConsent = (newPreferences: CategoryPreferences | undefined, shouldReload: boolean) => {
      let preferencesToSet = mergePreferences({
        destinations,
        newPreferences,
        existingPreferences: preferences
      })

      let destinationPreferences: CategoryPreferences
      let customPreferences: CategoryPreferences | undefined

      if (mapCustomPreferences) {
        const custom = mapCustomPreferences(destinations, preferencesToSet)
        destinationPreferences = custom.destinationPreferences
        customPreferences = custom.customPreferences

        if (customPreferences) {
          // Allow the customPreferences to be updated from mapCustomPreferences
          preferencesToSet = customPreferences
        } else {
          // Make returning the customPreferences from mapCustomPreferences optional
          customPreferences = preferencesToSet
        }
      } else {
        destinationPreferences = preferencesToSet
      }

      const newDestinations = getNewDestinations(destinations, destinationPreferences)

      savePreferences({ destinationPreferences, customPreferences, cookieDomain })
      conditionallyLoadAnalytics({
        writeKey,
        destinations,
        destinationPreferences,
        isConsentRequired,
        shouldReload
      })
      setPreferences(preferencesToSet)
      setNewDestinations(newDestinations)
  }

  const initialise = async () => {
    try{
    // TODO: add option to run mapCustomPreferences on load so that the destination preferences automatically get updated
    let { destinationPreferences, customPreferences } = loadPreferences()

    const [isConsentRequired, destinations] = await Promise.all([
      shouldRequireConsent(),
      fetchDestinations([writeKey, ...otherWriteKeys])
    ])

    const newDestinations = getNewDestinations(destinations, destinationPreferences || {})

    let preferences: CategoryPreferences | undefined
    if (mapCustomPreferences) {
      preferences = customPreferences || initialPreferences || {}

      const hasInitialPreferenceToTrue = Object.keys(initialPreferences || {}).map(k => (initialPreferences || {})[k]).some(Boolean)
      const emptyCustomPreferences = Object.keys(customPreferences || {}).map(k => (customPreferences || {})[k]).every(
        v => v === null || v === undefined
      )

      if (hasInitialPreferenceToTrue && emptyCustomPreferences) {
        const mapped = mapCustomPreferences(destinations, preferences)
        destinationPreferences = mapped.destinationPreferences
        customPreferences = mapped.customPreferences
      }
    } else {
      preferences = destinationPreferences || initialPreferences
    }

    conditionallyLoadAnalytics({
      writeKey,
      destinations,
      destinationPreferences,
      isConsentRequired
    })

    setIsLoading(false);
    setDestinations(destinations);
    setNewDestinations(newDestinations);
    setPreferences(preferences);
    setIsConsentRequired(isConsentRequired);
    } catch(e) {
      if (onError && typeof onError === 'function') onError(e)
      else throw e
    }
  }

  useEffect(() => {
      initialise()
  }, []);

  if (isLoading) {
    return null
  }

  return children({
    destinations,
    customCategories,
    newDestinations,
    preferences,
    isConsentRequired,
    setPreferences: handleSetPreferences,
    resetPreferences: handleResetPreferences,
    saveConsent: handleSaveConsent
  })
}

const mergePreferences = ( { destinations, existingPreferences, newPreferences }: {
  destinations: Destination[]
  existingPreferences?: CategoryPreferences
  newPreferences?: CategoryPreferences
}) => {
  let preferences: CategoryPreferences

  if (typeof newPreferences === 'boolean') {
    const destinationPreferences = {}
    for (const destination of destinations) {
      destinationPreferences[destination.id] = newPreferences
    }
    preferences = destinationPreferences
  } else if (newPreferences) {
    preferences = {
      ...existingPreferences,
      ...newPreferences
    }
  } else {
    preferences = existingPreferences!
  }

  return preferences
}

export default ConsentManagerBuilder;
