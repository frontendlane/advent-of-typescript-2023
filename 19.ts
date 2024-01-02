// Help Santa Embezzle Funds
// The shady WiFi installment by Santa's college buddy in Days 12 and 16 aren't the only questionable business dealing Santa is involved in. Another of Santa's friends from college, Tod, is a partial owner of the X Games (an "extreme sports" version of the Olympics). In recent years, Santa realized that he can use his position of power at the toy factory to embezzle funds through a shell corporation that he started with Tod. The shell corporation, Icecap Assets Management, Inc., recently acquired a skateboard and scooter manufacturer, SkateScoot Syndicate. It's perfect timing because in 2022 Icecap had acquired another company that makes surfboards and bmx bikes, RideWave Dynamics.
// Now, all that's left to do is make sure that every child gets a skateboard or a scooter! Then the funds will be laundered to Icecap via SkateScoot and RideWave, after which Santa and Tod can then take total control of the funds.
// Santa made himself a list like this:
// type List = [2, 1, 3, 3, 1, 2, 2, 1];
// And since Santa doesn't want to raise suspicion (by giving the same thing to every kid) he figures he'll alternate like this:
//     '🛹' (skateboard)
//     '🚲' (bmx bike)
//     '🛴' (scooter)
//     '🏄' (surfboard)
//     (loop back to skateboard)
// type Result = [
//   '🛹', '🛹',
//   '🚲',
//   '🛴', '🛴', '🛴',
//   '🏄', '🏄', '🏄',
//   '🛹',
//   '🚲', '🚲',
//   '🛴', '🛴',
//   '🏄',
// ]

type Gifts = ["🛹", "🚲", "🛴", "🏄"];

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

type CycleGift<G extends Array<unknown>> = G extends [
  unknown,
  ...infer Rest
]
  ? Rest["length"] extends 0
    ? Gifts
    : Rest
  : never;

type Fill<
  A extends Array<unknown>,
  N extends unknown,
  PossibleGifts extends Array<unknown> = Gifts
> = A["length"] extends N
  ? A
  : Fill<[...A, PossibleGifts[0]], N, CycleGift<PossibleGifts>>;

type Increment<N extends unknown> = [...Fill<[], N>, ""]["length"];

type PickGift<N extends number> = [...Fill<[], Increment<N>>][N];

type StuffBagWithGifts<
  BagSize extends number,
  GiftIdentifier extends number,
  A extends Array<unknown> = []
> = A["length"] extends BagSize
  ? A
  : StuffBagWithGifts<
      BagSize,
      GiftIdentifier,
      [...A, PickGift<GiftIdentifier>]
    >;

type Flatten<
  A extends Array<unknown>,
  Output extends Array<unknown> = []
> = A extends [infer First, ...infer Rest]
  ? First extends Array<unknown>
    ? Flatten<[...Rest], [...Output, ...First]>
    : never
  : A extends [infer Only]
  ? Only extends Array<unknown>
    ? [...Output, ...Only]
    : Only
  : [...Output];

type Rebuild<T extends Array<number>> = Flatten<{
  [Property in keyof T]: StuffBagWithGifts<
    T[Property],
    StringToNumber<Property>
  >;
}>;