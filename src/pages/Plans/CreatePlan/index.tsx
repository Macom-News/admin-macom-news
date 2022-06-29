import React, { useCallback, useRef, useState } from 'react';

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

interface IFormDataSubmit {
  name: string;
  identifier: string;
  interval: number;
  billing_days: number;
  max_cycles: number;
}

const schemaYup = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  identifier: Yup.string().required('Identificador obrigatório'),
  interval: Yup.number().required('Intervalo de cobrança obrigatório'),
  billing_days: Yup.string().required('Dias para gerar nova fatura'),
  max_cycles: Yup.number().required('Limite de renovação obrigatório'),
});

const CreatePlan: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

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

        const dataIUGU = {
          name: data.name,
          identifier: data.identifier.replace(/\s/g, '_').toLowerCase().trim(), // remove all white space
          interval: Number(data.interval),
          interval_type: selectedIntervalType,
          value_cents: price,
          billing_days: Number(data.billing_days),
          max_cycles: Number(data.max_cycles),
        };

        const response = await api.post('/plans/create', dataIUGU);

        if (response.status === 201) {
          formRef.current?.reset();
          setSelectedIntervalType('0');
          setPrice(0);

          alert('Plano cadastrado com sucesso');
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
    [price, selectedIntervalType],
  );

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar plano" />

        <Box>
          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Input name="name" placeholder="Nome" />
            <Input
              name="identifier"
              placeholder="Identificador do plano. Digite em letras minusculas e sem espaço"
            />
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
                groupSeparator="."
                decimalsLimit={2}
                decimalSeparator=","
                intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                allowNegativeValue={false}
                defaultValue={price}
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

            <Button type="submit">Cadastrar</Button>
          </Form>
        </Box>
      </Content>
    </Container>
  );
};

export { CreatePlan };
