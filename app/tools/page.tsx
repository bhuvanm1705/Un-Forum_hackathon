'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileJson, BarChart3, Database, Archive, Layers } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Feed
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Migration & Utility Tools</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Manage your community data, import from other platforms, and analyze growth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* IMPORTERS SECTION */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-blue-500" /> Import Data</CardTitle>
                        <CardDescription>Move your community to Foru.ms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FileJson className="h-8 w-8 text-orange-500" />
                                <div>
                                    <div className="font-medium">Discourse Backup</div>
                                    <div className="text-xs text-muted-foreground">Supports .json, .tar.gz</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Select File</Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Database className="h-8 w-8 text-indigo-500" />
                                <div>
                                    <div className="font-medium">Discord Archive</div>
                                    <div className="text-xs text-muted-foreground">Import channel history</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>Connect Bot</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* ANALYTICS SECTION */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-green-500" /> Community Health</CardTitle>
                        <CardDescription>Live insights from your database</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-400">98%</div>
                                <div className="text-xs text-muted-foreground">Uptime</div>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">+12%</div>
                                <div className="text-xs text-muted-foreground">Weekly Growth</div>
                            </div>
                        </div>
                        <div className="h-32 flex items-end justify-between gap-1 px-2 border-b">
                            {[40, 65, 34, 89, 56, 78, 60].map((h, i) => (
                                <div key={i} className="w-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 transition-all rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h * 12} views
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between text-xs text-muted-foreground">
                        <span>Last updated: Just now</span>
                        <Link href="#" className="hover:underline">View Full Report</Link>
                    </CardFooter>
                </Card>

                {/* ARCHIVE/BATCH TOOLS */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-purple-500" /> Batch Operations</CardTitle>
                        <CardDescription>Power tools for moderators</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2">
                            <Archive className="h-6 w-6" />
                            <span>Archive Old Threads</span>
                        </Button>
                        <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2">
                            <Database className="h-6 w-6" />
                            <span>Export CSV</span>
                        </Button>
                        <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2">
                            <Upload className="h-6 w-6" />
                            <span>Re-index Search</span>
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
