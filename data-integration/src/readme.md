"id,name,desc,age" > big.csv
for i in `seq 1 5`; do node -e "process.stdout.write('$i,eduardo-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv;done

OR 

import { createWriteStream } from 'node:fs';
 
const output = createWriteStream('big.csv');

output.write(`id,name,desc,age` + '\n')

for(let i = 1; i <= 5; i++) {
    for(let j = 0; j < 1e5; j++) {
        output.write(`${i},eduardo-${i},${i}-text,${i}` + '\n')
    }
}
