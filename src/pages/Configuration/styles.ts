import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.main`
  width: 80%;
  max-width: 720px;

  margin-top: 5rem;

  background-color: var(--gray-800);

  border-radius: 5px;

  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div.headerContent {
    width: 100%;
  }
`;

export const AvatarInput = styled.div`
  width: 12rem;
  height: 12rem;

  border-radius: 50%;

  background-color: var(--gray-700);

  position: relative;
  align-self: center;

  margin-bottom: 6rem;

  img {
    width: 12rem;
    height: 12rem;

    border-radius: 50%;
  }

  label {
    width: 4rem;
    height: 4rem;

    position: absolute;

    background-color: var(--orange);

    border: 0;
    border-radius: 50%;

    right: 0;
    bottom: 0;

    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    visibility: hidden;
    display: none;
  }

  svg {
    color: #312e38;
  }
`;

export const Box = styled.div`
  width: 70%;

  font-size: 2rem;
  text-align: center;

  padding: 1rem;

  border-bottom: 1px solid var(--gray-900);

  & + div {
    margin-bottom: 0.5rem;
  }

  transition: color 0.2s;

  a:hover {
    color: var(--orange);
  }
`;
