
const fs = require('fs');
const content = fs.readFileSync(process.argv[2], 'utf8');
try {
    // Wrap in async function to allow await/top-level stuff if any
    new Function('async () => {' + content + '}');
    console.log("Syntax is VALID");
} catch (e) {
    console.log("Syntax ERROR:");
    console.log(e.message);
    // Find approximate line number if possible
    const match = e.stack.match(/<anonymous>:(\d+):(\d+)/);
    if (match) {
        console.log(`Approximate Location: Line ${match[1]}, Column ${match[2]}`);
    }
}
