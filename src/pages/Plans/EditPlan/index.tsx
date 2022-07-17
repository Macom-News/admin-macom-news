import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import CurrencyInput from 'react-currency-input-field';

import axios, { AxiosError } from 'axios';
import { api } from '../../../services/api';

import { getValidationErrors } from '../../../utils/getValidationErrors';

import { Header } from '../../../components/Header';
import { HeaderContent } from '../../../components/HeaderContent';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

import {
  Container,
  Content,
  Box,
  BoxSelectedIntervalType,
  BoxPrice,
} from './styles';

interface IPrice {
  id: string;
  value_cents: number;
  value_formatted: number;
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

interface IFormDataSubmit {
  name: string;
  interval: number;
  billing_days: number;
  max_cycles: number;
}

interface IRouteMatchParams {
  plan_id: string;
}

const schemaYup = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  interval: Yup.number().required('Intervalo de cobrança obrigatório'),
  billing_days: Yup.string().required('Dias para gerar nova fatura'),
  max_cycles: Yup.number().required('Limite de renovação obrigatório'),
});

const EditPlan: React.FC = () => {
  const { params } = useRouteMatch<IRouteMatchParams>();

  const { plan_id } = params;

  const formRef = useRef<FormHandles>(null);

  const [plan, setPlan] = useState<IPlan>();
  const [selectedIntervalType, setSelectedIntervalType] = useState('0');
  const [price, setPrice] = useState(0);

  const handleSelectedIntervalType = useCallback((intervalType: string) => {
    setSelectedIntervalType(intervalType);
  }, []);

  const handleSelectedPrice = useCallback((valuePrice: string) => {
    const priceTransformNumber = Number(
      valuePrice.replace('.', '').replace(',', '.'),
    );
    const priceCalculate = Math.round(priceTransformNumber * 100);
    setPrice(priceCalculate);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: IFormDataSubmit) => {
      try {
        formRef.current?.setErrors({});

        await schemaYup.validate(data, { abortEarly: false });

        if (plan) {
          const dataIUGU = {
            id: plan.id,
            name: data.name,
            interval: Number(data.interval),
            interval_type: selectedIntervalType,
            value_cents: price,
            billing_days: Number(data.billing_days),
            max_cycles: Number(data.max_cycles),
          };

          const response = await api.put('/plans/update', dataIUGU);

          if (response.status === 200) {
            alert('Plano atualizado com sucesso!');
          }
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;

          if (axiosError.response) {
            alert(
              'Não foi possível cadastrar o plano. Verifique as informações e tente novamente',
            );
          }
        } else {
          alert('Ops! Ocorreu um erro, verifique os dados e tente novamente');
        }
      }
    },
    [price, selectedIntervalType, plan],
  );

  useEffect(() => {
    document.title = 'Editar plano';
  }, []);

  useEffect(() => {
    async function loadPlan() {
      try {
        const response = await api.get(`/plans/show/${plan_id}`);

        if (response.status === 200) {
          setPrice(response.data.prices[0].value_cents);
          setSelectedIntervalType(response.data.interval_type);
          setPlan({
            ...response.data,
            prices: response.data.prices.map((priceValue: IPrice) => ({
              id: priceValue.id,
              value_cents: priceValue.value_cents,
              value_formatted: priceValue.value_cents / 100,
            })),
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            if (errorAxios.response.status === 404) {
              alert('Não foi possível encontrar as informações sobre o plano');
            }
          }
        }
      }
    }

    loadPlan();
  }, [plan_id]);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Editar plano" />

        {plan && (
          <Box>
            <Form ref={formRef} initialData={plan} onSubmit={handleFormSubmit}>
              <Input name="name" placeholder="Nome" />

              <Input
                name="interval"
                placeholder="Ciclo do plano. Intervalo da cobrança. Número maior que 0"
              />

              <BoxSelectedIntervalType>
                <select
                  name="interval_type"
                  value={selectedIntervalType}
                  onChange={event => {
                    handleSelectedIntervalType(event.target.value);
                  }}
                >
                  <option value="0">
                    Selecione o tipo de intervalo do plano
                  </option>
                  <option value="weeks">Semanas</option>
                  <option value="months">Mês</option>
                </select>
              </BoxSelectedIntervalType>

              <BoxPrice>
                <CurrencyInput
                  placeholder="Preço do plano"
                  prefix="R$"
                  defaultValue={plan.prices[0].value_formatted}
                  groupSeparator="."
                  decimalsLimit={2}
                  decimalSeparator=","
                  intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                  allowNegativeValue={false}
                  onValueChange={value => handleSelectedPrice(value || '0')}
                />
              </BoxPrice>

              <Input
                name="billing_days"
                placeholder="Dias para gerar nova fatura, antes de vencer a assinatura"
              />

              <Input
                name="max_cycles"
                placeholder="Limite de renovação. Digite 0 para indeterminado"
              />

              <Button type="submit">Atualizar</Button>
            </Form>
          </Box>
        )}
      </Content>
    </Container>
  );
};

export { EditPlan };
