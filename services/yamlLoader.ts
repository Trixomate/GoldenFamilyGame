
import yaml from 'js-yaml';
import { GameItem } from '../types';

/**
 * Parses YAML string content into GameItem array.
 */
export const parseYamlContent = (content: string): GameItem[] => {
  try {
    const data = yaml.load(content) as GameItem[];
    if (!Array.isArray(data)) {
        throw new Error('Parsed YAML is not an array.');
    }
    return data;
  } catch (error) {
    console.error("YamlLoader: Failed to parse content", error);
    throw error;
  }
};

/**
 * Loads the game questions and configuration from the local YAML file.
 * @param path - Path to the yaml file (default: ./questions.yaml)
 * @returns Promise<GameItem[]> - Array of parsed Questions and Transitions
 */
export const loadQuestions = async (path: string = './questions.yaml'): Promise<GameItem[]> => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'questions.yaml');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    return parseYamlContent(yamlText);
  } catch (error) {
    console.error("YamlLoader: Failed to load questions", error);
    throw error;
  }
};
