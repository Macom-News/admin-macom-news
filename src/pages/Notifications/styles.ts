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

export const ContainerInput = styled.div`
  width: 25%;

  background-color: var(--gray-900);

  border-radius: 10px;
  border: 2px solid var(--gray-900);

  margin-top: 2rem;

  padding: 1rem;

  color: var(--gray-700);

  display: flex;
  align-items: center;

  & + div {
    margin-top: 1rem;
  }

  input {
    flex: 1;

    background: transparent;

    padding: 0.05rem;

    border: 0;

    font-size: 1.7rem;
    color: var(--white);

    &::placeholder {
      color: var(-gray-700);
    }
  }

  svg {
    margin-right: 2rem;
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

  div {
    width: 30%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    margin-left: auto;
    margin-bottom: 1.5rem;
  }

  a {
    width: 17rem;
    height: 3.7rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-color: var(--orange);

    margin-left: auto;

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
      padding: 1rem 6rem;

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

    tbody {
      > tr {
        td p {
          width: 15rem;
        }
      }
    }
  }
`;
