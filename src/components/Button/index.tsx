import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type IButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<IButtonProps> = ({ loading, children, ...rest }) => (
  <Container type="button" disabled={!!loading} {...rest}>
    {loading ? 'Carregando ...' : children}
  </Container>
);

export { Button };
