// API Service for fetching manhwa data
const API_BASE_URL = process.env.API_BASE_URL || 'https://www.sankavollerei.com/comic';

/**
 * Fetch the latest comics
 */
export const fetchLatestComics = async (params = {}) => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}/terbaru?${queryString}` : `${API_BASE_URL}/terbaru`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // Return both comics and pagination info if available
    return {
      comics: result.comics || result,
      pagination: result.pagination
    };
  } catch (error) {
    console.error('Error fetching latest comics:', error);
    throw error;
  }
};

/**
 * Fetch comic details by slug
 */
export const fetchComicDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comic/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json()
    return result
  } catch (error) {
    console.error(`Error fetching comic details for slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetch chapter content by slug
 */
export const fetchChapterContent = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chapter/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json()
    return result
  } catch (error) {
    console.error(`Error fetching chapter content for slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Search comics by query
 */
export const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json()
    
    return await result.data;
  } catch (error) {
    console.error(`Error searching comics for query ${query}:`, error);
    throw error;
  }
};

// Export with old name for potential compatibility
export const searchComics = fetchSearchResults;