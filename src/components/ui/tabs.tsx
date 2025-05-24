// filepath: d:\TI\Aplicativos\front end\motoboy\src\components\ui\tabs.tsx
import React, { useState } from "react";

export const Tabs: React.FC<{ defaultValue: string; className?: string; children?: React.ReactNode }> = ({
  defaultValue,
  className,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`tabs ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<{ activeTab?: string; setActiveTab?: (value: string) => void }>, { activeTab, setActiveTab })
        : child
      )}
    </div>
  );
};

export const TabsList: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>;
};

export const TabsTrigger: React.FC<{
  value: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ value, activeTab, setActiveTab, className, children }) => {
  const isActive = activeTab === value;

  return (
    <button
      className={`tabs-trigger ${isActive ? "active" : ""} ${className}`}
      onClick={() => setActiveTab && setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  activeTab?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ value, activeTab, className, children }) => {
  return activeTab === value ? (
    <div className={`tabs-content ${className}`}>{children}</div>
  ) : null;
};