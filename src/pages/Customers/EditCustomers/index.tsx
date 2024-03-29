import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import axios, { AxiosError } from 'axios';

import { FiCameraOff } from 'react-icons/fi';

import { generateRandomString } from '../../../utils/Utils';

import { api } from '../../../services/api';

import { Header } from '../../../components/Header';
import { HeaderContent } from '../../../components/HeaderContent';

import {
  Container,
  Content,
  Box,
  ContentInfo,
  ContainerInformations,
  ContainerNameText,
  ContainerCheckBox,
  ContainerImage,
  BoxSubscriptionActiveSuspended,
  ButtonChangeEnabledCustomer,
  ButtonResetPasswordCustomer,
} from './styles';

interface IRouteMatchParams {
  id: string;
}

interface ICustomer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  image: string;
  street_name: string;
  street_number: string;
  neighborhood: string;
  complement: string;
  postal_code: string;
  reference: string;
  city: string;
  uf: string;
  is_freemason: boolean;
  enabled: boolean;
  level: number;
  potency: string;
  emporium: string;
  description_task_emporium: string;
  city_emporium: string;
  rite: string;
  whatsapp_master_emporium: string;
  instagram: string;
  photo_cimcard_url: string;
  client_id_payment: string;
}

const EditCustomers: React.FC = () => {
  const { params } = useRouteMatch<IRouteMatchParams>();
  const { id } = params;
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<ICustomer>();

  const [checkedActiveSuspend, setCheckedActiveSuspend] = useState(false);

  // FUNCTIONS
  const toggleActiveSuspend = useCallback(() => {
    setCheckedActiveSuspend(oldState => !oldState);
  }, []);

  const handleActiveSuspendCustomer = useCallback(async () => {
    try {
      if (customer) {
        setIsLoading(true);

        if (checkedActiveSuspend) {
          const response = await api.patch(
            `/customers_profile/active/${customer.id}`,
          );

          if (response.status === 200) {
            // const customerCopy = customer;

            const customerData = response.data;

            setIsLoading(false);
            // setCheckedActiveSuspend(!customerCopy.enabled);
            setCustomer(customerData);

            alert('Atualização realizada!');
            history.goBack();
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
  }, [checkedActiveSuspend, customer, history]);

  const handleQuestionResetPassword = useCallback(async () => {
    const confirmResetPassword = confirm('Deseja resetar a senha?');

    if (confirmResetPassword) {
      if (customer) {
        try {
          const randomPassword = generateRandomString(5);

          const data = {
            id: customer.id,
            password: randomPassword.trim(),
          };

          const responseResetPassword = await api.patch(
            '/customers_profile/reset_password',
            data,
          );

          if (responseResetPassword.status === 200) {
            const message = `Senha foi atualizada.\nA nova senha: ${randomPassword}`;

            alert(message);
          }
        } catch (err) {
          alert('Não foi possível atualizar a senha');
        }
      }
    }
  }, [customer]);

  useEffect(() => {
    document.title = 'Informações do cliente';
  }, []);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const response = await api.get(`/customers/show/${id}`);

        setCustomer(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;

          if (axiosError.response) {
            alert('Ops! Não foi possível executar a operação');
          }
        }
      }
    }

    loadCustomer();
  }, [id]);

  return (
    <Container>
      <Header />

      <Content>
        <HeaderContent title="Informações do cliente" />

        {customer && (
          <Box>
            <ContentInfo>
              <ContainerInformations>
                <ContainerNameText>
                  Nome
                  <p>{customer.name}</p>
                </ContainerNameText>

                <ContainerNameText>
                  CPF
                  <p>{customer.cpf}</p>
                </ContainerNameText>

                <ContainerNameText>
                  E-mail
                  <p>{customer.email}</p>
                </ContainerNameText>

                <ContainerNameText>
                  Whatsapp
                  <p>{customer.whatsapp}</p>
                </ContainerNameText>

                <ContainerNameText>
                  Endereço
                  <p>
                    {`${customer.street_name}, ${customer.street_number} - ${customer.neighborhood}`}
                  </p>
                </ContainerNameText>

                <ContainerNameText>
                  Complemento
                  <p>{customer.complement}</p>
                </ContainerNameText>

                <ContainerNameText>
                  CEP
                  <p>{customer.postal_code}</p>
                </ContainerNameText>

                <ContainerNameText>
                  Referência
                  <p>{customer.reference}</p>
                </ContainerNameText>

                <ContainerNameText>
                  Cidade
                  <p>{customer.city}</p>
                </ContainerNameText>

                <ContainerNameText>
                  UF
                  <p>{customer.uf}</p>
                </ContainerNameText>

                <ContainerCheckBox>
                  <label htmlFor="enabled">
                    <input
                      type="checkbox"
                      name="enabled"
                      id="enabled"
                      defaultChecked={customer.enabled}
                      onChange={toggleActiveSuspend}
                    />
                    <span>Ativo</span>
                  </label>
                </ContainerCheckBox>

                {customer.is_freemason && (
                  <>
                    <ContainerNameText>
                      Nível
                      <p>{customer.level}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Potência
                      <p>{customer.potency}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Loja
                      <p>{customer.emporium}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Descrição
                      <p>{customer.description_task_emporium}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Cidade
                      <p>{customer.city_emporium}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Rito
                      <p>{customer.rite}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Whatsapp do venerável mestre
                      <p>{customer.whatsapp_master_emporium}</p>
                    </ContainerNameText>

                    <ContainerNameText>
                      Instagram
                      <p>{customer.instagram}</p>
                    </ContainerNameText>

                    <ContainerImage>
                      <div className="image-container">
                        {customer.photo_cimcard_url ? (
                          <img
                            src={customer.photo_cimcard_url}
                            alt="Imagem do CimCard"
                          />
                        ) : (
                          <label>
                            <FiCameraOff size={50} />
                          </label>
                        )}
                      </div>
                    </ContainerImage>
                  </>
                )}

                <BoxSubscriptionActiveSuspended>
                  <ButtonChangeEnabledCustomer
                    onClick={handleActiveSuspendCustomer}
                  >
                    Atualizar
                  </ButtonChangeEnabledCustomer>

                  <ButtonResetPasswordCustomer
                    onClick={handleQuestionResetPassword}
                  >
                    Resetar senha
                  </ButtonResetPasswordCustomer>
                </BoxSubscriptionActiveSuspended>
              </ContainerInformations>
            </ContentInfo>
          </Box>
        )}
      </Content>
    </Container>
  );
};

export { EditCustomers };
