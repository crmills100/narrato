export type StoryOption = {
  description: string;
  target: string;
};

export type StoryNode = {
  text: string;
  options?: StoryOption[];
  ending?: boolean;
};

export type Story = {
  id: string;
  title: string;
  start: string;
  nodes: { [key: string]: StoryNode };
};

export type RootStackParamList = {
  StoryList: undefined;
  StoryScreen: { story: Story };
};