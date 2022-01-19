import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';
import {UserAction, UpdateType} from '../const.js';
import {render, RenderPosition, remove, replace} from '../utils/render';

export default class MoviePresenter {
  #moviesContainer = null;
  #changeData = null;

  #movieCardComponent = null;
  #popupComponent = null;
  #siteFooterElement = null;

  #movie = null;

  constructor(moviesContainer, changeData) {
    this.#moviesContainer = moviesContainer;
    this.#changeData = changeData;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieCardComponent = this.#movieCardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#movieCardComponent = new MovieCardView(movie);

    this.#siteFooterElement = document.querySelector('.footer');

    this.#movieCardComponent.setMovieLinkClickHandler(this.#handleMovieLinkClick);

    this.#movieCardComponent.setMovieWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setMovieWatchedClickHandler(this.#handleWatchedClick);
    this.#movieCardComponent.setMovieFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieCardComponent === null) {
      render(this.#moviesContainer, this.#movieCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (prevMovieCardComponent.element.parentElement !== null && this.#movieCardComponent !== prevMovieCardComponent) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    if (this.#popupComponent !== null && prevPopupComponent.element.parentElement !== null && this.#popupComponent !== prevPopupComponent) {
      replace(this.#popupComponent, prevPopupComponent);
    }
    remove(prevMovieCardComponent);
    remove(prevPopupComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleClosePopupClick();
    }
  }

  #handleClosePopupClick = () => {
    this.#popupComponent.reset();
    this.#popupComponent.element.remove();
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleMovieLinkClick = () => {
    this.#changeData(
      UserAction.GET_COMMENTS,
      UpdateType.PATCH,
      {...this.#movie}).finally(() => {
      if (this.#siteFooterElement.firstElementChild.classList.contains('film-details')) {
        this.#siteFooterElement.querySelector('.film-details__close-btn').click();
      }

      this.#popupComponent = new PopupView(this.#movie);

      render(this.#siteFooterElement, this.#popupComponent.element, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.querySelector('body').classList.add('hide-overflow');
      this.#popupComponent.setClosePopupHandler(this.#handleClosePopupClick);
      this.#popupComponent.setMoviePopupWatchlistClickHandler(this.#handleWatchlistClick);
      this.#popupComponent.setMoviePopupWatchedClickHandler(this.#handleWatchedClick);
      this.#popupComponent.setMoviePopupFavoriteClickHandler(this.#handleFavoriteClick);
      this.#popupComponent.setPopupDeleteCommentHandler(this.#handleDeleteCommentClick);
      this.#popupComponent.setPopupAddCommentHandler(this.#handleAddCommentClick);
    });
  };

  #handleWatchlistClick = () => {
    this.#movie.userDetails.isInWatchlist = !this.#movie.userDetails.isInWatchlist;
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie}
    );
  }

  #handleWatchedClick = () => {
    this.#movie.userDetails.isAlreadyWatched = !this.#movie.userDetails.isAlreadyWatched;
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie}
    );
  }

  #handleFavoriteClick = () => {
    this.#movie.userDetails.isInFavorite = !this.#movie.userDetails.isInFavorite;
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie}
    );
  }

  #handleDeleteCommentClick = (commentId) => {
    const index = this.#movie.comments.findIndex((comment) => comment.id === commentId);

    this.#movie.comments = [
      ...this.#movie.comments.slice(0, index),
      ...this.#movie.comments.slice(index + 1),
    ];
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this.#movie}
    );
  }

  #handleAddCommentClick = (newComment) => {
    this.#movie.comments = [
      {...newComment},
      ...this.#movie.comments,
    ];

    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...this.#movie}
    );
  }
}