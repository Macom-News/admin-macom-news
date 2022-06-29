import styled from 'styled-components';

export const Container = styled.div`
  margin: 1rem 0 2rem 0;
`;

export const BoxHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  button {
    background: transparent;

    border: 0;

    color: var(--white);

    margin: 2rem 7rem;

    h1 {
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 2.5rem;

      /* margin-top: 2rem;

      padding: 1rem 7rem; */

      svg {
        margin-right: 1rem;
      }
    }
  }
`;
