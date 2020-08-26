import React, { PureComponent } from 'react'
import styled, { css } from 'react-emotion'
import Dialog from './dialog'
import { DefaultButton, GreenButton } from './buttons'
import { Destination, CustomCategories, CategoryPreferences } from '../types'

const hideOnMobile = css`
  @media (max-width: 600px) {
    display: none;
  }
`

const TableScroll = styled('div')`
  overflow-x: auto;
  margin-top: 16px;
`

const Table = styled('table')`
  border-collapse: collapse;
  font-size: 12px;
`

const ColumnHeading = styled('th')`
  background: #f7f8fa;
  color: #1f4160;
  font-weight: 600;
  text-align: left;
  border-width: 2px;
  word-break: normal;
`

const RowHeading = styled('th')`
  font-weight: normal;
  text-align: left;
`

const Row = styled('tr')`
  th,
  td {
    vertical-align: top;
    padding: 8px 12px;
    border: 1px solid rgba(67, 90, 111, 0.114);
  }
  td {
    border-top: none;
  }
`

const InputCell = styled('td')`
  input {
    vertical-align: middle;
  }
  label {
    display: block;
    margin-bottom: 4px;
    white-space: nowrap;
  }
`

interface PreferenceDialogProps {
  innerRef: (element: HTMLElement | null) => void
  onCancel: () => void
  onSave: () => void
  onChange: (name: string, value: boolean) => void
  marketingDestinations: Destination[]
  advertisingDestinations: Destination[]
  functionalDestinations: Destination[]
  marketingAndAnalytics?: boolean | null
  advertising?: boolean | null
  functional?: boolean | null
  customCategories?: CustomCategories
  destinations: Destination[]
  preferences: CategoryPreferences
  title: React.ReactNode
  content: React.ReactNode
}

export default class PreferenceDialog extends PureComponent<PreferenceDialogProps, {}> {
  static displayName = 'PreferenceDialog'

  static defaultProps = {
    marketingAndAnalytics: null,
    advertising: null,
    functional: null
  }

