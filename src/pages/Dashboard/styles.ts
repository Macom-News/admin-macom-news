import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1480px;

  margin-top: 6rem;
  margin-bottom: 6rem;
  margin-inline-start: auto;
  margin-inline-end: auto;

  padding-inline-start: 6rem;
  padding-inline-end: 6rem;

  display: flex;
`;

export const GridLayout = styled.div`
  display: grid;

  flex: 1;
  align-items: center;
  justify-content: center;

  grid-gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
`;

export const Box = styled.div`
  padding: 4rem;
  padding-bottom: 4rem;

  background-color: var(--gray-800);

  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-top: 1rem;

    font-size: 1.75rem;
  }
`;
