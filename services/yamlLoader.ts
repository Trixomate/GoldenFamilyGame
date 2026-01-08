
import yaml from 'js-yaml';
import { GameItem, Question, Transition } from '../types';

/**
 * Validates the structure of the game data.
 * Throws an error if the data is invalid.
 */
export const validateGameData = (data: any): GameItem[] => {
  if (!Array.isArray(data)) {
    throw new Error("Root element must be a list (Array) of items.");
  }

  if (data.length === 0) {
    throw new Error("The file is empty. Please add at least one transition or question.");
  }

  data.forEach((item, index) => {
    const i = index + 1;
    if (!item.type) {
      // Allow implicit question type if structure matches, otherwise fail
      if (item.question && Array.isArray(item.answers)) {
        item.type = 'question';
      } else {
         throw new Error(`Item #${i}: Missing 'type' property (expected 'question' or 'transition').`);
      }
    }

    if (item.type === 'transition') {
      if (!item.title) throw new Error(`Item #${i} (Transition): Missing 'title'.`);
    } 
    else if (item.type === 'question') {
      if (!item.question) throw new Error(`Item #${i} (Question): Missing 'question' text.`);
      if (!Array.isArray(item.answers)) throw new Error(`Item #${i} (Question): 'answers' must be a list.`);
      if (item.answers.length < 1) throw new Error(`Item #${i} (Question): Must have at least one answer.`);
      
      item.answers.forEach((ans: any, aIdx: number) => {
        if (!ans.text) throw new Error(`Item #${i}, Answer #${aIdx + 1}: Missing 'text'.`);
        if (typeof ans.percentage !== 'number') throw new Error(`Item #${i}, Answer #${aIdx + 1}: Missing or invalid 'percentage'.`);
      });
    } 
    else {
      throw new Error(`Item #${i}: Unknown type '${item.type}'.`);
    }
  });

  return data as GameItem[];
};

export const parseYamlContent = (content: string): GameItem[] => {
  try {
    const parsed = yaml.load(content);
    return validateGameData(parsed);
  } catch (e: any) {
    throw new Error(e.message || "Invalid YAML syntax.");
  }
};

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
    return parseYamlContent(yamlText);
  } catch (error: any) {
    console.error("YamlLoader: Failed to load questions", error);
    throw error;
  }
};
