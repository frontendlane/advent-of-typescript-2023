// Naughty List Decipher
// [early on the morning of Thursday December 14th, Santa stumbles into office greeted by Bernard, the head elf..]
//     [Bernard] YOU'RE A MESS. Were you out partying.. on a WEDNESDAY?? AGAIN??!!!
//     [Santa] It seems as such. Some investors were in town so we went over to the Mistletoe Lounge and things got a little out of hand.
//     [Bernard] I oughta report you to HR. Seriously. This is getting out of control.
//     [Santa] We're like a family here; no need for formal HR processes!
//     [Bernard] Where's the list for today's naughty kids? We're behind on coal lump production.
//     [Santa] Umm.
//     [Bernard] You're joking. Tell me you're joking. You lost the list again?
//     [Santa] Well, not lost per se.
//     [Bernard] Then where is it?
//     [Santa] I have it.. but I only scribbled down the names real quick with slashes in between them.
// Covering for Santa, again.
// Looks like we're gonna need to pick up the slack for Santa yet again. He's got a list like "melkey/prime/theo/trash" and we need to turn it into a union of strings "melkey" | "prime" | "theo" | "trash".
// Let's get this done before the rest of the elves find out.

type DecipherNaughtyList<T extends string> =
	T extends `${infer A}/${infer B}`
		? A | DecipherNaughtyList<B>
		: T extends `${infer C}`
			? C
			: never