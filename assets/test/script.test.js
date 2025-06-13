/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

let SimonGame, newGame, nextRound, playerTurnMoves;

beforeAll(() => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8');
  document.open();
  document.write(html);
  document.close();

  jest.isolateModules(() => {
    const script = require('../js/script.js');
    SimonGame = script.SimonGame;
    newGame = script.newGame;
    nextRound = script.nextRound;
    playerTurnMoves = script.playerTurnMoves;
  });

  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

beforeEach(() => {
  jest.useFakeTimers();
  SimonGame.gameMoves = [];
  SimonGame.playerMoves = [];
  SimonGame.playerTurn = false;
  SimonGame.gameScore = 0;
  document.getElementById('score').textContent = '0';
});

afterEach(() => {
  jest.useRealTimers();
});

describe('pre-game', () => {
  test('clicking buttons before newGame does nothing', () => {
    document.getElementById('button2').click();
    expect(SimonGame.playerMoves).toEqual([]);
  });
});

describe('game object contains correct keys', () => {
  test('all expected keys exist', () => {
    ['gameMoves', 'playerMoves', 'playerTurn', 'gameScore', 'flashSpeed', 'turnDelay', 'buttons'].forEach((key) => {
      expect(key in SimonGame).toBe(true);
    });
  });
  test('buttons map has four entries', () => {
    expect(Object.keys(SimonGame.buttons)).toEqual(['1', '2', '3', '4']);
  });
});

describe('newGame works correctly', () => {
  beforeAll(() => {
    SimonGame.gameMoves = [1, 2, 3];
    SimonGame.playerMoves = [2];
    SimonGame.playerTurn = true;
    SimonGame.gameScore = 5;
    document.getElementById('score').textContent = '5';
    newGame();
  });

  test('resets moves and turn', () => {
    expect(SimonGame.gameMoves).toEqual([expect.any(Number)]);
    expect(SimonGame.playerMoves).toEqual([]);
    expect(SimonGame.playerTurn).toBe(false);
  });

  test('resets score internally and in UI', () => {
    expect(SimonGame.gameScore).toBe(0);
    expect(document.getElementById('score').textContent).toBe('0');
  });
});

describe('gameplay works correctly', () => {
  beforeEach(() => {
    nextRound();
  });

  test('nextRound adds one move', () => {
    expect(SimonGame.gameMoves.length).toBe(1);
  });

  test('playerTurn false during sequence', () => {
    expect(SimonGame.playerTurn).toBe(false);
    document.getElementById('button' + SimonGame.gameMoves[0]).click();
    expect(SimonGame.playerMoves).toEqual([]);
  });

  test('playerTurn true after delay', () => {
    const total = SimonGame.flashSpeed * SimonGame.gameMoves.length + SimonGame.turnDelay;
    jest.advanceTimersByTime(total);
    expect(SimonGame.playerTurn).toBe(true);
  });

  test('playerTurnMoves records correct move and increments score', () => {
    jest.advanceTimersByTime(SimonGame.flashSpeed * 1 + SimonGame.turnDelay);
    expect(SimonGame.playerTurn).toBe(true);
    const move = SimonGame.gameMoves[0];
    playerTurnMoves(move);
    expect(SimonGame.playerMoves).toEqual([move]);
    expect(SimonGame.gameScore).toBe(1);
  });

  test('playerTurnMoves resets on wrong move', () => {
    jest.advanceTimersByTime(SimonGame.flashSpeed * 1 + SimonGame.turnDelay);
    expect(SimonGame.playerTurn).toBe(true);
    const spy = jest.spyOn(global, 'newGame');
    playerTurnMoves((SimonGame.gameMoves[0] % 4) + 1);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
