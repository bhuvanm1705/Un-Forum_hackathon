'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Mobile Header Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 z-40 flex items-center px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="-ml-2 mr-2"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                </Button>
                <Link href="/" className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
                    Foru.ms
                </Link>
            </div>

            {/* Main Drawer Overlay & Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        {/* Slide-out Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-white dark:bg-zinc-950 shadow-xl"
                        >
                            {/* Reuse Sidebar with specific overrides:
                                 1. static position (absolute within motion div)
                                 2. passing onLinkClick to close menu
                             */}
                            <Sidebar
                                onLinkClick={() => setIsOpen(false)}
                                className="static w-full h-full border-r-0"
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
