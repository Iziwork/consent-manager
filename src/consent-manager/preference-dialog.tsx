import React, { FC, ChangeEvent } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Dialog from './dialog'
import { DefaultButton, GreenButton } from './buttons'
import { Destination, CustomCategories, CategoryPreferences } from '../types'

const GlobalHideOnMobile = createGlobalStyle`
  .hideOnMobile {
    @media (max-width: 600px) {
    display: none;
  }
  }
`

const TableScroll = styled.div`
  overflow-x: auto;
  margin-top: 16px;
`

const Table = styled.table`
  border-collapse: collapse;
  font-size: 12px;
`

const ColumnHeading = styled.th`
  color: #031b4a;
  font-weight: 700;
  text-align: left;
  border-width: 0;
  word-break: normal;
`

const RowHeading = styled.th`
  font-weight: normal;
  text-align: left;
  word-break: normal;
`

const Row = styled.tr`
  th,
  td {
    vertical-align: top;
    padding: 20px 32px;
    border-top: none;
    border-bottom: 1px solid rgba(67, 90, 111, 0.114);
    &:first-child {
      padding: 20px 0;
    }
    &:nth-child(2) {
      padding: 20px 0 20px 32px;
    }
    &:nth-child(3) {
      padding: 20px 0 20px 32px;
    }
    &:last-child {
      padding-right: 0;
    }
  }
  &.last-row {
    td,
    th {
      border-bottom: 0;
    }
  }
`

// Simulate of a checkbox : reverse of radio button styles, display: block one, when the other is display: none
const InputCell = styled.td`
  label {
    position: relative;
    top: 50%;
    display: block;
    margin-bottom: 4px;
    white-space: nowrap;
    background: transparent;
    cursor: pointer;
  }
  label input {
    position: absolute;
    top: 0; left: 0;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  label input.essential ~ .checkmark {
    position: absolute;
    top: 0; left: 0;
    height: 13px; width: 13px;
    border-radius: 2px;
    background-color: #c9d1df;
    border: 1px solid #c9d1df;
    cursor: auto;
    z-index: 2;
  }
  label input.essential ~ .checkmark:after {
    position: absolute;
    left: 4px; top: 1px;
    width: 3px; height: 7px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    content: '';
    display: block;
  }
  label input.true:checked ~ .checkmark {
    background-color: #4fb767;
    border: 1px solid #4fb767;
  }
  label input.true ~ .checkmark {
    position: absolute;
    top: 0; left: 0;
    height: 13px; width: 13px;
    border-radius: 2px;
    background-color: white;
    border: 1px solid #56709c;
    cursor: pointer;
    z-index: 2;
  }
  label input.true ~ .checkmark:after {
    position: absolute;
    left: 4px; top: 1px;
    width: 3px; height: 7px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    content: '';
    display: block;
  }
  label input.true ~ .checkmark:after {display: block}
  label input.false:checked ~ .checkmark {
    background-color: white;
    border-color: #56709c;
  }
  label input.false ~ .checkmark {
    position: absolute;
    top: -4px; left: 0;
    height: 13px; width: 13px;
    border-radius: 2px;
    background-color: #4fb767;
    border: 1px solid #4fb767;
    cursor: pointer;
    z-index: 1;
  }
  label input.false ~ .checkmark:after {
    position: absolute;
    left: 4px; top: 1px;
    width: 3px; height: 7px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    content: '';
    display: block;
  }
  label input.false:checked ~ .checkmark:after {display: block}
  label input.true:checked ~ .checkmark {
    display: none;
  }
  label input.false:checked ~ .checkmark {
    display: none;
  }
`

