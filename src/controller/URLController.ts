import { Request, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'
import { URLModel } from '../database/model/URL'

export class URLController {
  public async shorten(req: Request, res: Response): Promise<void> {
    // ver se a url já existe
    const { originURL } = req.body
    const url = await URLModel.findOne({ originURL })
    if (url) {
      res.json(url)
      return
    }
    // se não existir, criar o hash para essa url
    const hash = shortId.generate()
    const shortURL = `${config.API_URL}/${hash}`
    // salvar a url no banco
    const newURL = await URLModel.create({ hash, shortURL, originURL })
    // Retornar a url que a gente salvou
    res.json(newURL)
  }

  public async redirect(req: Request, res: Response): Promise<void> {
    // pegar hash da URL
    const { hash } = req.params
    // Encontrar a URL original pelo hash
    const url = await URLModel.findOne({ hash })
    // Redirecionar para a URL original a partir do que encontramos no DB
    if (url) {
      res.redirect(url.originURL)
      return
    }
    res.status(400).json({ error: 'URL not found'})
  }
}