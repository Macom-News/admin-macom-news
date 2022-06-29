import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { FiEdit, FiTrash } from 'react-icons/fi';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { Header } from '../../components/Header';

import { Container, Content, Table } from './styles';
import { HeaderContent } from '../../components/HeaderContent';

interface IItem {
  id: string;
  suspended: boolean;
  price_cents: number;
  plan_name: string;
  active: boolean;
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

  const [subscription, setSubscription] = useState<ISubscription>();

  const handleEditSubscriptions = useCallback(
    async (subscriptions_id: string) => {
      location.push(`/assinaturas/editar/${subscriptions_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(async (id: string) => {
    try {
      const resultConfirm = confirm(`Deseja deletar a assinatura: ${id}`);

      if (resultConfirm) {
        const result = await api.delete(`/assinaturas/delete/${id}`);

        if (result.status === 200) {
          alert(
            'Operação realizada com sucesso. Em alguns instantes a assinatura será removida.',
          );
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          if (errorAxios.response.status === 404) {
            alert(
              'Já foi enviada a solicitação de exclusão da assinatura. Aguarde alguns instantes até que seja removida da base',
            );

            return;
          }
        }
      }

      alert('Não foi possível deletar a assinatura');
    }
  }, []);

  useEffect(() => {
    document.title = 'Assinatura';
  }, []);

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const response = await api.get(`/subscriptions/list/${customer_id}`);

        if (response.status === 200) {
          setSubscription(response.data);
        }
      } catch (err) {
        alert('Ops! Algo inesperado ocorreu, tente novamente');
      }
    }

    loadSubscriptions();
  }, [customer_id]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Assinatura" />
        </div>

        <Table>
          {subscription && (
            <table>
              <thead>
                <tr>
                  <th>Plano</th>
                  <th>Preço</th>
                  <th>Ativo</th>
                  <th>Suspender</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {subscription.items.map(subscription_item => (
                  <tr key={subscription_item.id}>
                    <td>
                      <p>{subscription_item.plan_name}</p>
                    </td>

                    <td>
                      {subscription.items.map(price => (
                        <p key={price.id}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(price.price_cents / 100)}
                        </p>
                      ))}
                    </td>

                    <td>
                      <p>{subscription_item.active ? 'Sim' : 'Não'}</p>
                    </td>

                    <td>
                      <button type="button">
                        <FiEdit
                          size={20}
                          onClick={() =>
                            handleEditSubscriptions(subscription_item.id)
                          }
                        />
                      </button>

                      <button type="button">
                        <FiTrash
                          size={20}
                          onClick={() => handleDelete(subscription_item.id)}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Table>
      </Content>
    </Container>
  );
};

export { Subscriptions };
