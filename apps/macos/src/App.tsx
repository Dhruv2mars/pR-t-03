
import { Editor, Console, Buttons } from '@project/editor-core';
import { Layout } from './components/Layout';
import { MacOSPreview } from './components/MacOSPreview';
import { RuntimeModal } from './components/RuntimeModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useMacOSCodeEditor } from './hooks/useMacOSCodeEditor';

function App() {
  const {
    code,
    setCode,
    language,
    messages,
    isRunning,
    isWaitingForInput,
    showRuntimeModal,
    missingRuntime,
    handleRun,
    handleInput,
    handleClear,
    handleLanguageChange,
    handleCloseRuntimeModal,
  } = useMacOSCodeEditor();

  return (
    <ErrorBoundary>
      <Layout>
        <div className="h-full flex flex-col">
          <Buttons
            onRun={handleRun}
            onClear={handleClear}
            isRunning={isRunning}
          />
          <Editor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            className="flex-1"
          />
        </div>
        
        <Console
          messages={messages}
          onClear={handleClear}
          onInput={handleInput}
          isWaitingForInput={isWaitingForInput}
        />
        
        <MacOSPreview
          content={code}
          language={language}
        />
      </Layout>
      
      <RuntimeModal
        isOpen={showRuntimeModal}
        runtime={missingRuntime || 'python'}
        onClose={handleCloseRuntimeModal}
      />
    </ErrorBoundary>
  );
}

export default App;