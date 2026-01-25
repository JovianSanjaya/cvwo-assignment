import React from 'react';
import { Avatar as MUIAvatar } from '@mui/material';

interface AvatarProps {
    username: string;
    size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ username, size = 32 }) => {
   const colors = [
    '#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA', '#93C5FD',
    '#10B981', '#059669', '#047857', '#34D399', '#6EE7B7',
    '#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FCD34D',
    '#EF4444', '#DC2626', '#B91C1C', '#F87171', '#FCA5A5',
    '#8B5CF6', '#7C3AED', '#6D28D9', '#A78BFA', '#C4B5FD',
    '#EC4899', '#DB2777', '#BE185D', '#F472B6', '#F9A8D4',
    '#06B6D4', '#0891B2', '#0E7490', '#22D3EE', '#67E8F9',
    '#F97316', '#EA580C', '#C2410C', '#FB923C', '#FDBA74',
    '#22C55E', '#16A34A', '#15803D', '#4ADE80', '#86EFAC'
];


    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];
    return (
        <MUIAvatar
            sx={{
                width: size,
                height: size,
                bgcolor: color,
                fontSize: size * 0.45,
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            {username ? username.charAt(0).toUpperCase() : '?'}
        </MUIAvatar>
    );
};

export default Avatar;
