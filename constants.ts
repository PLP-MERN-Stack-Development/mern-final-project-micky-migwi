import { User, Post, Comment, Notification } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'alex_dev',
    email: 'alex@example.com',
    avatar: 'https://picsum.photos/id/1011/200/200',
    bio: 'Full Stack Developer | Coffee Enthusiast ☕️',
    followers: ['u2', 'u3'],
    following: ['u2'],
  },
  {
    id: 'u2',
    username: 'sarah_design',
    email: 'sarah@example.com',
    avatar: 'https://picsum.photos/id/1027/200/200',
    bio: 'UX/UI Designer. Making the web beautiful.',
    followers: ['u1'],
    following: ['u1', 'u3'],
  },
  {
    id: 'u3',
    username: 'tech_guru',
    email: 'guru@example.com',
    avatar: 'https://picsum.photos/id/1005/200/200',
    bio: 'Reviewing the latest gadgets.',
    followers: ['u2'],
    following: [],
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    text: 'Just deployed my new MERN stack application! 🚀 It feels great to see it live. #coding #webdev',
    likes: ['u2', 'u3'],
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'p2',
    userId: 'u2',
    text: 'Working on a new design system. Dark mode is tricky but rewarding! 🎨',
    image: 'https://picsum.photos/id/0/800/400',
    likes: ['u1'],
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 'p3',
    userId: 'u3',
    text: 'The new Gemini 2.5 Flash model is incredibly fast. Game changer for AI apps.',
    likes: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    userId: 'u2',
    text: 'Congrats Alex! Looks amazing.',
    createdAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: 'c2',
    postId: 'p2',
    userId: 'u1',
    text: 'Can’t wait to see it!',
    createdAt: new Date(Date.now() - 7000000).toISOString(),
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'like',
    sourceUserId: 'u2',
    postId: 'p1',
    read: false,
    createdAt: new Date(Date.now() - 1000000).toISOString(),
  }
];
