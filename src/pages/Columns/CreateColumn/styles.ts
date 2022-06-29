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
    width: 90%;

    margin: 30px 0;

    background-color: rebeccapurple;
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

      &:disabled {
        background-color: transparent;

        color: var(--orange);

        cursor: not-allowed;
      }
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

export const ContentEditor = styled.div`
  margin-top: 2rem;

  margin-bottom: 5rem;

  h1 {
    margin: 2rem 0;
  }

  div.divisor {
    width: 100%;
    height: 1px;

    background-color: var(--gray-900);
  }

  p.success {
    font-size: 2rem;
    color: var(--white);

    margin-bottom: 2rem;

    padding: 0.5rem;

    background-color: green;
  }
`;

export const ContainerTitleInput = styled.div`
  width: 100%;

  background-color: var(--gray-900);

  border-radius: 10px;
  border: 2px solid var(--gray-900);

  padding: 1.275rem;

  margin-bottom: 2rem;

  color: var(--gray-700);

  display: flex;
  align-items: center;

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
`;

export const ContainerDateInput = styled.div`
  width: 100%;

  background-color: var(--gray-900);

  border-radius: 10px;
  border: 2px solid var(--gray-900);

  padding: 1.275rem;

  margin-bottom: 2rem;

  color: var(--gray-700);

  display: flex;
  align-items: center;

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
`;

export const ContainerLevelInput = styled.div`
  width: 100%;

  background-color: var(--gray-900);

  border-radius: 10px;
  border: 2px solid var(--gray-900);

  padding: 1.275rem;

  margin-bottom: 2rem;

  color: var(--gray-700);

  display: flex;
  align-items: center;

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
`;

export const BoxContent = styled.div``;
