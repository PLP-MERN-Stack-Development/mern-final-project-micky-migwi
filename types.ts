export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  followers: string[];
  following: string[];
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  image?: string;
  video?: string;
  likes: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // The recipient
  type: 'like' | 'comment' | 'follow';
  sourceUserId: string; // The actor
  postId?: string;
  read: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    sources?: Array<{
        title: string;
        uri: string;
    }>;
    timestamp: Date;
}