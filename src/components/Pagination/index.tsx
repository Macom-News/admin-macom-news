import { useMemo, useCallback } from 'react';

import { PaginationItem } from './PaginationItem';

import {
  Container,
  TotalItensPerPageAndTotalItens,
  BoxPageNumerations,
  Text,
} from './styles';

interface IPaginationProps {
  totalCountOfRegisters: number;
  currentPage?: number; // por padrão vai ser 1
  registersPerPage?: number; // por padrão vai ser 10
  onPageChange: (page: number) => void;
}

const siblingsCount = 1;

const Pagination = ({
  totalCountOfRegisters,
  currentPage = 1,
  registersPerPage = 10,
  onPageChange,
}: IPaginationProps) => {
  const lastPage = useMemo(() => {
    // vai arredondar sempre para cima
    return Math.ceil(totalCountOfRegisters / registersPerPage);
  }, [registersPerPage, totalCountOfRegisters]);

  const itemFirstPosition = useMemo(() => {
    if (currentPage === 1) {
      return 1;
    }

    return currentPage * registersPerPage - registersPerPage + 1;
  }, [currentPage, registersPerPage]);

  const itemLastPosition = useMemo(() => {
    return currentPage * registersPerPage;
  }, [currentPage, registersPerPage]);

  const generatePagesArray = useCallback((from: number, to: number) => {
    return [...new Array(to - from)]
      .map((_, index) => {
        return from + index + 1;
      })
      .filter(page => page > 0);
  }, []);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage),
        )
      : [];

  return (
    <Container>
      <TotalItensPerPageAndTotalItens>
        <strong>{itemFirstPosition}</strong> -{' '}
        <strong>{itemLastPosition}</strong> de{' '}
        <strong>{totalCountOfRegisters}</strong>
      </TotalItensPerPageAndTotalItens>

      <BoxPageNumerations>
        {/* mostrar a primeira página */}
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem number={1} onPageChange={onPageChange} />

            {currentPage > 2 + siblingsCount && <Text>...</Text>}
          </>
        )}

        {/* páginas anteriores */}
        {previousPages.length > 0 &&
          previousPages.map(page => {
            return (
              <PaginationItem
                key={page}
                number={page}
                onPageChange={onPageChange}
              />
            );
          })}

        <PaginationItem
          isCurrent
          number={currentPage}
          onPageChange={onPageChange}
        />

        {/* próximas páginas */}
        {nextPages.length > 0 &&
          nextPages.map(page => {
            return (
              <PaginationItem
                key={page}
                number={page}
                onPageChange={onPageChange}
              />
            );
          })}

        {/* mostrar a última página */}
        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && <Text>...</Text>}

            <PaginationItem number={lastPage} onPageChange={onPageChange} />
          </>
        )}
      </BoxPageNumerations>
    </Container>
  );
};

export { Pagination };
