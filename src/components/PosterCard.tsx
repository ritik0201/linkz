// src/components/PosterCard.tsx
import React, { useState } from 'react';
import { MessageSquare, Send, Users, ThumbsUp, Star, Share2, MoreHorizontal, Trash2, Flag, Eye } from 'lucide-react';
import Link from 'next/link';

interface PosterCardProps {
  post: any;
  commentText: string;
  setCommentText: (text: string) => void;
  handleCommentSubmit: (e: React.FormEvent) => void;
  usersMap: Record<string, any>;
  onLike: () => void;
  onInterested: () => void;
  currentUser: any;
  onDelete?: () => void;
}

const CommentItem = ({ comment, userDetails }: { comment: any, userDetails?: any }) => {
  const displayName = userDetails?.fullName || userDetails?.username || comment.username;
  const profileLink = `/user/${userDetails?.username || comment.username}`;
  const avatar = userDetails?.profileImage || userDetails?.profilePicture || userDetails?.image || userDetails?.avatar;

  return (
    <div className="flex gap-3">
      <Link href={profileLink} className="shrink-0">
        {avatar ? (
          <img src={avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-600/50" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 ring-1 ring-zinc-600/50">
            <Users size={14} />
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0 bg-zinc-800/30 rounded-2xl px-4 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <Link href={profileLink} className="hover:underline">
            <p className="text-white text-xs font-bold truncate">{displayName}</p>
          </Link>
          <span className="text-[10px] text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-zinc-300 text-xs mt-0.5 break-word whitespace-pre-wrap">{comment.text}</p>
      </div>
    </div>
  );
};

export default function PosterCard({ post, commentText, setCommentText, handleCommentSubmit, usersMap, onLike, onInterested, currentUser, onDelete }: PosterCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  // Combine author info from both post.userId and post.author for robustness
  const authorInfo = {
    ...(post.author || {}),
    ...(typeof post.userId === 'object' && post.userId ? post.userId : {}),
    ...(typeof post.user === 'object' && post.user ? post.user : {})
  };
  const authorName = authorInfo.fullName || authorInfo.name || "Unknown User";
  const authorUsername = authorInfo.username || "unknown";
  const authorAvatar = authorInfo.profileImage || authorInfo.profilePicture || authorInfo.avatar || authorInfo.image || "/user.png";
  const authorHeadline = authorInfo.headline || "";
  const timestamp = new Date(post.createdAt || Date.now()).toLocaleDateString();

  const isLiked = post.likes?.includes(currentUser?.username) || post.likes?.includes(currentUser?._id);
  const isInterested = post.interested?.includes(currentUser?.username) || post.interested?.includes(currentUser?._id);
  const isOwner = currentUser?.username === authorUsername || currentUser?._id === authorInfo._id;

  const handleShare = async () => {
    const postId = post._id || post.id;
    const isStartup = authorInfo.role === 'startup';
    const url = `${window.location.origin}${isStartup ? `/startup/${postId}` : `/user/post/${postId}`}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.topic || 'Check out this post',
          text: post.description || post.content,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
      }).catch((err) => {
        console.error("Failed to copy link:", err);
      });
    }
  };

  return (
    <div className="bg-[#2b2b2b] rounded-2xl p-6 border border-zinc-700/50 shadow-lg mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Link href={`/user/${authorUsername}`}>
            <img
              className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-zinc-700/50"
              src={authorAvatar}
              alt={authorName}
            />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/user/${authorUsername}`} className="hover:underline">
                <p className="font-bold text-white text-base">{authorName}</p>
              </Link>
              <span className="text-xs text-zinc-500">@{authorUsername}</span>
            </div>
            {authorHeadline && <p className="text-sm text-zinc-400 line-clamp-1">{authorHeadline}</p>}
            <p className="text-xs text-zinc-500 mt-0.5">{timestamp}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-zinc-400 hover:text-white p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-zinc-700 rounded-xl shadow-xl z-10 overflow-hidden">
              <Link
                href={`/user/${authorUsername}/post/${post._id || post.id}`}
                className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
              >
                <Eye size={16} /> View Detail
              </Link>
              {isOwner && onDelete ? (
                <button
                  onClick={() => { onDelete(); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete Post
                </button>
              ) : (
                <button
                  className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Flag size={16} /> Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {post.topic && <h3 className="text-lg font-bold text-white mb-2">{post.topic}</h3>}
        <p className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">
          {post.description || post.content}
        </p>
      </div>

      {/* Image */}
      {post.coverImage && (
        <div className="mb-4 rounded-xl overflow-hidden border border-zinc-700/50">
          <img
            src={post.coverImage}
            alt={post.topic || "Post content"}
            className="w-full h-auto object-cover max-h-screen"
          />
        </div>
      )}

      {/* Link */}
      {post.link && (
        <div className="mb-4 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-sm break-all flex items-center gap-2">
            <Share2 size={14} />
            {post.link}
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-zinc-400 text-sm mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <ThumbsUp size={14} className="text-green-500" />
          <span>{post.likes?.length || 0}</span>
        </div>
        {post.interested && post.interested.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-yellow-500" />
            <span>{post.interested.length} interested</span>
          </div>
        )}
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-zinc-700/50 flex flex-wrap gap-1 mb-4">
        <button
          onClick={onLike}
          className={`flex-1 min-w-[70px] flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-1 md:px-3 rounded-lg transition-colors justify-center font-medium text-[10px] sm:text-xs md:text-sm ${isLiked ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300 hover:bg-zinc-800'}`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 md:w-[18px] md:h-[18px] ${isLiked ? 'fill-current' : ''}`} /> Like
        </button>
        <button
          onClick={onInterested}
          className={`flex-1 min-w-[85px] flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-1 md:px-3 rounded-lg transition-colors justify-center font-medium text-[10px] sm:text-xs md:text-sm ${isInterested ? 'text-yellow-400 bg-yellow-500/10' : 'text-zinc-300 hover:bg-zinc-800'}`}
        >
          <Star className={`w-3.5 h-3.5 md:w-[18px] md:h-[18px] ${isInterested ? 'fill-current' : ''}`} /> Interested
        </button>
        <button
          onClick={() => {
            setShowComments(!showComments);
            setTimeout(() => {
              document.getElementById(`comment-input-${post._id || post.id}`)?.focus();
            }, 100);
          }}
          className={`flex-1 min-w-[85px] flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-1 md:px-3 rounded-lg transition-colors justify-center font-medium text-[10px] sm:text-xs md:text-sm ${showComments ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-300 hover:bg-zinc-800'}`}
        >
          <MessageSquare className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> Comment
        </button>
        <button
          onClick={handleShare}
          className="flex-1 min-w-[70px] flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-1 md:px-3 rounded-lg transition-colors justify-center text-zinc-300 hover:bg-zinc-800 font-medium text-[10px] sm:text-xs md:text-sm"
        >
          <Share2 className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div id="comments-section" className="border-t border-zinc-700/50 pt-4">
          <form onSubmit={(e) => {
            handleCommentSubmit(e);
          }} className="mb-6 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
              <Users size={14} className="text-zinc-400" />
            </div>
            <div className="flex-1 relative">
              <input
                id={`comment-input-${post._id || post.id}`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full pl-4 pr-10 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-4 pl-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {post.comments?.length > 0 ? (
              post.comments.slice().reverse().map((comment: any, i: number) => (
                <CommentItem key={i} comment={comment} userDetails={usersMap[comment.username]} />
              ))
            ) : (
              <p className="text-center text-zinc-500 text-xs py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}