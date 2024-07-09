import express, { Request, Response } from "express"
import next from 'next'
 
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const server = express();
const handle = app.getRequestHandler()
 
app.prepare().then(() => {
  server.all('*', (req: Request, res: Response) => handle(req, res))

  server.listen(port, (err?: any) => {
    if(err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})