import React, { useState } from 'react';
import { Stack, IconButton, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { colors } from '../theme/colors';
import { apiFetch } from '../services/api';

interface VoteSectionProps {
    type: 'post' | 'comment';
    id: number;
    initialVoteCount: number;
    initialUserVote: number; // 1, -1, or 0
    onVoteChange?: (newCount: number, newUserVote: number) => void;
}

const VoteSection: React.FC<VoteSectionProps> = ({
    type,
    id,
    initialVoteCount,
    initialUserVote,
    onVoteChange
}) => {
    const [voteCount, setVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [loading, setLoading] = useState(false);

    const handleVote = async (voteType: number) => {
        if (loading) return;
        setLoading(true);

        // Calculate new vote type
        // If already voted same way, toggle off (0)
        const finalVoteType = userVote === voteType ? 0 : voteType;

        try {
            const url = type === 'post' ? `/posts/${id}/vote` : `/comments/${id}/vote`;
            const response = await apiFetch(url, {
                method: 'POST',
                body: JSON.stringify({ vote_type: finalVoteType })
            });

            if (response.ok) {
                const data = await response.json();
                setVoteCount(data.vote_count);
                setUserVote(finalVoteType);
                if (onVoteChange) {
                    onVoteChange(data.vote_count, finalVoteType);
                }
            }
        } catch (error) {
            console.error("Voting error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: '#f1f5f9', borderRadius: '20px', px: 0.5, py: 0.25 }}>
            <IconButton
                size="small"
                onClick={(e) => { e.preventDefault(); handleVote(1); }}
                sx={{
                    color: userVote === 1 ? colors.primary : colors.muted,
                    '&:hover': { color: colors.primary, bgcolor: '#eff6ff' }
                }}
            >
                <ArrowUpwardIcon fontSize="small" />
            </IconButton>

            <Typography sx={{
                fontSize: '0.85rem',
                fontWeight: 800,
                minWidth: '20px',
                textAlign: 'center',
                color: userVote === 1 ? colors.primary : (userVote === -1 ? colors.error : colors.text)
            }}>
                {voteCount}
            </Typography>

            <IconButton
                size="small"
                onClick={(e) => { e.preventDefault(); handleVote(-1); }}
                sx={{
                    color: userVote === -1 ? colors.error : colors.muted,
                    '&:hover': { color: colors.error, bgcolor: '#fef2f2' }
                }}
            >
                <ArrowDownwardIcon fontSize="small" />
            </IconButton>
        </Stack>
    );
};

export default VoteSection;
