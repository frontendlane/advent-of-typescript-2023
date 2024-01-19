// TS playground link: https://tsplay.dev/advent-of-typescript-2023-24

// Santa is stuck!
// Santa is craving cookies! But Alas, he's stuck in a dense North Polar forest.
// Implement Move so Santa ('🎅') can find his way to the end of the maze.
// As a reward, if Santa escapes the maze, fill it with DELICIOUS_COOKIES ('🍪').
// Santa can only move through alleys (' ') and not through the trees ('🎄').
// Solving the maze
// This challenge is going to be a culmination of all the days that came before.

type Alley = "  ";
type Santa = "🎅";
type Tree = "🎄";
type MazeItem = Tree | Santa | Alley;
type DELICIOUS_COOKIES = "🍪";

type Fill<
	Content extends unknown,
	Size extends number,
	Container extends Array<Content> = [],
> = Container["length"] extends Size ? Container : Fill<Content, Size, [...Container, Content]>;

type MazeRow = Fill<MazeItem, 10>;
type MazeMatrix = Fill<MazeRow, 10>;
type Directions = "up" | "down" | "left" | "right";

// CanSantaMove
type GenerateNextSantaRow2<
	Maze extends MazeMatrix,
	Row extends number,
	Column extends number,
> = Maze[Row] extends infer MazeRow extends Array<unknown>
	? {
			[Key in keyof MazeRow]: StringToNumber<Key> extends Column
				? MazeRow[Key] extends Tree
					? Tree
					: Santa
				: MazeRow[Key] extends Santa
					? Alley
					: MazeRow[Key];
		}
	: never;

type IsSantaAtTheEdge<Maze extends MazeMatrix> =
	FindCurrentSantaRowIndex<Maze> extends infer CurrentSantaRow extends number
		? CurrentSantaRow extends 0
			? true
			: CurrentSantaRow extends 9
				? true
				: FindCurrentSantaColumnIndex<
							Maze[CurrentSantaRow]
					  > extends infer CurrentSantaColumn extends number
					? CurrentSantaColumn extends 0
						? true
						: CurrentSantaColumn extends 9
							? true
							: false
					: never
		: never;

type CanSantaMove<Maze extends MazeMatrix, Direction extends Directions> = ChangeArrayElement<
	ChangeArrayElement<
		Maze,
		FindCurrentSantaRowIndex<Maze>,
		GenerateCurrentSantaRow<Maze[FindCurrentSantaRowIndex<Maze>]>
	>,
	FindNextSantaRowIndex<Maze, Direction>,
	GenerateNextSantaRow2<
		Maze,
		FindNextSantaRowIndex<Maze, Direction>,
		FindNextSantaColumnIndex<
			FindCurrentSantaColumnIndex<Maze[FindCurrentSantaRowIndex<Maze>]>,
			Direction
		>
	>
> extends infer NextMaze extends MazeMatrix
	? FindCurrentSantaRowIndex<NextMaze> extends never
		? IsSantaAtTheEdge<Maze> extends true
			? true
			: false
		: true
	: never;
// CanSantaMove

type ChangeArrayElement<A extends Array<unknown>, I extends keyof A, E extends unknown> = {
	[Key in keyof A]: Key extends `${I extends number ? I : never}` ? E : A[Key];
};

type Includes<A extends Array<unknown>, E extends unknown> = A extends [infer First, ...infer Rest]
	? First extends E
		? true
		: Includes<Rest, E>
	: never;

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

type FindCurrentSantaRowIndex<Maze extends MazeMatrix> = {
	[Property in keyof Maze]: Includes<Maze[Property], Santa> extends never
		? never
		: StringToNumber<Property>;
}[number];

type Increment<N extends number> = [
	...Fill<"", N, []>,
	"",
]["length"] extends infer IncrementedNumber extends number
	? IncrementedNumber
	: never;
type Decrement<N extends number> = Fill<"", N, []> extends [infer First, ...infer Rest]
	? Rest["length"]
	: never;

type FindNextSantaRowIndex<
	Maze extends MazeMatrix,
	Direction extends Directions,
> = FindCurrentSantaRowIndex<Maze> extends infer CurrentSantaRow extends number
	? Direction extends "up"
		? Decrement<CurrentSantaRow>
		: Direction extends "down"
			? Increment<CurrentSantaRow>
			: CurrentSantaRow
	: never;

type FindCurrentSantaColumnIndex<Row extends MazeRow> = {
	[Index in keyof Row]: Row[Index] extends Santa ? StringToNumber<Index> : never;
}[number];

type FindNextSantaColumnIndex<
	CurrentSantaColumnIndex extends number,
	Direction extends Directions,
> = Direction extends "left"
	? Decrement<CurrentSantaColumnIndex>
	: Direction extends "right"
		? Increment<CurrentSantaColumnIndex>
		: CurrentSantaColumnIndex;

type GenerateCurrentSantaRow<Row extends MazeRow> = {
	[Property in keyof Row]: Row[Property] extends Santa ? Alley : Row[Property];
};

type GenerateNextSantaRow<
	Maze extends MazeMatrix,
	Row extends number,
	Column extends number,
> = Maze[Row] extends infer MazeRow extends Array<unknown>
	? {
			[Key in keyof MazeRow]: StringToNumber<Key> extends Column
				? Santa
				: MazeRow[Key] extends Santa
					? Alley
					: MazeRow[Key];
		}
	: never;

type MazeFilledWithCookies = Fill<Fill<DELICIOUS_COOKIES, 10>, 10>;

type Move<Maze extends MazeMatrix, Direction extends Directions> = CanSantaMove<
	Maze,
	Direction
> extends true
	? ChangeArrayElement<
			ChangeArrayElement<
				Maze,
				FindCurrentSantaRowIndex<Maze>,
				GenerateCurrentSantaRow<Maze[FindCurrentSantaRowIndex<Maze>]>
			>,
			FindNextSantaRowIndex<Maze, Direction>,
			GenerateNextSantaRow<
				Maze,
				FindNextSantaRowIndex<Maze, Direction>,
				FindNextSantaColumnIndex<
					FindCurrentSantaColumnIndex<Maze[FindCurrentSantaRowIndex<Maze>]>,
					Direction
				>
			>
		> extends infer NextMaze extends MazeMatrix
		? FindCurrentSantaRowIndex<NextMaze> extends never
			? MazeFilledWithCookies
			: NextMaze
		: never
	: Maze;
