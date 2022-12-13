import { Button } from './styles';

interface IPaginationItemProps {
  isCurrent?: boolean;
  number: number;
  onPageChange: (page: number) => void;
}

const PaginationItem = ({
  isCurrent,
  number,
  onPageChange,
}: IPaginationItemProps) => {
  if (isCurrent) {
    return (
      <Button type="button" disabled>
        {number}
      </Button>
    );
  }

  return (
    <Button type="button" onClick={() => onPageChange(number)}>
      {number}
    </Button>
  );
};

export { PaginationItem };
