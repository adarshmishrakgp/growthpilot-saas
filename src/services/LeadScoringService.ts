import { Lead, LeadScore } from '../types/lead';
import { OpenAI } from 'openai';

export class LeadScoringService {
  private static instance: LeadScoringService;
  private openai: OpenAI;

  private readonly SCORING_WEIGHTS = {
    websiteVisits: 0.25,
    contentEngagement: 0.25,
    socialMentions: 0.25,
    companyFit: 0.25
  };

  private constructor() {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY as string;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    this.openai = new OpenAI({
      apiKey
    });
  }

  public static getInstance(): LeadScoringService {
    if (!LeadScoringService.instance) {
      LeadScoringService.instance = new LeadScoringService();
    }
    return LeadScoringService.instance;
  }

  public async scoreLead(lead: Lead): Promise<LeadScore> {
    try {
      const websiteScore = await this.calculateWebsiteScore(lead);
      const contentScore = await this.calculateContentScore(lead);
      const socialScore = await this.calculateSocialScore(lead);
      const companyFitScore = await this.calculateCompanyFitScore(lead);

      const total = Math.round(
        websiteScore * this.SCORING_WEIGHTS.websiteVisits +
        contentScore * this.SCORING_WEIGHTS.contentEngagement +
        socialScore * this.SCORING_WEIGHTS.socialMentions +
        companyFitScore * this.SCORING_WEIGHTS.companyFit
      );

      return {
        total,
        websiteVisits: websiteScore,
        contentEngagement: contentScore,
        socialMentions: socialScore,
        companyFit: companyFitScore
      };
    } catch (error) {
      console.error('Error scoring lead:', error);
      throw new Error('Failed to score lead');
    }
  }

  private async calculateWebsiteScore(lead: Lead): Promise<number> {
    if (!lead.enrichment.engagement?.websiteVisits) return 0;

    const {
      count,
      averageDuration,
      pagesViewed
    } = lead.enrichment.engagement.websiteVisits;

    // Base score from visit count
    let score = Math.min(count * 10, 40);

    // Bonus for longer visits
    if (averageDuration > 180) score += 20; // >3 minutes
    else if (averageDuration > 60) score += 10; // >1 minute

    // Bonus for viewing key pages
    const keyPages = ['pricing', 'enterprise', 'demo', 'compliance'];
    const keyPagesViewed = pagesViewed.filter(page =>
      keyPages.some(key => page.toLowerCase().includes(key))
    ).length;
    score += keyPagesViewed * 10;

    return Math.min(score, 100);
  }

  private async calculateContentScore(lead: Lead): Promise<number> {
    if (!lead.enrichment.engagement) return 0;

    let score = 0;

    // Score email interactions
    const { emailInteractions } = lead.enrichment.engagement;
    if (emailInteractions) {
      score += emailInteractions.opens * 5;
      score += emailInteractions.clicks * 10;
      score += emailInteractions.replies * 20;
    }

    // Score content downloads
    const { contentDownloads } = lead.enrichment.engagement;
    if (contentDownloads) {
      const weightedContent: { [key: string]: number } = {
        whitepaper: 15,
        casestudy: 20,
        demo: 25,
        pricing: 30
      };

      contentDownloads.forEach(download => {
        const type = download.type.toLowerCase();
        score += weightedContent[type] || 10;
      });
    }

    // Score event participation
    const { eventParticipation } = lead.enrichment.engagement;
    if (eventParticipation) {
      const weightedEvents: { [key: string]: number } = {
        webinar: 15,
        conference: 25,
        workshop: 30,
        demo: 35
      };

      eventParticipation.forEach(event => {
        const type = event.type.toLowerCase();
        score += weightedEvents[type] || 10;
      });
    }

    return Math.min(score, 100);
  }

