import { FeedPost } from '../types';

/**
 * 피드 단건 주소: /feed/{번호}
 * - 게시물 id "post-2" → "/feed/2" (앞의 "post-"를 뗀 값을 주소에 사용)
 * - 링크 복사 시 현재 도메인 기준 전체 주소 (예: https://horohoro.com/feed/2)
 */
export const feedPostPath = (postId: string) => `/feed/${postId.replace(/^post-/, '')}`;

export const feedPostUrl = (postId: string) => `${window.location.origin}${feedPostPath(postId)}`;

/** 현재 주소가 /feed/{번호} 이면 해당 게시물 id, 아니면 null */
export const feedPostIdFromPath = (pathname: string, posts: FeedPost[]): string | null => {
  const match = pathname.match(/^\/feed\/([^/]+)\/?$/);
  if (!match) return null;
  const postId = `post-${decodeURIComponent(match[1])}`;
  return posts.some((p) => p.id === postId) ? postId : null;
};

/** 클립보드 복사 (Clipboard API 미지원 브라우저 대비) */
export const copyText = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // 아래 대체 방식으로 진행
  }
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};
