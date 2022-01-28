import { ICar, IUpadateWinner, IUpdateCar, IWinner } from '../shared/interfaces';
import {
  BASE_URL,
  Engine,
  GARAGE_LIMIT,
  HEADER_TOTAL_COUNT,
  path,
  SortBy,
  SortDirection,
  WINNERS_LIMIT,
} from './api-config';

interface IQueryParams {
  key: string;
  value: string;
}

const generateQueryString = (queryParams: IQueryParams[]) =>
  queryParams.length ? `?${queryParams.map((x) => `${x.key}=${x.value}`).join('&')}` : '';

// : Promise<{cars: Array<IUpdateCar | IWinner>, count: string | null}>

export const getData = async (usePath: string = path.GARAGE, page: number = 1, limit: number = GARAGE_LIMIT) => {
  const response = await fetch(`${BASE_URL}${usePath}?_page=${page}&_limit=${limit}`);
  return {
    cars: await response.json(),
    count: response.headers.get(HEADER_TOTAL_COUNT),
  };
};

export const getWinners = async () => (await fetch(`${BASE_URL}${path.WINNERS}`)).json().catch();
// http://127.0.0.1:3000/winners?_page=1&_limit=10&_sort=id&_order=ASC

export const getSortedWinners = async (
  page: number,
  sortBy: string | null = SortBy.ID,
  sortDirection: string | null = SortDirection.TO_MAX
) => {
  const response = await fetch(
    `${BASE_URL}${path.WINNERS}?_page=${page}&_limit=10&_sort=${sortBy}&_order=${sortDirection}`
  );
  return {
    cars: await response.json(),
    count: response.headers.get(HEADER_TOTAL_COUNT),
  };
};

export const getAllCars = async () => (await fetch(`${BASE_URL}${path.GARAGE}`)).json().catch();

export const getCar = async (id: number) => (await fetch(`${BASE_URL}${path.GARAGE}/${id}`)).json();

export const createCar = async (body: ICar) =>
  (
    await fetch(`${BASE_URL}${path.GARAGE}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const createWinner = async (body: IWinner) =>
  (
    await fetch(`${BASE_URL}${path.WINNERS}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const deleteGarageCar = async (id: number) =>
  (await fetch(`${BASE_URL}${path.GARAGE}/${id}`, { method: 'DELETE' })).json();

export const deleteWinnerCar = async (id: number) =>
  (await fetch(`${BASE_URL}${path.WINNERS}/${id}`, { method: 'DELETE' })).json();

export const updateCar = async (id: number, body: ICar) =>
  (
    await fetch(`${BASE_URL}${path.GARAGE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const updateWinner = async (id: number, body: IUpadateWinner) =>
  (
    await fetch(`${BASE_URL}${path.WINNERS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const getEngineMode = async (id: number, status: string) =>
  (
    await fetch(`${BASE_URL}${path.ENGINE}?id=${id}&status=${status}`, {
      method: 'PATCH',
    })
  ).json();

export const getEngine = async (id: number) => {
  return (
    await fetch(`${BASE_URL}${path.ENGINE}?id=${id}&status=${Engine.DRIVE}`, {
      method: 'PATCH',
    }).catch()
  ).status;
};
