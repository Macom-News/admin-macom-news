import React, { useCallback, useRef } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import axios, { AxiosError } from 'axios';
import { api } from '../../../services/api';
import { getValidationErrors } from '../../../utils/getValidationErrors';

import { Header } from '../../../components/Header';
import { HeaderContent } from '../../../components/HeaderContent';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

import { Container, Content, Box } from './styles';

interface IFormDataSubmit {
  name: string;
  email: string;
  password: string;
}

const schemaYup = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .required('E-mail obrigatório')
    .email('E-mail tem que ser válido'),
  password: Yup.string()
    .required('Senha obrigatória')
    .min(4, 'No mínimo 4 dígitos'),
  password_confirmation: Yup.string().oneOf(
    [null, Yup.ref('password')],
    'As senhas precisam ser iguais',
  ),
});

const CreateWriter: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleFormSubmit = useCallback(async (data: IFormDataSubmit) => {
    try {
      formRef.current?.setErrors({});

      await schemaYup.validate(data, { abortEarly: false });

      await api.post('/writers', data);

      formRef.current?.reset();

      alert('Colunista inserido com sucesso');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;

        if (axiosError.response) {
          alert(axiosError.response.data.error);
        }
      } else {
        alert('Ops! Ocorreu um erro, verifique os dados e tente novamente');
      }
    }
  }, []);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar colunista" />

        <Box>
          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Input name="name" placeholder="Nome" />
            <Input name="email" placeholder="E-mail" />
            <Input name="password" placeholder="Senha" type="password" />
            <Input
              name="password_confirmation"
              placeholder="Confirmação de senha"
              type="password"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>
        </Box>
      </Content>
    </Container>
  );
};

export { CreateWriter };
