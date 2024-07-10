// pages/CharacterListPage.tsx
import React, { useEffect, useState } from 'react';

import { Pagination, Input } from 'antd';
import { CharacterType } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacterStore } from '../hooks/useCharacterStore';
import { CharacterCard, Loader } from '../components';

import './CharacterListPage.css';
import { useDebounce } from '../hooks/useDebounce';

const CharacterListPage: React.FC = () => {
  const { page = 1 } = useParams<{ page: string }>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { characters, count, fetchCharacters, resetCharacters, loading } =
    useCharacterStore();
  const navigate = useNavigate();

  useEffect(() => {
    resetCharacters();
    fetchCharacters(Number(page), debouncedSearch);
  }, [page, debouncedSearch, fetchCharacters, resetCharacters]);

  const handlePageChange = (newPage: number) => {
    navigate(`/page/${newPage}`);
  };

  return (
    <div className='app-wrapper'>
      <div className='main-content'>
        <Input
          placeholder='Search Characters'
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        {loading ? (
          <Loader />
        ) : (
          <div className='character-list-wrapper'>
            {characters.map((character: CharacterType) => {
              return (
                <CharacterCard key={character.url} character={character} />
              );
            })}

            <Pagination
              current={Number(page)}
              total={count}
              pageSize={10}
              onChange={handlePageChange}
              showSizeChanger={false}
              simple
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterListPage;
