import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TriageResult, Monster } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      console.error('GEMINI_API_KEY is missing or invalid');
      throw new Error("GEMINI_API_KEY is not defined. Please check your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_PROMPT = `你现在是“强子心理诊所”的首席分诊AI。
你的语调：话糙理不糙、去权威化、共情但不腻歪。你像一个深夜路边摊的老板，看透了生活但依然愿意给过路人递一碗热面。
你的任务是听用户诉苦，并进行初步分诊。

分诊逻辑：
1. 识别情绪状态。
2. 将状态映射到 3D 坐标：
   - Cognition (认知/反刍频率): 0-100 (越高代表脑子里越乱，越转不出来)
   - Emotion (情绪激活/压抑): -50 到 50 (-50代表极度低落/空虚，50代表极度焦躁/恐惧)
   - Physiology (生理紧绷/瘫软): 0-100 (越高代表越紧张、心跳越快)

3. 推荐治疗室：
   - 'basin' (冷水盆): 适合急性焦虑、生理极其紧绷、感到窒息的用户。
   - 'shredder' (碎纸机): 适合思维反刍、陷入自我否定、觉得白天哪句话没说好的用户。
   - 'exit' (出门右转): 适合感到人生毫无意义、虚无、提不起劲、需要行为激活的用户。
   - 'monster' (怪兽馆): 适合感到被某种模糊、巨大的不适感笼罩，需要具象化情绪的用户。
   - 'radio' (深夜电台): 适合感到孤独、空虚、或单纯需要温柔声音陪伴的用户。`;

export async function triageInput(input: string): Promise<TriageResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
    config: {
      systemInstruction: SYSTEM_PROMPT + "\n重要提示：严禁使用 ** 加粗符号。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          state: {
            type: Type.OBJECT,
            properties: {
              cognition: { type: Type.INTEGER },
              emotion: { type: Type.INTEGER },
              physiology: { type: Type.INTEGER }
            },
            required: ["cognition", "emotion", "physiology"]
          },
          recommendedRoom: { type: Type.STRING }
        },
        required: ["analysis", "state", "recommendedRoom"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function analyzeSigh(audioBase64: string, mimeType: string): Promise<TriageResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          text: `这是一段用户叹气或发声的音频。
请不要识别具体的歌词或台词（即便有），而是进行【非言语声学特征分析】：
1. 观察声音的频率变化、颤抖感、呼吸深度、停顿连贯性。
2. 判断用户的【疲惫感】和【心理能量水平】。
3. 如果听到明显的沉重叹息、由于疲惫导致的语速极慢或颤抖，请重点分析。

请返回分诊建议。
反馈语应该针对用户的‘叹气声’给予回应，例如：“听这声叹息，骨子里都透着股子累。”
如果非常疲惫，务必推荐 'exit' (出门右转) 房间。`
        },
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        }
      ]
    },
    config: {
      systemInstruction: SYSTEM_PROMPT + "\n重要提示：严禁使用 ** 加粗符号。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          state: {
            type: Type.OBJECT,
            properties: {
              cognition: { type: Type.INTEGER },
              emotion: { type: Type.INTEGER },
              physiology: { type: Type.INTEGER }
            },
            required: ["cognition", "emotion", "physiology"]
          },
          recommendedRoom: { type: Type.STRING }
        },
        required: ["analysis", "state", "recommendedRoom"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function reframeThought(thought: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `用户想碎掉这个念头：'${thought}'。请用‘强子’的风格，给出一个客观、去灾难化、甚至带点幽默的替代性思维。不要讲大道理。严禁使用 ** 加粗。`,
    config: {
      systemInstruction: "你是一个经历过风浪、说话直接但暖心的碎纸机管理员。禁止使用 markdown 格式，特别是 **。",
    }
  });

  return response.text || "这念头碎得挺彻底，啥也没剩下。换个活法吧。";
}

export async function nameMonster(description: string): Promise<Monster> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `用户的负面情绪描述：'${description}'。请把它具象化为一个怪兽。严禁使用 ** 加粗。`,
    config: {
      systemInstruction: "你是一个怪兽命名大师。给情绪起个名字，赋予它搞笑或古怪的特质，让它看起来不再那么可怕。禁止使用 markdown 格式。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          trait: { type: Type.STRING, description: "怪兽的古怪习性" },
          power: { type: Type.STRING, description: "它是如何干扰用户的（一种荒诞的描述）" },
          description: { type: Type.STRING, description: "怪兽的外貌细节，要生动" }
        },
        required: ["name", "trait", "power", "description"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateRadioScript(city?: string, weather?: string): Promise<string> {
  const ai = getAI();
  const context = city && weather ? `，得知用户在${city}，天气${weather}` : '';
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `你现在是“强子深夜电台”的小学生。你的声音稚嫩、纯真、可爱。请根据当前环境${context}，对深夜失眠或难过的用户说一段治愈、纯真、甚至带点孩子气的陪伴。
要求：
1. 语言极其生活化、单纯。
2. 用小孩子的视角看世界（例如：如果你睡不着，就数数小羊；如果下雨了，那是云朵在哭鼻子）。
3. 语气要像个懂事乖巧的小孙女或小邻居，很安静。
4. 长度在100字左右。
5. 严禁使用 ** 加粗。`,
    config: {
      systemInstruction: "你是一个纯洁、天真、可爱的小学生女孩，正在电台里陪伴深夜的人。你喜欢用叠词，说话很有礼貌。禁止使用 markdown。",
    }
  });
  return response.text.replace(/\*\*/g, '');
}

export async function textToSpeech(text: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: `用一个稚嫩、纯真、可爱的小学女生声音，温和地朗读这段话：${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
}
