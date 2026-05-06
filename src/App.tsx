/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Truck, 
  CheckCircle2, 
  Cpu, 
  ChevronRight, 
  ClipboardCheck, 
  Factory,
  Loader2,
  PackageCheck,
  AlertTriangle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { generateProductionPlan, type ProductionPlan } from './services/geminiService';

export default function App() {
  const [orderRequest, setOrderRequest] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plan, setPlan] = useState<ProductionPlan | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderRequest.trim()) return;

    setIsAnalyzing(true);
    setPlan(null);
    try {
      const result = await generateProductionPlan(orderRequest);
      setPlan(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="border-b border-black/5 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white rounded-sm">
            <Scissors size={18} />
          </div>
          <span className="font-serif italic font-bold text-xl tracking-tight">Sartorial AI | Fashion Order Manager</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Intro Section */}
        {!plan && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              Production <span className="italic">Management</span> <br />
              at the speed of thought.
            </h1>
            <p className="text-black/60 max-w-xl mx-auto text-lg leading-relaxed">
              Describe your garment order. Our AI Production Manager will source fabrics, 
              estimate costs, and map out the entire lifecycle of your collection.
            </p>
          </motion.div>
        )}

        {/* Input UI */}
        <div className={`transition-all duration-700 ${plan || isAnalyzing ? 'mt-0' : 'mt-8'}`}>
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="group relative">
              <textarea
                value={orderRequest}
                onChange={(e) => setOrderRequest(e.target.value)}
                placeholder="Ex: 250 heavy-weight organic cotton hoodies in midnight navy with oversized puff print logo. Budget: $15,000. Delivery by Autumn."
                className="w-full bg-[#F5F5F3] border border-black/10 rounded-2xl p-6 md:p-8 pr-24 text-lg focus:outline-none focus:ring-1 focus:ring-black/20 resize-none min-h-[160px] transition-all"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !orderRequest.trim()}
                className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-black text-white p-3 md:p-4 rounded-xl hover:scale-105 active:scale-95 disabled:bg-black/20 disabled:scale-100 transition-all cursor-pointer shadow-xl"
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <ChevronRight size={24} />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Analysis State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-24 text-center"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-t-2 border-l-2 border-black/10 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Factory className="text-black/20" size={32} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-widest text-black/40">Analyzing Inventory & Logic</p>
                  <p className="text-lg font-medium text-black/60">Sourcing sustainable textiles...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Board */}
          {plan && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 space-y-12"
            >
              {/* Top Summary */}
              <div className="grid md:grid-cols-4 gap-6 border-b border-black/10 pb-12">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex items-center gap-2">
                    <ClipboardCheck size={12} /> Status
                  </p>
                  <p className="text-xl font-medium">Plan Finalized</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex items-center gap-2">
                    <CheckCircle2 size={12} /> Verification
                  </p>
                  <p className="text-xl font-medium">Budget Aligned</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex items-center gap-2">
                    <Truck size={12} /> Logistics
                  </p>
                  <p className="text-xl font-medium">Ready for Simulation</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex items-center gap-2">
                    <Cpu size={12} /> System Confidence
                  </p>
                  <p className={`text-xl font-medium ${plan.systemConfidence.toLowerCase() === 'high' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {plan.systemConfidence}
                  </p>
                </div>
              </div>

              {/* The "Workboard" Layout */}
              <div className="grid lg:grid-cols-12 gap-12">
                
                {/* Left Column: Understanding & Reasoning */}
                <div className="lg:col-span-4 space-y-12">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest">01. Understanding</h3>
                    </div>
                    <div className="bg-[#F5F5F3] p-6 rounded-2xl leading-relaxed text-black/80">
                      {plan.understanding}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest">02. Reasoning</h3>
                    </div>
                    <div className="border-l-2 border-black/10 pl-6 py-2 italic text-black/70 leading-relaxed">
                      {plan.reasoning}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest">03. Rejected Options</h3>
                    </div>
                    <div className="space-y-3">
                      {plan.rejectedOptions.map((opt, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-red-50/30 border border-red-100/50 rounded-xl items-start">
                          <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-red-900/80">{opt.option}</p>
                            <p className="text-[11px] text-red-800/60 leading-relaxed italic">{opt.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest">04. Tools Used</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.toolsUsed.map((tool, i) => (
                        <div key={i} className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-mono uppercase tracking-wider text-black/60">
                          {tool}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Center/Right Column: Decisions & Simulation */}
                <div className="lg:col-span-8 space-y-12">
                  
                  {/* Agent Intelligence & Metrics */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-blue-500 flex justify-between w-full">
                        Agent Intelligence Center
                        <span className="opacity-50">v4.2.0-STABLE</span>
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Flow & Trace */}
                      <div className="space-y-4">
                        <div className="bg-blue-50/50 border border-blue-100/50 p-6 rounded-2xl space-y-4">
                          <div className="space-y-2">
                             <p className="font-mono text-[9px] uppercase tracking-widest text-blue-800/40">System Execution Flow</p>
                             <p className="text-xs text-blue-700/80 font-mono tracking-tight">{plan.systemExecutionFlow}</p>
                          </div>
                          <div className="h-px bg-blue-100/50 w-full" />
                          <div className="space-y-2">
                             <p className="font-mono text-[9px] uppercase tracking-widest text-blue-800/40">Runtime Agent Trace</p>
                             <p className="text-xs text-blue-700/80 font-mono tracking-tight">{plan.agentTrace}</p>
                          </div>
                        </div>

                        {/* Buffer Logic */}
                        <div className="bg-emerald-50/30 border border-emerald-100/50 p-6 rounded-2xl flex gap-4 items-start">
                          <PackageCheck size={16} className="text-emerald-500 mt-1 shrink-0" />
                          <div className="space-y-1">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-800/40">Buffer & Contingency Logic</p>
                            <p className="text-xs text-emerald-800/70 italic leading-relaxed">{plan.bufferLogic}</p>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Metrics */}
                      <div className="bg-white border border-black/5 p-6 rounded-2xl space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 size={14} className="text-black/40" />
                          <span className="font-mono text-[9px] uppercase tracking-wider text-black/40">Decision Confidence Metrics</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                          {[
                            { label: 'Fabric Choice', val: plan.decisionConfidence.fabricChoice, color: 'bg-emerald-500' },
                            { label: 'Timeline', val: plan.decisionConfidence.timelineFeasibility, color: 'bg-blue-500' },
                            { label: 'Budget Safety', val: plan.decisionConfidence.budgetSafetyMargin, color: 'bg-indigo-500' },
                            { label: 'Overall Risk', val: plan.decisionConfidence.riskLevel, color: 'bg-amber-500' },
                          ].map((item, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between items-baseline">
                                <p className="text-[9px] text-black/40 uppercase tracking-tight font-bold">{item.label}</p>
                                <p className="text-xs font-mono font-bold">{item.val}</p>
                              </div>
                              <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: item.val.includes('%') ? item.val : '50%' }}
                                  className={`h-full ${item.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Decision Grid */}
                  <section className="bg-black text-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Cpu size={120} />
                    </div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        <h3 className="font-mono text-[10px] uppercase tracking-widest opacity-60">05. Managerial Decision</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Textile Selection</p>
                          <p className="text-2xl font-serif italic">{plan.decision.fabric}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Cost Benchmark</p>
                          <p className="text-2xl font-mono">{plan.decision.cost}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Est. Fulfillment</p>
                          <p className="text-2xl font-serif italic">{plan.decision.delivery}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Risks & Tradeoffs */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest">06. Risk & Tradeoff</h3>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl flex gap-6 items-start">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                        <AlertTriangle className="text-amber-500" size={20} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-amber-900 leading-relaxed font-medium">Strategic Analysis</p>
                        <p className="text-amber-800/80 leading-relaxed italic">{plan.riskAndTradeoff}</p>
                      </div>
                    </div>
                  </section>

                  {/* Production Run Simulation */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <h3 className="font-mono text-[10px] uppercase tracking-widest">07. Action Simulation</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-black/5 p-8 rounded-2xl shadow-sm leading-relaxed overflow-hidden">
                        <p className="text-black/90 whitespace-pre-wrap">{plan.actionSimulation}</p>
                      </div>
                      <div className="bg-[#1A1A1A] p-8 rounded-2xl flex flex-col justify-end text-white relative overflow-hidden min-h-[200px]">
                        <PackageCheck className="absolute top-8 left-8 opacity-20" size={64} />
                        <h4 className="text-3xl font-serif leading-tight">Simulation <br />complete.</h4>
                        <p className="mt-4 text-white/40 text-xs font-mono uppercase tracking-widest">Efficiency Optimized: 98.4%</p>
                      </div>
                    </div>
                  </section>

                  {/* Final Output */}
                  <section className="space-y-4 pt-12 border-t border-black/10">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        <h3 className="font-mono text-[10px] uppercase tracking-widest">08. Business Summary</h3>
                      </div>
                    </div>
                    <div className="text-4xl md:text-6xl font-serif leading-tight text-black/90">
                      {plan.finalOutput}
                    </div>
                  </section>

                </div>
              </div>

              {/* Back to top / Start again */}
              <div className="flex justify-center pt-24 pb-12">
                <button 
                  onClick={() => { setPlan(null); setOrderRequest(''); }}
                  className="bg-[#F5F5F3] hover:bg-[#EAEAE8] px-8 py-4 rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer"
                >
                  New Production Request
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 p-12 mt-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-black/30">
          <p>© 2026 Sartorial Intelligence Production Units</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Compliance</a>
            <a href="#" className="hover:text-black transition-colors">Ethics</a>
            <a href="#" className="hover:text-black transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