  render() {
    const {
      innerRef,
      onCancel,
      marketingDestinations,
      advertisingDestinations,
      functionalDestinations,
      marketingAndAnalytics,
      advertising,
      functional,
      customCategories,
      destinations,
      title,
      content,
      preferences
    } = this.props

    let location;
    if (typeof window !== 'undefined') {
      location = window.location.pathname;
    };

    const buttons = (
      <div>
        {typeof window !== 'undefined' &&
          <div>
            <DefaultButton type="button" onClick={onCancel}>
              {location.startsWith('/fr') === 0 ? 'Annuler' : null}
              {location.startsWith('/it') === 0 ? 'Per cancellare' : null}
            </DefaultButton>
            <GreenButton type="submit">
              {location.startsWith('/fr') === 0 ? 'Sauvegarder' : null}
              {location.startsWith('/it') === 0 ? 'Salva' : null}
            </GreenButton>
          </div>}
      </div>
    )
    return (
      <Dialog
        innerRef={innerRef}
        title={title}
        buttons={buttons}
        onCancel={onCancel}
        onSubmit={this.handleSubmit}
      >
        {content}

        {typeof window !== 'undefined' &&
          <TableScroll>
            <Table>
              <thead>
              {location.startsWith('/fr') === 0 ?
                <Row>
                  <ColumnHeading scope="col">Autoriser</ColumnHeading>
                  <ColumnHeading scope="col">Catégorie</ColumnHeading>
                  <ColumnHeading scope="col">But</ColumnHeading>
                  <ColumnHeading scope="col" className={hideOnMobile}>Outils</ColumnHeading>
                </Row>
              : location.startsWith('/it') === 0 ?
                <Row>
                  <ColumnHeading scope="col">Permettere</ColumnHeading>
                  <ColumnHeading scope="col">Categoria</ColumnHeading>
                  <ColumnHeading scope="col">Obbiettivo</ColumnHeading>
                  <ColumnHeading scope="col" className={hideOnMobile}>Utensili</ColumnHeading>
                </Row> : null}
              </thead>

              <tbody>
                {!customCategories && (
                  <>
                    <Row>
                      <InputCell>
                        <label>
                          <input
                            type="radio"
                            name="functional"
                            value="true"
                            checked={functional === true}
                            onChange={this.handleChange}
                            aria-label={'Activer le suivi fonctionnel'}
                            required
                          />{' '}
                          {location.startsWith('/fr') === 0 ? 'Oui' : null}
                          {location.startsWith('/it') === 0 ? 'Si' : null}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="functional"
                            value="false"
                            checked={functional === false}
                            onChange={this.handleChange}
                            aria-label={'Désactiver le suivi fonctionnel'}
                            required
                          />{' '}
                          {location.startsWith('/fr') === 0 ? 'Non' : null}
                          {location.startsWith('/it') === 0 ? 'No' : null}
                        </label>
                      </InputCell>
                      {location.startsWith('/fr') === 0 ? <RowHeading scope="row">Fonctionnel</RowHeading> : null}
                      {location.startsWith('/it') === 0 ? <RowHeading scope="row">Funzionale</RowHeading> : null}
                      {location.startsWith('/fr') === 0 ?
                        <td>
                          <p>
                            Pour surveilleer la performance de notre site et améliorer
                            votre expérience de navigation.
                          </p>
                          <p className={hideOnMobile}>
                            Par exemple, pour communiquer avec vous via un chat.
                          </p>
                        </td>
                        : location.startsWith('/it') === 0 ?
                        <td>
                          <p>Per monitorare le prestazioni del nostro sito e migliorare
                            la tua esperienza di navigazione.</p>
                          <p className={hideOnMobile}>
                            Ad esempio, per comunicare con te tramite una chat.
                          </p>
                        </td> : null}
                      <td className={hideOnMobile}>
                        {functionalDestinations.map(d => d.name).join(', ')}
                      </td>
                    </Row>

                    <Row>
                      <InputCell>
                        <label>
                          <input
                            type="radio"
                            name="marketingAndAnalytics"
                            value="true"
                            checked={marketingAndAnalytics === true}
                            onChange={this.handleChange}
                            aria-label={"Activer le suivi marketing et d'analyse"}
                            required
                          />{' '}
                          {location.startsWith('/fr') === 0 ? 'Oui' : null}
                          {location.startsWith('/it') === 0 ? 'Si' : null}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="marketingAndAnalytics"
                            value="false"
                            checked={marketingAndAnalytics === false}
                            onChange={this.handleChange}
                            aria-label={"Désactiver le suvi marketing et d'analyse"}
                            required
                          />{' '}
                          {location.startsWith('/fr') === 0 ? 'Non' : null}
                          {location.startsWith('/it') === 0 ? 'No' : null}
                        </label>
                      </InputCell>
                      {location.startsWith('/fr') === 0 ? <RowHeading scope="row">Marketing et analyse</RowHeading> : null}
                      {location.startsWith('/it') === 0 ? <RowHeading scope="row">Marketing e analisi</RowHeading> : null}
                      {location.startsWith('/fr') === 0 ?
                        <td>
                          <p>
                            Pour mieux comprendre le comportement de nos utilisateur et fournir
                            une expérience personnalisée.
                          </p>
                          <p className={hideOnMobile}>
                            Par exemple, nous collectons des informations sur les pages
                            que vous visitez pour vous fournir du contenu plus pertinent.
                          </p>
                        </td>
                        : location.startsWith('/it') === 0 ?
                        <td>
                          <p>
                            Per comprendere meglio il comportamento dei nostri utenti e fornire
                            un'esperienza personalizzata.
                          </p>
                          <p className={hideOnMobile}>
                            Ad esempio, raccogliamo informazioni sulle pagine che visiti per fornirti contenuti più pertinenti.
                          </p>
                        </td> : null}
                      <td className={hideOnMobile}>
                        {marketingDestinations.map(d => d.name).join(', ')}
                      </td>
                    </Row>

                    <Row>
                      <InputCell>
                        <label>
                          <input
                            type="radio"
                            name="advertising"
                            value="true"
                            checked={advertising === true}
                            onChange={this.handleChange}
                            aria-label={"Activer le suivi publicitaire"}
                            required
                          />{' '}
                          {location.startsWith('/fr') === 0 ? 'Oui' : null}
                          {location.startsWith('/it') === 0 ? 'Si' : null}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="advertising"
                            value="false"
                            checked={advertising === false}
                            onChange={this.handleChange}
                            aria-label={"Désactiver le suivi publicitaire"}
                            required
                          />{' '}
                          {location.startsWith('/fr') === 0 ? 'Non' : null}
                          {location.startsWith('/it') === 0 ? 'No' : null}
                        </label>
                      </InputCell>
                      {location.startsWith('/fr') === 0 ? <RowHeading scope="row">Publicité</RowHeading> : null}
                      {location.startsWith('/it') === 0 ? <RowHeading scope="row">Pubblicità</RowHeading> : null}
                      {location.startsWith('/fr') === 0 ?
                        <td>
                          <p>
                            Pour personnaliser et mesurer l'efficacité de la publicité sur notre site
                            et des sites tiers.
                          </p>
                          <p className={hideOnMobile}>
                            Par exemple, nous pouvons afficher une publicité basée sur les pages
                            que vous avez visitées sur notre site.
                          </p>
                        </td>
                      : location.startsWith('/it') === 0 ?
                        <td>
                          <p>
                            Per personalizzare e misurare l'efficacia della pubblicità sul nostro sito
                            e siti di terze parti.
                          </p>
                          <p className={hideOnMobile}>
                            Ad esempio, potremmo visualizzare un annuncio pubblicitario basato sulle pagine che hai visitato sul nostro sito.
                          </p>
                        </td> : null}
                      <td className={hideOnMobile}>
                        {advertisingDestinations.map(d => d.name).join(', ')}
                      </td>
                    </Row>
                  </>
                )}

                {customCategories &&
                  Object.entries(customCategories).map(
                    ([categoryName, { integrations, purpose }]) => (
                      <Row key={categoryName}>
                        <InputCell>
                          <label>
                            <input
                              type="radio"
                              name={categoryName}
                              value="true"
                              checked={preferences[categoryName] === true}
                              onChange={this.handleChange}
                              aria-label={`Autoriser le suivi "${categoryName}"`}
                              required
                            />{' '}
                            {location.startsWith('/fr') === 0 ? 'Oui' : null}
                            {location.startsWith('/it') === 0 ? 'Si' : null}
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={categoryName}
                              value="false"
                              checked={preferences[categoryName] === false}
                              onChange={this.handleChange}
                              aria-label={`Désactiver le suivi "${categoryName}"`}
                              required
                            />{' '}
                            {location.startsWith('/fr') === 0 ? 'Non' : null}
                            {location.startsWith('/it') === 0 ? 'No' : null}
                          </label>
                        </InputCell>
                        <RowHeading scope="row">{categoryName}</RowHeading>
                        <td>
                          <p>{purpose}</p>
                        </td>
                        <td className={hideOnMobile}>
                          {destinations
                            .filter(d => integrations.includes(d.id))
                            .map(d => d.name)
                            .join(', ')}
                        </td>
                      </Row>
                    )
                  )}

                <Row>
                  <td>N/A</td>
                  {location.startsWith('/fr') === 0 ? <RowHeading scope="row">Essentiel</RowHeading> : null}
                  {location.startsWith('/it') === 0 ? <RowHeading scope="row">Essenziale</RowHeading> : null}
                  {location.startsWith('/fr') === 0 ?
                    <td>
                      <p>Nous utilisons des cookies essentiels pour le fonctionnement de notre site.</p>
                      <p>
                        Par exemple, nous sauvegardons vos préférences de collecte de données
                        personnelles afin de les respecter pour vos visites futures.
                        Vous pouvez désactiver les cookies dans les préférences de votre navigateur
                        mais le site pourrait ne pas fonctionner correctement.
                      </p>
                    </td>
                    : location.startsWith('/it') === 0 ?
                    <td>
                      <p>Utilizziamo cookie essenziali per il funzionamento del nostro sito.</p>
                      <p>
                        Ad esempio, salviamo le tue preferenze di raccolta dati
                        dati personali al fine di rispettarli per le vostre future visite.
                        Puoi disabilitare i cookie nelle preferenze del tuo browser
                        ma il sito potrebbe non funzionare correttamente.
                      </p>
                    </td> : null}
                  <td className={hideOnMobile} />
                </Row>
              </tbody>
            </Table>
          </TableScroll>}
      </Dialog>
    )
  }

  handleChange = e => {
    const { onChange } = this.props
    onChange(e.target.name, e.target.value === 'true')
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      onSave,
      preferences,
      marketingAndAnalytics,
      advertising,
      functional,
      customCategories
    } = this.props
    e.preventDefault()
    // Safe guard against browsers that don't prevent the
    // submission of invalid forms (Safari < 10.1)
    if (
      !customCategories &&
      (marketingAndAnalytics === null || advertising === null || functional === null)
    ) {
      return
    }

    // Safe guard against custom categories being null
    if (
      customCategories &&
      Object.keys(customCategories).some(category => preferences[category] === null)
    ) {
      return
    }
    onSave()
  }
}
