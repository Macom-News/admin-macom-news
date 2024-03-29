import styled from 'styled-components';
import { shade } from 'polished';

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
  margin-top: 15px;
  margin-bottom: 25px;

  span {
    font-size: 17px;

    margin-left: 1.5rem;
  }

  label + label {
    margin-left: 5rem;
  }
`;

export const BoxSubscriptionActiveSuspended = styled.div`
  margin-top: 10px;
  margin-left: 45px;
  margin-bottom: 20px;
`;

export const ButtonChangeEnabledCustomer = styled.button`
  background-color: var(--orange);
  width: 250px;
  height: 40px;

  border: 0;
  border-radius: 10px;
  color: var(--gray-850);
  opacity: 1;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
  &:disabled {
    background-color: ${shade(0.2, '#ff9000')};
  }

  text-transform: uppercase;
`;

export const ButtonResetPasswordCustomer = styled.button`
  background-color: var(--red);
  width: 250px;
  height: 40px;

  border: 0;
  border-radius: 10px;
  color: var(--white);
  opacity: 1;

  &:hover {
    background-color: ${shade(0.2, '#c53030')};
  }
  &:disabled {
    background-color: ${shade(0.2, '#c53030')};
  }

  text-transform: uppercase;

  margin-left: 10px;
`;

export const ContainerImage = styled.div`
  width: 50%;

  margin-top: 2rem;

  margin-bottom: 3rem;

  div.image-container {
    width: 100%;
    height: 25rem;

    border: 1px solid #121214;

    cursor: pointer;

    img {
      width: 100%;
      height: 30rem;
      object-fit: cover;
    }

    label {
      width: 14rem;
      height: 14rem;

      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      margin: 0 auto;
      margin-top: 50px;
    }
  }
`;
