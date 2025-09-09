const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';
const API_BASE_URL = `${API_BASE}/${API_VERSION}`;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
      return { error: errorData.detail || 'Request failed' };
    }
    
    const data = await response.json();
    return { data };
  }

  // Chats API
  async listChats(): Promise<ApiResponse<{ chats: { chatId: string; name: string; updatedAt: string }[] }>> {
    const response = await fetch(`${API_BASE_URL}/chat/list`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createChat(): Promise<ApiResponse<{ chatId: string; name: string; updatedAt: string }>> {
    const response = await fetch(`${API_BASE_URL}/chat/new`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getChatMessages(chatId: string): Promise<ApiResponse<{ chatId: string; messages: any[] }>> {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Chat API
  async sendMessage(chatId: string, userMessage: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        chatId,
        userMessage,
      }),
    });

    return this.handleResponse(response);
  }

  // Commit API
  async createCommit(chatId: string, name: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/commits/commit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        chatId,
        name,
      }),
    });

    return this.handleResponse(response);
  }

  async fetchCommit(commitId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/commits/fetch/${commitId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCommitHistory(chatId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/commits/${chatId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
