import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // Adiciona suporte ao onClick
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 ${className}`}
      onClick={onClick} // Passa o onClick para o elemento div
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mb-4 border-b pb-2">{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
};