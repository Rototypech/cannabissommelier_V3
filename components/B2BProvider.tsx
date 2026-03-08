'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface B2BContextType {
    isB2B: boolean;
    dealerToken: string | null;
    setDealerToken: (token: string | null) => void;
    isLoading: boolean;
}

const B2BContext = createContext<B2BContextType | undefined>(undefined);

export function B2BProvider({ children }: { children: React.ReactNode }) {
    const [isB2B, setIsB2B] = useState(false);
    const [dealerToken, setDealerToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for dealer token in cookies or localStorage
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('dealer_token='))
            ?.split('=')[1];

        if (token) {
            setDealerToken(token);
            setIsB2B(true);
        }
        setIsLoading(false);
    }, []);

    const value = {
        isB2B,
        dealerToken,
        setDealerToken: (token: string | null) => {
            setDealerToken(token);
            setIsB2B(!!token);
            if (token) {
                document.cookie = `dealer_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            } else {
                document.cookie = 'dealer_token=; path=/; max-age=0; SameSite=Lax';
            }
        },
        isLoading,
    };

    return <B2BContext.Provider value={value}>{children}</B2BContext.Provider>;
}

export function useB2B() {
    const context = useContext(B2BContext);
    if (context === undefined) {
        throw new Error('useB2B must be used within a B2BProvider');
    }
    return context;
}