  private async calculateSocialScore(lead: Lead): Promise<number> {
    if (!lead.enrichment.intent) return 0;

    let score = 0;
    const recentIntents = lead.enrichment.intent;

    // Score based on intent signals
    recentIntents.forEach(intent => {
      // Weight by recency
      const daysSinceIntent = Math.floor(
        (Date.now() - new Date(intent.lastMentionDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const recencyWeight = Math.max(0.5, 1 - daysSinceIntent / 30); // Decay over 30 days

      // Weight by sentiment
      const sentimentWeight =
        intent.sentiment === 'positive' ? 1.2 :
        intent.sentiment === 'neutral' ? 1 :
        0.8;

      // Weight by keyword relevance
      const relevantKeywords = [
        'compliance',
        'automation',
        'regtech',
        'audit',
        'risk'
      ];
      const keywordMatches = intent.keywords.filter(keyword =>
        relevantKeywords.some(relevant =>
          keyword.toLowerCase().includes(relevant)
        )
      ).length;

      score += keywordMatches * 10 * recencyWeight * sentimentWeight;
    });

    // Analyze social profiles
    if (lead.enrichment.social) {
      if (lead.enrichment.social.linkedin) score += 10;
      if (lead.enrichment.social.twitter) score += 5;
      if (lead.enrichment.social.github) score += 5;
    }

    return Math.min(score, 100);
  }

  private async calculateCompanyFitScore(lead: Lead): Promise<number> {
    const company = lead.enrichment.company;
    let score = 0;

    // Industry fit
    if (company.industry?.toLowerCase().includes('fintech')) {
      score += 30;
    } else if (company.industry?.toLowerCase().includes('financial')) {
      score += 20;
    }

    // Company size fit
    const sizeScore: { [key: string]: number } = {
      '1-10': 5,
      '11-50': 15,
      '51-200': 25,
      '201-500': 30,
      '501-1000': 25,
      '1001+': 20
    };
    score += sizeScore[company.size] || 10;

    // Funding stage fit
    const fundingScore: { [key: string]: number } = {
      'Pre-seed': 5,
      'Seed': 10,
      'Series A': 20,
      'Series B': 25,
      'Series C': 20,
      'Series D+': 15
    };
    score += fundingScore[company.funding] || 10;

    // Tech stack fit
    if (company.techStack) {
      const relevantTech = [
        'kubernetes',
        'docker',
        'aws',
        'azure',
        'gcp',
        'microservices'
      ];
      const techMatches = company.techStack.filter((tech: string) =>
        relevantTech.some(relevant =>
          tech.toLowerCase().includes(relevant)
        )
      ).length;
      score += techMatches * 5;
    }

    // Revenue fit
    if (company.revenue) {
      const revenueScore: { [key: string]: number } = {
        '<1M': 5,
        '1M-5M': 15,
        '5M-20M': 25,
        '20M-50M': 30,
        '50M+': 20
      };
      score += revenueScore[company.revenue] || 10;
    }

    return Math.min(score, 100);
  }

  public async analyzeLeadIntent(lead: Lead): Promise<string> {
    try {
      const context = this.buildLeadContext(lead);
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Analyze the lead's buying intent based on their engagement and behavior patterns."
          },
          {
            role: "user",
            content: `Analyze the buying intent for this lead:\n${context}\n\nProvide a concise summary of their likely interest level and readiness to buy.`
          }
        ],
        temperature: 0.7
      });

      if (!completion.choices[0].message.content) throw new Error('No content received from OpenAI');
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing lead intent:', error);
      throw new Error('Failed to analyze lead intent');
    }
  }

  private buildLeadContext(lead: Lead): string {
    const engagement = lead.enrichment.engagement;
    const intent = lead.enrichment.intent;

    return `
      Lead Profile:
      - Company: ${lead.enrichment.company.name}
      - Industry: ${lead.enrichment.company.industry}
      - Size: ${lead.enrichment.company.size}
      - Funding: ${lead.enrichment.company.funding}
      
      Engagement:
      - Website Visits: ${engagement?.websiteVisits.count || 0}
      - Content Downloads: ${engagement?.contentDownloads.length || 0}
      - Email Opens: ${engagement?.emailInteractions.opens || 0}
      - Email Replies: ${engagement?.emailInteractions.replies || 0}
      
      Intent Signals:
      ${intent?.map(i => `- ${i.keywords.join(', ')} (${i.sentiment})`).join('\n') || 'No intent signals'}
      
      Tech Stack:
      ${lead.enrichment.company.techStack?.join(', ') || 'Unknown'}
    `;
  }

  public determineNextBestAction(lead: Lead): string {
    const score = lead.score.total;
    const segment = lead.segment;
    const lastAction = lead.lastAction;

    if (score >= 80) {
      if (!lastAction) {
        return 'Schedule AI call';
      } else if (lastAction.type === 'call' && lastAction.status === 'completed') {
        return 'Send personalized follow-up email';
      }
      return 'Send WhatsApp message';
    }

    if (score >= 60) {
      if (!lastAction) {
        return 'Send personalized email';
      } else if (lastAction.type === 'email' && lastAction.status === 'completed') {
        return 'Schedule AI call';
      }
      return 'Send educational content';
    }

    return 'Monitor for more engagement';
  }
}

export default LeadScoringService.getInstance(); 