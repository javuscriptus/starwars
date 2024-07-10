// store/characterStore.ts
import create from 'zustand';
import axios from 'axios';
import { CharacterType } from '../types';

interface CharacterState {
  characters: CharacterType[];
  count: number;
  loading: boolean;
  resourceData: { [key: string]: any };
  fetchCharacters: (page: number, search: string) => void;
  fetchResourceData: (url: string) => Promise<any>;
  updateCharacter: (updatedCharacter: CharacterType) => void;
  getCharacter: (id: string) => CharacterType | undefined;
  getResourceData: (url: string) => any;
  updateResourceData: (url: string, data: any) => void;
  resetCharacters: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  count: 0,
  loading: false,
  resourceData: {},
  fetchCharacters: async (page, search) => {
    set({ loading: true });
    try {
      const response = await axios.get('https://swapi.dev/api/people/', {
        params: { page, search },
      });
      const fetchedCharacters = response.data.results;
      const totalCount = response.data.count;

      // Fetch and combine resources for each character
      const charactersWithResources = await Promise.all(
        fetchedCharacters.map(async (char: CharacterType) => {
          const resourceUrls = [
            char.homeworld,
            ...char.films,
            ...char.species,
            ...char.vehicles,
            ...char.starships,
          ];
          const resources = await Promise.all(
            resourceUrls.map(url => get().fetchResourceData(url))
          );

          // Merge character data with fetched resources
          return {
            ...char,
            resources: resourceUrls.reduce((acc, url, index) => {
              acc[url] = resources[index];
              return acc;
            }, {} as { [key: string]: any }),
          };
        })
      );

      set({
        characters: charactersWithResources,
        count: totalCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch characters:', error);
    }
  },
  fetchResourceData: async (url: string) => {
    const { resourceData } = get();
    if (!resourceData[url]) {
      try {
        const response = await axios.get(url);
        set(state => ({
          resourceData: {
            ...state.resourceData,
            [url]: response.data,
          },
        }));
        return response.data;
      } catch (error) {
        console.error('Failed to fetch resource data:', error);
        return null;
      }
    }
    return resourceData[url];
  },
  updateCharacter: updatedCharacter => {
    set(state => ({
      characters: state.characters.map(char =>
        char.url === updatedCharacter.url ? updatedCharacter : char
      ),
    }));
  },
  getCharacter: id => {
    return get().characters.find(char => char.url.includes(id));
  },
  getResourceData: url => {
    return get().resourceData[url];
  },
  updateResourceData: (url, data) => {
    set(state => ({
      resourceData: {
        ...state.resourceData,
        [url]: data,
      },
    }));
  },
  resetCharacters: () => {
    set({ characters: [], resourceData: {} });
  },
}));
