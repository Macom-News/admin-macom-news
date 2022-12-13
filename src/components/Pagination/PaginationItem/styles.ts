import styled from 'styled-components';

export const Button = styled.button`
  width: 3.5rem;
  height: 3.5rem;

  margin: 0 0.4rem;

  outline: 0px;
  background-color: var(--gray-800);

  color: var(--white);
  font-size: 1.725rem;

  border: none;
  border-radius: 5px;

  &:disabled {
    background-color: var(--orange);
    cursor: default;

    &:hover {
      background-color: var(--orange);
    }
  }

  &:hover {
    background-color: var(--gray-900);
  }
`;
