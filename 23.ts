// TS playground link: https://tsplay.dev/advent-of-typescript-2023-23

// Connect 4, but in TypeScript types
// Your goal for this challenge is to implement Connect 4 in TypeScript types.
// Each cell in the game can contain 🔴 or 🟡 or be empty ( ). You're provided with a rough layout of how to organize the board in the EmptyBoard type. The game state is represented by an object with a board property and a state property (which keeps track of which player is next up to play).
// What is Connect 4
// In case you haven't played it before: Connect 4 is a game in which the players choose a color and then take turns dropping colored tokens into a six-row, seven-column vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own tokens.
//     fun fact: Connect 4 is also known as Connect Four, Four Up, Plot Four, Find Four, Captain's Mistress, Four in a Row, Drop Four, and Gravitrips in the Soviet Union
//     another fun fact: Connect 4 was "solved" by James Allen and Victor Allis (independently from one another.. like two weeks apart!) in 1988. They couldn't do a full brute-force proof at the time, but 7 years later John Tromp in the Netherlands did it with a database on a Sun Microsystems and Silicon Graphics International worksations (for a combined total of 40,000 computation hours!).

type Connect4EmptyCell = "  ";
type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | Connect4EmptyCell;
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";
type Fill<
	Content extends unknown,
	Size extends number,
	Container extends Array<Content> = [],
> = Container["length"] extends Size ? Container : Fill<Content, Size, [...Container, Content]>;
// https://stackoverflow.com/a/62976061
type LEQ = {
	0: 0;
	1: 0 | 1;
	2: 0 | 1 | 2;
	3: 0 | 1 | 2 | 3;
	4: 0 | 1 | 2 | 3 | 4;
	5: 0 | 1 | 2 | 3 | 4 | 5;
	6: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	7: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
};
type Same<T, U, Y = T, N = never> = [T] extends [U] ? ([U] extends [T] ? Y : N) : N;
type ToLEQ<N extends number> = {
	[K in keyof LEQ]: [N] extends [Exclude<LEQ[K], K>] ? never : K;
}[keyof LEQ];
type Max<N extends number, U extends number = ToLEQ<Extract<N, keyof LEQ>>> = {
	[K in keyof LEQ]: Same<U, LEQ[K], K>;
}[keyof LEQ];
// https://stackoverflow.com/a/62976061
type Connect4RowIndex = 0 | 1 | 2 | 3 | 4 | 5;
type Connect4ColumnIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Increment<N extends number> = [
	...Fill<"", N, []>,
	"",
]["length"] extends infer IncrementedNumber extends number
	? IncrementedNumber
	: never;
type Decrement<N extends number> = Fill<"", N, []> extends [infer First, ...infer Rest]
	? Rest["length"]
	: never;

type Connect4Board = Fill<
	Fill<Connect4Cell, Increment<Max<Connect4ColumnIndex>>>,
	Increment<Max<Connect4RowIndex>>
>;
type Connect4Game = {
	board: Connect4Board;
	state: Connect4State;
};

type EmptyBoard = [
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
	["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

type NewGame = {
	board: EmptyBoard;
	state: "🟡";
};

type ChangeArrayElement<A extends Array<unknown>, I extends keyof A, E extends unknown> = {
	[Key in keyof A]: Key extends `${I extends number ? I : never}` ? E : A[Key];
};

type FindRowIndex<Board extends Connect4Board, ColumnIndex extends Connect4ColumnIndex> = Max<
	{
		[RowIndex in keyof Board]: Board[RowIndex][ColumnIndex] extends Connect4EmptyCell
			? StringToNumber<RowIndex>
			: never;
	}[number]
>;

type StringToNumber<S> = S extends `${infer FirstDigit}${infer RestDigits}`
	? S extends `${infer OnlyDigit}`
		? OnlyDigit extends infer N
			? N extends "0"
				? 0
				: N extends "1"
					? 1
					: N extends "2"
						? 2
						: N extends "3"
							? 3
							: N extends "4"
								? 4
								: N extends "5"
									? 5
									: N extends "6"
										? 6
										: N extends "7"
											? 7
											: N extends "8"
												? 8
												: N extends "9"
													? 9
													: never
			: never
		: // TODO: doesn't support two digit numbers
			never
	: never;

type GenerateNextBoard<
	Game extends Connect4Game,
	ColumnIndex extends Connect4ColumnIndex,
> = FindRowIndex<Game["board"], ColumnIndex> extends infer RowIndex extends Connect4RowIndex
	? ChangeArrayElement<
			Game["board"],
			RowIndex,
			ChangeArrayElement<Game["board"][RowIndex], ColumnIndex, Game["state"]>
		>
	: never;

type AreThreeSameHorizontally<Row extends Array<Connect4Cell>> = Row[0] extends infer FirstCell
	? Row[1] extends FirstCell
		? Row[2] extends FirstCell
			? Row[3] extends FirstCell
				? FirstCell
				: never
			: never
		: never
	: never;

type FindHorizontalWinner<Board extends Connect4Board> = {
	[RowIndex in keyof Board]: AreThreeSameHorizontally<Board[RowIndex]> extends infer Winner extends
		Connect4Chips
		? Winner
		: never;
}[number];

type SouthWestOriginatingRows = 0 | 1 | 2;

type AreNextThreeSameSouthWest<
	RowIndex extends SouthWestOriginatingRows,
  ColumnIndex extends Connect4ColumnIndex,
	Board extends Connect4Board,
> = Board[RowIndex][ColumnIndex] extends infer FirstCell extends Connect4Chips
	? Board[Increment<RowIndex>][Decrement<ColumnIndex>] extends FirstCell
		? Board[Increment<Increment<RowIndex>>][Decrement<Decrement<ColumnIndex>>] extends FirstCell
			? Board[Increment<Increment<Increment<RowIndex>>>][Decrement<
					Decrement<Decrement<ColumnIndex>>
				>] extends FirstCell
				? FirstCell
				: never
			: never
		: never
	: never;

type FindSouthWestWinner<Board extends Connect4Board> = {
	[RowIndex in keyof Board]: StringToNumber<RowIndex> extends infer RowIndexAsNumber extends
		SouthWestOriginatingRows
		? AreNextThreeSameSouthWest<RowIndexAsNumber, 3, Board>
		: never;
}[number];

type Test = FindSouthWestWinner<
	[
		["  ", "  ", "  ", "  ", "  ", "  ", "  "],
		["  ", "  ", "  ", "  ", "  ", "  ", "  "],
		["  ", "  ", "  ", "🟡", "  ", "  ", "  "],
		["  ", "  ", "🟡", "🔴", "  ", "  ", "  "],
		["🔴", "🟡", "🔴", "🔴", "  ", "  ", "  "],
		["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "],
	]
>;

type FindWinner<Board extends Connect4Board> = FindHorizontalWinner<Board> | FindSouthWestWinner<Board>;

type IsFilled<Board extends Connect4Board> = Connect4EmptyCell extends Board[number][number] ? false : true

type Test2 = IsFilled<[
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ]>

type Connect4<
	Game extends Connect4Game,
	ColumnIndex extends Connect4ColumnIndex,
> = GenerateNextBoard<Game, ColumnIndex> extends infer NextBoard extends Connect4Board
	? {
			board: NextBoard;
			state: IsFilled<NextBoard> extends true ? 'Draw' : FindWinner<NextBoard> extends never
				? Exclude<Connect4Chips, Game["state"]>
				: FindWinner<NextBoard> extends infer Winner extends Connect4Chips ? `${Winner} Won` : never;
		}
	: never;
