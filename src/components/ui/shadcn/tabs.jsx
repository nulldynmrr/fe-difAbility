"use client";

import { createContext, useContext, useState } from "react";
import clsx from "clsx";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "flex gap-2 border-b border-border pb-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={clsx(
        "px-4 py-2 text-sm rounded-md transition",
        active
          ? "bg-primary-300 text-white"
          : "bg-transparent text-muted-foreground hover:bg-primary-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");

  if (ctx.value !== value) return null;

  return <div className={className}>{children}</div>;
}
