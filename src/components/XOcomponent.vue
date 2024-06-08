<template>
  <div class="tic-tac-toe">
    <div class="board">
      <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          @click="makeMove(index)"
      >
        {{ cell }}
      </div>
    </div>
    <button @click="resetGame">Reset</button>
  </div>
</template>

<script>
import axios from 'axios';
import { reactive, toRefs } from 'vue';

export default {
  name: 'TicTacToe',
  setup() {
    const state = reactive({
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'O',
      winner: null,
    });

    const makeMove = async (index) => {
      if (state.board[index] !== '' || state.winner) {
        return;
      }

      state.board[index] = state.currentPlayer;
      state.currentPlayer = state.currentPlayer === 'O' ? 'X' : 'O';

      if (state.currentPlayer === 'X') {
        try {
          const response = await axios.post('http://localhost:3000/api/move', {
            board: state.board,
          });
          state.board[response.data.move] = 'X';
          state.currentPlayer = 'O';
          checkWinner();
        } catch (error) {
          console.error('Error making move:', error);
        }
      } else {
        checkWinner();
      }
    };

    const checkWinner = () => {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
          state.winner = state.board[a];
          alert(`Player ${state.winner} wins!`);
          return;
        }
      }

      if (!state.board.includes('')) {
        state.winner = 'tie';
        alert("It's a tie!");
      }
    };

    const resetGame = () => {
      state.board = ['', '', '', '', '', '', '', '', ''];
      state.currentPlayer = 'O';
      state.winner = null;
    };

    return {
      ...toRefs(state),
      makeMove,
      resetGame,
    };
  },
};
</script>

<style>
.tic-tac-toe {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 5px;
}
.cell {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  border: 1px solid #000;
}
</style>
