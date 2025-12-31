export interface User {
    id: string;
    name: string;
    avatar: string; // URL to avatar image
    role: 'admin' | 'moderator' | 'user';
    joinedAt: string; // ISO date
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    threadCount: number;
}

export interface Thread {
    id: string;
    title: string;
    content: string; // Markdown or plain text preview
    authorId: string;
    author: User;
    categoryId: string;
    category: Category;
    createdAt: string; // ISO date
    updatedAt: string;
    replyCount: number;
    viewCount: number;
    likes: number;
    isPinned?: boolean;
    tags: string[];
}

export interface Post {
    id: string;
    threadId: string;
    content: string; // Markdown
    authorId: string;
    author: User;
    createdAt: string;
    likes: number;
    replyToId?: string; // For nested replies
}
