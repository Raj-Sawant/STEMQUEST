import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HintSystem = ({ 
  hints = [], 
  currentHintIndex = 0, 
  onHintUsed, 
  onHintClose,
  isVisible = false,
  gameContext = {} 
}) => {
  const [activeHint, setActiveHint] = useState(null);
  const [hintHistory, setHintHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && hints?.length > 0) {
      const hint = hints?.[currentHintIndex];
      if (hint) {
        setActiveHint(hint);
        setIsAnimating(true);
        setHintHistory(prev => [...prev, hint?.id]);
        onHintUsed?.(hint);
      }
    }
  }, [isVisible, currentHintIndex, hints]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setActiveHint(null);
      onHintClose?.();
    }, 300);
  };

  const getHintTypeIcon = (type) => {
    switch (type) {
      case 'formula': return 'Calculator';
      case 'concept': return 'BookOpen';
      case 'method': return 'Lightbulb';
      case 'example': return 'Eye';
      case 'step': return 'ArrowRight';
      default: return 'HelpCircle';
    }
  };

  const getHintTypeColor = (type) => {
    switch (type) {
      case 'formula': return 'text-blue-600 bg-blue-50';
      case 'concept': return 'text-green-600 bg-green-50';
      case 'method': return 'text-yellow-600 bg-yellow-50';
      case 'example': return 'text-purple-600 bg-purple-50';
      case 'step': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isVisible || !activeHint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-250 p-4">
      <div className={`bg-surface rounded-lg shadow-modal max-w-lg w-full transition-all duration-300 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getHintTypeColor(activeHint?.type)}`}>
              <Icon 
                name={getHintTypeIcon(activeHint?.type)} 
                size={20} 
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Hint #{currentHintIndex + 1}</h3>
              <p className="text-sm text-text-secondary capitalize">{activeHint?.type} Hint</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            iconName="X"
            iconSize={20}
          >
            <span className="sr-only">Close hint</span>
          </Button>
        </div>

        {/* Hint Content */}
        <div className="p-6 space-y-4">
          {/* Hint Title */}
          {activeHint?.title && (
            <h4 className="text-lg font-medium text-foreground">{activeHint?.title}</h4>
          )}

          {/* Hint Text */}
          <div className="text-text-secondary leading-relaxed">
            {activeHint?.content}
          </div>

          {/* Visual Aid */}
          {activeHint?.visual && (
            <div className="bg-muted rounded-lg p-4">
              {activeHint?.visual?.type === 'formula' && (
                <div className="text-center">
                  <div className="text-xl font-mono text-foreground mb-2">
                    {activeHint?.visual?.content}
                  </div>
                  {activeHint?.visual?.explanation && (
                    <p className="text-sm text-text-secondary">{activeHint?.visual?.explanation}</p>
                  )}
                </div>
              )}
              
              {activeHint?.visual?.type === 'diagram' && (
                <div className="text-center">
                  <div className="w-full h-32 bg-white rounded border flex items-center justify-center mb-2">
                    <Icon name="Image" size={32} color="var(--color-text-secondary)" />
                  </div>
                  <p className="text-sm text-text-secondary">{activeHint?.visual?.description}</p>
                </div>
              )}

              {activeHint?.visual?.type === 'steps' && (
                <ol className="space-y-2">
                  {activeHint?.visual?.steps?.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Related Concepts */}
          {activeHint?.relatedConcepts && activeHint?.relatedConcepts?.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Related Concepts:</h5>
              <div className="flex flex-wrap gap-2">
                {activeHint?.relatedConcepts?.map((concept, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Level */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary">Difficulty:</span>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Icon
                    key={index}
                    name="Star"
                    size={12}
                    color={index < (activeHint?.difficulty || 1) ? "var(--color-accent)" : "var(--color-muted)"}
                  />
                ))}
              </div>
            </div>
            <div className="text-text-secondary">
              Hints used: {hintHistory?.length}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div className="text-sm text-text-secondary">
            {hints?.length - currentHintIndex - 1} more hints available
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Got it!
            </Button>
            {currentHintIndex < hints?.length - 1 && (
              <Button
                variant="primary"
                onClick={() => {
                  // Request next hint
                  handleClose();
                  setTimeout(() => {
                    onHintUsed?.(hints?.[currentHintIndex + 1]);
                  }, 300);
                }}
              >
                Next Hint
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintSystem;