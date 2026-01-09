
import React, { useState, useCallback } from 'react';
import { generateMarketingBanner } from './services/geminiService';
import { GeneratedImage, AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    logo: null,
    isGenerating: false,
    generatedImages: [],
    error: null,
  });

  const [customPrompt, setCustomPrompt] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, logo: reader.result as string, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const imageUrl = await generateMarketingBanner(state.logo, customPrompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: customPrompt || "Standard Professional Banner",
        timestamp: Date.now(),
      };
      setState(prev => ({
        ...prev,
        generatedImages: [newImage, ...prev.generatedImages],
        isGenerating: false
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isGenerating: false }));
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <header className="w-full max-w-6xl py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          SoftApp Technologies <span className="block text-2xl md:text-3xl font-light text-slate-400 mt-2">Marketing Material Generator</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Create premium high-tech cyber security banners featuring your logo, top industry tools, and your job guarantee promise.
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-2xl cyber-border">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-gears text-blue-400"></i>
              Design Controls
            </h2>

            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Institute Logo</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer bg-slate-900/50 relative overflow-hidden group">
                {state.logo ? (
                  <div className="relative w-full aspect-video">
                    <img src={state.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => setState(prev => ({ ...prev, logo: null }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fa-solid fa-xmark w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-500 mb-2"></i>
                    <p className="text-xs text-slate-400">Upload SoftApp Logo (PNG/JPG)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Custom Text / Style</label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Add 'Admissions Open 2024' or 'Located in Silicon Valley'..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={state.isGenerating}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all glow
                ${state.isGenerating 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'}`}
            >
              {state.isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Generating Banner...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Generate High-End Banner
                </>
              )}
            </button>

            {state.error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-300 text-sm">
                <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                <p>{state.error}</p>
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-2xl border border-slate-800/50">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i>
              Institute Focus
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Ethical Hacking', 'Network Security', 'Penetration Testing', 'Cloud Security'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-800 rounded-md text-xs text-blue-300 border border-blue-900/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-8 space-y-8">
          {state.generatedImages.length === 0 && !state.isGenerating ? (
            <div className="glass rounded-2xl h-[500px] flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-slate-800">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-image text-4xl text-slate-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">Ready to Visualize</h3>
              <p className="text-slate-500 max-w-md">
                Upload your logo and click generate to see your institute's professional cyber security marketing materials come to life.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {state.isGenerating && (
                <div className="glass rounded-2xl overflow-hidden cyber-border aspect-video animate-pulse flex flex-col items-center justify-center">
                   <div className="text-blue-400 mb-4">
                     <i className="fa-solid fa-microchip text-5xl fa-spin-pulse"></i>
                   </div>
                   <p className="mono text-slate-400 text-sm font-bold animate-bounce">SECURE_RENDER_IN_PROGRESS...</p>
                </div>
              )}
              
              {state.generatedImages.map((image, idx) => (
                <div key={image.id} className="group relative glass rounded-2xl overflow-hidden cyber-border">
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur rounded-full border border-blue-500/30">
                    <span className="text-xs font-bold text-blue-400 mono">VERIFIED_SECURE_{image.id.slice(-4)}</span>
                  </div>
                  <img 
                    src={image.url} 
                    alt={`Generated Banner ${idx + 1}`} 
                    className="w-full h-auto object-cover transform transition-transform group-hover:scale-[1.01]"
                  />
                  <div className="p-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-1">Generated {new Date(image.timestamp).toLocaleTimeString()}</p>
                      <p className="text-xs text-slate-500 italic truncate max-w-xs">{image.prompt}</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => downloadImage(image.url, `softapp-tech-banner-${image.id}.png`)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
                      >
                        <i className="fa-solid fa-download"></i>
                        Download
                      </button>
                      <button className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700">
                        <i className="fa-solid fa-share-nodes"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center w-full max-w-6xl border-t border-slate-800 pt-8">
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">100%</span>
            <span className="text-xs text-slate-500 uppercase tracking-widest">Job Placement</span>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">50+</span>
            <span className="text-xs text-slate-500 uppercase tracking-widest">Global Tools</span>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">24/7</span>
            <span className="text-xs text-slate-500 uppercase tracking-widest">Expert Support</span>
          </div>
        </div>
        <p className="text-slate-600 text-xs mono">
          &copy; {new Date().getFullYear()} SoftApp Technologies • Powered by Gemini AI Ultra-Secure Visuals
        </p>
      </footer>
    </div>
  );
};

export default App;
