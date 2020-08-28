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
  lang: string
}

export default class PreferenceDialog extends PureComponent<PreferenceDialogProps, {}> {
  static displayName = 'PreferenceDialog'

  static defaultProps = {
    marketingAndAnalytics: null,
    advertising: null,
    functional: null,
    lang: 'fr', // default language
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
      preferences,
      lang,
    } = this.props

    const buttons = (
      <div>
        <DefaultButton type="button" onClick={onCancel}>
          {lang === 'it' ? 'Annulla ' : 'Annuler'}
        </DefaultButton>
        <GreenButton type="submit">{lang === 'it' ? 'Salva' : 'Sauvegarder'}</GreenButton>
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

        <TableScroll>
          <Table>
            <thead>
              {lang === 'it' ? (
                <Row>
                  <ColumnHeading scope="col">Autorizza</ColumnHeading>
                  <ColumnHeading scope="col">Categoria</ColumnHeading>
                  <ColumnHeading scope="col">Obiettivo</ColumnHeading>
                  <ColumnHeading scope="col" className={hideOnMobile}>
                    Strumenti
                  </ColumnHeading>
                </Row>
              ) : (
                <Row>
                  <ColumnHeading scope="col">Autoriser</ColumnHeading>
                  <ColumnHeading scope="col">Catégorie</ColumnHeading>
                  <ColumnHeading scope="col">But</ColumnHeading>
                  <ColumnHeading scope="col" className={hideOnMobile}>
                    Outils
                  </ColumnHeading>
                </Row>
              )}
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
                        {lang === 'it' ? 'Si' : 'Oui'}
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
                        {lang === 'it' ? 'No' : 'Non'}
                      </label>
                    </InputCell>
                    {lang === 'it' ? (
                      <RowHeading scope="row">Funzionale</RowHeading>
                    ) : (
                      <RowHeading scope="row">Fonctionnel</RowHeading>
                    )}
                    {lang === 'it' ? (
                      <td>
                        <p>
                          Per monitorare l’andamento del sito e migliorare l’esperienza di
                          navigazione degli utenti. Ad esempio, per comunicare via chat.
                        </p>
                        <p className={hideOnMobile}>
                          Ad esempio, per comunicare con te tramite una chat.
                        </p>
                      </td>
                    ) : (
                      <td>
                        <p>
                          Pour surveilleer la performance de notre site et améliorer votre
                          expérience de navigation.
                        </p>
                        <p className={hideOnMobile}>
                          Par exemple, pour communiquer avec vous via un chat.
                        </p>
                      </td>
                    )}
                    <td className={hideOnMobile}>
                      {functionalDestinations.map((d) => d.name).join(', ')}
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
                        {lang === 'it' ? 'Si' : 'Oui'}
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
                        {lang === 'it' ? 'No' : 'Non'}
                      </label>
                    </InputCell>
                    {lang === 'it' ? (
                      <RowHeading scope="row">Marketing e analisi</RowHeading>
                    ) : (
                      <RowHeading scope="row">Marketing et analyse</RowHeading>
                    )}
                    {lang === 'it' ? (
                      <td>
                        <p>
                          Per comprendere al meglio il comportamento degli utenti e fornire
                          un’esperienza personalizzata.
                        </p>
                        <p className={hideOnMobile}>
                          Ad esempio, raccogliamo le informazioni sulle pagine consultate per
                          fornire un contenuto più adatto alle tue ricerche.
                        </p>
                      </td>
                    ) : (
                      <td>
                        <p>
                          Pour mieux comprendre le comportement de nos utilisateur et fournir une
                          expérience personnalisée.
                        </p>
                        <p className={hideOnMobile}>
                          Par exemple, nous collectons des informations sur les pages que vous
                          visitez pour vous fournir du contenu plus pertinent.
                        </p>
                      </td>
                    )}
                    <td className={hideOnMobile}>
                      {marketingDestinations.map((d) => d.name).join(', ')}
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
                          aria-label={'Activer le suivi publicitaire'}
                          required
                        />{' '}
                        {lang === 'it' ? 'Si' : 'Oui'}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="advertising"
                          value="false"
                          checked={advertising === false}
                          onChange={this.handleChange}
                          aria-label={'Désactiver le suivi publicitaire'}
                          required
                        />{' '}
                        {lang === 'it' ? 'No' : 'Non'}
                      </label>
                    </InputCell>
                    {lang === 'it' ? (
                      <RowHeading scope="row">Essenziale</RowHeading>
                    ) : (
                      <RowHeading scope="row">Publicité</RowHeading>
                    )}
                    {lang === 'it' ? (
                      <td>
                        <p>Questo sito fa uso di cookies essenziali per il suo funzionamento.</p>
                        <p className={hideOnMobile}>
                          Ad esempio, memorizziamo le preferenze di raccolta dati personali per gli
                          accessi futuri. È possibile disattivare i cookies nelle impostazioni del
                          browser, compromettendo però il corretto funzionamento del sito.
                        </p>
                      </td>
                    ) : (
                      <td>
                        <p>
                          Pour personnaliser et mesurer l'efficacité de la publicité sur notre site
                          et des sites tiers.
                        </p>
                        <p className={hideOnMobile}>
                          Par exemple, nous pouvons afficher une publicité basée sur les pages que
                          vous avez visitées sur notre site.
                        </p>
                      </td>
                    )}
                    <td className={hideOnMobile}>
                      {advertisingDestinations.map((d) => d.name).join(', ')}
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
                          {lang === 'it' ? 'Si' : 'Oui'}
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
                          {lang === 'it' ? 'No' : 'Non'}
                        </label>
                      </InputCell>
                      <RowHeading scope="row">{categoryName}</RowHeading>
                      <td>
                        <p>{purpose}</p>
                      </td>
                      <td className={hideOnMobile}>
                        {destinations
                          .filter((d) => integrations.includes(d.id))
                          .map((d) => d.name)
                          .join(', ')}
                      </td>
                    </Row>
                  )
                )}

              <Row>
                <td>N/A</td>
                {lang === 'it' ? (
                  <RowHeading scope="row">Essenziale</RowHeading>
                ) : (
                  <RowHeading scope="row">Essentiel</RowHeading>
                )}
                {lang === 'it' ? (
                  <td>
                    <p>Utilizziamo cookie essenziali per il funzionamento del nostro sito.</p>
                    <p>
                      Ad esempio, salviamo le tue preferenze di raccolta dati dati personali al fine
                      di rispettarli per le vostre future visite. Puoi disabilitare i cookie nelle
                      preferenze del tuo browser ma il sito potrebbe non funzionare correttamente.
                    </p>
                  </td>
                ) : (
                  <td>
                    <p>
                      Nous utilisons des cookies essentiels pour le fonctionnement de notre site.
                    </p>
                    <p>
                      Par exemple, nous sauvegardons vos préférences de collecte de données
                      personnelles afin de les respecter pour vos visites futures. Vous pouvez
                      désactiver les cookies dans les préférences de votre navigateur mais le site
                      pourrait ne pas fonctionner correctement.
                    </p>
                  </td>
                )}
                <td className={hideOnMobile} />
              </Row>
            </tbody>
          </Table>
        </TableScroll>
      </Dialog>
    )
  }

  handleChange = (e) => {
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
      customCategories,
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
      Object.keys(customCategories).some((category) => preferences[category] === null)
    ) {
      return
    }
    onSave()
  }
}
