import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PortfolioValueContextType {
    totalValue: number;
    addToTotalValue: (value: number) => void;
}

const defaultValue: PortfolioValueContextType = {
    totalValue: 0,
    addToTotalValue: () => {},
};

// Export the context so it can be used in other components
export const PortfolioValueContext = createContext<PortfolioValueContextType>(defaultValue);

interface PortfolioValueProviderProps {
    children: ReactNode;
}

export const PortfolioValueProvider: React.FC<PortfolioValueProviderProps> = ({ children }) => {
    const [totalValue, setTotalValue] = useState<number>(0);

    const addToTotalValue = (value: number) => {
        setTotalValue((prevValue) => prevValue + value);
    };

    return (
        <PortfolioValueContext.Provider value={{ totalValue, addToTotalValue }}>
            {children}
        </PortfolioValueContext.Provider>
    );
};

export const usePortfolioValue = (): PortfolioValueContextType => {
    const context = useContext(PortfolioValueContext);
    if (context === undefined) {
        throw new Error('usePortfolioValue must be used within a PortfolioValueProvider');
    }
    return context;
};