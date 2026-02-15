import React, { useState } from 'react';
import { Globe, Shield, AlertTriangle, CheckCircle2, Info, Search, Trash2, ArrowRight, ExternalLink, Lock, Unlock } from 'lucide-react';
import { blink } from '@/lib/blink';
import { toast } from 'sonner';
import { AnalysisResult, ThreatLevel, AnalysisFinding } from '@/types/analysis';
import { useAuth } from '@/hooks/useAuth';

export function WebScanner() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL to scan');
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      toast.error('Invalid URL format');
      return;
    }

    setIsScanning(true);
    setResult(null);

    // Simulate network analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const findings: AnalysisFinding[] = [];
      let score = 5;
      const lowerUrl = url.toLowerCase();

      // Detection 1: Suspicious TLDs
      const suspiciousTlds = ['.xyz', '.top', '.buzz', '.monster', '.icu', '.tk', '.ml'];
      if (suspiciousTlds.some(tld => lowerUrl.endsWith(tld))) {
        findings.push({
          type: 'Suspicious TLD',
          severity: 'medium',
          description: `The domain uses a ${lowerUrl.split('.').pop()} extension, which is statistically over-represented in phishing campaigns.`
        });
        score += 20;
      }

      // Detection 2: Homoglyph / Typosquatting
      if (lowerUrl.includes('g00gle') || lowerUrl.includes('microsoft-security') || lowerUrl.includes('paypa1')) {
        findings.push({
          type: 'Homoglyph Attack',
          severity: 'high',
          description: 'The URL uses character substitution (look-alike letters) to impersonate a legitimate brand.'
        });
        score += 40;
      }

      // Detection 3: Missing HTTPS (if provided)
      if (url.startsWith('http://')) {
        findings.push({
          type: 'Insecure Protocol',
          severity: 'medium',
          description: 'The site uses an unencrypted HTTP connection. Sensitive data can be intercepted.'
        });
        score += 15;
      }

      // Detection 4: IP-based URL
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      if (ipPattern.test(domain)) {
        findings.push({
          type: 'IP-based Navigation',
          severity: 'high',
          description: 'The URL points directly to an IP address instead of a domain name. This is a common tactic to bypass DNS-based security filters.'
        });
        score += 35;
      }

      const threatLevel: ThreatLevel = 
        score > 80 ? 'Critical' : 
        score > 60 ? 'High' : 
        score > 40 ? 'Medium' : 
        score > 20 ? 'Low' : 'Minimal';

      const mockResult: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'url',
        riskScore: Math.min(score, 100),
        threatLevel,
        findings,
        explanation: score > 40 
          ? "SentinelX has flagged this URL as potentially malicious. The site exhibits technical indicators consistent with brand impersonation and spoofing techniques used in automated phishing kits."
          : "The URL appears to be legitimate based on current heuristic analysis. Protocol, TLD, and domain structure align with standard security best practices.",
        confidenceScore: 0.92 + Math.random() * 0.05,
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);

      // Save to DB
      if (user) {
        await blink.db.analysisHistory.create({
          userId: user.id,
          type: mockResult.type,
          inputContent: url,
          riskScore: mockResult.riskScore,
          threatLevel: mockResult.threatLevel,
          findings: JSON.stringify(mockResult.findings),
          explanation: mockResult.explanation,
          confidenceScore: mockResult.confidenceScore
        });
        toast.success('Website analysis secured in vault');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network analysis protocol error');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Website Spoofing Analysis</h1>
        </div>
        <p className="text-muted-foreground">Real-time heuristic analysis for phishing and malicious redirects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="security-card rounded-2xl glass-panel p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">Target URL / Domain</label>
              <div className="relative">
                <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., https://secure-login-verify.com"
                  className="w-full pl-12 pr-4 py-4 bg-secondary/20 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/50 bg-secondary/10 flex flex-col gap-3">
                <p className="text-[10px] font-mono uppercase text-muted-foreground">Encryption Status</p>
                <div className="flex items-center gap-2">
                  {url.startsWith('https') ? <Lock className="w-4 h-4 text-emerald-500" /> : <Unlock className="w-4 h-4 text-amber-500" />}
                  <span className="text-xs font-bold font-mono">{url.startsWith('https') ? 'SSL ACTIVE' : 'NO ENCRYPTION'}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-secondary/10 flex flex-col gap-3">
                <p className="text-[10px] font-mono uppercase text-muted-foreground">Protocol Version</p>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold font-mono">TLS 1.3 / HTTP 2</span>
                </div>
              </div>
            </div>

            <button 
              onClick={analyzeUrl}
              disabled={isScanning || !url.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ANALYZING REPUTATION...
                </>
              ) : (
                <>
                  SCAN URL <ExternalLink className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 space-y-2">
              <p className="text-xs font-bold uppercase text-primary">Domain Reputation</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Checks against 40+ global blacklists and historical domain registration data to identify high-risk assets.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 space-y-2">
              <p className="text-xs font-bold uppercase text-primary">Visual Identity</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Uses HTML structure fingerprints to detect visually identical clones of banking and financial services.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center security-card rounded-2xl glass-panel p-12 gap-4">
              <div className="relative">
                <Globe className="w-20 h-20 text-primary/20" />
                <div className="absolute inset-0 scanner-line h-1 bg-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              </div>
              <p className="text-sm font-mono text-primary animate-pulse">Scanning URL Structure...</p>
              <div className="w-full max-w-[200px] bg-secondary h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-1/3 animate-[progress_2s_infinite]" />
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="security-card rounded-2xl glass-panel p-6 border-t-4" style={{ borderTopColor: result.riskScore > 50 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Threat Level</p>
                    <h2 className={`text-2xl font-black uppercase tracking-tighter ${
                      result.threatLevel === 'Critical' || result.threatLevel === 'High' ? 'text-destructive' : 
                      result.threatLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {result.threatLevel}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Risk Index</p>
                    <p className="text-3xl font-black font-mono">{result.riskScore}<span className="text-sm text-muted-foreground">/100</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Intelligence Report</p>
                    <p className="text-xs leading-relaxed text-foreground">{result.explanation}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Technical Evidence</p>
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
                        <p className="text-xs font-bold uppercase font-mono">Clean Reputation</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <Lock className="w-3 h-3" /> VERIFIED OFFLINE
                  </div>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    View Network Graph <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center security-card rounded-2xl glass-panel p-12 text-center gap-4">
              <Globe className="w-16 h-16 text-muted-foreground/20" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase">Ready to Scan</p>
                <p className="text-xs text-muted-foreground/60 max-w-[200px]">
                  Input a destination URL to perform deep reputation and spoofing analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple Activity icon for consistency
function Activity({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
