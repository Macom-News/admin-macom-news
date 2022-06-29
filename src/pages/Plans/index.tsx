import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiEdit, FiTrash, FiPlus } from 'react-icons/fi';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { Header } from '../../components/Header';

import { Container, Content, Table } from './styles';
import { HeaderContent } from '../../components/HeaderContent';

interface IPrice {
  id: string;
  value_cents: number;
}

interface IPlan {
  id: string;
  name: string;
  identifier: string;
  interval: number;
  interval_type: string;
  prices: Array<IPrice>;
  payable_with: Array<string>;
  max_cycles: number;
  billing_days: number;
}

const Plans: React.FC = () => {
  const location = useHistory();

  const [plans, setPlans] = useState<IPlan[]>([]);

  const payableWithType = useCallback((payable: string) => {
    switch (payable) {
      case 'credit_card':
        return 'Cartão de crédito';
      case 'pix':
        return 'Pix';
      case 'all':
        return 'Todos';
      default:
        return 'Todos';
    }
  }, []);

  const handleEditPlan = useCallback(
    async (plan_id: string) => {
      location.push(`/planos/editar/${plan_id}`);
    },
    [location],
  );

  const handleDelete = useCallback(async (id: string, name: string) => {
    try {
      const resultConfirm = confirm(`Deseja deletar o plano: ${name}`);

      if (resultConfirm) {
        const result = await api.delete(`/plans/delete/${id}`);

        if (result.status === 200) {
          alert(
            'Operação realizada com sucesso. Em alguns instantes o plano será removido',
          );
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          if (errorAxios.response.status === 404) {
            alert(
              'Já foi enviada a solicitação de exclusão do plano. Aguarde uns instantes até que seja removido da base',
            );

            return;
          }
        }
      }

      alert('Não foi possível deletar o plano');
    }
  }, []);

  useEffect(() => {
    document.title = 'Planos';
  }, []);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await api.get(`/plans/list`);

        if (response.status === 200) {
          setPlans(response.data);
        }
      } catch (err) {
        alert('Ops! Algo inesperado ocorreu, tente novamente');
      }
    }

    loadPlans();
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Planos" />
        </div>

        <Table>
          <Link to="planos/criar">
            <FiPlus size={18} /> <span>Novo</span>
          </Link>

          {plans.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Método de pagamento</th>
                  <th>Limite do ciclos de assinatura</th>
                  <th>
                    Dias antes de vencer a assinatura para gerar nova fatura
                  </th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id}>
                    <td>
                      <p>{plan.name}</p>
                    </td>

                    <td>
                      {typeof plan.payable_with === 'string' && (
                        <p>{payableWithType(plan.payable_with)}</p>
                      )}

                      {typeof plan.payable_with === 'object' &&
                        plan.payable_with.map(payable => (
                          <p key={payable}>{payableWithType(payable)}</p>
                        ))}
                    </td>

                    <td>
                      {plan.max_cycles === 0
                        ? 'Indeterminado'
                        : plan.max_cycles}
                    </td>

                    <td>{`${plan.billing_days} ${
                      plan.billing_days > 1 ? 'dias' : 'dia'
                    } `}</td>

                    <td>
                      {plan.prices.map(price => (
                        <p key={price.id}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(price.value_cents / 100)}
                        </p>
                      ))}
                    </td>

                    <td>
                      <button type="button">
                        <FiEdit
                          size={20}
                          onClick={() => handleEditPlan(plan.id)}
                        />
                      </button>

                      <button type="button">
                        <FiTrash
                          size={20}
                          onClick={() => handleDelete(plan.id, plan.name)}
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

export { Plans };
