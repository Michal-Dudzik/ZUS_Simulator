/**
 * Generic HTTP Client Service
 * 
 * This service provides common HTTP request patterns and utilities
 * that can be used as a foundation for API integrations.
 */

import { env } from '../config/env.js'

// Base configuration
const API_CONFIG = {
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

/**
 * HTTP Client class with common request methods
 */
class HttpClient {
  constructor(config = {}) {
    this.config = { ...API_CONFIG, ...config }
  }

  /**
   * Build full URL with base URL
   */
  buildUrl(endpoint) {
    const baseUrl = this.config.baseURL.replace(/\/$/, '')
    const cleanEndpoint = endpoint.replace(/^\//, '')
    return `${baseUrl}/${cleanEndpoint}`
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint)
    const config = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, await this.parseErrorResponse(response))
      }

      return await this.parseResponse(response)
    } catch (error) {
      if (error instanceof HttpError) {
        throw error
      }
      throw new HttpError(0, 'Network Error', { message: error.message })
    }
  }

  /**
   * Parse successful response
   */
  async parseResponse(response) {
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return await response.text()
  }

  /**
   * Parse error response
   */
  async parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      return { message: await response.text() }
    } catch {
      return { message: 'Unknown error occurred' }
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const url = new URL(this.buildUrl(endpoint))
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    return this.request(url.pathname + url.search, {
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }
}

/**
 * Custom HTTP Error class
 */
class HttpError extends Error {
  constructor(status, statusText, data = {}) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }

  /**
   * Check if error is a specific HTTP status
   */
  isStatus(status) {
    return this.status === status
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError() {
    return this.status >= 400 && this.status < 500
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError() {
    return this.status >= 500
  }
}

// Create default HTTP client instance
const httpClient = new HttpClient()

// Export the client and utilities
export { HttpClient, HttpError, httpClient }

/**
 * Example API service functions
 * 
 * These demonstrate common patterns for API integration:
 * - Resource CRUD operations
 * - Error handling
 * - Data transformation
 * - Authentication headers
 */

/**
 * Example: Get resource by ID
 */
export const getResourceById = async (id) => {
  try {
    const data = await httpClient.get(`/resources/${id}`)
    return data
  } catch (err) {
    if (err.isStatus(404)) {
      throw new Error('RESOURCE_NOT_FOUND')
    }
    throw new Error('FETCH_FAILED')
  }
}

/**
 * Example: Create new resource
 */
export const createResource = async (resourceData) => {
  try {
    const data = await httpClient.post('/resources', resourceData)
    return data
  } catch (err) {
    if (err.isClientError()) {
      throw new Error('INVALID_DATA')
    }
    throw new Error('CREATE_FAILED')
  }
}

/**
 * Example: Update existing resource
 */
export const updateResource = async (id, resourceData) => {
  try {
    const data = await httpClient.put(`/resources/${id}`, resourceData)
    return data
  } catch (err) {
    if (err.isStatus(404)) {
      throw new Error('RESOURCE_NOT_FOUND')
    }
    if (err.isClientError()) {
      throw new Error('INVALID_DATA')
    }
    throw new Error('UPDATE_FAILED')
  }
}

/**
 * Example: Delete resource
 */
export const deleteResource = async (id) => {
  try {
    await httpClient.delete(`/resources/${id}`)
    return true
  } catch (err) {
    if (err.isStatus(404)) {
      throw new Error('RESOURCE_NOT_FOUND')
    }
    throw new Error('DELETE_FAILED')
  }
}

/**
 * Example: Get paginated list of resources
 */
export const getResourceList = async (page = 1, limit = 10, filters = {}, token = null) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    }
    const client = token ? createAuthenticatedClient(token) : httpClient
    const data = await client.get('/resources', params)
    return data
  } catch {
    throw new Error('FETCH_LIST_FAILED')
  }
}

/**
 * Example: Authenticated request helper
 */
export const createAuthenticatedClient = (token) => {
  const headers = {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  }

  if (env.supabaseAnonKey) {
    headers.apikey = env.supabaseAnonKey
  }

  return new HttpClient({
    headers,
  })
}

/**
 * Example: File upload helper
 */
export const uploadFile = async (file, endpoint = '/upload') => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(httpClient.buildUrl(endpoint), {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - browser will set it with boundary
    })

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText)
    }

    return await response.json()
  } catch {
    throw new Error('UPLOAD_FAILED')
  }
}
