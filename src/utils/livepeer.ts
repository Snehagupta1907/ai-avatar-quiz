import { Livepeer } from "@livepeer/ai";

// Initialize Livepeer client
const livepeer = new Livepeer({
  httpBearer: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY,
});

// Helper function to convert File to Blob
async function fileToBlob(file: File): Promise<Blob> {
  return new Blob([await file.arrayBuffer()], { type: file.type });
}

// Types for function parameters and responses
interface SegmentAnythingParams {
  file: File;
  model: string;
  multimaskOutput?: boolean;
  returnLogits?: boolean;
  normalizeCoords?: boolean;
}

interface SegmentAnythingResponse {
  masks: number[][];
  scores: number[];
  logits?: number[][];
}

interface TextToImageParams {
  model?: string;
  prompt?: string;
  height?: number;
  width?: number;
  guidanceScale?: number;
  negativePrompt?: string;
  safetyCheck?: boolean;
  numInferenceSteps?: number;
  seed?: number;
}

interface ImageToImageParams {
  file: File;
  prompt: string;
  model: string;
  loras?: string;
  strength?: number;
  guidanceScale?: number;
  imgGuidance?: number;
  negativePrompt?: string;
  safetyCheck?: boolean;
  numInferenceSteps?: number;
  numImagesPerPrompt?: number;
}

interface ImageToVideoParams {
  file: File;
  model: string;
  height?: number;
  width?: number;
  fps?: number;
  motionBucketId?: number;
  noiseAugStrength?: number;
  safetyCheck?: boolean;
  numInferenceSteps?: number;
}

interface AudioToTextParams {
  file: File;
  model: string;
  returnTimestamps?: string;
}

interface UpscaleImageParams {
  file: File;
  prompt: string;
  model: string;
  safetyCheck?: boolean;
  numInferenceSteps?: number;
}

interface FaceDetectionParams {
  file: File;
  model?: string;
  confidence?: number;
}

interface FaceDetectionResponse {
  faces: Array<{
    bbox: [number, number, number, number]; // [x, y, width, height]
    confidence: number;
    landmarks?: number[][];
  }>;
  totalFaces: number;
}

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMParams {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  stream?: boolean;
}

