import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { FiArrowLeft } from 'react-icons/fi';

import { Container, BoxHeader } from './styles';

interface IHeaderContentProps {
  title: string;
}

const HeaderContent: React.FC<IHeaderContentProps> = ({ title }) => {
  const history = useHistory();

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <BoxHeader>
        <button type="button" onClick={handleGoBack}>
          <h1>
            <FiArrowLeft /> {title}
          </h1>
        </button>
      </BoxHeader>
    </Container>
  );
};

export { HeaderContent };
