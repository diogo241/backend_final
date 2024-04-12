import { IMovies } from '../interfaces/interfaces.js';
import FileService from '../utils/FileService.js';
import jsonFileReader from '../utils/jsonFileReader.js';

const moviesPath = './src/data/movies.json';

class MoviesService {
  getAll(): IMovies[] {
    return jsonFileReader.readFileJson(moviesPath);
  }

  getOne(movieId: number): IMovies | undefined {
    const movies: IMovies[] = jsonFileReader.readFileJson(moviesPath);
    return movies.find((movie) => movie.id === movieId);
  }

  create(movieData: any, imageFile: any): IMovies {
    const { title, releaseDate, trailerLink, genders } = movieData;
    const movies: IMovies[] = jsonFileReader.readFileJson(moviesPath);
    const lastId = movies.length > 0 ? movies[movies.length - 1].id : 0;
    let poster = 'no-image.jpg';

    const newMovie: IMovies = {
      id: lastId + 1,
      title,
      releaseDate,
      trailerLink,
      genders,
      poster,
    };
    if (imageFile) {
      newMovie.poster = FileService.save(imageFile);
    }
    movies.push(newMovie);
    jsonFileReader.writeFileJson(moviesPath, movies);
    return newMovie;
  }

  update(
    movieData: any,
    movieId: number,
    moviePoster: any
  ): IMovies | undefined {
    const { title, releaseDate, trailerLink, genders } = movieData;
    const movies: IMovies[] = jsonFileReader.readFileJson(moviesPath);
    const movieIndex = movies.findIndex(
      (movie) => movie.id === movieId
    );

    if (movieIndex === -1) return undefined;

    const updatedMovie: IMovies = {
      id: movieId,
      title,
      releaseDate,
      trailerLink,
      genders,
      poster: movies[movieIndex].poster,
    };
    if (moviePoster) {
      FileService.delete(movies[movieIndex].poster);
      updatedMovie.poster = FileService.save(moviePoster);
    }
    movies[movieIndex] = updatedMovie;
    jsonFileReader.writeFileJson(moviesPath, movies);
    return updatedMovie;
  }

  delete(movieId: number): IMovies | undefined {
    const movies: IMovies[] = jsonFileReader.readFileJson(moviesPath);
    const movieIndex = movies.findIndex(
      (movie) => movie.id === movieId
    );

    if (movieIndex === -1) {
      return undefined;
    }
    FileService.delete(movies[movieIndex].poster);
    const deleteMovie = movies.splice(movieIndex, 1);

    jsonFileReader.writeFileJson(moviesPath, movies);

    return deleteMovie[0];
  }
}

export default new MoviesService();
