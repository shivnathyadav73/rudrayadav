
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface AppState {
  logo: string | null;
  isGenerating: boolean;
  generatedImages: GeneratedImage[];
  error: string | null;
}
