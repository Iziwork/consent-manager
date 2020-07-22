import styled, { css } from 'react-emotion'

const baseStyles = css`
  height: 48px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  color: #031b4a;
  font: Montserrat, inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  outline: none;
  transition: all 0.5s ease-in-out;
`

export const DefaultButton = styled('button')`
  ${baseStyles};
  margin-right: 16px;
  background-color: #f7f9fa;
  &:hover {
    background-color: #f2f4f6;
  }
  &:focus {
    background-color: #f2f4f6;
  }
  &:active {
    background-color: #f2f4f6;
  }
`

export const GreenButton = styled('button')`
  ${baseStyles};
  background-color: #4fb767;
  color: #fff;
  &:hover {
    background-color: #068c5a;
  }
  &:focus {
    background-color: #068c5a;
  }
  &:active {
    background-color: #068c5a;
  }
`

export const RedButton = styled('button')`
  ${baseStyles};
  background-color: #f36331;
  background-image: linear-gradient(to top, #f4541d, #f36331);
  box-shadow: inset 0 0 0 1px rgba(67, 90, 111, 0.204), inset 0 -1px 1px 0 rgba(67, 90, 111, 0.204);
  color: #fff;
  &:hover {
    background-image: linear-gradient(to top, #f4450a, #f4541d);
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(243, 99, 49, 0.477), inset 0 0 0 1px rgba(243, 99, 49, 0.204),
      inset 0 -1px 1px 0 rgba(243, 99, 49, 0.204);
  }
  &:active {
    background-image: linear-gradient(to top, #dd3c06, #c63403);
    box-shadow: inset 0 0 0 1px rgba(67, 90, 111, 0.204),
      inset 0 -1px 1px 0 rgba(67, 90, 111, 0.204);
  }
`
