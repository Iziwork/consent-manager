import fetch from 'isomorphic-fetch'
import flatten from 'lodash.flatten'
import sortedUniqBy from 'lodash.sorteduniqby'
import sortBy from 'lodash.sortby'
import { Destination } from '../types'

async function fetchDestinationForWriteKey(writeKey: string): Promise<Destination[]> {
  let destinations: Destination[] = []
  try {
    const res = await fetch(`https://cdn.segment.com/v1/projects/${writeKey}/integrations`)

    if (!res.ok) {
      throw new Error(
        `Failed to fetch integrations for write key ${writeKey}: HTTP ${res.status} ${res.statusText}`
      )
    }

    destinations = (await res.json()) as Destination[]

    // Rename creationName to id to abstract the weird data model
    for (const destination of destinations) {
      destination.id = destination.creationName as string
      delete destination.creationName
    }
  } catch (e) {
    console.warn(`Failed to fetch integrations: ${(e as Error)?.message}`)
  }

  return destinations
}

export default async function fetchDestinations(writeKeys: string[]): Promise<Destination[]> {
  const destinationsRequests: Promise<Destination[]>[] = []
  for (const writeKey of writeKeys) {
    destinationsRequests.push(fetchDestinationForWriteKey(writeKey))
  }

  let destinations = flatten(await Promise.all(destinationsRequests))
  // Remove the dummy Repeater destination
  destinations = destinations.filter((d) => d.id !== 'Repeater')
  destinations = sortBy(destinations, ['id'])
  destinations = sortedUniqBy(destinations, 'id')
  return destinations
}
