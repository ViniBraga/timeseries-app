import express from 'express'
import cors from 'cors'
import pingRouter from './routes/ping'
import uploadRouter from './routes/upload'
import uploadStatusRouter from './routes/uploadStatus'
import checkFilenames from './routes/checkFilenames'
import summaryRouter from './routes/summary'
import downloadRouter from './routes/download'
import deleteRouter from './routes/delete'


const app = express()
const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())

app.use('/ping', pingRouter)
app.use('/upload', uploadRouter)
app.use('/upload-status', uploadStatusRouter)
app.use('/check-filenames', checkFilenames)
app.use('/summary', summaryRouter)
app.use('/download', downloadRouter)
app.use('/delete', deleteRouter)

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})