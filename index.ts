import * as child_process from 'child_process';
import * as http from 'http';
import * as fs from 'fs';
const port = process.env.SERVER_PORT || process.env.PORT || 3000;   // this is your subscribe port
const startScriptPath = './start.sh';
const chmodChild = exec(`chmod +x ${startScriptPath}`);

chmodChild.stdout?.on('data', (data: string) => {
    console.log(`chmod stdout: ${data}`);
    });

chmodChild.stderr?.on('data', (data: string) => {
    console.error(`chmod stderr: ${data}`);
    });

chmodChild.on('close', (chmodCode: number) => {
  if (chmodCode === 0) {
    const startChild = exec(`bash ${startScriptPath}`);

    startChild.stdout?.on('data', (data: string) => {
      console.log(`${data}`);
    });

    startChild.stderr?.on('data', (data: string) => {
      console.error(`${data}`);
    });

    startChild.on('close', (startCode: number) => {
      console.log(`start.sh child process exited with code ${startCode}`);
    });
  } else {
    console.error(`Failed to chmod start.sh. Exit code: ${chmodCode}`);
  }
});
  
 const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello World!');
  } else if (req.url === '/sub') {
    const filePath = './data/sub.txt';

    fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
