import MainNavView from './view/main-nav-view';
import StatsView from './view/stats-view';
import NumberOfFilmsView from './view/number-of-films-view';
import UserInfoPresenter from './presenter/user-info-presenter';
import FilterPresenter from './presenter/filter-presenter';
import MoviesPresenter from './presenter/movies-presenter';
import {render, RenderPosition} from './utils/render';
import UserInfoModel from './model/user-info-model';
import FilterModel from './model/filter-model';
import MoviesModel from './model/movies-model';
import ApiService from './api-service';

const AUTHORIZATION = 'Basic kljhkjdfhgkjdfhgkjdhfgkjdhdfhhjjhk';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const mainNavComponent = new MainNavView();

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));

const userInfoModel = new UserInfoModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const userInfoPresenter = new UserInfoPresenter(siteHeaderElement, userInfoModel, moviesModel);
const filterPresenter = new FilterPresenter(mainNavComponent.element, filterModel, moviesModel);
const moviesPresenter = new MoviesPresenter(siteMainElement, siteFooterElement, moviesModel, filterModel, userInfoModel);

const handleSiteMenuClick = (menuItem) => {
  let statsComponent =  null;
  const userRank = ((siteHeaderElement.querySelector('.profile__rating') === null) ? '' : siteHeaderElement.querySelector('.profile__rating').textContent);
  const userSrcImg = siteHeaderElement.querySelector('.profile__avatar').src;
  const isInHistoryMovies = moviesModel.movies.filter((movie) => movie.userDetails.isAlreadyWatched);
  switch (menuItem.value) {
    case 'main-navigation__additional main-navigation__additional--active':
      moviesPresenter.destroy();
      statsComponent = new StatsView(userRank, userSrcImg, isInHistoryMovies);
      render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
      break;
    default:
      moviesPresenter.init();
      document.querySelector('.statistic').remove();
      break;
  }
};

userInfoPresenter.init();
filterPresenter.init();
moviesPresenter.init();

moviesModel.init().finally(() => {
  render(siteMainElement, mainNavComponent, RenderPosition.AFTERBEGIN);
  mainNavComponent.setMenuClickHandler(handleSiteMenuClick);

  render(siteFooterElement, new NumberOfFilmsView(moviesModel.movies.length), RenderPosition.BEFOREEND);
});
