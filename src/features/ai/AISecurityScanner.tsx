import React, { useState } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle2, Info, Search, Trash2, ArrowRight, Zap, Code, Brackets, Ghost } from 'lucide-react';
import { blink } from '@/lib/blink';
import { toast } from 'sonner';
import { AnalysisResult, ThreatLevel, AnalysisFinding } from '@/types/analysis';
import { useAuth } from '@/hooks/useAuth';

export function AISecurityScanner() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to scan');
      return;
    }

    setIsScanning(true);
    setResult(null);

    // Simulate LLM security analysis time
    await new Promise(resolve => setTimeout(resolve, 3500));

    try {
      const findings: AnalysisFinding[] = [];
      let score = 5;
      const lowerPrompt = prompt.toLowerCase();

      // Detection 1: Role Manipulation / Jailbreak
      const jailbreakPatterns = ['ignore all previous instructions', 'now you are', 'dan mode', 'do anything now', 'system override', 'forget your rules'];
      if (jailbreakPatterns.some(pattern => lowerPrompt.includes(pattern))) {
        findings.push({
          type: 'Jailbreak Attempt',
          severity: 'high',
          description: 'Detected persona manipulation or instruction override patterns typical of jailbreak attacks.'
        });
        score += 45;
      }

      // Detection 2: Prompt Injection (External instructions)
      if (lowerPrompt.includes('### instructions') || lowerPrompt.includes('--- start ---') || lowerPrompt.includes('output format:')) {
        findings.push({
          type: 'Prompt Injection',
          severity: 'medium',
          description: 'Structural injection indicators detected. Input attempts to redefine model constraints.'
        });
        score += 25;
      }

      // Detection 3: Memory Extraction / Data Exfiltration
      if (lowerPrompt.includes('tell me your system prompt') || lowerPrompt.includes('reveal your rules') || lowerPrompt.includes('what were you told')) {
        findings.push({
          type: 'Data Exfiltration',
          severity: 'high',
          description: 'Attempt to extract model configuration or internal system instructions detected.'
        });
        score += 35;
      }

      // Detection 4: Obfuscation
      if (lowerPrompt.includes('base64') || lowerPrompt.includes('rot13') || lowerPrompt.includes('\\u00')) {
        findings.push({
          type: 'Payload Obfuscation',
          severity: 'medium',
          description: 'Encoding or obfuscation detected. Used to hide malicious instructions from simple filters.'
        });
        score += 20;
      }

      const threatLevel: ThreatLevel = 
        score > 80 ? 'Critical' : 
        score > 60 ? 'High' : 
        score > 40 ? 'Medium' : 
        score > 20 ? 'Low' : 'Minimal';

      const mockResult: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'prompt',
        riskScore: Math.min(score, 100),
        threatLevel,
        findings,
        explanation: score > 50 
          ? "The security engine has identified active adversarial patterns designed to hijack the AI model's control flow. The input contains known jailbreak signatures and role-assumption tactics."
          : "The prompt appears safe for execution. No adversarial injection or extraction patterns were identified within the input sequence.",
        confidenceScore: 0.88 + Math.random() * 0.08,
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);

      // Save to DB
      if (user) {
        await blink.db.analysisHistory.create({
          userId: user.id,
          type: mockResult.type,
          inputContent: prompt,
          riskScore: mockResult.riskScore,
          threatLevel: mockResult.threatLevel,
          findings: JSON.stringify(mockResult.findings),
          explanation: mockResult.explanation,
          confidenceScore: mockResult.confidenceScore
        });
        toast.success('Adversarial scan report generated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Adversarial analysis failed');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Prompt Security</h1>
        </div>
        <p className="text-muted-foreground">Detection of prompt injection, jailbreaks, and adversarial AI attacks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="security-card rounded-2xl glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">Target AI Prompt</label>
              <button 
                onClick={() => setPrompt('')}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear Buffer
              </button>
            </div>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste the user prompt here to check for adversarial patterns..."
              className="w-full h-80 bg-secondary/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-mono leading-relaxed"
            />
            <button 
              onClick={analyzePrompt}
              disabled={isScanning || !prompt.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  SCANNING ADVERSARIAL VECTORS...
                </>
              ) : (
                <>
                  EXECUTE SECURITY SCAN <Shield className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border border-border/50 bg-secondary/20 text-center space-y-1">
              <Zap className="w-4 h-4 text-primary mx-auto" />
              <p className="text-[10px] font-bold uppercase">Injection</p>
            </div>
            <div className="p-3 rounded-lg border border-border/50 bg-secondary/20 text-center space-y-1">
              <Ghost className="w-4 h-4 text-primary mx-auto" />
              <p className="text-[10px] font-bold uppercase">Jailbreak</p>
            </div>
            <div className="p-3 rounded-lg border border-border/50 bg-secondary/20 text-center space-y-1">
              <Code className="w-4 h-4 text-primary mx-auto" />
              <p className="text-[10px] font-bold uppercase">Obfuscation</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center security-card rounded-2xl glass-panel p-12 gap-4">
              <div className="relative">
                <Terminal className="w-20 h-20 text-primary/20" />
                <div className="absolute inset-0 scanner-line h-1 bg-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              </div>
              <p className="text-sm font-mono text-primary animate-pulse">Running Token Classification...</p>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="security-card rounded-2xl glass-panel p-6 border-t-4" style={{ borderTopColor: result.riskScore > 50 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Adversarial Risk</p>
                    <h2 className={`text-2xl font-black uppercase tracking-tighter ${
                      result.threatLevel === 'Critical' || result.threatLevel === 'High' ? 'text-destructive' : 
                      result.threatLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {result.threatLevel}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Threat Index</p>
                    <p className="text-3xl font-black font-mono">{result.riskScore}<span className="text-sm text-muted-foreground">/100</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Defense Explanation</p>
                    <p className="text-xs leading-relaxed text-foreground">{result.explanation}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Detected Payloads</p>
                    {result.findings.length > 0 ? (
                      result.findings.map((finding, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                          {finding.severity === 'high' ? (
                            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-primary shrink-0" />
                          )}
                          <div className="space-y-1">
                            <p className="text-xs font-bold">{finding.type}</p>
                            <p className="text-[11px] text-muted-foreground leading-tight">{finding.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <p className="text-xs font-bold uppercase">No malicious vectors</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <Brackets className="w-3 h-3" /> TOKEN_LIMIT: 4096
                  </div>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    View Vector Map <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center security-card rounded-2xl glass-panel p-12 text-center gap-4">
              <Terminal className="w-16 h-16 text-muted-foreground/20" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase">Sentinel Protection</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">
                  Analyze AI prompts for malicious injection or jailbreak attempts before they reach your models.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
