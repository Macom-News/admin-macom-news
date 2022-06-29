import { useCallback, useRef, useState } from 'react';

import * as Yup from 'yup';

import Select from 'react-select';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { FiUser, FiLock } from 'react-icons/fi';

import { getValidationErrors } from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Title,
  Content,
  SelectContent,
  configSelectStyles,
} from './styles';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

interface IFormDataSubmit {
  email: string;
  password: string;
}

interface IOptionSchema {
  value: string;
  label: string;
}

const options: IOptionSchema[] = [
  { value: '', label: 'Selecione o tipo do perfil' },
  { value: 'user', label: 'Usuário' },
  { value: 'writer', label: 'Colunista' },
];

const schema = Yup.object().shape({
  email: Yup.string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  password: Yup.string().required('Senha obrigatória'),
});

const SignIn = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [isErrorSelect, setIsErrorSelect] = useState(false);

  const handleInputChange = useCallback(data => {
    const option = data as IOptionSchema;

    if (option.value !== '') {
      setIsErrorSelect(false);
    }

    setType(option.value);
  }, []);

  const handleFormSubmit = useCallback(
    async ({ email, password }: IFormDataSubmit) => {
      setLoading(true);

      try {
        formRef.current?.setErrors({});

        await schema.validate({ email, password }, { abortEarly: false });

        if (type === '') {
          setIsErrorSelect(true);
          setLoading(false);
          return;
        }

        if (type === 'user') {
          await signIn({ email, password, type: 'user' });
        } else if (type === 'writer') {
          await signIn({ email, password, type: 'writer' });
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [signIn, type],
  );

  return (
    <Container>
      <Title>Maçom News</Title>

      <Content>
        <Form ref={formRef} onSubmit={handleFormSubmit}>
          <Input name="email" icon={FiUser} placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <SelectContent isErrored={isErrorSelect}>
            <Select
              options={options}
              defaultValue={options[0]}
              styles={configSelectStyles}
              isSearchable={false}
              onChange={data => handleInputChange(data)}
            />
          </SelectContent>

          <Button loading={loading} type="submit">
            Entrar
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export { SignIn };
