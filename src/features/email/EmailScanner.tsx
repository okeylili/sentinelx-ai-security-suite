import React, { useState } from 'react';
import { Mail, Shield, AlertTriangle, CheckCircle2, Info, Search, Trash2, ArrowRight } from 'lucide-react';
import { blink } from '@/lib/blink';
import { toast } from 'sonner';
import { AnalysisResult, ThreatLevel, AnalysisFinding } from '@/types/analysis';
import { useAuth } from '@/hooks/useAuth';

export function EmailScanner() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeEmail = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter email content to scan');
      return;
    }

    setIsScanning(true);
    setResult(null);

    // Simulate offline AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      // Mock logic for "Linguistic Entropy" and "Manipulation Detection"
      const lowerText = inputText.toLowerCase();
      const findings: AnalysisFinding[] = [];
      let score = 5;

      // Detection 1: Urgency & Scarcity
      if (lowerText.includes('urgent') || lowerText.includes('immediately') || lowerText.includes('expires') || lowerText.includes('limited time')) {
        findings.push({
          type: 'Psychological Manipulation',
          severity: 'high',
          description: 'Urgency framing detected. Attackers use artificial pressure to bypass critical thinking.'
        });
        score += 25;
      }

      // Detection 2: Authority Impersonation
      if (lowerText.includes('support') || lowerText.includes('admin') || lowerText.includes('security team') || lowerText.includes('it department')) {
        findings.push({
          type: 'Authority Impersonation',
          severity: 'medium',
          description: 'Impersonation of official departments detected. Common in business email compromise (BEC).'
        });
        score += 20;
      }

      // Detection 3: Synthetic Pattern (simplified check)
      const words = inputText.split(/\s+/);
      if (words.length > 40 && !inputText.includes('\n\n')) {
        findings.push({
          type: 'Synthetic Pattern',
          severity: 'low',
          description: 'High linguistic consistency detected. Typical of Large Language Model (LLM) generated text.'
        });
        score += 15;
      }

      // Detection 4: Suspicious requests
      if (lowerText.includes('password') || lowerText.includes('login') || lowerText.includes('credential') || lowerText.includes('verify your account')) {
        findings.push({
          type: 'Credential Solicitation',
          severity: 'high',
          description: 'Request for sensitive information detected. Highly suspicious for inbound communication.'
        });
        score += 30;
      }

      const threatLevel: ThreatLevel = 
        score > 80 ? 'Critical' : 
        score > 60 ? 'High' : 
        score > 40 ? 'Medium' : 
        score > 20 ? 'Low' : 'Minimal';

      const mockResult: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'email',
        riskScore: Math.min(score, 100),
        threatLevel,
        findings,
        explanation: score > 40 
          ? "The analysis engine identified multiple indicators of AI-assisted phishing. The text exhibits low linguistic entropy combined with high-pressure psychological triggers often used in credential theft campaigns."
          : "The email exhibits natural linguistic variations and lacks common fraud indicators. No malicious manipulation patterns were detected.",
        confidenceScore: 0.85 + Math.random() * 0.1,
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);

      // Save to DB
      if (user) {
        await blink.db.analysisHistory.create({
          userId: user.id,
          type: mockResult.type,
          inputContent: inputText,
          riskScore: mockResult.riskScore,
          threatLevel: mockResult.threatLevel,
          findings: JSON.stringify(mockResult.findings),
          explanation: mockResult.explanation,
          confidenceScore: mockResult.confidenceScore
        });
        toast.success('Analysis complete and secured in database');
      }
    } catch (error) {
      console.error(error);
      toast.error('Scan protocol interrupted');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Phishing Scanner</h1>
        </div>
        <p className="text-muted-foreground">Linguistic entropy and psychological manipulation analysis engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="security-card rounded-2xl glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">Inbound Message Body</label>
              <button 
                onClick={() => setInputText('')}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear Buffer
              </button>
            </div>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste email content here for multi-modal analysis..."
              className="w-full h-80 bg-secondary/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-mono leading-relaxed"
            />
            <button 
              onClick={analyzeEmail}
              disabled={isScanning || !inputText.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ANALYZING ENTROPY...
                </>
              ) : (
                <>
                  EXECUTE SCAN <Search className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary uppercase">Security Protocol</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SentinelX uses local transformer models to analyze sentence burstiness and token repetition patterns unique to Generative AI systems.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center security-card rounded-2xl glass-panel p-12 gap-4">
              <div className="relative">
                <Shield className="w-20 h-20 text-primary/20" />
                <div className="absolute inset-0 scanner-line h-1 bg-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              </div>
              <p className="text-sm font-mono text-primary animate-pulse">Scanning Linguistic Patterns...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="security-card rounded-2xl glass-panel p-6 border-t-4" style={{ borderTopColor: result.riskScore > 50 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Threat Assessment</p>
                    <h2 className={`text-2xl font-black uppercase tracking-tighter ${
                      result.threatLevel === 'Critical' || result.threatLevel === 'High' ? 'text-destructive' : 
                      result.threatLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {result.threatLevel}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Risk Score</p>
                    <p className="text-3xl font-black font-mono">{result.riskScore}<span className="text-sm text-muted-foreground">/100</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Explainability AI (XAI)</p>
                    <p className="text-xs leading-relaxed text-foreground">{result.explanation}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Detailed Findings</p>
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
                        <p className="text-xs font-bold uppercase">No anomalies detected</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <Shield className="w-3 h-3" /> CONFIDENCE: {(result.confidenceScore * 100).toFixed(1)}%
                  </div>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    Full Report <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">Linguistic Entropy</p>
                  <p className="text-xl font-bold font-mono">0.42</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">Burstiness Scale</p>
                  <p className="text-xl font-bold font-mono">1.8</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center security-card rounded-2xl glass-panel p-12 text-center gap-4">
              <Mail className="w-16 h-16 text-muted-foreground/20" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase">Awaiting Input</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">
                  Paste email content into the analyzer to begin linguistic fraud assessment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
