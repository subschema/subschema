import { useEffect, useRef, ReactNode } from 'react';

/**
 * Wrapper that captures form values by intercepting input events on the form.
 * Since FormStateContext is not publicly exported, we use a controlled approach:
 * we observe form input changes via event delegation and build values from DOM state.
 *
 * Actually, a simpler approach: we render a FormValuesReader inside the Form as a child,
 * but that requires access to the context. Instead, we'll use a MutationObserver + input
 * event listener approach to extract values from the rendered form inputs.
 */
export function FormValuesWrapper({
  children,
  onValuesChange,
}: {
  children: ReactNode;
  onValuesChange: (values: Record<string, unknown>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function collectValues() {
      if (!el) return;
      const values: Record<string, unknown> = {};
      // Collect from all inputs, textareas, selects
      const inputs = el.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        const inputEl = input as HTMLInputElement;
        const name = inputEl.name || inputEl.id || inputEl.getAttribute('data-name');
        if (!name) return;
        if (inputEl.type === 'checkbox') {
          values[name] = inputEl.checked;
        } else {
          values[name] = inputEl.value;
        }
      });

      // Check for checkboxes groups (data attributes)
      const prev = JSON.stringify(valuesRef.current);
      const next = JSON.stringify(values);
      if (prev !== next) {
        valuesRef.current = values;
        onValuesChange(values);
      }
    }

    // Listen for input events (covers typing, selection changes etc.)
    const handler = () => {
      // Small delay to let React state settle
      requestAnimationFrame(collectValues);
    };

    el.addEventListener('input', handler, true);
    el.addEventListener('change', handler, true);
    el.addEventListener('click', handler, true);

    // Initial collection
    const timer = setTimeout(collectValues, 100);

    // Also observe DOM changes for conditional fields
    const observer = new MutationObserver(handler);
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      el.removeEventListener('input', handler, true);
      el.removeEventListener('change', handler, true);
      el.removeEventListener('click', handler, true);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [onValuesChange]);

  return <div ref={ref}>{children}</div>;
}

