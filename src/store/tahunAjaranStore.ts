import { TahunAjaran } from "@/type/Tahunajaran.type";
import { create } from "zustand";

// export interface TahunAjaran {
//   id: string;
//   tahunajaran: string;
//   is_active: boolean;
// }

interface TahunAjaranStore {
  activeTahunAjaran: TahunAjaran | null;
  listTahunAjaran: TahunAjaran[];

  setActiveTahunAjaran: (tahunAjaran: TahunAjaran) => void;

  setListTahunAjaran: (list: TahunAjaran[]) => void;

  reset: () => void;
}

export const useTahunAjaranStore = create<TahunAjaranStore>((set) => ({
  activeTahunAjaran: null,
  listTahunAjaran: [],

  setActiveTahunAjaran: (tahunAjaran) =>
    set({
      activeTahunAjaran: tahunAjaran,
    }),

  setListTahunAjaran: (list) =>
    set({
      listTahunAjaran: list,
    }),

  reset: () =>
    set({
      activeTahunAjaran: null,
      listTahunAjaran: [],
    }),
}));
