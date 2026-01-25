"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ThumbsUp, Star, ArrowLeft, Users, Check, Briefcase, MessageSquare, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PostDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { postId } = params;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'likes' | 'interested' | 'team'>((['likes', 'interested', 'team'].includes(searchParams.get('tab') as string) ? searchParams.get('tab') as 'likes' | 'interested' | 'team' : 'likes'));
  const [commentText, setCommentText] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/auth/ProjectOrResearch/${postId}`);
          if (res.ok) {
            const data = await res.json();
            setPost(data.data);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    if (params.username) {
      fetch(`/api/profile?userid=${params.username}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then(data => {
          if (data.success && data.data) {
            setAuthorProfile(data.data);
            if (session?.user?.email && data.data.user?.email === session.user.email) {
              setIsOwner(true);
            }
          }
        })
        .catch(err => console.error("Failed to fetch profile", err));
    }
  }, [params.username, session]);

  useEffect(() => {
    if (post) {
      const usernames = [
        ...(post.likes || []),
        ...(post.interested || []),
        ...(post.teamMembers || []),
        ...(post.comments?.map((c: any) => c.username) || [])
      ];
      const uniqueUsernames = Array.from(new Set(usernames)).filter(u => typeof u === 'string');
      
      if (uniqueUsernames.length > 0) {
        fetch('/api/users/lookup', {
          method: 'POST',
          body: JSON.stringify({ usernames: uniqueUsernames }),
        })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch users');
          return res.json();
        })
        .then(data => {
          if (data.users) {
            const map: Record<string, any> = {};
            data.users.forEach((u: any) => { map[u.username] = u; });
            setUsersMap(prev => ({ ...prev, ...map }));
          }
        })
        .catch(err => console.error("Failed to fetch users", err));
      }
    }
  }, [post]);

  const handleApprove = async (targetUser: string) => {
    if (!post) return;
    try {
      const res = await fetch('/api/auth/ProjectOrResearch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: post._id, 
          action: 'approve', 
          targetUser 
        }),
      });
      
      if (res.ok) {
        setPost((prev: any) => ({
          ...prev,
          interested: prev.interested.filter((u: string) => u !== targetUser),
          teamMembers: [...(prev.teamMembers || []), targetUser]
        }));
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !session?.user?.username) return;

    try {
      const res = await fetch('/api/auth/ProjectOrResearch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          action: 'comment',
          username: session.user.username,
          text: commentText
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPost(data.data);
        setCommentText('');
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/auth/ProjectOrResearch?postId=${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push(`/user/${params.username}`);
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response", e);
        }
        alert(`Failed to delete post: ${errorMessage}`);
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert('An error occurred while deleting the post.');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex flex-col justify-center items-center gap-4">
        <p className="text-xl">Post not found</p>
        <button onClick={() => router.back()} className="text-indigo-400 hover:underline">Go back</button>
      </div>
    );
  }

  const author = post.userId || {};

  return (
    <div className="bg-linear-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#252525] min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Author & Engagement */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 lg:self-start">
            {/* Author Card */}
            <div className="bg-[#2b2b2b] rounded-2xl p-6 border border-zinc-700/50 shadow-lg">
              <div className="flex items-start gap-4">
                <Link href={`/user/${author.username}`}>
                  <img
                    className="w-16 h-16 rounded-full object-cover cursor-pointer ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 transition-all"
                    src={authorProfile?.profilePicture || author.profileImage || "/user.png"}
                    alt={authorProfile?.user?.fullName || author.fullName}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col mb-1">
                    <Link href={`/user/${author.username}`} className="hover:underline">
                      <h2 className="font-bold text-white text-xl truncate">{authorProfile?.user?.fullName || author.fullName || "Unknown User"}</h2>
                    </Link>
                    {author.username && <span className="text-sm text-zinc-500 truncate">@{author.username}</span>}
                  </div>
                  <p className="text-zinc-400 text-sm mb-2 line-clamp-2">{authorProfile?.headline || author.headline}</p>
                  <p className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Engagement Section */}
            <div className="bg-[#2b2b2b] rounded-2xl p-6 border border-zinc-700/50 shadow-lg">
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('likes')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'likes'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ThumbsUp size={20} className={activeTab === 'likes' ? 'fill-current' : ''} />
                    <span className="font-medium">Likes</span>
                  </div>
                  <span className="font-bold">{post.likes?.length || 0}</span>
                </button>
                <button
                  onClick={() => setActiveTab('interested')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'interested'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star size={20} className={activeTab === 'interested' ? 'fill-current' : ''} />
                    <span className="font-medium">Interested</span>
                  </div>
                  <span className="font-bold">{post.interested?.length || 0}</span>
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'team'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase size={20} className={activeTab === 'team' ? 'fill-current' : ''} />
                    <span className="font-medium">Team</span>
                  </div>
                  <span className="font-bold">{post.teamMembers?.length || 0}</span>
                </button>
                <button
                  onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent bg-zinc-800/30"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} />
                    <span className="font-medium">Comments</span>
                  </div>
                  <span className="font-bold">{post.comments?.length || 0}</span>
                </button>
              </div>

              <div className="border-t border-zinc-700/50 pt-6">
                <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                  {activeTab === 'likes' && 'Liked by'}
                  {activeTab === 'interested' && 'Interested'}
                  {activeTab === 'team' && 'Team Members'}
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeTab === 'likes' && post.likes?.map((user: string, i: number) => (
                    <UserListItem key={i} user={user} userDetails={usersMap[user]} />
                  ))}
                  {activeTab === 'interested' && post.interested?.map((user: string, i: number) => (
                    <UserListItem key={i} user={user} userDetails={usersMap[user]} onApprove={isOwner ? () => handleApprove(user) : undefined} />
                  ))}
                  {activeTab === 'team' && post.teamMembers?.map((user: string, i: number) => (
                    <UserListItem key={i} user={user} userDetails={usersMap[user]} />
                  ))}

                  {activeTab === 'likes' && (!post.likes || post.likes.length === 0) && (
                    <p className="text-zinc-500 text-center py-4 text-sm">No likes yet.</p>
                  )}
                  {activeTab === 'interested' && (!post.interested || post.interested.length === 0) && (
                    <p className="text-zinc-500 text-center py-4 text-sm">No one interested yet.</p>
                  )}
                  {activeTab === 'team' && (!post.teamMembers || post.teamMembers.length === 0) && (
                    <p className="text-zinc-500 text-center py-4 text-sm">No team members yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-[#2b2b2b] rounded-2xl p-8 border border-zinc-700/50 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  {post.topic}
                </h1>
                {isOwner && (
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-600/30"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-8">
                <p className="text-zinc-200 whitespace-pre-wrap text-lg leading-relaxed mb-8">
                  {post.description}
                </p>

                {post.coverImage && (
                  <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-700/50 shadow-2xl">
                    <img
                      src={post.coverImage}
                      alt={post.topic}
                      className="w-full h-auto object-contain max-h-80"
                    />
                  </div>
                )}

                {post.link && (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-sm text-zinc-400 mb-2">Related Link:</p>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline break-all text-lg"
                    >
                      {post.link}
                    </a>
                  </div>
                )}

                <div id="comments-section" className="mt-8 border-t border-zinc-700/50 pt-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <MessageSquare size={24} /> Comments ({post.comments?.length || 0})
                  </h3>
                  
                  <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-4">
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px] resize-y"
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          type="submit" 
                          disabled={!commentText.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                        >
                          <Send size={16} /> Post Comment
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {post.comments?.slice().reverse().map((comment: any, i: number) => (
                      <CommentItem key={i} comment={comment} userDetails={usersMap[comment.username]} />
                    ))}
                    {(!post.comments || post.comments.length === 0) && (
                      <p className="text-zinc-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

const UserListItem = ({ user, userDetails, onApprove }: { user: string, userDetails?: any, onApprove?: () => void }) => {
  const displayName = userDetails?.fullName || userDetails?.username || user;
  const profileLink = `/user/${userDetails?.username || user}`;
  const avatar = userDetails?.profileImage;

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600/70 hover:bg-zinc-800/70 transition-all duration-200 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Link href={profileLink}>
          {avatar ? (
            <img src={avatar} alt={displayName} className="w-12 h-12 rounded-full object-cover ring-1 ring-zinc-600/50" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 ring-1 ring-zinc-600/50">
              <Users size={20} />
            </div>
          )}
        </Link>
        <div className="overflow-hidden">
          <Link href={profileLink} className="hover:underline">
            <p className="text-white font-medium truncate">{displayName}</p>
          </Link>
        </div>
      </div>
      {onApprove && (
        <button onClick={onApprove} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors border border-green-600/30">
          <Check size={16} /> Approve
        </button>
      )}
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; isDeleting: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-md border border-zinc-700 shadow-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">Delete Post?</h3>
        <p className="text-zinc-400 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={isDeleting} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            {isDeleting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, userDetails }: { comment: any, userDetails?: any }) => {
  const displayName = userDetails?.fullName || userDetails?.username || comment.username;
  const profileLink = `/user/${userDetails?.username || comment.username}`;
  const avatar = userDetails?.profileImage;

  return (
    <div className="flex gap-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
      <Link href={profileLink} className="shrink-0">
        {avatar ? (
          <img src={avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-600/50" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 ring-1 ring-zinc-600/50">
            <Users size={14} />
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
            <Link href={profileLink} className="hover:underline">
                <p className="text-white text-sm font-bold truncate">{displayName}</p>
            </Link>
            <span className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-zinc-300 text-sm mt-0.5 break-words whitespace-pre-wrap">{comment.text}</p>
      </div>
    </div>
  );
};