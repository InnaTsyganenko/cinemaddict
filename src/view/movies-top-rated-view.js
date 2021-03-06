import AbstractView from './abstract-view.js';

const createMoviesListTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container"></div>
</section>`
);
export default class MoviesTopRatedView extends AbstractView {
  get template() {
    return createMoviesListTopRatedTemplate();
  }
}

