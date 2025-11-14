/**
 * Event Planning Assistant - Main Application Component
 * Root component that manages the overall application structure
 */

import ConversationInterface from './components/ConversationInterface.jsx';
import { ApplicationProvider } from './context/ApplicationContext.jsx';

const EventPlannerApp = () => {
  return (
    <ApplicationProvider>
      <div className="event-planner-app">
        <ConversationInterface />
      </div>
    </ApplicationProvider>
  );
};

export default EventPlannerApp;
