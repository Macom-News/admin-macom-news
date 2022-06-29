import React, { useCallback, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import axios, { AxiosError } from 'axios';
import { api } from '../../../services/api';
import { getValidationErrors } from '../../../utils/getValidationErrors';

import { useAuth } from '../../../hooks/auth';

import { Header } from '../../../components/Header';
import { HeaderContent } from '../../../components/HeaderContent';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

import { Container, Content, Box, BoxCheckbox } from './styles';

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

const CreateUser: React.FC = () => {
  const { user } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const handleIsAdminCheckBox = useCallback((checked: boolean) => {
    setIsAdmin(checked);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: IFormDataSubmit) => {
      if (user.type === 'user') {
        try {
          formRef.current?.setErrors({});

          await schemaYup.validate(data, { abortEarly: false });

          const newUser = {
            name: data.name,
            email: data.email,
            password: data.password,
            is_admin: isAdmin,
          };

          await api.post('/users', newUser);

          formRef.current?.reset();

          alert('Usuário inserido com sucesso');
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
      } else {
        alert('Você não tem permissão');
      }
    },
    [isAdmin, user.type],
  );

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Cadastrar usuário" />

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

            <BoxCheckbox>
              <label htmlFor="is_admin">
                <input
                  type="checkbox"
                  name="is_admin"
                  id="is_admin"
                  onChange={event => {
                    handleIsAdminCheckBox(event.target.checked);
                  }}
                />
                <span>Administrador</span>
              </label>
            </BoxCheckbox>

            <Button type="submit">Cadastrar</Button>
          </Form>
        </Box>
      </Content>
    </Container>
  );
};

export { CreateUser };
