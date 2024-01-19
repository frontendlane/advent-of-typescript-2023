// TS playground link: https://tsplay.dev/advent-of-typescript-2023-22

// Reindeer Sudoku
// Santa's reindeer sure do like to cause trouble! This time they've decided to make a game out of arranging themselves into a Sudoku board.
// Before arranging themselves in this configuration, the reindeer left Santa a foreboding message:
//     SaNtA.... yOu MuSt ImPleMeNt ThE Validate TyPe To DeTerMinE WhEThEr OuR SuDokU ConFiGuRaTiOn Is vALid
// Oh.. and what's that... also Vixen seems to have left a separate note
//     make sure Validate is a predicate
//         Vixen
// Well that's sorta condescending. Vixen seems to be assuming we already know that a "predicate" is just a fancy computer science term for a function that returns true or false. Oh well. That's Vixen for you.
// What is Sudoku
// If you're not already familiar: Sudoku is a logic-based number placement puzzle. Here are the basic rules:
//     Grid Structure: The game is played on a 9x9 grid, divided into nine 3x3 subgrids or "regions."
//     Number Placement: The objective is to fill the grid with numbers from 1 to 9.
//     Row Constraint: Every row must contain each number from 1 to 9 without repeating.
//     Column Constraint: Every column must also contain each number from 1 to 9 without repeating.
//     Region Constraint: Each of the nine 3x3 regions must contain each number from 1 to 9, again without repetition.
// Normally you solve the puzzle by logically deducing the numbers for the empty cells, ensuring that all rows, columns, and 3x3 regions have numbers from 1 to 9 according to the rules. However, in this case the cells are all already filled in and your mission is to instead determine whether the configuration follows the rules of Sudoku.

/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer = Dasher | Dancer | Prancer | Vixen | Comet | Cupid | Donner | Blitzen | Rudolph;

type Fill<
	Content extends unknown,
	Size extends number,
	Container extends Array<Content> = [],
> = Container["length"] extends Size ? Container : Fill<Content, Size, [...Container, Content]>;

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

type SudokuRow = Fill<[Reindeer, Reindeer, Reindeer], 3>;
type SudokuBoard = Fill<SudokuRow, 9>;

type AreRowsValid<Board extends SudokuBoard> = Reindeer extends Board[0][number][number]
	? Reindeer extends Board[1][number][number]
		? Reindeer extends Board[2][number][number]
			? Reindeer extends Board[3][number][number]
				? Reindeer extends Board[4][number][number]
					? Reindeer extends Board[5][number][number]
						? Reindeer extends Board[6][number][number]
							? Reindeer extends Board[7][number][number]
								? Reindeer extends Board[8][number][number]
									? true
									: false
								: false
							: false
						: false
					: false
				: false
			: false
		: false
	: false;

type TopSubGrid = 0 | 1 | 2;
type MiddleSubGrid = 3 | 4 | 5;
type BottomSubGrid = 6 | 7 | 8;
type LeftSubGrid = 0;
type CenterSubGrid = 1;
type RightSubGrid = 2;

type SubGrids = [
	[TopSubGrid, LeftSubGrid],
	[TopSubGrid, CenterSubGrid],
	[TopSubGrid, RightSubGrid],
	[MiddleSubGrid, LeftSubGrid],
	[MiddleSubGrid, CenterSubGrid],
	[MiddleSubGrid, RightSubGrid],
	[BottomSubGrid, LeftSubGrid],
	[BottomSubGrid, CenterSubGrid],
	[BottomSubGrid, RightSubGrid],
];

type IsSubGridValid<
	Board extends SudokuBoard,
	Subgrid extends SubGrids[number],
> = Reindeer extends Board[Subgrid[0]][Subgrid[1]][number] ? true : false;

type AreSubGridsValid<Board extends SudokuBoard> = IsSubGridValid<Board, SubGrids[0]> extends true
	? IsSubGridValid<Board, SubGrids[1]> extends true
		? IsSubGridValid<Board, SubGrids[2]> extends true
			? IsSubGridValid<Board, SubGrids[3]> extends true
				? IsSubGridValid<Board, SubGrids[4]> extends true
					? IsSubGridValid<Board, SubGrids[5]> extends true
						? IsSubGridValid<Board, SubGrids[6]> extends true
							? IsSubGridValid<Board, SubGrids[7]> extends true
								? IsSubGridValid<Board, SubGrids[8]> extends true
									? true
									: false
								: false
							: false
						: false
					: false
				: false
			: false
		: false
	: false;

type Validate<Board extends SudokuBoard> = AreRowsValid<Board> extends true
	? AreSubGridsValid<Board>
	: false;
