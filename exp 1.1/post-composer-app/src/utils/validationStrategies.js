/**
 * Strategy Design Pattern for Platform Validation.
 * Each strategy defines validation logic, limits, placeholders, and brand styling
 * for its respective social media platform.
 */

export const validationStrategies = {
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    limit: 280,
    color: '#1DA1F2',
    bgColor: 'rgba(29, 161, 242, 0.1)',
    placeholder: "What's happening? (Limit: 280 chars)",
    validate: (text) => {
      if (!text || text.trim() === '') {
        return { isValid: true, error: null }; // Empty draft is technically valid
      }
      if (text.length > 280) {
        return { 
          isValid: false, 
          error: `Exceeds Twitter character limit of 280 (currently ${text.length}).` 
        };
      }
      return { isValid: true, error: null };
    }
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    limit: 3000,
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.1)',
    placeholder: 'What do you want to talk about? (Limit: 3000 chars)',
    validate: (text) => {
      if (!text || text.trim() === '') {
        return { isValid: true, error: null };
      }
      if (text.length > 3000) {
        return { 
          isValid: false, 
          error: `Exceeds LinkedIn character limit of 3000 (currently ${text.length}).` 
        };
      }
      return { isValid: true, error: null };
    }
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    limit: 2200,
    color: '#E1306C',
    bgColor: 'rgba(225, 48, 108, 0.1)',
    placeholder: 'Write a caption and include hashtags... #creative (Limit: 2200 chars)',
    validate: (text) => {
      if (!text || text.trim() === '') {
        return { isValid: true, error: null };
      }
      if (text.length > 2200) {
        return { 
          isValid: false, 
          error: `Exceeds Instagram character limit of 2200 (currently ${text.length}).` 
        };
      }
      
      // Instagram business rule: Must contain at least one hashtag
      const hasHashtag = /#\w+/.test(text);
      if (!hasHashtag) {
        return { 
          isValid: false, 
          error: 'Instagram posts require at least one hashtag (e.g. #creative).' 
        };
      }
      return { isValid: true, error: null };
    }
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    limit: 5000,
    color: '#1877F2',
    bgColor: 'rgba(24, 119, 242, 0.1)',
    placeholder: "What's on your mind? (Limit: 5000 chars)",
    validate: (text) => {
      if (!text || text.trim() === '') {
        return { isValid: true, error: null };
      }
      if (text.length > 5000) {
        return { 
          isValid: false, 
          error: `Exceeds Facebook character limit of 5000 (currently ${text.length}).` 
        };
      }
      return { isValid: true, error: null };
    }
  }
};

/**
 * Context runner for Strategy Pattern validation.
 * @param {string} platform - The selected platform key.
 * @param {string} text - The input content.
 * @returns {Object} validation result { isValid, error }
 */
export const validatePost = (platform, text) => {
  const strategy = validationStrategies[platform];
  if (!strategy) {
    return { isValid: false, error: `Unknown platform: "${platform}"` };
  }
  return strategy.validate(text);
};
