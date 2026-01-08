
import yaml from 'js-yaml';
import { GameItem } from '../types';

/**
 * Loads the game questions and configuration from the local YAML file.
 * @param path - Path to the yaml file (default: ./questions.yaml)
 * @returns Promise<GameItem[]> - Array of parsed Questions and Transitions
 */
export const loadQuestions = async (path: string = './questions.yaml'): Promise<GameItem[]> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as GameItem[];
    return data;
  } catch (error) {
    console.error("YamlLoader: Failed to load questions", error);
    throw error;
  }
};
