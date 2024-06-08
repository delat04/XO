import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Minimax Algorithm Implementation
const minimax = (board, depth, isMaximizing) => {
    const scores = {
        'X': 1,
        'O': -1,
        'tie': 0
    };

    const winner = checkWinner(board);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const checkWinner = (board) => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes('') ? null : 'tie';
};

app.use(cors());
app.use(express.json());

app.post('/api/move', (req, res) => {
    const board = req.body.board;
    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    res.send({ move: bestMove });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