interface LLMResponse {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

// Utility functions for Livepeer API calls
const livepeerUtils = {
  async audioToText({ file, model, returnTimestamps }: AudioToTextParams) {
    try {
      const result = await livepeer.generate.audioToText({
        audio: file,
        modelId: model,
        returnTimestamps,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error converting Audio to Text: ${error.message}`);
      }
      throw new Error('An unknown error occurred during audio to text conversion');
    }
  },

  async imageToImage({
    file,
    prompt,
    model,
    loras,
    strength = 0.8,
    guidanceScale = 7.5,
    imgGuidance = 1.5,
    negativePrompt,
    safetyCheck = true,
    numInferenceSteps = 25,
    numImagesPerPrompt = 1,
  }: ImageToImageParams) {
    try {
      const result = await livepeer.generate.imageToImage({
        prompt,
        image: file,
        modelId: model,
        loras,
        strength,
        guidanceScale,
        imageGuidanceScale: imgGuidance,
        negativePrompt,
        safetyCheck,
        numInferenceSteps,
        numImagesPerPrompt,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error converting image to Image: ${error.message}`);
      }
      throw new Error('An unknown error occurred during image to image conversion');
    }
  },

  async imageToVideo({
    file,
    model,
    height = 576,
    width = 1024,
    fps = 6,
    motionBucketId = 127,
    noiseAugStrength = 0.02,
    safetyCheck = true,
    numInferenceSteps = 25,
  }: ImageToVideoParams) {
    try {
      const result = await livepeer.generate.imageToVideo({
        image: file,
        modelId: model,
        height,
        width,
        fps,
        motionBucketId,
        noiseAugStrength,
        safetyCheck,
        numInferenceSteps,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error converting image to video: ${error.message}`);
      }
      throw new Error('An unknown error occurred during image to video conversion');
    }
  },

  async segmentAnything({
    file,
    model,
    multimaskOutput = true,
    returnLogits = false,
    normalizeCoords = true,
  }: SegmentAnythingParams): Promise<SegmentAnythingResponse> {
    try {
      const blob = await fileToBlob(file);
      const result = await livepeer.generate.segmentAnything2({
        image: blob,
        modelId: model,
        multimaskOutput,
        returnLogits,
        normalizeCoords,
      });

      // Parse the response strings into actual arrays
      const response: SegmentAnythingResponse = {
        masks: JSON.parse((result as { masks?: string }).masks || '[]'),
        scores: JSON.parse((result as { scores?: string }).scores || '[]'),
      };
      
      if (returnLogits && (result as { logits?: string }).logits) {
        response.logits = JSON.parse((result as { logits?: string }).logits!);
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error using Segment Anything: ${error.message}`);
      }
      throw new Error('An unknown error occurred during segment anything operation');
    }
  },

  async textToImage(params: TextToImageParams) {
    try {
      const response = await fetch('https://dream-gateway-us-west.livepeer.cloud/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        },
        body: JSON.stringify({
          model_id: params.model || 'SG161222/RealVisXL_V4.0_Lightning',
          prompt: params.prompt || 'default prompt',
          height: params.height || 1024,
          width: params.width || 512,
          guidance_scale: params.guidanceScale || 4.5,
          negative_prompt: params.negativePrompt || 'nothing really',
          safety_check: params.safetyCheck !== undefined ? params.safetyCheck : true,
          num_inference_steps: params.numInferenceSteps || 4,
          seed: params.seed || Math.floor(Math.random() * 1000000),
          num_images_per_prompt: 1,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.images && result.images.length > 0 && result.images[0].url) {
        return result.images[0].url;
      }
      throw new Error('No image URL returned from API');
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error converting text to Image: ${error.message}`);
      }
      throw new Error('An unknown error occurred during text to image conversion');
    }
  },

  async imageToText({ file, model, prompt }: { file: File; model: string; prompt?: string }) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('model_id', model);
      if (prompt) formData.append('prompt', prompt);
      const response = await fetch('https://dream-gateway-us-west.livepeer.cloud/image-to-text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error converting image to text: ${error.message}`);
      }
      throw new Error('An unknown error occurred during image to text conversion');
    }
  },

  async upscaleImage({
    file,
    prompt,
    model,
    safetyCheck = true,
    numInferenceSteps = 25,
  }: UpscaleImageParams) {
    try {
      const result = await livepeer.generate.upscale({
        prompt,
        image: file,
        modelId: model,
        safetyCheck,
        numInferenceSteps,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error upscaling image: ${error.message}`);
      }
      throw new Error('An unknown error occurred during image upscaling');
    }
  },

  async detectFaces({
    file,
  }: Omit<FaceDetectionParams, 'model' | 'confidence'>): Promise<FaceDetectionResponse> {
    try {
      const blob = await fileToBlob(file);
      
      // Create a canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Get image data for analysis
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Simple face detection heuristic based on image characteristics
          // This is a basic implementation - in production, use a proper face detection API
          const response: FaceDetectionResponse = {
            faces: [],
            totalFaces: 0,
          };
          
          // Check if image has reasonable dimensions for a face photo
          if (img.width >= 200 && img.height >= 200) {
            // Calculate average brightness and contrast
            let totalBrightness = 0;
            let totalPixels = 0;
            
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const brightness = (r + g + b) / 3;
              totalBrightness += brightness;
              totalPixels++;
            }
            
            const avgBrightness = totalBrightness / totalPixels;
            
            // If image has reasonable brightness (not too dark or too bright)
            // and reasonable dimensions, assume it contains a face
            if (avgBrightness > 30 && avgBrightness < 220) {
              response.faces = [{
                bbox: [0, 0, img.width, img.height],
                confidence: 0.7,
              }];
              response.totalFaces = 1;
            }
          }
          
          resolve(response);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = URL.createObjectURL(blob);
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error detecting faces: ${error.message}`);
      }
      throw new Error('An unknown error occurred during face detection');
    }
  },

  async llm({
    messages,
    temperature = 0.7,
    max_tokens = 256,
    top_p = 1,
    top_k = -1,
    stream = false,
  }: Omit<LLMParams, 'model'>): Promise<LLMResponse> {
    const model = 'meta-llama/Meta-Llama-3.1-8B-Instruct';
    try {
      const response = await fetch('https://dream-gateway-us-west.livepeer.cloud/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        },
        body: JSON.stringify({
          messages,
          model,
          temperature,
          max_tokens,
          top_p,
          top_k,
          stream,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (stream) {
        // Streaming not supported in this function, fallback to normal
        const result = await response.json();
        return result as LLMResponse;
      } else {
        const result = await response.json();
        return result as LLMResponse;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in LLM request: ${error.message}`);
      }
      throw new Error('An unknown error occurred during LLM request');
    }
  },

  async streamLLM({
    messages,
    temperature = 0.7,
    max_tokens = 256,
    top_p = 1,
    top_k = -1,
    onChunk,
    onComplete,
    onError,
  }: Omit<LLMParams, 'model' | 'stream'> & {
    onChunk: (content: string) => void;
    onComplete: (fullResponse: string) => void;
    onError: (error: string) => void;
  }): Promise<void> {
    const model = 'meta-llama/Meta-Llama-3.1-8B-Instruct';
    try {
      const response = await fetch('https://dream-gateway-us-west.livepeer.cloud/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        },
        body: JSON.stringify({
          messages,
          model,
          temperature,
          max_tokens,
          top_p,
          top_k,
          stream: true,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body for streaming');
      }
      const decoder = new TextDecoder();
      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete(fullResponse);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content;
                fullResponse += content;
                onChunk(content);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        onError(`Error in streaming LLM request: ${error.message}`);
      } else {
        onError('An unknown error occurred during streaming LLM request');
      }
    }
  },
};

export default livepeerUtils; 