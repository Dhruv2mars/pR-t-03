
import { Editor, Console, Preview, Buttons } from '@project/editor-core';
import { Layout } from './components/Layout';
import { useCodeEditor } from './hooks/useCodeEditor';

function App() {
  const {
    code,
    setCode,
    language,
    messages,
    isRunning,
    isWaitingForInput,
    previewContent,
    handleRun,
    handleInput,
    handleClear,
    handleLanguageChange,
  } = useCodeEditor();

  return (
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
      
      <Preview
        content={previewContent}
        language={language}
      />
    </Layout>
  );
}

export default App;