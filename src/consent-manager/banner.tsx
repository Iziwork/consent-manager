import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import fontStyles from './font-styles'

const Root = styled('div')<{ backgroundColor: string; textColor: string }>`
  ${fontStyles};
  position: relative;
  padding: 8px;
  padding-right: 40px;
  background: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  text-align: center;
  font-size: 12px;
  line-height: 1.3;
`

const Content = styled('div')`
  a,
  button {
    display: inline;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
`

const P = styled('p')`
  margin: 0;
  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

const CloseButton = styled('button')`
  padding: 8px;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
`

interface Props {
  innerRef: (node: HTMLElement | null) => void
  onClose: () => void
  onChangePreferences: () => void
  content: React.ReactNode
  subContent: React.ReactNode
  backgroundColor: string
  textColor: string
}

export default class Banner extends PureComponent<Props> {
  static displayName = 'Banner'

  render() {
    const {
      innerRef,
      onClose,
      onChangePreferences,
      backgroundColor,
      textColor
    } = this.props

    return (
      <Root innerRef={innerRef} backgroundColor={backgroundColor} textColor={textColor}>
        <Content>
          <P>Notre site internet utilise des cookies. Certains de ces cookies sont nécessaires au bon fonctionnement du
            site et ne peuvent être refusés lorsque vous visitez ce site. Pour les autres, vous pouvez choisir de les
            paramétrer en <button type="button" onClick={onChangePreferences}>cliquant ici</button>.
          </P>
          <P>
            [<a href="https://s3.eu-central-1.amazonaws.com/iziwork/legals/mentions_legales.pdf" target="_blank" rel="noopener noreferrer">
              Plus d’informations
            </a>] | [<CloseButton type="button" onClick={onClose}>
              Accepter
            </CloseButton>]
          </P>
        </Content>
      </Root>
    )
  }
}
