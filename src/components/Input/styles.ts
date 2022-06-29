import styled, { css } from 'styled-components';

interface IContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<IContainerProps>`
  background-color: var(--gray-900);

  border-radius: 10px;
  border: 2px solid var(--gray-900);

  padding: 1.275rem;
  width: 100%;

  color: var(--gray-700);

  display: flex;
  align-items: center;

  & + div {
    margin-top: 1rem;
  }

  ${({ isErrored }) =>
    isErrored &&
    css`
      border-color: var(--red);
    `}

  ${({ isFocused }) =>
    isFocused &&
    css`
      color: var(--orange);
      border-color: var(--orange);
    `}

  ${({ isFilled }) =>
    isFilled &&
    css`
      color: var(--orange);
    `}

  input {
    flex: 1;

    background: transparent;

    padding: 0.55rem;

    border: 0;

    font-size: 1.6rem;
    color: var(--white);

    &::placeholder {
      color: var(-gray-700);
    }
  }

  svg {
    margin-right: 2rem;
  }
`;
