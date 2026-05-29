"use client";

import React, { createContext, useContext } from "react";

export type CommandPaletteContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
    null
);

export function CommandPaletteContextProvider({
    value,
    children
}: {
    value: CommandPaletteContextValue;
    children: React.ReactNode;
}) {
    return (
        <CommandPaletteContext.Provider value={value}>
            {children}
        </CommandPaletteContext.Provider>
    );
}

export function useCommandPalette() {
    const context = useContext(CommandPaletteContext);
    if (!context) {
        throw new Error(
            "useCommandPalette must be used within CommandPaletteProvider"
        );
    }
    return context;
}
