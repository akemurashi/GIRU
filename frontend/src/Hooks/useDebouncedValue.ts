import { useEffect, useState } from "react";

/**
 * Devuelve `value` con retraso: solo se actualiza cuando pasan `delay` ms
 * sin que cambie. Sirve para no disparar una petición por cada tecla.
 */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebouncedValue;
