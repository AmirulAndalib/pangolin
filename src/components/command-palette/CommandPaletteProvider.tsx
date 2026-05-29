"use client";

import type { SidebarNavSection } from "@app/app/navigation";
import { ListUserOrgsResponse } from "@server/routers/org";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CommandPaletteContextProvider,
    type CommandPaletteContextValue
} from "./commandPaletteContext";
import { CommandPalette } from "./CommandPalette";

type CommandPaletteProviderProps = {
    children: React.ReactNode;
    orgId?: string;
    orgs?: ListUserOrgsResponse["orgs"];
    navItems: SidebarNavSection[];
};

function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tagName = target.tagName;
    return (
        tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT"
    );
}

export function CommandPaletteProvider({
    children,
    orgId,
    orgs,
    navItems
}: CommandPaletteProviderProps) {
    const [open, setOpen] = useState(false);

    const toggle = useCallback(() => {
        setOpen((current) => !current);
    }, []);

    const contextValue = useMemo<CommandPaletteContextValue>(
        () => ({
            open,
            setOpen,
            toggle
        }),
        [open, toggle]
    );

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (
                event.key.toLowerCase() !== "k" ||
                !(event.metaKey || event.ctrlKey)
            ) {
                return;
            }

            if (!open && isEditableTarget(event.target)) {
                return;
            }

            event.preventDefault();
            toggle();
        }

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, toggle]);

    return (
        <CommandPaletteContextProvider value={contextValue}>
            {children}
            <CommandPalette orgId={orgId} orgs={orgs} navItems={navItems} />
        </CommandPaletteContextProvider>
    );
}
