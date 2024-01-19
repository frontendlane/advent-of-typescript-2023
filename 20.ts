// TS playground link: https://tsplay.dev/advent-of-typescript-2023-20

// TypeScript ASCII Art!
// Your goal for this challenge is to take an input like Hi and turn it into ASCII art!
// So for example Hi would turn into:
// █ █ █ 
// █▀█ █ 
// ▀ ▀ █ 
// but there's a twist!
// You'll also need to handle newlines! Take a look at the tests to see some examples of that in action.
// Enjoy!
// ...wait
// ....what's that.....
//     !! BREAKING NEWS JUST-IN FROM THE TYPEHERO INVESTIGATIVE REPORTING TEAM !!
//     We have just received word that the term "ASCII art" is commonly used to refer to text-based visual art in general. That means that although characters are not part of the ISO-8859-1 character encoding set, it's still ASCII art! We also just received word that pencil lead has actually been made of graphite since the 16th century but we all still call it "lead" even though it's not made from the 82nd atomic element, lead(!!). News, Sports, and Weather at 11. Back to you Carol.

type Letters = {
    A: [
      '█▀█ ',
      '█▀█ ',
      '▀ ▀ ',
    ],
    B: [
      '█▀▄ ',
      '█▀▄ ',
      '▀▀  '
    ],
    C: [
      '█▀▀ ',
      '█ ░░',
      '▀▀▀ '
    ],
    E: [
      '█▀▀ ',
      '█▀▀ ',
      '▀▀▀ '
    ],
    H: [
      '█ █ ',
      '█▀█ ',
      '▀ ▀ '
    ],
    I: [
      '█ ',
      '█ ',
      '▀ '
    ],
    M: [
      '█▄░▄█ ',
      '█ ▀ █ ',
      '▀ ░░▀ '
    ],
    N: [
      '█▄░█ ',
      '█ ▀█ ',
      '▀ ░▀ '
    ],
    P: [
      '█▀█ ',
      '█▀▀ ',
      '▀ ░░'
    ],
    R: [
      '█▀█ ',
      '██▀ ',
      '▀ ▀ '
    ],
    S: [
      '█▀▀ ',
      '▀▀█ ',
      '▀▀▀ '
    ],
    T: [
      '▀█▀ ',
      '░█ ░',
      '░▀ ░'
    ],
    Y: [
      '█ █ ',
      '▀█▀ ',
      '░▀ ░'
    ],
    W: [
      '█ ░░█ ',
      '█▄▀▄█ ',
      '▀ ░ ▀ '
    ],
    ' ': [
      '░',
      '░',
      '░'
    ],
    ':': [
      '#',
      '░',
      '#'
    ],
    '*': [
      '░',
      '#',
      '░'
    ],
  };
  
  type ChangeArrayElement<A extends Array<unknown>, I extends keyof A, E extends unknown> = {[Key in keyof A]: Key extends `${I extends number ? I : never}` ? E : A[Key]}
  
  type AddLetterToRow<Letter extends keyof Letters, ArrayOfRows extends Array<Array<string>>, RowNumber extends number> = 
    ChangeArrayElement<ArrayOfRows, RowNumber,
      [`${ArrayOfRows[RowNumber][0] extends infer TopOfTheRow extends string ? TopOfTheRow : ''}${Letters[Letter][0]}`,
      `${ArrayOfRows[RowNumber][1] extends infer MiddleOfTheRow extends string ? MiddleOfTheRow : ''}${Letters[Letter][1]}`,
      `${ArrayOfRows[RowNumber][2] extends infer BottomOfTheRow extends string ? BottomOfTheRow : ''}${Letters[Letter][2]}`]
    >;
  
  type Fill<Content extends unknown, Size extends number, Container extends Array<Content> = []> = Container['length'] extends Size ? Container : Fill<Content, Size, [...Container, Content]>
  
  type Increment<N extends number> = [...Fill<'', N, []>, ""]["length"] extends infer IncrementedNumber extends number ? IncrementedNumber : never;
  
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
  
  type Decrement<N extends number> = Fill<'', N, []> extends [infer First, ...infer Rest] ? Rest['length'] : never
  
  // TODO: Flatten is a hack, needs a proper algorithm
  type Flatten<A extends Array<Array<unknown>>> = {[I in keyof A]: I extends '0' ? [...A[I]] : I extends '1' ? [...A[Decrement<StringToNumber<I>>], ...A[I]] : [...A[Decrement<Decrement<StringToNumber<I>>>], ...A[Decrement<StringToNumber<I>>], ...A[I]]}[Decrement<A['length']>]
  
  type ToAsciiString<RowText extends string, ArrayOfRows extends Array<Array<string>> = [[]], RowNumber extends number = 0> =
      RowText extends `${infer FirstLetter}${infer Rest}`
        ? Uppercase<FirstLetter> extends infer UppercaseFirstLetter extends keyof Letters
          ? Rest extends ''
            ? AddLetterToRow<UppercaseFirstLetter, ArrayOfRows, RowNumber>
            : ToAsciiString<Rest, AddLetterToRow<UppercaseFirstLetter, ArrayOfRows, RowNumber>, RowNumber>
          : never
        : 'empty string inner'
  
  type BreakAtNewlines<Text extends string, NumberOfNewlines extends number, ArrayOfRowTexts extends Array<string> = Fill<'', NumberOfNewlines, []>, RowNumber extends number = 0> =
    Text extends `${infer First}${infer Rest}`
      ? First extends '\n'
        ? BreakAtNewlines<Rest, NumberOfNewlines, ArrayOfRowTexts, Increment<RowNumber>>
        : BreakAtNewlines<Rest, NumberOfNewlines, ChangeArrayElement<ArrayOfRowTexts, RowNumber, `${ArrayOfRowTexts[RowNumber]}${First}`>, RowNumber>
      : ArrayOfRowTexts
  
  type ToNestedAsciiArt<ArrayOfRowTexts extends Array<string>> = {[Index in keyof ArrayOfRowTexts]: ToAsciiString<ArrayOfRowTexts[Index]>[0]}
  
  type CountNewlines<S extends string, RunningCount extends number = 0> = S extends `${infer First}${infer Rest}` ? First extends '\n' ? CountNewlines<Rest, Increment<RunningCount>> : CountNewlines<Rest, RunningCount> : RunningCount
  
  type ToAsciiArt<S extends string> = ToNestedAsciiArt<BreakAtNewlines<S, Increment<CountNewlines<S>>>> extends infer Temp extends Array<Array<unknown>> ? Flatten<Temp> : never