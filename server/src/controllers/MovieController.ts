import { IMovies } from '../interfaces/interfaces.js';
import MoviesService from '../services/MoviesService.js';
import FileService from '../utils/FileService.js';
import jsonFileReader from '../utils/jsonFileReader.js';
import { Request, Response } from 'express';

const moviesPath = './src/data/movies.json';

class MovieController {
  getAllMovies(req: Request, res: Response) {
    const movies = MoviesService.getAll();
    return res.json(movies);
  }

  getMovieById(req: Request, res: Response) {
    const movie = MoviesService.getOne(parseInt(req.params.id));
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.json(movie);
  }

  createMovie(req: Request, res: Response) {
    try {
      const newMovie: IMovies = MoviesService.create(
        req.body,
        req.files?.poster
      );
      return res.status(201).json(newMovie);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  updateMovie(req: Request, res: Response) {
    const movieId = parseInt(req.params.id);
    const updatedMovie = MoviesService.update(
      req.body,
      movieId,
      req.files?.poster
    );

    if (!updatedMovie)
      return res.status(404).json({ error: 'Movie not found.' });

    return res.json(updatedMovie);
  }

  deleteMovie(req: Request, res: Response) {
    const deletedMovie = MoviesService.delete(parseInt(req.params.id));

    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.json(deletedMovie);
  }
}

export default new MovieController();
