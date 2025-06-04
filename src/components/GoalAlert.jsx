import { useEffect, useRef } from 'react';

const GoalAlert = ({ spending, goal, label }) => {
  const alertedRef = useRef(false);

  useEffect(() => {
    if (!goal || goal === 0) {
      alertedRef.current = false; 
      return;
    }

    const ratio = spending / goal;

    if (ratio < 0.8) {
      alertedRef.current = false;
      return;
    }

    if (!alertedRef.current) {
      if (ratio >= 1) {
        alert(`goal reached ${label}`);
      } else if (ratio >= 0.8) {
        alert(`You are almost reach the goal ${label}`);
      }
      alertedRef.current = true;
    }
  }, [spending, goal, label]);

  return null;
};

export default GoalAlert;
