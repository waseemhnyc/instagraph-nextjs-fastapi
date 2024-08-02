export interface Chat extends Record<string, any> {
  id: string
  searchValue: string
  results: SearchResult
  userId: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export type SearchResult = {
  nodes: ChatNode[];
  edges: ChatEdge[];
}

export type ChatNode = {
  id: string;
  data: {
    label: string;
  };
  resizing: boolean;
  position: {
    x: number;
    y: number;
  };
  style: {
    color: string;
    background: string;
    width: string;
  };
  draggable: boolean;
  selectable: boolean;
  deletable: boolean;
};

export type ChatEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
  status: boolean
  status_checked_timestamp: Date,
  session_key: string[]
}
