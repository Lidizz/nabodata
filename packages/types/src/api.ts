export interface ApiResponse<T> {
  data: T;
  meta: {
    generatedAt: string;
    cached: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

export interface SearchParams {
  q: string;
  lang?: 'nb' | 'en';
}

export interface I18nParams {
  lang: 'nb' | 'en';
}

export interface HealthResponse {
  status: 'ok';
  version: string;
}
