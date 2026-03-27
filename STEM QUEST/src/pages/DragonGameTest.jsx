import React from 'react';
import DragonMathGame from './game-player/components/DragonMathGame';

const DragonGameTest = () => {
  const handleGameComplete = (success) => {
    if (success) {
      alert('Congratulations! You defeated the skeleton!');
    } else {
      alert('Game over! Try again.');
    }
  };

  const handleScoreUpdate = (points) => {
    console.log(`Scored ${points} points!`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Dragon vs Skeleton Math Battle - Test</h1>
          <p className="text-gray-300">Test the dragon math game standalone</p>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 p-4">
        <div className="container mx-auto h-full">
          <div className="bg-white rounded-lg shadow-lg h-full min-h-[600px]">
            <DragonMathGame 
              onGameComplete={handleGameComplete}
              onScoreUpdate={handleScoreUpdate}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Wait for the countdown (3, 2, 1, GO!)</li>
            <li>• Answer math questions correctly to shoot fireballs</li>
            <li>• Hit the skeleton twice to win the game</li>
            <li>• Wrong answers will show the correct answer and give you another question</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DragonGameTest;
