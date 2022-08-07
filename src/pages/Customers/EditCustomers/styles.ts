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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    width: 340px;

    margin: 30px 0;
  }
`;

export const ContentInfo = styled.div``;

export const ContainerInformations = styled.div`
  width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid;
  border-color: 'gray-medium-color';
  border-radius: 5px;

  padding: 18px;

  margin-top: 2rem;
  margin-bottom: 6rem;
`;

export const ContainerNameText = styled.div`
  width: 100%;

  display: block;

  justify-content: space-between;

  align-items: center;

  font-size: 17px;

  margin-right: 10px;

  p {
    background: transparent;

    border-radius: 8px;
    background-color: var(--gray-900);
    border: 2px solid var(--gray-900);

    padding: 1.35rem;

    margin: 8px 1px 15px 1px;

    font-size: 17px;
    color: var(--white);
  }
`;

export const ContainerCheckBox = styled.div`
  display: flex;
  flex: 1;

  margin-right: 93%;
  margin-bottom: 15px;

  span {
    font-size: 17px;

    margin-left: 1.5rem;
  }

  label + label {
    margin-left: 5rem;
  }
`;
