import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MorphSwitchProps<T extends string> = {
  value: T;
  render: (value: T) => ReactNode;
  duration?: number;
  className?: string;
};

type SmartRect = {
  rect: DOMRect;
};

type PendingMorph = {
  shellHeight: number;
  smartRects: Map<string, SmartRect>;
};

const QUICK_SPRING = [
  { offset: 0, progress: 0 },
  { offset: 0.18, progress: 0.52 },
  { offset: 0.36, progress: 0.88 },
  { offset: 0.52, progress: 1.035 },
  { offset: 0.68, progress: 0.985 },
  { offset: 0.82, progress: 1.008 },
  { offset: 0.92, progress: 0.997 },
  { offset: 1, progress: 1 },
] as const;

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function getSmartRects(root: HTMLElement): Map<string, SmartRect> {
  const result = new Map<string, SmartRect>();

  for (const element of root.querySelectorAll<HTMLElement>(
    "[data-smart-animate]",
  )) {
    const key = element.dataset.smartAnimate;

    if (!key || result.has(key)) {
      continue;
    }

    result.set(key, { rect: element.getBoundingClientRect() });
  }

  return result;
}

export function MorphSwitch<T extends string>({
  value,
  render,
  duration = 600,
  className = "",
}: MorphSwitchProps<T>) {
  const [displayedValue, setDisplayedValue] = useState<T>(value);

  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pendingMorphRef = useRef<PendingMorph | null>(null);
  const shellAnimationRef = useRef<Animation | null>(null);
  const smartAnimationsRef = useRef<Animation[]>([]);
  const generationRef = useRef(0);

  const cancelAnimations = () => {
    shellAnimationRef.current?.cancel();
    shellAnimationRef.current = null;

    for (const animation of smartAnimationsRef.current) {
      animation.cancel();
    }

    smartAnimationsRef.current = [];
  };

  useLayoutEffect(() => {
    if (value === displayedValue) {
      return;
    }

    const shell = shellRef.current;
    const content = contentRef.current;

    if (!shell || !content) {
      setDisplayedValue(value);
      return;
    }




    pendingMorphRef.current = {
      shellHeight: shell.getBoundingClientRect().height,
      smartRects: getSmartRects(content),
    };

    cancelAnimations();
    shell.style.height = `${pendingMorphRef.current.shellHeight}px`;
    shell.style.overflow = "hidden";
    setDisplayedValue(value);
  }, [displayedValue, value]);

  useLayoutEffect(() => {
    const pending = pendingMorphRef.current;
    const shell = shellRef.current;
    const content = contentRef.current;

    if (!pending || !shell || !content || displayedValue !== value) {
      return;
    }

    pendingMorphRef.current = null;
    const generation = ++generationRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    shell.style.height = "auto";
    const targetShellHeight = content.getBoundingClientRect().height;
    shell.style.height = `${targetShellHeight}px`;
    shell.style.overflow = "hidden";

    if (reduceMotion) {
      shell.style.height = "auto";
      shell.style.overflow = "visible";
      return;
    }

    const shellFrames = QUICK_SPRING.map(({ offset, progress }) => ({
      height: `${lerp(pending.shellHeight, targetShellHeight, progress)}px`,
      offset,
    }));

    const shellAnimation = shell.animate(shellFrames, {
      duration,
      easing: "linear",
      fill: "none",
    });
    shellAnimationRef.current = shellAnimation;

    const nextSmartElements = new Map<string, HTMLElement>();
    const codeWindowTargetHeights = new Map<HTMLElement, number>();
    for (const element of content.querySelectorAll<HTMLElement>(
      "[data-smart-animate]",
    )) {
      const key = element.dataset.smartAnimate;
      if (key && !nextSmartElements.has(key)) {
        nextSmartElements.set(key, element);
      }
    }

    for (const [key, previous] of pending.smartRects) {
      const element = nextSmartElements.get(key);

      if (!element) {
        continue;
      }

      const nextRect = element.getBoundingClientRect();

      if (key === "code-window") {
        const fromHeight = previous.rect.height;
        const toHeight = nextRect.height;
        codeWindowTargetHeights.set(element, toHeight);

        if (Math.abs(fromHeight - toHeight) > 0.5) {
          element.style.height = `${toHeight}px`;
          element.style.overflow = "hidden";

          const animation = element.animate(
            QUICK_SPRING.map(({ offset, progress }) => ({
              height: `${lerp(fromHeight, toHeight, progress)}px`,
              offset,
            })),
            {
              duration,
              easing: "linear",
              fill: "none",
            },
          );

          smartAnimationsRef.current.push(animation);

          animation.finished
            .then(() => {
              if (generationRef.current !== generation) {
                return;
              }
              element.style.height = "";
              element.style.overflow = "";
            })
            .catch(() => undefined);
        }

        continue;
      }

      const dx = previous.rect.left - nextRect.left;
      const dy = previous.rect.top - nextRect.top;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        continue;
      }

      const animation = element.animate(
        QUICK_SPRING.map(({ offset, progress }) => ({
          transform: `translate3d(${dx * (1 - progress)}px, ${dy * (1 - progress)}px, 0)`,
          offset,
        })),
        {
          duration,
          easing: "linear",
          fill: "none",
        },
      );

      smartAnimationsRef.current.push(animation);
    }

    let isReleased = false;

    const releaseNaturalLayout = () => {
      if (isReleased || generationRef.current !== generation) {
        return;
      }

      isReleased = true;
      shellAnimationRef.current?.cancel();
      shellAnimationRef.current = null;

      for (const animation of smartAnimationsRef.current) {
        animation.cancel();
      }
      smartAnimationsRef.current = [];

      shell.style.height = "auto";
      shell.style.overflow = "visible";

      for (const element of content.querySelectorAll<HTMLElement>(
        '[data-smart-animate="code-window"]',
      )) {
        element.style.height = "";
        element.style.overflow = "";
      }
    };

    const mutationObserver = new MutationObserver(() => {
      const hasOverflowingCodeWindow = Array.from(
        codeWindowTargetHeights.entries(),
      ).some(
        ([element, targetHeight]) => element.scrollHeight > targetHeight + 1,
      );

      if (!hasOverflowingCodeWindow) {
        return;
      }

      releaseNaturalLayout();
      mutationObserver.disconnect();
    });

    mutationObserver.observe(content, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    shellAnimation.finished
      .then(() => {
        mutationObserver.disconnect();
        releaseNaturalLayout();
      })
      .catch(() => undefined);

    return () => {
      mutationObserver.disconnect();
    };
  }, [displayedValue, duration, value]);

  useLayoutEffect(
    () => () => {
      cancelAnimations();
    },
    [],
  );

  return (
    <div
      ref={shellRef}
      className={`morph-switch-shell rounded-3xl ${className}`}
    >
      <div ref={contentRef}>{render(displayedValue)}</div>
    </div>
  );
}
