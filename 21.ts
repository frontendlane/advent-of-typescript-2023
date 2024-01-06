// What is Tic Tac Toe?
// Tic-Tac-Toe is a two-player game where players alternate marking ❌s and ⭕s in a 3x3 grid, aiming to get three in a row.
//     fun fact: Did you know that tic tac toe is widely considered to be the first computer video game ever created?! That's right! A S Douglas implemented it all the way back in 1952, the same year as the coronation of Queen Elizabeth II.
// Solving Tic Tac Toe
// Your goal for this challenge is to use TypeScript types to encode the game logic of Tic Tac Toe. Eventually, every game will end with one of the players winning or a draw.

type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type Invalid = "invalid";
type Fill<
	Content extends unknown,
	Size extends number,
	Container extends Array<Content> = [],
> = Container["length"] extends Size ? Container : Fill<Content, Size, [...Container, Content]>;
type TicTacToeBoard = Fill<Fill<TicTacToeCell, 3>, 3>;
type TicTacToeGame = {
	board: TicTacToeBoard;
	state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
	board: EmptyBoard;
	state: "❌";
};

type PlaceChip<A extends Array<unknown>, I extends keyof A, E extends unknown> = {
	[Key in keyof A]: Key extends `${I extends number ? I : never}`
		? A[Key] extends TicTacToeEmptyCell
			? E
			: Invalid
		: A[Key];
};

type ChangeArrayElement<A extends Array<unknown>, I extends keyof A, E extends unknown> = {
	[Key in keyof A]: Key extends `${I extends number ? I : never}` ? E : A[Key];
};

type TranslateCellYCoordinateToIndex<YCoordinate extends TicTacToeYPositions> =
	YCoordinate extends "top" ? 0 : YCoordinate extends "middle" ? 1 : 2;
type TranslateCellXCoordinateToIndex<XCoordinate extends TicTacToeXPositions> =
	XCoordinate extends "left" ? 0 : XCoordinate extends "center" ? 1 : 2;

type GenerateNextBoard<
	CurrentGame extends TicTacToeGame,
	YCoordinate extends TicTacToeYPositions,
	XCoordinate extends TicTacToeXPositions,
> = ChangeArrayElement<
	CurrentGame["board"],
	TranslateCellYCoordinateToIndex<YCoordinate>,
	PlaceChip<
		CurrentGame["board"][TranslateCellYCoordinateToIndex<YCoordinate>],
		TranslateCellXCoordinateToIndex<XCoordinate>,
		CurrentGame["state"]
	>
> extends infer NextBoard extends [
	[TicTacToeCell, TicTacToeCell, TicTacToeCell],
	[TicTacToeCell, TicTacToeCell, TicTacToeCell],
	[TicTacToeCell, TicTacToeCell, TicTacToeCell],
]
	? NextBoard
	: never;

// https://stackoverflow.com/a/55128956
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
	? R
	: never;

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
	? []
	: Push<TuplifyUnion<Exclude<T, L>>, L>;
// https://stackoverflow.com/a/55128956

type FindWinner<A extends Array<unknown>> = TuplifyUnion<A[number]> extends infer Winner extends
	Array<TicTacToeChip>
	? Winner["length"] extends 0
		? never
		: Winner["length"] extends 1
			? Winner[0]
			: never
	: never;

type GetWinner<Board extends TicTacToeBoard> = [
	FindWinner<Board[0]>,
	FindWinner<Board[1]>,
	FindWinner<Board[2]>,
	FindWinner<[Board[0][0], Board[1][0], Board[2][0]]>,
	FindWinner<[Board[0][1], Board[1][1], Board[2][1]]>,
	FindWinner<[Board[0][2], Board[1][2], Board[2][2]]>,
] extends infer Winner extends Array<TicTacToeChip>
	? Winner[number]
	: "no winner (get winner)";

type IsInvalid<Board extends TicTacToeBoard> = Board[number][number] extends Invalid ? true : false;

type IsFinal<Board extends TicTacToeBoard> = TicTacToeEmptyCell extends Board[number][number] ? false : true

type TicTacToe<
	CurrentGame extends TicTacToeGame,
	NextMoveCellCoordinates extends TicTacToePositions,
> = NextMoveCellCoordinates extends `${infer YCoordinate extends
	TicTacToeYPositions}-${infer XCoordinate extends TicTacToeXPositions}`
	? GenerateNextBoard<CurrentGame, YCoordinate, XCoordinate> extends infer NextBoard extends
			TicTacToeBoard
		? IsInvalid<NextBoard> extends true
			? CurrentGame
			: {
					board: NextBoard;
					state: GetWinner<NextBoard> extends never
						? IsFinal<NextBoard> extends true ? 'Draw' : Exclude<TicTacToeChip, CurrentGame["state"]>
						: `${GetWinner<NextBoard>} Won`;
				}
		: never
	: never;
