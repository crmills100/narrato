// Root object
export interface StoryFile {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  rating: string;
  XXdownloads: string;   // could be number, but sample JSON uses string
  XXsize_mb: string;     // could be number, but sample JSON uses string
  estimated_play_time: string; // could be number
  tags: string[];
  XXprice: string;       // currency in string form
  XXfeatured: string;    // "true" | "false" (string in your sample, not boolean)
  story: Story;
}

export interface Story {
  assets: Assets;
  nodes: Record<string, StoryNode>;
  start_node: string;
}

export interface Assets {
  images: Record<string, ImageAsset>;
  audio: Record<string, AudioAsset>;
}

export interface ImageAsset {
  path: string;
  alt_text: string;
  format: string; // e.g., "png"
}

export interface AudioAsset {
  path: string;
  loop: string;   // "true" | "false" in your JSON
  volume: string; // string, could be number
  format: string; // e.g., "mp3"
}

export interface StoryNode {
  title?: string;
  content: StoryContent;
  choices: Choice[];
}

export interface StoryContent {
  text: string;
  image?: string; // key into assets.images
  audio?: string; // key into assets.audio
}

export interface Choice {
  id: string;
  text: string;
  target: string; // node id
}

export type RootStackParamList = {
  StoryList: undefined;
  StoryScreen: { story: Story };
};