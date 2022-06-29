import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  useCallback,
} from 'react';

import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import { Container } from './styles';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  { name, containerStyle = {}, icon: Icon, ...rest },
  ref,
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { registerField, fieldName, defaultValue, error } = useField(name);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [registerField, fieldName]);

  return (
    <Container
      isErrored={!!error}
      isFilled={isFilled}
      // isFocused={isFocused || !!inputRef.current?.value} // para ficar em foco se tiver valor preenchido
      isFocused={isFocused}
      style={containerStyle}
    >
      {Icon && (
        <Icon
          size={20}
          color={inputRef.current?.value || isFocused ? '#ff9000' : '#a8a8b3'}
        />
      )}

      <input
        type="text"
        ref={inputRef}
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
    </Container>
  );
};

export const Input = forwardRef(InputBase);
