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
  align-items: center;
  justify-content: center;

  form {
    width: 40%;

    margin: 30px 0;
  }
`;

export const BoxSelectedIntervalType = styled.div`
  height: 6rem;

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

  select {
    flex: 1;

    background: transparent;

    padding: 0.05rem;

    border: 0;

    font-size: 1.7rem;
    color: var(--white);
  }
`;

export const BoxPrice = styled.div`
  height: 6rem;

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
  }
`;
