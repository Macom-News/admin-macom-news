import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  height: 10rem;

  display: flex;
  align-items: center;

  margin-inline-start: auto;
  margin-inline-end: auto;
  margin-top: 0.2rem;

  padding-inline-start: 2rem;
  padding-inline-end: 2rem;

  max-width: 1480px;

  background-color: var(--gray-800);
`;

export const BoxLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    width: 7rem;
    height: 7rem;
  }
`;

export const Config = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-left: auto;

  div.user_authenticate {
    width: 25rem;

    margin-right: 2rem;

    font-size: 1.725rem;
    text-align: right;
  }

  div + div {
    margin-left: 2rem;

    & + div {
      cursor: pointer;
    }
  }
`;
