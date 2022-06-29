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

export const BoxHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 2.5rem;

    margin-top: 2rem;

    padding: 1rem 7rem;

    svg {
      margin-right: 1rem;
    }
  }
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    width: 340px;

    margin: 30px 0;
  }
`;

export const BoxCheckbox = styled.div`
  padding-top: 1rem;

  span {
    font-size: 1.725rem;

    margin-left: 1rem;
  }
`;
