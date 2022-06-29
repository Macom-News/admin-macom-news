import styled, { css } from 'styled-components';
import { StylesConfig } from 'react-select';

interface ISelectContentProps {
  isErrored: boolean;
}

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 5rem;

  margin-bottom: 5rem;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 360px;

  display: flex;
  flex-direction: column;

  background-color: var(--gray-800);

  padding: 2rem;
`;

export const SelectContent = styled.div<ISelectContentProps>`
  background-color: var(--gray-900);

  border-radius: 10px;
  border: 2px solid var(--gray-900);

  padding: 1rem;
  width: 100%;

  color: var(--gray-700);

  display: flex;
  align-items: center;

  & + div {
    margin-top: 1rem;
  }

  ${({ isErrored }) =>
    isErrored &&
    css`
      border-color: var(--red);
    `}
`;

export const configSelectStyles: StylesConfig = {
  container: styles => ({
    ...styles,
    width: '100%',
    backgroundColor: 'transparent',
  }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', border: 0 }),
  input: styles => ({ ...styles, color: '#FFFFFF' }),
  option: styles => ({
    ...styles,
    backgroundColor: '#121214',
    fontSize: 15,
    color: '#FFF',
    border: 0,
  }),
  singleValue: styles => ({ ...styles, color: '#FFF', fontSize: 15 }),
  menuList: styles => ({ ...styles, backgroundColor: '#121214' }),
  // valueContainer: styles => ({ ...styles, color: '#FFF', fontSize: 15 }),
};
