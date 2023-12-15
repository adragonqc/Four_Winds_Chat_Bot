import {spawn} from "child_process"; 
let argument = "'is ham open?'"; 
// const pythonProcess = spawn('python3', ['-c', `import /home/ariebird/Desktop/NCF/fall 2023/Thesis/ChatBot_thesis/algorithms.py; algorithms.decision_tree(${argument});`]); 
// pythonProcess.stdout.on('data', (data) => { 
//     console.log(`stdout: ${data}`); 
// }); 
// pythonProcess.stderr.on('data', (data) => { 
//     console.log(`stderr: ${data}`); 
// }); 
// pythonProcess.on('exit', (code) => { 
//     console.log(`Python process ended with code: ${code}`); 
// });



// const { spawn } = require('child_process');
/**
*  let argument = "'is ham open?'"; 
*  Run a Python script and return output
* https://www.shecodes.io/athena/42322-how-to-run-a-python-file-from-a-javascript-file
*/
export async function runPythonScript(scriptPath, args) {
  console.log(args);
  // Use child_process.spawn method from 
  // child_process module and assign it to variable
  const pyProg = spawn('/bin/python3', [scriptPath].concat(args));
  console.log("1");

  // Collect data from script and print to console
  let data = '';
  pyProg.stdout.on('data', (stdout) => {
    data += stdout.toString();
  });
  console.log("2");
  

  // Print errors to console, if any
  pyProg.stderr.on('data', (stderr) => {
    console.log(`stderr: ${stderr}`);
  });
  console.log("3");

  // When script is finished, print collected data
  pyProg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(data);
  });
  console.log("4");

  console.log(ping());
  return data;
}



export function ping(){
    return "This works!";
}
// Run the Python file
// runPythonScript('./algorithms.py', [argument]);