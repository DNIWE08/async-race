// export const BASE_URL = 'http://127.0.0.1:3000';
export const BASE_URL = 'https://calm-sea-63599.herokuapp.com';

export enum path {
  GARAGE = '/garage',
  ENGINE = '/engine',
  WINNERS = '/winners',
}

export const HEADER_TOTAL_COUNT = 'X-Total-Count';

export enum Engine {
  STARTED = 'started',
  STOPPED = 'stopped',
  DRIVE = 'drive',
}

export enum SortDirection {
  TO_MAX = 'ASC',
  TO_MIN = 'DESC',
}

export enum SortBy {
  ID = 'id',
  WINS = 'wins',
  TIME = 'time',
}

export const GARAGE_LIMIT = 7;

export const WINNERS_LIMIT = 10;
