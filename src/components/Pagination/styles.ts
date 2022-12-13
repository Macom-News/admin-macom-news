import styled from 'styled-components';

export const Container = styled.div`
  height: 50px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-bottom: 20px;
`;

export const Text = styled.span`
  width: 3.5rem;

  text-align: center;
  font-size: 1.825rem;
  font-weight: bold;
  color: var(--gray-300);
`;
