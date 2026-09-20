// docs/scrape/smurkerfi.json blocks 35-40 (Q/A pairs as alternating text
// blocks — the question ends with "?" and the next block is its answer).
// Moved out of components/smurkerfi/FaqSection.tsx so lib/search/build-index.ts
// can index these questions/answers as `faq` search entries without a
// client component importing server-only build-index code (or vice versa).
export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "Hvaða feiti á að nota í smurkerfi?",
    answer:
      "Skralli mælir með MAX-2-LUBE (NLG2) koppafeiti fyrir flest notkunarsvið - í smurkerfi sem og smursprautur.\nFyrir fleyga mælum við með MAX-2-LUBE fleygafeiti.",
  },
  {
    question: "Þjónustið þið smurkerfi frá öðrum framleiðendum?",
    answer:
      "Við erum sérfræðingar í smurkerfum og veitum fyrsta flokks þjónustu og ráðgjöf alveg óháð framleiðanda. Við eigum stórt úrval af varahlutum á lager fyrir flestar gerðir smurkerfa en sérhæfum okkur í Groeneveld-BEKA.",
  },
  {
    question: "Má nota sömu feiti á mismunandi kerfi (Beka, Groeneveld eða Lincoln)?",
    answer:
      "Já! MAX-2-LUBE er koppafeiti með einstaklega mikla viðloðun - sem er nákvæmlega það sem smurkerfi vilja. Hana má nota í öll smurkerfi alveg óháð framleiðanda.",
  },
];
