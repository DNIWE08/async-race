export interface ICar {
  name: string;
  color: string;
}

export interface IUpdateCar {
  id: number;
  name: string;
  color: string;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IUpadateWinner {
  wins: number;
  time: number;
}

export type SortedType = {
  by: string;
  direction: string;
};
