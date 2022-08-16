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

export const BoxSubscription = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-color: 'gray-medium-color';
  border-radius: 5px;
  padding: 5px;
  margin: auto 45rem;
  margin-top: 2rem;
`;

export const BoxPlanNameText = styled.div`
  flex: 1;
  margin-left: 10px;
  margin-right: 5px;
  font-size: 17px;
`;

export const BoxPlanPriceText = styled.div`
  margin-right: 15px;
  font-size: 17px;
`;

export const BoxSubscriptionActiveSuspended = styled.div`
  margin: auto 45rem;
  margin-top: 1rem;
  border: 1px solid;
  border-color: 'gray-medium-color';
  border-radius: 5px;
  padding: 10px;
`;

export const BoxSubscriptionActiveSuspendedControl = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const SubscriptionActiveSuspendedText = styled.div`
  margin-left: 10px;
  margin-right: 5px;
  font-size: 17px;
`;

export const ButtonChangeSubscription = styled.button`
  background-color: var(--orange);
  width: 100%;
  height: 30px;
  border: 0;
  border-radius: 10px;
  color: var(--gray-850);
  justify-content: center;
  align-items: center;
  opacity: 1;
  margin-top: 20px;
  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
  &:disabled {
    background-color: ${shade(0.2, '#ff9000')};
  }
  text-transform: uppercase;
`;

export const BoxDeleteSubscription = styled.div`
  width: 33%;
  margin: 1rem 45rem;
  border: 1px solid;
  border-color: 'gray-medium-color';
  border-radius: 5px;
  padding: 10px;
`;

export const ButtonRemoveSubscription = styled.div`
  display: flex;
  background-color: var(--red);
  width: 100%;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 10px;
  opacity: 1;
  cursor: pointer;
  &:hover {
    background-color: ${shade(0.2, '#ff5733')};
  }
  &:disabled {
    background-color: ${shade(0.2, '#ff5733')};
  }
`;

export const ButtonRemoveSubscriptionText = styled.div`
  font-size: 15px;
  color: 'white-color';
  text-transform: uppercase;
  text-align: center;
  margin-top: 5px;
`;