type Props = {
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

const PreferenceDialog: FC<Props> = ({
  innerRef,
  onCancel,
  onChange,
  onSave,
  marketingDestinations,
  advertisingDestinations,
  functionalDestinations,
  marketingAndAnalytics = false,
  advertising = false,
  functional = false,
  customCategories,
  destinations,
  title,
  content,
  preferences,
  lang,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value === 'true')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const buttons = (
    <div>
      <DefaultButton type="button" onClick={onCancel}>
        {lang === 'it' ? 'Annulla ' : 'Annuler'}
      </DefaultButton>
      <GreenButton type="submit">{lang === 'it' ? 'Salva' : 'Sauvegarder'}</GreenButton>
    </div>
  )

  return (
    <>
    <GlobalHideOnMobile />
    <Dialog
      innerRef={innerRef}
      title={title}
      buttons={buttons}
      onCancel={onCancel}
      onSubmit={handleSubmit}
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
                <ColumnHeading scope="col" className="hideOnMobile">
                  Strumenti
                </ColumnHeading>
              </Row>
            ) : (
              <Row>
                <ColumnHeading scope="col">Autoriser</ColumnHeading>
                <ColumnHeading scope="col">Catégorie</ColumnHeading>
                <ColumnHeading scope="col">But</ColumnHeading>
                <ColumnHeading scope="col" className="hideOnMobile">
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
                        className="true"
                        type="radio"
                        name="functional"
                        value="true"
                        checked={functional === true}
                        onChange={handleChange}
                        aria-label="Activer le suivi fonctionnel"
                        required
                      />
                      <span className="checkmark" />
                    </label>
                    <label>
                      <input
                        className="false"
                        type="radio"
                        name="functional"
                        value="false"
                        checked={functional === false}
                        onChange={handleChange}
                        aria-label="Désactiver le suivi fonctionnel"
                        required
                      />
                      <span className="checkmark" />
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
                      <p className="hideOnMobile">
                        Ad esempio, per comunicare con te tramite una chat.
                      </p>
                    </td>
                  ) : (
                    <td>
                      <p>
                        Pour surveiller la performance de notre site et améliorer votre
                        expérience de navigation.
                      </p>
                      <p className="hideOnMobile">
                        Par exemple, pour communiquer avec vous via un chat.
                      </p>
                    </td>
                  )}
                  <td className="hideOnMobile">
                    {functionalDestinations.map((d) => d.name).join(', ')}
                  </td>
                </Row>

                <Row>
                  <InputCell>
                    <label>
                      <input
                        className="true"
                        type="radio"
                        name="marketingAndAnalytics"
                        value="true"
                        checked={marketingAndAnalytics === true}
                        onChange={handleChange}
                        aria-label={"Activer le suivi marketing et d'analyse"}
                        required
                      />
                      <span className="checkmark" />
                    </label>
                    <label>
                      <input
                        className="false"
                        type="radio"
                        name="marketingAndAnalytics"
                        value="false"
                        checked={marketingAndAnalytics === false}
                        onChange={handleChange}
                        aria-label={"Désactiver le suvi marketing et d'analyse"}
                        required
                      />
                      <span className="checkmark" />
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
                      <p className="hideOnMobile">
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
                      <p className="hideOnMobile">
                        Par exemple, nous collectons des informations sur les pages que vous
                        visitez pour vous fournir du contenu plus pertinent.
                      </p>
                    </td>
                  )}
                  <td className="hideOnMobile">
                    {marketingDestinations.map((d) => d.name).join(', ')}
                  </td>
                </Row>

                <Row>
                  <InputCell>
                    <label>
                      <input
                        className="true"
                        type="radio"
                        name="advertising"
                        value="true"
                        checked={advertising === true}
                        onChange={handleChange}
                        aria-label={'Activer le suivi publicitaire'}
                        required
                      />
                      <span className="checkmark" />
                    </label>
                    <label>
                      <input
                        className="false"
                        type="radio"
                        name="advertising"
                        value="false"
                        checked={advertising === false}
                        onChange={handleChange}
                        aria-label={'Désactiver le suivi publicitaire'}
                        required
                      />
                      <span className="checkmark" />
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
                      <p className="hideOnMobile">
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
                      <p className="hideOnMobile">
                        Par exemple, nous pouvons afficher une publicité basée sur les pages que
                        vous avez visitées sur notre site.
                      </p>
                    </td>
                  )}
                  <td className="hideOnMobile">
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
                          className="true"
                          type="radio"
                          name={categoryName}
                          value="true"
                          checked={preferences[categoryName] === true}
                          onChange={handleChange}
                          aria-label={`Autoriser le suivi "${categoryName}"`}
                          required
                        />
                        <span className="checkmark" />
                      </label>
                      <label>
                        <input
                          className="false"
                          type="radio"
                          name={categoryName}
                          value="false"
                          checked={preferences[categoryName] === false}
                          onChange={handleChange}
                          aria-label={`Désactiver le suivi "${categoryName}"`}
                          required
                        />
                        <span className="checkmark" />
                      </label>
                    </InputCell>
                    <RowHeading scope="row">{categoryName}</RowHeading>
                    <td>
                      <p>{purpose}</p>
                    </td>
                    <td className="hideOnMobile">
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
              <td className="hideOnMobile" />
            </Row>
          </tbody>
        </Table>
      </TableScroll>
    </Dialog>
    </>
  )
}

export default PreferenceDialog;
