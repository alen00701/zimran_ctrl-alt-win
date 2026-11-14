/**
 * Feed-side trust boundary. Server-side publishing must enforce the same
 * rules before a post is inserted into the catalogue or returned by an API.
 */
export type PublisherRole = 'owner' | 'editor' | 'ai-assistant';

export interface VerifiedPublisher {
  id: string;
  name: string;
  handle: string;
  kind: 'club' | 'league' | 'governing-body' | 'newsroom';
  allowedDomains: readonly string[];
}

export interface PublisherSubmission {
  publisherId: string;
  actorRole: PublisherRole;
  sourceUrl: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export const verifiedPublishers: readonly VerifiedPublisher[] = [
  { id: 'inter-miami', name: 'Inter Miami CF', handle: '@intermiamicf', kind: 'club', allowedDomains: ['intermiamicf.com', 'youtube.com'] },
  { id: 'uefa', name: 'UEFA', handle: '@uefa', kind: 'governing-body', allowedDomains: ['uefa.com', 'youtube.com'] },
  { id: 'us-soccer', name: 'U.S. Soccer', handle: '@ussoccer', kind: 'governing-body', allowedDomains: ['ussoccer.com', 'youtube.com'] },
  { id: 'fifa', name: 'FIFA', handle: '@fifa', kind: 'governing-body', allowedDomains: ['fifa.com', 'youtube.com'] },
  { id: 'mls', name: 'MLS', handle: '@mls', kind: 'league', allowedDomains: ['mlssoccer.com'] },
];

function hostFor(sourceUrl: string) {
  try { return new URL(sourceUrl).hostname.replace(/^www\./, '').toLowerCase(); } catch { return undefined; }
}

function hostMatches(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

export function publisherForName(name: string) {
  return verifiedPublishers.find(publisher => publisher.name === name);
}

/** AI can prepare metadata, but only a verified publisher owner/editor can submit. */
export function canSubmitForReview(submission: PublisherSubmission) {
  const publisher = verifiedPublishers.find(candidate => candidate.id === submission.publisherId);
  const host = hostFor(submission.sourceUrl);
  return Boolean(
    publisher &&
    submission.actorRole !== 'ai-assistant' &&
    host &&
    publisher.allowedDomains.some(domain => hostMatches(host, domain)) &&
    submission.title.trim() &&
    submission.summary.trim() &&
    !Number.isNaN(Date.parse(submission.publishedAt)),
  );
}

/** Existing and API-delivered cards need a trusted publisher and a source it controls. */
export function isVerifiedPublisherPost(post: Pick<PublisherSubmission, 'sourceUrl'> & { publisher: string }) {
  const publisher = publisherForName(post.publisher);
  const host = hostFor(post.sourceUrl);
  return Boolean(publisher && host && publisher.allowedDomains.some(domain => hostMatches(host, domain)));
}
