// Find Santa (part 2)
// Since the episode with him getting lost on Tuesday (Day 12), the elves have started to get concerned about Santa getting lost again, but deeper in the forest. Since Santa's college buddy got WiFi installed in the whole property, Santa just wanders around scrolling TikTok without looking where he's going. Santa claimed that the reason the whole campus needed WiFi (even the forest) was to "future-proof the business" and "attract top talent" but it's beginning to seem like it was so he could personally get better phone service (cell reception in the north pole isn't great and without 116th H.R.7302, neither is the rural internet speed).
// Sure enough. It happened again. Santa got lost, again, but this time much deeper in the forest.
// This time we have to search columns as well as rows to find him.
// The FindSanta takes only one argument, the forest (an array of arrays), and returns the [Row, Column] indices where Santa is located. Then an elf search team can be deployed to retrieve him.

type Tree = '🎄'
type Santa = '🎅🏼'

type TableConfig = {
	columns: number
	rows: number
	cellContent: unknown
}

type TableAxis<Axis extends Array<unknown>, CellContent extends unknown, AxisLength extends number> = Axis['length'] extends AxisLength ? Axis : TableAxis<[...Axis, CellContent], CellContent, AxisLength>

type Table<T extends TableConfig> = TableAxis<[], TableAxis<[], T['cellContent'], T['rows']>, T['columns']>

type Forest = Table<{columns: 4, rows: 4, cellContent: Tree | Santa}>

// *** //

type Fill<A extends Array<unknown>, N extends unknown> = A['length'] extends N ? A : Fill<[...A, 'filler'], N>

type Increment<N extends unknown> = [...Fill<[], N>, '']['length']

// *** //

type NeverNumber = 'ordinarily this would be `never` but because `never` extends number this fallback must be some other type. string is a good choice because this explanation can be stored inside the very type 😝'

type FindSantaCellRecursive<Row extends Array<unknown>, Index extends unknown> = Row extends [infer FirstCell, ...infer Rest] ? FirstCell extends Santa ? Index : FindSantaCellRecursive<Rest, Increment<Index>> : NeverNumber

type FindSantaCell<Row extends unknown> = Row extends [infer FirstCell, ...infer Rest] ? FirstCell extends Santa ? 0 : FindSantaCellRecursive<Rest, Increment<0>> : NeverNumber

// *** //
type FindSantaRowRecursive<Table extends Array<unknown>, Index extends unknown> = Table extends [infer FirstRow, ...infer Rest] ? FindSantaCell<FirstRow> extends number ? Index : FindSantaRowRecursive<Rest, Increment<Index>> : NeverNumber

type FindSantaRow<Table extends Array<unknown>> = Table extends [infer FirstRow, ...infer Rest] ? FindSantaCell<FirstRow> extends number ? 0 : FindSantaRowRecursive<Rest, Increment<0>> : NeverNumber

// *** //

type FindSanta<SantaInForest extends Array<unknown>> = FindSantaRow<SantaInForest> extends infer SantaRowNumber ? SantaRowNumber extends number ? [SantaRowNumber, FindSantaCell<SantaInForest[SantaRowNumber]>] : never : never