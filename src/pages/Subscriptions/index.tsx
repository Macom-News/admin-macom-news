import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Switch from 'react-switch';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { Header } from '../../components/Header';

import {
  Container,
  Content,
  BoxSubscription,
  BoxPlanNameText,
  BoxPlanPriceText,
  BoxSubscriptionActiveSuspended,
  BoxSubscriptionActiveSuspendedControl,
  SubscriptionActiveSuspendedText,
  ButtonChangeSubscription,
  BoxDeleteSubscription,
  ButtonRemoveSubscription,
  ButtonRemoveSubscriptionText,
} from './styles';
import { HeaderContent } from '../../components/HeaderContent';

interface IItem {
  id: string;
  suspended: boolean;
  price_cents: number;
  price_cents_formatted: string;
  plan_name: string;
}

interface ISubscription {
  items: Array<IItem>;
}

interface IRouteMatchParams {
  customer_id: string;
}

const Subscriptions: React.FC = () => {
  const location = useHistory();

  const { params } = useRouteMatch<IRouteMatchParams>();
  const { customer_id } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<ISubscription>();
  const [checkedActiveSuspend, setCheckedActiveSuspend] = useState(false);

  // FUNCTIONS
  const toggleActiveSuspend = useCallback(() => {
    setCheckedActiveSuspend(oldState => !oldState);
  }, []);

  const handleActiveSuspendSubscription = useCallback(async () => {
    try {
      if (subscription) {
        setIsLoading(true);

        if (checkedActiveSuspend) {
          const response = await api.post(
            `/subscriptions/activate/${subscription.items[0].id}`,
          );

          if (response.status === 200) {
            const subscriptionCopy = subscription;

            const subscriptionData = response.data;

            subscriptionCopy.items[0] = {
              ...subscriptionData,
              price_cents_formatted: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(subscriptionData.price_cents / 100),
            };

            setIsLoading(false);
            setCheckedActiveSuspend(!subscriptionCopy.items[0].suspended);
            setSubscription(subscriptionCopy);
            alert('Assinatura ativa!');
          }
        } else {
          const response = await api.post(
            `/subscriptions/suspend/${subscription.items[0].id}`,
          );

          if (response.status === 200) {
            const subscriptionCopy = subscription;

            const subscriptionData = response.data;

            subscriptionCopy.items[0] = {
              ...subscriptionData,
              price_cents_formatted: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(subscriptionData.price_cents / 100),
            };

            setIsLoading(false);
            setCheckedActiveSuspend(!subscriptionCopy.items[0].suspended);
            setSubscription(subscriptionCopy);
            alert('Assinatura suspensa!');
          }
        }
      }
    } catch (err) {
      setIsLoading(false);

      if (axios.isAxiosError(err)) {
        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          alert('Ops! Não foi possível executar a operação');
        }
      }
    }
  }, [checkedActiveSuspend, subscription]);

  const handleDeleteSubscription = useCallback(async () => {
    try {
      if (subscription) {
        setIsLoading(true);

        const response = await api.delete(
          `/subscriptions/delete/${subscription.items[0].id}`,
        );

        if (response.status === 200) {
          setIsLoading(false);

          alert(
            'Operação realizada com sucesso! Em breve sua assinatura será cancelada',
          );
          location.goBack();
        }
      }
    } catch (err) {
      setIsLoading(false);

      if (axios.isAxiosError(err)) {
        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          alert('Ops! Não foi possível cancelar sua assinatura');
        }
      }
    }
  }, [location, subscription]);

  useEffect(() => {
    document.title = 'Assinatura';
  }, []);

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        setIsLoading(true);

        const response = await api.get(`/subscriptions/list/${customer_id}`);

        if (response.status === 200) {
          const subscriptionData = response.data as ISubscription;

          const subscriptionFormatted = {
            items: subscriptionData.items.map(item => ({
              ...item,
              price_cents_formatted: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(item.price_cents / 100),
            })),
          };

          setIsLoading(false);
          if (subscriptionFormatted.items.length > 0) {
            setCheckedActiveSuspend(!subscriptionFormatted.items[0].suspended);
            setSubscription(subscriptionFormatted);
          } else {
            alert('Cliente não possui nenhuma assinatura');
            location.goBack();
          }
        }
      } catch (err) {
        setIsLoading(false);
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            if (errorAxios.response.status === 404) {
              alert('Ops! Não foi possível encontrar sua assinatura');
            }
          }
        }
      }
    }
    loadSubscriptions();
  }, [customer_id, location]);

  return (
    <Container>
      <Header />

      {subscription && subscription.items.length > 0 && (
        <Content>
          <div className="headerContent">
            <HeaderContent title="Assinatura" />
          </div>

          <BoxSubscription>
            <BoxPlanNameText>{subscription.items[0].plan_name}</BoxPlanNameText>
            <BoxPlanPriceText>
              {subscription.items[0].price_cents_formatted}
            </BoxPlanPriceText>
          </BoxSubscription>

          <BoxSubscriptionActiveSuspended>
            <BoxSubscriptionActiveSuspendedControl>
              <SubscriptionActiveSuspendedText>
                Ativa
              </SubscriptionActiveSuspendedText>

              <Switch
                checked={checkedActiveSuspend}
                onChange={toggleActiveSuspend}
                onColor="#2693e6"
                onHandleColor="#0382e4"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.4)"
                activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                height={15}
                width={48}
              />
            </BoxSubscriptionActiveSuspendedControl>

            <ButtonChangeSubscription onClick={handleActiveSuspendSubscription}>
              Atualizar
            </ButtonChangeSubscription>
          </BoxSubscriptionActiveSuspended>

          <BoxDeleteSubscription>
            <ButtonRemoveSubscription onClick={handleDeleteSubscription}>
              <ButtonRemoveSubscriptionText>
                Cancelar assinatura
              </ButtonRemoveSubscriptionText>
            </ButtonRemoveSubscription>
          </BoxDeleteSubscription>
        </Content>
      )}
    </Container>
  );
};

export { Subscriptions };
