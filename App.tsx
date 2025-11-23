import React, { useState } from 'react';
import { ClassCategory, AppStep } from './types';
import ClassDataCard from './components/ClassDataCard';
import TrainingPanel from './components/TrainingPanel';
import InferencePanel from './components/InferencePanel';
import { PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [categories, setCategories] = useState<ClassCategory[]>([
    { id: 'class_1', name: 'Class 1', samples: [] },
    { id: 'class_2', name: 'Class 2', samples: [] },
  ]);
  const [step, setStep] = useState<AppStep>('collect');
  const [isTraining, setIsTraining] = useState(false);
  const [hasTrained, setHasTrained] = useState(false);

  // Metadata for header
  const totalSamples = categories.reduce((acc, c) => acc + c.samples.length, 0);

  const addCategory = () => {
    const id = `class_${Date.now()}`;
    setCategories([...categories, { id, name: `Class ${categories.length + 1}`, samples: [] }]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const updateCategory = (updated: ClassCategory) => {
    setCategories(categories.map(c => c.id === updated.id ? updated : c));
  };

  const handleTrainComplete = () => {
    setIsTraining(false);
    setHasTrained(true);
    setStep('preview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">Teachable Machine <span className="text-indigo-600 font-normal ml-1 text-sm bg-indigo-50 px-2 py-0.5 rounded">Lite</span></h1>
        </div>
        
        <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setStep('collect')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${step === 'collect' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                1. Collect Data
            </button>
            <button 
                onClick={() => setStep('train')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${step === 'train' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                2. Train Model
            </button>
            <button 
                onClick={() => hasTrained ? setStep('preview') : alert("Please train the model first.")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${step === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                disabled={!hasTrained}
            >
                3. Preview
            </button>
        </nav>

        <div className="text-xs font-mono text-slate-400">
             v1.0 • Gemini 2.5 Flash
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        
        {step === 'collect' && (
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Data Collection</h2>
                        <p className="text-slate-500">Add classes and upload images or use your webcam to build a dataset.</p>
                    </div>
                    <button 
                        onClick={addCategory}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <PlusIcon /> Add Class
                    </button>
                </div>
                
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-6 h-full min-w-max">
                        {categories.map(cat => (
                            <div key={cat.id} className="w-[350px] h-full">
                                <ClassDataCard 
                                    category={cat} 
                                    onUpdate={updateCategory} 
                                    onDelete={removeCategory}
                                    isTraining={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => setStep('train')}
                        disabled={totalSamples < 2}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-indigo-200 transition-transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                        Next: Train Model &rarr;
                    </button>
                </div>
            </div>
        )}

        {step === 'train' && (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-4xl h-[600px]">
                    <TrainingPanel 
                        onTrainComplete={handleTrainComplete}
                        isTraining={isTraining}
                        setIsTraining={setIsTraining}
                        sampleCount={totalSamples}
                        classCount={categories.length}
                    />
                </div>
            </div>
        )}

        {step === 'preview' && (
             <div className="flex-1 flex flex-col h-full">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Preview & Inference</h2>
                        <p className="text-slate-500">Test your model with new images using different algorithms.</p>
                    </div>
                    <button onClick={() => setStep('collect')} className="text-indigo-600 font-medium hover:underline text-sm">
                        &larr; Back to Dataset
                    </button>
                </div>
                <div className="flex-1 min-h-0">
                    <InferencePanel categories={categories} />
                </div>
             </div>
        )}

      </main>
    </div>
  );
};

export default App;