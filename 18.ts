// TS playground link: https://tsplay.dev/advent-of-typescript-2023-18

// Santa's Remaining Deliveries
// Santa needs your help to count the number of presents he has to deliver! He's got all kinds of presents, from video game consoles (🎮), stuffed animals (🧸), toy cars (🏎️), books (📚), and more!
// We need a general purpose type that can take a tuple of items as its first arguemnt and an item to search for as the second argument. It should return a count of the item specified.
// For example:
// Count<['👟', '👟', '💻', '🎸', '🧩', '👟', '🧸'], '👟'>;
// should return 3 because there are three 👟.

type Fill<A extends Array<unknown>, N extends unknown> = A['length'] extends N ? A : Fill<[...A, 'filler'], N>

type Increment<N extends unknown> = [...Fill<[], N>, '']['length']

type CountRecursive<A extends Array<unknown>, E extends unknown, CurrentCount extends number> = A extends [infer First, ...infer Rest]
		? First extends E ? Increment<CountRecursive<Rest, E, CurrentCount>> : CountRecursive<Rest, E, CurrentCount>
		: A extends [infer Only]
			? Only extends E ? 1 : 0
			: 0

type Count<A extends Array<unknown>, E extends unknown> =
	A extends [infer First, ...infer Rest]
		? First extends E ? Increment<CountRecursive<Rest, E, 0>> : CountRecursive<Rest, E, 0>
		: A extends [infer Only]
			? Only extends E ? 1 : 0
			: 0