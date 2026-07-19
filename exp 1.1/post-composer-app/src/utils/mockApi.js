/**
 * Mock API simulator for social media drafts.
 * Provides custom configuration to simulate network success, immediate failures,
 * and intermittent failure modes to demonstrate retry mechanics.
 */

export const mockApiConfig = {
  // Can be 'succeed', 'fail', or 'intermittent'
  mode: 'succeed',
  // Tracking how many consecutive requests have failed for intermittent mode
  intermittentFailuresRequired: 2, 
  currentIntermittentFails: 0,
  latencyMs: 1200
};

/**
 * Simulates saving a draft to a backend server.
 * @param {Object} draft - The draft data { id, platform, content, updatedAt }
 * @returns {Promise<Object>} API response
 */
export function saveDraftMock(draft) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!draft.content || draft.content.trim() === '') {
        reject(new Error('Validation Failed: Draft content cannot be empty.'));
        return;
      }

      // Check current failure settings
      if (mockApiConfig.mode === 'fail') {
        reject(new Error('Network Error: Server returned 503 Service Unavailable.'));
        return;
      }

      if (mockApiConfig.mode === 'intermittent') {
        if (mockApiConfig.currentIntermittentFails < mockApiConfig.intermittentFailuresRequired) {
          mockApiConfig.currentIntermittentFails += 1;
          reject(new Error(`Server Error: Connection dropped (Simulated attempt failure ${mockApiConfig.currentIntermittentFails}/${mockApiConfig.intermittentFailuresRequired}).`));
          return;
        }
        // Succeed on the next one and reset counter
        mockApiConfig.currentIntermittentFails = 0;
      }

      // Success pathway
      resolve({
        success: true,
        data: {
          ...draft,
          savedAt: new Date().toISOString()
        }
      });
    }, mockApiConfig.latencyMs);
  });
}
