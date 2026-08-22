import {
  type KeyboardEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type TabsSliderItem<T extends string> = {
  value: T;
  label: string;
};

type TabsSliderProps<T extends string> = {
  items: readonly TabsSliderItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

type IndicatorStyle = {
  width: number;
  x: number;
};

const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

export function TabsSlider<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  className = "",
}: TabsSliderProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const softLayerRef = useRef<HTMLDivElement>(null);
  const indicatorAnimationRef = useRef<Animation | null>(null);
  const softLayerAnimationRef = useRef<Animation | null>(null);
  const tabRefs = useRef(new Map<T, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<IndicatorStyle | null>(null);

  const getActiveIndicator = useCallback((): IndicatorStyle | null => {
    const container = containerRef.current;
    const activeTab = tabRefs.current.get(value);

    if (!container || !activeTab) {
      return null;
    }

    return {
      width: activeTab.offsetWidth,
      x: activeTab.offsetLeft,
    };
  }, [value]);

  const syncIndicator = useCallback(() => {
    const nextIndicator = getActiveIndicator();

    if (!nextIndicator) {
      return;
    }

    setIndicator((current) => {
      if (
        current &&
        current.width === nextIndicator.width &&
        current.x === nextIndicator.x
      ) {
        return current;
      }

      return nextIndicator;
    });
  }, [getActiveIndicator]);

  useLayoutEffect(() => {
    const nextIndicator = getActiveIndicator();

    if (!nextIndicator) {
      return;
    }

    const container = containerRef.current;
    const indicatorElement = indicatorRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!indicatorElement || !container || !indicator) {
      setIndicator(nextIndicator);
    } else if (
      indicator.x !== nextIndicator.x ||
      indicator.width !== nextIndicator.width
    ) {


      const containerRect = container.getBoundingClientRect();
      const currentRect = indicatorElement.getBoundingClientRect();
      const from = {
        x: currentRect.left - containerRect.left,
        width: currentRect.width,
      };

      indicatorAnimationRef.current?.cancel();
      setIndicator(nextIndicator);

      if (!reduceMotion) {
        const startLeft = from.x;
        const startRight = from.x + from.width;
        const targetLeft = nextIndicator.x;
        const targetRight = nextIndicator.x + nextIndicator.width;
        const direction = targetLeft >= startLeft ? 1 : -1;




        const springFrames = [
          { offset: 0, leading: 0, trailing: 0 },
          { offset: 0.16, leading: 0.46, trailing: 0.46 },
          { offset: 0.32, leading: 0.76, trailing: 0.76 },
          { offset: 0.48, leading: 0.91, trailing: 0.91 },
          { offset: 0.64, leading: 0.975, trailing: 0.975 },
          { offset: 0.76, leading: 0.995, trailing: 0.995 },
          { offset: 0.86, leading: 1, trailing: 1 },
          { offset: 1, leading: 1, trailing: 1 },
        ] as const;

        const edgeAt = (fromEdge: number, toEdge: number, progress: number) =>
          lerp(fromEdge, toEdge, progress);

        const geometryFrames = springFrames.map((frame) => {
          const leftProgress = direction > 0 ? frame.trailing : frame.leading;
          const rightProgress = direction > 0 ? frame.leading : frame.trailing;
          const left = edgeAt(startLeft, targetLeft, leftProgress);
          const right = edgeAt(startRight, targetRight, rightProgress);

          return {
            transform: `translate3d(${left}px, 0, 0)`,
            width: `${Math.max(1, right - left)}px`,
            offset: frame.offset,
          };
        });

        indicatorAnimationRef.current = indicatorElement.animate(
          geometryFrames,
          {
            duration: 500,
            easing: "linear",
          },
        );

        const softLayer = softLayerRef.current;

        if (softLayer) {
          softLayerAnimationRef.current?.cancel();

          softLayer.style.transformOrigin = "center center";
          softLayerAnimationRef.current = softLayer.animate(
            [
              {
                transform: "scaleX(1) scaleY(1)",
                offset: 0,
              },
              {
                transform: "scaleX(1) scaleY(1)",
                offset: 0.72,
              },
              {
                transform: "scaleX(0.965) scaleY(1.018)",
                offset: 0.86,
              },
              {
                transform: "scaleX(0.985) scaleY(1.008)",
                offset: 0.93,
              },
              {
                transform: "scaleX(1) scaleY(1)",
                offset: 1,
              },
            ],
            {
              duration: 500,
              easing: "linear",
            },
          );
        }
      }
    }

    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(syncIndicator);
    observer.observe(container);

    for (const tab of tabRefs.current.values()) {
      observer.observe(tab);
    }

    return () => observer.disconnect();
  }, [getActiveIndicator, syncIndicator, value]);

  useLayoutEffect(
    () => () => {
      indicatorAnimationRef.current?.cancel();
      softLayerAnimationRef.current?.cancel();
    },
    [],
  );

  const selectItem = (nextIndex: number) => {
    const nextItem = items[nextIndex];

    if (!nextItem || nextItem.value === value) {
      return;
    }

    onChange(nextItem.value);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % items.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextItem = items[nextIndex];
    selectItem(nextIndex);
    tabRefs.current.get(nextItem.value)?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`slider-gradient-border scrollbar-none relative isolate inline-flex max-w-full w-fit items-center gap-1 overflow-x-auto rounded-full bg-slider p-1 sm:gap-2 ${className}`}
    >
      {indicator && (
        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1 bottom-1 left-0 z-0 overflow-hidden rounded-full will-change-transform"
          style={{
            width: indicator.width,
            transform: `translate3d(${indicator.x}px, 0, 0)`,
          }}
        >
          <div
            ref={softLayerRef}
            className="slider-gradient-border absolute inset-0 rounded-[inherit] bg-slider-tab backdrop-glass will-change-transform"
          />
        </div>
      )}

      {items.map((item, index) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            ref={(node) => {
              if (node) {
                tabRefs.current.set(item.value, node);
              } else {
                tabRefs.current.delete(item.value);
              }
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => selectItem(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-4 py-3 text-content outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-content/20 sm:px-6 sm:py-4 ${isActive ? "text-body-accent" : "text-body"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
