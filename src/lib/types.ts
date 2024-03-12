export interface Tool {
    name?: string;
    description?: string;
    maxTokens?: number;
    modelName?: string;
    jsonResponse?: boolean;
    temperature?: number | null;
    cache?: boolean | null;
    internalPrompt?: boolean | null;
    arguments?: JSONSchema | null;
    tools?: string[];
    export?: string[];
    instructions?: string;
    id?: string;
    toolMapping?: { [key: string]: string };
    localTools?: { [key: string]: string };
    source?: ToolSource;
    workingDir?: string;
  }
  
  interface ToolSource {
    location?: string;
    lineNo?: number;
  }
  
  interface JSONSchema {
    property: Property;
    id?: string;
    title?: string;
    properties: { [key: string]: Property };
    required?: string[];
    defs?: { [key: string]: JSONSchema };
    additionalProperties?: boolean;
  }
  
  interface Property {
    description?: string;
    type?: string;
    ref?: string;
    items?: JSONSchema[];
  }