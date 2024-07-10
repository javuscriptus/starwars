import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

import { CharacterType } from '../types';
import { useCharacterStore } from '../hooks/useCharacterStore';

import './CharacterDetailPage.css';
import { Loader } from '../components';

const { TextArea } = Input;

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    getCharacter,
    updateCharacter,
    fetchResourceData,
    getResourceData,
    updateResourceData,
  } = useCharacterStore();
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        let char = getCharacter(id);
        if (!char) {
          const response = await axios.get(
            `https://swapi.dev/api/people/${id}/`
          );
          char = response.data;
        }
        if (char) {
          setCharacter(char);
          const resourceUrls = [
            char.homeworld,
            ...char.films,
            ...char.species,
            ...char.vehicles,
            ...char.starships,
          ];
          await Promise.all(resourceUrls.map(url => fetchResourceData(url)));

          form.setFieldsValue({
            ...char,
            homeworld: getResourceData(char.homeworld)?.name || char.homeworld,
            films: char.films
              .map(film => getResourceData(film)?.title || film)
              .join(', '),
            species: char.species
              .map(species => getResourceData(species)?.name || species)
              .join(', '),
            vehicles: char.vehicles
              .map(vehicle => getResourceData(vehicle)?.name || vehicle)
              .join(', '),
            starships: char.starships
              .map(starship => getResourceData(starship)?.name || starship)
              .join(', '),
          });
        }
      } catch (error) {
        console.error('Failed to fetch character data:', error);
        message.error('Failed to load character data');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetData();
  }, [id, getCharacter, fetchResourceData, getResourceData, form]);

  const onSave = async () => {
    try {
      const values = form.getFieldsValue();
      const updatedCharacter = { ...character, ...values };
      updateCharacter(updatedCharacter as CharacterType);

      const resourceUrls = [
        character?.homeworld,
        ...(character?.films || []),
        ...(character?.species || []),
        ...(character?.vehicles || []),
        ...(character?.starships || []),
      ];

      resourceUrls.forEach(url => {
        const data = getResourceData(url);
        if (data) {
          updateResourceData(url, data);
        }
      });

      message.success('Character data saved successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Failed to save character data:', error);
      message.error('Failed to save character data');
    }
  };

  if (loading || !character) return <Loader />;

  return (
    <div className='character-detail'>
      <div className='character-header'>
        <h2>{character.name}</h2>
        <Button
          type='default'
          onClick={() => navigate(-1)}
          className='back-button'
        >
          Back
        </Button>
      </div>
      <Form form={form} layout='vertical' onFinish={onSave}>
        <div className='character-info'>
          <Form.Item name='height' label='Height'>
            <Input />
          </Form.Item>
          <Form.Item name='mass' label='Mass'>
            <Input />
          </Form.Item>
          <Form.Item name='hair_color' label='Hair Color'>
            <Input />
          </Form.Item>
          <Form.Item name='skin_color' label='Skin Color'>
            <Input />
          </Form.Item>
          <Form.Item name='eye_color' label='Eye Color'>
            <Input />
          </Form.Item>
          <Form.Item name='birth_year' label='Birth Year'>
            <Input />
          </Form.Item>
          <Form.Item name='gender' label='Gender'>
            <Input />
          </Form.Item>
          <Form.Item name='homeworld' label='Homeworld'>
            <Input />
          </Form.Item>
          <Form.Item name='films' label='Films'>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name='species' label='Species'>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name='vehicles' label='Vehicles'>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name='starships' label='Starships'>
            <TextArea rows={3} />
          </Form.Item>
        </div>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CharacterDetailPage;
