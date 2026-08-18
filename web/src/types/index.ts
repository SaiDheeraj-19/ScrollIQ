export interface BehaviorSignals {
  watchPercent?: number | null;
  liked?: boolean | null;
  saved?: boolean | null;
  shared?: boolean | null;
  rewatched?: boolean | null;
  skipped?: boolean | null;
}

export interface Creator {
  id?: string;
  name?: string;
}

export interface UnifiedInteraction {
  id: string;
  source: "instagram" | "youtube" | "demo" | "scrolliq";
  contentType: "reel" | "short" | "video";
  contentId: string;
  title: string;
  description?: string;
  transcript?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  channel?: string;
  creator?: Creator;
  publishedAt?: string;
  interactedAt?: string;
  behavior: BehaviorSignals;
  category?: string;
}

export interface Evidence {
  content_id: string;
  surface_topic: string;
  semantic_connection: string;
  observed_signal: string;
  strength: number;
}

export interface Interest {
  name: string;
  score: number;
  evidence: Evidence[];
}

export interface AlternativeInterpretation {
  interest: string;
  confidence: string;
  reason: string;
}

export interface AnalyzedContent {
  id: string;
  topic: string;
  broaderDomain: string;
  context: string;
  apparentIntent: string;
  technicalLevel: string;
  educationalValue: number;
  hypeScore: number;
  semanticTags: string[];
}

export interface PrimaryInterest {
  name: string;
  confidence: string;
  score: number;
}

export interface UserGoal {
  goal: string;
  goal_description: string;
  goal_categories: string[];
}

export interface GoalAlignment {
  score: number;
  label: string;
  reason: string;
  mismatch_detected: boolean;
}

export interface KnowledgeGap {
  topic: string;
  reason: string;
}

export interface GoalMilestone {
  topic: string;
  status: "Observed" | "Exploring" | "Learning" | "Next" | "Future";
}

export interface InterestProfile {
  primaryInterest: PrimaryInterest;
  supportingInterests: Interest[];
  evidence: Evidence[];
  surface_topics: string[];
  contradicting_signals: string[];
  confidence_label: string;
  reasoning: string;
  alternativeInterpretations: AlternativeInterpretation[];
  analyzedContent?: Record<string, AnalyzedContent>;
  goal_alignment?: GoalAlignment;
}

export interface ScoreBreakdown {
  interest_match: number;
  goal_alignment: number;
  latent_interest_match: number;
  context_match: number;
  educational_value: number;
  novelty: number;
  difficulty_fit: number;
  format_diversity: number;
  hype_score: number;
  hype_penalty: number;
  final_score: number;
}

export interface RejectedAlternative {
  title: string;
  reason: string;
}

export interface RecommendedArticle {
  title: string;
  url: string;
  content: string;
}

export interface RecommendationResponse {
  currentReel: string;
  currentReelTitle?: string;
  interestDetected: string;
  why: string;
  why_evidence: string[];
  recommendedTechReel: string;
  category: string;
  whyRecommendation: string;
  difficulty: string;
  confidence: string;
  // Goal
  user_goal?: UserGoal;
  goal_alignment?: GoalAlignment;
  knowledge_gap?: KnowledgeGap;
  goal_progress?: GoalMilestone[];
  recommendation_direction?: string;
  // Anti-hype
  antiHypeFilterApplied: boolean;
  rejectedCandidates: string[];
  whyNot?: string;
  rejected_alternative?: RejectedAlternative;
  // Candidate details
  candidateId: string;
  videoId?: string;
  channel?: string;
  videoUrl?: string;
  // Score breakdown
  score_breakdown?: ScoreBreakdown;
  surface_topics: string[];
  // Baseline
  baseline?: RecommendationResponse;
  // Deep Dive Article
  recommendedArticle?: RecommendedArticle;
}
