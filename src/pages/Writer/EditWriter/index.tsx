import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

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

import {
  Container,
  Content,
  Box,
  HeaderForm,
  ContentInfo,
  ContentPassword,
  BoxCheckbox,
} from './styles';

interface IRouteMatchParams {
  writer_id: string;
}

interface IWriter {
  id: string;
  name: string;
  email: string;
  enabled: string;
}

interface IFormInformationDataSubmit {
  name: string;
  email: string;
  password: string;
}

interface IFormPasswordDataSubmit {
  old_password: string;
  password: string;
}

const schemaInformationYup = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .required('E-mail obrigatório')
    .email('E-mail tem que ser válido'),
});

const schemaPasswordYup = Yup.object().shape({
  old_password: Yup.string()
    .required('Senha obrigatória')
    .min(4, 'No mínimo 4 dígitos'),
  password: Yup.string()
    .required('Senha obrigatória')
    .min(4, 'No mínimo 4 dígitos'),
  password_confirmation: Yup.string().oneOf(
    [null, Yup.ref('password')],
    'As senhas precisam ser iguais',
  ),
});

const EditWriter: React.FC = () => {
  const { user, updateToken, updateUser } = useAuth();

  const { params } = useRouteMatch<IRouteMatchParams>();
  const { writer_id } = params;

  const formInformationRef = useRef<FormHandles>(null);
  const formPasswordRef = useRef<FormHandles>(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isContentInformationFocus, setIsContentInformationFocus] =
    useState(true);
  const [isContentPasswordFocus, setIsContentPasswordFocus] = useState(false);
  const [writerDate, setWriterDate] = useState<IWriter>({} as IWriter);

  const handleContentInformationFocus = useCallback(() => {
    setIsContentInformationFocus(true);
    setIsContentPasswordFocus(false);
  }, []);

  const handleContentPasswordFocus = useCallback(() => {
    setIsContentPasswordFocus(true);
    setIsContentInformationFocus(false);
  }, []);

  const handleIsEnabledCheckBox = useCallback((checked: boolean) => {
    setIsEnabled(checked);
  }, []);

  const handleFormInformationSubmit = useCallback(
    async (data: IFormInformationDataSubmit) => {
      try {
        formInformationRef.current?.setErrors({});

        await schemaInformationYup.validate(data, { abortEarly: false });

        const writerInformation = {
          id: writer_id,
          name: data.name,
          email: data.email,
          enabled: isEnabled,
        };

        const response = await api.put('/writers_profile/', writerInformation);

        if (user.id === writer_id) {
          const updateWriterHook = Object.assign(response.data, {
            type: 'writer',
          });
        }

        alert('Informações alteradas com sucesso');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formInformationRef.current?.setErrors(errors);

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
    },
    [isEnabled, user.id, writer_id],
  );

  const handleFormPasswordSubmit = useCallback(
    async (data: IFormPasswordDataSubmit) => {
      try {
        formPasswordRef.current?.setErrors({});

        await schemaPasswordYup.validate(data, { abortEarly: false });

        const newPassword = {
          old_password: data.old_password,
          password: data.password,
        };

        await api.patch('/writers_profile/password', newPassword);

        formPasswordRef.current?.reset();

        alert('Senha atualizada com sucesso');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formPasswordRef.current?.setErrors(errors);

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
    },
    [],
  );

  useEffect(() => {
    document.title = 'Atualizar colunista';
  }, []);

  useEffect(() => {
    async function loadWriter() {
      try {
        const response = await api.get(`/writers/show/${writer_id}`);

        setWriterDate(response.data);
        setIsEnabled(response.data.enabled);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;

          if (axiosError.response) {
            const statusCode = axiosError.response.status;

            if (statusCode === 401) {
              const successRefreshToken = await updateToken();

              if (successRefreshToken) {
                await loadWriter();
              }

              return;
            }

            alert('Ops! Ocorreu um problema, tente novamente');
          }
        }
      }
    }

    loadWriter();
  }, [user.id, user.type, updateToken, writer_id]);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Atualizar colunista" />

        <Box>
          <HeaderForm>
            <button
              type="button"
              className={isContentInformationFocus ? 'active' : ''}
              onClick={handleContentInformationFocus}
            >
              Informações
            </button>

            {user.type === 'writer' && (
              <button
                type="button"
                className={isContentPasswordFocus ? 'active' : ''}
                onClick={handleContentPasswordFocus}
              >
                Senha
              </button>
            )}
          </HeaderForm>

          {isContentInformationFocus && (
            <Form
              ref={formInformationRef}
              initialData={writerDate}
              onSubmit={handleFormInformationSubmit}
            >
              <ContentInfo>
                <Input name="name" placeholder="Nome" />
                <Input name="email" placeholder="E-mail" />

                <BoxCheckbox>
                  <label htmlFor="enabled">
                    <input
                      type="checkbox"
                      name="enabled"
                      id="enabled"
                      checked={isEnabled}
                      onChange={event => {
                        handleIsEnabledCheckBox(event.target.checked);
                      }}
                    />
                    <span>Ativo</span>
                  </label>
                </BoxCheckbox>

                <Button type="submit">Atualizar</Button>
              </ContentInfo>
            </Form>
          )}

          {isContentPasswordFocus && (
            <Form
              ref={formPasswordRef}
              initialData={writerDate}
              onSubmit={handleFormPasswordSubmit}
            >
              <ContentPassword>
                <Input
                  name="old_password"
                  type="password"
                  placeholder="Senha atual"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Nova senha"
                />
                <Input
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirmação de senha"
                />

                <Button type="submit">Atualizar</Button>
              </ContentPassword>
            </Form>
          )}
        </Box>
      </Content>
    </Container>
  );
};

export { EditWriter };
