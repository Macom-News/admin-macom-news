import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;

  background-color: var(--gray-700);

  margin: auto 2rem;
  margin-top: 2rem;

  padding: 0 2rem;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    width: 340px;

    margin: 30px 0;
  }
`;

export const HeaderForm = styled.div`
  margin-bottom: 2rem;

  button {
    width: 16rem;

    background: transparent;

    border: 0;
    border: 1px solid var(--orange);
    border-radius: 5px;

    padding: 1rem;
    /* border-color: var(--orange); */

    font-size: 1.725rem;
    font-weight: 500;
    color: var(--orange);

    transition: background-color 0.2s;
    transition: color 0.2s;

    &:hover {
      background-color: var(--orange);

      color: var(--gray-850);
    }

    & + button {
      margin-left: 3rem;
    }

    &.active {
      background-color: var(--orange);

      color: var(--gray-850);
    }
  }
`;

export const ContentInfo = styled.div``;

export const ContentPassword = styled.div``;

export const BoxCheckbox = styled.div`
  padding-top: 1rem;

  span {
    font-size: 1.725rem;

    margin-left: 1rem;
  }

  label + label {
    margin-left: 5rem;
  }
`;
