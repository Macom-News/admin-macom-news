import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiSearch, FiDollarSign, FiArchive, FiEdit } from 'react-icons/fi';

import axios, { AxiosError } from 'axios';
import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { HeaderContent } from '../../components/HeaderContent';
import { Pagination } from '../../components/Pagination';

import {
  Container,
  Content,
  ContainerInput,
  Table,
  CenterParagraph,
} from './styles';

interface ICustomer {
  id: string;
  name: string;
  email: string;
  level: number;
  client_id_payment: string;
}

const Customers: React.FC = () => {
  const location = useHistory();

  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [searchCustomers, setSearchCustomers] = useState<ICustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (term !== '') {
        const customersSearch = customers;

        const customerFilterSearch = customersSearch.filter(customer =>
          customer.name.toUpperCase().includes(term.toLocaleUpperCase()),
        );

        setSearchCustomers(customerFilterSearch);
      } else {
        setSearchCustomers(customers);
      }
    },
    [customers],
  );

  const handleEditCustomerSubscription = useCallback(
    async (customer_id: string) => {
      location.push(`/assinaturas/editar/${customer_id}`);
    },
    [location],
  );

  const handleViewCustomer = useCallback(
    async (id: string) => {
      location.push(`/clientes/editar/${id}`);
    },
    [location],
  );

  useEffect(() => {
    document.title = 'Clientes';
  }, []);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await api.get('/customers', {
          params: {
            page: currentPage,
          },
        });

        setCustomers(response.data);
        setSearchCustomers(response.data);
      } catch (err) {
        alert('Ops! Algo inesperado ocorreu, tente novamente');
      }
    }

    loadCustomers();
  }, [currentPage]);

  return (
    <Container>
      <Header />

      <Content>
        <div className="headerContent">
          <HeaderContent title="Clientes" />

          <ContainerInput>
            <FiSearch size={20} color="#FFFFFF" />

            <input
              type="text"
              value={searchTerm}
              onChange={event => {
                handleSearch(event.target.value);
              }}
            />
          </ContainerInput>
        </div>

        <Table>
          <table>
            <thead>
              <tr>
                <th>Nome/E-mail</th>
                <th>Grau</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div>
                      <p>{customer.name}</p>
                      <span>{customer.email}</span>
                    </div>
                  </td>

                  <td>
                    <div>
                      <CenterParagraph>
                        <p>{customer.level}</p>
                      </CenterParagraph>
                    </div>
                  </td>

                  <td>
                    <button type="button">
                      <FiDollarSign
                        size={20}
                        onClick={() =>
                          handleEditCustomerSubscription(
                            customer.client_id_payment,
                          )
                        }
                      />
                    </button>

                    <button type="button">
                      <FiEdit
                        size={20}
                        onClick={() => handleViewCustomer(customer.id)}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>

        <Pagination
          totalCountOfRegisters={100}
          currentPage={currentPage}
          onPageChange={page => setCurrentPage(page)}
        />
      </Content>
    </Container>
  );
};

export { Customers };
