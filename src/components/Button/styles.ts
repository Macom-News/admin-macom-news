import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background-color: var(--orange);

  width: 100%;
  height: 5rem;

  border: 0;
  border-radius: 10px;

  padding: 0 2rem;

  font-size: 1.75rem;
  font-weight: 500;
  color: var(--gray-850);

  margin-top: 2rem;

  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }

  &:disabled {
    background-color: ${shade(0.2, '#ff9000')};
  }
`;
