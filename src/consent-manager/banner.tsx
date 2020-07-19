import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import fontStyles from './font-styles'

const Root = styled('div')<{ backgroundColor: string; textColor: string }>`
  ${fontStyles};
  position: relative;
  float: left;
  padding: 8px;
  padding-right: 40px;
  background: white;
  color: #031b4a;
  text-align: left;
  font-size: 12px;
  line-height: 1.3;
`

const Content = styled('div')`
  p {
    float: left;
    width: calc(100% - 60px);
  }
  .link {
    display: inline;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
  .button {
    float: right;
    min-width: 50px;
    padding: 0 14px;
    border: none;
    background: #4fb767;
    color: white;
    border-radius: 8px;
    color: white;
    font: inherit;
    height: 48px;
    line-height: 48px;
    font-weight: 700;
    text-align: center;
    display: inline-block;
    outline: 0;
    user-select: none;
    text-decoration: none;
    transition: all 0.4s ease;
    cursor: pointer;
    &:hover {
      color: white;
      background: #068c5a;
      text-decoration: none;
    }
  }
`

const P = styled('p')`
  margin: 0;
  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

const CloseButton = styled('button')`
  float: right;
  padding: 0 14px;
  border: none;
  background: #4fb767;
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
  color: white;
  font: inherit;
  font-weight: 700;
  text-align: center;
  display: inline-block;
  outline: 0;
  user-select: none;
  text-decoration: none;
  transition: all 0.4s ease;
  cursor: pointer;
  &:hover {
    color: white;
    background: #068c5a;
    text-decoration: none;
  }
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
    const { innerRef, onClose, onChangePreferences, backgroundColor, textColor } = this.props

    return (
      <Root innerRef={innerRef} backgroundColor={backgroundColor} textColor={textColor}>
        <Content>
          <P>
            Notre site internet utilise des cookies 🍪. Certains ne peuvent être refusés pour le bon
            fonctionnement du site. Pour les autres, vous pouvez choisir de les paramétrer{' '}
            <p className="link" onClick={onChangePreferences}>
              en cliquant ici
            </p>
            .
          </P>
          <CloseButton type="button" className="button" onClick={onClose}>
            Ok
          </CloseButton>
        </Content>
      </Root>
    )
  }
}
