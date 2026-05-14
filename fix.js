const fs = require('fs');
const execSync = require('child_process').execSync;

const oldHtml = execSync('git show 0d50008:public/index.html').toString();
const startIdx = oldHtml.indexOf('<dialog id="tunerModal">');
const endIdx = oldHtml.indexOf('</dialog>', startIdx) + 9;

if (startIdx !== -1 && endIdx !== -1) {
    const tunerHtml = oldHtml.substring(startIdx, endIdx);
    
    let curHtml = fs.readFileSync('public/index.html', 'utf8');
    
    // Check if it already exists
    if (!curHtml.includes('id="tunerModal"')) {
        // Find </script> at the end to insert before it
        const insertIdx = curHtml.lastIndexOf('<script');
        curHtml = curHtml.substring(0, insertIdx) + tunerHtml + '\n\n' + curHtml.substring(insertIdx);
        fs.writeFileSync('public/index.html', curHtml);
        console.log('Tuner modal restored!');
    } else {
        console.log('Tuner modal already exists.');
    }
} else {
    console.log('Could not find tuner modal in old file.');
}
