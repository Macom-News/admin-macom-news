import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 1480px;
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;

  background-color: var(--gray-700);

  margin: auto 2rem;
  margin-top: 2rem;

  padding: 0 2rem;

  div.headerContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const Table = styled.div`
  width: 100%;

  margin-top: 3rem;

  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */

  font-size: 1.725rem;

  a {
    width: 12rem;
    height: 3.3rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    background-color: var(--orange);

    margin-left: auto;
    margin-bottom: 1.5rem;

    border: 0;
    border-radius: 5px;

    padding: 0 2rem;

    font-size: 1.75rem;
    font-weight: 600;
    color: var(--gray-850);

    transition: background-color 0.2s;

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 10px;
    }
  }

  table {
    margin-bottom: 5rem;

    thead {
      background-color: var(--gray-900);
    }

    th {
      padding: 0 6rem;
    }

    td {
      padding: 1rem 4rem;

      text-align: center;

      button {
        background: transparent;

        border: 0;

        & + button {
          margin-left: 25px;
        }

        svg {
          color: var(--white);
        }
      }
    }
  }
`;
