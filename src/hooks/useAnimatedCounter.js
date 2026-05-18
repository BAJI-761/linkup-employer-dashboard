import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useAnimatedCounter(endValue, duration = 2, trigger = true) {
  const ref = useRef(null);
  const counterRef = useRef({ value: 0 });

  useEffect(() => {
    if (!trigger || !ref.current) return;
    counterRef.current.value = 0;

    gsap.to(counterRef.current, {
      value: endValue,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(counterRef.current.value).toLocaleString();
        }
      },
    });
  }, [endValue, duration, trigger]);

  return ref;
}
