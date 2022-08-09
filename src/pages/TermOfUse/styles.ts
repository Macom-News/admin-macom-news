import styled from 'styled-components';

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

    margin: 2rem 7rem;

    h1 {
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 2.5rem;
    }
  }
`;

export const Text = styled.p`
  margin: 2rem 7rem;

  font-size: 1.725rem;
  text-align: justify;
`;
