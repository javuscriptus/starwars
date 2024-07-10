import React, { useEffect } from 'react';
import { Card, Tooltip, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import './CharacterCard.css';
import { CharacterType } from '../../types';
import { useCharacterStore } from '../../hooks/useCharacterStore';

interface CharacterCardProps {
  character: CharacterType;
}

const renderTooltipContent = (data: any) => {
  if (!data) return null;

  if (data.title) {
    return (
      <div>
        <p>
          <strong>Title:</strong> {data.title}
        </p>
        <p>
          <strong>Episode:</strong> {data.episode_id}
        </p>
        <p>
          <strong>Director:</strong> {data.director}
        </p>
        <p>
          <strong>Producer:</strong> {data.producer}
        </p>
        <p>
          <strong>Release Date:</strong> {data.release_date}
        </p>
      </div>
    );
  }

  if (data.name) {
    return (
      <div>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        {data.model && (
          <p>
            <strong>Model:</strong> {data.model}
          </p>
        )}
        {data.manufacturer && (
          <p>
            <strong>Manufacturer:</strong> {data.manufacturer}
          </p>
        )}
        {data.climate && (
          <p>
            <strong>Climate:</strong> {data.climate}
          </p>
        )}
        {data.terrain && (
          <p>
            <strong>Terrain:</strong> {data.terrain}
          </p>
        )}
        {data.population && (
          <p>
            <strong>Population:</strong> {data.population}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const navigate = useNavigate();
  const fetchResourceData = useCharacterStore(state => state.fetchResourceData);
  const getResourceData = useCharacterStore(state => state.getResourceData);

  useEffect(() => {
    const urls = [
      character.homeworld,
      ...character.films,
      ...character.species,
      ...character.vehicles,
      ...character.starships,
    ];
    urls.forEach(url => fetchResourceData(url));
  }, [character, fetchResourceData]);

  const handleCardClick = () => {
    const id = character.url.split('/').filter(Boolean).pop();
    navigate(`/character/${id}`);
  };

  const renderLink = (url: string, index: number) => {
    const data = character.resources[url] || getResourceData(url);

    return (
      <Tooltip
        key={index}
        title={data ? renderTooltipContent(data) : <Spin size='small' />}
      >
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          onClick={e => e.preventDefault()}
        >
          {data?.name || data?.title || `Link ${index + 1}`}
        </a>
      </Tooltip>
    );
  };

  const renderLinks = (urls: string[]) => (
    <div className='links'>
      {urls.map((url, index) => (
        <span key={url}>
          {renderLink(url, index)}
          {index < urls.length - 1 && ', '}
        </span>
      ))}
    </div>
  );

  return (
    <Card
      className='character-card'
      title={character.name}
      onClick={handleCardClick}
    >
      {character.height && (
        <p>
          <strong>Height:</strong> {character.height}
        </p>
      )}
      {character.mass && (
        <p>
          <strong>Mass:</strong> {character.mass}
        </p>
      )}
      {character.hair_color && (
        <p>
          <strong>Hair Color:</strong> {character.hair_color}
        </p>
      )}
      {character.skin_color && (
        <p>
          <strong>Skin Color:</strong> {character.skin_color}
        </p>
      )}
      {character.eye_color && (
        <p>
          <strong>Eye Color:</strong> {character.eye_color}
        </p>
      )}
      {character.birth_year && (
        <p>
          <strong>Birth Year:</strong> {character.birth_year}
        </p>
      )}
      {character.gender && (
        <p>
          <strong>Gender:</strong> {character.gender}
        </p>
      )}
      {character.homeworld && (
        <p>
          <strong>Homeworld:</strong>
          {renderLink(character.homeworld, 0)}
        </p>
      )}
      {character.films.length > 0 && (
        <p>
          <strong>Films:</strong> {renderLinks(character.films)}
        </p>
      )}
      {character.species.length > 0 && (
        <p>
          <strong>Species:</strong> {renderLinks(character.species)}
        </p>
      )}
      {character.vehicles.length > 0 && (
        <p>
          <strong>Vehicles:</strong> {renderLinks(character.vehicles)}
        </p>
      )}
      {character.starships.length > 0 && (
        <p>
          <strong>Starships:</strong> {renderLinks(character.starships)}
        </p>
      )}
    </Card>
  );
};

export default CharacterCard;
