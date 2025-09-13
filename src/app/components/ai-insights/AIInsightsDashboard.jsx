'use client';

import { useState, useEffect } from 'react';

export default function AIInsightsDashboard({ playerId }) {
  const [insights, setInsights] = useState([]);
  const [videoAnalyses, setVideoAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (playerId) {
      fetchInsights();
      fetchVideoAnalyses();
    }
  }, [playerId]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/ai-insights?playerId=${playerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (err) {
      setError('Error fetching insights');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/ai-insights/video-analysis?playerId=${playerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setVideoAnalyses(data.videoAnalyses || []);
      }
    } catch (err) {
      console.error('Error fetching video analyses:', err);
    }
  };

  const uploadVideoForAnalysis = async (videoUrl) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/ai-insights/video-analysis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          videoUrl
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideoAnalyses(prev => [data.videoAnalysis, ...prev]);
        return data;
      } else {
        throw new Error('Failed to upload video');
      }
    } catch (err) {
      setError('Error uploading video for analysis');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            AI Insights
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'video'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Video Analysis
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'insights' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">AI Performance Insights</h3>
              {['admin', 'coach'].includes(session?.user?.role) && (
                <button
                  onClick={() => {
                    // In a real app, this would open a form to create new insights
                    alert('Feature coming soon: Create custom AI insights');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Insight
                </button>
              )}
            </div>

            {insights.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🤖</div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No AI Insights Yet</h4>
                <p className="text-gray-500">
                  AI insights will appear here as we analyze your performance data and videos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 capitalize">
                        {insight.type.replace('_', ' ')}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          insight.confidence > 0.8 ? 'bg-green-500' :
                          insight.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div className="text-gray-600 mb-2">
                      {insight.data.description || 'AI-generated insight based on performance data'}
                    </div>
                    
                    {insight.data.recommendations && (
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-700 mb-2">Recommendations:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {insight.data.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 mt-3">
                      Generated on {new Date(insight.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'video' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Video Analysis</h3>
              {['admin', 'coach'].includes(session?.user?.role) && (
                <VideoUploadButton onUpload={uploadVideoForAnalysis} />
              )}
            </div>

            {videoAnalyses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎥</div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No Video Analyses Yet</h4>
                <p className="text-gray-500">
                  Upload videos to get AI-powered analysis of your performance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {videoAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Video Analysis</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.analysisData.status === 'completed' ? 'bg-green-100 text-green-800' :
                        analysis.analysisData.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analysis.analysisData.status}
                      </span>
                    </div>

                    {analysis.analysisData.status === 'completed' && analysis.analysisData.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {analysis.analysisData.metrics.dribblingSpeed?.toFixed(1)} m/s
                          </div>
                          <div className="text-sm text-gray-600">Dribbling Speed</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {analysis.analysisData.metrics.shootingAccuracy?.toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Shooting Accuracy</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {analysis.analysisData.metrics.reactionTime?.toFixed(2)}s
                          </div>
                          <div className="text-sm text-gray-600">Reaction Time</div>
                        </div>
                      </div>
                    )}

                    {analysis.analysisData.recommendations && (
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-700 mb-2">AI Recommendations:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {analysis.analysisData.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-3">
                      Processed on {new Date(analysis.processedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoUploadButton({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // In a real app, you'd upload to a file storage service first
      const videoUrl = URL.createObjectURL(file);
      await onUpload(videoUrl);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
        id="video-upload"
        disabled={uploading}
      />
      <label
        htmlFor="video-upload"
        className={`px-4 py-2 rounded-lg cursor-pointer ${
          uploading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : '+ Upload Video'}
      </label>
    </div>
  );
}




