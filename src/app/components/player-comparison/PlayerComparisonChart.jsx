'use client';

import { useState, useEffect } from 'react';

export default function PlayerComparisonChart({ comparison }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (comparison?.comparisonData) {
      const data = comparison.comparisonData;
      
      const statsData = [
        {
          category: 'Goals',
          player1: data.player1.totalGoals,
          player2: data.player2.totalGoals,
          difference: data.comparison.goalsDifference
        },
        {
          category: 'Assists',
          player1: data.player1.totalAssists,
          player2: data.player2.totalAssists,
          difference: data.comparison.assistsDifference
        },
        {
          category: 'Average Rating',
          player1: data.player1.averageRating.toFixed(1),
          player2: data.player2.averageRating.toFixed(1),
          difference: data.comparison.ratingDifference.toFixed(1)
        }
      ];

      setChartData(statsData);
    }
  }, [comparison]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Comparison</h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {comparison.comparisonData.player1.name}
            </div>
            <div className="text-sm text-gray-600">
              {comparison.comparisonData.player1.position} • Age {comparison.comparisonData.player1.age}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-400">VS</div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {comparison.comparisonData.player2.name}
            </div>
            <div className="text-sm text-gray-600">
              {comparison.comparisonData.player2.position} • Age {comparison.comparisonData.player2.age}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {chartData.map((stat, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">{stat.category}</span>
              <span className={`text-sm font-medium ${
                stat.difference > 0 ? 'text-blue-600' : 
                stat.difference < 0 ? 'text-green-600' : 'text-gray-500'
              }`}>
                {stat.difference > 0 ? '+' : ''}{stat.difference}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blue-600 font-medium">
                    {comparison.comparisonData.player1.name}
                  </span>
                  <span className="text-sm font-bold text-blue-600">{stat.player1}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: '50%'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-green-600 font-medium">
                    {comparison.comparisonData.player2.name}
                  </span>
                  <span className="text-sm font-bold text-green-600">{stat.player2}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: '50%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comparison.notes && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Scout Notes</h4>
          <p className="text-gray-600">{comparison.notes}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>Created on {new Date(comparison.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
